import { Address } from "viem";
import {
  ARB_POOL_CONTRACT,
  BFR_POOL_CONTRACT,
  USDC_POOL_CONTRACT,
} from "../config";

export function findPoolNameFromAddress(address: Address): string {
  if (address == USDC_POOL_CONTRACT) {
    return "USDC";
  } else if (address == ARB_POOL_CONTRACT) {
    return "ARB";
  } else if (address == BFR_POOL_CONTRACT) {
    return "BFR";
  } else {
    return "UNKNOWN POOL";
  }
}
