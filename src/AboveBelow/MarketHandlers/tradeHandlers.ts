import { ponder } from "@/generated";
import { getAddress } from "viem";
import { Market } from "../../../abis/AboveBelow/Market";
import {
  Above_Below_Router_2_Address,
  Above_Below_Router_Address,
  State,
} from "../../config";
import { convertToUSD } from "../../convertToUSD";
import { findPoolNameFromAddress } from "../helpers";

ponder.on("AboveBelowMarket:Create", async ({ event, context }) => {
  const { args } = event;
  const { account, id, marketId, settlementFee, skew, totalFee } = args;
  const marketAddress = getAddress(event.log.address);
  const market = await context.db.OptionContract.findUnique({
    id: marketAddress,
  });

  if (
    market &&
    (market.routerContract === Above_Below_Router_Address ||
      market.routerContract === Above_Below_Router_2_Address)
  ) {
    const optionData = await context.client.readContract({
      abi: Market,
      address: marketAddress,
      functionName: "options",
      args: [id],
    });

    const pool = findPoolNameFromAddress(market.poolContract);

    await context.db.UserOptionData.create({
      id: id.toString() + marketAddress,
      data: {
        state: State.active,
        totalFee,
        totalFeeUSD: convertToUSD(totalFee, pool),
        settlementFee,
        user: account,
        strike: optionData[1],
        amount: optionData[2],
        expirationTime: BigInt(optionData[5]),
        isAbove: optionData[8],
        creationTime: BigInt(optionData[7]),
        optionContractId: marketAddress,
        optionID: id,
        depositToken: pool,
        lag: 0n,
        queuedTimestamp: 0n,
      },
    });

    await context.db.Market.update({
      id: marketId + marketAddress,
      data: {
        skew,
      },
    });
  }
});

ponder.on("AboveBelowMarket:Exercise", async ({ event, context }) => {
  const { args } = event;
  const { account, id, isAbove, priceAtExpiration, profit } = args;

  const marketAddress = getAddress(event.log.address);
  const market = await context.db.OptionContract.findUnique({
    id: marketAddress,
  });

  if (
    market &&
    (market.routerContract === Above_Below_Router_Address ||
      market.routerContract === Above_Below_Router_2_Address)
  ) {
    await context.db.UserOptionData.update({
      id: id.toString() + marketAddress,
      data: {
        state: State.exercised,
        expirationPrice: priceAtExpiration,
        payout: profit,
        payoutUSD: convertToUSD(profit, market.pool),
      },
    });
  }
});

ponder.on("AboveBelowMarket:Expire", async ({ event, context }) => {
  const { args } = event;
  const { id, isAbove, premium, priceAtExpiration } = args;
  const marketAddress = getAddress(event.log.address);
  const market = await context.db.OptionContract.findUnique({
    id: marketAddress,
  });

  if (
    market &&
    (market.routerContract === Above_Below_Router_Address ||
      market.routerContract === Above_Below_Router_2_Address)
  ) {
    await context.db.UserOptionData.update({
      id: id.toString() + marketAddress,
      data: {
        state: State.expired,
        expirationPrice: priceAtExpiration,
      },
    });
  }
});
