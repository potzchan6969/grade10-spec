const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "3 days ago" — the age reading every card and the footer share. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return iso;

  const elapsed = now - at;
  if (elapsed < 0) return "just now";
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MINUTE), "minute");
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), "hour");

  const days = Math.floor(elapsed / DAY);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return plural(Math.round(days / 30), "month");
  return plural(Math.round(days / 365), "year");
}

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}

/**
 * A date the reader can see, as the day it names.
 *
 * `new Date("2026-09-01")` is UTC midnight, which is still August west of
 * Greenwich — so a calendar day read back through the local calendar can slip
 * a day, and with it a month heading. A date-only string is a day, not an
 * instant; a full timestamp is one, and passes through untouched.
 */
function asDate(iso: string): Date {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return day
    ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
    : new Date(iso);
}

export function formatDate(iso: string): string {
  const at = asDate(iso);
  if (Number.isNaN(at.getTime())) return iso;
  return at.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** The separator a day of events sits under: today and yesterday by name, the
 * date itself once it is neither. */
export function dayLabel(iso: string, now: number = Date.now()): string {
  const at = asDate(iso);
  if (Number.isNaN(at.getTime())) return iso;

  const days = Math.round((midnight(new Date(now)) - midnight(at)) / DAY);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return formatDate(iso);
}

function midnight(at: Date): number {
  return new Date(at.getFullYear(), at.getMonth(), at.getDate()).getTime();
}

export function monthKey(iso: string): string {
  const at = asDate(iso);
  if (Number.isNaN(at.getTime())) return "Undated";
  return at.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

export function shortSha(sha: string): string {
  return /^[0-9a-f]{7,}$/i.test(sha) ? sha.slice(0, 7) : sha;
}
