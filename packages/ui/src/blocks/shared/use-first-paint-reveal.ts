import { useEffect, useState } from "react";

const REVEAL_STAGGER_MS = 40;
const REVEAL_STAGGER_CAP = 6;

const REVEAL_TRANSITION_CLASS =
  "transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)]";
const REVEAL_HIDDEN_CLASS = "translate-y-2 opacity-0";
const REVEAL_VISIBLE_CLASS = "translate-y-0 opacity-100";
const REVEAL_REDUCED_MOTION_CLASS =
  "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";

/** Double-rAF first paint, then settle; reduced motion settles immediately. */
function useFirstPaintReveal() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setRevealed(true));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  return revealed;
}

/**
 * The same entrance as a CSS animation: the markup rests visible, so a page
 * served before its scripts run shows its sections whole, and the entrance
 * plays once on first paint. Reduced motion skips it.
 */
const REVEAL_ENTRANCE_CLASS =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none";

/** The entrance's stagger for one section, as an `animation-delay`. */
function revealEntranceDelayMs(staggerIndex: number): string {
  return `${Math.min(staggerIndex, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS}ms`;
}

function revealStaggerDelayMs(staggerIndex: number, revealed: boolean): string {
  if (!revealed) return "0ms";
  return `${Math.min(staggerIndex, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS}ms`;
}

export {
  REVEAL_ENTRANCE_CLASS,
  REVEAL_HIDDEN_CLASS,
  REVEAL_REDUCED_MOTION_CLASS,
  REVEAL_STAGGER_CAP,
  REVEAL_STAGGER_MS,
  REVEAL_TRANSITION_CLASS,
  REVEAL_VISIBLE_CLASS,
  revealEntranceDelayMs,
  revealStaggerDelayMs,
  useFirstPaintReveal,
};
