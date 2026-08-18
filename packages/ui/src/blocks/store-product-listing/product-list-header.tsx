import { Button } from "@grade10/design-system/components/forms/button";
import { FilterChip } from "@grade10/design-system/components/forms/filter-chip";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowDown, CaretDown, Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { FilterGroup, FilterSelection, SortOption } from "./types";

type ProductListHeaderProps = {
  /** Results heading. Figma's `title` text property. */
  title: ReactNode;
  /** Formatted result total, displayed as supplied. Never derived from the
   * number of products on the page. */
  resultCount: ReactNode;
  sortOptions?: readonly SortOption[];
  /** ID of the active sort option. */
  sortValue?: string;
  onSortChange?: (optionId: string) => void;
  /** Multi-select chip groups (Type). Hidden when a group's options are empty. */
  chipFilters?: readonly FilterGroup[];
  /** Exclusive dropdown groups (Series). Hidden when a group's options are empty. */
  selectFilters?: readonly FilterGroup[];
  selectFilterValues?: Readonly<Record<string, string>>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onSelectFilterChange?: (groupId: string, optionId: string) => void;
  className?: string;
};

function isSortSelected(option: SortOption, sortValue?: string) {
  return (
    sortValue === option.id ||
    (option.toggleId != null && sortValue === option.toggleId)
  );
}

function nextSortId(option: SortOption, sortValue?: string) {
  if (isSortSelected(option, sortValue)) {
    if (!option.toggleId) return undefined;
    return sortValue === option.id ? option.toggleId : option.id;
  }
  return option.id;
}

/**
 * Title, result count, sort chips, and optional type/series filters.
 * Figma set `Product / Product List Header` (`4288:14117`).
 *
 * Renderable on its own, so another results surface can reuse it without the
 * browse root. The header reports a change and displays what it is given; it
 * never holds the selection.
 */
function ProductListHeader({
  title,
  resultCount,
  sortOptions = [],
  sortValue,
  onSortChange,
  chipFilters = [],
  selectFilters = [],
  selectFilterValues = {},
  selection = {},
  onFilterChange,
  onSelectFilterChange,
  className,
}: ProductListHeaderProps) {
  const visibleChipFilters = chipFilters.filter(
    (group) => group.options.length > 0,
  );
  const visibleSelectFilters = selectFilters.filter(
    (group) => group.options.length > 0,
  );
  const showBar =
    sortOptions.length > 0 ||
    visibleChipFilters.length > 0 ||
    visibleSelectFilters.length > 0;

  return (
    <VStack
      className={cn("pt-4", className)}
      data-slot="product-list-header"
      gap="md"
    >
      <HStack className="w-full items-baseline gap-1.5" gap="none">
        <h2 className="font-bold text-4xl text-foreground">{title}</h2>
        <p
          className="font-medium text-base text-secondary-foreground"
          role="status"
        >
          {resultCount}
        </p>
      </HStack>
      {showBar ? (
        <HStack
          className="w-full"
          data-slot="product-list-header-filters"
          gap="md"
          vAlign="center"
          wrap
        >
          {sortOptions.length > 0 ? (
            <HStack
              data-slot="product-list-header-sort"
              gap="xs"
              vAlign="center"
            >
              {sortOptions.map((option) => {
                const selected = isSortSelected(option, sortValue);
                const reversed = sortValue === option.toggleId;
                const trailing =
                  option.trailing ??
                  (option.toggleId ? (
                    <ArrowDown aria-hidden size={14} />
                  ) : undefined);

                return (
                  <FilterChip
                    aria-pressed={selected}
                    key={option.id}
                    onClick={() => {
                      const next = nextSortId(option, sortValue);
                      if (next) onSortChange?.(next);
                    }}
                    selected={selected}
                    trailing={
                      trailing ? (
                        <span
                          className={cn(
                            "inline-flex transition-transform duration-200",
                            reversed && "rotate-180",
                          )}
                          data-reversed={reversed || undefined}
                          data-slot="sort-direction"
                        >
                          {trailing}
                        </span>
                      ) : undefined
                    }
                  >
                    {option.label}
                  </FilterChip>
                );
              })}
            </HStack>
          ) : null}
          {visibleChipFilters.map((group) => (
            <HStack
              aria-label={
                typeof group.label === "string" ? group.label : undefined
              }
              data-slot="product-list-header-chip-filter"
              gap="xs"
              key={group.id}
              role="group"
              vAlign="center"
            >
              {group.options.map((option) => {
                const selected = (selection[group.id] ?? []).includes(
                  option.id,
                );
                return (
                  <FilterChip
                    aria-pressed={selected}
                    disabled={option.disabled}
                    key={option.id}
                    onClick={() =>
                      onFilterChange?.(group.id, option.id, !selected)
                    }
                    selected={selected}
                  >
                    {option.label}
                  </FilterChip>
                );
              })}
            </HStack>
          ))}
          {visibleSelectFilters.map((group) => {
            const value = selectFilterValues[group.id];
            const selectedOption =
              group.options.find((option) => option.id === value) ??
              group.options[0];

            return (
              <DropdownMenu key={group.id}>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size="md"
                      trailing={<CaretDown aria-hidden size={14} />}
                      variant="outline"
                    />
                  }
                >
                  {selectedOption.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {group.options.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() =>
                        onSelectFilterChange?.(group.id, option.id)
                      }
                      selected={option.id === value}
                      trailing={
                        option.id === value ? (
                          <Check aria-hidden size={14} />
                        ) : undefined
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </HStack>
      ) : null}
    </VStack>
  );
}

export type { ProductListHeaderProps };
export { ProductListHeader };
