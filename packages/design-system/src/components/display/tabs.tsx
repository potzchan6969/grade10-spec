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
 * `state`, `isDisabled`); set `Tab List` (`6586:6340`) owns the list
 * `variant` (`pill` | `list`). The root owns the selected value and renders
 * a `<div>`. Tabs are horizontal only — Figma does not draw a vertical list.
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

// Figma set `Tab List` (`6586:6340`). One VARIANT axis: `variant`
// (`pill` | `list`).
//
// `pill` — `Base/muted` track, `Radius/radius-full`, `2px` inset padding,
// `2px` gap between triggers. Active surface is a sliding `Base/background`
// pill with the shared drop shadow (tabs-sliding), not a fill on each
// trigger. Height is `Size/size-10` (40) + pad → 44.
//
// `list` — no track; `Gap/gap-6` between triggers and `Gap/gap-2` horizontal
// padding. Active state is a sliding `Base/foreground` underline (2px), not a
// border on each trigger.
const tabsListVariants = cva(
  "group/tabs-list relative inline-flex items-center justify-center text-foreground",
  {
    variants: {
      variant: {
        pill: "h-11 gap-0.5 rounded-(--radius-full) bg-muted p-0.5",
        list: "h-10 gap-6 rounded-none bg-transparent px-2",
      },
    },
    defaultVariants: {
      variant: "pill",
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
 * tabs sit directly above their content. The indicator and panel transitions
 * honor `prefers-reduced-motion`.
 *
 * Width is code-owned (Figma draws the hug list only): omit `fullWidth` to
 * size the list to its tabs, or set `fullWidth` to flush the list and share
 * the width evenly across triggers.
 */
function TabsList({
  className,
  variant = "pill",
  fullWidth = false,
  children,
  ...props
}: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const didMountRef = useRef(false);
  const variantRef = useRef(variant);
  const fullWidthRef = useRef(fullWidth);

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

    const apply = () => {
      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      if (isPill) {
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.height = `${active.offsetHeight}px`;
        return;
      }

      // `list`: 2px underline under the active trigger.
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = "2px";
    };

    if (!animate) {
      const previous = indicator.style.transition;
      indicator.style.transition = "none";
      apply();
      void indicator.offsetWidth;
      indicator.style.transition = previous;
      return;
    }

    apply();
  }, []);

  useLayoutEffect(() => {
    const layoutChanged =
      variantRef.current !== variant || fullWidthRef.current !== fullWidth;
    variantRef.current = variant;
    fullWidthRef.current = fullWidth;
    // `children` rebinds when the trigger list is replaced.
    void children;
    moveIndicator(didMountRef.current && !layoutChanged);
    didMountRef.current = true;
  }, [moveIndicator, variant, fullWidth, children]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // `children` rebinds the observers when the trigger list is replaced.
    void children;

    const onChange = () => moveIndicator(true);
    const mutation = new MutationObserver(onChange);
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
  }, [moveIndicator, children]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}
      data-full-width={fullWidth ? "" : undefined}
      className={cn(
        tabsListVariants({ variant }),
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
 * `selected`, `state` (`default` | `hover`), `isDisabled`. Selection is
 * owned by `Tabs`; hover is CSS only. Disabled triggers are removed from
 * the tab order and skipped by arrow navigation (`Opacity/opacity-50`).
 * Geometry is `Size/size-10` tall with `text-sm/medium` and `Gap/gap-4`
 * horizontal padding; the list's `variant` draws the active surface.
 */
function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-[1] inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--radius-full) border border-transparent px-4 text-sm font-medium whitespace-nowrap text-foreground transition-[background-color,color,opacity] duration-150 ease-out group-data-full-width/tabs-list:min-w-0 group-data-full-width/tabs-list:flex-1 hover:bg-background-subtle focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
