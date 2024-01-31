import { ponder } from "@/generated";
import { BufferRouter } from "../abis/BufferRouter";
import { RouterAddress, State } from "./config";

ponder.on("RouterContract:InitiateTrade", async ({ context, event }) => {
  console.log("InitiateTrade");
  const { args } = event;
  const routerAddress = event.log.address;
  const { queueId, timestamp, user } = args;

  if (routerAddress == RouterAddress) {
    const queuedTradeData = await context.client.readContract({
      abi: BufferRouter,
      address: RouterAddress,
      functionName: "queuedTrades",
      args: [queueId],
    });
    const optionContractAddress = queuedTradeData[6];
    await context.db.QueuedOptionData.create({
      id: queueId.toString() + optionContractAddress,
      data: {
        optionContractId: optionContractAddress,
        state: State.queued,
        strike: BigInt(0),
        user: user,
        isAbove: queuedTradeData[4],
        queueID: queueId,
        expirationTime: BigInt(queuedTradeData[2]),
        queueTimestamp: BigInt(queuedTradeData[5]),
        totalFee: queuedTradeData[9],
        reason: undefined,
        cancelTimestamp: BigInt(0),
        lag: BigInt(0),
        processTime: BigInt(0),
      },
    });
  }
});

ponder.on("RouterContract:OpenTrade", async ({ context, event }) => {
  console.log("OpenTrade");
  const { args } = event;
  const routerAddress = event.log.address;

  const { queueId, optionId, targetContract, user } = args;
  if (routerAddress == RouterAddress) {
    const QueuedOptionDataEntity = await context.db.QueuedOptionData.update({
      id: queueId.toString() + targetContract,
      data: ({ current }) => ({
        state: State.opened,
        processTime: event.block.timestamp,
        lag: event.block.timestamp - BigInt(current.queueTimestamp),
      }),
    });

    await context.db.UserOptionData.create({
      id: optionId.toString() + targetContract,
      data: {
        optionContractId: targetContract,
        optionID: optionId,
        user: user,
        queueID: queueId,
        queuedTimestamp: QueuedOptionDataEntity.queueTimestamp,
        lag:
          event.block.timestamp - BigInt(QueuedOptionDataEntity.queueTimestamp),
        state: State.opened,
        amount: BigInt(0),
        totalFee: BigInt(0),
        totalFeeUSD: BigInt(0),
      },
    });
  }
});

ponder.on("RouterContract:CancelTrade", async ({ context, event }) => {
  console.log("CancelTrade");
  const { args } = event;
  const routerAddress = event.log.address;
  const { queueId, reason, account } = args;

  if (routerAddress == RouterAddress) {
    const queuedTradeData = await context.client.readContract({
      abi: BufferRouter,
      address: RouterAddress,
      functionName: "queuedTrades",
      args: [queueId],
    });
    const optionContractAddress = queuedTradeData[6];
    await context.db.QueuedOptionData.update({
      id: queueId.toString() + optionContractAddress,
      data: ({ current }) => ({
        state: State.cancelled,
        reason: reason,
        cancelTimestamp: event.block.timestamp,
      }),
    });
  }
});
