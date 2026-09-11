import { Button } from "@grade10/design-system/components/forms/button";
import { Chip } from "@grade10/design-system/components/forms/chip";
import { Link } from "@grade10/design-system/components/forms/link";
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

/** The words the header renders, whatever it is listing. */
type ProductListHeaderCopy = {
  /** Whole trigger label, e.g. "Sort by latest product". */
  sortTrigger?: string;
  clearFilters?: string;
};

type ProductListHeaderProps = {
  copy?: ProductListHeaderCopy;
  /** Formatted result total, displayed as supplied. Never derived from the
   * number of products on the page. Figma's `Count`. */
  resultCount: ReactNode;
  sortOptions?: readonly SortOption[];
  /** ID of the active sort option. */
  sortValue?: string;
  onSortChange?: (optionId: string) => void;
  appliedFilters?: readonly AppliedFilter[];
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onClearFilters?: () => void;
  className?: string;
};

/**
 * The header of search and product list result.
 *
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
  copy,
  onSortChange,
  appliedFilters = [],
  onFilterChange,
  onClearFilters,
  className,
}: ProductListHeaderProps) {
  const activeSort =
    sortOptions.find((option) => option.id === sortValue) ?? sortOptions[0];
  const triggerLabel = copy?.sortTrigger ?? activeSort?.label;
  const showFilters = appliedFilters.length > 0;

  return (
    <IconProvider>
      <VStack
        className={cn("w-full gap-2", className)}
        data-slot="product-list-header"
        gap="none"
      >
        <div
          className="flex w-full flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2"
          data-slot="product-list-header-toolbar"
        >
          <p
            className="shrink-0 whitespace-nowrap text-2xl font-bold text-foreground"
            role="status"
          >
            {resultCount}
          </p>
          {sortOptions.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="max-w-full sm:ml-auto"
                render={
                  <Button
                    className="max-w-full"
                    size="md"
                    trailing={<CaretDown aria-hidden size={14} />}
                    variant="ghost"
                  />
                }
              >
                <span className="truncate">{triggerLabel}</span>
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
        </div>
        {showFilters ? (
          <div
            className="flex w-full flex-wrap items-center gap-2"
            data-slot="product-list-header-filters"
          >
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
            {onClearFilters != null && copy?.clearFilters != null ? (
              <Link
                className="ms-2 shrink-0"
                onClick={onClearFilters}
                render={<button type="button" />}
                size="sm"
                variant="secondary"
              >
                {copy.clearFilters}
              </Link>
            ) : null}
          </div>
        ) : null}
      </VStack>
    </IconProvider>
  );
}

export type { ProductListHeaderCopy, ProductListHeaderProps };
export { ProductListHeader };
