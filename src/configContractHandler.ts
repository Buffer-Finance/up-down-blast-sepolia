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
      maxFee: BigInt(0),
      maxPeriod: 0,
      minPeriod: 0,
    },
    update: { minFee: args.value },
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
        maxFee: BigInt(0),
        maxPeriod: 0,
        minPeriod: 0,
      },
      update: { creationWindowContract: args.value },
    });
  }
);

ponder.on("OptionsConfig:UpdateMaxFee", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      maxFee: args.value,
      maxPeriod: 0,
      minPeriod: 0,
    },
    update: { maxFee: args.value },
  });
});

ponder.on("OptionsConfig:UpdateMaxPeriod", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      maxFee: BigInt(0),
      maxPeriod: args.value,
      minPeriod: 0,
    },
    update: { maxPeriod: args.value },
  });
});

ponder.on("OptionsConfig:UpdateMinPeriod", async ({ context, event }) => {
  const { args } = event;

  await context.db.ConfigContract.upsert({
    id: event.log.address,
    create: {
      address: event.log.address,
      minFee: BigInt(0),
      creationWindowContract: zeroAddress,
      maxFee: BigInt(0),
      maxPeriod: 0,
      minPeriod: args.value,
    },
    update: { minPeriod: args.value },
  });
});
