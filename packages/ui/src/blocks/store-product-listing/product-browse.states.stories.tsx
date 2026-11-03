import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { ProductBrowse } from "./product-browse";
import {
  APPLIED_FILTERS,
  InteractiveProductBrowse,
  productBrowseArgs,
  SELECTION,
} from "./product-browse.story-shared";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Store/Product Listing/Blocks/ProductBrowse/States",
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
  parameters: {
    verification: { caseId: "vc_5c38f483-1f43-4101-b1f7-1f50857ba462" },
  },
  args: {
    groups: { status: "loading" },
    results: { status: "loading" },
  },
};

/** Results failed, sidebar stands. The two boundaries resolve independently. */
export const ResultsError: Story = {
  parameters: {
    verification: { caseId: "vc_a7b5fefa-55d8-4e41-b95b-e973894df324" },
  },
  args: {
    results: {
      status: "error",
      message: "We could not load these products.",
      action: { label: common.retry, onAction: fn() },
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
  parameters: {
    verification: { caseId: "vc_c88b66b9-d879-45e2-84ea-c0b856528bfe" },
  },
  args: { groups: { status: "loading" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
  },
};

/** Filters match nothing: the message and a clear-filters action, with the
 * sidebar and the current selection intact. */
export const NoMatch: Story = {
  parameters: {
    verification: { caseId: "vc_3aceba99-49c5-46d6-9b00-b711b12345ad" },
  },
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
  parameters: {
    verification: { caseId: "vc_b3073114-a33e-4987-81aa-ed3c1c18fd8e" },
  },
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
  parameters: {
    verification: { caseId: "vc_af2f3e7a-7c37-407d-8263-5523ca45e201" },
  },
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
  parameters: {
    verification: { caseId: "vc_cf05a37a-4dc3-4930-a9f5-4b36b66de1ca" },
  },
  args: { hasMore: false },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector(
        '[data-slot="product-results-load-sentinel"]',
      ),
    ).not.toBeInTheDocument();
  },
};
