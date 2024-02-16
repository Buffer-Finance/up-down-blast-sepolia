import { ponder } from "@/generated";
import { getAddress, zeroAddress } from "viem";
import { findPoolNameFromAddress } from "../helpers";

ponder.on(
  "AboveBelowMarket:CreateOptionsContract",
  async ({ context, event }) => {
    const { args } = event;
    const { category, config, pool, token0, token1, tokenX } = args;

    await context.db.OptionContract.upsert({
      id: getAddress(event.log.address),
      create: {
        category,
        address: getAddress(event.log.address),
        configId: getAddress(config),
        poolContract: getAddress(pool),
        token0,
        token1,
        isPaused: false,
        openUp: 0n,
        openDown: 0n,
        openInterestUp: 0n,
        openInterestDown: 0n,
        routerContract: zeroAddress,
        pool: findPoolNameFromAddress(pool),
      },
      update: {
        category,
        configId: getAddress(config),
        poolContract: getAddress(pool),
        token0,
        token1,
        isPaused: false,
        openUp: 0n,
        openDown: 0n,
        openInterestUp: 0n,
        openInterestDown: 0n,
        pool: findPoolNameFromAddress(pool),
      },
    });
  }
);

ponder.on("AboveBelowMarket:Pause", async ({ event, context }) => {
  const { args } = event;
  const { isPaused } = args;

  const market = await context.db.OptionContract.findUnique({
    id: getAddress(event.log.address),
  });
  if (market !== null) {
    await context.db.OptionContract.update({
      id: getAddress(event.log.address),
      data: {
        isPaused,
      },
    });
  }
});

ponder.on("AboveBelowMarket:CreateMarket", async ({ event, context }) => {
  const { args } = event;
  const { expiration, marketId, optionsContract, strike } = args;

  const marketAddress = getAddress(optionsContract);

  await context.db.Market.create({
    id: marketId + marketAddress,
    data: {
      expiration: BigInt(expiration),
      marketId,
      optionContractId: marketAddress,
      strike,
      skew: 0n,
    },
  });
});
