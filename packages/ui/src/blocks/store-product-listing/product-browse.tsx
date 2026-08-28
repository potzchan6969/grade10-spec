import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { FilterPanelCopy } from "./filter-panel";
import { FilterPanel } from "./filter-panel";
import type { ProductListHeaderCopy } from "./product-list-header";
import { ProductListHeader } from "./product-list-header";
import type { ProductResultsPanelCopy } from "./product-results-panel";
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

/**
 * Every word the browse root renders, as the components under it declare
 * them — the filter panel's, the list header's, the tiles' — plus the one it
 * owns itself.
 */
type ProductBrowseCopy = {
  filterPanel: FilterPanelCopy;
  listHeader?: ProductListHeaderCopy;
  results: ProductResultsPanelCopy & {
    /** Accessible name for the results region. */
    label: string;
  };
};

type ProductBrowseProps = {
  copy: ProductBrowseCopy;
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
  resultCount: ReactNode;

  sortOptions: readonly SortOption[];
  sortValue?: string;
  onSortChange?: (optionId: string) => void;
  appliedFilters?: readonly AppliedFilter[];
  onClearFilters?: () => void;

  /** When true, scrolling near the list end reports `onLoadMore`. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  /** Skeleton tile count while loading more; defaults to 10. */
  loadMoreSkeletonCount?: number;

  onProductClick?: (productId: string) => void;
  onProductCartQuantityChange?: (productId: string, quantity: number) => void;

  className?: string;
};

/** Figma `ProductBrowse` (`4098:1952`): gap-16 (64px) between sidebar and
 * results; px-8 / pt-6 / pb-16 (32×24×64) on the frame. Direction is
 * prefixed because it changes at lg; a stack cannot. */
const BROWSE_CLASS =
  "flex w-full max-lg:flex-col gap-16 px-8 pt-6 pb-16 lg:flex-row lg:items-start";

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
  copy,
  searchValue,
  onSearchChange,
  onSearchClear,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  utilityLinks,
  results,
  resultCount,
  sortOptions,
  sortValue,
  onSortChange,
  appliedFilters,
  onClearFilters,
  hasMore,
  loadingMore,
  onLoadMore,
  loadMoreSkeletonCount,
  onProductClick,
  onProductCartQuantityChange,
  className,
}: ProductBrowseProps) {
  const resultsBusy =
    results.status === "loading" || loadingMore ? true : undefined;

  return (
    <div className={cn(BROWSE_CLASS, className)} data-slot="product-browse">
      <FilterPanel
        copy={copy.filterPanel}
        groups={groups}
        onFilterChange={onFilterChange}
        onGroupExpand={onGroupExpand}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        searchValue={searchValue}
        selection={selection}
        utilityLinks={utilityLinks}
      />
      <VStack
        aria-busy={resultsBusy}
        aria-label={copy.results.label}
        className="w-full min-w-0 flex-1 gap-8 lg:items-center"
        data-slot="product-browse-results"
        gap="none"
        role="region"
      >
        <ProductListHeader
          appliedFilters={appliedFilters}
          className="w-full"
          copy={copy.listHeader}
          onClearFilters={onClearFilters}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          resultCount={resultCount}
          sortOptions={sortOptions}
          sortValue={sortValue}
        />

        <ProductResultsPanel
          copy={copy.results}
          hasMore={hasMore}
          loadMoreSkeletonCount={loadMoreSkeletonCount}
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
          onProductCartQuantityChange={onProductCartQuantityChange}
          onProductClick={onProductClick}
          results={results}
        />
      </VStack>
    </div>
  );
}

export type { ProductBrowseCopy, ProductBrowseProps };
export { ProductBrowse };
