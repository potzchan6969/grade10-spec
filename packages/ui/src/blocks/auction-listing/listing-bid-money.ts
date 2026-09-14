import {
  currencyExponent,
  DEFAULT_LISTING_CURRENCY,
  formatMoney,
  parseMoneyInputToMinor,
  toMinorUnits,
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

/**
 * Quick-raise preset amount. 1× / 2× / 4× the listing increment on the
 * committed maximum when leading, or on the current bid otherwise. These
 * chips are not the raise floor — a leader's minimum remains max + $1.
 */
export function quickMaximumPresetAmount(input: {
  multiples: number;
  isLeadingWithMaximum: boolean;
  hasBids: boolean;
  floorMaximumMinor: number;
  incrementMinor: number;
  currentBidMinor: number;
  viewerMaximumMinor?: number;
}): number | null {
  const {
    multiples,
    isLeadingWithMaximum,
    hasBids,
    floorMaximumMinor,
    incrementMinor,
    currentBidMinor,
    viewerMaximumMinor,
  } = input;

  const amountMinor = isLeadingWithMaximum
    ? (viewerMaximumMinor ?? floorMaximumMinor) + incrementMinor * multiples
    : multiples === 1 && !hasBids
      ? floorMaximumMinor
      : currentBidMinor + incrementMinor * multiples;

  if (amountMinor < floorMaximumMinor) return null;
  return amountMinor;
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

/**
 * Digits only for the custom maximum draft. A decimal mark and everything
 * after it are dropped (no rounding) so a paste like `100.50` becomes `100`.
 * `currency` is retained for call-site symmetry with parse helpers.
 */
export function sanitizeMoneyDraft(raw: string, _currency: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const dot = cleaned.search(/[.]/);
  if (dot === -1) return cleaned;
  return cleaned.slice(0, dot);
}

/**
 * Editable whole-major draft for a minor floor — ceils when the floor is not
 * already on a major-unit boundary so stripping cannot drop below the floor.
 */
export function wholeMajorDraftFromMinor(
  minor: number,
  currency: string,
): string {
  const exponent = currencyExponent(currency);
  if (exponent === 0) return String(minor);
  const factor = 10 ** exponent;
  const wholeMinor = Math.ceil(minor / factor) * factor;
  return String(wholeMinor / factor);
}

/**
 * Parse a draft to minor units only when it matches the currency's precision
 * exactly (no silent rounding of excess fraction digits).
 */
export function parseExactMoneyDraftToMinor(
  draft: string,
  currency: string,
): number | null {
  const normalized = draft.trim().replace(/,/g, "");
  if (!normalized || normalized === ".") return null;
  try {
    return toMinorUnits(normalized, currency);
  } catch {
    return null;
  }
}

export type CommittedMaximumValidation =
  | { ok: true; amountMinor: number }
  | { ok: false; reason: "invalid" | "below-floor" };

/**
 * Guard for UI commit and application/server accept paths. Amount must be a
 * safe integer of minor units at or above the floor. Any exact minor amount
 * above the floor is allowed (not limited to the listing increment grid).
 */
export function validateCommittedMaximumMinor(input: {
  amountMinor: number;
  floorMinor: number;
}): CommittedMaximumValidation {
  const { amountMinor, floorMinor } = input;
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    return { ok: false, reason: "invalid" };
  }
  if (amountMinor < floorMinor) {
    return { ok: false, reason: "below-floor" };
  }
  return { ok: true, amountMinor };
}

/** Editable major-unit draft for a minor amount (no grouping separators). */
export function moneyDraftFromMinor(minor: number, currency: string): string {
  const exponent = currencyExponent(currency);
  const major = minor / 10 ** exponent;
  if (exponent === 0 || Number.isInteger(major)) return String(major);
  return major.toFixed(exponent).replace(/0+$/, "").replace(/\.$/, "");
}

export { parseMoneyInputToMinor };
