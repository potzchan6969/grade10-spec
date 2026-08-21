import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, within } from "storybook/test";
import {
  APPLIED_FILTERS,
  FILTER_GROUPS,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
} from "./fixtures";
import { ProductBrowse, type ProductBrowseProps } from "./product-browse";

const RESULTS_LOAD_MS = 450;
const PAGE_SIZE = 10;
const TOTAL_PRODUCTS = 100;

/** Storybook wrapper: simulates a short results reload when the default ready
 * fixtures are in play. */
function InteractiveProductBrowse(args: ProductBrowseProps) {
  const simulateReload =
    args.results.status === "ready" || args.results.status === "loading";
  const [resultsStatus, setResultsStatus] = useState<
    ProductBrowseProps["results"]["status"]
  >(() => (args.results.status === "ready" ? "loading" : args.results.status));

  useEffect(() => {
    if (!simulateReload) {
      return;
    }

    setResultsStatus("loading");
    const timeout = setTimeout(() => {
      setResultsStatus(args.results.status === "loading" ? "loading" : "ready");
    }, RESULTS_LOAD_MS);

    return () => clearTimeout(timeout);
  }, [args.results.status, simulateReload]);

  const results =
    args.results.status === "error" || args.results.status === "empty"
      ? args.results
      : resultsStatus === "loading"
        ? { status: "loading" as const }
        : args.results.status === "ready"
          ? { status: "ready" as const, data: args.results.data }
          : { status: "loading" as const };

  return <ProductBrowse {...args} results={results} />;
}

const meta = {
  title: "Store Product Listing/ProductBrowse",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => <InteractiveProductBrowse {...args} />,
  args: {
    filterPanelLabel: "Store filters",
    heading: "Filter",
    searchPlaceholder: "Find product",
    searchLabel: "Search products",
    groups: { status: "ready", data: FILTER_GROUPS },
    selection: {},
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    utilityLinks: UTILITY_LINKS,
    results: { status: "ready", data: PRODUCTS },
    resultsLabel: "Products",
    resultCount: "100 Products",
    sortOptions: SORT_OPTIONS,
    sortValue: "popular",
    sortTriggerLabel: "Sort by popularity",
    appliedFilters: [],
    clearFiltersLabel: "Clear filters",
    onSortChange: fn(),
    onClearFilters: fn(),
    hasMore: true,
    loadingMore: false,
    onLoadMore: fn(),
    onProductAction: fn(),
  },
} satisfies Meta<typeof ProductBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Checkboxes start unselected; that empty selection does not hide results. */
export const FiltersStartUnselected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).not.toBeChecked();
    expect(
      canvas.getByRole("checkbox", { name: /Booster Box/ }),
    ).not.toBeChecked();
    expect(canvas.getAllByText("Ninja Spinner").length).toBeGreaterThan(0);
  },
};

/** Both regions loading. */
export const Loading: Story = {
  args: {
    groups: { status: "loading" },
    results: { status: "loading" },
  },
};

/** Results failed, sidebar stands. The two boundaries resolve independently. */
export const ResultsErrorGroupsReady: Story = {
  args: {
    results: {
      status: "error",
      message: "We could not load these products.",
      action: { label: "Try again", onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("We could not load these products."));
    expect(
      canvas.getByRole("checkbox", { name: /Pokémon/ }),
    ).toBeInTheDocument();
  },
};

/** Filter groups still loading, results ready. The count and grid show anyway. */
export const GroupsLoadingResultsReady: Story = {
  args: { groups: { status: "loading" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
  },
};

/** Filters match nothing: the message and a clear-filters action, with the
 * sidebar and the current selection intact. */
export const NoMatch: Story = {
  args: {
    resultCount: "0 Products",
    selection: SELECTION,
    appliedFilters: APPLIED_FILTERS,
    results: {
      status: "empty",
      message: "No products match these filters.",
      action: { label: "Clear filters", onAction: fn() },
    },
    hasMore: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getAllByRole("button", { name: "Clear filters" }).length,
    ).toBeGreaterThan(0);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).toBeChecked();
  },
};

/** An empty catalog: a different message, and no clear-filters action. */
export const EmptyCatalog: Story = {
  args: {
    resultCount: "0 Products",
    selection: {},
    appliedFilters: [],
    results: {
      status: "empty",
      message: "This category has no products yet.",
    },
    hasMore: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This category has no products yet."));
    expect(
      canvas.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  },
};

/** No pagination is rendered on the browse surface. */
export const NoPagination: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  },
};

/** Appending the next page shows Boneyard skeleton tiles below the grid. */
export const LoadingMore: Story = {
  args: {
    loadingMore: true,
    hasMore: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Products" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

/** The end of the catalog hides the load sentinel. */
export const EndOfCatalog: Story = {
  args: { hasMore: false },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector(
        '[data-slot="product-results-load-sentinel"]',
      ),
    ).not.toBeInTheDocument();
  },
};

/** The sidebar is a complementary landmark and the results a named region. */
export const Landmarks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("complementary", { name: "Store filters" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Products" }),
    ).toBeInTheDocument();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};

/** Simulates infinite scroll: each load-more adds ten tiles until the total
 * is reached. */
export const InfiniteScroll: Story = {
  render: (args) => {
    function InfiniteScrollDemo(initialArgs: ProductBrowseProps) {
      const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
      const [loadingMore, setLoadingMore] = useState(false);

      const visibleProducts = PRODUCTS.concat(
        Array.from(
          { length: Math.max(0, visibleCount - PRODUCTS.length) },
          (_, index) => ({
            ...PRODUCTS[index % PRODUCTS.length],
            id: String(PRODUCTS.length + index + 1),
            ariaLabel: `Ninja Spinner, item ${PRODUCTS.length + index + 1}`,
          }),
        ),
      ).slice(0, visibleCount);

      const handleLoadMore = () => {
        if (loadingMore || visibleCount >= TOTAL_PRODUCTS) {
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

      return (
        <ProductBrowse
          {...initialArgs}
          hasMore={visibleCount < TOTAL_PRODUCTS}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          results={{ status: "ready", data: visibleProducts }}
        />
      );
    }

    return <InfiniteScrollDemo {...args} />;
  },
};
