import { createConfig } from "@ponder/core";
import { http } from "viem";
import { BufferBinaryOptions } from "./abis/BufferBinaryOption";
import { BufferRouter } from "./abis/BufferRouter";
import { Config } from "./abis/Config";
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
        event: [
          "CreateOptionsContract",
          "Create",
          "Expire",
          "Exercise",
          "Pause",
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
          "UpdateMinFee",
          "UpdateCreationWindowContract",
          "UpdateCircuitBreakerContract",
          "UpdateOptionStorageContract",
          "UpdatePlatformFee",
          "UpdateSettlementFeeDisbursalContract",
          "UpdateSf",
          "UpdatetraderNFTContract",
          "UpdateStrikeStepSize",
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
