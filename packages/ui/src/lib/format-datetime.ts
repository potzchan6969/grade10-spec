const UTC_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseInstant(at: Date | number): Date {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${at}`);
  }
  return date;
}

function utcParts(date: Date) {
  return {
    day: date.getUTCDate(),
    month: UTC_MONTHS[date.getUTCMonth()],
    year: date.getUTCFullYear(),
    hours: String(date.getUTCHours()).padStart(2, "0"),
    minutes: String(date.getUTCMinutes()).padStart(2, "0"),
    seconds: String(date.getUTCSeconds()).padStart(2, "0"),
  };
}

/** Day shape: `26 Aug 2026`. */
export function formatDay(at: Date | number): string {
  const { day, month, year } = utcParts(parseInstant(at));
  return `${day} ${month} ${year}`;
}

/** Moment shape: `24 Aug 2026, 18:00 UTC`. */
export function formatMoment(at: Date | number): string {
  const { day, month, year, hours, minutes } = utcParts(parseInstant(at));
  return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

/** Event shape: `24 Aug 2026, 18:00:14 UTC`. */
export function formatEvent(at: Date | number): string {
  const { day, month, year, hours, minutes, seconds } = utcParts(
    parseInstant(at),
  );
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} UTC`;
}

/** Deadline shape — minute precision with zone named. */
export function formatDeadline(at: Date | number): string {
  return formatMoment(at);
}

/** Whether a label matches the platform moment shape. */
export function isMomentLabel(label: string): boolean {
  return label.endsWith(" UTC") && label.includes(", ");
}

/** Auction listing close prefix. */
export function formatListingEnds(at: Date | number): string {
  return `Ends ${formatDeadline(at)}`;
}

/** Auction listing closed prefix. */
export function formatListingClosed(at: Date | number): string {
  return `Closed ${formatDeadline(at)}`;
}

/** Auction listing opens prefix. */
export function formatListingOpens(at: Date | number): string {
  return `Opens ${formatDeadline(at)}`;
}

/** @deprecated Use {@link formatMoment}. */
export const formatAuctionMoment = formatMoment;

/** @deprecated Use {@link formatListingEnds}. */
export const formatAuctionDeadline = formatListingEnds;

/** @deprecated Use {@link formatListingClosed}. */
export const formatAuctionClosed = formatListingClosed;

/** @deprecated Use {@link formatListingOpens}. */
export const formatAuctionOpens = formatListingOpens;
