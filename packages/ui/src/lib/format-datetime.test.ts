import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_NOW_MS,
} from "./datetime-fixtures";
import {
  ACTIVITY_RELATIVE_MAX_MS,
  formatActivityAt,
  formatCalendarDayLabel,
  formatCollectorDeadline,
  formatDay,
  formatListingEnds,
  formatLocalDay,
  formatLocalMoment,
  formatLocalTime,
  formatRelativeAt,
  formatViewerZoneName,
  formatZonedLocalMoment,
  isPastActivityCap,
  JUST_NOW_MAX_MS,
  resolveActivityNow,
  resolveShippedLocale,
} from "./format-datetime";

const COPY = FIXTURE_ACTIVITY_TIME_COPY;
const NOW = FIXTURE_NOW_MS;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

describe("formatRelativeAt", () => {
  it("returns justNow below 45 seconds", () => {
    expect(formatRelativeAt(NOW - 44_000, { copy: COPY, now: NOW })).toBe(
      "Just now",
    );
  });

  it("enters seconds tier at 45 seconds", () => {
    expect(formatRelativeAt(NOW - 45_000, { copy: COPY, now: NOW })).toBe(
      "45 sec ago",
    );
  });

  it("floors minutes", () => {
    expect(
      formatRelativeAt(NOW - (2 * 60_000 + 30_000), {
        copy: COPY,
        now: NOW,
      }),
    ).toBe("2 min ago");
  });

  it("floors hours", () => {
    expect(
      formatRelativeAt(NOW - 3 * HOUR_MS - 20 * 60_000, {
        copy: COPY,
        now: NOW,
      }),
    ).toBe("3 hr ago");
  });

  it("floors days below the activity cap", () => {
    expect(
      formatRelativeAt(NOW - 4 * DAY_MS - 12 * HOUR_MS, {
        copy: COPY,
        now: NOW,
      }),
    ).toBe("4 days ago");
  });

  it("throws at or beyond the relative cap", () => {
    expect(() =>
      formatRelativeAt(NOW - ACTIVITY_RELATIVE_MAX_MS, {
        copy: COPY,
        now: NOW,
      }),
    ).toThrow(/relative cap/);
  });

  it("throws for future instants", () => {
    expect(() =>
      formatRelativeAt(NOW + 1_000, { copy: COPY, now: NOW }),
    ).toThrow(/past/);
  });
});

