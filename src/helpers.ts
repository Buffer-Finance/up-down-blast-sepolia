import { ARB_POOL_CONTRACT, USDC_POOL_CONTRACT } from "./config";

export function findPoolAndTokenFromPoolAddress(poolAddress: string): {
  pool: string;
  token: string;
} {
  if (poolAddress == USDC_POOL_CONTRACT) {
    return { pool: "USDC", token: "USDC" };
  } else if (poolAddress == ARB_POOL_CONTRACT) {
    return { pool: "ARB", token: "ARB" };
  } else
    return {
      pool: "",
      token: "",
    };
}
