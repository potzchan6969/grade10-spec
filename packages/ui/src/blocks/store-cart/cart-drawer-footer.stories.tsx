import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartDrawerFooter } from "./cart-drawer";
import { DEFAULT_CART_COPY } from "./fixtures";
import type { PromoState } from "./types";

const container: Decorator[] = [
  (Story) => (
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar">
      <Story />
    </div>
  ),
];

/**
 * Order summary, collapsible promo code redemption, and checkout CTA (`4791:2773`).
 *
 * Owns promo axes, checkout redirecting, and amount bones. Composed drawer flows
 * live on [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs).
 *
 * States:
 * - `promo=default` (`4735:6284`): Collapsed promo code trigger.
 * - `promo=expanded` (`4791:2731`): Text input with Apply button.
 * - `promo=error` (`4791:2745`): Error status with inline validation message.
 * - `promo=success` (`4791:2759`): Applied discount line item with Remove button.
 * - Checkout: enabled CTA → loading “Redirecting…” via `onCheckout` (app owns Shopify redirect).
 */
const meta = {
  title: "Store Cart/CartDrawerFooter",
  component: CartDrawerFooter,
  tags: ["autodocs"],
  decorators: container,
  args: {
    subtotal: "HK$42,700.00",
    estimatedTotal: "HK$42,700.00",
    shippingEstimate: "TBD",
    promoState: { status: "collapsed" },
    copy: DEFAULT_CART_COPY.footer,
    onPromoStateChange: fn(),
    onApplyPromo: fn(),
    onRemovePromo: fn(),
    onCheckout: fn(),
  },
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default collapsed promo code state (`4735:6284`) */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Subtotal")).toBeInTheDocument();
    expect(canvas.getByText("Shipping")).toBeInTheDocument();
    expect(canvas.getByText("Estimated Total")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Use promo code/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
  },
};

/** Expanded promo input state (`4791:2731`) */
export const PromoExpanded: Story = {
  args: {
    promoState: { status: "expanded" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByPlaceholderText("Enter promo code")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Apply" })).toBeDisabled();
  },
};

/** Promo code error state with inline message (`4791:2745`) */
export const PromoError: Story = {
  args: {
    promoState: {
      status: "expanded",
      error: "This promo code is invalid",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This promo code is invalid")).toBeInTheDocument();
  },
};

/** Promo code applied successfully with discount amount and remove button (`4791:2759`) */
export const PromoAppliedSuccess: Story = {
  args: {
    promoState: {
      status: "applied",
      code: "GRADE10",
      discountAmount: "-HK$4,270.00",
    },
    estimatedTotal: "HK$38,430.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (GRADE10)")).toBeInTheDocument();
    expect(canvas.getByText("-HK$4,270.00")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  },
};

/** Full interactive flow for expanding, submitting invalid, and applying promo code.
 * Try `SAVE10` (applies) or any other code (error). */
export const Interactive: Story = {
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    const [total, setTotal] = useState("HK$42,700.00");

    return (
      <CartDrawerFooter
        {...args}
        estimatedTotal={total}
        promoState={promo}
        onPromoStateChange={setPromo}
        onRemovePromo={() => {
          setPromo({ status: "collapsed" });
          setTotal("HK$42,700.00");
        }}
        onApplyPromo={(code) => {
          if (code.toUpperCase() === "SAVE10") {
            setPromo({
              status: "applied",
              code: "SAVE10",
              discountAmount: "-HK$4,270.00",
            });
            setTotal("HK$38,430.00");
            return true;
          }
          setPromo({
            status: "expanded",
            error: "This promo code is invalid",
          });
          return false;
        }}
      />
    );
  },
};

/** Boneyard skeleton loading state for summary amounts during fetching */
export const Loading: Story = {
  args: {
    loading: true,
    promoState: {
      status: "applied",
      code: "GRADE10",
      discountAmount: "-HK$4,270.00",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
  },
};

/** Checkout CTA pending redirect (e.g. Shopify) — click Proceed to see Redirecting… */
export const CheckoutRedirecting: Story = {
  render: (args) => (
    <CartDrawerFooter {...args} onCheckout={() => new Promise(() => {})} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    expect(
      canvas.getByRole("button", { name: "Redirecting..." }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Redirecting..." }),
    ).toBeDisabled();
  },
};
