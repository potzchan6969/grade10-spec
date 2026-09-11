import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import { FadersHorizontal } from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import type { FilterPanelCopy } from "./filter-panel";
import { FilterPanel } from "./filter-panel";
import { ProductFilter } from "./product-filter";
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
 * Below `lg`, facets sit in a left drawer opened by Filter; catalogue search
 * stays on the listing. Only one search field mounts per viewport so
 * suggestion menus do not double. Filters and results are independent async
 * boundaries.
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const isWide = useIsWideViewport();

  // Drawer shows the full facet lists — ask the consumer to expand any
  // capped group when it opens (desktop keeps the cap + “See all”).
  useEffect(() => {
    if (!filterDrawerOpen || isWide) return;
    if (groups.status !== "ready") return;
    for (const group of groups.data) {
      if (group.expandLabel != null) onGroupExpand?.(group.id);
    }
  }, [filterDrawerOpen, isWide, groups, onGroupExpand]);

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
    onGroupExpand,
    selection,
  } as const;

  return (
    <div className={cn(BROWSE_CLASS, className)} data-slot="product-browse">
      {isWide ? (
        <FilterPanel
          copy={copy.filterPanel}
          utilityLinks={utilityLinks}
          {...facetProps}
          {...searchProps}
        />
      ) : (
        <div
          className="flex w-full flex-col gap-4"
          data-slot="product-browse-mobile-filter"
        >
          <HStack className="w-full items-center gap-3" gap="none">
            <IconButton
              aria-label={copy.filterPanel.openFilter}
              className="shrink-0"
              onClick={() => setFilterDrawerOpen(true)}
              size="md"
              type="button"
              variant="outline"
            >
              <FadersHorizontal aria-hidden weight="bold" />
            </IconButton>
            <div className="min-w-0 flex-1">
              <ProductFilter
                copy={copy.filterPanel}
                groups={groups}
                showGroups={false}
                showHeading={false}
                showSearch
                {...searchProps}
              />
            </div>
          </HStack>

          <Drawer
            open={filterDrawerOpen}
            swipeDirection="left"
            onOpenChange={(next) => {
              if (!next) setFilterDrawerOpen(false);
            }}
          >
            <DrawerContent aria-label={copy.filterPanel.label}>
              <DrawerHeader>
                <DrawerTitle>{copy.filterPanel.heading}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="gap-8">
                <FilterPanel
                  className="static w-full self-auto"
                  copy={copy.filterPanel}
                  facetLayout="tabs"
                  showGroupExpand={false}
                  showHeading={false}
                  showSearch={false}
                  utilityLinks={[]}
                  {...facetProps}
                />
              </DrawerBody>
              <DrawerFooter className="flex-row gap-2">
                <Button
                  className="flex-1"
                  onClick={() => onClearFilters?.()}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {copy.filterPanel.drawerClear}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setFilterDrawerOpen(false)}
                  size="sm"
                  type="button"
                >
                  {copy.filterPanel.drawerDone}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}

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
