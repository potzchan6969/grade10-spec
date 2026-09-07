import { Button } from "@grade10/design-system/components/forms/button";
import { Toaster } from "@grade10/design-system/components/overlays/sonner";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  DEFAULT_CART_COPY,
  OVERFLOW_CART_ITEMS,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_PROMO_CODES,
} from "./fixtures";
import type {
  CartItemSummary,
  HeldPromoCode,
  PointsState,
  PromoState,
} from "./types";

/**
 * Product / Cart / Cart Drawer (`4735:6493` & `4674:3831`).
 *
 * Composition and end-to-end flows only. Layer-owned states live on:
 * - [`CartDrawerHeader`](?path=/docs/store-cart-cartdrawerheader--docs) — badge / close / badge bones
 * - [`CartDrawerBody`](?path=/docs/store-cart-cartdrawerbody--docs) — baseline / overflow / empty / mixed list
 * - [`CartDrawerFooter`](?path=/docs/store-cart-cartdrawerfooter--docs) — promo (type + held), points, checkout
 * - [`CartItem`](?path=/docs/store-cart-cartitem--docs) — sold out / adjusted / row bones
 * - [`CartItemSlot`](?path=/docs/store-cart-cartitemslot--docs) — empty placeholder
 *
 * App handoff: wire `onApplyPromo` / `onSelectHeldPromo` / `onApplyPoints` onto
 * the Shopify draft; `onCheckout` redirects. Copy must say promo code, not coupon.
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

/** Interactive promo: open nested sheet, submit invalid code */
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
    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    const input = canvas.getByPlaceholderText("Enter promo code");
    expect(input).toBeInTheDocument();
    await userEvent.type(input, "WRONGCODE");
    const applyBtn = canvas.getByRole("button", { name: "Apply" });
    await userEvent.click(applyBtn);
    expect(canvas.getByText("This promo code is invalid")).toBeInTheDocument();
  },
};

/** Member: held promo codes + points in the composed drawer */
export const MemberPromoAndPoints: Story = {
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    const [points, setPoints] = useState<PointsState>({ status: "collapsed" });
    const [held] = useState<readonly HeldPromoCode[]>(SAMPLE_HELD_PROMO_CODES);
    const [selectedHeldId, setSelectedHeldId] = useState<string | null>(null);
    const [total, setTotal] = useState("HK$42,700.00");

    return (
      <CartDrawer
        {...args}
        estimatedTotal={total}
        promoState={promo}
        heldPromoCodes={held}
        selectedHeldPromoId={selectedHeldId}
        pointsState={points}
        pointsBalanceLabel="1,200 pts · up to HK$1,200"
        onPromoStateChange={setPromo}
        onRemovePromo={() => {
          setPromo({ status: "collapsed" });
          setSelectedHeldId(null);
          setTotal(
            points.status === "applied" ? "HK$42,200.00" : "HK$42,700.00",
          );
        }}
        onSelectHeldPromo={(id) => {
          const code = held.find((c) => c.id === id);
          if (!code?.applicable) return;
          setSelectedHeldId(id);
          setPromo({
            status: "applied",
            code: code.label,
            discountAmount:
              id === "held-welcome" ? "-HK$100.00" : "-HK$50.00",
          });
          setTotal(id === "held-welcome" ? "HK$42,600.00" : "HK$42,650.00");
        }}
        onApplyPromo={(code) => {
          if (code.toUpperCase() === "SAVE10") {
            setSelectedHeldId(null);
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
        onPointsStateChange={setPoints}
        onRemovePoints={() => {
          setPoints({ status: "collapsed" });
          setTotal(
            promo.status === "applied" ? "HK$38,430.00" : "HK$42,700.00",
          );
        }}
        onApplyPoints={(amount) => {
          const n = Number(amount.replace(/[^0-9.]/g, ""));
          if (!Number.isFinite(n) || n <= 0 || n > 1200) {
            setPoints({
              status: "expanded",
              error: "Enter an amount up to HK$1,200",
            });
            return false;
          }
          setPoints({
            status: "applied",
            amountLabel: `-HK$${n.toFixed(2)}`,
          });
          return true;
        }}
        onUseMaxPoints={() => {
          setPoints({ status: "applied", amountLabel: "-HK$1,200.00" });
          setTotal("HK$41,500.00");
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    expect(canvas.getByText("Your promo codes")).toBeInTheDocument();
    expect(canvas.getByText("Not valid for this order")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Use points/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/coupon/i)).not.toBeInTheDocument();
  },
};

/** Guest: compact promo row only — no held list, no points */
export const GuestPromoOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();
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

const DELISTED_PRODUCT_NAME =
  "1998 Japanese Base Set No Rarity Charmander PSA 10";

/**
 * After open fetch, a delisted catalogue line is cleared silently and
 * one bottom-right toast explains the removal. Remaining lines stay.
 */
export const UnavailableItemsRemoved: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<readonly CartItemSummary[]>([
      SAMPLE_CART_ITEMS[0],
      {
        id: "item-delisted",
        name: DELISTED_PRODUCT_NAME,
        price: "HK$3,200.00",
        quantity: 1,
        maxQuantity: 1,
        status: "default",
      },
    ]);

    return (
      <>
        <Toaster position="bottom-right" />
        <div className="p-8">
          <Button type="button" onClick={() => setOpen(true)}>
            Open Cart
          </Button>
          <CartDrawer
            {...args}
            open={open}
            onClose={() => setOpen(false)}
            items={items}
            subtotal="HK$24,500.00"
            estimatedTotal="HK$24,500.00"
            onRemoveItem={(id) =>
              setItems((prev) => prev.filter((item) => item.id !== id))
            }
            onQuantityChange={(id, qty) =>
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, quantity: qty } : item,
                ),
              )
            }
            onFetchStatusAndPrice={async () => {
              await new Promise((resolve) => setTimeout(resolve, 600));
              setItems((prev) =>
                prev.map((item) =>
                  item.id === "item-delisted"
                    ? { ...item, status: "unavailable" }
                    : item,
                ),
              );
            }}
          />
        </div>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open Cart" }));

    // Rows render a shared sizing fixture while the open fetch runs, so no real
    // item name is in the DOM yet — wait the busy state out before asserting on
    // names, or every assertion below reads the skeleton instead.
    await waitFor(() => {
      expect(canvasElement.querySelector('[aria-busy="true"]')).toBeNull();
    });

    await waitFor(() => {
      expect(canvas.queryByText(DELISTED_PRODUCT_NAME)).not.toBeInTheDocument();
    });

    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();

    const body = within(document.body);
    await waitFor(() => {
      expect(
        body.getByText(
          "Some item(s) have been removed as they’re no longer available",
        ),
      ).toBeInTheDocument();
    });
  },
};