describe("formatLocalMoment", () => {
  // shared-dates-and-times-SC-23
  const at = Date.UTC(2026, 7, 24, 2, 0);

  it("renders collector shape without a zone suffix", () => {
    expect(
      formatLocalMoment(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).toBe("24 Aug 2026, 10:00");
    expect(
      formatLocalMoment(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).not.toContain("UTC");
    expect(
      formatLocalMoment(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).not.toContain("HKT");
  });

  it("shifts clock values by timezone", () => {
    const hongKong = formatLocalMoment(at, {
      locale: "en",
      timeZone: "Asia/Hong_Kong",
    });
    const newYork = formatLocalMoment(at, {
      locale: "en",
      timeZone: "America/New_York",
    });
    expect(hongKong).not.toBe(newYork);
    expect(newYork).toBe("23 Aug 2026, 22:00");
  });
});

describe("formatLocalDay and formatLocalTime", () => {
  const at = Date.UTC(2026, 7, 30, 9, 15);

  it("splits the collector moment into day and clock", () => {
    expect(
      formatLocalDay(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).toBe("30 Aug 2026");
    expect(
      formatLocalTime(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).toBe("17:15");
  });
});

describe("a Chinese or Korean month keeps its unit in a collector date", () => {
  const at = Date.UTC(2026, 8, 1, 12, 0);

  it.each([
    ["zh-Hant", "1 9月 2026"],
    ["zh-Hans", "1 9月 2026"],
    ["ko", "1 9월 2026"],
  ] as const)(
    "%s reads September as the same month the UTC day reads",
    (locale, day) => {
      const options = { locale, timeZone: "Asia/Hong_Kong" };

      expect(formatLocalDay(at, options)).toBe(day);
      expect(formatLocalMoment(at, options)).toBe(`${day}, 20:00`);
      expect(formatZonedLocalMoment(at, options)).toBe(`${day}, 20:00 HKT`);
      expect(formatCollectorDeadline(at, { ...options, prefix: "Ends" })).toBe(
        `Ends ${day}, 20:00 HKT`,
      );
    },
  );

  it.each(["en", "zh-Hant", "zh-Hans", "ko"] as const)(
    "%s reads the local day of a UTC viewer as the UTC day",
    (locale) => {
      expect(formatLocalDay(at, { locale, timeZone: "UTC" })).toBe(
        formatDay(at, locale),
      );
    },
  );
});

describe("formatCalendarDayLabel", () => {
  it("renders month, day, and weekday for English", () => {
    expect(formatCalendarDayLabel("2026-09-03")).toBe("Sep 3, Thurs");
  });

  it("refuses a malformed calendar day", () => {
    expect(() => formatCalendarDayLabel("2026-09")).toThrow(/calendar day/);
  });
});

describe("resolveActivityNow", () => {
  it("bumps a stale tick forward when a row is newer than the last tick", () => {
    const at = Date.now();
    const staleTick = at - 8_000;
    expect(resolveActivityNow(staleTick, at)).toBeGreaterThanOrEqual(at);
  });

  it("keeps a fixed reference clock when instants are already past", () => {
    expect(resolveActivityNow(NOW, NOW - 2 * 60_000)).toBe(NOW);
  });

  it("never reads the device clock, which may run fast", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW + 5 * 60_000);
    try {
      expect(resolveActivityNow(NOW - 20_000, NOW - 5_000)).toBe(NOW - 5_000);
      expect(
        formatActivityAt(NOW - 5_000, {
          locale: "en",
          timeZone: "Asia/Hong_Kong",
          copy: COPY,
          now: NOW - 20_000,
        }),
      ).toBe("Just now");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("formatActivityAt", () => {
  // shared-dates-and-times-SC-24
  it("formats live bids recorded after the last tick", () => {
    const at = Date.now();
    expect(
      formatActivityAt(at, {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        copy: COPY,
        now: at - 8_000,
      }),
    ).toBe("Just now");
  });
  it("uses relative tiers inside the cap", () => {
    expect(
      formatActivityAt(NOW - 2 * 60_000, {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        copy: COPY,
        now: NOW,
      }),
    ).toBe("2 min ago");
  });

  it("falls back to local moment at eight days", () => {
    const at = NOW - 8 * DAY_MS;
    const label = formatActivityAt(at, {
      locale: "en",
      timeZone: "Asia/Hong_Kong",
      copy: COPY,
      now: NOW,
    });
    expect(label).toBe("13 Aug 2026, 20:00");
    expect(label).not.toContain("UTC");
  });
});

describe("formatCollectorDeadline", () => {
  // shared-dates-and-times-SC-12, shared-dates-and-times-SC-29
  it("prefixes a local moment with the viewer's zone name", () => {
    const at = Date.UTC(2026, 8, 1, 18, 0);
    expect(
      formatCollectorDeadline(at, {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        prefix: "Ends",
      }),
    ).toBe("Ends 2 Sep 2026, 02:00 HKT");
  });

  it("names the viewer's zone, so New York reads EDT not HKT", () => {
    const at = Date.UTC(2026, 8, 1, 18, 0);
    const hk = formatListingEnds(at, {
      locale: "en",
      timeZone: "Asia/Hong_Kong",
    });
    const ny = formatListingEnds(at, {
      locale: "en",
      timeZone: "America/New_York",
    });
    expect(hk).not.toBe(ny);
    expect(hk).toMatch(/ HKT$/);
    expect(ny).toMatch(/ EDT$/);
    expect(ny).not.toContain("HKT");
  });
});

describe("formatViewerZoneName", () => {
  it("names Hong Kong as HKT and New York in September as EDT", () => {
    const at = Date.UTC(2026, 8, 1);
    expect(formatViewerZoneName("Asia/Hong_Kong", at)).toBe("HKT");
    expect(formatViewerZoneName("America/New_York", at)).toBe("EDT");
  });
});

describe("formatZonedLocalMoment", () => {
  it("appends the viewer zone to the local moment", () => {
    const at = Date.UTC(2026, 8, 1, 18, 0);
    expect(
      formatZonedLocalMoment(at, {
        locale: "en",
        timeZone: "America/New_York",
      }),
    ).toBe("1 Sep 2026, 14:00 EDT");
  });
});

const deadlineIn = (
  at: number,
  timeZone: string,
  locale: "en" | "ko" = "en",
): string => formatCollectorDeadline(at, { locale, timeZone, prefix: "Ends" });

describe("a deadline names the zone in force at its instant", () => {
  // shared-dates-and-times-SC-30, shared-dates-and-times-US1-TC3-1
  it.each([
    ["a September close", "2026-09-01T12:00:00Z", "Ends 1 Sep 2026, 08:00 EDT"],
    ["a January close", "2027-01-15T12:00:00Z", "Ends 15 Jan 2027, 07:00 EST"],
    [
      "one minute before the clocks go forward",
      "2027-03-14T06:59:00Z",
      "Ends 14 Mar 2027, 01:59 EST",
    ],
    [
      "the moment the clocks go forward",
      "2027-03-14T07:00:00Z",
      "Ends 14 Mar 2027, 03:00 EDT",
    ],
    [
      "one minute before the clocks go back",
      "2027-11-07T05:59:00Z",
      "Ends 7 Nov 2027, 01:59 EDT",
    ],
    [
      "the moment the clocks go back",
      "2027-11-07T06:00:00Z",
      "Ends 7 Nov 2027, 01:00 EST",
    ],
  ])("%s in New York", (_label, instant, reads) => {
    expect(deadlineIn(Date.parse(instant), "America/New_York")).toBe(reads);
  });
});

describe("a deadline outside the HKT and EDT examples", () => {
  // shared-dates-and-times-SC-33, shared-dates-and-times-US1-TC4-1
  const SEPTEMBER = Date.parse("2027-09-01T12:00:00Z");
  const JANUARY = Date.parse("2027-01-15T12:00:00Z");

  it.each([
    ["Asia/Seoul", "en", SEPTEMBER, "21:00", "GMT+9"],
    ["Asia/Seoul", "ko", SEPTEMBER, "21:00", "GMT+9"],
    ["Asia/Kolkata", "en", SEPTEMBER, "17:30", "GMT+5:30"],
    ["Asia/Kathmandu", "en", SEPTEMBER, "17:45", "GMT+5:45"],
    ["Europe/London", "en", SEPTEMBER, "13:00", "GMT+1"],
    ["Europe/London", "en", JANUARY, "12:00", "GMT"],
    ["America/St_Johns", "en", SEPTEMBER, "09:30", "GMT-2:30"],
    ["UTC", "en", SEPTEMBER, "12:00", "GMT"],
    ["America/Los_Angeles", "en", SEPTEMBER, "05:00", "PDT"],
  ] as const)("%s in %s reads %s %s", (timeZone, locale, at, clock, name) => {
    const line = deadlineIn(at, timeZone, locale);
    expect(line.endsWith(`, ${clock} ${name}`)).toBe(true);
    expect(line).not.toContain("HKT");
    expect(line).not.toContain("UTC");
  });

  it("names Hong Kong HKT, the one zone named by hand", () => {
    expect(deadlineIn(SEPTEMBER, "Asia/Hong_Kong")).toBe(
      "Ends 1 Sep 2027, 20:00 HKT",
    );
  });
});

describe("a collector clock is supplied, never read from the machine", () => {
  // shared-dates-and-times-SC-31, shared-dates-and-times-US1-TC9-1
  const AT = Date.UTC(2026, 8, 1, 12, 0);

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ["Asia/Tokyo", 21],
    ["America/Los_Angeles", 5],
  ])("reads the same text with the machine set to %s", (machineZone, hour) => {
    vi.stubEnv("TZ", machineZone);
    expect(new Date(AT).getHours()).toBe(hour);
    expect(
      formatLocalMoment(AT, { locale: "en", timeZone: "America/New_York" }),
    ).toBe("1 Sep 2026, 08:00");
    expect(
      formatZonedLocalMoment(AT, {
        locale: "en",
        timeZone: "America/New_York",
      }),
    ).toBe("1 Sep 2026, 08:00 EDT");
  });
});

describe("a zone the platform does not recognise stops the render", () => {
  // shared-dates-and-times-SC-34, shared-dates-and-times-US1-TC14-1
  const AT = Date.parse("2027-09-01T12:00:00Z");

  it.each(["Mars/Olympus", "Hong_Kong", "America/New York"])(
    "names %s when a local moment or a deadline is asked for",
    (timeZone) => {
      expect(() => formatLocalMoment(AT, { locale: "en", timeZone })).toThrow(
        timeZone,
      );
      expect(() => deadlineIn(AT, timeZone)).toThrow(timeZone);
    },
  );
});

describe("a zone name is read at an instant the caller names", () => {
  // shared-dates-and-times-SC-30
  it.each(["America/New_York", "Asia/Hong_Kong"])(
    "refuses a zone name for %s asked for with no instant, so no name follows the machine's date",
    (timeZone) => {
      // @ts-expect-error the instant is required
      expect(() => formatViewerZoneName(timeZone)).toThrow(
        /Invalid time value/,
      );
    },
  );

  it("refuses an invalid instant for Hong Kong as it does for every other zone", () => {
    expect(() => formatViewerZoneName("Asia/Hong_Kong", Number.NaN)).toThrow(
      /Invalid time value/,
    );
  });
});
