import { describe, expect, it } from "vitest";
import {
  dayValue,
  endOfDay,
  formatCalendarDay,
  formatCalendarDayLabel,
  formatWeekday,
  formatWeekdayOfMonth,
  isCalendarDay,
  startOfDay,
} from "./calendar-day.ts";

const HK = "Asia/Hong_Kong";

describe("a calendar day and an instant", () => {
  it("survives the round trip a form makes", () => {
    expect(dayValue(startOfDay("2026-03-01"))).toBe("2026-03-01");
    expect(dayValue(endOfDay("2026-03-31"))).toBe("2026-03-31");
  });

  it("opens a window as the day begins and closes it as the day ends", () => {
    const from = startOfDay("2026-03-01");
    const until = endOfDay("2026-03-01");

    expect(from?.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(until?.toISOString()).toBe("2026-03-01T23:59:59.999Z");
    expect(until?.getTime()).toBeGreaterThan(
      new Date("2026-03-01T12:00:00Z").getTime(),
    );
  });

  it("types the same day from any machine, whatever its zone", () => {
    // This suite runs at +08. A bridge that read the machine's zone would
    // open the window on 28 February and be a day out for half the planet -
    // and would pass on a UTC machine, which is what CI would be.
    expect(startOfDay("2026-03-01")?.toISOString()).toBe(
      "2026-03-01T00:00:00.000Z",
    );
    expect(dayValue(new Date("2026-03-01T16:30:00Z"))).toBe("2026-03-01");
  });

  it("reads an empty field as no boundary at all", () => {
    expect(startOfDay("")).toBeUndefined();
    expect(endOfDay("")).toBeUndefined();
    expect(dayValue(null)).toBe("");
    expect(dayValue(undefined)).toBe("");
  });
});

describe("a day belongs to a clock, and the caller names it", () => {
  /** Hong Kong is eight hours ahead, so 23:00 UTC is already tomorrow there. */
  const EVENING_BEFORE = new Date("2026-08-18T23:00:00Z");
  /** 16:30 in Hong Kong: 19 August on both clocks, so the zone changes nothing. */
  const MIDDLE_OF_THE_DAY = new Date("2026-08-19T08:30:00Z");

  it("reads the shop's day where the two clocks disagree", () => {
    expect(dayValue(EVENING_BEFORE)).toBe("2026-08-18");
    expect(dayValue(EVENING_BEFORE, HK)).toBe("2026-08-19");
  });

  it("reads one day where the two clocks agree", () => {
    expect(dayValue(MIDDLE_OF_THE_DAY)).toBe("2026-08-19");
    expect(dayValue(MIDDLE_OF_THE_DAY, HK)).toBe("2026-08-19");
  });

  it("opens and closes the shop's own 24 hours", () => {
    expect(startOfDay("2026-08-19", HK)?.toISOString()).toBe(
      "2026-08-18T16:00:00.000Z",
    );
    expect(endOfDay("2026-08-19", HK)?.toISOString()).toBe(
      "2026-08-19T15:59:59.999Z",
    );
  });

  it("survives the round trip on whichever clock it was typed", () => {
    expect(dayValue(startOfDay("2026-08-19", HK), HK)).toBe("2026-08-19");
    expect(dayValue(endOfDay("2026-08-19", HK), HK)).toBe("2026-08-19");
  });

  it("keeps every boundary a plain instant, never an offset-carrying date", () => {
    // A boundary reaches a wire. A TZDate serializes as `...+08:00`, where
    // every other instant the platform sends is `...Z`.
    expect(startOfDay("2026-08-19", HK)?.toISOString().endsWith("Z")).toBe(
      true,
    );
    expect(endOfDay("2026-08-19", HK)?.toISOString().endsWith("Z")).toBe(true);
  });
});

describe("a day that exists", () => {
  it("takes a yyyy-MM-dd day the calendar has, a leap day in a leap year among them", () => {
    expect(isCalendarDay("2026-12-04")).toBe(true);
    expect(isCalendarDay("2028-02-29")).toBe(true);
  });

  it("refuses a day the calendar does not have, which parses to some other day", () => {
    expect(isCalendarDay("2026-02-29")).toBe(false);
    expect(isCalendarDay("2026-04-31")).toBe(false);
    expect(isCalendarDay("2026-13-01")).toBe(false);
  });

  it("refuses anything but the one written shape", () => {
    expect(isCalendarDay("2026-12-4")).toBe(false);
    expect(isCalendarDay("20261204")).toBe(false);
    expect(isCalendarDay("2026-12-04T00:00:00Z")).toBe(false);
    expect(isCalendarDay("4 Dec 2026")).toBe(false);
    expect(isCalendarDay("")).toBe(false);
  });
});

describe("a stored calendar day, worded", () => {
  it("words a calendar day on no zone - the same words wherever the reader stands (grading finding 22)", () => {
    expect(formatCalendarDay("2026-03-01", "en")).toBe("1 Mar 2026");
  });

  it("throws rather than silencing a stored value that is not a calendar day", () => {
    expect(() => formatCalendarDay("not-a-day", "en")).toThrow(
      /not a calendar day/,
    );
    expect(() => formatWeekdayOfMonth("not-a-day", "en")).toThrow(
      /not a calendar day/,
    );
  });

  it("words a calendar day by its weekday, for a picker under a stated month or with its own", () => {
    expect(formatWeekdayOfMonth("2026-10-26", "en")).toBe("Mon 26");
    expect(formatWeekday("2026-10-30", "en")).toBe("Fri 30 Oct");
  });
});

describe("formatCalendarDayLabel", () => {
  it("renders month, day, and weekday for English", () => {
    expect(formatCalendarDayLabel("2026-09-03")).toBe("Sep 3, Thurs");
  });

  // A Chinese month keeps its unit, as the collector dates do, and a Korean
  // month already does; the day and the weekday follow as in English.
  it.each([
    ["zh-Hant", "9月 3, 週四", "12月 25, 週五"],
    ["zh-Hans", "9月 3, 周四", "12月 25, 周五"],
    ["ko", "9월 3, 목", "12월 25, 금"],
  ] as const)("keeps the month's unit in %s", (locale, september, december) => {
    expect(formatCalendarDayLabel("2026-09-03", locale)).toBe(september);
    expect(formatCalendarDayLabel("2026-12-25", locale)).toBe(december);
  });

  it("refuses a malformed calendar day", () => {
    expect(() => formatCalendarDayLabel("2026-09")).toThrow(/calendar day/);
  });

  it("refuses a language the platform has no words for", () => {
    expect(() => formatCalendarDayLabel("2026-09-03", "fr")).toThrow(/"fr"/);
  });
});
