import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  CartDrawerBody,
  CartDrawerFooter,
  CartDrawerHeader,
  type PointsState,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { STORE_CART_COPY } from "../../store-content";
import {
  CART_ITEMS,
  CART_SUBTOTAL,
  POINTS_BALANCE_LABEL,
} from "../loyalty-content";
import { type Check, walkCases } from "../loyalty-flow-walk";

type BasketStep = {
  pointsState: PointsState | null;
  estimatedTotal: string;
};

const noop = () => undefined;

/** The balance sits in one line with the points rate, so it is matched inside it. */
const POINTS_BALANCE_PATTERN = /You’ve 1,250 pts\./;

/** Points come off the bill after the cart's own lines, never the shipping. */
const BASKET_STEPS: ReadonlyArray<readonly [string, BasketStep]> = [
  [
    "Points offered against the balance",
    { pointsState: { status: "expanded" }, estimatedTotal: CART_SUBTOTAL },
  ],
  [
    "Points applied to part of the bill",
    {
      pointsState: { status: "applied", amountLabel: "−HK$500.00" },
      estimatedTotal: "HK$900.00",
    },
  ],
  [
    "Points removed, bill back to full",
    { pointsState: { status: "collapsed" }, estimatedTotal: CART_SUBTOTAL },
  ],
  [
    "Balance still loading, no points row",
    { pointsState: null, estimatedTotal: CART_SUBTOTAL },
  ],
];

const CHECKS: readonly Check[] = [
  (canvas) => {
    expect(canvas.getByText(POINTS_BALANCE_PATTERN)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
  },
  (canvas) => {
    expect(canvas.getByText("−HK$500.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$900.00")).toBeInTheDocument();
  },
  async (canvas) => {
    await waitFor(() =>
      expect(canvas.queryByText("−HK$500.00")).not.toBeInTheDocument(),
    );
    expect(canvas.getAllByText(CART_SUBTOTAL).length).toBeGreaterThan(0);
  },
  (canvas) => {
    expect(canvas.queryByText(POINTS_BALANCE_PATTERN)).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
  },
];

const meta = {
  title: "Loyalty/Paying With Points/Flows/Pay Part of a Basket",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function BasketStepCard({ pointsState, estimatedTotal }: BasketStep) {
  return (
    <VStack gap="md">
      <CartDrawerHeader
        copy={STORE_CART_COPY.header}
        itemCount={CART_ITEMS.length}
        onClose={noop}
      />
      <CartDrawerBody
        copy={STORE_CART_COPY.item}
        emptyDescription={STORE_CART_COPY.emptyDescription}
        emptyTitle={STORE_CART_COPY.emptyTitle}
        items={CART_ITEMS}
        onQuantityChange={noop}
        onRemoveItem={noop}
      />
      <CartDrawerFooter
        copy={STORE_CART_COPY.footer}
        estimatedTotal={estimatedTotal}
        onPointsStateChange={noop}
        onPromoStateChange={noop}
        pointsBalanceLabel={POINTS_BALANCE_LABEL}
        pointsState={pointsState}
        promoState={{ status: "collapsed" }}
        shippingEstimate={STORE_CART_COPY.footer.shippingValue}
        subtotal={CART_SUBTOTAL}
      />
    </VStack>
  );
}

/**
 * A member pays part of a basket with points, on the cart drawer's footer. The
 * points rate and balance show once opened, the applied amount comes off the
 * estimated total, and removing it puts the bill back. A balance still loading
 * leaves the points row out.
 */
export const PartOfBasket: Story = {
  parameters: {
    journeys: [
      "grade10-site-loyalty-programme-US-03",
      "grade10-site-store-membership-US-02",
    ],
  },
  render: () => (
    <FlowContainer
      cases={BASKET_STEPS}
      description={
        <p>
          Points pay for qualifying goods, never shipping or tax, and at most
          the bill after the site discounts and any code. The bill shows the
          points applied and the total they leave. Removing the points puts the
          full bill back, and nothing is debited until the order is paid.
        </p>
      }
    >
      {(value) => <BasketStepCard {...value} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    await walkCases(canvasElement, CHECKS, () => {
      expect(
        canvasElement.querySelectorAll('[data-slot="cart-drawer-footer"]'),
      ).toHaveLength(BASKET_STEPS.length);
    });
  },
};
