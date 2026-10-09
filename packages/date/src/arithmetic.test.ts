import { describe, expect, it } from "vitest";
import {
  addDays,
  atOrBefore,
  calendarDaysBetween,
  endOfDayAfter,
  firstOfMonth,
  hourOf,
  startOfDayAfter,
  wholeMonthsBetween,
} from "./arithmetic.ts";

const HK = "Asia/Hong_Kong";

describe("the month a report is cut to", () => {
  it("opens the month on the platform's clock", () => {
    // 08:30 on 1 March in Hong Kong is still 28 February in UTC, so a month
    // read off the machine would open a day early for half the planet.
    expect(firstOfMonth(new Date("2026-03-01T00:30:00Z")).toISOString()).toBe(
      "2026-03-01T00:00:00.000Z",
    );
    expect(firstOfMonth(new Date("2026-02-28T16:30:00Z")).toISOString()).toBe(
      "2026-02-01T00:00:00.000Z",
    );
  });

  it("opens the month on the clock it is asked for", () => {
    // A ledger cut to "this month" in UTC would open the shop's March a day
    // early and count its last February evening twice.
    expect(
      firstOfMonth(new Date("2026-03-01T00:30:00Z"), HK).toISOString(),
    ).toBe("2026-02-28T16:00:00.000Z");
    expect(
      firstOfMonth(new Date("2026-02-28T16:30:00Z"), HK).toISOString(),
    ).toBe("2026-02-28T16:00:00.000Z");
  });

  it("keeps the boundary a plain instant, never an offset-carrying date", () => {
    // A boundary reaches a wire. A TZDate serializes as `...+08:00`, where
    // every other instant the platform sends is `...Z`.
    expect(
      firstOfMonth(new Date("2026-08-18T23:00:00Z"), HK)
        .toISOString()
        .endsWith("Z"),
    ).toBe(true);
  });
});

describe("days between two instants, on a stated clock", () => {
  it("counts the clock's midnights, not 24-hour spans", () => {
    // 23:30 and 00:30 in Hong Kong: an hour apart, and a day apart.
    const late = new Date("2026-06-23T15:30:00Z");
    const early = new Date("2026-06-23T16:30:00Z");
    expect(calendarDaysBetween(late, early, "Asia/Hong_Kong")).toBe(1);
    expect(calendarDaysBetween(early, late, "Asia/Hong_Kong")).toBe(-1);
    // The same hour on the platform's clock crosses nothing.
    expect(calendarDaysBetween(late, early)).toBe(0);
  });

  it("reads a week before a day's last millisecond as seven days", () => {
    // A due date is written as the last millisecond of 30 June in Hong Kong;
    // the morning of 23 June is a week before it, however many hours short of
    // seven times twenty-four that is.
    const due = new Date("2026-06-30T15:59:59.999Z");
    const morning = new Date("2026-06-23T01:00:00Z");
    expect(calendarDaysBetween(due, morning, "Asia/Hong_Kong")).toBe(-7);
    expect(calendarDaysBetween(due, due, "Asia/Hong_Kong")).toBe(0);
  });
});

describe("months between two instants, on a stated clock", () => {
  it("counts a month only once its day comes round again", () => {
    const from = new Date("2027-02-23T23:30:00Z");
    expect(
      wholeMonthsBetween(
        from,
        new Date("2027-03-23T08:00:00Z"),
        "Asia/Hong_Kong",
      ),
    ).toBe(0);
    expect(
      wholeMonthsBetween(
        from,
        new Date("2027-03-23T16:00:00Z"),
        "Asia/Hong_Kong",
      ),
    ).toBe(1);
  });

  it("counts the days of the clock it is given", () => {
    // Both instants fall on the 23rd in UTC and a day later in Hong Kong, so
    // the month has come round on one clock and not on the other.
    const from = new Date("2027-02-23T23:30:00Z");
    const to = new Date("2027-03-23T08:00:00Z");
    expect(wholeMonthsBetween(from, to)).toBe(1);
    expect(wholeMonthsBetween(from, to, "Asia/Hong_Kong")).toBe(0);
  });

  it("drops the time of day, so a month starts on its day", () => {
    const morning = new Date("2027-02-24T02:00:00Z");
    const night = new Date("2027-03-24T22:00:00Z");
    expect(wholeMonthsBetween(night, morning)).toBe(-1);
    expect(wholeMonthsBetween(morning, new Date("2027-03-24T00:30:00Z"))).toBe(
      1,
    );
  });

  it("is negative when to precedes from", () => {
    expect(
      wholeMonthsBetween(
        new Date("2027-03-24T00:00:00Z"),
        new Date("2027-02-24T00:00:00Z"),
      ),
    ).toBe(-1);
  });

  it("comes round on a shorter month's last day where the day does not exist", () => {
    const day = (value: string) => new Date(`${value}T00:00:00Z`);
    for (const from of ["2027-01-29", "2027-01-30", "2027-01-31"]) {
      expect(wholeMonthsBetween(day(from), day("2027-02-28"))).toBe(1);
    }
    expect(wholeMonthsBetween(day("2027-01-31"), day("2027-02-27"))).toBe(0);
    expect(wholeMonthsBetween(day("2027-03-31"), day("2027-04-30"))).toBe(1);
  });

  it("reads 28 February as the month's end in a leap year too", () => {
    const day = (value: string) => new Date(`${value}T00:00:00Z`);
    expect(wholeMonthsBetween(day("2028-01-29"), day("2028-02-28"))).toBe(1);
  });
});

