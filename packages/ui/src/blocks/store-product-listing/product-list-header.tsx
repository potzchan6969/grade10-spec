import { Button } from "@grade10/design-system/components/forms/button";
import { Chip } from "@grade10/design-system/components/forms/chip";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { IconProvider } from "@grade10/design-system/components/providers/icon-provider";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { AppliedFilter, SortOption } from "./types";

type ProductListHeaderProps = {
  /** Formatted result total, displayed as supplied. Never derived from the
   * number of products on the page. Figma's `Count`. */
  resultCount: ReactNode;
  sortOptions?: readonly SortOption[];
  /** ID of the active sort option. */
  sortValue?: string;
  /** Whole trigger label, e.g. "Sort by popularity". */
  sortTriggerLabel?: ReactNode;
  onSortChange?: (optionId: string) => void;
  appliedFilters?: readonly AppliedFilter[];
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  clearFiltersLabel?: ReactNode;
  onClearFilters?: () => void;
  className?: string;
};

/**
 * Result count, optional applied-filter chips, and a sort dropdown.
 * Figma set `Product / Product List Header` (`4288:14117`).
 *
 * Renderable on its own, so another results surface can reuse it without the
 * browse root. The header reports a change and displays what it is given; it
 * never holds the selection.
 */
function ProductListHeader({
  resultCount,
  sortOptions = [],
  sortValue,
  sortTriggerLabel,
  onSortChange,
  appliedFilters = [],
  onFilterChange,
  clearFiltersLabel,
  onClearFilters,
  className,
}: ProductListHeaderProps) {
  const activeSort =
    sortOptions.find((option) => option.id === sortValue) ?? sortOptions[0];
  const triggerLabel = sortTriggerLabel ?? activeSort?.label;
  const showFilters = appliedFilters.length > 0;

  return (
    <IconProvider>
      <VStack
        className={cn("w-full gap-2", className)}
        data-slot="product-list-header"
        gap="none"
      >
        <HStack className="w-full" hAlign="space-between" vAlign="center">
          <p className="text-2xl font-bold text-foreground" role="status">
            {resultCount}
          </p>
          {sortOptions.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="md"
                    trailing={<CaretDown aria-hidden size={14} />}
                    variant="ghost"
                  />
                }
              >
                {triggerLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => {
                  const selected = option.id === sortValue;
                  return (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => {
                        if (option.id !== sortValue) onSortChange?.(option.id);
                      }}
                      selected={selected}
                      trailing={
                        selected ? <Check aria-hidden size={14} /> : undefined
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </HStack>
        {showFilters ? (
          <HStack
            className="w-full gap-4 py-1"
            data-slot="product-list-header-filters"
            gap="none"
            vAlign="center"
            wrap
          >
            <HStack gap="sm" vAlign="center" wrap>
              {appliedFilters.map((filter) => (
                <Chip
                  key={`${filter.groupId}:${filter.optionId}`}
                  onClick={() =>
                    onFilterChange?.(filter.groupId, filter.optionId, false)
                  }
                >
                  {filter.label}
                </Chip>
              ))}
            </HStack>
            {onClearFilters != null && clearFiltersLabel != null ? (
              <Link
                onClick={onClearFilters}
                render={<button type="button" />}
                size="sm"
                variant="secondary"
              >
                {clearFiltersLabel}
              </Link>
            ) : null}
          </HStack>
        ) : null}
      </VStack>
    </IconProvider>
  );
}

export type { ProductListHeaderProps };
export { ProductListHeader };
