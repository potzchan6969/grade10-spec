import type { HistoryEvent } from "../api/types";
import { STORAGE } from "../editor/config";
import { browserKeyStore } from "../editor/github-store";

/** How much of the store has moved since this reader last looked. The marker
 * is the newest event date they have seen; a browser that cannot remember one
 * simply never badges. */

export function readSeen(): string | null {
  return browserKeyStore.get(STORAGE.recentSeen);
}

export function markSeen(date: string): void {
  browserKeyStore.set(STORAGE.recentSeen, date);
}

/** No marker yet means a first visit, not a hundred unread commits — the
 * caller writes the newest date silently instead. */
export function unseenCount(
  history: HistoryEvent[],
  seen: string | null,
): number {
  const at = seen === null ? Number.NaN : Date.parse(seen);
  if (Number.isNaN(at)) return 0;
  return history.filter((event) => Date.parse(event.date) > at).length;
}
