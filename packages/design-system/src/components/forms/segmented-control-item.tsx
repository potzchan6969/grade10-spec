"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import {
  type SegmentedControlSize,
  useSegmentedControlSize,
} from "@grade10/design-system/components/forms/segmented-control";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

// Figma set `Segmented Control Item` (`2121:898`). Axes: `state` (active /
// default / hover), `size` (default / sm), `isDisabled` (false / true). Hover
// is CSS only; active is the pressed toggle. Disabled is drawn only at
// `state=default` and is `Opacity/opacity-50` over the resting colours.
//
// The active white fill and drop shadow live on the parent's sliding pill —
// this item only swaps label colour to `Base/foreground` when pressed.
// Resting and hover label in `Base/secondary-foreground`; hover fills
// `Base/background-subtle`. Geometry: `Radius/radius-full`, `Gap/gap-4`
// horizontal padding, icon gap `Gap/gap-2` at `default` / `Gap/gap-1` at `sm`.
// Type is `text-base/medium` or `text-sm/medium`; leading icon is
// `Size/size-4` / `Size/size-3-5`.
const segmentedControlItemVariants = cva(
  "relative z-[1] inline-flex shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) bg-transparent px-4 font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-subtle focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-pressed:text-foreground data-pressed:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "h-10 gap-2 text-base [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 gap-1 text-sm [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type SegmentedControlItemProps = TogglePrimitive.Props &
  VariantProps<typeof segmentedControlItemVariants> & {
    /** Icon before the label — Figma's `leading` BOOLEAN + `leadingIcon` swap. */
    leading?: ReactNode;
  };

/**
 * One option inside a `SegmentedControl`.
 *
 * Figma (`2121:898`) has no set description — this is the written stand-in.
 * `state=hover` is a CSS pseudo-state; `state=active` is the pressed toggle
 * (label only — the white pill slides on the parent). `isDisabled` dims the
 * resting item at `Opacity/opacity-50`. Size matches the parent track when
 * omitted.
 */
function SegmentedControlItem({
  className,
  size: sizeProp,
  leading,
  children,
  ...props
}: SegmentedControlItemProps) {
  const size = useSegmentedControlSize(
    sizeProp as SegmentedControlSize | undefined,
  );

  return (
    <TogglePrimitive
      data-slot="segmented-control-item"
      className={cn(segmentedControlItemVariants({ size }), className)}
      {...props}
    >
      {leading}
      {children}
    </TogglePrimitive>
  );
}

export type { SegmentedControlItemProps };
export { SegmentedControlItem, segmentedControlItemVariants };
