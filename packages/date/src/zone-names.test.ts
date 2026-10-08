import { describe, expect, it } from "vitest";
import {
  formatTimeRange,
  formatViewerZoneName,
  weekdayName,
  weekdayRangeName,
  zoneName,
} from "./zone-names.ts";

describe("zoneName", () => {
  it("names a zone in plain words, or falls back to its id", () => {
    expect(zoneName("Asia/Hong_Kong")).toBe("Hong Kong Standard Time");
    expect(zoneName("UTC")).toBe("Coordinated Universal Time");
  });
});

describe("weekdays and clock ranges", () => {
  it("names a weekday on no zone - 0 is Sunday, matching Date#getDay", () => {
    expect(weekdayName(0, "en")).toBe("Sunday");
    expect(weekdayName(1, "en")).toBe("Monday");
    expect(weekdayName(6, "en")).toBe("Saturday");
  });

  it("reads a weekday range as one string, and a single day as its own name", () => {
    expect(weekdayRangeName(1, 6, "en")).toBe("Monday\u2009–\u2009Saturday");
    expect(weekdayRangeName(2, 2, "en")).toBe("Tuesday");
  });

  it("reads a minute range as one 24-hour clock range", () => {
    expect(formatTimeRange(600, 1140, "en")).toBe("10:00\u2009–\u200919:00");
    expect(formatTimeRange(0, 0, "en")).toBe("00:00");
  });

  it("reads a range that runs to midnight as ending at 24:00, never as the next day's date", () => {
    expect(formatTimeRange(600, 1440, "en")).toBe("10:00 – 24:00");
    expect(formatTimeRange(600, 1440, "ko")).toBe("10:00 ~ 24:00");
    expect(formatTimeRange(600, 1440, "zh-Hans")).toBe("10:00–24:00");
    expect(formatTimeRange(0, 1440, "zh-Hant")).toBe("00:00 – 24:00");
  });

  it("reads the range in the reader's own locale", () => {
    expect(formatTimeRange(600, 1140, "ko")).toBe("10:00 ~ 19:00");
    expect(formatTimeRange(600, 1140, "zh-Hans")).toBe("10:00–19:00");
  });
});

describe("formatViewerZoneName", () => {
  it("names Hong Kong as HKT and New York in September as EDT", () => {
    const at = Date.UTC(2026, 8, 1);
    expect(formatViewerZoneName("Asia/Hong_Kong", at)).toBe("HKT");
    expect(formatViewerZoneName("America/New_York", at)).toBe("EDT");
  });

  it("names a zone with no US English short name by its offset", () => {
    const at = Date.UTC(2027, 8, 1);
    expect(formatViewerZoneName("Asia/Seoul", at)).toBe("GMT+9");
    expect(formatViewerZoneName("Asia/Kolkata", at)).toBe("GMT+5:30");
  });

  it("reads UTC as GMT, so a zero offset never says UTC", () => {
    expect(formatViewerZoneName("UTC", Date.UTC(2027, 8, 1))).toBe("GMT");
  });

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

  it("names a zone it does not know", () => {
    expect(() => formatViewerZoneName("Mars/Olympus", 0)).toThrow(
      "Mars/Olympus",
    );
  });
});
