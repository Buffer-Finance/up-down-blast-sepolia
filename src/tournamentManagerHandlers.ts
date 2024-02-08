import { ponder } from "@/generated";
import { TournamentState } from "./config";

ponder.on("TournamentManager:CreateTournament", async ({ context, event }) => {
  const { args } = event;
  const { name, tournamentId } = args;

  await context.db.Tournament.upsert({
    id: tournamentId,
    create: {
      state: TournamentState.created,
      lastUpdated: event.block.timestamp,
    },
    update: {
      state: TournamentState.created,
      lastUpdated: event.block.timestamp,
    },
  });
});
ponder.on("TournamentManager:VerifyTournament", async ({ context, event }) => {
  const { args } = event;
  const { tournamentId } = args;

  await context.db.Tournament.upsert({
    id: tournamentId,
    create: {
      state: TournamentState.verified,
      lastUpdated: event.block.timestamp,
    },
    update: {
      state: TournamentState.verified,
      lastUpdated: event.block.timestamp,
    },
  });
});
ponder.on("TournamentManager:StartTournament", async ({ context, event }) => {
  const { args } = event;
  const { tournamentId } = args;

  await context.db.Tournament.upsert({
    id: tournamentId,
    create: {
      state: TournamentState.started,
      lastUpdated: event.block.timestamp,
    },
    update: {
      state: TournamentState.started,
      lastUpdated: event.block.timestamp,
    },
  });
});
ponder.on("TournamentManager:EndTournament", async ({ context, event }) => {
  const { args } = event;
  const { tournamentId } = args;

  await context.db.Tournament.upsert({
    id: tournamentId,
    create: {
      state: TournamentState.ended,
      lastUpdated: event.block.timestamp,
    },
    update: {
      state: TournamentState.ended,
      lastUpdated: event.block.timestamp,
    },
  });
});
ponder.on("TournamentManager:CloseTournament", async ({ context, event }) => {
  const { args } = event;
  const { tournamentId } = args;

  await context.db.Tournament.upsert({
    id: tournamentId,
    create: {
      state: TournamentState.closed,
      lastUpdated: event.block.timestamp,
    },
    update: {
      state: TournamentState.closed,
      lastUpdated: event.block.timestamp,
    },
  });
});
