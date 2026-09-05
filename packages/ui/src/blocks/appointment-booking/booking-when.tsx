import { formatLocalDay, formatLocalTime } from "../../lib/format-datetime";
import { type LocaleProps, zoneLabel } from "./booking-copy";

type BookingWhenProps = LocaleProps & {
  start: number;
  end: number;
  timeZone: string;
  timeZoneLabel?: string;
};

/** `24 Aug 2026, 10:00 to 10:30 (Hong Kong time)`. Internal. */
function formatBookingWhen({
  start,
  end,
  timeZone,
  timeZoneLabel,
  locale = "en",
}: BookingWhenProps): string {
  const options = { locale, timeZone };
  return `${formatLocalDay(start, options)}, ${formatLocalTime(start, options)}–${formatLocalTime(end, options)} (${zoneLabel(timeZone, timeZoneLabel)})`;
}

export type { BookingWhenProps };
export { formatBookingWhen };
