"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const dropdownMenuItemVariants = cva(
  "group/dropdown-menu-item relative flex cursor-default items-center gap-2 px-3 py-2 font-medium text-accent-foreground outline-hidden select-none hover:bg-accent focus:bg-accent data-selected:bg-muted data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive",
  {
    variants: {
      size: {
        sm: "h-9 rounded-(--radius-sm) text-sm [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 rounded-(--radius-md) text-base [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

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
    >
      {leading}
      <span className="min-w-0 flex-1 whitespace-nowrap">{children}</span>
      {trailing ? (
        <span
          data-slot="dropdown-menu-item-trailing"
          className={cn(
            "flex shrink-0 items-center justify-end gap-1 font-normal text-secondary-foreground group-data-disabled/dropdown-menu-item:text-disabled-foreground [&_svg]:text-secondary-foreground group-data-disabled/dropdown-menu-item:[&_svg]:text-disabled-foreground",
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
