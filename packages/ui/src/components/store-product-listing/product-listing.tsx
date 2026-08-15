import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@grade10/design-system/components/display/pagination";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { AsyncMessage } from "./async-message";
import { ProductFilterPanel } from "./product-filter-panel";
import { ProductGrid } from "./product-grid";
import { ProductListingToolbar } from "./product-listing-toolbar";
import type {
  AsyncState,
  FilterGroup,
  FilterSelection,
  ProductSummary,
  SortOption,
} from "./types";

type ProductListingProps = {
  /** Breadcrumbs, heading, and blurb, assembled by the consumer. */
  header?: ReactNode;

  filters: AsyncState<readonly FilterGroup[]>;
  filterPanelLabel: string;
  filterSummary?: ReactNode;
  selection: FilterSelection;
  onFilterChange: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;

  results: AsyncState<readonly ProductSummary[]>;
  /** Accessible name for the results region. */
  resultsLabel: string;
  resultCount: ReactNode;

  sortOptions: readonly SortOption[];
  sortValue?: string;
  sortTriggerLabel?: ReactNode;
  onSortChange?: (optionId: string) => void;

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
  onProductQuantityChange?: (productId: string, quantity: number) => void;
  onProductWishlistClick?: (productId: string) => void;

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
 * The category-browsing surface: filters, a result count and sort control, a
 * grid of tiles, and pagination.
 *
 * Filters and results are independent async boundaries — a failed result set
 * leaves the filter panel usable, which is the common case when facets and
 * results come from separate calls.
 */
function ProductListing({
  header,
  filters,
  filterPanelLabel,
  filterSummary,
  selection,
  onFilterChange,
  results,
  resultsLabel,
  resultCount,
  sortOptions,
  sortValue,
  sortTriggerLabel,
  onSortChange,
  page,
  pageCount,
  onPageChange,
  paginationLabel,
  previousLabel,
  nextLabel,
  morePagesLabel,
  onProductClick,
  onProductAction,
  onProductQuantityChange,
  onProductWishlistClick,
  className,
}: ProductListingProps) {
  return (
    <div
      className={cn("flex w-full flex-col", className)}
      data-slot="product-listing"
    >
      {header}
      <div className="flex flex-col items-start gap-8 p-10 xl:flex-row">
        <ProductFilterPanel
          groups={filters}
          label={filterPanelLabel}
          onFilterChange={onFilterChange}
          selection={selection}
          summary={filterSummary}
        />
        <section
          aria-label={resultsLabel}
          className="flex min-w-0 flex-1 flex-col gap-6"
          data-slot="product-listing-results"
        >
          <ProductListingToolbar
            onSortChange={onSortChange}
            resultCount={resultCount}
            sortOptions={sortOptions}
            sortTriggerLabel={sortTriggerLabel}
            sortValue={sortValue}
          />

          {results.status === "loading" ? (
            <div
              className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-4"
              data-slot="results-loading"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((tile) => (
                <Skeleton className="h-[340px] w-full" key={tile} />
              ))}
            </div>
          ) : null}

          {results.status === "empty" || results.status === "error" ? (
            <AsyncMessage
              action={results.action}
              message={results.message}
              slot={`results-${results.status}`}
            />
          ) : null}

          {results.status === "ready" ? (
            <ProductGrid
              onProductAction={onProductAction}
              onProductClick={onProductClick}
              onProductQuantityChange={onProductQuantityChange}
              onProductWishlistClick={onProductWishlistClick}
              products={results.data}
            />
          ) : null}

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

export type { ProductListingProps };
export { ProductListing };
