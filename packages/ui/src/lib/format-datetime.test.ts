import { describe, expect, it } from "vitest";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_NOW_MS,
} from "./datetime-fixtures";
import {
  ACTIVITY_RELATIVE_MAX_MS,
  formatActivityAt,
  formatCollectorDeadline,
  formatLocalMoment,
  formatRelativeAt,
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
  const at = Date.UTC(2026, 7, 24, 2, 0);

  it("renders collector shape without a zone suffix", () => {
    expect(
      formatLocalMoment(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).toBe("24 Aug 2026, 10:00");
    expect(
      formatLocalMoment(at, { locale: "en", timeZone: "Asia/Hong_Kong" }),
    ).not.toContain("UTC");
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

describe("resolveActivityNow", () => {
  it("bumps a stale tick forward when a row is newer than the last tick", () => {
    const at = Date.now();
    const staleTick = at - 8_000;
    expect(resolveActivityNow(staleTick, at)).toBeGreaterThanOrEqual(at);
  });

  it("keeps a fixed reference clock when instants are already past", () => {
    expect(resolveActivityNow(NOW, NOW - 2 * 60_000)).toBe(NOW);
  });
});

describe("formatActivityAt", () => {
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
  it("prefixes a local moment", () => {
    const at = Date.UTC(2026, 8, 1, 18, 0);
    expect(
      formatCollectorDeadline(at, {
        locale: "en",
        timeZone: "Asia/Hong_Kong",
        prefix: "Ends",
      }),
    ).toBe("Ends 2 Sep 2026, 02:00");
  });
});

describe("isPastActivityCap", () => {
  it("is false inside the cap and true at the boundary", () => {
    expect(isPastActivityCap(NOW - ACTIVITY_RELATIVE_MAX_MS + 1, NOW)).toBe(
      false,
    );
    expect(isPastActivityCap(NOW - ACTIVITY_RELATIVE_MAX_MS, NOW)).toBe(true);
  });
});

describe("resolveShippedLocale", () => {
  it("keeps shipped locales and falls back to English", () => {
    expect(resolveShippedLocale("zh-Hant")).toBe("zh-Hant");
    expect(resolveShippedLocale("th")).toBe("en");
  });
});

describe("tier constants", () => {
  it("exports platform-owned thresholds", () => {
    expect(JUST_NOW_MAX_MS).toBe(45_000);
    expect(ACTIVITY_RELATIVE_MAX_MS).toBe(7 * DAY_MS);
  });
});
