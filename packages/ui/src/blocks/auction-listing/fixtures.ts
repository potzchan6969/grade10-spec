import type { ClockStore } from "./listing-clock";

/** A clock a story moves by hand, so a countdown can be pinned to the millisecond. */
export function createFakeClock(startMs: number): {
  store: ClockStore;
  set: (nowMs: number) => void;
  advance: (deltaMs: number) => void;
  now: () => number;
} {
  const listeners = new Set<() => void>();
  let nowMs = startMs;
  const set = (next: number) => {
    nowMs = next;
    for (const listener of [...listeners]) listener();
  };
  return {
    store: {
      subscribe(onTick) {
        listeners.add(onTick);
        return () => listeners.delete(onTick);
      },
      getSnapshot: () => nowMs,
      getServerSnapshot: () => nowMs,
    },
    set,
    advance: (deltaMs) => set(nowMs + deltaMs),
    now: () => nowMs,
  };
}
