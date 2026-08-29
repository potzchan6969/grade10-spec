/**
 * Looking for something the page has not rendered yet.
 *
 * The snapshot arrives after first paint, and a row opens from the same hash
 * that names it one commit later — so a single look after the first frame finds
 * nothing on a cold load. This keeps looking, frame by frame, until it lands or
 * the budget runs out. Nothing here touches the DOM: the caller passes in what
 * to look for and what to do with it, which is what makes it testable.
 *
 * The budget is time, never a count of frames. A frame is 16ms on one machine,
 * 8ms on a 120Hz one, and whatever the compositor feels like under headless
 * Chrome — counting them makes a budget that quietly means something different
 * everywhere it runs.
 */

/** Long enough for a slow render, short enough to end. */
export const SEEK_BUDGET = 3000;

export type Seek<T> = {
  find: () => T | null;
  land: (found: T) => void;
  schedule: (tick: () => void) => number;
  cancel: (handle: number) => void;
  /** Milliseconds to keep looking. */
  budget?: number;
  now?: () => number;
};

/** Returns the stop handle; calling it twice is safe. */
export function seek<T>({
  find,
  land,
  schedule,
  cancel,
  budget = SEEK_BUDGET,
  now = () => performance.now(),
}: Seek<T>): () => void {
  const deadline = now() + budget;
  let handle = 0;
  let stopped = false;

  const tick = () => {
    if (stopped) return;
    const found = find();
    if (found !== null) {
      stopped = true;
      land(found);
      return;
    }
    if (now() < deadline) handle = schedule(tick);
    else stopped = true;
  };

  handle = schedule(tick);
  return () => {
    if (stopped) return;
    stopped = true;
    cancel(handle);
  };
}

/** The same seek, driven by paints. The browser half, kept out of the logic. */
export function seekFrames<T>(
  find: () => T | null,
  land: (found: T) => void,
  budget = SEEK_BUDGET,
): () => void {
  return seek({
    find,
    land,
    budget,
    schedule: (tick) => window.requestAnimationFrame(tick),
    cancel: (handle) => window.cancelAnimationFrame(handle),
  });
}
