import { createConfig } from "@ponder/core";
import { http } from "viem";
import { BufferBinaryOptions } from "./abis/BufferBinaryOption";
import { BufferRouter } from "./abis/BufferRouter";
import { Config } from "./abis/Config";
import { TournamentManager } from "./abis/TournamentManager";
export default createConfig({
  networks: {
    blastSepolia: {
      chainId: 168587773,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    BufferBinaryOptions: {
      network: "blastSepolia",
      abi: BufferBinaryOptions,
      startBlock: 1004456,
      maxBlockRange: 10000,
      filter: {
        event: ["CreateContract", "Create", "Expire", "Exercise"],
      },
    },
    TournamentManager: {
      network: "blastSepolia",
      abi: TournamentManager,
      startBlock: 1004456,
      maxBlockRange: 10000,
      filter: {
        event: [
          "CreateTournament",
          "VerifyTournament",
          "StartTournament",
          "EndTournament",
          "CloseTournament",
        ],
      },
    },
    OptionsConfig: {
      network: "blastSepolia",
      abi: Config,
      startBlock: 1004456,
      maxBlockRange: 10000,
      filter: {
        event: [
          "UpdateMinPeriod",
          "UpdateMaxPeriod",
          "UpdateMaxFee",
          "UpdateMinFee",
          "UpdateCreationWindowContract",
        ],
      },
    },
    RouterContract: {
      network: "blastSepolia",
      abi: BufferRouter,
      startBlock: 1004456,
      maxBlockRange: 10000,
      filter: {
        event: ["CancelTrade", "InitiateTrade", "OpenTrade"],
      },
    },
  },
});
