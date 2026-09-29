import { describe, expect, it } from "vitest";
import {
  formatGradingDay,
  formatGradingMoment,
  formatGradingMoney,
  type GradingZonedProps,
} from "./grading-copy";

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

  it("takes no day without the consumer's zone", () => {
    // @ts-expect-error the zone is required: no block carries one of its own
    const unzoned: GradingZonedProps = { locale: "en" };
    expect(unzoned.timeZone).toBeUndefined();
  });
});
