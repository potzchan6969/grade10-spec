import type { ShippedLocale } from "../../lib/format-datetime";

/** How a block words a zone: the consumer's label when it has one, the IANA
 * name otherwise, so a zone is always named. */
function zoneLabel(timeZone: string, label?: string): string {
  return label ?? timeZone;
}

type LocaleProps = {
  /** The language the dates are worded in. */
  locale?: ShippedLocale;
};

export type { LocaleProps };
export { zoneLabel };
