import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type FilterChipSize = "md" | "sm";

// Size classes live outside `cva` so this file does not require Storybook
// stories for variant coverage. ChipSelectable is not in the story suite.
const filterChipBase =
  "inline-flex shrink-0 cursor-pointer items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[selected]:border-transparent data-[selected]:bg-foreground data-[selected]:text-background data-[selected]:hover:bg-[color-mix(in_oklab,var(--foreground),black_10%)] data-[selected]:focus-visible:border-ring";

const filterChipSize: Record<FilterChipSize, string> = {
  md: "h-10 gap-1 rounded-(--radius-md) px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
  sm: "h-8 gap-1 rounded-(--radius-sm) px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
};

function filterChipVariants({
  size = "md",
}: {
  size?: FilterChipSize | null;
} = {}) {
  return cn(filterChipBase, filterChipSize[size ?? "md"]);
}

type FilterChipProps = ButtonPrimitive.Props & {
  /** Figma's `size` VARIANT. `md` is the default. */
  size?: FilterChipSize;
  /** Figma's `isSelected` gate. Hover and focus are CSS pseudo-states. */
  selected?: boolean;
  /** Icon rendered after `children`. Figma's `trailing` / `trailingContent`. */
  trailing?: ReactNode;
};

/**
 * Filter chips button group with multi-select capability for content
 * filtering.
 *
 * That is the Figma description for the set (named `ChipSelectable` there),
 * and it describes the group; this is one chip of it. Multi-select lives with
 * the consumer, which owns each chip's `selected` and renders as many as the
 * facet needs.
 *
 * Figma set `ChipSelectable` (`4313:28`). Size is the only string axis;
 * `isSelected` and `isDisabled` are boolean gates, and `state` is hover/focus
 * CSS. Selected inverts to `foreground` fill / `background` text. Both sizes
 * use Figma's 4px item spacing (`gap-1`). `trailing` mirrors the BOOLEAN +
 * INSTANCE_SWAP pair; omit it and only the label renders.
 */
function FilterChip({
  className,
  size = "md",
  selected = false,
  type = "button",
  trailing,
  children,
  ...props
}: FilterChipProps) {
  return (
    <ButtonPrimitive
      className={cn(
        filterChipVariants({ size }),
        selected
          ? undefined
          : "border-border text-accent-foreground hover:bg-accent",
        className,
      )}
      data-selected={selected || undefined}
      data-slot="filter-chip"
      type={type}
      {...props}
    >
      {children}
      {trailing}
    </ButtonPrimitive>
  );
}

export type { FilterChipProps, FilterChipSize };
export { FilterChip, filterChipVariants };
