import { ProductBrowse } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PRODUCTS,
  SORT_OPTIONS,
  sortTriggerLabel,
} from "../../store-content";
import { PRODUCT_LIST_COPY } from "./product-list-content";

const meta = {
  title: "Store/Product Listing/Flows/Product Listing",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const APPLIED = appliedFiltersFromSelection(FILTER_GROUPS, INITIAL_SELECTION);

/** The listing's copy, as the store page supplies it to the browse compound. */
const BROWSE_COPY = {
  filterPanel: {
    label: "Store filters",
    heading: "Filter",
    searchPlaceholder: "Find product",
    searchLabel: "Search products",
    drawerClear: "Clear",
    showResults: "Show Results",
  },
  listHeader: {
    sortTrigger: sortTriggerLabel("new"),
    clearFilters: PRODUCT_LIST_COPY.clearFilters,
  },
  results: {
    label: "Products",
    card: {
      cart: "Add to cart",
      decreaseQuantity: "Decrease quantity",
      increaseQuantity: "Increase quantity",
      removeFromCart: "Remove from cart",
      adjustQuantity: "Adjust cart quantity",
      soldOut: "SOLD OUT",
      sale: "SALE",
    },
  },
};

const READY_GROUPS = { status: "ready", data: FILTER_GROUPS } as const;

/** The listing as one step of a journey: the browse compound with the step's results. */
function ListingStep({
  appliedFilters = APPLIED,
  hasMore = false,
  loadingMore = false,
  results,
  resultCount,
  selection = INITIAL_SELECTION,
}: {
  appliedFilters?: typeof APPLIED;
  hasMore?: boolean;
  loadingMore?: boolean;
  results: Parameters<typeof ProductBrowse>[0]["results"];
  resultCount: string;
  selection?: typeof INITIAL_SELECTION;
}) {
  return (
    <ProductBrowse
      appliedFilters={appliedFilters}
      copy={BROWSE_COPY}
      groups={READY_GROUPS}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onClearFilters={fn()}
      onFilterChange={fn()}
      onLoadMore={fn()}
      onProductClick={fn()}
      onSortChange={fn()}
      resultCount={resultCount}
      results={results}
      selection={selection}
      sortOptions={SORT_OPTIONS}
      sortValue="new"
    />
  );
}

const READY_RESULTS = {
  status: "ready",
  data: PRODUCTS,
} as const;

const OPEN_CASES: [string, "rest" | "loading" | "empty"][] = [
  ["Listing at rest", "rest"],
  ["Results loading", "loading"],
  ["Store with no products", "empty"],
];

function OpenStep({ step }: { step: "rest" | "loading" | "empty" }) {
  if (step === "loading") {
    return (
      <ListingStep
        appliedFilters={[]}
        resultCount="100 Products"
        results={{ status: "loading" }}
        selection={{}}
      />
    );
  }
  if (step === "empty") {
    return (
      <ListingStep
        appliedFilters={[]}
        resultCount="0 Products"
        results={{
          status: "empty",
          message: PRODUCT_LIST_COPY.emptyCatalogue,
        }}
        selection={{}}
      />
    );
  }
  return (
    <ListingStep
      appliedFilters={[]}
      resultCount="100 Products"
      results={READY_RESULTS}
      selection={{}}
    />
  );
}

const NARROW_CASES: [string, "narrowed" | "no-match"][] = [
  ["Narrowed to booster boxes", "narrowed"],
  ["Narrowing matches nothing", "no-match"],
];

function NarrowStep({ step }: { step: "narrowed" | "no-match" }) {
  if (step === "no-match") {
    return (
      <ListingStep
        resultCount="0 Products"
        results={{
          status: "empty",
          message: PRODUCT_LIST_COPY.noMatch,
          action: { label: PRODUCT_LIST_COPY.clearFilters, onAction: fn() },
        }}
      />
    );
  }
  return (
    <ListingStep
      resultCount={`${PRODUCTS.length} Products`}
      results={READY_RESULTS}
    />
  );
}

const PAGE_CASES: [string, "first" | "loading-more" | "last"][] = [
  ["First page", "first"],
  ["Next page loading", "loading-more"],
  ["Last page", "last"],
];

function PageStep({ step }: { step: "first" | "loading-more" | "last" }) {
  if (step === "loading-more") {
    return (
      <ListingStep
        hasMore
        loadingMore
        resultCount="100 Products"
        results={READY_RESULTS}
      />
    );
  }
  return (
    <ListingStep
      hasMore={step === "first"}
      resultCount="100 Products"
      results={READY_RESULTS}
    />
  );
}

/** A collector opens the listing at its address and sees its state at rest, while loading, or with no products. */
export const OpenTheListing: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-product-listing-US-01",
      "grade10-site-store-product-listing-US-09",
    ],
  },
  render: () => (
    <FlowContainer
      cases={OPEN_CASES}
      description={
        <p>
          The listing opens ordered by latest product, with no narrowing, the
          count and the grid. While results load the list says so. A store with
          no products says so once, with no clear-filters action.
        </p>
      }
    >
      {(step) => <OpenStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
    expect(canvas.queryAllByText(/latest product/i).length).toBeGreaterThan(0);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("region", { name: "Products" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(PRODUCT_LIST_COPY.emptyCatalogue)).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      OPEN_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A collector narrows the catalogue to what they collect, and a narrowing that matches nothing says so. */
export const NarrowTheCatalogue: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-product-listing-US-04",
      "grade10-site-store-product-listing-US-08",
    ],
  },
  render: () => (
    <FlowContainer
      cases={NARROW_CASES}
      description={
        <p>
          Each applied narrowing shows as a chip and the count says how many
          products it leaves. A narrowing that matches nothing says so and
          offers Clear filters, with the sidebar and the chosen filters left as
          they are.
        </p>
      }
    >
      {(step) => <NarrowStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(`${PRODUCTS.length} Products`)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(PRODUCT_LIST_COPY.noMatch)).toBeVisible();
    expect(
      canvas.getByRole("button", { name: PRODUCT_LIST_COPY.clearFilters }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      NARROW_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A collector reads past the first page: more loads on request, and the last page says there is no more. */
export const ReadPastTheFirstPage: Story = {
  parameters: {
    journeys: ["grade10-site-store-product-listing-US-07"],
  },
  render: () => (
    <FlowContainer
      cases={PAGE_CASES}
      description={
        <p>
          More products load below the grid while the next page is read, and the
          grid keeps the products already shown. The last page offers no further
          load.
        </p>
      }
    >
      {(step) => <PageStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sentinel = () =>
      canvasElement.querySelector(
        '[data-slot="product-results-load-sentinel"]',
      );
    expect(canvas.getByRole("region", { name: "Products" })).toBeVisible();
    expect(sentinel()).not.toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("region", { name: "Products" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(sentinel()).toBeNull();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      PAGE_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};
