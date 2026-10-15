import { tz } from "@date-fns/tz";
import { format } from "date-fns";
import { assertZone, type Instant, toInstant } from "./instant.ts";
import { localeFor, platformLanguageOf } from "./locales.ts";
import { PLATFORM_LOCALE, PLATFORM_ZONE } from "./platform.ts";

export type DateFormat = {
  /**
   * One of the languages `@grade10/i18n` ships, as a BCP-47 tag - not any tag
   * the runtime knows. This has to have words for the month, so an
   * unrecognized tag throws rather than reading English at a reader who asked
   * for something else. The wording and the ordering both follow it -
   * Chinese reads year, month, day where English walks day to year. Defaults
   * to the platform's language.
   */
  locale?: string;
  /**
   * Which clock the day and the time of day are read on. Defaults to the
   * platform's; a surface stating a brand's calendar day passes the brand's,
   * and a collector page passes the viewer's.
   */
  timeZone?: string;
};

/**
 * The shapes, named for what the reader is doing with the date rather than for
 * their tokens. A caller picks the task; the pattern is never the caller's to
 * choose, which is the whole reason this package exists.
 */
export const PATTERNS = {
  /** A calendar date, where the time of day carries no meaning. */
  day: "d MMM yyyy",
  /** A date and a time, to place an event within the day. */
  moment: "d MMM yyyy, HH:mm",
  /** To the second, for records that can fall in the same minute. */
  event: "d MMM yyyy, HH:mm:ss",
  /** A time to act before. Its zone is appended by `zonePattern`. */
  deadline: "d MMM yyyy, HH:mm",
  /** A time of day alone, for a surface that has already stated the day. */
  timeOfDay: "HH:mm",
  /** An event's time of day to the second, under a heading that states its day. */
  eventTime: "HH:mm:ss",
  /** A day picked from a strip under a heading that states the month. */
  weekdayOfMonth: "EEE d",
  /** A day near enough that its weekday is what the reader goes by. */
  weekday: "EEE d MMM",
  /** A slot near enough that its weekday is what the reader goes by. */
  weekdayMoment: "EEE d MMM, HH:mm",
  /** A day within the reader's current year, which goes unsaid. */
  shortDay: "d MMM",
  /** A month a report or a chart's tick is cut to. */
  month: "MMM yyyy",
  /** A month named in full, heading a calendar or a statement. */
  monthName: "MMMM yyyy",
  /** A month under a heading that states its year: a chart's tick. */
  monthAlone: "MMM",
  /** A month named in full under a heading that states its year. */
  monthNameAlone: "MMMM",
  /** A day named in full, heading a page about that day. */
  weekdayDay: "EEEE d MMM yyyy",
} as const;

/**
 * Chinese writes a date largest unit first - year, month, day - where English
 * walks day to year, and `19 8月 2026` reads as wrong to a Chinese reader as
 * "August 2026 19" does to an English one. Both Chinese catalogs share the
 * ordering; the words still come from the locale `localeFor` resolves.
 */
const ZH_PATTERNS: Partial<Record<keyof typeof PATTERNS, string>> = {
  day: "yyyy年M月d日",
  moment: "yyyy年M月d日 HH:mm",
  event: "yyyy年M月d日 HH:mm:ss",
  deadline: "yyyy年M月d日 HH:mm",
  weekdayOfMonth: "EEE d日",
  weekday: "M月d日 EEE",
  weekdayMoment: "M月d日 EEE, HH:mm",
  shortDay: "M月d日",
  month: "yyyy年M月",
  monthName: "yyyy年M月",
  monthAlone: "M月",
  monthNameAlone: "M月",
  weekdayDay: "yyyy年M月d日 EEEE",
};

const ZH_BY_PATTERN = new Map<string, string>(
  Object.entries(ZH_PATTERNS).map(([key, zh]) => [
    PATTERNS[key as keyof typeof PATTERNS],
    zh,
  ]),
);

/**
 * How a deadline, and a heading over times, names the zone it is stated in.
 *
 * For the platform's own zone this is the literal `UTC`, not date-fns's `zzz`
 * token: the token renders `GMT+0` there, and no reader should have to work
 * out that the two are the same. Any other zone gets the token, because a
 * literal would then be a lie.
 */
export function zonePattern(timeZone: string): string {
  return timeZone === PLATFORM_ZONE ? "'UTC'" : "zzz";
}

export function render(
  at: Instant,
  pattern: string,
  { locale = PLATFORM_LOCALE, timeZone = PLATFORM_ZONE }: DateFormat,
): string {
  const instant = toInstant(at);
  assertZone(timeZone);
  const language = platformLanguageOf(locale).toLowerCase();
  const resolved =
    language === "zh-hant" || language === "zh-hans"
      ? (ZH_BY_PATTERN.get(pattern) ?? pattern)
      : pattern;
  return format(instant, resolved, {
    in: tz(timeZone),
    locale: localeFor(locale),
  });
}
