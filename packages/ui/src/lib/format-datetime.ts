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

function intlLocale(locale: ShippedLocale): string {
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
    count === 1 && oneBranch != null ? oneBranch : (otherBranch ?? String(count));
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
  {
    locale = "en",
    timeZone,
  }: { locale?: ShippedLocale; timeZone: string },
): string {
  const date = parseInstant(at);
  const { day, month, year, hours, minutes } = localParts(
    date,
    locale,
    timeZone,
  );
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function formatCollectorDeadline(
  at: Date | number,
  {
    locale = "en",
    timeZone,
    prefix,
  }: { locale?: ShippedLocale; timeZone: string; prefix: string },
): string {
  return `${prefix} ${formatLocalMoment(at, { locale, timeZone })}`;
}

export function formatClosedAt(
  at: Date | number,
  {
    locale = "en",
    timeZone,
    template,
  }: { locale?: ShippedLocale; timeZone: string; template: string },
): string {
  const when = formatLocalMoment(at, { locale, timeZone });
  return template.replace("{when}", when);
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
 * Bumps a tick-stored clock forward when a row instant is newer than the last
 * tick, so live bids stamped with `Date.now()` are not treated as future.
 * Leaves an explicit fixed `now` unchanged when every instant is already past.
 */
export function resolveActivityNow(
  storedNow: number,
  ...instants: number[]
): number {
  let reference = storedNow;
  for (const instant of instants) {
    if (instant > reference) {
      reference = Math.max(instant, Date.now());
    }
  }
  return reference;
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

/** Auction listing close prefix. */
export function formatListingEnds(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  return `Ends ${formatDeadline(at, locale)}`;
}

/** Auction listing closed prefix. */
export function formatListingClosed(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  return `Closed ${formatDeadline(at, locale)}`;
}

/** Auction listing opens prefix. */
export function formatListingOpens(
  at: Date | number,
  locale: ShippedLocale = "en",
): string {
  return `Opens ${formatDeadline(at, locale)}`;
}

/** @deprecated Use {@link formatMoment}. */
export const formatAuctionMoment = formatMoment;

/** @deprecated Use {@link formatListingEnds}. */
export const formatAuctionDeadline = formatListingEnds;

/** @deprecated Use {@link formatListingClosed}. */
export const formatAuctionClosed = formatListingClosed;

/** @deprecated Use {@link formatListingOpens}. */
export const formatAuctionOpens = formatListingOpens;
