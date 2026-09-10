import { useEffect, useState } from "react";
import {
  FILTER_GROUPS,
  LISTING_COPY,
  PRODUCTS,
  SEARCH_SUGGESTIONS,
  SORT_OPTIONS,
  UTILITY_LINKS,
} from "./fixtures";
import { ProductBrowse, type ProductBrowseProps } from "./product-browse";
import type { AppliedFilter } from "./types";

const RESULTS_LOAD_MS = 450;
const PAGE_SIZE = 10;
const TOTAL_PRODUCTS = 100;

function extendProducts(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const template = PRODUCTS[index % PRODUCTS.length];
    return {
      ...template,
      id: String(index + 1),
      name: `Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item ${index + 1}`,
    };
  });
}

/** Storybook wrapper: short results reload, then pages in more tiles on scroll
 * when the story asks for `hasMore` (unless it is a frozen loading-more demo). */
export function InteractiveProductBrowse(args: ProductBrowseProps) {
  const simulateReload =
    args.results.status === "ready" || args.results.status === "loading";
  const paginate =
    args.hasMore === true &&
    args.loadingMore !== true &&
    args.results.status === "ready";

  const [resultsStatus, setResultsStatus] = useState<
    ProductBrowseProps["results"]["status"]
  >(() => (args.results.status === "ready" ? "loading" : args.results.status));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!simulateReload) {
      return;
    }

    setResultsStatus("loading");
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    const timeout = setTimeout(() => {
      setResultsStatus(args.results.status === "loading" ? "loading" : "ready");
    }, RESULTS_LOAD_MS);

    return () => clearTimeout(timeout);
  }, [args.results.status, simulateReload]);

  const handleLoadMore = () => {
    if (!paginate || loadingMore || visibleCount >= TOTAL_PRODUCTS) {
      return;
    }

    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((previous) =>
        Math.min(previous + PAGE_SIZE, TOTAL_PRODUCTS),
      );
      setLoadingMore(false);
    }, RESULTS_LOAD_MS);
  };

  const results =
    args.results.status === "error" || args.results.status === "empty"
      ? args.results
      : resultsStatus === "loading"
        ? { status: "loading" as const }
        : args.results.status === "ready"
          ? {
              status: "ready" as const,
              data: paginate
                ? extendProducts(visibleCount)
                : args.results.data,
            }
          : { status: "loading" as const };

  return (
    <ProductBrowse
      {...args}
      hasMore={paginate ? visibleCount < TOTAL_PRODUCTS : args.hasMore}
      loadingMore={paginate ? loadingMore : args.loadingMore}
      onLoadMore={paginate ? handleLoadMore : args.onLoadMore}
      results={results}
    />
  );
}

/**
 * Listing search demo: typing shows suggestions; Enter commits a chip and
 * clears the field; a filter suggestion applies that facet chip. Consumer-
 * owned wiring only.
 */
export function SearchInteractiveBrowse(args: ProductBrowseProps) {
  const [searchValue, setSearchValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<readonly AppliedFilter[]>(
    args.appliedFilters ?? [],
  );
  const [selection, setSelection] = useState(
    () => args.selection ?? {},
  );
  const showSuggestions = searchValue.trim().length >= 2;

  return (
    <InteractiveProductBrowse
      {...args}
      appliedFilters={appliedFilters}
      selection={selection}
      onClearFilters={() => {
        setAppliedFilters([]);
        setSelection({});
        args.onClearFilters?.();
      }}
      onFilterChange={(groupId, optionId, selected) => {
        setSelection((current) => {
          const existing = current[groupId] ?? [];
          const nextForGroup = selected
            ? existing.includes(optionId)
              ? existing
              : [...existing, optionId]
            : existing.filter((id) => id !== optionId);
          const next = { ...current };
          if (nextForGroup.length === 0) {
            delete next[groupId];
          } else {
            next[groupId] = nextForGroup;
          }
          return next;
        });
        setAppliedFilters((current) => {
          if (!selected) {
            return current.filter(
              (filter) =>
                !(filter.groupId === groupId && filter.optionId === optionId),
            );
          }
          if (
            current.some(
              (filter) =>
                filter.groupId === groupId && filter.optionId === optionId,
            )
          ) {
            return current;
          }
          const option = FILTER_GROUPS.flatMap((group) =>
            group.id === groupId ? group.options : [],
          ).find((entry) => entry.id === optionId);
          return [
            ...current,
            {
              groupId,
              optionId,
              label: option?.label ?? optionId,
            },
          ];
        });
        args.onFilterChange?.(groupId, optionId, selected);
      }}
      onSearchChange={(value) => {
        setSearchValue(value);
        args.onSearchChange?.(value);
      }}
      onSearchClear={() => {
        setSearchValue("");
        args.onSearchClear?.();
      }}
      onSearchCommit={(value) => {
        setSearchValue("");
        setAppliedFilters((current) => [
          ...current.filter((filter) => filter.groupId !== "search"),
          {
            groupId: "search",
            optionId: value,
            label: `Search: "${value}"`,
          },
        ]);
        args.onSearchCommit?.(value);
      }}
      onSearchSuggestionSelect={(suggestion, groupId) => {
        setSearchValue("");
        if (groupId === "filters") {
          const [facetGroup, facetOption] = String(suggestion.id).split(":");
          if (facetGroup && facetOption) {
            const label =
              typeof suggestion.label === "string"
                ? suggestion.label
                : facetOption;
            setSelection((current) => {
              const existing = current[facetGroup] ?? [];
              return {
                ...current,
                [facetGroup]: existing.includes(facetOption)
                  ? existing
                  : [...existing, facetOption],
              };
            });
            setAppliedFilters((current) => [
              ...current.filter(
                (filter) =>
                  !(
                    filter.groupId === facetGroup &&
                    filter.optionId === facetOption
                  ),
              ),
              {
                groupId: facetGroup,
                optionId: facetOption,
                label,
              },
            ]);
          }
        }
        args.onSearchSuggestionSelect?.(suggestion, groupId);
      }}
      searchSuggestions={showSuggestions ? SEARCH_SUGGESTIONS : undefined}
      searchValue={searchValue}
    />
  );
}

export const productBrowseArgs = {
  copy: {
    filterPanel: {
      label: "Store filters",
      heading: "Filter",
      searchPlaceholder: "Find product",
      searchLabel: "Search products",
    },
    listHeader: {
      sortTrigger: "Sort by latest product",
      clearFilters: "Clear filters",
    },
    results: { label: "Products", ...LISTING_COPY },
  },
  groups: { status: "ready" as const, data: FILTER_GROUPS },
  selection: {},
  utilityLinks: UTILITY_LINKS,
  results: { status: "ready" as const, data: PRODUCTS },
  resultCount: "100 Products",
  sortOptions: SORT_OPTIONS,
  sortValue: "new",
  appliedFilters: [] as AppliedFilter[],
  hasMore: true,
  loadingMore: false,
};

/** Re-export fixtures stories in this folder often need. */
export { APPLIED_FILTERS, SELECTION } from "./fixtures";
