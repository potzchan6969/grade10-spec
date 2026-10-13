import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { OrderHistory } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { READY_ITEMS, READY_SUBTOTAL } from "../cart-content";
import { CartPanel, type CartPanelProps } from "../cart-panel";
import {
  ORDER_HISTORY_COPY,
  SETTLING_ORDERS,
  SHOPIFY_CONFIRMATION,
} from "./checkout-content";

const meta = {
  title: "Store/Checkout/Flows/Pay For The Cart",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;
type PayStep =
  | { view: "cart"; panel: CartPanelProps }
  | { view: "confirmation" }
  | { view: "orders" };

const READY: CartPanelProps = {
  items: READY_ITEMS,
  subtotal: READY_SUBTOTAL,
  estimatedTotal: READY_SUBTOTAL,
};

const STEPS: ReadonlyArray<readonly [string, PayStep]> = [
  ["Cart Drawer ready", { view: "cart", panel: READY }],
  ["Pay pending", { view: "cart", panel: { ...READY, startCheckout: true } }],
  ["Shopify confirmation", { view: "confirmation" }],
  ["Your Orders", { view: "orders" }],
];

/** Stand-in for the Shopify return page; the real one is Shopify's extension. */
function ShopifyConfirmation() {
  return (
    <VStack gap="md">
      <Text size="lg" weight="bold">
        {SHOPIFY_CONFIRMATION.title}
      </Text>
      <Text size="sm">{SHOPIFY_CONFIRMATION.body}</Text>
      <Button variant="outline">{SHOPIFY_CONFIRMATION.action}</Button>
    </VStack>
  );
}

function renderStep(step: PayStep) {
  if (step.view === "cart") return <CartPanel {...step.panel} />;
  if (step.view === "confirmation") return <ShopifyConfirmation />;
  return (
    <OrderHistory
      copy={ORDER_HISTORY_COPY}
      activeOrders={SETTLING_ORDERS}
      onTrackOrder={() => undefined}
      onViewDetails={() => undefined}
      onShopNow={() => undefined}
    />
  );
}

/**
 * Pay sends the reviewed cart to Shopify once. A second Pay does nothing while
 * the first waits, and the paid order shows in Your Orders while it settles.
 */
export const Default: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-checkout-US-01",
      "grade10-site-store-checkout-US-03",
      "grade10-site-store-checkout-US-05",
      "grade10-site-store-cart-drawer-US-06",
    ],
  },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          The reviewed cart goes to Shopify with its tender. Pay holds one
          pending request at a time. The Shopify return is a stand-in in this
          flow, and Your Orders shows the order as processing while it settles.
        </p>
      }
    >
      {renderStep}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas: Canvas = within(canvasElement);
    const next = () =>
      userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    await next();

    expect(
      await canvas.findByRole("button", { name: "Redirecting..." }),
    ).toBeDisabled();
    await next();

    expect(canvas.getByText(SHOPIFY_CONFIRMATION.title)).toBeInTheDocument();
    await next();

    expect(
      canvas.getByRole("heading", { name: "Active Orders" }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByRole("heading", { name: "Cart" })).toHaveLength(2);
  },
};
