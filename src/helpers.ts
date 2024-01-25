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

export function _getDayId(timestamp: number): string {
  let dayTimestamp = (timestamp - 16 * 3600) / 86400;
  return dayTimestamp.toString();
}

export function _getWeekId(timestamp: number): string {
  let weekTimestamp = (timestamp - 4 * 86400 - 16 * 3600) / (86400 * 7);
  return weekTimestamp.toString();
}

export function _getHourId(timestamp: number): string {
  let hourTimestamp = (timestamp - 16 * 3600) / 3600;
  return hourTimestamp.toString();
}
