import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@grade10/design-system/components/display/pagination";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { FilterPanel } from "./filter-panel";
import { ProductListHeader } from "./product-list-header";
import { ProductResultsPanel } from "./product-results-panel";
import type {
  AppliedFilter,
  AsyncState,
  FilterGroup,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "./types";

type ProductBrowseProps = {
  filterPanelLabel: string;
  heading: ReactNode;
  searchPlaceholder: ReactNode;
  searchLabel?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  groups: AsyncState<readonly FilterGroup[]>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  utilityLinks?: readonly UtilityLink[];

  results: AsyncState<readonly ProductSummary[]>;
  /** Accessible name for the results region. */
  resultsLabel: string;
  resultCount: ReactNode;

  sortOptions: readonly SortOption[];
  sortValue?: string;
  sortTriggerLabel?: ReactNode;
  onSortChange?: (optionId: string) => void;
  appliedFilters?: readonly AppliedFilter[];
  clearFiltersLabel?: ReactNode;
  onClearFilters?: () => void;

  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Required: the pagination primitive would otherwise fall back to its own
   * English `Prev` / `Next`, which no consumer could translate. */
  previousLabel: ReactNode;
  nextLabel: ReactNode;
  /** Accessible names, which may fall back to the primitive's default. */
  paginationLabel?: string;
  morePagesLabel?: string;

  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;

  className?: string;
};

/** Figma `ProductBrowse` (`4098:1952`): gap-12 (48px) between sidebar and
 * results; px-8 / py-6 (32×24) on the frame. Direction is prefixed because
 * it changes at lg; a stack cannot. */
const BROWSE_CLASS =
  "flex w-full max-lg:flex-col gap-12 px-8 py-6 lg:flex-row lg:items-start";

/** First page, last page, and a window around the current one, with a gap
 * marker wherever the run breaks. */
function pageItems(page: number, pageCount: number): (number | "gap")[] {
  const wanted = [1, pageCount, page - 1, page, page + 1];
  const shown = [...new Set(wanted)]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let previous = 0;
  for (const value of shown) {
    if (previous && value - previous > 1) items.push("gap");
    items.push(value);
    previous = value;
  }
  return items;
}

/**
 * The product-browsing surface: a sidebar of world and type filters, a result
 * header with applied-filter chips and a sort dropdown, a grid of tiles, and
 * pagination.
 *
 * Filters and results are independent async boundaries — a failed result set
 * leaves the filter panel usable, which is the common case when facets and
 * results come from separate calls.
 */
function ProductBrowse({
  filterPanelLabel,
  heading,
  searchPlaceholder,
  searchLabel,
  searchValue,
  onSearchChange,
  onSearchClear,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  utilityLinks,
  results,
  resultsLabel,
  resultCount,
  sortOptions,
  sortValue,
  sortTriggerLabel,
  onSortChange,
  appliedFilters,
  clearFiltersLabel,
  onClearFilters,
  page,
  pageCount,
  onPageChange,
  paginationLabel,
  previousLabel,
  nextLabel,
  morePagesLabel,
  onProductClick,
  onProductAction,
  className,
}: ProductBrowseProps) {
  return (
    <div className={cn(BROWSE_CLASS, className)} data-slot="product-browse">
      <FilterPanel
        groups={groups}
        heading={heading}
        label={filterPanelLabel}
        onFilterChange={onFilterChange}
        onGroupExpand={onGroupExpand}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        searchLabel={searchLabel}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        selection={selection}
        utilityLinks={utilityLinks}
      />
      <VStack
        aria-label={resultsLabel}
        className="w-full min-w-0 flex-1 gap-8 lg:items-center"
        data-slot="product-browse-results"
        gap="none"
        role="region"
      >
        <ProductListHeader
          appliedFilters={appliedFilters}
          className="w-full"
          clearFiltersLabel={clearFiltersLabel}
          onClearFilters={onClearFilters}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          resultCount={resultCount}
          sortOptions={sortOptions}
          sortTriggerLabel={sortTriggerLabel}
          sortValue={sortValue}
        />

        <ProductResultsPanel
          onProductAction={onProductAction}
          onProductClick={onProductClick}
          results={results}
        />

        {pageCount > 1 ? (
          <Pagination
            className="w-full"
            // Spread only when set: passing `undefined` would clear the
            // primitive's own accessible name rather than leave it alone.
            {...(paginationLabel ? { "aria-label": paginationLabel } : {})}
          >
            <PaginationPrevious
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              {previousLabel}
            </PaginationPrevious>
            {pageItems(page, pageCount).map((item, index) =>
              item === "gap" ? (
                <PaginationEllipsis
                  // biome-ignore lint/suspicious/noArrayIndexKey: a gap has no identity beyond its position.
                  key={`gap-${index}`}
                  label={morePagesLabel}
                />
              ) : (
                <PaginationLink
                  isActive={item === page}
                  key={item}
                  onClick={() => onPageChange?.(item)}
                >
                  {item}
                </PaginationLink>
              ),
            )}
            <PaginationNext
              disabled={page >= pageCount}
              onClick={() => onPageChange?.(page + 1)}
            >
              {nextLabel}
            </PaginationNext>
          </Pagination>
        ) : null}
      </VStack>
    </div>
  );
}

export type { ProductBrowseProps };
export { ProductBrowse };