describe("the start of a day some days on, on a stated clock", () => {
  it("counts the clock's days from the day the instant falls on", () => {
    // 07:30 on 26 November in Hong Kong, still the 25th in UTC.
    const at = new Date("2026-11-25T23:30:00Z");
    expect(startOfDayAfter(at, 90, "Asia/Hong_Kong")).toEqual(
      new Date("2027-02-23T16:00:00Z"),
    );
    expect(startOfDayAfter(at, 0, "Asia/Hong_Kong")).toEqual(
      new Date("2026-11-25T16:00:00Z"),
    );
    expect(startOfDayAfter(at, 90)).toEqual(new Date("2027-02-23T00:00:00Z"));
  });

  it("counts calendar days across a summer-time change, not 24-hour spans", () => {
    // 23:30 on 7 March in Los Angeles; the 8th is 23 hours long.
    const at = new Date("2026-03-08T07:30:00Z");
    expect(startOfDayAfter(at, 2, "America/Los_Angeles")).toEqual(
      new Date("2026-03-09T07:00:00Z"),
    );
  });

  it("returns a plain instant, never a zoned date", () => {
    const at = startOfDayAfter(
      new Date("2026-11-25T23:30:00Z"),
      1,
      "Asia/Hong_Kong",
    );
    expect(at.constructor).toBe(Date);
    expect(at.toISOString()).toBe("2026-11-26T16:00:00.000Z");
  });

  it("fails by name on a zone no calendar can be read on", () => {
    expect(() =>
      startOfDayAfter(new Date("2026-06-08T03:00:00.000Z"), 7, "Not/AZone"),
    ).toThrow(/cannot be read on the zone "Not\/AZone"/);
  });
});

describe("endOfDayAfter", () => {
  it("names the last instant of the day, on the zone's calendar", () => {
    // 07:30 on 26 November in Hong Kong, still the 25th in UTC.
    expect(
      endOfDayAfter(new Date("2026-11-25T23:30:00Z"), 14, "Asia/Hong_Kong"),
    ).toEqual(new Date("2026-12-10T15:59:59.999Z"));
  });

  it("counts calendar days across a summer-time change, not 24-hour spans", () => {
    // 00:30 on 13 October in London, summer time; the clocks go back on the 25th.
    expect(
      endOfDayAfter(new Date("2026-10-12T23:30:00Z"), 14, "Europe/London"),
    ).toEqual(new Date("2026-10-27T23:59:59.999Z"));
  });

  it("fails by name on a zone no calendar can be read on", () => {
    expect(() =>
      endOfDayAfter(new Date("2026-06-08T03:00:00.000Z"), 7, "Not/AZone"),
    ).toThrow(/cannot be read on the zone "Not\/AZone"/);
  });
});

describe("atOrBefore", () => {
  it("counts the limit itself on both sides", () => {
    const limit = new Date("2027-01-08T16:00:00.000Z");
    expect(atOrBefore(new Date(limit.getTime() - 1), limit)).toBe(true);
    expect(atOrBefore(limit, limit)).toBe(true);
    expect(atOrBefore(new Date(limit.getTime() + 1), limit)).toBe(false);
  });
});

describe("the hour of the day, on a stated clock", () => {
  it("reads the clock it is handed", () => {
    const at = new Date("2026-06-23T01:00:00Z");
    expect(hourOf(at, "Asia/Hong_Kong")).toBe(9);
    expect(hourOf(at)).toBe(1);
    // Five past the shop's midnight is hour zero of the next day.
    expect(hourOf(new Date("2026-06-23T16:05:00Z"), "Asia/Hong_Kong")).toBe(0);
  });
});

describe("addDays", () => {
  it("moves exact multiples of 24 hours", () => {
    const at = new Date("2026-06-23T01:00:00Z");
    expect(addDays(at, 1)).toEqual(new Date("2026-06-24T01:00:00Z"));
    expect(addDays(at, 7)).toEqual(new Date("2026-06-30T01:00:00Z"));
  });

  it("takes a negative count", () => {
    const at = new Date("2026-06-23T01:00:00Z");
    expect(addDays(at, -1)).toEqual(new Date("2026-06-22T01:00:00Z"));
  });

  it("never reads a wall clock, so a DST boundary does not bend it", () => {
    // A duration of exactly 24 hours, whatever the zone that reads it did on
    // the way — that is the whole point of the name.
    const before = new Date("2026-03-07T10:00:00Z");
    const after = addDays(before, 1);
    expect(after.getTime() - before.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});
