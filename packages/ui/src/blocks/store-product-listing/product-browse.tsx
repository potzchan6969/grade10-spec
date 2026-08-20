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

  /** When true, scrolling near the list end reports `onLoadMore`. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  /** Skeleton tile count while loading more; defaults to 10. */
  loadMoreSkeletonCount?: number;

  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;

  className?: string;
};

/** Figma `ProductBrowse` (`4098:1952`): gap-12 (48px) between sidebar and
 * results; px-8 / py-6 (32×24) on the frame. Direction is prefixed because
 * it changes at lg; a stack cannot. */
const BROWSE_CLASS =
  "flex w-full max-lg:flex-col gap-12 px-8 py-6 lg:flex-row lg:items-start";

/**
 * The product-browsing surface: a sidebar of world and type filters, a result
 * header with applied-filter chips and a sort dropdown, and a grid of tiles
 * that loads more as the shopper scrolls.
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
  hasMore,
  loadingMore,
  onLoadMore,
  loadMoreSkeletonCount,
  onProductClick,
  onProductAction,
  className,
}: ProductBrowseProps) {
  const resultsBusy =
    results.status === "loading" || loadingMore ? true : undefined;

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
        aria-busy={resultsBusy}
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
          hasMore={hasMore}
          loadMoreSkeletonCount={loadMoreSkeletonCount}
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
          onProductAction={onProductAction}
          onProductClick={onProductClick}
          results={results}
        />
      </VStack>
    </div>
  );
}

export type { ProductBrowseProps };
export { ProductBrowse };
