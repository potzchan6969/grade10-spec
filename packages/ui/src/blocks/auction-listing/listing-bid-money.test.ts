import { describe, expect, it } from "vitest";
import {
  moneyDraftFromMinor,
  parseExactMoneyDraftToMinor,
  sanitizeMoneyDraft,
  validateCommittedMaximumMinor,
} from "./listing-bid-money";

const FLOOR = 20_800_000; // HK$208,000

describe("sanitizeMoneyDraft", () => {
  it("strips non-digits and caps fraction digits to the currency exponent", () => {
    expect(sanitizeMoneyDraft("208,000.00001", "HKD")).toBe("208000.00");
    expect(sanitizeMoneyDraft("208000.999", "HKD")).toBe("208000.99");
  });

  it("rejects decimals for zero-exponent currencies", () => {
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
