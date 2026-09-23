/**
 * Money, dates and lists as a letter prints them — every letter this app
 * renders, grading and vault alike, in the shapes the worker prints them in.
 *
 * Amounts are minor units, as every Grade10 surface carries them, divided by
 * the currency's exponent and printed with its symbol in the platform's
 * language: `HK$2,400.00`.
 *
 * Dates are the shop's, `Asia/Hong_Kong`, whatever clock the reader keeps —
 * the footer says so on every letter — in the platform's two shapes: a
 * calendar date, `4 Dec 2026`, and a date with its time, `4 Dec 2026, 19:00`.
 */

const TIME_ZONE = "Asia/Hong_Kong";
const LOCALE = "en";

/** ISO 4217 minor-unit exponent, for the currencies a letter can carry. */
const CURRENCY_EXPONENT: Readonly<Record<string, number>> = { HKD: 2 };

function exponentOf(currency: string): number {
  const exponent = CURRENCY_EXPONENT[currency.toUpperCase()];
  if (exponent === undefined) {
    throw new Error(`Unsupported currency for a letter: ${currency}`);
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
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(major);
}

/** An exact amount — paid, due, refunded, declared. `HK$2,400.00`. */
export function money(minor: number, currency = "HKD"): string {
  return format(minor, currency, exponentOf(currency));
}

/** A rate or a round reference figure — a ceiling, a monthly fee. `HK$30`. */
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

/** `4 Dec 2026` */
export function hkDate(iso: string): string {
  const field = fieldsOf(iso, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${field("day")} ${field("month")} ${field("year")}`;
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

/** `29 Oct 2026, 19:00` */
export function hkDateTime(iso: string): string {
  return `${hkDate(iso)}, ${hkTime(iso)}`;
}

/**
 * A day inside the same season as the rest of the letter. The worker prints
 * one calendar-date shape, so this is that shape: `29 Oct 2026`.
 */
export const hkDay = hkDate;

/** A day and its time, in the one shape the worker prints: `29 Oct 2026, 19:00`. */
export const hkDayTime = hkDateTime;

const LIST = new Intl.ListFormat(LOCALE, {
  style: "long",
  type: "conjunction",
});

/** `a, b, and c`, as the worker joins what rides with a letter. */
export function list(items: readonly string[]): string {
  return LIST.format(items);
}
