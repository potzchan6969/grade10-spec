import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatCollectorDeadline,
  formatZonedLocalMoment,
  formatZonedLocalTime,
} from "./local.ts";
import { formatDay, formatMoment, formatTimeOfDay } from "./shapes.ts";

describe("a local moment, day and clock", () => {
  // shared-dates-and-times-SC-23
  const at = Date.UTC(2026, 7, 24, 2, 0);

  it("renders collector shape without a zone suffix", () => {
    const hongKong = formatMoment(at, {
      locale: "en",
      timeZone: "Asia/Hong_Kong",
    });
    expect(hongKong).toBe("24 Aug 2026, 10:00");
    expect(hongKong).not.toContain("UTC");
    expect(hongKong).not.toContain("HKT");
  });

  it("shifts clock values by timezone", () => {
    expect(
      formatMoment(at, { locale: "en", timeZone: "America/New_York" }),
    ).toBe("23 Aug 2026, 22:00");
  });

  it("splits the collector moment into day and clock", () => {
    const later = Date.UTC(2026, 7, 30, 9, 15);
    const clock = { locale: "en", timeZone: "Asia/Hong_Kong" };
    expect(formatDay(later, clock)).toBe("30 Aug 2026");
    expect(formatTimeOfDay(later, clock)).toBe("17:15");
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

      expect(formatDay(at, options)).toBe(day);
      expect(formatMoment(at, options)).toBe(`${day}, 20:00`);
      expect(formatZonedLocalMoment(at, options)).toBe(`${day}, 20:00 HKT`);
      expect(formatCollectorDeadline(at, { ...options, prefix: "Ends" })).toBe(
        `Ends ${day}, 20:00 HKT`,
      );
    },
  );

  it.each(["en", "zh-Hant", "zh-Hans", "ko"] as const)(
    "%s reads the local day of a UTC viewer as the UTC day",
    (locale) => {
      expect(formatDay(at, { locale, timeZone: "UTC" })).toBe(
        formatDay(at, { locale }),
      );
    },
  );
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

  it("names the viewer's zone on the clock alone", () => {
    expect(
      formatZonedLocalTime(Date.UTC(2026, 8, 1, 18, 0), {
        timeZone: "Asia/Hong_Kong",
      }),
    ).toBe("02:00 HKT");
  });
});

describe("formatCollectorDeadline", () => {
  // shared-dates-and-times-SC-12, shared-dates-and-times-SC-29
  const at = Date.UTC(2026, 8, 1, 18, 0);

  it("prefixes a local moment with the viewer's zone name", () => {
    expect(
      formatCollectorDeadline(at, {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        prefix: "Ends",
      }),
    ).toBe("Ends 2 Sep 2026, 02:00 HKT");
  });

  it("names the viewer's zone, so New York reads EDT not HKT", () => {
    const hk = formatCollectorDeadline(at, {
      timeZone: "Asia/Hong_Kong",
      prefix: "Ends",
    });
    const ny = formatCollectorDeadline(at, {
      timeZone: "America/New_York",
      prefix: "Ends",
    });
    expect(hk).not.toBe(ny);
    expect(hk).toMatch(/ HKT$/);
    expect(ny).toMatch(/ EDT$/);
    expect(ny).not.toContain("HKT");
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
      formatMoment(AT, { locale: "en", timeZone: "America/New_York" }),
    ).toBe("1 Sep 2026, 08:00");
    expect(
      formatZonedLocalMoment(AT, {
        locale: "en",
        timeZone: "America/New_York",
      }),
    ).toBe("1 Sep 2026, 08:00 EDT");
  });
});

describe("a zone the platform does not recognise stops a deadline", () => {
  // shared-dates-and-times-SC-34, shared-dates-and-times-US1-TC14-1
  const AT = Date.parse("2027-09-01T12:00:00Z");

  it.each(["Mars/Olympus", "Hong_Kong", "America/New York"])(
    "names %s",
    (timeZone) => {
      expect(() => deadlineIn(AT, timeZone)).toThrow(timeZone);
    },
  );
});
