import { type Instant, toInstant } from "./instant.ts";
import { formatMoment } from "./shapes.ts";

/**
 * The five words a recent row is told in. `@grade10/i18n`'s `dates` catalog
 * satisfies it, so the package holds no sentence of its own.
 */
export type ActivityTimeCopy = {
  justNow: string;
  secondsAgo: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
};

export const JUST_NOW_MAX_MS = 45_000;
export const ACTIVITY_RELATIVE_MAX_MS = 7 * 24 * 60 * 60 * 1000;

const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function formatPluralMessage(template: string, count: number): string {
  const pluralMatch = template.match(/^\{count, plural, (.+)\}$/);
  if (!pluralMatch) {
    return template.replaceAll("#", String(count));
  }

  const branches = pluralMatch[1] ?? "";
  const oneBranch = branches.match(/one \{([^}]*)\}/)?.[1];
  const otherBranch = branches.match(/other \{([^}]*)\}/)?.[1];
  const chosen =
    count === 1 && oneBranch != null
      ? oneBranch
      : (otherBranch ?? String(count));
  return chosen.replaceAll("#", String(count));
}

/** A past instant as a short relative label, from `Just now` to days. */
export function formatRelativeAt(
  at: Instant,
  { copy, now = Date.now() }: { copy: ActivityTimeCopy; now?: number },
): string {
  const instantMs = toInstant(at).getTime();
  if (instantMs > now) {
    throw new RangeError(`Activity time must be in the past: ${at}`);
  }

  const elapsedMs = now - instantMs;

  if (elapsedMs < JUST_NOW_MAX_MS) {
    return copy.justNow;
  }

  if (elapsedMs < MINUTE_MS) {
    return formatPluralMessage(
      copy.secondsAgo,
      Math.floor(elapsedMs / SECOND_MS),
    );
  }

  if (elapsedMs < HOUR_MS) {
    return formatPluralMessage(
      copy.minutesAgo,
      Math.floor(elapsedMs / MINUTE_MS),
    );
  }

  if (elapsedMs < DAY_MS) {
    return formatPluralMessage(copy.hoursAgo, Math.floor(elapsedMs / HOUR_MS));
  }

  if (elapsedMs < ACTIVITY_RELATIVE_MAX_MS) {
    return formatPluralMessage(copy.daysAgo, Math.floor(elapsedMs / DAY_MS));
  }

  throw new RangeError(
    `Elapsed time exceeds relative cap; use formatActivityAt instead: ${at}`,
  );
}

/**
 * Moves a floored clock tick up to the newest row instant past it, so a bid
 * stamped after the last tick reads as just placed rather than in the future.
 * It never reads the device clock: the tick comes from the page's clock, and
 * a row newer than the tick is younger than one tick.
 */
export function resolveActivityNow(
  storedNow: number,
  ...instants: number[]
): number {
  return Math.max(storedNow, ...instants);
}

/** A row's time: relative inside the cap, a local moment past it. */
export function formatActivityAt(
  at: Instant,
  {
    locale = "en",
    timeZone,
    copy,
    now = Date.now(),
  }: {
    locale?: string;
    timeZone: string;
    copy: ActivityTimeCopy;
    now?: number;
  },
): string {
  const instantMs = toInstant(at).getTime();
  const referenceNow = resolveActivityNow(now, instantMs);

  if (referenceNow - instantMs < ACTIVITY_RELATIVE_MAX_MS) {
    return formatRelativeAt(at, { copy, now: referenceNow });
  }

  return formatMoment(at, { locale, timeZone });
}

export function isPastActivityCap(at: Instant, now = Date.now()): boolean {
  return now - toInstant(at).getTime() >= ACTIVITY_RELATIVE_MAX_MS;
}
