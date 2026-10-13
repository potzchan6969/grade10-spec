import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_CART_COPY } from "../../store-content";
import {
  APPLIED_TOTAL,
  POINTS_APPLIED,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
} from "../cart-content";
import { CartDrawerPage, drawer } from "./cart-drawer-page";

/** The signed-in drawer's tender and checkout: points, the gate, the redirect. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Member/Checkout",
  component: CartDrawerPage,
  parameters: { layout: "fullscreen" },
  args: {
    items: READY_ITEMS,
    subtotal: READY_SUBTOTAL,
    estimatedTotal: READY_SUBTOTAL,
    pointsState: POINTS_COLLAPSED,
  },
} satisfies Meta<typeof CartDrawerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Points applied: the credit shows in the summary with Remove, and the estimate drops by it. */
export const PointsApplied: Story = {
  args: { pointsState: POINTS_APPLIED, estimatedTotal: APPLIED_TOTAL },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText("−HK$120.00")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  },
};

/**
 * Verification required: Proceed to Checkout is disabled. The drawer block has
 * no verification copy or gate yet, so this shows the disabled checkout only.
 */
export const VerificationRequired: Story = {
  args: { checkoutDisabled: true },
  play: () => {
    const canvas = drawer();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
  },
};

/** Proceed starts the hosted-payment redirect and holds the Redirecting label —
 * paying from the drawer, one request at a time. */
export const CheckoutRedirecting: Story = {
  args: { checkout: "pending" },
  parameters: {
    journeys: [
      "grade10-site-store-checkout-US-01",
      "grade10-site-store-checkout-US-05",
      "grade10-site-store-cart-drawer-US-06",
    ],
  },
  play: async () => {
    const canvas = drawer();
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: "Redirecting..." }),
      ).toBeDisabled();
    });
  },
};

/** The redirect fails: the button restores and a toast says checkout did not open. */
export const CheckoutFailed: Story = {
  args: { checkout: "failed" },
  play: async () => {
    const canvas = drawer();
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: "Proceed to Checkout" }),
      ).toBeEnabled();
    });
    expect(
      within(document.body).getByText(STORE_CART_COPY.footer.checkoutFailed),
    ).toBeInTheDocument();
  },
};
