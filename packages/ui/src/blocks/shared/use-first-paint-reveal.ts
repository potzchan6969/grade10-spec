const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 6;

/**
 * The entrance as a CSS animation: the markup rests visible, so a page
 * served before its scripts run shows its sections whole, and the entrance
 * plays once on first paint. Reduced motion skips it.
 */
const REVEAL_ENTRANCE_CLASS =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none";

/** The entrance's stagger for one section, as an `animation-delay`. */
function revealEntranceDelayMs(staggerIndex: number): string {
  return `${Math.min(staggerIndex, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS}ms`;
}

export {
  REVEAL_ENTRANCE_CLASS,
  REVEAL_STAGGER_CAP,
  REVEAL_STAGGER_MS,
  revealEntranceDelayMs,
};
