/**
 * Money and dates as a grading letter prints them.
 *
 * Amounts are minor units, as every Grade10 surface carries them, and are
 * formatted the way `@grade10/ui`'s `formatMoney` does: the amount divided by
 * the currency's exponent through `Intl.NumberFormat`. Letters print the
 * currency code rather than its symbol, because a letter is read outside the
 * shop's own chrome.
 *
 * Dates are the shop's, `Asia/Hong_Kong`, whatever clock the reader keeps —
 * the footer says so on every letter.
 */

const TIME_ZONE = "Asia/Hong_Kong";
const LOCALE = "en-GB";

/** ISO 4217 minor-unit exponent, for the currencies a letter can carry. */
const CURRENCY_EXPONENT: Readonly<Record<string, number>> = { HKD: 2 };

function exponentOf(currency: string): number {
  const exponent = CURRENCY_EXPONENT[currency.toUpperCase()];
  if (exponent === undefined) {
    throw new Error(`Unsupported currency for a grading letter: ${currency}`);
  }
  return exponent;
}

function format(
  minor: number,
  currency: string,
  fractionDigits: number,
): string {
  const major = minor / 10 ** exponentOf(currency);
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "code",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(major);
}

/** An exact amount — paid, due, refunded, declared. `HKD 2,400.00`. */
export function money(minor: number, currency = "HKD"): string {
  return format(minor, currency, exponentOf(currency));
}

/** A rate or a round reference figure — a ceiling, a monthly fee. `HKD 30`. */
export function moneyRate(minor: number, currency = "HKD"): string {
  return format(minor, currency, 0);
}

function fieldsOf(iso: string, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    ...options,
  }).formatToParts(new Date(iso));
  return (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
}

/** `Fri 4 Dec 2026` */
export function hkDate(iso: string): string {
  const field = fieldsOf(iso, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${field("weekday")} ${field("day")} ${field("month")} ${field("year")}`;
}

/** `Thu 29 Oct` — a day inside the same season as the rest of the letter. */
export function hkDay(iso: string): string {
  const field = fieldsOf(iso, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${field("weekday")} ${field("day")} ${field("month")}`;
}

/** `19:00` */
export function hkTime(iso: string): string {
  const field = fieldsOf(iso, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${field("hour")}:${field("minute")}`;
}

/** `Thu 29 Oct 2026, 19:00` */
export function hkDateTime(iso: string): string {
  return `${hkDate(iso)}, ${hkTime(iso)}`;
}

/** `Thu 29 Oct, 19:00` */
export function hkDayTime(iso: string): string {
  return `${hkDay(iso)}, ${hkTime(iso)}`;
}
