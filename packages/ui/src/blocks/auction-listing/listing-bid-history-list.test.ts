import { getMessages } from "@grade10/i18n";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ListingBidHistoryRow, ShippedLocale } from "../../index";
import {
  ClockProvider,
  createFrameClockStore,
  ListingBidHistoryList,
} from "../../index";

/** The page's clock, thirty days after the older rows, so they read as a local moment. */
const NOW = Date.UTC(2026, 9, 1);
const FIVE_MINUTES_AGO = NOW - 5 * 60 * 1000;
const NAMES_A_ZONE = /\b(UTC|GMT|HKT|JST|PDT|EDT|EST)\b|GMT[+-]/;

function row(id: string, acceptedAtMs: number): ListingBidHistoryRow {
  return {
    id,
    initials: `${id}@example.com`,
    amountMinor: 100_000,
    acceptedAtMs,
  };
}

/** The text of every node the list draws, in order. */
function drawn(
  rows: ListingBidHistoryRow[],
  locale: ShippedLocale,
  timeZone: string,
): string[] {
  const markup = renderToStaticMarkup(
    createElement(ClockProvider, {
      store: createFrameClockStore(() => NOW),
      children: createElement(ListingBidHistoryList, {
        rows,
        currency: "HKD",
        locale,
        timeZone,
        activityTimeCopy: getMessages("grade10", locale).dates,
      }),
    }),
  );
  return markup
    .split(/<[^>]*>/)
    .map((text) => text.trim())
    .filter(Boolean);
}

describe("a bid history row's time reads in the viewer's zone", () => {
  // shared-dates-and-times-SC-23, shared-dates-and-times-SC-24,
  // shared-dates-and-times-US1-TC1-1
  it.each([
    ["UTC", "1 Sep 2026, 23:30"],
    ["Asia/Hong_Kong", "2 Sep 2026, 07:30"],
    ["America/New_York", "1 Sep 2026, 19:30"],
    ["Asia/Kolkata", "2 Sep 2026, 05:00"],
    ["Asia/Kathmandu", "2 Sep 2026, 05:15"],
    ["Pacific/Kiritimati", "2 Sep 2026, 13:30"],
    ["Pacific/Pago_Pago", "1 Sep 2026, 12:30"],
  ])("reads an older row in %s as %s, naming no zone", (timeZone, moment) => {
    const texts = drawn(
      [row("older", Date.UTC(2026, 8, 1, 23, 30))],
      "en",
      timeZone,
    );

    expect(texts).toContain(moment);
    expect(texts.join(" ")).not.toMatch(NAMES_A_ZONE);
  });

  // shared-dates-and-times-SC-24, shared-dates-and-times-US1-TC2-1
  it.each(["Asia/Hong_Kong", "Pacific/Kiritimati", "Pacific/Pago_Pago"])(
    "reads a row accepted five minutes ago in relative form in %s",
    (timeZone) => {
      const texts = drawn([row("recent", FIVE_MINUTES_AGO)], "en", timeZone);

      expect(texts).toContain("5 min ago");
      expect(texts.join(" ")).not.toMatch(/\bhr\b|\bsec\b|\bin\b/);
      expect(texts.join(" ")).not.toMatch(NAMES_A_ZONE);
    },
  );
});

describe("a bid history list takes the supplied locale and zone together", () => {
  const OLDER = Date.UTC(2026, 8, 1, 12, 0);
  const rows = [row("recent", FIVE_MINUTES_AGO), row("older", OLDER)];

  // shared-ui-auction-listing-SC-13, shared-ui-auction-listing-US1-TC11-1
  it.each([
    ["Asia/Hong_Kong", "1 Sep 2026, 20:00"],
    ["Asia/Tokyo", "1 Sep 2026, 21:00"],
  ])("reads the older row in en and %s as %s", (timeZone, moment) => {
    const texts = drawn(rows, "en", timeZone);

    expect(texts).toContain("5 min ago");
    expect(texts).toContain(moment);
    expect(texts.join(" ")).not.toMatch(NAMES_A_ZONE);
  });

  // A zh-Hant month's wording is not asserted: the day, the year and the clock are.
  it.each([
    ["Asia/Tokyo", "1", "21:00"],
    ["America/New_York", "1", "08:00"],
    ["Pacific/Kiritimati", "2", "02:00"],
  ])(
    "reads the older row in zh-Hant and %s as day %s at %s",
    (timeZone, day, clock) => {
      const texts = drawn(rows, "zh-Hant", timeZone);
      const older = texts.find((text) => /2026, \d\d:\d\d$/.test(text));

      expect(texts).toContain("5 分鐘前");
      expect(older).toBeDefined();
      expect(older?.split(" ")[0]).toBe(day);
      expect(older?.endsWith(`2026, ${clock}`)).toBe(true);
      expect(texts.join(" ")).not.toMatch(NAMES_A_ZONE);
    },
  );

  // An omitted instant fails to compile, so each row keeps the instant it was
  // accepted at as data: the package typecheck, through the directive below, is
  // the proof.
  it("requires each row's accepted instant", () => {
    // @ts-expect-error `acceptedAtMs` is required
    const withoutInstant: ListingBidHistoryRow = {
      id: "row",
      initials: "row@example.com",
      amountMinor: 100_000,
    };
    expect(withoutInstant.id).toBe("row");
  });
});
