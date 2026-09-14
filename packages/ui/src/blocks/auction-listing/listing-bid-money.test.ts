import { describe, expect, it } from "vitest";
import {
  CUSTOM_MAXIMUM_MAJOR_CEILING,
  moneyDraftFromMinor,
  parseExactMoneyDraftToMinor,
  quickMaximumPresetAmount,
  resolveMaximumFloor,
  sanitizeCustomMaximumDraft,
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

describe("sanitizeCustomMaximumDraft", () => {
  const ceiling = String(CUSTOM_MAXIMUM_MAJOR_CEILING);

  it("accepts drafts at and below the major-unit ceiling", () => {
    expect(sanitizeCustomMaximumDraft(ceiling, "HKD", "")).toBe(ceiling);
    expect(sanitizeCustomMaximumDraft("500", "HKD", "")).toBe("500");
    expect(sanitizeCustomMaximumDraft("9999999998", "JPY", "1")).toBe(
      "9999999998",
    );
  });

  it("restores the previous draft when sanitized major units exceed the ceiling", () => {
    expect(sanitizeCustomMaximumDraft(`${ceiling}0`, "HKD", ceiling)).toBe(
      ceiling,
    );
    expect(sanitizeCustomMaximumDraft("10000000000", "HKD", "")).toBe("");
    expect(sanitizeCustomMaximumDraft("99999999999", "HKD", "500")).toBe("500");
  });

  it("applies whole-major sanitize before the ceiling check", () => {
    expect(sanitizeCustomMaximumDraft("10000000000.99", "HKD", "500")).toBe(
      "500",
    );
    expect(sanitizeCustomMaximumDraft("9999999999.99", "HKD", "")).toBe(
      ceiling,
    );
  });

  it("still accepts clearing to empty", () => {
    expect(sanitizeCustomMaximumDraft("", "HKD", "500")).toBe("");
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

describe("resolveMaximumFloor", () => {
  it("keeps a leader's minimum at max plus $1 while they are below cap", () => {
    expect(
      resolveMaximumFloor({
        minBidMinor: 124_000,
        incrementMinor: 4_000,
        viewerMaximumMinor: 200_000,
        standing: "leading-max",
        currentBidMinor: 120_000,
      }),
    ).toEqual({ floorMinor: 200_100, reason: "leading-nudge" });
  });
});

describe("quickMaximumPresetAmount", () => {
  it("adds 1× / 2× / 4× increment on the committed max when leading", () => {
    const leading = {
      isLeadingWithMaximum: true,
      hasBids: true,
      floorMaximumMinor: 200_100,
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
