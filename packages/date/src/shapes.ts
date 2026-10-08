import type { Instant } from "./instant.ts";
import { PLATFORM_ZONE } from "./platform.ts";
import { type DateFormat, PATTERNS, render, zonePattern } from "./render.ts";

/** A calendar date: `19 Aug 2026`. */
export function formatDay(at: Instant, opts: DateFormat = {}): string {
  return render(at, PATTERNS.day, opts);
}

/** A date and time to the minute: `19 Aug 2026, 14:00`. */
export function formatMoment(at: Instant, opts: DateFormat = {}): string {
  return render(at, PATTERNS.moment, opts);
}

/** To the second, for a log read in order: `19 Aug 2026, 14:00:14`. */
export function formatEvent(at: Instant, opts: DateFormat = {}): string {
  return render(at, PATTERNS.event, opts);
}

/** A time to act before, naming its zone: `19 Aug 2026, 14:00 UTC`. */
export function formatDeadline(at: Instant, opts: DateFormat = {}): string {
  const { timeZone = PLATFORM_ZONE } = opts;
  return render(at, `${PATTERNS.deadline} ${zonePattern(timeZone)}`, opts);
}

/**
 * The clock a time is stated on, named as a deadline names it: `UTC`, or the
 * offset English gives the zone at that instant, such as `GMT+8` for Hong
 * Kong. For a heading that states its times' clock once, above shapes that
 * do not.
 */
export function formatZone(
  at: Instant,
  timeZone: string = PLATFORM_ZONE,
): string {
  return render(at, zonePattern(timeZone), { timeZone });
}

/**
 * A time of day on a stated clock: `14:00`.
 *
 * The one shape that says less than the instant it is given, so it is the one
 * shape with a precondition: the surface has already told the reader which day
 * and which clock these times are on. A shop's opening hours are the case it
 * exists for - a column of slots under a date field reading "on the shop's
 * clock", where repeating the date on every row would bury the only thing that
 * differs between them.
 *
 * Where the reader cannot see the day, this is the wrong shape:
 * `formatMoment` carries it, and `formatDeadline` carries the zone too.
 */
export function formatTimeOfDay(at: Instant, opts: DateFormat = {}): string {
  return render(at, PATTERNS.timeOfDay, opts);
}

/**
 * An event's time of day to the second: `14:00:14`. A log under day headings
 * on a stated clock, where two records can fall in the same minute; the same
 * precondition as `formatTimeOfDay`.
 */
export function formatEventTime(at: Instant, opts: DateFormat = {}): string {
  return render(at, PATTERNS.eventTime, opts);
}

/** A slot within the coming weeks, by its weekday: `Fri 30 Oct, 14:30`. */
export function formatWeekdayMoment(
  at: Instant,
  opts: DateFormat = {},
): string {
  return render(at, PATTERNS.weekdayMoment, opts);
}
