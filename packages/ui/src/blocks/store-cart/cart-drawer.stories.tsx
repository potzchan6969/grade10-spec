import { Button } from "@grade10/design-system/components/forms/button";
import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  OVERFLOW_CART_ITEMS,
  parseStoryMoney,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_PROMO_CODES,
  STORY_POINTS_MAX_HKD,
  storyCartEstimatedTotal,
} from "./fixtures";
import type {
  CartItemSummary,
  HeldPromoCode,
  PointsState,
  PromoState,
} from "./types";

function promoDiscountAmount(promo: PromoState): string | null {
  return promo.status === "applied" ? String(promo.discountAmount) : null;
}

function pointsCreditHkd(points: PointsState): number | null {
  return points.status === "applied"
    ? parseStoryMoney(String(points.amountLabel))
    : null;
}

/**
 * Product / Cart / Cart Drawer (`4735:6493` & `4674:3831`).
 *
 * Composition and end-to-end flows only. Layer-owned states live on:
 * - [`CartDrawerHeader`](?path=/docs/store-cart-cartdrawerheader--docs) — badge / close / badge bones
 * - [`CartDrawerBody`](?path=/docs/store-cart-cartdrawerbody--docs) — overflow / empty / mixed list
 * - [`CartDrawerFooter`](?path=/docs/store-cart-cartdrawerfooter--docs) — promo (type + held), points, checkout
 * - [`CartItem`](?path=/docs/store-cart-cartitem--docs) — sold out / adjusted / row bones
 *
 * `Default` is the one interactive composed story (promo sheet + points).
 * Typed/held/points state matrix stays on CartDrawerFooter.
 * Site-sale × promo combine modes:
 * [`Auto Discount`](?path=/docs/store-cart-cartdrawer-auto-discount--docs).
 *
 * App handoff: checkout is members-only (no guest checkout). Wire
 * `onApplyPromo` / `onSelectHeldPromo` / `onApplyPoints` onto the Shopify
 * draft; `onCheckout` redirects. Copy must say promo code, not coupon.
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
    shippingEstimate: "Calculated at checkout",
    copy: DEFAULT_CART_COPY,
    pointsState: { status: "collapsed" },
    pointsBalanceLabel: "You’ve 1,200 pts.",
    heldPromoCodes: SAMPLE_HELD_PROMO_CODES,
  },
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The design-system Drawer portals its surface to `document.body` and marks
 * the story canvas inert while open, so every query below reads the body,
 * never `canvasElement`.
 */
const drawer = () => within(document.body);

/** Default: signed-in cart with interactive promo sheet and points */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [items, setItems] = useState<readonly CartItemSummary[]>(args.items);
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    const [points, setPoints] = useState<PointsState>(
      args.pointsState ?? { status: "collapsed" },
    );
    const [held] = useState<readonly HeldPromoCode[]>(
      args.heldPromoCodes ?? SAMPLE_HELD_PROMO_CODES,
    );
    const [selectedHeldId, setSelectedHeldId] = useState<string | null>(null);
    const [total, setTotal] = useState(
      typeof args.estimatedTotal === "string"
        ? args.estimatedTotal
        : "HK$42,700.00",
    );

    return (
      <CartDrawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        estimatedTotal={total}
        promoState={promo}
        heldPromoCodes={held}
        selectedHeldPromoId={selectedHeldId}
        pointsState={points}
        onPromoStateChange={setPromo}
        onQuantityChange={(id, qty) =>
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
          )
        }
        onRemoveItem={(id) =>
          setItems((prev) => prev.filter((i) => i.id !== id))
        }
        onRemovePromo={() => {
          setPromo({ status: "collapsed" });
          setSelectedHeldId(null);
          setTotal(storyCartEstimatedTotal(null, pointsCreditHkd(points)));
        }}
        onSelectHeldPromo={(id) => {
          const code = held.find((c) => c.id === id);
          if (!code?.applicable) return;
          const discount = SAMPLE_HELD_DISCOUNTS[id];
          if (!discount) return;
          setSelectedHeldId(id);
          setPromo({
            status: "applied",
            code: code.label,
            discountAmount: discount.amount,
          });
          setTotal(
            storyCartEstimatedTotal(discount.amount, pointsCreditHkd(points)),
          );
        }}
        onApplyPromo={(code) => {
          const result = applyTypedPromoInStories(code, held);
          if (result.ok) {
            setSelectedHeldId(result.heldId);
            setPromo({
              status: "applied",
              code: result.label,
              discountAmount: result.amount,
            });
            setTotal(
              storyCartEstimatedTotal(result.amount, pointsCreditHkd(points)),
            );
            return true;
          }
          setPromo({
            status: "expanded",
            error: result.error,
          });
          return false;
        }}
        onPointsStateChange={setPoints}
        onRemovePoints={() => {
          setPoints({ status: "collapsed" });
          setTotal(storyCartEstimatedTotal(promoDiscountAmount(promo), null));
        }}
        onApplyPoints={(amount) => {
          const n = Number(amount.replace(/[^0-9.]/g, ""));
          if (!Number.isFinite(n) || n <= 0 || n > STORY_POINTS_MAX_HKD) {
            setPoints({
              status: "expanded",
              error: `Enter up to ${STORY_POINTS_MAX_HKD.toLocaleString("en-HK")} pt`,
            });
            return false;
          }
          setPoints({
            status: "applied",
            amountLabel: formatStoryCreditHkd(n),
          });
          setTotal(storyCartEstimatedTotal(promoDiscountAmount(promo), n));
          return true;
        }}
        onUseMaxPoints={() => {
          setPoints({
            status: "applied",
            amountLabel: formatStoryCreditHkd(STORY_POINTS_MAX_HKD),
          });
          setTotal(
            storyCartEstimatedTotal(
              promoDiscountAmount(promo),
              STORY_POINTS_MAX_HKD,
            ),
          );
        }}
      />
    );
  },
  play: async () => {
    const canvas = drawer();
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Use points/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your cart is empty")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("dialog", { name: "Promo code" }),
    ).not.toBeInTheDocument();
  },
};

