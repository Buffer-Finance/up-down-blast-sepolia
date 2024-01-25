import { ponder } from "@/generated";
import { BufferBinaryOptions } from "../abis/BufferBinaryOption";
import { BufferRouter } from "../abis/BufferRouter";
import { RouterAddress, State } from "./config";
import { convertToUSD } from "./convertToUSD";
import { findPoolAndTokenFromPoolAddress } from "./helpers";

ponder.on(
  "BufferBinaryOptions:CreateOptionsContract",
  async ({ context, event }) => {
    const { args } = event;
    const {
      category,
      config: configContractAddress,
      pool,
      token0,
      token1,
      tokenX,
    } = args;
    const { client } = context;

    const isContractRegisteredToRouter = await client.readContract({
      abi: BufferRouter,
      address: RouterAddress,
      functionName: "contractRegistry",
      args: [event.log.address],
    });

    const { pool: poolName, token } = findPoolAndTokenFromPoolAddress(pool);

    if (isContractRegisteredToRouter) {
      // await context.db.ConfigContract.create({
      //   id: config,
      //   data: {
      //     address: event.log.address,
      //     minFee: BigInt(0),
      //     creationWindowContract: zeroAddress,
      //     circuitBreakerContract: zeroAddress,
      //     optionStorageContract: zeroAddress,
      //     platformFee: BigInt(0),
      //     sfdContract: zeroAddress,
      //     sf: BigInt(0),
      //     traderNFTContract: zeroAddress,
      //     stepSize: BigInt(0),
      //   },
      // });

      await context.db.OptionContract.create({
        id: event.log.address,
        data: {
          configId: configContractAddress,
          address: tokenX,
          token0,
          token1,
          isPaused: false,
          poolContract: pool,
          routerContract: RouterAddress,
          pool: poolName,
          asset: token0 + token1,
          openUp: BigInt(0),
          openDown: BigInt(0),
          openInterestUp: BigInt(0),
          openInterestDown: BigInt(0),
        },
      });
    }
  }
);

ponder.on("BufferBinaryOptions:Create", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { account, id, settlementFee, totalFee } = args;
  const optionContractAddress = event.log.address;

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
      const { pool, token } = findPoolAndTokenFromPoolAddress(
        optionContractEntity.poolContract
      );
      await context.db.UserOptionData.update({
        id: id + optionContractAddress,
        data: ({ current }) => ({
          state: State.active,
          totalFee: totalFee,
          totalFeeUSD: convertToUSD(totalFee, token),
          settlementFee: settlementFee,
          user: account,
          strike: optionData[1],
          expirationTime: BigInt(optionData[2]),
          creationTime: BigInt(optionData[3]),
          isAbove: optionData[4],
          amount: optionData[5],
          depositToken: token,
        }),
      });
    }
  }
});

ponder.on("BufferBinaryOptions:Expire", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { id, isAbove, premium, priceAtExpiration } = args;
  const optionContractAddress = event.log.address;

  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [optionContractAddress],
  });

  if (isContractRegisteredToRouter) {
    await context.db.UserOptionData.update({
      id: id + optionContractAddress,
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
  const { id, isAbove, account, profit, priceAtExpiration } = args;
  const optionContractAddress = event.log.address;

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
      const { pool, token } = findPoolAndTokenFromPoolAddress(
        optionContractEntity.poolContract
      );
      await context.db.UserOptionData.update({
        id: id + optionContractAddress,
        data: ({ current }) => ({
          state: State.exercised,
          expirationPrice: priceAtExpiration,
          payout: profit,
          payoutUSD: convertToUSD(profit, token),
        }),
      });
    }
  }
});

ponder.on("BufferBinaryOptions:Pause", async ({ context, event }) => {
  const { args } = event;
  const { isPaused } = args;

  await context.db.OptionContract.update({
    id: event.log.address,
    data: {
      isPaused,
    },
  });
});
