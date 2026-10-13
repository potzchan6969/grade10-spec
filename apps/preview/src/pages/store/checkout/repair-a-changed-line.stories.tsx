import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  ADJUSTED_ITEMS,
  ADJUSTED_SUBTOTAL,
  BOOSTER,
  CHARIZARD,
  READY_ITEMS,
  READY_SUBTOTAL,
} from "../cart-content";
import { CartPanel, type CartPanelProps } from "../cart-panel";

const meta = {
  title: "Store/Checkout/Flows/Repair A Changed Line",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, CartPanelProps]> = [
  [
    "Cart ready to pay",
    {
      items: READY_ITEMS,
      subtotal: READY_SUBTOTAL,
      estimatedTotal: READY_SUBTOTAL,
    },
  ],
  [
    "Changed line named",
    {
      items: ADJUSTED_ITEMS,
      subtotal: ADJUSTED_SUBTOTAL,
      estimatedTotal: ADJUSTED_SUBTOTAL,
      checkoutDisabled: true,
    },
  ],
  [
    "Line repaired",
    {
      items: [{ ...BOOSTER, quantity: 1, maxQuantity: 1 }, CHARIZARD],
      subtotal: READY_SUBTOTAL,
      estimatedTotal: READY_SUBTOTAL,
    },
  ],
];

/**
 * Checkout names a line the shop changed before the shopper pays. Pay waits
 * until the line is repaired; the other lines stay as they were.
 */
export const Default: Story = {
  parameters: { journeys: ["grade10-site-store-checkout-US-02"] },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A changed line is named in the cart, and Proceed to Checkout stays
          disabled until the shopper fixes it. Once repaired, the cart is ready
          to pay again with its other lines unchanged.
        </p>
      }
    >
      {(value) => <CartPanel {...value} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = () =>
      userEvent.click(canvas.getByRole("button", { name: "Next" }));

    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    await next();

    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
    await next();

    expect(
      canvas.queryByText("Low stock. Quantity adjusted"),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByRole("heading", { name: "Cart" })).toHaveLength(3);
  },
};
