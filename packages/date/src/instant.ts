/** A point in time: a `Date`, or its epoch milliseconds. */
export type Instant = Date | number;

/**
 * Back to a plain `Date`. Working in a zone yields a `TZDate`, which carries
 * its offset into `toISOString` - so a boundary that reached a wire would
 * serialize as `...+00:00` where every other instant the platform sends is
 * `...Z`. What a boundary returns is an instant; the zone was how it was
 * computed.
 */
export function plainDate(at: Date): Date {
  return new Date(at.valueOf());
}

/** The instant as a `Date`, or a `RangeError` for one that is not a time. */
export function toInstant(at: Instant): Date {
  const instant = new Date(at);
  if (Number.isNaN(instant.getTime())) {
    throw new RangeError(`Invalid time value: ${at}`);
  }
  return instant;
}

const knownZones = new Set<string>();

/**
 * A zone the runtime cannot read stops the render and names itself. The date
 * library answers an unknown zone with a bare "Invalid time value", which
 * would leave a reader with a deadline and no way to tell which zone was wrong.
 */
export function assertZone(timeZone: string): void {
  if (knownZones.has(timeZone)) return;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
  } catch {
    throw new RangeError(`@grade10/date: unknown time zone "${timeZone}"`);
  }
  knownZones.add(timeZone);
}
