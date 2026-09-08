/** Placing a card beside a box inside a frame, as numbers. */

export type Box = { x: number; y: number; w: number; h: number };
export type Size = { w: number; h: number };

export const CARD_GAP = 8;
export const CARD_INSET = 12;

const clamp = (value: number, low: number, high: number) =>
  Math.min(Math.max(value, low), Math.max(high, low));

/** Below the box, centred; above when the frame ends too soon; beside it
 * when neither fits, to the right before the left. Always inside the frame,
 * and inside its inset where there is room. */
export function placeCard(
  box: Box,
  card: Size,
  frame: Size,
  gap = CARD_GAP,
  inset = CARD_INSET,
): { left: number; top: number } {
  const centred = clamp(
    box.x + box.w / 2 - card.w / 2,
    inset,
    frame.w - card.w - inset,
  );
  const below = box.y + box.h + gap;
  if (below + card.h + inset <= frame.h) return { left: centred, top: below };
  const above = box.y - gap - card.h;
  if (above >= inset) return { left: centred, top: above };
  const level = clamp(box.y, inset, frame.h - card.h - inset);
  const right = box.x + box.w + gap;
  if (right + card.w + inset <= frame.w) return { left: right, top: level };
  const left = box.x - gap - card.w;
  if (left >= inset) return { left, top: level };
  return { left: centred, top: level };
}
