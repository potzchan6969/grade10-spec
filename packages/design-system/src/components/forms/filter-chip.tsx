import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

/**
 * Figma set `Filter Chip` (`4313:28`). Size is the only cva axis; `isSelected`
 * and `isDisabled` are boolean gates, and `state` is hover/focus CSS.
 *
 * Selected inverts to `foreground` fill / `background` text. Hover on the
 * selected fill is a 10% black mix, matching Button's selected-adjacent
 * treatment rather than a second cva option.
 *
 * Both sizes use Figma's 4px item spacing (`gap-1`). `trailing` mirrors the
 * BOOLEAN + INSTANCE_SWAP pair; omit it and only the label renders.
 */
const filterChipVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[selected]:border-transparent data-[selected]:bg-foreground data-[selected]:text-background data-[selected]:hover:bg-[color-mix(in_oklab,var(--foreground),black_10%)] data-[selected]:focus-visible:border-ring",
  {
    variants: {
      size: {
        md: "h-10 gap-1 rounded-(--radius-md) px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1 rounded-(--radius-sm) px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type FilterChipProps = ButtonPrimitive.Props &
  VariantProps<typeof filterChipVariants> & {
    /** Figma's `isSelected` gate. Hover and focus are CSS pseudo-states. */
    selected?: boolean;
    /** Icon rendered after `children`. Figma's `trailing` / `trailingContent`. */
    trailing?: ReactNode;
  };

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

export type { FilterChipProps };
export { FilterChip, filterChipVariants };
