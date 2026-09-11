import { describe, expect, it } from "vitest";
import {
  moneyDraftFromMinor,
  parseExactMoneyDraftToMinor,
  quickMaximumPresetAmount,
  sanitizeMoneyDraft,
  validateCommittedMaximumMinor,
  wholeMajorDraftFromMinor,
} from "./listing-bid-money";

const FLOOR = 20_800_000; // HK$208,000

describe("sanitizeMoneyDraft", () => {
  it("strips non-digits and discards any decimal fraction", () => {
    expect(sanitizeMoneyDraft("208,000.00001", "HKD")).toBe("208000");
    expect(sanitizeMoneyDraft("208000.999", "HKD")).toBe("208000");
    expect(sanitizeMoneyDraft("100.", "HKD")).toBe("100");
  });

  it("strips decimals for zero-exponent currencies", () => {
    expect(sanitizeMoneyDraft("1500.5", "JPY")).toBe("1500");
  });
});

describe("parseExactMoneyDraftToMinor", () => {
  it("parses exact minor amounts", () => {
    expect(parseExactMoneyDraftToMinor("208000", "HKD")).toBe(FLOOR);
    expect(parseExactMoneyDraftToMinor("208000.50", "HKD")).toBe(20_800_050);
  });

  it("returns null for empty or incomplete drafts", () => {
    expect(parseExactMoneyDraftToMinor("", "HKD")).toBeNull();
    expect(parseExactMoneyDraftToMinor(".", "HKD")).toBeNull();
  });
});

describe("validateCommittedMaximumMinor", () => {
  it("accepts any exact minor amount at or above the floor", () => {
    expect(
      validateCommittedMaximumMinor({
        amountMinor: FLOOR + 1,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: true, amountMinor: FLOOR + 1 });
  });

  it("rejects invalid and below-floor amounts", () => {
    expect(
      validateCommittedMaximumMinor({
        amountMinor: FLOOR - 1,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: false, reason: "below-floor" });
    expect(
      validateCommittedMaximumMinor({
        amountMinor: 1.5,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("moneyDraftFromMinor", () => {
  it("formats an editable draft without grouping", () => {
    expect(moneyDraftFromMinor(FLOOR, "HKD")).toBe("208000");
    expect(moneyDraftFromMinor(20_800_050, "HKD")).toBe("208000.5");
  });
});

describe("wholeMajorDraftFromMinor", () => {
  it("returns whole major units when already on a boundary", () => {
    expect(wholeMajorDraftFromMinor(FLOOR, "HKD")).toBe("208000");
  });

  it("ceils a fractional floor to the next whole major unit", () => {
    expect(wholeMajorDraftFromMinor(20_800_050, "HKD")).toBe("208001");
  });

  it("passes through zero-exponent amounts unchanged", () => {
    expect(wholeMajorDraftFromMinor(1500, "JPY")).toBe("1500");
  });
});

describe("quickMaximumPresetAmount", () => {
  it("adds 1× / 2× / 4× increment on the committed max when leading", () => {
    const leading = {
      isLeadingWithMaximum: true,
      hasBids: true,
      floorMaximumMinor: 204_000,
      incrementMinor: 4_000,
      currentBidMinor: 120_000,
      viewerMaximumMinor: 200_000,
    } as const;
    expect(quickMaximumPresetAmount({ ...leading, multiples: 1 })).toBe(
      204_000,
    );
    expect(quickMaximumPresetAmount({ ...leading, multiples: 2 })).toBe(
      208_000,
    );
    expect(quickMaximumPresetAmount({ ...leading, multiples: 4 })).toBe(
      216_000,
    );
  });

  it("adds 1× / 2× / 4× increment on the current bid when not leading", () => {
    const challenger = {
      isLeadingWithMaximum: false,
      hasBids: true,
      floorMaximumMinor: 124_000,
      incrementMinor: 4_000,
      currentBidMinor: 120_000,
      viewerMaximumMinor: 116_000,
    } as const;
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 1 })).toBe(
      124_000,
    );
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 2 })).toBe(
      128_000,
    );
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 4 })).toBe(
      136_000,
    );
  });
});
