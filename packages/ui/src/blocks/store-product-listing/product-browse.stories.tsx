import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useEffect, useState } from "react";
import {
  CHIP_FILTERS,
  COLLECTIONS,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECT_FILTERS,
  SELECTION,
  SORT_OPTIONS,
  UTILITY_LINKS,
} from "./fixtures";
import { ProductBrowse, type ProductBrowseProps } from "./product-browse";

const RESULTS_LOAD_MS = 450;

function collectionTitle(activeCollection: string) {
  return (
    COLLECTIONS.find((collection) => collection.id === activeCollection)
      ?.label ?? "All Collections"
  );
}

/** Storybook wrapper: keeps `activeCollection` in local state and simulates a
 * short results reload when the default ready fixtures are in play. */
function InteractiveProductBrowse(args: ProductBrowseProps) {
  const [activeCollection, setActiveCollection] = useState(
    args.activeCollection ?? "pokemon",
  );
  const simulateReload =
    args.results.status === "ready" || args.results.status === "loading";
  const [resultsStatus, setResultsStatus] = useState<
    ProductBrowseProps["results"]["status"]
  >(() => (args.results.status === "ready" ? "loading" : args.results.status));

  useEffect(() => {
    if (args.activeCollection != null) {
      setActiveCollection(args.activeCollection);
    }
  }, [args.activeCollection]);

  useEffect(() => {
    if (!simulateReload) {
      return;
    }

    setResultsStatus("loading");
    const timeout = setTimeout(() => {
      setResultsStatus(
        args.results.status === "loading" ? "loading" : "ready",
      );
    }, RESULTS_LOAD_MS);

    return () => clearTimeout(timeout);
  }, [activeCollection, args.results.status, simulateReload]);

  const results =
    args.results.status === "error" || args.results.status === "empty"
      ? args.results
      : resultsStatus === "loading"
        ? { status: "loading" as const }
        : args.results.status === "ready"
          ? { status: "ready" as const, data: args.results.data }
          : { status: "loading" as const };

  return (
    <ProductBrowse
      {...args}
      activeCollection={activeCollection}
      onCollectionChange={(collectionId) => {
        setActiveCollection(collectionId);
        args.onCollectionChange?.(collectionId);
      }}
      results={results}
      title={collectionTitle(activeCollection)}
    />
  );
}

const meta = {
  title: "Store Product Listing/ProductBrowse",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => <InteractiveProductBrowse {...args} />,
  args: {
    filterPanelLabel: "Store navigation",
    searchPlaceholder: "Search...",
    searchLabel: "Search products",
    collections: { status: "ready", data: COLLECTIONS },
    activeCollection: "pokemon",
    onCollectionChange: fn(),
    onSearchChange: fn(),
    utilityLinks: UTILITY_LINKS,
    selection: {},
    onFilterChange: fn(),
    results: { status: "ready", data: PRODUCTS },
    resultsLabel: "Products",
    title: "Pokémon",
    resultCount: "38",
    sortOptions: SORT_OPTIONS,
    sortValue: "popular",
    chipFilters: CHIP_FILTERS,
    selectFilters: SELECT_FILTERS,
    selectFilterValues: { series: "all" },
    onSortChange: fn(),
    onSelectFilterChange: fn(),
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

/** Type chips start unselected; that empty selection does not hide results. */
export const TypeChipsStartUnselected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pack" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(canvas.getByRole("button", { name: "Box" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(canvas.getAllByText("Ninja Spinner").length).toBeGreaterThan(0);
  },
};

/** Both regions loading. */
export const Loading: Story = {
  args: {
    collections: { status: "loading" },
    results: { status: "loading" },
  },
};

/** Results failed, sidebar stands. The two boundaries resolve independently. */
export const ResultsErrorCollectionsReady: Story = {
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
      canvas.getByRole("button", { name: "Dragon Ball" }),
    ).toBeInTheDocument();
  },
};

/** Collections still loading, results ready. The count and grid show anyway. */
export const CollectionsLoadingResultsReady: Story = {
  args: { collections: { status: "loading" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("38")).toBeInTheDocument();
  },
};

/** Filters match nothing: the message and a clear-filters action, with the
 * sidebar and the current selection intact. */
export const NoMatch: Story = {
  args: {
    resultCount: "0",
    selection: SELECTION,
    results: {
      status: "empty",
      message: "No products match these filters.",
      action: { label: "Clear filters", onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  },
};

/** An empty catalog: a different message, and no clear-filters action. */
export const EmptyCatalog: Story = {
  args: {
    resultCount: "0",
    selection: {},
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
      canvas.getByRole("complementary", { name: "Store navigation" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Products" }),
    ).toBeInTheDocument();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
