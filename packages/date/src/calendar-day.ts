import { tz } from "@date-fns/tz";
import {
  endOfDay as endOfDayIn,
  format,
  parseISO,
  startOfDay as startOfDayIn,
} from "date-fns";
import { localeFor } from "./locales.ts";
import { PLATFORM_ZONE } from "./platform.ts";
import { PATTERNS, render } from "./render.ts";

/**
 * Back to a plain `Date`. Working in a zone yields a `TZDate`, which carries
 * its offset into `toISOString` - so a boundary that reached a wire would
 * serialize as `...+00:00` where every other instant the platform sends is
 * `...Z`. What these return is an instant; the zone was how it was computed.
 */
function instant(at: Date): Date {
  return new Date(at.valueOf());
}

/**
 * A `<input type="date">` yields a calendar day with no time and no zone; the
 * workers store instants. `startOfDay`, `endOfDay`, `dayValue` and
 * `isCalendarDay` are the only place that gap is bridged, so a day someone
 * types and the day the console reads back are the same day from any machine.
 *
 * A window is inclusive of the day it names: it opens as that day begins and
 * closes as it ends, both on the clock the caller names. Which clock is the
 * caller's decision and never this package's - the same 24 hours are a
 * different calendar day in Hong Kong and in UTC, and only the caller knows
 * whose day it means.
 *
 * `parseISO` is given the zone too, and that is load-bearing. Without it a
 * bare `2026-03-01` resolves to midnight on the machine, and truncating that
 * instant to a day lands on 28 February for every reader east of the zone -
 * while passing on a UTC machine, which is what CI would be.
 */
export function startOfDay(
  day: string,
  timeZone: string = PLATFORM_ZONE,
): Date | undefined {
  if (!day) return undefined;
  const on = tz(timeZone);
  return instant(startOfDayIn(parseISO(day, { in: on }), { in: on }));
}

export function endOfDay(
  day: string,
  timeZone: string = PLATFORM_ZONE,
): Date | undefined {
  if (!day) return undefined;
  const on = tz(timeZone);
  return instant(endOfDayIn(parseISO(day, { in: on }), { in: on }));
}

/** The value a date field shows for a stored instant. */
export function dayValue(
  at: Date | null | undefined,
  timeZone: string = PLATFORM_ZONE,
): string {
  if (!at) return "";
  return format(at, "yyyy-MM-dd", { in: tz(timeZone) });
}

/**
 * Whether a `yyyy-MM-dd` string names a day that exists. The round trip
 * through `startOfDay` and `dayValue` is what does the work: `2026-02-31`
 * parses to some day, and only reading the day back out shows it was not the
 * day that was written.
 *
 * No zone: this asks whether the text names a day at all, and every zone
 * answers that the same way because the trip is made and read on one clock.
 */
export function isCalendarDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const at = startOfDay(day);
  return (
    at !== undefined && !Number.isNaN(at.getTime()) && dayValue(at) === day
  );
}

function renderCalendarDay(
  day: string,
  pattern: string,
  locale: string,
): string {
  const at = startOfDay(day, PLATFORM_ZONE);
  if (!at || Number.isNaN(at.getTime())) {
    throw new Error(`@grade10/date: "${day}" is not a calendar day`);
  }
  return render(at, pattern, { locale, timeZone: PLATFORM_ZONE });
}

/**
 * A stored `YYYY-MM-DD` calendar day - a ship day, an estimate, a day back -
 * worded in the reader's language. Read on no zone, since none stored it on
 * one: a calendar day is a calendar judgement, never an instant.
 */
export function formatCalendarDay(day: string, locale: string): string {
  return renderCalendarDay(day, PATTERNS.day, locale);
}

/** A calendar day on a strip whose heading states the month: `Mon 26`. */
export function formatWeekdayOfMonth(day: string, locale: string): string {
  return renderCalendarDay(day, PATTERNS.weekdayOfMonth, locale);
}

/** A calendar day within the coming weeks, by its weekday: `Fri 30 Oct`. */
export function formatWeekday(day: string, locale: string): string {
  return renderCalendarDay(day, PATTERNS.weekday, locale);
}

const UTC_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const EN_WEEKDAY_SHORT = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat",
] as const;

function intlTag(locale: string): string {
  switch (locale.toLowerCase()) {
    case "zh-hant":
      return "zh-Hant-HK";
    case "zh-hans":
      return "zh-Hans-CN";
    default:
      return locale;
  }
}

/**
 * A shop's calendar day as a booking picker labels it: `Sep 3, Thurs`. The
 * day is a calendar fact, so it is read on no zone. A malformed day, or a
 * language with no words, stops the render.
 */
export function formatCalendarDayLabel(day: string, locale = "en"): string {
  localeFor(locale);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) {
    throw new RangeError(`Not a calendar day: ${day}`);
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const date = Number(match[3]);
  const local = new Date(year, monthIndex, date);
  if (
    local.getFullYear() !== year ||
    local.getMonth() !== monthIndex ||
    local.getDate() !== date
  ) {
    throw new RangeError(`Not a calendar day: ${day}`);
  }

  if (locale.toLowerCase() === "en") {
    return `${UTC_MONTHS[monthIndex]} ${date}, ${EN_WEEKDAY_SHORT[local.getDay()]}`;
  }

  const tag = intlTag(locale);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat(tag, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
      .formatToParts(local)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  // Month alone: a whole date hands Chinese the month as `9` and its unit as a
  // literal part, which is dropped above.
  const month = new Intl.DateTimeFormat(tag, { month: "short" }).format(local);
  return `${month} ${parts.day}, ${parts.weekday}`;
}
