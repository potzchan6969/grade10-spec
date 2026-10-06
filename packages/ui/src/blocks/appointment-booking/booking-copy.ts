import {
  formatViewerZoneName,
  type ShippedLocale,
} from "../../lib/format-datetime";

/** How a block words a zone: the consumer's label when it has one, otherwise
 * the viewer's short name (`HKT`, `EDT`). */
function zoneLabel(timeZone: string, label?: string): string {
  return label ?? formatViewerZoneName(timeZone);
}

type LocaleProps = {
  /** The language the dates are worded in. */
  locale?: ShippedLocale;
};

export type { LocaleProps };
export { zoneLabel };
