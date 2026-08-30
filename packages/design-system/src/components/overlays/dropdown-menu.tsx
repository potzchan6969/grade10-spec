"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@grade10/design-system/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import {
  DropdownMenuItem,
  dropdownMenuItemVariants,
} from "./dropdown-menu-item";

/**
 * The dropdown menu triggered from a button (or any element).
 *
 * Position the popup on the top, right, bottom, and align on the menu trigger.
 * Base UI's Positioner avoids showing the menu out of the viewport.
 *
 * Enter / Space / ↓ to open the menu; ↑ / ↓ move the highlight; → opens a submenu,
 * ← closes it; Enter selects; typing jumps to the matching item (typeahead).
 * Disabled items are skipped by keyboard navigation and typeahead.
 *
 * Regular action items and single-select radio items close on click; toggle and
 * multi-select items stay open and close only on explicit dismiss. Escape closes the innermost submenu first,
 * then root; clicking outside dismisses. Page scroll does not dismiss the menu.
 *
 * If the menu trigger is a button, rotate the chevron icon inside when
 * showing/hiding the menu — the trigger is the consumer's element, so that
 * rotation belongs to whatever is passed to `DropdownMenuTrigger`.
 */
function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  // Figma Dropdown Menu: if the trigger is a button, rotate the chevron
  // when the menu opens and closes.
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        "[&_svg]:transition-transform [&_svg]:duration-150 [&_svg]:ease-out motion-reduce:[&_svg]:transition-none [&[data-popup-open]_svg]:rotate-180",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  sticky,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "collisionPadding"
    | "side"
    | "sideOffset"
    | "sticky"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-popover p-2 text-popover-foreground shadow-[0_4px_24px_var(--shadow-color,rgb(118_118_118_/_20%))] backdrop-blur-xl duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ className, ...props }: MenuPrimitive.Group.Props) {
  return (
    <MenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  size = "sm",
  ...props
}: MenuPrimitive.SubmenuTrigger.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
  }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        dropdownMenuItemVariants({ size }),
        "data-popup-open:bg-muted-hover data-open:bg-muted-hover",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 whitespace-nowrap">{children}</span>
      <ChevronRightIcon className="ml-auto text-secondary-foreground" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("w-auto min-w-32", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  size = "sm",
  ...props
}: MenuPrimitive.CheckboxItem.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
  }) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(dropdownMenuItemVariants({ size }), className)}
      checked={checked}
      {...props}
    >
      <span className="min-w-0 flex-1 whitespace-nowrap">{children}</span>
      <span
        className="pointer-events-none flex shrink-0 items-center justify-end text-secondary-foreground"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className={size === "md" ? "size-4" : "size-3.5"} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  className,
  ...props
}: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  size = "sm",
  closeOnClick = true,
  ...props
}: MenuPrimitive.RadioItem.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
  }) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      closeOnClick={closeOnClick}
      className={cn(dropdownMenuItemVariants({ size }), className)}
      {...props}
    >
      <span className="min-w-0 flex-1 whitespace-nowrap">{children}</span>
      <span
        className="pointer-events-none flex shrink-0 items-center justify-end text-secondary-foreground"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className={size === "md" ? "size-4" : "size-3.5"} />
        </MenuPrimitive.RadioItemIndicator>
      </span>
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  dropdownMenuItemVariants,
};
