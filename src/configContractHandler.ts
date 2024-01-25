import { ponder } from "@/generated";
import { zeroAddress } from "viem";

ponder.on("OptionsConfig:UpdateMinFee", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: args.value,
      creationWindowContract: zeroAddress,
      circuitBreakerContract: zeroAddress,
      optionStorageContract: zeroAddress,
      platformFee: BigInt(0),
      sfdContract: zeroAddress,
      sf: BigInt(0),
      traderNFTContract: zeroAddress,
      stepSize: BigInt(0),
    },
    update: ({ current }) => ({
      minFee: args.value,
    }),
  });
});
ponder.on(
  "OptionsConfig:UpdateCreationWindowContract",
  async ({ context, event }) => {
    const { args } = event;

    await context.db.ConfigContract.upsert({
      id: event.log.address,
      create: {
        address: event.log.address,
        minFee: BigInt(0),
        creationWindowContract: args.value,
        circuitBreakerContract: zeroAddress,
        optionStorageContract: zeroAddress,
        platformFee: BigInt(0),
        sfdContract: zeroAddress,
        sf: BigInt(0),
        traderNFTContract: zeroAddress,
        stepSize: BigInt(0),
      },
      update: ({ current }) => ({
        creationWindowContract: args.value,
      }),
    });
  }
);
ponder.on(
  "OptionsConfig:UpdateCircuitBreakerContract",
  async ({ context, event }) => {
    const { args } = event;

    await context.db.ConfigContract.upsert({
      id: event.log.address,
      create: {
        address: event.log.address,
        minFee: BigInt(0),
        creationWindowContract: zeroAddress,
        circuitBreakerContract: args._circuitBreakerContract,
        optionStorageContract: zeroAddress,
        platformFee: BigInt(0),
        sfdContract: zeroAddress,
        sf: BigInt(0),
        traderNFTContract: zeroAddress,
        stepSize: BigInt(0),
      },
      update: ({ current }) => ({
        circuitBreakerContract: args._circuitBreakerContract,
      }),
    });
  }
);
ponder.on(
  "OptionsConfig:UpdateOptionStorageContract",
  async ({ context, event }) => {
    const { args } = event;

    await context.db.ConfigContract.upsert({
      id: event.log.address,
      create: {
        address: event.log.address,
        minFee: BigInt(0),
        creationWindowContract: zeroAddress,
        circuitBreakerContract: zeroAddress,
        optionStorageContract: args.value,
        platformFee: BigInt(0),
        sfdContract: zeroAddress,
        sf: BigInt(0),
        traderNFTContract: zeroAddress,
        stepSize: BigInt(0),
      },
      update: ({ current }) => ({
        optionStorageContract: args.value,
      }),
    });
  }
);
ponder.on("OptionsConfig:UpdatePlatformFee", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      circuitBreakerContract: zeroAddress,
      optionStorageContract: zeroAddress,
      platformFee: args._platformFee,
      sfdContract: zeroAddress,
      sf: BigInt(0),
      traderNFTContract: zeroAddress,
      stepSize: BigInt(0),
    },
    update: ({ current }) => ({
      platformFee: args._platformFee,
    }),
  });
});
ponder.on(
  "OptionsConfig:UpdateSettlementFeeDisbursalContract",
  async ({ context, event }) => {
    const { args } = event;

    await context.db.ConfigContract.upsert({
      id: event.log.address,
      create: {
        address: event.log.address,
        minFee: BigInt(0),
        creationWindowContract: zeroAddress,
        circuitBreakerContract: zeroAddress,
        optionStorageContract: zeroAddress,
        platformFee: BigInt(0),
        sfdContract: args.value,
        sf: BigInt(0),
        traderNFTContract: zeroAddress,
        stepSize: BigInt(0),
      },
      update: ({ current }) => ({
        sfdContract: args.value,
      }),
    });
  }
);
ponder.on("OptionsConfig:UpdateSf", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      circuitBreakerContract: zeroAddress,
      optionStorageContract: zeroAddress,
      platformFee: BigInt(0),
      sfdContract: zeroAddress,
      sf: args.sf,
      traderNFTContract: zeroAddress,
      stepSize: BigInt(0),
    },
    update: ({ current }) => ({
      sf: args.sf,
    }),
  });
});
ponder.on(
  "OptionsConfig:UpdatetraderNFTContract",
  async ({ context, event }) => {
    const { args } = event;

    await context.db.ConfigContract.upsert({
      id: event.log.address,
      create: {
        address: event.log.address,
        minFee: BigInt(0),
        creationWindowContract: zeroAddress,
        circuitBreakerContract: zeroAddress,
        optionStorageContract: zeroAddress,
        platformFee: BigInt(0),
        sfdContract: zeroAddress,
        sf: BigInt(0),
        traderNFTContract: args.value,
        stepSize: BigInt(0),
      },
      update: ({ current }) => ({
        traderNFTContract: args.value,
      }),
    });
  }
);
ponder.on("OptionsConfig:UpdateStrikeStepSize", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      circuitBreakerContract: zeroAddress,
      optionStorageContract: zeroAddress,
      platformFee: BigInt(0),
      sfdContract: zeroAddress,
      sf: BigInt(0),
      traderNFTContract: zeroAddress,
      stepSize: args.strikeStepSize,
    },
    update: ({ current }) => ({
      stepSize: args.strikeStepSize,
    }),
  });
});
