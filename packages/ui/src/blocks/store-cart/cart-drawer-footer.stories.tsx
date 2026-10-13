import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CartDrawerFooter } from "./cart-drawer";
import { footerMeta } from "./cart-drawer-footer.story-fixtures";

/**
 * Order summary, compact promo row (opens nested sheet), points tender, and
 * checkout CTA (`4791:2773`).
 *
 * Enter/held-list UI lives on the nested `CartPromoSheet` hosted by
 * [`CartDrawer`](?path=/docs/store-cart-blocks-cartdrawer--docs) (or the nest host
 * in these stories). Shopper copy uses **promo code** only — never coupon.
 * `PromoState` `applied` is for order-level codes; a product coupon updates the
 * matching line’s `couponCode` / `price` instead — not a footer discount row.
 * A guest checks out with `onCheckout` unchanged: the consumer labels
 * `copy.checkoutButton` "Check Out as Guest", passes `pointsState={null}`,
 * and adds `onSignIn` for the quiet sign-in line under the button.
 *
 * The state matrix sits in the sibling folders: Promo Sheet covers the nested
 * sheet, Points the tender, Checkout the order discount and redirect states,
 * Interactive the member playground, and Guest the signed-out footer.
 */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter",
  component: CartDrawerFooter,
  tags: ["autodocs"],
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-in default: compact promo row + Use points (checkout is members-only) */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Subtotal")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Promo code")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Use points/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
  },
};
