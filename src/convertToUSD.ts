export function convertToUSD(
  payoutInToken: bigint,
  depositToken: string
): bigint {
  if (depositToken == "USDC") {
    return payoutInToken;
  } else if (depositToken == "ARB") {
    return convertARBToUSDC(payoutInToken);
  } else if (depositToken == "BFR") {
    return convertBFRToUSDC(payoutInToken);
  }
  return payoutInToken;
}

function convertARBToUSDC(amount: bigint): bigint {
  return (amount * BigInt(12)) / BigInt(100000000000000);
}

function convertBFRToUSDC(amount: bigint): bigint {
  return (amount * BigInt(12)) / BigInt(10000000000000);
}
