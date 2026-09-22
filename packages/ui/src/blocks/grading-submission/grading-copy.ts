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
 * well. Only those blocks take it, so none accepts a zone it drops. */
type GradingZonedProps = GradingLocaleProps & {
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
  { locale = "en", timeZone = DEFAULT_TIME_ZONE }: GradingZonedProps = {},
): string {
  return formatLocalDay(at, { locale, timeZone });
}

/** An instant in the zone the consumer gave. */
function formatGradingMoment(
  at: number,
  { locale = "en", timeZone = DEFAULT_TIME_ZONE }: GradingZonedProps = {},
): string {
  return formatLocalMoment(at, { locale, timeZone });
}

/**
 * A catalog message with its placeholders filled. The catalogs word a whole
 * sentence in one key — `{set} · {number} · matched in the catalogue` — so a
 * block fills that key rather than taking the sentence in pieces. A
 * placeholder nobody answered is a copy bug, not a blank: it throws by name.
 */
function fillGradingCopy(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(/{(\w+)}/g, (_match, name: string) => {
    const value = values[name];
    if (value == null) {
      throw new Error(`grading copy: no value for {${name}} in "${template}"`);
    }
    return value;
  });
}

export type { GradingLocaleProps, GradingZonedProps };
export {
  DEFAULT_TIME_ZONE,
  fillGradingCopy,
  formatGradingDay,
  formatGradingMoment,
  formatGradingMoney,
};
