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
import { CartDrawerPage } from "./cart-drawer-page";
import { drawer } from "./cart-drawer-page.test-helpers";

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
  parameters: {
    verification: { caseId: "vc_e70f5d90-acae-460a-a66b-fe9c22892b89" },
  },
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
  parameters: {
    verification: { caseId: "vc_3226ff37-9ad2-4ce1-b431-e6f2b05a3aff" },
  },
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
    verification: { caseId: "vc_3a4a7d30-93d0-48c3-a22f-924dedac6eee" },
    journeys: [
      "grade10-site-store-checkout-US-01",
      "g10.store-cart-drawer.US6",
      "g10.store-cart-drawer.US7",
      "g10.store-cart-drawer.US9",
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
      ).toHaveAttribute("aria-busy", "true");
    });
  },
};

/** The redirect fails: the button restores and a toast says checkout did not open. */
export const CheckoutFailed: Story = {
  parameters: {
    verification: { caseId: "vc_2a4fa0b5-f9a1-431b-8cf9-e7c00cc186e6" },
  },
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