/** Overflow state with 6 items: scrollable list */
export const OverflowItems: Story = {
  args: {
    items: OVERFLOW_CART_ITEMS,
    subtotal: "HK$83,600.00",
    estimatedTotal: "HK$83,600.00",
  },
  play: async () => {
    const canvas = drawer();
    expect(
      canvas.getByText("2016 Pokémon 20th Anniversary Mario Pikachu PSA 10"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your cart is empty")).not.toBeInTheDocument();
  },
};

/** Empty state: design-system empty state, hidden header count badge, and hidden footer */
export const EmptyState: Story = {
  args: {
    items: [],
    subtotal: "HK$0.00",
    estimatedTotal: "HK$0.00",
  },
  play: async () => {
    const canvas = drawer();
    expect(canvas.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      canvas.getByText("Items you add will appear here"),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Shop|Browse|Continue/i }),
    ).not.toBeInTheDocument();
  },
};

/** Points tender omitted — balance loading or no points on this member */
export const WithoutPoints: Story = {
  args: {
    pointsState: null,
  },
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    return (
      <CartDrawer {...args} promoState={promo} onPromoStateChange={setPromo} />
    );
  },
  play: async () => {
    const canvas = drawer();
    expect(
      canvas.queryByRole("button", { name: /Use points/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    ).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    expect(
      canvas.getByRole("dialog", { name: "Promo code" }),
    ).toBeInTheDocument();
  },
};

/**
 * Esc / backdrop close the nested promo sheet first, then the cart.
 */
export const NestedPromoDismiss: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [promo, setPromo] = useState<PromoState>({ status: "expanded" });

    return (
      <CartDrawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        promoState={promo}
        heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
        pointsState={null}
        onPromoStateChange={setPromo}
      />
    );
  },
  play: async () => {
    const canvas = drawer();
    expect(
      canvas.getByRole("dialog", { name: "Promo code" }),
    ).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        canvas.queryByRole("dialog", { name: "Promo code" }),
      ).not.toBeInTheDocument();
    });
    expect(canvas.getByRole("dialog", { name: "Cart" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        canvas.queryByRole("dialog", { name: "Cart" }),
      ).not.toBeInTheDocument();
    });
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
        <Toast position="bottom-right" />
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
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open Cart" }),
    );
    const canvas = drawer();

    // Rows render a shared sizing fixture while the open fetch runs, so no real
    // item name is in the DOM yet — wait the busy state out before asserting on
    // names, or every assertion below reads the skeleton instead.
    await waitFor(() => {
      expect(canvas.getByRole("dialog", { name: "Cart" })).toBeInTheDocument();
      expect(document.body.querySelector('[aria-busy="true"]')).toBeNull();
    });

    await waitFor(() => {
      expect(canvas.queryByText(DELISTED_PRODUCT_NAME)).not.toBeInTheDocument();
    });

    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(canvas.getByText("Items removed from cart")).toBeInTheDocument();
    });
    expect(
      canvas.getByText("Some products are no longer available"),
    ).toBeInTheDocument();
  },
};
