import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Check, LinkSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { seekFrames } from "./seek";

/** The id `location.hash` names, empty where it names none. */
export function useHashId(): string {
  const { hash } = useLocation();
  return decodeURIComponent(hash.replace(/^#/, ""));
}

/** True while `location.hash` points at any of these ids. Rows open on it. */
export function useHashTarget(...ids: (string | undefined)[]): boolean {
  const target = useHashId();
  return target !== "" && ids.some((id) => id === target);
}

type AnchorLinkProps = {
  id: string;
  label?: string;
  className?: string;
};

/**
 * The copy-link control every deep-linkable row carries. Clipboard access can
 * be refused; the fallback puts the link in the address bar so the row is still
 * shareable rather than failing quietly.
 */
export function AnchorLink({
  id,
  label = "Copy link to this row",
  className,
}: AnchorLinkProps) {
  const { pathname, search } = useLocation();
  const [state, setState] = useState<"idle" | "copied" | "address">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 1600);
    return () => window.clearTimeout(timer);
  }, [state]);

  const href = `${pathname}${search}#${id}`;

  const copy = async () => {
    const absolute = new URL(href, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(absolute);
      setState("copied");
    } catch {
      window.history.replaceState(null, "", href);
      setState("address");
    }
  };

  return (
    <IconButton
      aria-label={
        state === "copied"
          ? "Link copied"
          : state === "address"
            ? "Link put in the address bar"
            : label
      }
      className={`opacity-0 transition-opacity focus-visible:opacity-100 group-hover/anchor:opacity-100 ${className ?? ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void copy();
      }}
      size="xs"
      title={state === "idle" ? label : "Link ready to paste"}
      variant="ghost"
    >
      {state === "idle" ? <LinkSimple aria-hidden /> : <Check aria-hidden />}
    </IconButton>
  );
}

/** How long a landing is defended after it happens, in milliseconds. */
const HOLD_MS = 1500;

/**
 * Keeps a landing that something else undid. A window back at the top with the
 * target still below it is the signature of a scroll nobody here asked for — a
 * browser restoring its own idea of the position, an extension — and every frame
 * it shows, the landing is made again. A reader who scrolled somewhere of their
 * own leaves the page off the top, which is not that signature, so they are left
 * alone. Watching runs the whole window rather than stopping at the first calm
 * frame: a competing scroll that arrives late is the one worth catching.
 */
function hold(target: HTMLElement, snap: () => void): () => void {
  const until = performance.now() + HOLD_MS;
  let frame = 0;

  const watch = () => {
    if (window.scrollY === 0 && target.getBoundingClientRect().top > 200) {
      snap();
    }
    if (performance.now() < until) frame = window.requestAnimationFrame(watch);
  };

  frame = window.requestAnimationFrame(watch);
  return () => window.cancelAnimationFrame(frame);
}

/**
 * Scrolls to `location.hash` and flashes it. The target may not exist for
 * several frames — a cold load paints before the snapshot lands, and the row the
 * hash names opens from that same hash one commit after it renders — so this
 * keeps looking until it appears rather than giving up on the first frame, then
 * holds where it landed.
 */
export function useHashFlash(ready = true) {
  const { pathname, hash } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is a trigger, not a read — the same hash on a new route must scroll again.
  useEffect(() => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (id === "" || !ready) return;

    let clear = 0;
    let again = 0;
    let release = () => {};
    const stop = seekFrames<HTMLElement>(
      () => document.getElementById(id),
      (target) => {
        const aim = (behavior: ScrollBehavior) =>
          target.scrollIntoView({ block: "start", behavior });
        aim("smooth");
        // The row opens the commit after it appears, and a page that grows
        // under a scroll already in flight lands short. Aim once more.
        again = window.setTimeout(() => aim("smooth"), 250);
        // A correction answers an instant scroll, so it is instant too —
        // restarting a smooth one every frame would never arrive.
        release = hold(target, () => aim("auto"));
        target.classList.add("hash-flash");
        clear = window.setTimeout(
          () => target.classList.remove("hash-flash"),
          1800,
        );
      },
    );

    return () => {
      stop();
      release();
      window.clearTimeout(again);
      window.clearTimeout(clear);
    };
  }, [pathname, hash, ready]);
}
