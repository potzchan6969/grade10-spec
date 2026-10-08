import { locales } from "@grade10/i18n";
import { describe, expect, it } from "vitest";
import {
  formatDay,
  formatDeadline,
  formatEvent,
  formatEventTime,
  formatMoment,
  formatMonth,
  formatMonthAlone,
  formatMonthName,
  formatMonthNameAlone,
  formatShortDay,
  formatTimeOfDay,
  formatWeekdayDay,
  formatWeekdayMoment,
  formatZone,
} from "./shapes.ts";

/** 22:00:14 in Hong Kong, where this suite runs. */
const INSTANT = new Date("2026-08-19T14:00:14Z");

describe("the suite's own zone", () => {
  it("runs somewhere other than UTC, or it proves nothing", () => {
    expect(new Date().getTimezoneOffset()).not.toBe(0);
  });
});

describe("the shapes", () => {
  it("writes a day with no time of day", () => {
    expect(formatDay(INSTANT)).toBe("19 Aug 2026");
  });

  it("writes a moment to the minute", () => {
    expect(formatMoment(INSTANT)).toBe("19 Aug 2026, 14:00");
  });

  it("writes an event to the second", () => {
    expect(formatEvent(INSTANT)).toBe("19 Aug 2026, 14:00:14");
  });

  it("writes a deadline with the zone it is stated in", () => {
    expect(formatDeadline(INSTANT)).toBe("19 Aug 2026, 14:00 UTC");
  });

  it("writes a time of day with no day around it", () => {
    expect(formatTimeOfDay(INSTANT)).toBe("14:00");
  });

  it("writes that time on the clock it is handed", () => {
    expect(formatTimeOfDay(INSTANT, { timeZone: "Asia/Hong_Kong" })).toBe(
      "22:00",
    );
  });

  it("writes an event's time of day to the second, under a day already stated", () => {
    expect(formatEventTime(INSTANT, { timeZone: "Asia/Hong_Kong" })).toBe(
      "22:00:14",
    );
  });

  it("writes a day, a month and a heading's day on the clock handed", () => {
    // 22:00 in Hong Kong on 31 Aug is already 1 Sep there.
    const late = new Date("2026-08-31T16:30:00Z");
    const hk = { timeZone: "Asia/Hong_Kong" };
    expect(formatShortDay(late)).toBe("31 Aug");
    expect(formatShortDay(late, hk)).toBe("1 Sep");
    expect(formatMonth(late, hk)).toBe("Sep 2026");
    expect(formatMonthName(late, hk)).toBe("September 2026");
    expect(formatMonthAlone(late, hk)).toBe("Sep");
    expect(formatMonthNameAlone(late, hk)).toBe("September");
    expect(formatWeekdayDay(late, hk)).toBe("Tuesday 1 Sep 2026");
  });

  it("orders two events a few seconds apart", () => {
    const later = new Date("2026-08-19T14:00:25Z");
    expect(formatEvent(INSTANT)).not.toBe(formatEvent(later));
  });

  it("places a slot by its weekday and time on the clock it is stated on", () => {
    expect(
      formatWeekdayMoment(new Date("2026-10-30T06:30:00Z"), {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
      }),
    ).toBe("Fri 30 Oct, 14:30");
  });
});

describe("an instant is a Date or its epoch milliseconds", () => {
  it("writes both the same", () => {
    const ms = INSTANT.getTime();
    expect(formatDay(ms)).toBe(formatDay(INSTANT));
    expect(formatMoment(ms, { timeZone: "Asia/Hong_Kong" })).toBe(
      "19 Aug 2026, 22:00",
    );
    expect(formatDeadline(ms, { timeZone: "Asia/Tokyo" })).toBe(
      "19 Aug 2026, 23:00 GMT+9",
    );
  });
});

describe("one zone, for every reader", () => {
  it("states the instant in UTC, not in the machine's own zone", () => {
    expect(new Date(INSTANT).getHours()).toBe(22);
    expect(formatMoment(INSTANT)).toContain("14:00");
  });

  it("shows the UTC day for an instant that falls on two", () => {
    // 00:30 on 20 Aug in Hong Kong, still 19 Aug in UTC.
    const nearMidnight = new Date("2026-08-19T16:30:00Z");
    expect(nearMidnight.getDate()).toBe(20);
    expect(formatDay(nearMidnight)).toBe("19 Aug 2026");
  });

  it("ignores the machine's zone rather than following it", () => {
    expect(formatDeadline(INSTANT)).toBe("19 Aug 2026, 14:00 UTC");
    expect(formatMoment(INSTANT, { timeZone: "Asia/Hong_Kong" })).toContain(
      "22:00",
    );
  });
});

