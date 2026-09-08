/**
 * Panning a strip wider than its viewport, as numbers.
 *
 * Nothing here touches the DOM: the component measures, these decide where
 * the strip should sit, and the component moves it. Offsets are scroll
 * positions — 0 is the strip's left edge showing.
 */

/** How much of the viewport's width, at each side, holds still by default. */
export const HOVER_MARGIN = 0.12;

/** Share of the distance covered each frame while the strip settles. */
export const SETTLE_RATE = 0.22;

/** How far a finger travels before a touch becomes a drag rather than a tap. */
export const DRAG_SLOP = 6;

/** Pixels at each end of the viewport where the mouse does not pan. */
export type Still = { start: number; end: number };

export const clampOffset = (offset: number, overflow: number): number =>
  Math.min(Math.max(offset, 0), Math.max(overflow, 0));

/** The offset a mouse at `x` asks for: the strip's whole overflow spread
 * across the viewport between the still zones, so what sits at either end
 * can be pointed at without the strip sliding away, and the edges are
 * reachable without hunting for the last pixel. Zones that leave no room
 * between them fall back to the default margin. */
export function hoverOffset(
  x: number,
  width: number,
  overflow: number,
  still: Still = { start: width * HOVER_MARGIN, end: width * HOVER_MARGIN },
): number {
  if (overflow <= 0 || width <= 0) return 0;
  let { start, end } = still;
  if (width - start - end < width * 0.2) {
    start = width * HOVER_MARGIN;
    end = width * HOVER_MARGIN;
  }
  return clampOffset(
    ((x - start) / (width - start - end)) * overflow,
    overflow,
  );
}

/** Where the strip lands after a swipe that moved the finger by `delta`. */
export const dragOffset = (
  start: number,
  delta: number,
  overflow: number,
): number => clampOffset(start - delta, overflow);

/** The nearest offset that shows the whole of `target` (a span measured in
 * strip pixels) with `pad` of breathing room — or the current one when the
 * span already shows. A span wider than the viewport aligns to its start. */
export function revealOffset(
  current: number,
  width: number,
  overflow: number,
  target: { start: number; end: number },
  pad = 16,
): number {
  const start = target.start - pad;
  const end = target.end + pad;
  if (start < current) return clampOffset(start, overflow);
  if (end > current + width) {
    return clampOffset(Math.min(start, end - width), overflow);
  }
  return current;
}

/** One frame of settling toward `target`: a share of the remaining distance,
 * snapping when the rest is under a pixel. */
export function approach(
  current: number,
  target: number,
  rate = SETTLE_RATE,
): number {
  const remaining = target - current;
  if (Math.abs(remaining) < 0.5) return target;
  return current + remaining * rate;
}

/** Whether more of the strip lies beyond each edge of the viewport. */
export const beyond = (
  offset: number,
  overflow: number,
): { before: boolean; after: boolean } => ({
  before: offset > 0.5,
  after: offset < overflow - 0.5,
});
