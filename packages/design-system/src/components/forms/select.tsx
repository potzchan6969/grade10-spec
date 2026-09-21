"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { dropdownMenuItemVariants } from "@grade10/design-system/components/overlays/dropdown-menu-item";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type * as React from "react";
import { useLayoutEffect, useRef } from "react";

const selectTriggerVariants = cva(
  "flex w-full min-w-0 items-center justify-between gap-2 rounded-(--radius-full) border border-border bg-input px-4 text-sm whitespace-nowrap outline-none select-none transition-[color,box-shadow,border-color,background-color,opacity] hover:border-border-strong focus-visible:border-border-strong focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:bg-background-subtle disabled:opacity-50 data-placeholder:text-muted-foreground aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon render={<CaretDown aria-hidden size={16} />} />
    </SelectPrimitive.Trigger>
  );
}

/**
 * Scroll `element` into its nearest overflow scrollport (the select popup).
 * Base UI skips this after a pointer open; typeahead can land off-screen.
 */
function scrollElementIntoScrollport(element: HTMLElement) {
  let ancestor: HTMLElement | null = element.parentElement;
  while (ancestor) {
    const style = getComputedStyle(ancestor);
    const overflowY = style.overflowY;
    const canScroll = ancestor.scrollHeight > ancestor.clientHeight + 1;
    const isScrollport =
      canScroll &&
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay");
    if (isScrollport) {
      const itemRect = element.getBoundingClientRect();
      const portRect = ancestor.getBoundingClientRect();
      if (itemRect.top < portRect.top) {
        ancestor.scrollTop -= portRect.top - itemRect.top;
      } else if (itemRect.bottom > portRect.bottom) {
        ancestor.scrollTop += itemRect.bottom - portRect.bottom;
      }
      return;
    }
    ancestor = ancestor.parentElement;
  }

  // Fallback when overflow styles are unresolved (e.g. some test hosts).
  element.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-[100]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            // Match DropdownMenuContent chrome so Select rows read like menu items.
            // Cap height even when --available-height is unset so long lists scroll.
            "relative isolate z-[100] flex max-h-[min(24rem,var(--available-height,24rem))] w-(--anchor-width) min-w-36 origin-(--transform-origin) flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-popover p-2 text-popover-foreground shadow-[0_4px_24px_var(--shadow-color,rgb(118_118_118_/_20%))] backdrop-blur-xl duration-100 outline-none data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  const itemRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = itemRef.current;
    if (!node) return;

    const scrollIfHighlighted = () => {
      if (node.hasAttribute("data-highlighted")) {
        scrollElementIntoScrollport(node);
      }
    };

    scrollIfHighlighted();

    const observer = new MutationObserver(scrollIfHighlighted);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["data-highlighted"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Same rung as DropdownMenuItem / AutocompleteItem — hover +
        // `data-highlighted` (keyboard / typeahead), not `focus:bg-accent`.
        dropdownMenuItemVariants({ size: "sm" }),
        "w-full pr-8",
        className,
      )}
      {...props}
      ref={itemRef}
    >
      <SelectPrimitive.ItemText className="min-w-0 flex-1 whitespace-nowrap font-normal">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center text-secondary-foreground" />
        }
      >
        <CheckIcon className="pointer-events-none size-3.5" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
};
