import {
  DEFAULT_LISTING_CURRENCY,
  formatMoney,
  parseMoneyInputToMinor,
} from "../../lib/format-money";
import type { ListingAuctionStanding } from "./types";

export { DEFAULT_LISTING_CURRENCY };

export function minNextBidMinor(
  currentBidMinor: number,
  incrementMinor: number,
  hasBids: boolean,
  startingBidMinor: number,
): number {
  return hasBids ? currentBidMinor + incrementMinor : startingBidMinor;
}

/** Smallest raise step when leading below cap — one major unit (100 minor for exponent 2). */
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
  currency: string,
  locale?: string,
): string {
  const amount = formatMoney(floor.floorMinor, currency, { locale });
  const increment = formatMoney(incrementMinor, currency, { locale });
  const minimumRaise = formatMoney(MINIMUM_MAXIMUM_RAISE_MINOR, currency, {
    locale,
  });

  switch (floor.reason) {
    case "leading-nudge":
      return copy.minimumMaximumLeadingNudge
        .replace("{amount}", amount)
        .replace("{increment}", minimumRaise);
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

export function isMaximumBelowFloor(
  valueMinor: number | null,
  floorMaximumMinor: number,
): boolean {
  return valueMinor == null || valueMinor < floorMaximumMinor;
}

export { parseMoneyInputToMinor };
