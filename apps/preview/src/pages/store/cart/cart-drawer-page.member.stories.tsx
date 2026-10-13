import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { STORE_CART_COPY } from "../../store-content";
import {
  ADJUSTED_ITEMS,
  APPLIED_TOTAL,
  BOOSTER_NAME,
  CART_REVIEW_FAILED,
  DELISTED_ITEMS,
  DELISTED_NAME,
  POINTS_APPLIED,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
  SITE_SALE_ITEMS,
  SITE_SALE_SUBTOTAL,
  SOLD_OUT_ITEMS,
  UNCHECKED_ITEMS,
  UNCHECKED_TOTAL,
} from "../cart-content";
import { CartDrawerPage, drawer } from "./cart-drawer-page";

/** The signed-in drawer: lines, the open-time read, discounts and checkout. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Member",
  component: CartDrawerPage,
  tags: ["autodocs"],
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

/** Signed-in cart with two lines, one pictured, and the tender rows collapsed. */
export const Items: Story = {
  play: () => {
    const canvas = drawer();
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    expect(canvas.getByRole("button", { name: /Use points/i })).toBeVisible();
  },
};

/** No lines: the design-system empty state, with no count badge and no footer. */
export const Empty: Story = {
  args: { items: [], subtotal: "HK$0.00", estimatedTotal: "HK$0.00" },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
  },
};

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

/** A delisted line is cleared by the open-time read; the rest stay and one toast names it. */
export const UnavailableLinesRemoved: Story = {
  args: { items: DELISTED_ITEMS, delistOnOpen: true },
  play: async () => {
    const body = within(document.body);
    await waitFor(
      () => {
        expect(body.getByText("Items removed from cart")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(body.queryByText(DELISTED_NAME)).not.toBeInTheDocument();
    expect(body.getByText(BOOSTER_NAME)).toBeInTheDocument();
  },
};

/** A line that sold out after it was added keeps its row, marked Sold Out, and leaves the count. */
export const SoldOutLine: Story = {
  args: { items: SOLD_OUT_ITEMS },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText("Sold Out")).toBeInTheDocument();
  },
};

/** The shop filled fewer than the shopper asked for: the line reads adjusted, with the warning. */
export const QuantityAdjusted: Story = {
  parameters: { journeys: ["grade10-site-store-checkout-US-02"] },
  args: {
    items: ADJUSTED_ITEMS,
    subtotal: "HK$40,400.00",
    estimatedTotal: "HK$40,400.00",
  },
  play: () => {
    const canvas = drawer();
    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
  },
};

/** Lines on the site sale show the sale price with the list price struck through. */
export const SiteSaleOnLines: Story = {
  args: {
    items: SITE_SALE_ITEMS,
    subtotal: SITE_SALE_SUBTOTAL,
    estimatedTotal: SITE_SALE_SUBTOTAL,
  },
  play: () => {
    const canvas = drawer();
    expect(canvas.getAllByText("HK$960.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,200.00").length).toBeGreaterThan(0);
  },
};

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

/** Narrow viewport: the drawer takes the phone width and the lines stay readable. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
  },
};
