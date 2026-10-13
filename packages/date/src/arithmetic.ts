import { tz } from "@date-fns/tz";
import {
  addDays as addDaysIn,
  differenceInCalendarDays,
  differenceInMonths,
  endOfDay as endOfDayIn,
  format,
  startOfDay as startOfDayIn,
  startOfMonth as startOfMonthIn,
} from "date-fns";
import { plainDate } from "./instant.ts";
import { PLATFORM_ZONE } from "./platform.ts";

/**
 * Calendar and clock arithmetic on instants, on a zone the caller names. The
 * shapes write an instant as words and `calendar-day.ts` reads a typed day into
 * instants; this module only counts days, months and hours, so a Worker can
 * decide when a rung falls without importing a language.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * `days` × 24 hours from `at` - a duration, never a calendar day. A day
 * boundary is `calendarDaysBetween`, `startOfDay`, `startOfDayAfter`,
 * `endOfDayAfter` or `firstOfMonth`, each of which takes the zone whose
 * calendar is meant.
 */
export function addDays(at: Date, days: number): Date {
  return new Date(at.getTime() + days * MS_PER_DAY);
}

/**
 * The instant the day `days` days after the one `at` falls on begins, on the
 * named clock. A rung counted in days from an event - a reminder a month after
 * ready, a window after the day a box came back - falls at that day's midnight,
 * never at the hour the event happened to be recorded.
 *
 * A zone the calendar cannot be read on fails here by name: a rung that
 * answered "not yet" would hold back a step whose day came and went.
 */
export function startOfDayAfter(
  at: Date,
  days: number,
  timeZone: string = PLATFORM_ZONE,
): Date {
  return edgeOfDayAfter(startOfDayIn, at, days, timeZone);
}

/**
 * The last instant of the day `days` days after the one `at` falls on, on the
 * named clock: a date a person is given to act by is theirs in full. Counted
 * in calendar days, so a summer-time change between the two never names a day
 * too early.
 */
export function endOfDayAfter(
  at: Date,
  days: number,
  timeZone: string = PLATFORM_ZONE,
): Date {
  return edgeOfDayAfter(endOfDayIn, at, days, timeZone);
}

function edgeOfDayAfter(
  edge: typeof startOfDayIn | typeof endOfDayIn,
  at: Date,
  days: number,
  timeZone: string,
): Date {
  const on = tz(timeZone);
  const bound = plainDate(edge(addDaysIn(at, days, { in: on }), { in: on }));
  if (Number.isNaN(bound.getTime())) {
    throw new Error(
      `@grade10/date: the day cannot be read on the zone "${timeZone}"`,
    );
  }
  return bound;
}

/**
 * The one comparison a deadline is read with, and the instant it names counts
 * on both sides: a rung falling now has fallen, an offer expiring now has run
 * out. Which fact is asked is the order of the arguments, not a second edge.
 */
export const atOrBefore = (moment: Date, limit: Date): boolean =>
  moment.getTime() <= limit.getTime();

/**
 * Whole calendar days from `from` to `to` on the named clock, negative when
 * `to` falls on the earlier day.
 *
 * A schedule stated in days - a reminder a week before a due date - counts
 * the shop's days, not 24-hour spans from an instant: 23:30 and 00:30 on that
 * clock are an hour apart and a day apart, and a due date written as the last
 * millisecond of its day is a whole day from the morning of the day before.
 */
export function calendarDaysBetween(
  from: Date,
  to: Date,
  timeZone: string = PLATFORM_ZONE,
): number {
  return differenceInCalendarDays(to, from, { in: tz(timeZone) });
}

/**
 * Whole months from `from` to `to` on the named clock, negative when `to` is
 * earlier. A month is whole only once its day of the month has come round
 * again: 24 February to 23 March is none, and to 24 March is one.
 *
 * A day the next month lacks comes round on its last day: 29, 30 and 31
 * January to 28 February are one each, as is 31 March to 30 April. date-fns
 * reads any February day from the 28th as the month's end, so 29 January to
 * 28 February is one in a leap year too.
 *
 * The time of day is dropped on both sides, because a fee charged by the month
 * counts the shop's days rather than the hours between two instants - an
 * instant half a day into the month has started it.
 */
export function wholeMonthsBetween(
  from: Date,
  to: Date,
  timeZone: string = PLATFORM_ZONE,
): number {
  const on = tz(timeZone);
  return differenceInMonths(
    startOfDayIn(to, { in: on }),
    startOfDayIn(from, { in: on }),
    { in: on },
  );
}

/** The hour of the day `at` falls in on the named clock, 0 to 23. */
export function hourOf(at: Date, timeZone: string = PLATFORM_ZONE): number {
  return Number(format(at, "H", { in: tz(timeZone) }));
}

/**
 * The instant the month containing `at` begins, on the named clock.
 *
 * A month is a window a report is cut to - "this month" on a ledger - so two
 * readers cutting the same report name the same first day.
 */
export function firstOfMonth(at: Date, timeZone: string = PLATFORM_ZONE): Date {
  return plainDate(startOfMonthIn(at, { in: tz(timeZone) }));
}
