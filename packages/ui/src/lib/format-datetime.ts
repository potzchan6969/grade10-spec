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

/** Locales this repository ships in message catalogs. */
export type ShippedLocale = "en" | "zh-Hant" | "zh-Hans" | "ko";

export type ActivityTimeCopy = {
  justNow: string;
  secondsAgo: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
};

export const JUST_NOW_MAX_MS = 45_000;
export const ACTIVITY_RELATIVE_MAX_MS = 7 * 24 * 60 * 60 * 1000;

const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const SHIPPED_LOCALES = new Set<string>(["en", "zh-Hant", "zh-Hans", "ko"]);

function parseInstant(at: Date | number): Date {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${at}`);
  }
  return date;
}

function utcParts(date: Date, locale: ShippedLocale = "en") {
  return {
    day: date.getUTCDate(),
    month: monthName(date, locale, "UTC"),
    year: date.getUTCFullYear(),
    hours: String(date.getUTCHours()).padStart(2, "0"),
    minutes: String(date.getUTCMinutes()).padStart(2, "0"),
    seconds: String(date.getUTCSeconds()).padStart(2, "0"),
  };
}

export function intlLocale(locale: ShippedLocale): string {
  switch (locale) {
    case "zh-Hant":
      return "zh-Hant-HK";
    case "zh-Hans":
      return "zh-Hans-CN";
    default:
      return locale;
  }
}

function monthName(
  date: Date,
  locale: ShippedLocale,
  timeZone: string,
): string {
  if (locale === "en") {
    const utcMonth = UTC_MONTHS[date.getUTCMonth()];
    if (timeZone === "UTC") return utcMonth;
  }
  const parts = new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
    timeZone,
  }).formatToParts(date);
  return parts.find((part) => part.type === "month")?.value ?? "???";
}

function localParts(date: Date, locale: ShippedLocale, timeZone: string) {
  const formatter = new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    day: parts.day ?? "0",
    month: parts.month ?? "???",
    year: parts.year ?? "0000",
    hours: (parts.hour ?? "00").padStart(2, "0"),
    minutes: (parts.minute ?? "00").padStart(2, "0"),
  };
}

function formatPluralMessage(template: string, count: number): string {
  const pluralMatch = template.match(/^\{count, plural, (.+)\}$/);
  if (!pluralMatch) {
    return template.replaceAll("#", String(count));
  }

  const branches = pluralMatch[1] ?? "";
  const oneBranch = branches.match(/one \{([^}]*)\}/)?.[1];
  const otherBranch = branches.match(/other \{([^}]*)\}/)?.[1];
  const chosen =
    count === 1 && oneBranch != null
      ? oneBranch
      : (otherBranch ?? String(count));
  return chosen.replaceAll("#", String(count));
}

/** Day shape: `26 Aug 2026`. */
export function formatDay(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  const { day, month, year } = utcParts(parseInstant(at), locale);
  return `${day} ${month} ${year}`;
}

/** Moment shape: `24 Aug 2026, 18:00 UTC`. */
export function formatMoment(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  const { day, month, year, hours, minutes } = utcParts(
    parseInstant(at),
    locale,
  );
  return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

/** Event shape: `24 Aug 2026, 18:00:14 UTC`. */
export function formatEvent(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  const { day, month, year, hours, minutes, seconds } = utcParts(
    parseInstant(at),
    locale,
  );
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} UTC`;
}

/** Deadline shape — minute precision with zone named. */
export function formatDeadline(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  return formatMoment(at, locale);
}

/** Collector local moment: `24 Aug 2026, 18:00` with no zone suffix. */
export function formatLocalMoment(
  at: Date | number,
  { locale = "en", timeZone }: { locale?: ShippedLocale; timeZone: string },
): string {
  const date = parseInstant(at);
  const { day, month, year, hours, minutes } = localParts(
    date,
    locale,
    timeZone,
  );
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/** Collector local calendar day: `24 Aug 2026`. */
export function formatLocalDay(
  at: Date | number,
  { locale = "en", timeZone }: { locale?: ShippedLocale; timeZone: string },
): string {
  const { day, month, year } = localParts(parseInstant(at), locale, timeZone);
  return `${day} ${month} ${year}`;
}

const EN_WEEKDAY_SHORT = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat",
] as const;

/** Shop calendar day label: `Sep 3, Thurs`. `date` is `YYYY-MM-DD`. */
export function formatCalendarDayLabel(
  date: string,
  locale: ShippedLocale = "en",
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new RangeError(`Not a calendar day: ${date}`);
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const local = new Date(year, monthIndex, day);
  if (
    local.getFullYear() !== year ||
    local.getMonth() !== monthIndex ||
    local.getDate() !== day
  ) {
    throw new RangeError(`Not a calendar day: ${date}`);
  }

  if (locale === "en") {
    return `${UTC_MONTHS[monthIndex]} ${day}, ${EN_WEEKDAY_SHORT[local.getDay()]}`;
  }

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
      .formatToParts(local)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  return `${parts.month} ${parts.day}, ${parts.weekday}`;
}

/** Collector local clock: `18:00`. */
export function formatLocalTime(
  at: Date | number,
  { locale = "en", timeZone }: { locale?: ShippedLocale; timeZone: string },
): string {
  const { hours, minutes } = localParts(parseInstant(at), locale, timeZone);
  return `${hours}:${minutes}`;
}

