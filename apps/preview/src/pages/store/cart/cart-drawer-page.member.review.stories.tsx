import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  BOOSTER_NAME,
  CART_REVIEW_FAILED,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
  UNCHECKED_ITEMS,
  UNCHECKED_TOTAL,
} from "../cart-content";
import { CartDrawerPage, drawer } from "./cart-drawer-page";

/** The open-time read of the cart: still running, or failed with Retry. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Member/Review",
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

/** The open-time read is still running: lines are skeletons and Proceed waits. */
export const PendingReview: Story = {
  args: { loading: true },
  play: () => {
    const canvas = drawer();
    expect(canvas.queryByText(BOOSTER_NAME)).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
  },
};

/**
 * The open-time review cannot finish: each line is named as unchecked, the
 * totals say so, and a persistent toast offers Retry. Checkout waits.
 */
export const ReviewFailedWithRetry: Story = {
  args: {
    items: UNCHECKED_ITEMS,
    subtotal: UNCHECKED_TOTAL,
    estimatedTotal: UNCHECKED_TOTAL,
    checkoutDisabled: true,
    reviewFailed: true,
  },
  play: async () => {
    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });
    expect(body.getByText(CART_REVIEW_FAILED.title)).toBeInTheDocument();
    expect(
      body.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
  },
};
