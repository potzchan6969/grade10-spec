"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * A set of layered panels where only the selected one is shown at a time.
 *
 * `Tabs` lets a single region host several panels and shows one at a time.
 * Each `TabsTrigger` is matched to a `TabsContent` by its `value`; selecting
 * a trigger reveals its panel and slides the active indicator across the
 * list. Drive it uncontrolled with `defaultValue`, or controlled with
 * `value` + `onValueChange`.
 *
 * Reach for `Tabs` to switch between alternate views of the same area. For
 * navigating between pages or routes, use `Navigation` or a `Breadcrumb`
 * instead — tabs are for in-place content, not page navigation.
 *
 * Figma set `Tab` (`2121:1139`) owns the trigger axes (`variant`, `selected`,
 * `state`, `isDisabled`, `size`); set `Tab List` (`6586:6340`) owns the list
 * `variant` (`pill` | `list`) and `size` (`md` | `sm`). The root owns the
 * selected value and renders a `<div>`. Tabs are horizontal only — Figma does
 * not draw a vertical list.
 */
function Tabs({
  className,
  ...props
}: Omit<TabsPrimitive.Root.Props, "orientation">) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      orientation="horizontal"
      className={cn("group/tabs flex flex-col gap-2", className)}
      {...props}
    />
  );
}

// Figma set `Tab List` (`6586:6340`). VARIANT axes: `variant` (`pill` |
// `list`) and `size` (`md` | `sm`).
//
// `pill` — `Base/muted` track, `Radius/radius-full`, `2px` inset padding,
// `2px` gap between triggers. Active surface is a sliding `Base/background`
// pill with the shared drop shadow (tabs-sliding), not a fill on each
// trigger. Height is `Size/size-10` (40) + pad → 44 at `md`, `Size/size-8`
// (32) + pad → 36 at `sm`.
//
// `list` — no track; `Gap/gap-6` between triggers and `Gap/gap-2` horizontal
// padding. Active state is a sliding `Base/foreground` underline (2px), not a
// border on each trigger. Height matches the trigger rung (`size-10` / `size-8`).
const tabsListVariants = cva(
  "group/tabs-list relative inline-flex items-center justify-center text-foreground",
  {
    variants: {
      variant: {
        pill: "gap-0.5 rounded-(--radius-full) bg-muted p-0.5",
        list: "gap-6 rounded-none bg-transparent px-2",
      },
      size: {
        md: "",
        sm: "",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "md", class: "h-11" },
      { variant: "pill", size: "sm", class: "h-9" },
      { variant: "list", size: "md", class: "h-10" },
      { variant: "list", size: "sm", class: "h-8" },
    ],
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  },
);

type TabsListProps = TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants> & {
    /**
     * Flush the list to the full width of its parent and share that width
     * evenly across triggers. Off by default — the list hugs its tab labels.
     * Code-owned layout; Figma only draws the hug list.
     */
    fullWidth?: boolean;
  };

/**
 * The row of triggers, with the sliding active indicator built in. Renders a
 * `<div role="tablist">`.
 *
 * The list is a single tab stop:
 * 1. Tab moves focus into the active trigger
 * 2. Arrow keys move focus between triggers (left/right), wrapping unless
 *    `loopFocus` is `false`.
 * 3. By default a tab activates on Enter or Space; set `activateOnFocus` to
 *    switch panels as focus moves instead.
 *
 * Figma (`6586:6340`): `pill` is a filled track with a sliding white pill
 * behind the active tab; `list` drops the track for a minimal underline that
 * slides under the active tab. Pick `list` for dense layouts or when the
 * tabs sit directly above their content. `size` is `md` (default — 40px
 * triggers in a 44px track) or `sm` (32px triggers in a 36px track, `text-xs`).
 * The indicator and panel transitions honor `prefers-reduced-motion`.
 *
 * Width is code-owned (Figma draws the hug list only): omit `fullWidth` to
 * size the list to its tabs, or set `fullWidth` to flush the list and share
 * the width evenly across triggers.
 */
