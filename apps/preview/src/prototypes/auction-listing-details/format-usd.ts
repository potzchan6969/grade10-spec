/** Format minor units as US$ with up to 2 decimals, no trailing zeros. */
export function formatUsd(minorUnits: number): string {
  const major = minorUnits / 100;
  const formatted = major.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `US$${formatted}`;
}

export function minNextBidMinor(
  currentBidMinor: number,
  incrementMinor: number,
  hasBids: boolean,
  startingBidMinor: number,
): number {
  return hasBids ? currentBidMinor + incrementMinor : startingBidMinor;
}
