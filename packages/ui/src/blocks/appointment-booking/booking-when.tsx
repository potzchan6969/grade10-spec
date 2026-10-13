import { formatDay, formatTimeOfDay } from "@grade10/date";
import { type LocaleProps, zoneLabel } from "./booking-copy";

type BookingWhenProps = LocaleProps & {
  start: number;
  end: number;
  timeZone: string;
  timeZoneLabel?: string;
};

/** `24 Aug 2026, 10:00 to 10:30 (GMT+8)`. Internal. */
function formatBookingWhen({
  start,
  end,
  timeZone,
  timeZoneLabel,
  locale = "en",
}: BookingWhenProps): string {
  const options = { locale, timeZone };
  return `${formatDay(start, options)}, ${formatTimeOfDay(start, options)}–${formatTimeOfDay(end, options)} (${zoneLabel(timeZone, start, timeZoneLabel)})`;
}

export type { BookingWhenProps };
export { formatBookingWhen };
