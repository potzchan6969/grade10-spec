import type { Instant } from "./instant.ts";
import { formatDay, formatTimeOfDay } from "./shapes.ts";
import { formatViewerZoneName } from "./zone-names.ts";

/** The viewer's clock: a collector page reads the browser's zone and passes it. */
export type ViewerClock = {
  locale?: string;
  timeZone: string;
};

/** The viewer's clock with the zone named at that instant: `18:00 HKT`. */
export function formatZonedLocalTime(at: Instant, clock: ViewerClock): string {
  return `${formatTimeOfDay(at, clock)} ${formatViewerZoneName(clock.timeZone, at)}`;
}

/** A deadline in the viewer's zone: `24 Aug 2026, 18:00 HKT` or `23 Aug 2026, 22:00 EDT`. */
export function formatZonedLocalMoment(
  at: Instant,
  clock: ViewerClock,
): string {
  return `${formatDay(at, clock)}, ${formatZonedLocalTime(at, clock)}`;
}

/**
 * A deadline in the viewer's zone behind the caller's own words: the package
 * holds no sentence, so `prefix` is the catalog's `Ends` or `Closes`.
 */
export function formatCollectorDeadline(
  at: Instant,
  { prefix, ...clock }: ViewerClock & { prefix: string },
): string {
  return `${prefix} ${formatZonedLocalMoment(at, clock)}`;
}
