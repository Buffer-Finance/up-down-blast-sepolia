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
      startBlock: 1388930,
      maxBlockRange: 10000,
      filter: {
        event: ["CreateContract", "Create", "Expire", "Exercise", "Pause"],
      },
    },
    TournamentManager: {
      network: "blastSepolia",
      abi: TournamentManager,
      address: "0xc0b0022604e40130D8F6ad0c770510EFa2A97A72",
      startBlock: 1388930,
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
      startBlock: 1388930,
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
      address: "0xC42D0a6d10fd4E0085F82cAE02Bb10a2A6b9650E",
      startBlock: 1388930,
      maxBlockRange: 10000,
      filter: {
        event: ["CancelTrade", "InitiateTrade", "OpenTrade"],
      },
    },
  },
});
