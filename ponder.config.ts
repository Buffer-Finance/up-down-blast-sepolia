import { createConfig } from "@ponder/core";
import { http } from "viem";
import { ConfigMarket as AboveBelowConfigMarket } from "./abis/AboveBelow/ConfigMarket";
import { Market as AboveBelowMarket } from "./abis/AboveBelow/Market";
import { Router as AboveBelowRouter } from "./abis/AboveBelow/Router";
import { BFRAbi } from "./abis/BFR";
import {
  Above_Below_Router_2_Address,
  Above_Below_Router_Address,
} from "./src/config";

export default createConfig({
  networks: {
    blastSepolia: {
      chainId: 168587773,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    arbitrumMainnet: {
      chainId: 42161,
      transport: http(process.env.ARBITRUM_MAINNET_RPC_URL_1),
    },
  },
  contracts: {
    BFR: {
      abi: BFRAbi,
      address: "0x1a5b0aaf478bf1fda7b934c76e7692d722982a6d",
      network: "arbitrumMainnet",
      filter: {
        event: "Transfer",
        args: {
          to: "0x000000000000000000000000000000000000dEaD",
        },
      },
      startBlock: 2765614,
    },
    AboveBelowRouter: {
      network: "arbitrumMainnet",
      abi: AboveBelowRouter,
      startBlock: 164890633,
      address: [Above_Below_Router_Address, Above_Below_Router_2_Address],
      filter: {
        event: [
          "CancelTrade",
          "InitiateTrade",
          "OpenTrade",
          "ContractRegistryUpdated",
        ],
      },
    },
    AboveBelowMarket: {
      network: "arbitrumMainnet",
      abi: AboveBelowMarket,
      startBlock: 164890633,
      filter: {
        event: [
          "CreateOptionsContract",
          "CreateMarket",
          "Pause",
          "Create",
          "Exercise",
          "Expire",
        ],
      },
    },
    AboveBelowConfigMarket: {
      network: "arbitrumMainnet",
      abi: AboveBelowConfigMarket,
      startBlock: 164890633,
      filter: {
        event: [
          "UpdateMaxSkew",
          "UpdateIV",
          "UpdatePayout",
          "UpdatePlatformFee",
          "UpdateSf",
          "UpdateStrikeStepSize",
        ],
      },
    },
  },
});
