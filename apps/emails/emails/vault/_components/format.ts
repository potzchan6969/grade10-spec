/**
 * Money and dates as a vault letter prints them.
 *
 * Amounts are integer minor units, always HKD — the vault runs no other
 * currency yet — and are formatted the way `@grade10/ui`'s `formatMoney`
 * does: the amount divided by the currency's exponent through
 * `Intl.NumberFormat`. Letters print the currency code rather than its
 * symbol, because a letter is read outside the shop's own chrome.
 *
 * Dates are the shop's, `Asia/Hong_Kong`, whatever clock the reader keeps —
 * the footer says so on every letter.
 */

const TIME_ZONE = "Asia/Hong_Kong";
const LOCALE = "en-GB";
const CURRENCY = "HKD";
const CURRENCY_EXPONENT = 2;

/** An exact amount — sent, owed, repaid, settled. `HKD 38,000.00`. */
export function money(minor: number): string {
  const major = minor / 10 ** CURRENCY_EXPONENT;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    currencyDisplay: "code",
    minimumFractionDigits: CURRENCY_EXPONENT,
    maximumFractionDigits: CURRENCY_EXPONENT,
  }).format(major);
}

function fieldsOf(iso: string, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    ...options,
  }).formatToParts(new Date(iso));
  return (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
}

/** `Wed 16 Sep 2026` */
export function hkDate(iso: string): string {
  const field = fieldsOf(iso, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${field("weekday")} ${field("day")} ${field("month")} ${field("year")}`;
}

/** `13:30` */
export function hkTime(iso: string): string {
  const field = fieldsOf(iso, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${field("hour")}:${field("minute")}`;
}

/** `Wed 16 Sep 2026, 13:30` */
export function hkDateTime(iso: string): string {
  return `${hkDate(iso)}, ${hkTime(iso)}`;
}
