import { cn } from "@grade10/design-system/lib/utils";
import type { AnimationEvent, ComponentProps } from "react";

const FILL_ANIMATION = "carousel-progress-fill";

/** Fixed track height — Figma `Size` rung is 6px (`h-1.5`). */
const TRACK_SIZE = "h-1.5 min-h-1.5 max-h-1.5";

type CarouselProgressProps = ComponentProps<"nav">;

/**
 * Dot pagination for a carousel. The active item can show a linear fill that
 * reports completion through `onComplete` — used for auto-advance timers.
 *
 * Figma `CarouselProgress` draws the item states (`inactive` | `active` |
 * `filling` | `complete`). Timed fill is driven in code by `durationMs`, not
 * a Figma prop. With no timer, `active` is solid `primary` like `complete`.
 */
function CarouselProgress({
  className,
  children,
  "aria-label": ariaLabel = "Slides",
  ...props
}: CarouselProgressProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn("flex items-center gap-2", className)}
      data-slot="carousel-progress"
      {...props}
    >
      {children}
      <style>{`
        @keyframes ${FILL_ANIMATION} {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </nav>
  );
}

type CarouselProgressItemProps = Omit<ComponentProps<"button">, "children"> & {
  /** Accessible name for this slide control. */
  label: string;
  /** Whether this item is the current slide. */
  active?: boolean;
  /**
   * Duration of the active fill. Omit or set `0` for a static active pill
   * with no timer.
   */
  durationMs?: number;
  /** Pauses the fill animation without resetting it. */
  paused?: boolean;
  /**
   * Change to restart the fill (for example after the consumer advances or
   * the user picks another slide).
   */
  playKey?: number | string;
  /** Prefer a full-width static fill instead of animating. */
  reduceMotion?: boolean;
  /** Fires when the fill animation finishes. */
  onComplete?: () => void;
};

/**
 * One carousel progress control. Active items widen into a pill; with no timer
 * they use solid `primary`. When `durationMs` is set the track stays
 * `background-strong` and fills with `primary` until `onComplete`.
 */
function CarouselProgressItem({
  className,
  label,
  active = false,
  durationMs,
  paused = false,
  playKey = 0,
  reduceMotion = false,
  onComplete,
  type = "button",
  ...props
}: CarouselProgressItemProps) {
  const timed = Boolean(active && durationMs && durationMs > 0);

  function handleAnimationEnd(event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== FILL_ANIMATION) return;
    onComplete?.();
  }

  return (
    <button
      aria-current={active ? "true" : undefined}
      aria-label={label}
      className={cn(
        "relative inline-block shrink-0 appearance-none overflow-hidden rounded-full border-0 p-0 leading-none outline-none transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
        TRACK_SIZE,
        active
          ? timed
            ? "w-8 bg-background-strong"
            : "w-8 bg-primary"
          : "w-1.5 bg-background-strong opacity-80 hover:opacity-100",
        className,
      )}
      data-active={active ? "" : undefined}
      data-slot="carousel-progress-item"
      type={type}
      {...props}
    >
      {timed ? (
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 h-full rounded-full bg-primary"
          key={playKey}
          onAnimationEnd={handleAnimationEnd}
          style={
            reduceMotion
              ? { width: "100%" }
              : {
                  animation: `${FILL_ANIMATION} ${durationMs}ms linear forwards`,
                  animationPlayState: paused ? "paused" : "running",
                  width: "0%",
                }
          }
        />
      ) : null}
    </button>
  );
}

export type { CarouselProgressItemProps, CarouselProgressProps };
export { CarouselProgress, CarouselProgressItem };
