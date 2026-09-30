import type {
  EnvironmentAvailability,
  EnvironmentReceiptSummary,
} from "./types";

const STALE_AFTER = 24 * 60 * 60 * 1000;

/** Freshness follows the last successful manual read of GitHub, not the time
 * when an application deployment happened. Evaluated when the reader opens
 * the page so a failed refresh makes the previously published receipt age. */
export function availabilityIsStale(
  evidence:
    | Pick<EnvironmentAvailability, "fetchedAt">
    | Pick<EnvironmentReceiptSummary, "fetchedAt">,
  now = Date.now(),
): boolean {
  if (!evidence.fetchedAt) return true;
  const fetched = Date.parse(evidence.fetchedAt);
  return !Number.isFinite(fetched) || now - fetched > STALE_AFTER;
}

export function visibleAvailabilityState(
  availability: EnvironmentAvailability,
  now = Date.now(),
): EnvironmentAvailability["state"] {
  return availabilityIsStale(availability, now) ? "stale" : availability.state;
}
