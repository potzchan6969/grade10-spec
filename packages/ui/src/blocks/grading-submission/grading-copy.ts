import {
  formatLocalDay,
  formatLocalMoment,
  intlLocale,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import type { GradingMoney } from "./types";

/** The language and the zone every figure and day in the set reads in. Both
 * arrive from the consumer; no block picks one. */
type GradingLocaleProps = {
  /** The language a figure or a day is worded in. */
  locale?: ShippedLocale;
  /** The IANA zone a day or an instant reads in. */
  timeZone?: string;
};

const DEFAULT_TIME_ZONE = "Asia/Hong_Kong";

/** An amount as the consumer gave it: minor units and a code, in their locale.
 * The package's `formatMoney` does the rendering and nothing else. */
function formatGradingMoney(
  money: GradingMoney,
  locale: ShippedLocale = "en",
): string {
  return formatMoney(money.amountMinor, money.currency, {
    locale: intlLocale(locale),
  });
}

/** A calendar day in the zone the consumer gave. */
function formatGradingDay(
  at: number,
  { locale = "en", timeZone = DEFAULT_TIME_ZONE }: GradingLocaleProps = {},
): string {
  return formatLocalDay(at, { locale, timeZone });
}

/** An instant in the zone the consumer gave. */
function formatGradingMoment(
  at: number,
  { locale = "en", timeZone = DEFAULT_TIME_ZONE }: GradingLocaleProps = {},
): string {
  return formatLocalMoment(at, { locale, timeZone });
}

export type { GradingLocaleProps };
export {
  DEFAULT_TIME_ZONE,
  formatGradingDay,
  formatGradingMoment,
  formatGradingMoney,
};
