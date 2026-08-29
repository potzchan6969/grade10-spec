import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";
import { seekFrames } from "../blocks/seek";

/**
 * Where the page lands after a navigation. One owner, so nothing races the
 * hash seek.
 *
 * The browser's own restoration is off and the router's is unused: both fire on
 * a schedule of their own and would undo a landing that had already happened. A
 * new page starts at the top, going back returns to where that entry was left,
 * and a URL carrying a hash is left to `useHashFlash` — the only thing that
 * knows when the row that hash names finally exists.
 */

// At import, not in an effect: the browser restores scroll during load, which
// is well before any effect of ours would have run.
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

/** A restored page can still be growing, so a deep position waits for its room. */
const RESTORE_BUDGET = 1000;

/** Last scroll position of each history entry, by the key the router gives it. */
const left = new Map<string, number>();

export function useScrollMemory() {
  const { key, pathname, hash } = useLocation();
  const action = useNavigationType();
  const previous = useRef(pathname);

  useEffect(() => {
    const remember = () => left.set(key, Math.round(window.scrollY));
    window.addEventListener("scroll", remember, { passive: true });
    return () => window.removeEventListener("scroll", remember);
  }, [key]);

  useEffect(() => {
    const moved = previous.current !== pathname;
    previous.current = pathname;

    if (hash !== "") {
      // The hash owns where this lands. A new page still opens at the top
      // first, so a hash that turns out to name nothing does not leave the
      // reader halfway down a page they have never seen.
      if (moved && action !== "POP") window.scrollTo(0, 0);
      return;
    }

    const wanted = action === "POP" ? (left.get(key) ?? 0) : 0;
    if (wanted === 0) {
      window.scrollTo(0, 0);
      return;
    }
    return seekFrames(
      () => (roomFor(wanted) ? wanted : null),
      (y) => window.scrollTo(0, y),
      RESTORE_BUDGET,
    );
  }, [key, pathname, hash, action]);
}

function roomFor(y: number): boolean {
  return document.documentElement.scrollHeight - window.innerHeight >= y;
}
