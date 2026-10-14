import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  FooterWithPromoNest,
  footerMeta,
} from "./cart-drawer-footer.story-fixtures";
import {
  DEFAULT_CART_COPY,
  follows,
  orderDiscountRows,
  SAMPLE_HELD_PROMO_CODES,
  STORY_ORDER_DISCOUNT,
  storyPromoLabel,
} from "./fixtures";
import type { PromoState } from "./types";

/** Order discounts and the checkout redirect states. */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter/Checkout",
  component: CartDrawerFooter,
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Order-class site discount — its own row after Subtotal, no Remove */
export const OrderDiscount: Story = {
  args: {
    orderDiscounts: [STORY_ORDER_DISCOUNT],
    estimatedTotal: "HK$38,430.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [row] = orderDiscountRows(canvasElement);
    expect(within(row).getByText(STORY_ORDER_DISCOUNT.label)).toBeVisible();
    expect(within(row).getByText(STORY_ORDER_DISCOUNT.amount)).toBeVisible();
    expect(within(row).queryByRole("button")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
    expect(follows(canvas.getByText("Subtotal"), row)).toBe(true);
    expect(
      follows(
        row,
        canvas.getByRole("button", { name: /Select or enter code/i }),
      ),
    ).toBe(true);
  },
};

/** Order discount, then the applied code and points — only those two remove */
export const OrderDiscountWithPromoAndPoints: Story = {
  args: {
    orderDiscounts: [STORY_ORDER_DISCOUNT],
    promoState: {
      status: "applied",
      label: storyPromoLabel("WELCOME100"),
      discountAmount: "−HK$100.00",
    },
    pointsState: { status: "applied", amountLabel: "−HK$120.00" },
    estimatedTotal: "HK$38,210.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [row] = orderDiscountRows(canvasElement);
    expect(within(row).queryByRole("button")).not.toBeInTheDocument();
    expect(canvas.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
    expect(follows(row, canvas.getByText("Discount (WELCOME100)"))).toBe(true);
    expect(canvas.getByText("HK$38,210.00")).toBeInTheDocument();
  },
};

/** Boneyard skeleton loading state for summary amounts during fetching */
export const Loading: Story = {
  args: {
    loading: true,
    promoState: {
      status: "applied",
      label: storyPromoLabel("GRADE10"),
      discountAmount: "−HK$4,270.00",
    },
    pointsState: {
      status: "applied",
      amountLabel: "−HK$500.00",
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
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** The consumer owns checkout: its pending draws the button busy, and a press does nothing more */
export const CheckoutPending: Story = {
  args: { checkoutPending: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Redirecting..." });
    expect(button).toHaveAttribute("aria-busy", "true");
    button.click();
    expect(args.onCheckout).not.toHaveBeenCalled();
  },
};

/** The consumer's refusal shows under the button, which is pressable again */
export const CheckoutRefused: Story = {
  args: {
    checkoutPending: false,
    checkoutFailed: "Couldn’t open checkout. Try again.",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Proceed to Checkout" });
    const alert = canvas.getByRole("alert");
    expect(alert).toHaveTextContent("Couldn’t open checkout. Try again.");
    expect(button).toHaveAttribute("aria-describedby", alert.id);
    await userEvent.click(button);
    expect(args.onCheckout).toHaveBeenCalledTimes(1);
  },
};

/** Checkout redirect fails — button restores and a toast explains the error */
export const CheckoutFailed: Story = {
  render: (args) => (
    <>
      <Toast position="bottom-right" />
      <CartDrawerFooter
        {...args}
        onCheckout={async () => {
          throw new Error("Shopify session failed");
        }}
      />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: "Proceed to Checkout" }),
      ).toBeEnabled();
    });
    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByText("Couldn’t open checkout")).toBeInTheDocument();
    });
  },
};

/** Read-only tender context keeps eligibility facts while omitting mutations. */
export const ReadOnlyTenderContext: Story = {
  render: () => {
    const promo: PromoState = { status: "expanded" };
    const [promoOpen, setPromoOpen] = useState(true);

    return (
      <FooterWithPromoNest
        promoOpen={promoOpen}
        sheet={
          <CartPromoSheet
            open={promoOpen}
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
            onClose={() => setPromoOpen(false)}
          />
        }
      >
        <CartDrawerFooter
          subtotal="HK$42,700.00"
          estimatedTotal="HK$42,700.00"
          pointsState={{ status: "expanded" }}
          pointsBalanceLabel="You’ve 1,200 pts."
          copy={DEFAULT_CART_COPY.footer}
        />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("WELCOME100")).toBeInTheDocument();
    expect(
      canvas.getByText("Add ~HK$7,300 more to use this promo code"),
    ).toBeInTheDocument();
    expect(
      canvas.queryByPlaceholderText("Enter promo code"),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Use max" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();

    expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    expect(canvas.queryByPlaceholderText("0")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await waitFor(() => {
      expect(
        canvas.queryByRole("dialog", { name: "Promo code" }),
      ).not.toBeInTheDocument();
    });
  },
};
