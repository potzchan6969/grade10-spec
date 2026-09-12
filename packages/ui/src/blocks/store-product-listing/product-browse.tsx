import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { type ReactNode, useEffect, useState } from "react";
import type { FilterPanelCopy } from "./filter-panel";
import { FilterPanel } from "./filter-panel";
import {
  ListingNarrowChrome,
  type ListingNarrowChromeCopy,
} from "./listing-narrow-chrome";
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
  SearchSuggestion,
  SearchSuggestionGroup,
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
  /** Narrow facet drawers; falls back to filterPanel clear / showResults. */
  narrowChrome?: ListingNarrowChromeCopy;
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
  searchSuggestions?: readonly SearchSuggestionGroup[];
  onSearchCommit?: (value: string) => void;
  onSearchSuggestionSelect?: (
    suggestion: SearchSuggestion,
    groupId: string,
  ) => void;
  groups: AsyncState<readonly FilterGroup[]>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  onGroupCollapse?: (groupId: string) => void;
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

/** Matches Tailwind `lg` so only one search Autocomplete mounts at a time. */
const WIDE_VIEWPORT_QUERY = "(min-width: 1024px)";

function useIsWideViewport() {
  const [isWide, setIsWide] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(WIDE_VIEWPORT_QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(WIDE_VIEWPORT_QUERY);
    const onChange = () => setIsWide(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isWide;
}

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
 * Below `lg`, count and sort/facet pills open bottom drawers; there is no
 * listing search or left Filter drawer. Only one search field mounts (wide
 * sidebar) so suggestion menus do not double. Filters and results are
 * independent async boundaries.
 */
function ProductBrowse({
  copy,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchSuggestions,
  onSearchCommit,
  onSearchSuggestionSelect,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  onGroupCollapse,
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
  const isWide = useIsWideViewport();

  const searchProps = {
    onSearchChange,
    onSearchClear,
    onSearchCommit,
    onSearchSuggestionSelect,
    searchSuggestions,
    searchValue,
  } as const;

  const facetProps = {
    groups,
    onFilterChange,
    onGroupCollapse,
    onGroupExpand,
    selection,
  } as const;

  const narrowChromeCopy: ListingNarrowChromeCopy = copy.narrowChrome ?? {
    clear: copy.filterPanel.drawerClear,
    showResults: copy.filterPanel.showResults,
  };

  return (
    <div className={cn(BROWSE_CLASS, className)} data-slot="product-browse">
      {isWide ? (
        <FilterPanel
          copy={copy.filterPanel}
          utilityLinks={utilityLinks}
          {...facetProps}
          {...searchProps}
        />
      ) : null}

      <VStack
        aria-busy={resultsBusy}
        aria-label={copy.results.label}
        className="w-full min-w-0 flex-1 gap-8 lg:items-center"
        data-slot="product-browse-results"
        gap="none"
        role="region"
      >
        {isWide ? (
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
        ) : (
          <ListingNarrowChrome
            className="w-full"
            copy={narrowChromeCopy}
            groups={groups}
            onFilterChange={onFilterChange}
            onGroupExpand={onGroupExpand}
            onSortChange={onSortChange}
            resultCount={resultCount}
            selection={selection}
            sortOptions={sortOptions}
            sortValue={sortValue}
          />
        )}

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
