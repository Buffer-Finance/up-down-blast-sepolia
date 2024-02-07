import { createConfig } from "@ponder/core";
import { http } from "viem";
import { BufferRouter } from "./abis/BufferRouter";
export default createConfig({
  networks: {
    blastSepolia: {
      chainId: 168587773,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    arbitrumMainnet: {
      chainId: 42161,
      transport: http(process.env.ARBITRUM_MAINNET_RPC_URL),
    },
  },
  contracts: {
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
