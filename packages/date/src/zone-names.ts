import { assertZone, type Instant, toInstant } from "./instant.ts";
import { PLATFORM_LOCALE, PLATFORM_ZONE } from "./platform.ts";

/** A zone's plain name - `Hong Kong Standard Time` - or the id when it has none. */
export function zoneName(timeZone: string, locale = PLATFORM_LOCALE): string {
  const named = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: "long",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  return named ?? timeZone;
}

/**
 * The viewer's short zone name at that instant: `HKT`, `EDT`, or the offset
 * (`GMT+9`) where US English has no short name. Hong Kong is always `HKT`. The
 * instant is read first, so an invalid one stops every zone alike, and a zone
 * the runtime does not know stops the render by name.
 */
export function formatViewerZoneName(timeZone: string, at: Instant): string {
  const instant = toInstant(at);
  if (timeZone === "Asia/Hong_Kong") return "HKT";
  assertZone(timeZone);
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName");
  if (name === undefined) {
    throw new RangeError(`No zone name for ${timeZone} at ${instant}`);
  }
  return name.value.replace(/^UTC/, "GMT");
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** A weekday's own name, `0` Sunday through `6` Saturday - a shop's own
 * opening hours, a diary's own rule, worded on no zone since a weekday is a
 * calendar fact, never an instant. */
export function weekdayName(
  weekday: number,
  locale: string = PLATFORM_LOCALE,
): string {
  const named = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: PLATFORM_ZONE,
  }).format(new Date(Date.UTC(2023, 0, 1 + weekday)));
  return named || WEEKDAY_NAMES[weekday % 7];
}

/** Two weekdays read as one range, in the reader's own locale - never the
 * English word "to". A single day names itself, through `weekdayName`. */
export function weekdayRangeName(
  fromWeekday: number,
  toWeekday: number,
  locale: string = PLATFORM_LOCALE,
): string {
  if (fromWeekday === toWeekday) return weekdayName(fromWeekday, locale);
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: PLATFORM_ZONE,
  });
  return formatter.formatRange(
    new Date(Date.UTC(2023, 0, 1 + fromWeekday)),
    new Date(Date.UTC(2023, 0, 1 + toWeekday)),
  );
}

/** The minute a day ends at: a shop open until midnight closes at 1440. */
const DAY_END_MINUTE = 24 * 60;

const clockFace = (locale: string, hourCycle: "h23" | "h24") =>
  new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle,
    timeZone: PLATFORM_ZONE,
  });

/** Two clock faces - minutes past local midnight - read as one range, on a
 * 24-hour clock, in the reader's own locale - never the English word "to".
 * A shop's own opening hours; the day itself carries no meaning here, so
 * every minute reads against the same anchor day `weekdayRangeName` does.
 * A range that runs to the day's end reads its close as 24:00 with the
 * locale's own range separator, never as the next day's date. */
export function formatTimeRange(
  startMinute: number,
  endMinute: number,
  locale: string = PLATFORM_LOCALE,
): string {
  const formatter = clockFace(locale, "h23");
  const at = (minute: number) => new Date(Date.UTC(2023, 0, 1, 0, minute));
  if (endMinute < DAY_END_MINUTE) {
    return formatter.formatRange(at(startMinute), at(endMinute));
  }
  const separator = formatter
    .formatRangeToParts(at(0), at(60))
    .filter((part) => part.source === "shared")
    .map((part) => part.value)
    .join("");
  const close = clockFace(locale, "h24").format(at(0));
  return `${formatter.format(at(startMinute))}${separator}${close}`;
}
