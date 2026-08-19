import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  APPLIED_FILTERS,
  FILTER_GROUPS,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
} from "./fixtures";
import { ProductBrowse, type ProductBrowseProps } from "./product-browse";

const RESULTS_LOAD_MS = 450;

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
    page: 2,
    pageCount: 10,
    onPageChange: fn(),
    onProductAction: fn(),
    ...PAGINATION_LABELS,
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This category has no products yet."));
    expect(
      canvas.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  },
};

/** A single page shows no pagination. */
export const SinglePage: Story = {
  args: { page: 1, pageCount: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  },
};

/** Previous is unavailable on the first page. */
export const FirstPage: Story = {
  args: { page: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(canvas.getByRole("button", { name: "Next" })).toBeEnabled();
  },
};

/** Next is unavailable on the last page. */
export const LastPage: Story = {
  args: { page: 10 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
  },
};

/** A page change is reported; page 2 stays active until the consumer supplies
 * a new page. */
export const PageChangeIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "3" }));

    expect(args.onPageChange).toHaveBeenCalledTimes(1);
    expect(args.onPageChange).toHaveBeenCalledWith(3);
    expect(canvas.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
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
