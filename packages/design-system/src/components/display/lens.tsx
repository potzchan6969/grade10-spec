// Adapted from Ballmac UI Lens — https://ui.ballmac.com/components/lens
import { cn } from "@grade10/design-system/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type LensProps = Omit<ComponentProps<"div">, "children"> & {
  /** What to magnify: usually an image, but any visual content works. */
  children: ReactNode;
  /**
   * What the lens renders magnified. Defaults to `children` — pass a
   * higher-resolution copy to make the lens read a separate zoom source.
   */
  magnified?: ReactNode;
  /** How much the lens enlarges what is under it. */
  zoom?: number;
  /** Diameter of the lens in pixels. */
  lensSize?: number;
  /** Accessible name for the magnifier group. */
  label: string;
  /**
   * Appended to `label` in the group's accessible name — the consumer's
   * pointer and keyboard instructions.
   */
  instructions?: string;
};

/** Distance the lens travels per arrow key, in pixels. */
const STEP = 24;

/**
 * Magnifying lens over any content. The lens follows the pointer, moves with
 * the arrow keys when the group is focused, and hides on Escape. The
 * magnified copy inside it is inert and out of the accessibility tree.
 * Touch pointers are ignored so scrolling is never blocked.
 */
function Lens({
  children,
  magnified,
  zoom = 2.2,
  lensSize = 160,
  label,
  instructions,
  className,
  onPointerMove,
  onPointerLeave,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: LensProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState<"pointer" | "keyboard" | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = (x: number, y: number) => ({
    x: Math.min(Math.max(x, 0), box.w),
    y: Math.min(Math.max(y, 0), box.h),
  });

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setMode("pointer");
    setPos(clamp(event.clientX - rect.left, event.clientY - rect.top));
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event);
    if (mode === "pointer") {
      setPos(null);
      setMode(null);
    }
  }

  function handleFocus(event: ReactFocusEvent<HTMLDivElement>) {
    onFocus?.(event);
    if (event.currentTarget.matches(":focus-visible") && mode !== "pointer") {
      setMode("keyboard");
      setPos((current) => current ?? { x: box.w / 2, y: box.h / 2 });
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>) {
    onBlur?.(event);
    if (mode === "keyboard") {
      setPos(null);
      setMode(null);
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    if (event.key === "Escape") {
      setPos(null);
      setMode(null);
      // An ancestor may read the same keys — keep them inside the lens.
      event.stopPropagation();
      return;
    }
    const delta = move[event.key];
    if (delta) {
      event.preventDefault();
      event.stopPropagation();
      setMode("keyboard");
      setPos((current) => {
        const base = current ?? { x: box.w / 2, y: box.h / 2 };
        return clamp(base.x + delta[0], base.y + delta[1]);
      });
    }
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: the group is a magnifier widget, not a form fieldset — arrow keys move the lens.
    <div
      ref={ref}
      data-slot="lens"
      role="group"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so arrow keys can drive the lens and its instructions announce.
      tabIndex={0}
      aria-label={instructions ? `${label}. ${instructions}` : label}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-block cursor-zoom-in overflow-hidden rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      {children}
      {pos && box.w > 0 && (
        <motion.div
          aria-hidden="true"
          data-slot="lens-magnifier"
          className="pointer-events-none absolute top-0 start-0 z-10 overflow-hidden rounded-full border-2 border-white/90 bg-background shadow-[0_12px_32px_-6px_rgb(0_0_0/0.45),inset_0_0_0_1px_rgb(0_0_0/0.15)]"
          style={{
            width: lensSize,
            height: lensSize,
            x: pos.x - lensSize / 2,
            y: pos.y - lensSize / 2,
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          {/* A second copy of the content, scaled up around the pointer. It
              is hidden from assistive tech and cannot be focused. */}
          <div
            inert
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: box.w,
              height: box.h,
              transform: `translate(${lensSize / 2 - pos.x * zoom}px, ${lensSize / 2 - pos.y * zoom}px) scale(${zoom})`,
            }}
          >
            {magnified ?? children}
          </div>
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(120%_120%_at_30%_15%,rgb(255_255_255/0.28),transparent_45%)]" />
        </motion.div>
      )}
    </div>
  );
}

export type { LensProps };
export { Lens };
