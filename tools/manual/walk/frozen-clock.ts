import { vi } from "vitest";

/**
 * The one instant every walk reads "now" as - 2026-09-19 noon, Hong Kong
 * time - and the same instant `fixture-snapshot.test.ts`'s coverage test
 * reads the fixture's idle and shelf bounds against. One constant rather
 * than each file's own literal, or a bare `Date.now()` a machine's real
 * clock would move: `demo-on-staging` is dated 2026-09-07 in
 * `fixture-dates.json`, which only ever reads as 12 days idle against this
 * one frozen reading.
 */
export const FROZEN_NOW = new Date("2026-09-19T12:00:00+08:00");

/** Freezes `Date` at `FROZEN_NOW`, in a `beforeEach`. */
export function freezeClock(): void {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FROZEN_NOW);
}

/** Restores the real clock, in an `afterEach`. */
export function unfreezeClock(): void {
  vi.useRealTimers();
}
