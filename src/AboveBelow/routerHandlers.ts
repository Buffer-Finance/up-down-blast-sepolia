import { ponder } from "@/generated";
import { getAddress, zeroAddress } from "viem";
import { Router as AboveBelowRouter } from "../../abis/AboveBelow/Router";
import { Above_Below_Router_Address, State } from "../config";

ponder.on("AboveBelowRouter:InitiateTrade", async ({ event, context }) => {
  const { args } = event;
  const { queueId, timestamp, user } = args;

  const routerAddress = getAddress(event.log.address);

  const queuedTradeData = await context.client.readContract({
    abi: AboveBelowRouter,
    address: routerAddress,
    functionName: "queuedTrades",
    args: [queueId],
  });

  const marketAddress = queuedTradeData[1];
  const market = await context.db.OptionContract.findUnique({
    id: marketAddress,
  });

  await context.db.QueuedOptionData.create({
    id: queueId.toString() + marketAddress,
    data: {
      optionContractId: marketAddress,
      state: State.queued,
      strike: queuedTradeData[2],
      expirationTime: BigInt(queuedTradeData[3]),
      numberOfContracts: queuedTradeData[4],
      isAbove: queuedTradeData[8],
      queueTimestamp: timestamp,
      maxFeePerContract: queuedTradeData[10],
      cancelTimestamp: 0n,
      user,
      lag: 0n,
      processTime: 0n,
      queueID: queueId,
      totalFee:
        routerAddress !== Above_Below_Router_Address ? queuedTradeData[12] : 0n,
      depositToken: market ? market.pool : "UNKNOWN",
    },
  });
});

ponder.on("AboveBelowRouter:OpenTrade", async ({ event, context }) => {
  const { args } = event;
  const { contracts, optionId, queueId, targetContract, user } = args;

  const marketAddress = getAddress(targetContract);

  const queuedOptionData = await context.db.QueuedOptionData.update({
    id: queueId.toString() + marketAddress,
    data: ({ current }) => ({
      state: State.opened,
      processTime: event.block.timestamp,
      lag: event.block.timestamp - BigInt(current.queueTimestamp),
    }),
  });

  await context.db.UserOptionData.update({
    id: optionId.toString() + marketAddress,
    data: {
      queueID: queueId,
      queuedTimestamp: queuedOptionData.queueTimestamp,
      lag: event.block.timestamp - BigInt(queuedOptionData.queueTimestamp),
    },
  });
});

ponder.on("AboveBelowRouter:CancelTrade", async ({ event, context }) => {
  const { args } = event;
  const { account, queueId, reason } = args;

  const routerAddress = getAddress(event.log.address);
  const queuedTradeData = await context.client.readContract({
    abi: AboveBelowRouter,
    address: routerAddress,
    functionName: "queuedTrades",
    args: [queueId],
  });
  const marketAddress = getAddress(queuedTradeData[1]);

  await context.db.QueuedOptionData.update({
    id: queueId.toString() + marketAddress,
    data: {
      state: State.cancelled,
      reason: reason,
      cancelTimestamp: event.block.timestamp,
    },
  });
});

ponder.on(
  "AboveBelowRouter:ContractRegistryUpdated",
  async ({ event, context }) => {
    const { args } = event;
    const { register, targetContract } = args;

    if (register === true) {
      await context.db.OptionContract.upsert({
        id: getAddress(targetContract),
        create: {
          routerContract: event.log.address,
          category: 0,
          address: getAddress(targetContract),
          configId: zeroAddress,
          isPaused: false,
          openUp: 0n,
          openDown: 0n,
          openInterestUp: 0n,
          openInterestDown: 0n,
          poolContract: zeroAddress,
          token0: "UNKNOWN",
          token1: "UNKNOWN",
          pool: "UNKNOWN",
        },
        update: {
          routerContract: getAddress(event.log.address),
        },
      });
    }
  }
);
