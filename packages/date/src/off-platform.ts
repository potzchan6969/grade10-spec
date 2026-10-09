import { assertZone, type Instant, toInstant } from "./instant.ts";

/**
 * Shapes that sit outside the platform's: they print today what two surfaces
 * printed before this package existed, and move here unchanged so no string
 * moves with them. A new surface picks one of the platform's shapes instead.
 */

/**
 * An issued document's moment: `September 24, 2026, 12:30 GMT+8`. English
 * whatever the document's language, with the zone's offset at that instant.
 */
export function formatDocumentMoment(at: Instant, timeZone: string): string {
  const instant = toInstant(at);
  assertZone(timeZone);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(instant);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  }).format(instant);
  return `${date}, ${time}`;
}

type RuntimeStyle = { locale: string; timeZone: string };

/**
 * A day in the locale's own medium style, as the runtime words it:
 * `14 Sept 2026` for `en-HK`. The month word follows the runtime's ICU, so
 * this is sample copy for a design page and not a platform shape.
 */
export function formatMediumDay(
  at: Instant,
  { locale, timeZone }: RuntimeStyle,
): string {
  const instant = toInstant(at);
  assertZone(timeZone);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone,
  }).format(instant);
}

/** The same medium day with the locale's own short time: `14 Sept 2026, 12:30 pm`. */
export function formatMediumMoment(
  at: Instant,
  { locale, timeZone }: RuntimeStyle,
): string {
  const instant = toInstant(at);
  assertZone(timeZone);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(instant);
}
