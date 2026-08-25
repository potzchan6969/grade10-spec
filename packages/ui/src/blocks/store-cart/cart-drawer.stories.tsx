import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@grade10/design-system/components/forms/button";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  DEFAULT_CART_COPY,
  OVERFLOW_CART_ITEMS,
  SAMPLE_CART_ITEMS,
} from "./fixtures";
import type { CartItemSummary, PromoState } from "./types";

/**
 * Product / Cart / Cart Drawer (`4735:6493` & `4674:3831`).
 *
 * Composition and end-to-end flows only. Layer-owned states live on:
 * - [`CartDrawerHeader`](?path=/docs/store-cart-cartdrawerheader--docs) — badge / close / badge bones
 * - [`CartDrawerBody`](?path=/docs/store-cart-cartdrawerbody--docs) — baseline / overflow / empty / mixed list
 * - [`CartDrawerFooter`](?path=/docs/store-cart-cartdrawerfooter--docs) — promo axes, checkout redirecting, amount bones
 * - [`CartItem`](?path=/docs/store-cart-cartitem--docs) — sold out / adjusted / row bones
 * - [`CartItemSlot`](?path=/docs/store-cart-cartitemslot--docs) — empty placeholder
 */
const meta = {
  title: "Store Cart/CartDrawer",
  component: CartDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onClose: () => {},
    items: SAMPLE_CART_ITEMS,
    subtotal: "HK$42,700.00",
    estimatedTotal: "HK$42,700.00",
    shippingEstimate: "TBD",
    copy: DEFAULT_CART_COPY,
  },
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state with 2 items and 3 placeholder slots */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [items, setItems] = useState<readonly CartItemSummary[]>(args.items);

    return (
      <CartDrawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onQuantityChange={(id, qty) =>
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
          )
        }
        onRemoveItem={(id) =>
          setItems((prev) => prev.filter((i) => i.id !== id))
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
    // 2 items + 3 placeholder slots
    const slots = canvas.getAllByLabelText("Add more items to cart");
    expect(slots).toHaveLength(3);
  },
};

/** Overflow state with 6 items: 0 empty slots displayed, scrollable list */
export const OverflowItemsNoEmptySlots: Story = {
  args: {
    items: OVERFLOW_CART_ITEMS,
    subtotal: "HK$83,600.00",
    estimatedTotal: "HK$83,600.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByLabelText("Add more items to cart"),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByText("2016 Pokémon 20th Anniversary Mario Pikachu PSA 10"),
    ).toBeInTheDocument();
  },
};

/** Empty state: 5 empty slots, hidden header count badge, and hidden footer */
export const EmptyState: Story = {
  args: {
    items: [],
    subtotal: "HK$0.00",
    estimatedTotal: "HK$0.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getAllByLabelText("Add more items to cart");
    expect(slots).toHaveLength(5);
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
  },
};

/** Interactive promo flow in the composed drawer (static promo axes live on Footer) */
export const PromoCodeInteraction: Story = {
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });

    return (
      <CartDrawer
        {...args}
        promoState={promo}
        onPromoStateChange={setPromo}
        onApplyPromo={(code) => {
          if (code.toUpperCase() === "SAVE10") {
            setPromo({
              status: "applied",
              code: "SAVE10",
              discountAmount: "-HK$4,270.00",
            });
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const promoToggle = canvas.getByRole("button", {
      name: /Use promo code/i,
    });
    await userEvent.click(promoToggle);
    const input = canvas.getByPlaceholderText("Enter promo code");
    expect(input).toBeInTheDocument();
    await userEvent.type(input, "WRONGCODE");
    const applyBtn = canvas.getByRole("button", { name: "Apply" });
    await userEvent.click(applyBtn);
    expect(canvas.getByText("This promo code is invalid")).toBeInTheDocument();
  },
};

/** Simulates initial status and price fetch on cart open with transition to ready */
export const FetchingOnOpen: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button type="button" onClick={() => setOpen(true)}>
          Open Cart
        </Button>
        <CartDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onFetchStatusAndPrice={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        />
      </div>
    );
  },
};