/** Collector local clock with the viewer's zone named: `18:00 HKT`. */
export function formatZonedLocalTime(
  at: Date | number,
  options: { locale?: ShippedLocale; timeZone: string },
): string {
  return `${formatLocalTime(at, options)} ${formatViewerZoneName(options.timeZone, at)}`;
}

/** Deadline shape: `24 Aug 2026, 18:00 HKT` or `23 Aug 2026, 22:00 EDT`. */
export function formatZonedLocalMoment(
  at: Date | number,
  options: { locale?: ShippedLocale; timeZone: string },
): string {
  return `${formatLocalDay(at, options)}, ${formatZonedLocalTime(at, options)}`;
}

export function formatCollectorDeadline(
  at: Date | number,
  {
    locale = "en",
    timeZone,
    prefix,
  }: { locale?: ShippedLocale; timeZone: string; prefix: string },
): string {
  return `${prefix} ${formatZonedLocalMoment(at, { locale, timeZone })}`;
}

type CollectorClockOptions = {
  locale?: ShippedLocale;
  timeZone: string;
};

/**
 * Viewer short name at that instant: `HKT`, `EDT`, or the offset (`GMT+9`)
 * where US English has no short name. Hong Kong is always `HKT`. The instant is
 * parsed first, so an invalid one stops every zone alike.
 */
export function formatViewerZoneName(
  timeZone: string,
  at: Date | number,
): string {
  const instant = parseInstant(at);
  if (timeZone === "Asia/Hong_Kong") return "HKT";
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName");
  if (name === undefined) {
    throw new RangeError(`No zone name for ${timeZone} at ${instant}`);
  }
  return name.value.replace(/^UTC/, "GMT");
}

/** Auction listing close prefix in the viewer's zone. */
export function formatListingEnds(
  at: Date | number,
  options: CollectorClockOptions,
): string {
  return formatCollectorDeadline(at, { ...options, prefix: "Ends" });
}

/** Auction listing closed prefix in the viewer's zone. */
export function formatListingClosed(
  at: Date | number,
  options: CollectorClockOptions,
): string {
  return formatCollectorDeadline(at, { ...options, prefix: "Closed" });
}

/** Auction listing opens prefix in the viewer's zone. */
export function formatListingOpens(
  at: Date | number,
  options: CollectorClockOptions,
): string {
  return formatCollectorDeadline(at, { ...options, prefix: "Opens" });
}

export function formatRelativeAt(
  at: Date | number,
  {
    copy,
    now = Date.now(),
  }: { locale?: ShippedLocale; copy: ActivityTimeCopy; now?: number },
): string {
  const instantMs = parseInstant(at).getTime();
  if (instantMs > now) {
    throw new RangeError(`Activity time must be in the past: ${at}`);
  }

  const elapsedMs = now - instantMs;

  if (elapsedMs < JUST_NOW_MAX_MS) {
    return copy.justNow;
  }

  if (elapsedMs < MINUTE_MS) {
    const count = Math.floor(elapsedMs / SECOND_MS);
    return formatPluralMessage(copy.secondsAgo, count);
  }

  if (elapsedMs < HOUR_MS) {
    const count = Math.floor(elapsedMs / MINUTE_MS);
    return formatPluralMessage(copy.minutesAgo, count);
  }

  if (elapsedMs < DAY_MS) {
    const count = Math.floor(elapsedMs / HOUR_MS);
    return formatPluralMessage(copy.hoursAgo, count);
  }

  if (elapsedMs < ACTIVITY_RELATIVE_MAX_MS) {
    const count = Math.floor(elapsedMs / DAY_MS);
    return formatPluralMessage(copy.daysAgo, count);
  }

  throw new RangeError(
    `Elapsed time exceeds relative cap; use formatActivityAt instead: ${at}`,
  );
}

/**
 * Moves a floored clock tick up to the newest row instant past it, so a bid
 * stamped after the last tick reads as just placed rather than in the future.
 * It never reads the device clock: the tick comes from the page's clock, and
 * a row newer than the tick is younger than one tick.
 */
export function resolveActivityNow(
  storedNow: number,
  ...instants: number[]
): number {
  return Math.max(storedNow, ...instants);
}

export function formatActivityAt(
  at: Date | number,
  {
    locale = "en",
    timeZone,
    copy,
    now = Date.now(),
  }: {
    locale?: ShippedLocale;
    timeZone: string;
    copy: ActivityTimeCopy;
    now?: number;
  },
): string {
  const instantMs = parseInstant(at).getTime();
  const referenceNow = resolveActivityNow(now, instantMs);
  if (instantMs > referenceNow) {
    throw new RangeError(`Activity time must be in the past: ${at}`);
  }

  const elapsedMs = referenceNow - instantMs;
  if (elapsedMs < ACTIVITY_RELATIVE_MAX_MS) {
    return formatRelativeAt(at, { locale, copy, now: referenceNow });
  }

  return formatLocalMoment(at, { locale, timeZone });
}

export function isPastActivityCap(
  at: Date | number,
  now = Date.now(),
): boolean {
  const instantMs = parseInstant(at).getTime();
  return now - instantMs >= ACTIVITY_RELATIVE_MAX_MS;
}

export function resolveShippedLocale(input: string): ShippedLocale {
  if (SHIPPED_LOCALES.has(input)) {
    return input as ShippedLocale;
  }
  return "en";
}
