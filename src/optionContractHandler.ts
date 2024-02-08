import { ponder } from "@/generated";
import { getAddress } from "viem";
import { BufferBinaryOptions } from "../abis/BufferBinaryOption";
import { BufferRouter } from "../abis/BufferRouter";
import { RouterAddress, State } from "./config";

ponder.on("BufferBinaryOptions:CreateContract", async ({ context, event }) => {
  const { args } = event;
  const { config: configContractAddress, assetPair } = args;
  const { client } = context;

  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [getAddress(event.log.address)],
  });

  if (isContractRegisteredToRouter) {
    await context.db.OptionContract.create({
      id: getAddress(event.log.address),
      data: {
        configId: configContractAddress,
        address: getAddress(event.log.address),
        asset: assetPair,
        payoutForUp: BigInt(0),
        payoutForDown: BigInt(0),
      },
    });
  }
});

ponder.on("BufferBinaryOptions:Create", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { account, id, settlementFee, totalFee, tournamentId } = args;
  const optionContractAddress = getAddress(event.log.address);
  console.log("Create");
  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [optionContractAddress],
  });

  if (isContractRegisteredToRouter) {
    const optionData = await context.client.readContract({
      abi: BufferBinaryOptions,
      address: optionContractAddress,
      functionName: "options",
      args: [id],
    });

    const optionContractEntity = await context.db.OptionContract.findUnique({
      id: optionContractAddress,
    });
    if (optionContractEntity !== null) {
      await context.db.UserOptionData.create({
        id: id.toString() + optionContractAddress,
        data: {
          state: State.active,
          totalFee: totalFee,
          settlementFee: settlementFee,
          user: account,
          strike: optionData[1],
          expirationTime: BigInt(optionData[5]),
          creationTime: BigInt(optionData[8]),
          isAbove: optionData[6],
          amount: optionData[2],
          optionContractId: optionContractAddress,
          optionID: id,
          queuedTimestamp: BigInt(0),
          lag: BigInt(0),
          tournamentId,
        },
      });
    }
  }
});

ponder.on("BufferBinaryOptions:Expire", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { id, loss, priceAtExpiration } = args;
  const optionContractAddress = getAddress(event.log.address);

  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [optionContractAddress],
  });

  if (isContractRegisteredToRouter) {
    await context.db.UserOptionData.update({
      id: id.toString() + optionContractAddress,
      data: ({ current }) => ({
        state: State.expired,
        expirationPrice: priceAtExpiration,
      }),
    });
  }
});

ponder.on("BufferBinaryOptions:Exercise", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { id, account, profit, priceAtExpiration } = args;
  const optionContractAddress = getAddress(event.log.address);

  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [optionContractAddress],
  });

  if (isContractRegisteredToRouter) {
    const optionContractEntity = await context.db.OptionContract.findUnique({
      id: optionContractAddress,
    });
    if (optionContractEntity !== null) {
      await context.db.UserOptionData.update({
        id: id.toString() + optionContractAddress,
        data: ({ current }) => ({
          state: State.exercised,
          expirationPrice: priceAtExpiration,
          payout: profit,
        }),
      });
    }
  }
});

// ponder.on("BufferBinaryOptions:Pause", async ({ context, event }) => {
//   const { args } = event;
//   const { isPaused } = args;

//   await context.db.OptionContract.update({
//     id: getAddress(event.log.address),
//     data: {
//       isPaused,
//     },
//   });
// });
