"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

// Label is `Base/popover-foreground` on every rung — not `accent-foreground`,
// which is the orange brand fill in Grade10. Selected (`isSelected`) has no
// fill; the trailing check is the indicator. Hover and keyboard highlight
// paint `Base/muted` (node `2121:1414`). Disabled is `Opacity/opacity-50` over
// the item's own colours (node `2121:1400`), not a grey swap.
const dropdownMenuItemVariants = cva(
  "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-full px-3 py-2 font-medium text-popover-foreground outline-hidden select-none hover:bg-muted data-highlighted:bg-muted data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive",
  {
    variants: {
      size: {
        sm: "h-9 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 text-base [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

/**
 * An individual interactive item within a dropdown menu.
 *
 * Figma `Dropdown Menu Item` (`2121:1385`). Label is `Base/popover-foreground`
 * on every rung — not `accent-foreground`, which is the orange brand fill in
 * Grade10. Selected (`isSelected`) has no fill; the trailing check is the
 * indicator. Hover and keyboard highlight paint `Base/muted`. Disabled is
 * `Opacity/opacity-50` over the item's own colours, not a grey swap.
 *
 * Size `sm` (36px, `text-sm`, 14px icon) is default; size `md` (40px,
 * `text-base`, 16px icon) supports larger menu listings. Trailing content
 * binds `Base/secondary-foreground` at regular weight.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  selected = false,
  size = "sm",
  leading,
  trailing,
  children,
  ...props
}: MenuPrimitive.Item.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
    variant?: "default" | "destructive";
    /** Figma's `isSelected` gate. Hover is a CSS pseudo-state, not a prop. */
    selected?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
  }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-selected={selected || undefined}
      className={cn(dropdownMenuItemVariants({ size }), className)}
      {...props}
      aria-current={selected ? "true" : undefined}
    >
      {leading}
      <span className="min-w-0 flex-1 whitespace-nowrap">{children}</span>
      {trailing ? (
        <span
          data-slot="dropdown-menu-item-trailing"
          className={cn(
            "flex shrink-0 items-center justify-end gap-1 font-normal text-secondary-foreground [&_svg]:text-secondary-foreground",
            size === "md" ? "text-base" : "text-sm",
          )}
        >
          {trailing}
        </span>
      ) : null}
    </MenuPrimitive.Item>
  );
}

export { DropdownMenuItem, dropdownMenuItemVariants };
