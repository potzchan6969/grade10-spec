import {
  formatLocalDay,
  formatLocalMoment,
  intlLocale,
  type ShippedLocale,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import type { GradingMoney } from "./types";

/** The language a block's figures read in. It arrives from the consumer; no
 * block picks one. A block that renders neither money nor a day takes it not
 * at all. */
type GradingLocaleProps = {
  /** The language a figure or a day is worded in. */
  locale?: ShippedLocale;
};

/** A block that renders a day or an instant takes the zone to read it in as
 * well. Only those blocks take it, so none accepts a zone it drops, and none
 * carries a zone of its own. */
type GradingZonedProps = GradingLocaleProps & {
  /** The IANA zone a day or an instant reads in. */
  timeZone: string;
};

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
  { locale = "en", timeZone }: GradingZonedProps,
): string {
  return formatLocalDay(at, { locale, timeZone });
}

/** An instant in the zone the consumer gave. */
function formatGradingMoment(
  at: number,
  { locale = "en", timeZone }: GradingZonedProps,
): string {
  return formatLocalMoment(at, { locale, timeZone });
}

/**
 * A copy line whose words carry a value: the consumer's own translator,
 * handed the values the block works out. The catalogs word the whole
 * sentence in one key, so the block never fills a template itself.
 */
type GradingFormat<Values extends Record<string, string>> = (
  values: Values,
) => string;

export type { GradingFormat, GradingLocaleProps, GradingZonedProps };
export { formatGradingDay, formatGradingMoment, formatGradingMoney };
