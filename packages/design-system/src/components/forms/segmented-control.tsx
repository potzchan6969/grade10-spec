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
  "group/segmented-control relative inline-flex w-fit items-center justify-center gap-1 rounded-(--radius-full) bg-muted p-0.5",
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

    const apply = () => {
      pill.style.opacity = "1";
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
      pill.style.width = `${active.offsetWidth}px`;
    };

    if (!animate) {
      const previous = pill.style.transition;
      pill.style.transition = "none";
      apply();
      void pill.offsetWidth;
      pill.style.transition = previous;
      return;
    }

    apply();
  }, []);

  const selectionKey = value?.join("\0") ?? null;

  useLayoutEffect(() => {
    const sizeChanged = sizeRef.current !== size;
    sizeRef.current = size;
    // `selectionKey` is the controlled selection; uncontrolled updates call
    // `movePill` from `onValueChange` instead.
    void selectionKey;
    movePill(didMountRef.current && !sizeChanged);
    didMountRef.current = true;
  }, [movePill, selectionKey, size]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    // `children` rebinds the observer when the item list is replaced.
    void children;

    const observer = new ResizeObserver(() => movePill(false));
    observer.observe(root);
    for (const item of root.querySelectorAll<HTMLElement>(
      '[data-slot="segmented-control-item"]',
    )) {
      observer.observe(item);
    }
    return () => observer.disconnect();
  }, [movePill, children]);

  return (
    <SegmentedControlSizeContext.Provider value={size ?? "default"}>
      <ToggleGroupPrimitive
        ref={rootRef}
        data-slot="segmented-control"
        data-size={size}
        className={cn(segmentedControlVariants({ size }), className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next, eventDetails) => {
          onValueChange?.(next, eventDetails);
          requestAnimationFrame(() => movePill(true));
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
    </SegmentedControlSizeContext.Provider>
  );
}

export type { SegmentedControlSize };
export { SegmentedControl, segmentedControlVariants, useSegmentedControlSize };
