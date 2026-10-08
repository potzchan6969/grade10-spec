import { getMessages } from "@grade10/i18n";
import { describe, expect, it, vi } from "vitest";
import {
  ACTIVITY_RELATIVE_MAX_MS,
  formatActivityAt,
  formatRelativeAt,
  isPastActivityCap,
  JUST_NOW_MAX_MS,
  resolveActivityNow,
} from "./relative.ts";

const COPY = getMessages("grade10", "en").dates;
const NOW = Date.UTC(2026, 7, 21, 12, 0);
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
      formatRelativeAt(NOW - (2 * 60_000 + 30_000), { copy: COPY, now: NOW }),
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

describe("the activity cap", () => {
  it("is false inside the cap and true at the boundary", () => {
    expect(isPastActivityCap(NOW - ACTIVITY_RELATIVE_MAX_MS + 1, NOW)).toBe(
      false,
    );
    expect(isPastActivityCap(NOW - ACTIVITY_RELATIVE_MAX_MS, NOW)).toBe(true);
  });

  it("enters the seconds tier exactly at the just-now bound", () => {
    expect(JUST_NOW_MAX_MS).toBe(45_000);
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
    const label = formatActivityAt(NOW - 8 * DAY_MS, {
      locale: "en",
      timeZone: "Asia/Hong_Kong",
      copy: COPY,
      now: NOW,
    });
    expect(label).toBe("13 Aug 2026, 20:00");
    expect(label).not.toContain("UTC");
  });
});
