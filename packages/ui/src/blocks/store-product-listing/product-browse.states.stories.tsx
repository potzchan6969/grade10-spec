import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { ProductBrowse } from "./product-browse";
import {
  APPLIED_FILTERS,
  InteractiveProductBrowse,
  productBrowseArgs,
  SELECTION,
} from "./product-browse.story-shared";

const meta = {
  title: "Store Product Listing/ProductBrowse/States",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => <InteractiveProductBrowse {...args} />,
  args: {
    ...productBrowseArgs,
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    onClearFilters: fn(),
    onLoadMore: fn(),
    onProductClick: fn(),
    onProductCartQuantityChange: fn(),
  },
} satisfies Meta<typeof ProductBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both regions loading. */
export const Loading: Story = {
  args: {
    groups: { status: "loading" },
    results: { status: "loading" },
  },
};

/** Results failed, sidebar stands. The two boundaries resolve independently. */
export const ResultsError: Story = {
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
export const GroupsLoading: Story = {
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
