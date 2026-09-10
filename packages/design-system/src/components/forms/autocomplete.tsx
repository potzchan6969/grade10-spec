"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { inputBoxVariants } from "@grade10/design-system/components/forms/input";
import { dropdownMenuItemVariants } from "@grade10/design-system/components/overlays/dropdown-menu-item";
import { cn } from "@grade10/design-system/lib/utils";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";

/**
 * Autocomplete: a Search Input with a Dropdown Menu of suggestions beneath
 * it. Figma composition `Autocomplete` (`6554:6126`) — Search Input plus
 * Dropdown Menu with optional group labels (`6554:5962`) and an empty state.
 *
 * Built on Base UI Autocomplete; the popup reuses the Dropdown Menu surface
 * (radius, border, shadow, pill item hover) and the same `sideOffset` (4) as
 * `DropdownMenuContent`. The field box is an `InputGroup` so the popup
 * anchors to the full Search Input pill — at least as wide as the field.
 *
 * Filtering can be left to the component (`mode="list"`, default) or owned
 * by the consumer (`mode="none"`).
 *
 * Not a Figma component set of its own — Code Connect maps Search Input and
 * Dropdown Menu Item / Group Label separately.
 */
function Autocomplete(props: AutocompletePrimitive.Root.Props<any>) {
  // Root is overloaded for flat vs grouped `items`; forward both shapes.
  return (
    <AutocompletePrimitive.Root
      data-slot="autocomplete"
      {...(props as any)}
    />
  );
}

type AutocompleteInputProps = AutocompletePrimitive.Input.Props & {
  /** Rendered above the field. */
  label?: ReactNode;
  /** Accessible name when no visible label is shown. */
  "aria-label"?: string;
  /**
   * Extra work when the trailing X clears the field. Base UI already clears
   * the autocomplete value; this runs after that click.
   */
  onClear?: () => void;
  className?: string;
};

/**
 * Search Input chrome. The pill is Base UI `InputGroup` so the popup
 * positions against the full field (same as a Dropdown Menu trigger), not
 * the bare `<input>` inside the padding.
 */
function AutocompleteInput({
  className,
  id,
  label,
  disabled,
  onClear,
  ...props
}: AutocompleteInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const clearIcon = (
    <span className="text-secondary-foreground">
      <X aria-hidden size={16} weight="bold" />
    </span>
  );

  return (
    <div
      className={cn(
        "group/input-shell flex w-full flex-col gap-2",
        disabled && "opacity-50",
        className,
      )}
      data-disabled={disabled || undefined}
      data-slot="autocomplete-input-shell"
    >
      {label ? (
        <label
          className="text-sm font-medium text-secondary-foreground"
          data-slot="input-label"
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <AutocompletePrimitive.InputGroup
        className={cn(
          inputBoxVariants({ status: "default" }),
          disabled && "bg-background-subtle",
        )}
        data-slot="input-box"
      >
        <span className="shrink-0 text-secondary-foreground">
          <MagnifyingGlass aria-hidden size={16} weight="bold" />
        </span>
        <AutocompletePrimitive.Input
          data-slot="autocomplete-input"
          disabled={disabled}
          id={inputId}
          type="search"
          className={cn(
            "w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:text-foreground [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          )}
          {...props}
        />
        {onClear && !disabled ? (
          <AutocompletePrimitive.Clear
            aria-label="Clear search"
            className="flex shrink-0 cursor-pointer items-center text-secondary-foreground transition-colors hover:text-foreground data-[ending-style]:hidden data-[starting-style]:hidden data-empty:hidden"
            data-slot="input-clear"
            onClick={onClear}
          >
            {clearIcon}
          </AutocompletePrimitive.Clear>
        ) : null}
      </AutocompletePrimitive.InputGroup>
    </div>
  );
}

function AutocompleteContent({
  className,
  side = "bottom",
  // Same default as DropdownMenuContent — Figma Autocomplete gap is 4px.
  sideOffset = 4,
  align = "start",
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<
    AutocompletePrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset"
  >) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            // Same surface as DropdownMenuContent. `min-w-(--anchor-width)`
            // keeps the menu at least as wide as the Search Input pill;
            // `w-max` lets long labels grow past it.
            "z-50 flex max-h-(--available-height) w-max min-w-(--anchor-width) origin-(--transform-origin) flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-popover p-2 text-popover-foreground shadow-[0_4px_24px_var(--shadow-color,rgb(118_118_118_/_20%))] backdrop-blur-xl duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn("flex w-full flex-col gap-1 outline-none", className)}
      {...props}
    />
  );
}

function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * Figma `Dropdown Menu Group Label` (`6554:5962`) — secondary label above a
 * group of items inside the autocomplete popup.
 */
function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "px-3 pt-2 pb-1 text-sm font-normal text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteCollection(
  props: ComponentProps<typeof AutocompletePrimitive.Collection>,
) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

function AutocompleteItem({
  className,
  size = "sm",
  leading,
  trailing,
  children,
  ...props
}: AutocompletePrimitive.Item.Props &
  VariantProps<typeof dropdownMenuItemVariants> & {
    leading?: ReactNode;
    trailing?: ReactNode;
  }) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(dropdownMenuItemVariants({ size }), className)}
      {...props}
    >
      {leading}
      <span className="min-w-0 flex-1 whitespace-nowrap font-normal">
        {children}
      </span>
      {trailing ? (
        <span
          data-slot="autocomplete-item-trailing"
          className={cn(
            "flex shrink-0 items-center justify-end gap-1 font-normal text-secondary-foreground [&_svg]:text-secondary-foreground",
            size === "md" ? "text-base" : "text-sm",
          )}
        >
          {trailing}
        </span>
      ) : null}
    </AutocompletePrimitive.Item>
  );
}

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "px-3 py-2 text-sm text-secondary-foreground empty:m-0 empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
};
export type { AutocompleteInputProps };
