import { formatViewerZoneName } from "@grade10/date";

/** How a block words the shop's zone: the consumer's label when it has one,
 * otherwise the zone's short name (`HKT`, `EDT`) at the instant the block
 * shows, so the name never follows the machine's date. */
function zoneLabel(timeZone: string, at: number, label?: string): string {
  return label ?? formatViewerZoneName(timeZone, at);
}

type LocaleProps = {
  /** The language the dates are worded in. */
  locale?: string;
};

export type { LocaleProps };
export { zoneLabel };
