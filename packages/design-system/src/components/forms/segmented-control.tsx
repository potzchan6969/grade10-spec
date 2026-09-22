"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";

// Figma set `Segmented Control` (`2121:1039`). One VARIANT axis: `size`
// (`default` | `sm`). The track is `Base/muted` with `Radius/radius-full`,
// `2px` inset padding, and `Gap/gap-1` between items. Height follows the
// nested item rung: `Size/size-10` (40) + pad → 44 at `default`,
// `Size/size-8` (32) + pad → 36 at `sm`.
//
// The active surface is a single sliding pill behind the items (tabs-sliding):
// JS writes the pressed item's offsetLeft / offsetWidth; CSS owns the tween
// (250ms, cubic-bezier(0.22, 1, 0.36, 1)). First paint and resize snap with
// transition suspended.
const segmentedControlVariants = cva(
  "group/segmented-control relative inline-flex w-fit items-center justify-center gap-1 overflow-visible rounded-(--radius-full) bg-muted p-0.5",
  {
    variants: {
      size: {
        default: "h-11",
        sm: "h-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type SegmentedControlSize = NonNullable<
  VariantProps<typeof segmentedControlVariants>["size"]
>;

const SegmentedControlSizeContext = createContext<SegmentedControlSize | null>(
  null,
);

function useSegmentedControlSize(
  size?: SegmentedControlSize | null,
): SegmentedControlSize {
  const fromContext = useContext(SegmentedControlSizeContext);
  return size ?? fromContext ?? "default";
}

/**
 * Mutually exclusive pill options for view switchers and short choice sets.
 *
 * Figma (`2121:1039`) has no set description — this is the written stand-in.
 * The only axis is `size`; items live in the `controlItems` slot. Selection
 * is drawn by a sliding `Base/background` pill with the item set's drop
 * shadow — not a fill on each item.
 */
function SegmentedControl({
  className,
  size = "default",
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof segmentedControlVariants>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const didMountRef = useRef(false);
  const sizeRef = useRef(size);
  const fromRef = useRef({ x: 0, w: 0 });
  const animatingRef = useRef(false);

  const movePill = useCallback((animate: boolean) => {
    const root = rootRef.current;
    const pill = pillRef.current;
    if (!root || !pill) return;

    const active = root.querySelector<HTMLElement>(
      '[data-slot="segmented-control-item"][data-pressed]',
    );
    if (!active) {
      pill.style.opacity = "0";
      pill.style.width = "0px";
      return;
    }

    const nextX = active.offsetLeft;
    const nextW = active.offsetWidth;
    const fromX = fromRef.current.x;
    const fromW = fromRef.current.w;
    const samePlace = fromX === nextX && fromW === nextW;

    const paint = (x: number, w: number) => {
      pill.style.opacity = "1";
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${w}px`;
    };

    if (!animate || samePlace) {
      if (animatingRef.current) return;
      pill.style.transition = "none";
      paint(nextX, nextW);
      void pill.offsetWidth;
      pill.style.transition = "";
      fromRef.current = { x: nextX, w: nextW };
      return;
    }

    // Rewind to the last resting place, then let CSS slide. A same-frame
    // resize snap cannot cancel this: later non-animated calls no-op until
    // the tween finishes, and a second animated call sees the new origin.
    animatingRef.current = true;
    fromRef.current = { x: nextX, w: nextW };
    pill.style.transition = "none";
    paint(fromX, fromW);
    void pill.offsetWidth;
    pill.style.transition = "";
    paint(nextX, nextW);
    window.setTimeout(() => {
      animatingRef.current = false;
    }, 280);
  }, []);

  useLayoutEffect(() => {
    const sizeChanged = sizeRef.current !== size;
    sizeRef.current = size;
    if (!didMountRef.current || sizeChanged) {
      movePill(false);
    }
    didMountRef.current = true;
  }, [movePill, size]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // `data-pressed` flips after commit. Observing it — not React children —
    // keeps the observer alive so the record is not discarded on re-render.
    const mutation = new MutationObserver(() => movePill(true));
    mutation.observe(root, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-pressed"],
    });

    if (typeof ResizeObserver === "undefined") {
      return () => mutation.disconnect();
    }

    const resize = new ResizeObserver(() => movePill(false));
    resize.observe(root);
    for (const item of root.querySelectorAll<HTMLElement>(
      '[data-slot="segmented-control-item"]',
    )) {
      resize.observe(item);
    }

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [movePill]);

  return (
    <SegmentedControlSizeContext.Provider value={size ?? "default"}>
      {/* Room for the pill drop shadow — scroll-fade parents still need overflow visible. */}
      <div
        className="w-fit max-w-full overflow-visible px-2 py-2.5 -mx-2 -my-2.5"
        data-slot="segmented-control-bleed"
      >
        <ToggleGroupPrimitive
          ref={rootRef}
          data-slot="segmented-control"
          data-size={size}
          className={cn(segmentedControlVariants({ size }), className)}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next, eventDetails) => {
            onValueChange?.(next, eventDetails);
          }}
          {...props}
        >
          <span
            ref={pillRef}
            aria-hidden
            data-slot="segmented-control-pill"
            className={cn(
              "pointer-events-none absolute top-0.5 left-0 z-0 w-0 rounded-(--radius-full) bg-background opacity-0 shadow-[0_8px_16px_var(--shadow-color,rgb(117_114_111_/_20%))] transition-[transform,width] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,width] motion-reduce:transition-none!",
              size === "sm" ? "h-8" : "h-10",
            )}
          />
          {children}
        </ToggleGroupPrimitive>
      </div>
    </SegmentedControlSizeContext.Provider>
  );
}

export type { SegmentedControlSize };
export { SegmentedControl, segmentedControlVariants, useSegmentedControlSize };
