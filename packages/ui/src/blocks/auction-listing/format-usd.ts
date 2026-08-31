/** Format minor units as US$ with up to 2 decimals, no trailing zeros. */
export function formatUsd(minorUnits: number): string {
  return `US$${formatUsdNumeric(minorUnits)}`;
}

/** Numeric portion only — thousands separators, no currency prefix. */
export function formatUsdNumeric(minorUnits: number): string {
  const major = minorUnits / 100;
  return major.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function minNextBidMinor(
  currentBidMinor: number,
  incrementMinor: number,
  hasBids: boolean,
  startingBidMinor: number,
): number {
  return hasBids ? currentBidMinor + incrementMinor : startingBidMinor;
}

/** Lowest valid committed maximum: at least the next bid, and above any standing maximum. */
export function minMaximumMinor(
  minBidMinor: number,
  viewerMaximumMinor?: number,
): number {
  if (viewerMaximumMinor == null) return minBidMinor;
  return Math.max(minBidMinor, viewerMaximumMinor + 1);
}

/** Input caption for auto-bid maximum floor — mirrors manual `Min. bid` parenthetical. */
export function formatMinMaximumMessage(
  minMaximumMinor: number,
  incrementMinor: number,
  viewerMaximumMinor?: number,
): string {
  if (viewerMaximumMinor != null) {
    return `Min. maximum: ${formatUsd(minMaximumMinor)}`;
  }

  return `Min. maximum: ${formatUsd(minMaximumMinor)} (current + ${formatUsd(incrementMinor)})`;
}
