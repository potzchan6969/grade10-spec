import type { ListingAuctionStanding } from "./types";

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

/** Smallest raise step when leading below cap on auto-bid ($1.00). */
const MINIMUM_MAXIMUM_RAISE_MINOR = 100;

export type MaximumFloorReason =
  | "floor-bid"
  | "leading-nudge"
  | "leading-increment";

export type MaximumFloor = {
  floorMinor: number;
  reason: MaximumFloorReason;
};

/** Lowest valid committed maximum, with the rule that drives the helper caption. */
export function resolveMaximumFloor(input: {
  minBidMinor: number;
  incrementMinor: number;
  viewerMaximumMinor?: number;
  standing: ListingAuctionStanding;
  currentBidMinor: number;
}): MaximumFloor {
  const {
    minBidMinor,
    incrementMinor,
    viewerMaximumMinor,
    standing,
    currentBidMinor,
  } = input;

  if (viewerMaximumMinor == null) {
    return { floorMinor: minBidMinor, reason: "floor-bid" };
  }

  if (standing === "outbid") {
    return { floorMinor: minBidMinor, reason: "floor-bid" };
  }

  if (standing === "leading-max") {
    const atCap = currentBidMinor >= viewerMaximumMinor;
    if (atCap) {
      const incrementRaiseFloor = viewerMaximumMinor + incrementMinor;
      const floorMinor = Math.max(minBidMinor, incrementRaiseFloor);
      const reason =
        floorMinor === minBidMinor && minBidMinor > incrementRaiseFloor
          ? "floor-bid"
          : "leading-increment";
      return { floorMinor, reason };
    }
    return {
      floorMinor: Math.max(
        minBidMinor,
        viewerMaximumMinor + MINIMUM_MAXIMUM_RAISE_MINOR,
      ),
      reason: "leading-nudge",
    };
  }

  return { floorMinor: minBidMinor, reason: "floor-bid" };
}

export type MinimumMaximumCaptionCopy = {
  minimumMaximumFloor: string;
  minimumMaximumLeadingNudge: string;
  minimumMaximumLeadingIncrement: string;
};

/** Input caption for auto-bid maximum floor — mirrors manual `Min. bid` parenthetical. */
export function formatMinimumMaximumCaption(
  floor: MaximumFloor,
  copy: MinimumMaximumCaptionCopy,
  incrementMinor: number,
): string {
  const amount = formatUsd(floor.floorMinor);
  const increment = formatUsd(incrementMinor);

  switch (floor.reason) {
    case "leading-nudge":
      return copy.minimumMaximumLeadingNudge.replace("{amount}", amount);
    case "leading-increment":
      return copy.minimumMaximumLeadingIncrement
        .replace("{amount}", amount)
        .replace("{increment}", increment);
    default:
      return copy.minimumMaximumFloor
        .replace("{amount}", amount)
        .replace("{increment}", increment);
  }
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