describe("the format is the platform's, the words are the language's", () => {
  it("words a month in a language the platform ships", () => {
    expect(formatDay(INSTANT, { locale: "zh-hant" })).toBe("19 8月 2026");
  });

  it("keeps the platform's ordering whatever the language", () => {
    const english = formatMoment(INSTANT, { locale: "en" });
    const chinese = formatMoment(INSTANT, { locale: "zh-hant" });
    expect(english.startsWith("19 ")).toBe(true);
    expect(chinese.startsWith("19 ")).toBe(true);
    expect(english.endsWith(" 2026, 14:00")).toBe(true);
    expect(chinese.endsWith(" 2026, 14:00")).toBe(true);
  });

  it("reads English when no language is named", () => {
    expect(formatDay(INSTANT)).toBe(formatDay(INSTANT, { locale: "en" }));
  });

  it("refuses a language the platform has no words for", () => {
    expect(() => formatDay(INSTANT, { locale: "fr" })).toThrow(/"fr"/);
    expect(() => formatDay(INSTANT, { locale: "fr" })).toThrow(
      /@grade10\/date/,
    );
  });
});

describe("a language tag is matched the way BCP-47 spells it", () => {
  it("takes the canonical casing as readily as the catalog's", () => {
    const canonical = formatDay(INSTANT, { locale: "zh-Hant" });
    expect(canonical).toBe(formatDay(INSTANT, { locale: "zh-hant" }));
    expect(canonical).toBe("19 8月 2026");
    expect(formatDay(INSTANT, { locale: "EN" })).toBe("19 Aug 2026");
  });
});

describe("the languages this package words a date in", () => {
  it("is exactly the set @grade10/i18n ships", () => {
    // The map is a copy of that list, and a copy drifts. A catalog added
    // without a date-fns locale beside it would throw on the first date the
    // new language rendered - here, at build time, instead.
    for (const locale of locales) {
      expect(() => formatDay(INSTANT, { locale })).not.toThrow();
    }
    expect(() => formatDay(INSTANT, { locale: "fr" })).toThrow();
  });
});

describe("an instant that is not one", () => {
  it("stops rather than rendering a placeholder", () => {
    const notADate = new Date("the fifteenth of never");
    for (const render of [
      formatDay,
      formatMoment,
      formatEvent,
      formatDeadline,
      formatTimeOfDay,
    ]) {
      expect(() => render(notADate)).toThrow(RangeError);
      expect(() => render(notADate)).toThrow(/Invalid time value/);
      expect(() => render(Number.NaN)).toThrow(RangeError);
    }
  });
});

describe("a deadline names the zone it is actually stated in", () => {
  it("says UTC for the platform's own zone, not GMT+0", () => {
    expect(formatDeadline(INSTANT, { timeZone: "UTC" })).toBe(
      "19 Aug 2026, 14:00 UTC",
    );
  });

  it("never labels another zone's clock UTC", () => {
    const tokyo = formatDeadline(INSTANT, { timeZone: "Asia/Tokyo" });
    expect(tokyo).toContain("23:00");
    expect(tokyo).not.toContain("UTC");
    expect(tokyo).toBe("19 Aug 2026, 23:00 GMT+9");
  });
});

describe("a heading names the clock its times are read on", () => {
  it("names the platform's own zone UTC, as a deadline does", () => {
    expect(formatZone(INSTANT)).toBe("UTC");
    expect(formatZone(INSTANT, "UTC")).toBe("UTC");
  });

  it("names another zone by its offset at that instant", () => {
    expect(formatZone(INSTANT, "Asia/Hong_Kong")).toBe("GMT+8");
    expect(formatZone(new Date("2026-07-15T12:00:00Z"), "Europe/London")).toBe(
      "GMT+1",
    );
    expect(
      formatZone(new Date("2026-03-30T12:00:00Z"), "America/St_Johns"),
    ).toBe("GMT-2:30");
  });
});

describe("a zone the platform does not recognise stops the render", () => {
  // shared-dates-and-times-SC-34, shared-dates-and-times-US1-TC14-1
  it.each(["Mars/Olympus", "Hong_Kong", "America/New York"])(
    "names %s",
    (timeZone) => {
      for (const render of [
        formatDay,
        formatMoment,
        formatEvent,
        formatDeadline,
        formatTimeOfDay,
        formatEventTime,
      ]) {
        expect(() => render(INSTANT, { timeZone })).toThrow(timeZone);
      }
      expect(() => formatZone(INSTANT, timeZone)).toThrow(timeZone);
    },
  );
});
