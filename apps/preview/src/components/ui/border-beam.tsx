"use client";

import { cn } from "@grade10/design-system/lib/utils";
import { motion, type MotionStyle, type Transition } from "motion/react";
import type { CSSProperties } from "react";

type BorderBeamProps = {
  /** The size of the border beam. */
  size?: number;
  /** The duration of the border beam, in seconds. */
  duration?: number;
  /** The delay of the border beam, in seconds. */
  delay?: number;
  /** The start color of the beam gradient. */
  colorFrom?: string;
  /** The end color of the beam gradient. */
  colorTo?: string;
  /** The motion transition of the border beam. */
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  /** Whether to reverse the animation direction. */
  reverse?: boolean;
  /** The initial offset position (0–100). */
  initialOffset?: number;
  /** The border width of the beam. */
  borderWidth?: number;
  /**
   * Corner radius of the path the beam travels, in px. Must match the
   * parent card’s border-radius or the beam skips the curves.
   */
  borderRadius?: number;
};

/**
 * Magic UI Border Beam — a light that travels the rounded border of its
 * parent. The parent must be `relative` with a matching `borderRadius`.
 */
function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  borderRadius = 28,
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as CSSProperties
      }
    >
      <motion.div
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className,
        )}
        initial={{ offsetDistance: `${initialOffset}%` }}
        style={
          {
            width: size,
            offsetPath: `inset(0 round ${borderRadius}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
}

export { BorderBeam };
export type { BorderBeamProps };
