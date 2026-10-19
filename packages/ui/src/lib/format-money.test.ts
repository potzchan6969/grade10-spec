import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  currencyExponent,
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
  fromMinorUnits,
  SUPPORTED_CURRENCY_CODES,
  splitFormattedMoney,
  toMinorUnits,
} from "./format-money";

const LOCALE = "en-HK";

const MONEY_PAGE = new URL(
  "../../../../docs/prds/platform/shared/money-amounts.md",
  import.meta.url,
);

function currenciesStatedByPage(): Record<string, number> {
  const stated: Record<string, number> = {};
  for (const line of readFileSync(MONEY_PAGE, "utf8").split("\n")) {
    const row = /^\| (\d) \| ([A-Z]{3}(?:, [A-Z]{3})*) \|$/.exec(line);
    if (!row) continue;
    for (const code of row[2].split(", ")) stated[code] = Number(row[1]);
  }
  return stated;
}

describe("the currency table", () => {
  it("holds exactly the codes and digits the money-amounts page states", () => {
    const stated = currenciesStatedByPage();
    expect(SUPPORTED_CURRENCY_CODES).toEqual(Object.keys(stated).sort());
    for (const code of SUPPORTED_CURRENCY_CODES) {
      expect(currencyExponent(code)).toBe(stated[code]);
    }
  });
});

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
