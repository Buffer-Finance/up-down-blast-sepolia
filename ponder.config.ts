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
      startBlock: 1343567,
      maxBlockRange: 10000,
      filter: {
        event: ["CreateContract", "Create", "Expire", "Exercise"],
      },
    },
    TournamentManager: {
      network: "blastSepolia",
      abi: TournamentManager,
      address: "0x018B7a6557cFB88E0D11D600aF6C88845BDBF8be",
      startBlock: 1343567,
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
      startBlock: 1343567,
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
      address: "0x537fe657b5F6Db1630901d09473Bc6112d4f4B27",
      startBlock: 1343567,
      maxBlockRange: 10000,
      filter: {
        event: ["CancelTrade", "InitiateTrade", "OpenTrade"],
      },
    },
  },
});
