import { startOfDay } from "./calendar-day.ts";
import { platformLanguageOf } from "./locales.ts";
import { PLATFORM_ZONE } from "./platform.ts";
import { render } from "./render.ts";

/**
 * A run of calendar days worded as one, each day by its weekday: a show's
 * days. Two or three days are listed with the reader's own "and"; a longer
 * run names its first and last day. A month or a year the days share is said
 * once, on the last day in English and on the first in Chinese, which writes
 * the largest unit first.
 */
type SpanShape = {
  /** Every day names its month, even when the days share it. */
  monthEachDay: boolean;
  /** The year is said; days in different years always say theirs. */
  year: boolean;
};

const DAY_MS = 86_400_000;
const LONGEST_LIST = 3;

function dateOf(day: string): Date {
  const at = startOfDay(day, PLATFORM_ZONE);
  if (!at || Number.isNaN(at.getTime())) {
    throw new Error(`@grade10/date: "${day}" is not a calendar day`);
  }
  return at;
}

function intlTag(language: string): string {
  if (language === "zh-Hant") return "zh-Hant-HK";
  if (language === "zh-Hans") return "zh-Hans-CN";
  // The platform writes its dates the British way, so its list does too.
  if (language === "en") return "en-GB";
  return language;
}

function wordDays(days: Date[], locale: string, shape: SpanShape): string[] {
  const language = platformLanguageOf(locale);
  const chinese = language === "zh-Hant" || language === "zh-Hans";
  const year = (at: Date) => at.getUTCFullYear();
  const month = (at: Date) => year(at) * 12 + at.getUTCMonth();
  const oneYear = days.every((at) => year(at) === year(days[0] as Date));
  const oneMonth = days.every((at) => month(at) === month(days[0] as Date));
  return days.map((at, index) => {
    const edge = chinese ? index === 0 : index === days.length - 1;
    const withMonth = shape.monthEachDay || !oneMonth || edge;
    const withYear = !oneYear || (shape.year && edge);
    const pattern = chinese
      ? `${withYear ? "yyyy年" : ""}${withMonth ? "M月" : ""}d日 EEE`
      : `EEE d${withMonth ? " MMM" : ""}${withYear ? " yyyy" : ""}`;
    return render(at, pattern, { locale, timeZone: PLATFORM_ZONE });
  });
}

function span(
  first: string,
  last: string,
  locale: string,
  shape: SpanShape,
): string {
  const from = dateOf(first);
  const to = dateOf(last);
  if (to < from) {
    throw new Error(`@grade10/date: ${last} comes before ${first}`);
  }
  const count = Math.round((to.getTime() - from.getTime()) / DAY_MS) + 1;
  if (count > LONGEST_LIST) {
    const [start, end] = wordDays([from, to], locale, shape);
    return `${start} – ${end}`;
  }
  const days = Array.from(
    { length: count },
    (_, index) => new Date(from.getTime() + index * DAY_MS),
  );
  return new Intl.ListFormat(intlTag(platformLanguageOf(locale)), {
    type: "conjunction",
  }).format(wordDays(days, locale, shape));
}

/** A show's days, the month and year said once: `Sat 12 and Sun 13 Dec 2026`. */
export function formatWeekdaySpan(
  first: string,
  last: string,
  locale: string,
): string {
  return span(first, last, locale, { monthEachDay: false, year: true });
}

/**
 * A show's days on a surface that has already stated the year:
 * `Sat 12 and Sun 13 Dec`.
 */
export function formatWeekdaySpanInYear(
  first: string,
  last: string,
  locale: string,
): string {
  return span(first, last, locale, { monthEachDay: false, year: false });
}

/**
 * A show's days as its page heads them, each day whole and the year said
 * once: `Sat 12 Dec and Sun 13 Dec 2026`.
 */
export function formatWeekdayList(
  first: string,
  last: string,
  locale: string,
): string {
  return span(first, last, locale, { monthEachDay: true, year: true });
}
