import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ADJUSTED_ITEMS,
  ADJUSTED_SUBTOTAL,
  APPLIED_TOTAL,
  BOOSTER_NAME,
  CHARIZARD,
  POINTS_APPLIED,
  POINTS_BALANCE_LABEL,
  POINTS_COLLAPSED,
  POINTS_EXPANDED,
  READY_ITEMS,
  READY_SUBTOTAL,
  SOLD_OUT_ITEMS,
} from "../cart-content";
import { CartPanel, type CartPanelProps } from "../cart-panel";

const meta = {
  title: "Store/Cart/Flows/Cart Drawer",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;
type Check = (canvas: Canvas) => void;

/**
 * Walks each case in order through Next, asserts it, then opens Expanded and
 * counts the cart cards. `carts` is how many cases draw a cart.
 */
async function walkCases(
  canvasElement: HTMLElement,
  checks: readonly Check[],
  carts = checks.length,
) {
  const canvas = within(canvasElement);
  for (const [index, check] of checks.entries()) {
    if (index > 0) {
      await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    }
    check(canvas);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  expect(canvas.getAllByRole("heading", { name: "Cart" })).toHaveLength(carts);
}

/** The rate and balance share one line under the points field. */
const POINTS_RATE = "1 pt = HK$1";

const proceed = (canvas: Canvas) =>
  canvas.getByRole("button", { name: "Proceed to Checkout" });

const ready = (overrides: Partial<CartPanelProps> = {}): CartPanelProps => ({
  items: READY_ITEMS,
  subtotal: READY_SUBTOTAL,
  estimatedTotal: READY_SUBTOTAL,
  ...overrides,
});

/** US-01: the cart opens over the page with current facts and pictures. */
const OPEN_CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  ["Cart read on open", ready({ loading: true })],
  ["Current lines with pictures", ready()],
  [
    "Sold-out line still listed",
    {
      items: SOLD_OUT_ITEMS,
      subtotal: READY_SUBTOTAL,
      estimatedTotal: READY_SUBTOTAL,
    },
  ],
];

/** US-02: the shopper changes or removes lines after the shop checks them. */
const EDIT_CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  ["Reviewed lines", ready()],
  [
    "Low-stock line adjusted",
    {
      items: ADJUSTED_ITEMS,
      subtotal: ADJUSTED_SUBTOTAL,
      estimatedTotal: ADJUSTED_SUBTOTAL,
    },
  ],
  [
    "Line removed",
    {
      items: [CHARIZARD],
      subtotal: "HK$38,000.00",
      estimatedTotal: "HK$38,000.00",
    },
  ],
];

/** US-03: a line leads to the product the shopper picked. */
const PRODUCT_CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  ["Lines name their products", ready()],
  [
    "Product chosen from the cart",
    ready({
      notice: {
        title: "Product page",
        description: `Opens ${BOOSTER_NAME}`,
      },
    }),
  ],
];

/** US-04: the promo code and points rows show what this basket can take. */
const TENDER_CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  ["Tender rows collapsed", ready({ pointsState: POINTS_COLLAPSED })],
  ["Points balance and rate", ready({ pointsState: POINTS_EXPANDED })],
  ["No points offered", ready({ pointsState: null })],
];

/** US-05: points are applied against the reviewed cart and kept to checkout. */
const POINTS_CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  ["Points ready to apply", ready({ pointsState: POINTS_EXPANDED })],
  [
    "Points applied",
    ready({ pointsState: POINTS_APPLIED, estimatedTotal: APPLIED_TOTAL }),
  ],
  ["Points removed", ready({ pointsState: POINTS_COLLAPSED })],
];

/**
 * The drawer's parts in a card, not the portalled drawer. Each case is the
 * outcome the shopper sees at that step; Expanded lays them side by side.
 */
function renderCase(value: CartPanelProps) {
  return <CartPanel {...value} />;
}

