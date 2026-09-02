import { describe, expect, it } from "vitest";
import {
  currencyExponent,
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
  fromMinorUnits,
  splitFormattedMoney,
  toMinorUnits,
} from "./format-money";

const LOCALE = "en-HK";

describe("currencyExponent", () => {
  it("returns ISO 4217 exponents", () => {
    expect(currencyExponent("HKD")).toBe(2);
    expect(currencyExponent("JPY")).toBe(0);
    expect(currencyExponent("KWD")).toBe(3);
  });

  it("throws for an unrecognized code", () => {
    expect(() => currencyExponent("ZZZ")).toThrow(
      "Unsupported currency code for Grade10 money handling: ZZZ",
    );
  });
});

describe("fromMinorUnits / toMinorUnits", () => {
  it("converts a two-decimal currency exactly", () => {
    expect(fromMinorUnits(249_000, "HKD")).toBe("2490.00");
    expect(toMinorUnits("1.15", "HKD")).toBe(115);
    expect(fromMinorUnits(115, "HKD")).toBe("1.15");
  });

  it("rejects excess precision", () => {
    expect(() => toMinorUnits("1.155", "HKD")).toThrow(
      "Invalid decimal amount for HKD: 1.155",
    );
  });
});

describe("formatMoney", () => {
  it("formats HKD for collectors in en-HK", () => {
    expect(formatMoney(249_000, "HKD", { locale: LOCALE })).toBe("HK$2,490");
  });

  it("formats USD with symbol", () => {
    expect(formatMoney(480_000, "USD", { locale: "en-US" })).toBe("$4,800");
  });

  it("formats operator shape with currency code", () => {
    expect(
      formatMoney(249_000, "HKD", {
        locale: LOCALE,
        currencyDisplay: "code",
      }).replace(/\u00a0/g, " "),
    ).toBe("HKD 2,490");
  });
});

describe("formatMoneyNumeric", () => {
  it("omits the currency symbol", () => {
    expect(formatMoneyNumeric(480_000, "HKD", LOCALE)).toBe("4,800");
  });
});

describe("formatMoneyPrefix", () => {
  it("returns the listing currency symbol", () => {
    expect(formatMoneyPrefix("HKD", { locale: LOCALE })).toBe("HK$");
  });
});

describe("splitFormattedMoney", () => {
  it("separates prefix and amount for rolling display", () => {
    expect(splitFormattedMoney(480_000, "HKD", LOCALE)).toEqual({
      prefix: "HK$",
      amount: "4,800",
    });
  });
});
