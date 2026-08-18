import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  CHIP_FILTERS,
  FILTER_GROUPS,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECT_FILTERS,
  SELECTION,
  SORT_OPTIONS,
} from "./fixtures";
import { ProductBrowse } from "./product-browse";

const meta = {
  title: "Store Product Listing/ProductBrowse",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    filters: { status: "ready", data: FILTER_GROUPS },
    filterPanelLabel: "Filters",
    selection: {
      collection: ["pokemon"],
      sets: ["m4"],
      availability: ["in-stock"],
    },
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
  args: { filters: { status: "loading" }, results: { status: "loading" } },
};

/** Results failed, filters stand. The panel is still usable — the two
 * boundaries resolve independently. */
export const ResultsErrorFiltersReady: Story = {
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
    expect(canvas.getByRole("checkbox", { name: /Box/ })).toBeInTheDocument();
  },
};

/** Filters still loading, results ready. The count and grid show anyway. */
export const FiltersLoadingResultsReady: Story = {
  args: { filters: { status: "loading" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("38")).toBeInTheDocument();
  },
};

/** Filters match nothing: the message and a clear-filters action, with the
 * panel and the current selection intact. */
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
    expect(canvas.getByRole("checkbox", { name: /Box/ })).toBeChecked();
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

/** The filter panel is a complementary landmark and the results a named
 * region, so the surface is navigable by landmark. */
export const Landmarks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("complementary", { name: "Filters" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Products" }),
    ).toBeInTheDocument();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