function TabsList({
  className,
  variant = "pill",
  size = "md",
  fullWidth = false,
  children,
  ...props
}: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const didMountRef = useRef(false);
  const variantRef = useRef(variant);
  const sizeRef = useRef(size);
  const fullWidthRef = useRef(fullWidth);
  const fromRef = useRef({ x: 0, w: 0, h: 0 });
  const animatingRef = useRef(false);

  const moveIndicator = useCallback((animate: boolean) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const active = list.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-active]',
    );
    if (!active) {
      indicator.style.opacity = "0";
      indicator.style.width = "0px";
      indicator.style.height = "0px";
      return;
    }

    const isPill = list.dataset.variant === "pill";
    const nextX = active.offsetLeft;
    const nextW = active.offsetWidth;
    // `list`: 2px underline under the active trigger.
    const nextH = isPill ? active.offsetHeight : 2;
    const fromX = fromRef.current.x;
    const fromW = fromRef.current.w;
    const fromH = fromRef.current.h;
    const samePlace = fromX === nextX && fromW === nextW && fromH === nextH;

    const paint = (x: number, w: number, h: number) => {
      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.width = `${w}px`;
      indicator.style.height = `${h}px`;
    };

    if (!animate || samePlace) {
      // A same-frame ResizeObserver snap must not cancel an in-flight slide
      // (controlled tabs re-render and reconnect observers on every change).
      if (animatingRef.current) return;
      indicator.style.transition = "none";
      paint(nextX, nextW, nextH);
      void indicator.offsetWidth;
      indicator.style.transition = "";
      fromRef.current = { x: nextX, w: nextW, h: nextH };
      return;
    }

    // Rewind to the last resting place, then let CSS slide.
    animatingRef.current = true;
    fromRef.current = { x: nextX, w: nextW, h: nextH };
    indicator.style.transition = "none";
    paint(fromX, fromW, fromH);
    void indicator.offsetWidth;
    indicator.style.transition = "";
    paint(nextX, nextW, nextH);
    window.setTimeout(() => {
      animatingRef.current = false;
    }, 280);
  }, []);

  useLayoutEffect(() => {
    const layoutChanged =
      variantRef.current !== variant ||
      sizeRef.current !== size ||
      fullWidthRef.current !== fullWidth;
    variantRef.current = variant;
    sizeRef.current = size;
    fullWidthRef.current = fullWidth;
    // `children` rebinds when the trigger list is replaced.
    void children;
    if (!didMountRef.current || layoutChanged) {
      moveIndicator(false);
    }
    didMountRef.current = true;
  }, [moveIndicator, variant, size, fullWidth, children]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Observe `data-active` — not React children — so a controlled parent
    // re-render does not discard the record and snap the indicator.
    const mutation = new MutationObserver(() => moveIndicator(true));
    mutation.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-active", "aria-selected"],
    });

    if (typeof ResizeObserver === "undefined") {
      return () => mutation.disconnect();
    }

    const resize = new ResizeObserver(() => moveIndicator(false));
    resize.observe(list);
    for (const trigger of list.querySelectorAll<HTMLElement>(
      '[data-slot="tabs-trigger"]',
    )) {
      resize.observe(trigger);
    }

    return () => {
      mutation.disconnect();
      resize.disconnect();
    };
  }, [moveIndicator]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? "" : undefined}
      className={cn(
        tabsListVariants({ variant, size }),
        fullWidth ? "w-full" : "w-fit",
        className,
      )}
      {...props}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        data-slot="tabs-list-indicator"
        className={cn(
          "pointer-events-none absolute z-0 opacity-0 transition-[transform,width,height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,width,height] motion-reduce:transition-none!",
          variant === "pill" &&
            "top-0.5 left-0 rounded-(--radius-full) bg-background shadow-[0_8px_16px_var(--shadow-color,rgb(117_114_111_/_20%))]",
          variant === "list" && "bottom-0 left-0 bg-foreground",
        )}
      />
      {children}
    </TabsPrimitive.List>
  );
}

/**
 * One trigger in a `TabsList`. Matched to a `TabsContent` by `value`.
 *
 * Figma set `Tab` (`2121:1139`): axes `variant` (`pill` | `line`),
 * `selected`, `state` (`default` | `hover`), `isDisabled`, `size`
 * (`md` | `sm`). Selection is owned by `Tabs`; hover is CSS only. Disabled
 * triggers are removed from the tab order and skipped by arrow navigation
 * (`Opacity/opacity-50`). Geometry follows the list's `size`: `md` is
 * `Size/size-10` tall with `text-sm/medium` and `Gap/gap-4` horizontal
 * padding; `sm` is `Size/size-8` tall with `text-xs/medium` and `Gap/gap-3`
 * horizontal padding. The list's `variant` draws the active surface.
 */
function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-[1] inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--radius-full) border border-transparent px-4 text-sm font-medium whitespace-nowrap text-foreground transition-[background-color,color,opacity] duration-150 ease-out group-data-full-width/tabs-list:min-w-0 group-data-full-width/tabs-list:flex-1 group-data-[size=sm]/tabs-list:h-8 group-data-[size=sm]/tabs-list:gap-1 group-data-[size=sm]/tabs-list:px-3 group-data-[size=sm]/tabs-list:text-xs hover:bg-background-subtle focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[size=sm]/tabs-list:[&_svg:not([class*='size-'])]:size-3",
        // `list` (Figma line): no track fill; the list owns the sliding underline.
        "group-data-[variant=list]/tabs-list:rounded-none group-data-[variant=list]/tabs-list:px-0 group-data-[variant=list]/tabs-list:hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-sm outline-none motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export type { TabsListProps };
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
