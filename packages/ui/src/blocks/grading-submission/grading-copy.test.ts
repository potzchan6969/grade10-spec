import { describe, expect, it } from "vitest";
import {
  fillGradingCopy,
  formatGradingDay,
  formatGradingMoment,
  formatGradingMoney,
} from "./grading-copy";

/**
 * The catalogs word a whole sentence in one key, so a block fills that key
 * rather than taking the sentence in pieces. A placeholder nobody answered is
 * a copy bug: it stops the render by name instead of printing a gap.
 */
describe("fillGradingCopy", () => {
  it("fills every placeholder from the values it is given", () => {
    expect(
      fillGradingCopy("{set} · {number} · matched in the catalogue", {
        set: "Base Set",
        number: "4/102",
      }),
    ).toBe("Base Set · 4/102 · matched in the catalogue");
  });

  it("fills the same placeholder wherever it reads", () => {
    expect(
      fillGradingCopy("{grade} or above, at {grade}", { grade: "PSA 9" }),
    ).toBe("PSA 9 or above, at PSA 9");
  });

  it("leaves a message with no placeholder as it was written", () => {
    expect(fillGradingCopy("Kept as you typed it · no reference", {})).toBe(
      "Kept as you typed it · no reference",
    );
  });

  it("refuses a placeholder nobody answered, by name", () => {
    expect(() =>
      fillGradingCopy("Only encapsulate at {grade} or above", {}),
    ).toThrow(/\{grade\}/);
  });
});

/**
 * A figure reads as it was given: the minor units and the code, in the locale
 * the consumer passed, and no other amount derived from it
 * (shared-ui-grading-submission-SC-55).
 */
describe("formatGradingMoney", () => {
  const amount = { amountMinor: 100000, currency: "HKD" };

  it("reads the amount in the locale it is given, with its currency", () => {
    expect(formatGradingMoney(amount, "en")).toBe("HK$1,000");
    expect(formatGradingMoney(amount, "zh-Hant")).toBe("HK$1,000");
  });

  it("reads another currency's minor units by that currency", () => {
    expect(formatGradingMoney({ amountMinor: 100000, currency: "JPY" })).toBe(
      "¥100,000",
    );
  });
});

/**
 * An instant reads in the zone it is given, so a drop-off at one in the
 * morning in Hong Kong is not the evening before in UTC
 * (shared-ui-grading-submission-SC-56).
 */
describe("formatGradingMoment and formatGradingDay", () => {
  const at = Date.UTC(2026, 5, 15, 17, 0);

  it("reads the time in the zone it is given", () => {
    expect(formatGradingMoment(at, { timeZone: "Asia/Hong_Kong" })).toBe(
      "16 Jun 2026, 01:00",
    );
    expect(formatGradingMoment(at, { timeZone: "UTC" })).toBe(
      "15 Jun 2026, 17:00",
    );
  });

  it("reads the day in the zone it is given", () => {
    expect(formatGradingDay(at, { timeZone: "Asia/Hong_Kong" })).toBe(
      "16 Jun 2026",
    );
    expect(formatGradingDay(at, { timeZone: "UTC" })).toBe("15 Jun 2026");
  });
});
