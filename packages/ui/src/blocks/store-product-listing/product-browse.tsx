import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@grade10/design-system/components/display/pagination";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { FilterPanel } from "./filter-panel";
import { ProductListHeader } from "./product-list-header";
import { ProductResultsPanel } from "./product-results-panel";
import type {
  AsyncState,
  CollectionOption,
  FilterGroup,
  FilterSelection,
  ProductSummary,
  SortOption,
  UtilityLink,
} from "./types";

type ProductBrowseProps = {
  filterPanelLabel: string;
  searchPlaceholder: ReactNode;
  searchLabel?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  collections: AsyncState<readonly CollectionOption[]>;
  activeCollection?: string;
  onCollectionChange?: (collectionId: string) => void;
  utilityLinks?: readonly UtilityLink[];
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;

  results: AsyncState<readonly ProductSummary[]>;
  /** Accessible name for the results region. */
  resultsLabel: string;
  title: ReactNode;
  resultCount: ReactNode;

  sortOptions: readonly SortOption[];
  sortValue?: string;
  onSortChange?: (optionId: string) => void;
  chipFilters?: readonly FilterGroup[];
  selectFilters?: readonly FilterGroup[];
  selectFilterValues?: Readonly<Record<string, string>>;
  onSelectFilterChange?: (groupId: string, optionId: string) => void;

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
 * The category-browsing surface: filters, a titled result header with sort
 * and filter chips, a grid of tiles, and pagination.
 *
 * Filters and results are independent async boundaries — a failed result set
 * leaves the filter panel usable, which is the common case when facets and
 * results come from separate calls.
 */
function ProductBrowse({
  filterPanelLabel,
  searchPlaceholder,
  searchLabel,
  searchValue,
  onSearchChange,
  onSearchClear,
  collections,
  activeCollection,
  onCollectionChange,
  utilityLinks,
  selection = {},
  onFilterChange,
  results,
  resultsLabel,
  title,
  resultCount,
  sortOptions,
  sortValue,
  onSortChange,
  chipFilters,
  selectFilters,
  selectFilterValues,
  onSelectFilterChange,
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
    <div
      className={cn("flex w-full flex-col", className)}
      data-slot="product-browse"
    >
      <div className="flex w-full flex-col gap-8 p-6 lg:flex-row lg:items-start">
        <FilterPanel
          activeCollection={activeCollection}
          collections={collections}
          label={filterPanelLabel}
          onCollectionChange={onCollectionChange}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
          searchLabel={searchLabel}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          utilityLinks={utilityLinks}
        />
        <section
          aria-label={resultsLabel}
          className="flex w-full min-w-0 flex-1 flex-col gap-6 lg:items-center"
          data-slot="product-browse-results"
        >
          <ProductListHeader
            className="w-full"
            chipFilters={chipFilters}
            onFilterChange={onFilterChange}
            onSelectFilterChange={onSelectFilterChange}
            onSortChange={onSortChange}
            resultCount={resultCount}
            selectFilters={selectFilters}
            selectFilterValues={selectFilterValues}
            selection={selection}
            sortOptions={sortOptions}
            sortValue={sortValue}
            title={title}
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
        </section>
      </div>
    </div>
  );
}

export type { ProductBrowseProps };
export { ProductBrowse };
