import { ponder } from "@/generated";
import { getAddress } from "viem";
import { BufferRouter } from "../abis/BufferRouter";
import { RouterAddress, State } from "./config";

ponder.on("RouterContract:InitiateTrade", async ({ context, event }) => {
  console.log("InitiateTrade");
  const { args } = event;
  const routerAddress = getAddress(event.log.address);
  const { queueId, account, queuedTime, tournamentId } = args;

  if (routerAddress == RouterAddress) {
    const queuedTradeData = await context.client.readContract({
      abi: BufferRouter,
      address: RouterAddress,
      functionName: "queuedTrades",
      args: [queueId],
    });
    const optionContractAddress = getAddress(queuedTradeData[6]);
    await context.db.QueuedOptionData.create({
      id: queueId.toString() + optionContractAddress,
      data: {
        optionContractId: optionContractAddress,
        state: State.queued,
        strike: queuedTradeData[7],
        user: account,
        isAbove: queuedTradeData[5],
        queueID: queueId,
        slippage: queuedTradeData[8],
        // expirationTime: BigInt(queuedTradeData[2]),
        queueTimestamp: queuedTime,
        totalFee: queuedTradeData[3],
        tournamentId: tournamentId,
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
  const routerAddress = getAddress(event.log.address);

  const { queueId, optionId, account, tournamentId } = args;
  const queuedTradeData = await context.client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "queuedTrades",
    args: [queueId],
  });
  const optionContractAddress = getAddress(queuedTradeData[6]);
  if (routerAddress == RouterAddress) {
    const QueuedOptionDataEntity = await context.db.QueuedOptionData.update({
      id: queueId.toString() + optionContractAddress,
      data: ({ current }) => ({
        state: State.opened,
        processTime: event.block.timestamp,
        lag: event.block.timestamp - BigInt(current.queueTimestamp),
      }),
    });

    await context.db.UserOptionData.update({
      id: optionId.toString() + optionContractAddress,
      data: {
        queueID: queueId,
        queuedTimestamp: QueuedOptionDataEntity.queueTimestamp,
        lag:
          event.block.timestamp - BigInt(QueuedOptionDataEntity.queueTimestamp),
      },
    });
  }
});

ponder.on("RouterContract:CancelTrade", async ({ context, event }) => {
  console.log("CancelTrade");
  const { args } = event;
  const routerAddress = getAddress(event.log.address);
  const { queueId, reason, account, tournamentId } = args;

  if (routerAddress == RouterAddress) {
    const queuedTradeData = await context.client.readContract({
      abi: BufferRouter,
      address: RouterAddress,
      functionName: "queuedTrades",
      args: [queueId],
    });
    const optionContractAddress = getAddress(queuedTradeData[6]);
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
