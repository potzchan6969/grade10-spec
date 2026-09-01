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

/** Smallest raise step when increasing an existing auto-bid maximum ($1.00). */
const MINIMUM_MAXIMUM_RAISE_MINOR = 100;

/** Lowest valid committed maximum: at least the next bid, and at least $1 above any standing maximum. */
export function minMaximumMinor(
  minBidMinor: number,
  viewerMaximumMinor?: number,
): number {
  if (viewerMaximumMinor == null) return minBidMinor;
  return Math.max(
    minBidMinor,
    viewerMaximumMinor + MINIMUM_MAXIMUM_RAISE_MINOR,
  );
}

/** Parse a currency field value to minor units; null when empty or not a positive number. */
export function parseUsdInputToMinor(value: string): number | null {
  const normalized = value.replaceAll(",", "").trim();
  if (!normalized) return null;

  const major = Number(normalized);
  if (!Number.isFinite(major) || major <= 0) return null;

  return Math.round(major * 100);
}

export function isMaximumBelowFloor(
  valueMinor: number | null,
  floorMaximumMinor: number,
): boolean {
  return valueMinor == null || valueMinor < floorMaximumMinor;
}

/** Input caption for auto-bid maximum floor — mirrors manual `Min. bid` parenthetical. */
export function formatMinMaximumMessage(
  minMaximumMinor: number,
  incrementMinor: number,
  viewerMaximumMinor?: number,
): string {
  if (viewerMaximumMinor != null) {
    const raisedFloor = viewerMaximumMinor + MINIMUM_MAXIMUM_RAISE_MINOR;
    if (minMaximumMinor > raisedFloor) {
      return `Min. maximum: ${formatUsd(minMaximumMinor)} (current + ${formatUsd(incrementMinor)})`;
    }
    return `Min. maximum: ${formatUsd(minMaximumMinor)} (your maximum + US$1)`;
  }

  return `Min. maximum: ${formatUsd(minMaximumMinor)} (current + ${formatUsd(incrementMinor)})`;
}
