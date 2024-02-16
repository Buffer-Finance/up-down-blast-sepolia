import { ponder } from "@/generated";
import { getAddress } from "viem";

ponder.on(
  "AboveBelowConfigMarket:UpdateMaxSkew",
  async ({ event, context }) => {
    await context.db.ConfigContract.upsert({
      id: getAddress(event.log.address),
      create: {
        address: getAddress(event.log.address),
        maxSkew: event.args._maxSkew,
        iv: 0,
        platformFee: BigInt(0),
        payout: BigInt(0),
        sf: BigInt(0),
        stepSize: BigInt(0),
      },
      update: {
        maxSkew: event.args._maxSkew,
      },
    });
  }
);

ponder.on("AboveBelowConfigMarket:UpdateIV", async ({ event, context }) => {
  await context.db.ConfigContract.upsert({
    id: getAddress(event.log.address),
    create: {
      address: getAddress(event.log.address),
      maxSkew: BigInt(0),
      iv: event.args._iv,
      platformFee: BigInt(0),
      payout: BigInt(0),
      sf: BigInt(0),
      stepSize: BigInt(0),
    },
    update: {
      iv: event.args._iv,
    },
  });
});

ponder.on("AboveBelowConfigMarket:UpdatePayout", async ({ event, context }) => {
  await context.db.ConfigContract.upsert({
    id: getAddress(event.log.address),
    create: {
      address: getAddress(event.log.address),
      maxSkew: BigInt(0),
      iv: 0,
      platformFee: BigInt(0),
      payout: event.args.payout,
      sf: BigInt(0),
      stepSize: BigInt(0),
    },
    update: {
      payout: event.args.payout,
    },
  });
});

ponder.on(
  "AboveBelowConfigMarket:UpdatePlatformFee",
  async ({ event, context }) => {
    await context.db.ConfigContract.upsert({
      id: getAddress(event.log.address),
      create: {
        address: getAddress(event.log.address),
        maxSkew: BigInt(0),
        iv: 0,
        platformFee: event.args._platformFee,
        payout: BigInt(0),
        sf: BigInt(0),
        stepSize: BigInt(0),
      },
      update: {
        platformFee: event.args._platformFee,
      },
    });
  }
);

ponder.on("AboveBelowConfigMarket:UpdateSf", async ({ event, context }) => {
  await context.db.ConfigContract.upsert({
    id: getAddress(event.log.address),
    create: {
      address: getAddress(event.log.address),
      maxSkew: BigInt(0),
      iv: 0,
      platformFee: BigInt(0),
      payout: BigInt(0),
      sf: event.args.sf,
      stepSize: BigInt(0),
    },
    update: {
      sf: event.args.sf,
    },
  });
});

ponder.on(
  "AboveBelowConfigMarket:UpdateStrikeStepSize",
  async ({ event, context }) => {
    await context.db.ConfigContract.upsert({
      id: getAddress(event.log.address),
      create: {
        address: getAddress(event.log.address),
        maxSkew: BigInt(0),
        iv: 0,
        platformFee: BigInt(0),
        payout: BigInt(0),
        sf: BigInt(0),
        stepSize: event.args.strikeStepSize,
      },
      update: {
        stepSize: event.args.strikeStepSize,
      },
    });
  }
);