/** US-01: the cart opens with a read of its lines, then current pictures. */
export const OpenOverThePage: Story = {
  parameters: { journeys: ["grade10-site-store-cart-drawer-US-01"] },
  render: () => (
    <FlowContainer
      cases={OPEN_CASES}
      description={
        <p>
          The cart reads its lines when it opens. Until that read answers, the
          lines and Proceed wait. Each line keeps its picture, and a sold-out
          line stays listed rather than vanishing.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(canvas.queryByText(BOOSTER_NAME)).not.toBeInTheDocument();
        expect(proceed(canvas)).toBeDisabled();
      },
      (canvas) => {
        expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
        expect(proceed(canvas)).toBeEnabled();
      },
      (canvas) => {
        expect(canvas.getByText("Sold Out")).toBeInTheDocument();
      },
    ]);
  },
};

/** US-02: the shopper edits the reviewed cart; a low-stock line says what changed. */
export const EditTheReviewedCart: Story = {
  parameters: { journeys: ["grade10-site-store-cart-drawer-US-02"] },
  render: () => (
    <FlowContainer
      cases={EDIT_CASES}
      description={
        <p>
          Quantity and removal use the drawer's own controls. A line the shop
          adjusted names the change, and removing a line leaves the rest of the
          reviewed cart in place.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
      },
      (canvas) => {
        expect(
          canvas.getByText("Low stock. Quantity adjusted"),
        ).toBeInTheDocument();
      },
      (canvas) => {
        expect(canvas.queryByText(BOOSTER_NAME)).not.toBeInTheDocument();
        expect(canvas.getByText(CHARIZARD.name)).toBeInTheDocument();
      },
    ]);
  },
};

/** US-03: a line takes the shopper to the product they picked from the cart. */
export const ContinueToAProduct: Story = {
  parameters: { journeys: ["grade10-site-store-cart-drawer-US-03"] },
  render: () => (
    <FlowContainer
      cases={PRODUCT_CASES}
      description={
        <p>
          Each line names its product and opens it. The product page is drawn on
          its own screen, so this flow stands in a notice for the step.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
      },
      (canvas) => {
        expect(canvas.getByText("Product page")).toBeInTheDocument();
      },
    ]);
  },
};

/** US-04: promo code and points rows show the choices the reviewed basket can take. */
export const ReadTenderChoices: Story = {
  parameters: { journeys: ["grade10-site-store-cart-drawer-US-04"] },
  render: () => (
    <FlowContainer
      cases={TENDER_CASES}
      description={
        <p>
          The tender rows show the points rate and balance once opened. A member
          with no points tender sees no points row at all. Held promo codes wait
          behind the promo code row.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(
          canvas.getByRole("button", { name: /Select or enter code/i }),
        ).toBeInTheDocument();
      },
      (canvas) => {
        expect(
          canvas.getByText(POINTS_RATE, { exact: false }),
        ).toBeInTheDocument();
        expect(
          canvas.getByText(POINTS_BALANCE_LABEL, { exact: false }),
        ).toBeInTheDocument();
      },
      (canvas) => {
        expect(
          canvas.queryByRole("button", { name: /Use points/i }),
        ).not.toBeInTheDocument();
      },
    ]);
  },
};

/** US-05: points are applied, shown in the summary, and removable before checkout. */
export const PointsBeforeCheckout: Story = {
  parameters: { journeys: ["grade10-site-store-cart-drawer-US-05"] },
  render: () => (
    <FlowContainer
      cases={POINTS_CASES}
      description={
        <p>
          Points are a draft against the reviewed cart. The applied credit shows
          in the summary, the estimate drops by it, and Remove takes it back.
          Nothing leaves the loyalty ledger until the order is paid.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(
          canvas.getByText(POINTS_RATE, { exact: false }),
        ).toBeInTheDocument();
      },
      (canvas) => {
        expect(canvas.getByText("−HK$120.00")).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Remove" }),
        ).toBeInTheDocument();
      },
      (canvas) => {
        expect(
          canvas.getByRole("button", { name: /Use points/i }),
        ).toBeInTheDocument();
      },
    ]);
  },
};
