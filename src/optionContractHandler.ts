import { ponder } from "@/generated";
import { getAddress } from "viem";
import { BufferBinaryOptions } from "../abis/BufferBinaryOption";
import { BufferRouter } from "../abis/BufferRouter";
import { Period, RouterAddress, State } from "./config";
import { convertToUSD } from "./convertToUSD";
import { _getDayId, findPoolAndTokenFromPoolAddress } from "./helpers";

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
      args: [getAddress(event.log.address)],
    });

    const { pool: poolName, token } = findPoolAndTokenFromPoolAddress(pool);

    if (isContractRegisteredToRouter) {
      await context.db.OptionContract.create({
        id: getAddress(event.log.address),
        data: {
          configId: configContractAddress,
          address: getAddress(event.log.address),
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
  const optionContractAddress = getAddress(event.log.address);

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
      const userOptionDataEntity = await context.db.UserOptionData.upsert({
        id: id.toString() + optionContractAddress.toLowerCase(),
        create: {
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
          optionContractId: optionContractAddress,
          optionID: id,
          queuedTimestamp: BigInt(optionData[3]),
          lag: BigInt(0),
        },
        update: ({ current }) => ({
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
          optionContractId: optionContractAddress,
          optionID: id,
          // queuedTimestamp: BigInt(optionData[3]),
          // lag: BigInt(0),
        }),
      });

      await context.db.VolumePerContract.upsert({
        id: _getDayId(Number(event.block.timestamp)) + optionContractAddress,
        create: {
          amount: totalFee,
          optionContractId: optionContractAddress,
          period: Period.daily,
          settlementFee,
          timestamp: event.block.timestamp,
        },
        update({ current }) {
          return {
            amount: current.amount + totalFee,
            timestamp: event.block.timestamp,
            settlementFee: current.settlementFee + settlementFee,
          };
        },
      });

      await context.db.OptionContract.update({
        id: optionContractAddress,
        data({ current }) {
          if (userOptionDataEntity.isAbove) {
            return {
              openInterestUp:
                current.openInterestUp + userOptionDataEntity.totalFee,
              openUp: current.openUp + BigInt(1),
            };
          } else {
            return {
              openInterestDown:
                current.openInterestDown + userOptionDataEntity.totalFee,
              openDown: current.openDown + BigInt(1),
            };
          }
        },
      });
    }
  }
});

ponder.on("BufferBinaryOptions:Expire", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { id, isAbove, premium, priceAtExpiration } = args;
  const optionContractAddress = getAddress(event.log.address);

  const isContractRegisteredToRouter = await client.readContract({
    abi: BufferRouter,
    address: RouterAddress,
    functionName: "contractRegistry",
    args: [optionContractAddress],
  });

  if (isContractRegisteredToRouter) {
    const userOptionDataEntity = await context.db.UserOptionData.update({
      id: id.toString() + optionContractAddress,
      data: ({ current }) => ({
        state: State.expired,
        expirationPrice: priceAtExpiration,
      }),
    });

    await context.db.OptionContract.update({
      id: optionContractAddress,
      data({ current }) {
        if (userOptionDataEntity.isAbove) {
          return {
            openInterestUp:
              current.openInterestUp + userOptionDataEntity.totalFee,
            openUp: current.openUp + BigInt(1),
          };
        } else {
          return {
            openInterestDown:
              current.openInterestDown + userOptionDataEntity.totalFee,
            openDown: current.openDown + BigInt(1),
          };
        }
      },
    });
  }
});
ponder.on("BufferBinaryOptions:Exercise", async ({ context, event }) => {
  const { args } = event;
  const { client } = context;
  const { id, isAbove, account, profit, priceAtExpiration } = args;
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
      const { pool, token } = findPoolAndTokenFromPoolAddress(
        optionContractEntity.poolContract
      );
      const userOptionDataEntity = await context.db.UserOptionData.update({
        id: id.toString() + optionContractAddress,
        data: ({ current }) => ({
          state: State.exercised,
          expirationPrice: priceAtExpiration,
          payout: profit,
          payoutUSD: convertToUSD(profit, token),
        }),
      });

      await context.db.OptionContract.update({
        id: optionContractAddress,
        data({ current }) {
          if (userOptionDataEntity.isAbove) {
            return {
              openInterestUp:
                current.openInterestUp + userOptionDataEntity.totalFee,
              openUp: current.openUp + BigInt(1),
            };
          } else {
            return {
              openInterestDown:
                current.openInterestDown + userOptionDataEntity.totalFee,
              openDown: current.openDown + BigInt(1),
            };
          }
        },
      });
    }
  }
});

ponder.on("BufferBinaryOptions:Pause", async ({ context, event }) => {
  const { args } = event;
  const { isPaused } = args;

  await context.db.OptionContract.update({
    id: getAddress(event.log.address),
    data: {
      isPaused,
    },
  });
});
