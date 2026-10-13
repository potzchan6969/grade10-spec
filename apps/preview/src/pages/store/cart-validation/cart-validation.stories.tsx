import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ADJUSTED_ITEMS,
  ADJUSTED_SUBTOTAL,
  BOOSTER,
  CHARIZARD,
  CHARIZARD_NAME,
  DELISTED_NAME,
  READY_ITEMS,
  READY_SUBTOTAL,
  SOLD_OUT_ITEMS,
  UNCHECKED_ITEMS,
  UNCHECKED_TOTAL,
} from "../cart-content";
import {
  CartPanel,
  type CartPanelNotice,
  type CartPanelProps,
} from "../cart-panel";
import {
  CHECKOUT_CHANGED,
  PRICE_CHANGED,
  REVIEW_CANNOT_FINISH,
  SHOP_REFUSED,
  SHORT_FILL,
  WITHDRAWN,
} from "./cart-validation-content";

const meta = {
  title: "Store/Cart Validation/Flows/Cart Validation",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;
type Check = (canvas: Canvas) => void;

/** Walks each case in order through Next, then counts the cart cards in Expanded. */
async function walkCases(canvasElement: HTMLElement, checks: readonly Check[]) {
  const canvas = within(canvasElement);
  for (const [index, check] of checks.entries()) {
    if (index > 0) {
      await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    }
    check(canvas);
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  expect(canvas.getAllByRole("heading", { name: "Cart" })).toHaveLength(
    checks.length,
  );
}

const proceed = (canvas: Canvas) =>
  canvas.getByRole("button", { name: "Proceed to Checkout" });

const totals = (value: string) => ({ subtotal: value, estimatedTotal: value });

/** Draft retry action on a notice; the drawer block has no retry of its own. */
const RETRY: CartPanelNotice = {
  title: REVIEW_CANNOT_FINISH.title,
  description: REVIEW_CANNOT_FINISH.description,
  action: (
    <Button size="sm" variant="outline">
      {REVIEW_CANNOT_FINISH.retry}
    </Button>
  ),
};

const renderCase = (value: CartPanelProps) => <CartPanel {...value} />;

/**
 * US-01: as the cart opens, it names what moved: a sold-out line, a changed
 * price, a withdrawn product. The shopper fixes the cart before paying.
 */
export const LearnWhatMoved: Story = {
  parameters: { journeys: ["grade10-site-store-cart-validation-US-01"] },
  render: () => (
    <FlowContainer
      cases={[
        [
          "Cart opens on current prices",
          { items: READY_ITEMS, ...totals(READY_SUBTOTAL) },
        ],
        ["Line sold out", { items: SOLD_OUT_ITEMS, ...totals(READY_SUBTOTAL) }],
        [
          "Line price changed",
          {
            items: [BOOSTER, { ...CHARIZARD, price: "HK$36,000.00" }],
            ...totals("HK$37,200.00"),
            notice: PRICE_CHANGED,
          },
        ],
        [
          "Withdrawn product removed",
          {
            items: [BOOSTER, CHARIZARD],
            ...totals(READY_SUBTOTAL),
            notice: WITHDRAWN,
          },
        ],
      ]}
      description={
        <p>
          The cart reads the shop when it opens. A sold-out line stays listed
          and marked; a changed price shows the new price; a withdrawn product
          leaves the cart with one notice naming it. The notices are stand-ins
          where the drawer block does not say the words yet.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(proceed(canvas)).toBeEnabled();
      },
      (canvas) => {
        expect(canvas.getByText("Sold Out")).toBeInTheDocument();
      },
      (canvas) => {
        expect(canvas.getByText(PRICE_CHANGED.title)).toBeInTheDocument();
        expect(canvas.getByText("HK$36,000.00")).toBeInTheDocument();
      },
      (canvas) => {
        expect(canvas.queryByText(DELISTED_NAME)).not.toBeInTheDocument();
        expect(canvas.getByText(WITHDRAWN.title)).toBeInTheDocument();
      },
    ]);
  },
};

/**
 * US-02: checkout checks every line once more. Lines that moved are named and
 * block Proceed; a review that cannot finish holds each line unchecked.
 */
export const OfferTheCartForCheckout: Story = {
  parameters: { journeys: ["grade10-site-store-cart-validation-US-02"] },
  render: () => (
    <FlowContainer
      cases={[
        [
          "Review confirms every line",
          { items: READY_ITEMS, ...totals(READY_SUBTOTAL) },
        ],
        [
          "Line moved at checkout",
          {
            items: ADJUSTED_ITEMS,
            ...totals(ADJUSTED_SUBTOTAL),
            checkoutDisabled: true,
            notice: CHECKOUT_CHANGED,
          },
        ],
        [
          "Review cannot finish",
          {
            items: UNCHECKED_ITEMS,
            ...totals(UNCHECKED_TOTAL),
            checkoutDisabled: true,
            notice: RETRY,
          },
        ],
      ]}
      description={
        <p>
          Checkout reads each line again. A line that moved names itself and
          holds Proceed. When the review cannot finish, every line reads as
          unchecked and Retry is offered, and Proceed stays off.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(proceed(canvas)).toBeEnabled();
      },
      (canvas) => {
        expect(proceed(canvas)).toBeDisabled();
        expect(canvas.getByText(CHECKOUT_CHANGED.title)).toBeInTheDocument();
      },
      (canvas) => {
        expect(proceed(canvas)).toBeDisabled();
        expect(
          canvas.getByRole("button", { name: "Retry" }),
        ).toBeInTheDocument();
      },
    ]);
  },
};

/**
 * US-03: the shop refuses a line the store's own review passed. The refused
 * line is named, the cart is read again, and a short fill reads adjusted.
 */
export const MeetTheShopsRefusal: Story = {
  parameters: { journeys: ["grade10-site-store-cart-validation-US-03"] },
  render: () => (
    <FlowContainer
      cases={[
        [
          "Shop refuses a line",
          {
            items: SOLD_OUT_ITEMS,
            ...totals(READY_SUBTOTAL),
            checkoutDisabled: true,
            notice: {
              title: SHOP_REFUSED.title,
              description: `${SHOP_REFUSED.description} ${CHARIZARD_NAME}`,
            },
          },
        ],
        [
          "Line filled short",
          {
            items: ADJUSTED_ITEMS,
            ...totals(ADJUSTED_SUBTOTAL),
            notice: SHORT_FILL,
          },
        ],
      ]}
      description={
        <p>
          A refusal from the shop names the line it refused and keeps the cart
          open to resolve. A line the shop filled short reads adjusted at the
          shop's count.
        </p>
      }
    >
      {renderCase}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, [
      (canvas) => {
        expect(canvas.getByText(SHOP_REFUSED.title)).toBeInTheDocument();
        expect(proceed(canvas)).toBeDisabled();
      },
      (canvas) => {
        expect(canvas.getByText(SHORT_FILL.title)).toBeInTheDocument();
        expect(
          canvas.getByText("Low stock. Quantity adjusted"),
        ).toBeInTheDocument();
      },
    ]);
  },
};
