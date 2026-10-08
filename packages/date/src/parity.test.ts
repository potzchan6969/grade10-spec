import { getMessages } from "@grade10/i18n";
import { describe, expect, it } from "vitest";
// The store's second formatter, still in place while callers move off it.
// This file is deleted with `packages/ui/src/lib/format-datetime.ts`.
import * as previous from "../../ui/src/lib/format-datetime.ts";
import {
  formatActivityAt,
  formatCalendarDayLabel,
  formatCollectorDeadline,
  formatDay,
  formatMoment,
  formatTimeOfDay,
  formatViewerZoneName,
  formatZonedLocalMoment,
  formatZonedLocalTime,
} from "./index.ts";

const LOCALES = ["en", "zh-Hant", "zh-Hans", "ko"] as const;

const ZONES = [
  "UTC",
  "Asia/Hong_Kong",
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "America/New_York",
  "America/St_Johns",
  "Europe/London",
  "Australia/Lord_Howe",
  "Pacific/Kiritimati",
];

const INSTANTS = [
  "2026-01-01T00:00:00Z",
  "2026-02-28T23:59:59Z",
  "2026-03-08T06:59:00Z",
  "2026-03-08T07:00:00Z",
  "2026-03-29T00:59:00Z",
  "2026-03-29T01:00:00Z",
  "2026-08-24T02:00:00Z",
  "2026-09-01T12:00:00Z",
  "2026-10-04T14:59:00Z",
  "2026-10-25T00:59:00Z",
  "2026-11-01T05:59:00Z",
  "2026-11-01T06:00:00Z",
  "2026-12-31T23:30:00Z",
  "2028-02-29T16:30:00Z",
  "2099-07-04T09:05:00Z",
].map((instant) => Date.parse(instant));

const CALENDAR_DAYS = [
  "2026-01-01",
  "2026-09-03",
  "2026-12-25",
  "2028-02-29",
  "2026-10-26",
];

/** Every cell where the new text differs from the old, so one run names all of them. */
function differences(
  locale: (typeof LOCALES)[number],
  timeZone: string,
): string[] {
  const clock = { locale, timeZone };
  const found: string[] = [];
  const compare = (name: string, at: number, was: string, now: string) => {
    if (was !== now) {
      found.push(
        `${name} ${new Date(at).toISOString()}: was "${was}", now "${now}"`,
      );
    }
  };
  for (const at of INSTANTS) {
    compare(
      "day",
      at,
      previous.formatLocalDay(at, clock),
      formatDay(at, clock),
    );
    compare(
      "moment",
      at,
      previous.formatLocalMoment(at, clock),
      formatMoment(at, clock),
    );
    compare(
      "clock",
      at,
      previous.formatLocalTime(at, clock),
      formatTimeOfDay(at, clock),
    );
    compare(
      "zoned clock",
      at,
      previous.formatZonedLocalTime(at, clock),
      formatZonedLocalTime(at, clock),
    );
    compare(
      "zoned moment",
      at,
      previous.formatZonedLocalMoment(at, clock),
      formatZonedLocalMoment(at, clock),
    );
    compare(
      "collector deadline",
      at,
      previous.formatCollectorDeadline(at, { ...clock, prefix: "Ends" }),
      formatCollectorDeadline(at, { ...clock, prefix: "Ends" }),
    );
    compare(
      "zone name",
      at,
      previous.formatViewerZoneName(timeZone, at),
      formatViewerZoneName(timeZone, at),
    );
    compare(
      "utc day",
      at,
      previous.formatDay(at, locale),
      formatDay(at, { locale }),
    );
  }
  return found;
}

describe("the package says what the store's second formatter said", () => {
  for (const locale of LOCALES) {
    for (const timeZone of ZONES) {
      it(`${locale} on ${timeZone}`, () => {
        expect(differences(locale, timeZone)).toEqual([]);
      });
    }
  }

  it.each(LOCALES)("%s labels a calendar day as it did", (locale) => {
    for (const day of CALENDAR_DAYS) {
      expect(formatCalendarDayLabel(day, locale)).toBe(
        previous.formatCalendarDayLabel(day, locale),
      );
    }
  });

  it("words recent activity and older activity as it did", () => {
    const now = Date.UTC(2026, 7, 21, 12, 0);
    const copy = getMessages("grade10", "en").dates;
    for (const ageMs of [
      1_000,
      50_000,
      2 * 60_000,
      3 * 3_600_000,
      4 * 86_400_000,
      8 * 86_400_000,
      40 * 86_400_000,
    ]) {
      const options = {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        copy,
        now,
      } as const;
      expect(formatActivityAt(now - ageMs, options)).toBe(
        previous.formatActivityAt(now - ageMs, options),
      );
    }
  });
});
