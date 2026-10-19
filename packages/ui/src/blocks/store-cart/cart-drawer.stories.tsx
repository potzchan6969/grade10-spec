import { Button } from "@grade10/design-system/components/forms/button";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CartDrawer } from "./cart-drawer";
import {
  applyTypedPromoInStories,
  DEFAULT_CART_COPY,
  formatStoryCreditHkd,
  OVERFLOW_CART_ITEMS,
  PICTURE_CART_ITEM,
  parseStoryMoney,
  SAMPLE_CART_ITEMS,
  SAMPLE_HELD_DISCOUNTS,
  SAMPLE_HELD_PROMO_CODES,
  STORY_POINTS_MAX_HKD,
  storyCartEstimatedTotal,
  storyPromoLabel,
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
 * - [`CartDrawerHeader`](?path=/docs/store-cart-blocks-cartdrawerheader--docs) — badge / close / badge bones
 * - [`CartDrawerBody`](?path=/docs/store-cart-blocks-cartdrawerbody--docs) — overflow / empty / mixed list
 * - [`CartDrawerFooter`](?path=/docs/store-cart-blocks-cartdrawerfooter--docs) — promo (type + held), points, checkout
 * - [`CartItem`](?path=/docs/store-cart-blocks-cartitem--docs) — sold out / adjusted / row bones
 *
 * `Default` is the one interactive composed story (promo sheet + points).
 * Typed/held/points state matrix stays on CartDrawerFooter.
 * Site-sale × promo combine modes:
 * [`Auto Discount`](?path=/docs/store-cart-blocks-cartdrawer-auto-discount--docs).
 *
 * App handoff: checkout is members-only (no guest checkout). Wire
 * `onApplyPromo` / `onSelectHeldPromo` / `onApplyPoints` onto the Shopify
 * draft; `onCheckout` redirects. Copy must say promo code, not coupon.
 */
const meta = {
  title: "Store/Cart/Blocks/CartDrawer",
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

export const Pictures: StoryObj<typeof meta> = {
  args: {
    items: [{ ...PICTURE_CART_ITEM, status: "soldOut" }, SAMPLE_CART_ITEMS[0]],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The design-system Drawer portals its surface to `document.body` and marks
 * the story canvas inert while open, so every query below reads the body,
 * never `canvasElement`.
 */
const drawer = () => within(document.body);

const header = () =>
  document.body.querySelector<HTMLElement>(
    '[data-slot="cart-drawer-header"]',
  ) as HTMLElement;

/** The count beside the title, or null when the header shows none. */
const headerBadge = () =>
  header().querySelector("h2")?.nextElementSibling?.textContent ?? null;

const headerBadgeLoading = () =>
  header().querySelector('[aria-busy="true"]') !== null;

const footer = () =>
  document.body.querySelector<HTMLElement>('[data-slot="cart-drawer-footer"]');

const rows = () =>
  document.body.querySelectorAll<HTMLElement>('[data-slot="cart-item"]');

const emptyState = () =>
  document.body.querySelector<HTMLElement>('[data-slot="empty-state"]');

/** Waits out the open read so assertions read rows, not their skeletons. */
const settled = () =>
  waitFor(() => {
    expect(drawer().getByRole("dialog", { name: "Cart" })).toBeInTheDocument();
    expect(document.body.querySelector('[aria-busy="true"]')).toBeNull();
  });

/** Default: signed-in cart with interactive promo sheet and points */
export const Default: Story = {
  args: {
    items: [SAMPLE_CART_ITEMS[0], { ...SAMPLE_CART_ITEMS[1], quantity: 3 }],
  },
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
            label: storyPromoLabel(code.label),
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
              label: storyPromoLabel(result.label),
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

    // shared-ui-store-cart-SC-23: the cart's two lines and nothing else.
    expect(rows()).toHaveLength(2);
    expect(
      canvas.getByText("2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5"),
    ).toBeInTheDocument();
    expect(emptyState()).toBeNull();
    // shared-ui-store-cart-SC-50: a line of 3 counts once.
    expect(headerBadge()).toBe("2");
    expect(footer()).toBeInTheDocument();
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
    // shared-ui-store-cart-SC-24: all six lines render and the list scrolls.
    for (const item of OVERFLOW_CART_ITEMS) {
      expect(canvas.getByText(item.name)).toBeInTheDocument();
    }
    expect(rows()).toHaveLength(OVERFLOW_CART_ITEMS.length);
    const body = document.body.querySelector<HTMLElement>(
      '[data-slot="cart-drawer-body"]',
    );
    expect(body).toHaveClass("scroll-fade");
    expect(body && getComputedStyle(body).overflowY).toBe("auto");
    expect(emptyState()).toBeNull();
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
    // shared-ui-store-cart-SC-25: icon, title and description; no action,
    // no count and no footer.
    const empty = emptyState();
    expect(empty).toBeInTheDocument();
    expect(
      empty?.querySelector('[data-slot="empty-state-icon"]'),
    ).toBeInTheDocument();
    expect(
      empty?.querySelector('[data-slot="empty-state-title"]'),
    ).toHaveTextContent(DEFAULT_CART_COPY.emptyTitle);
    expect(
      empty?.querySelector('[data-slot="empty-state-description"]'),
    ).toHaveTextContent(DEFAULT_CART_COPY.emptyDescription ?? "");
    expect(
      empty?.querySelector('[data-slot="empty-state-actions"]'),
    ).toBeNull();
    expect(empty?.querySelector("button, a")).toBeNull();
    expect(headerBadge()).toBeNull();
    expect(footer()).toBeNull();
    expect(rows()).toHaveLength(0);
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
  },
};

/** Empty state with no description: the icon and title alone */
export const EmptyStateWithoutDescription: Story = {
  args: {
    items: [],
    subtotal: "HK$0.00",
    estimatedTotal: "HK$0.00",
    copy: { ...DEFAULT_CART_COPY, emptyDescription: undefined },
  },
  play: async () => {
    // shared-ui-store-cart-SC-41
    const empty = emptyState();
    expect(empty).toBeInTheDocument();
    expect(
      empty?.querySelector('[data-slot="empty-state-icon"]'),
    ).toBeInTheDocument();
    expect(
      empty?.querySelector('[data-slot="empty-state-title"]'),
    ).toHaveTextContent(DEFAULT_CART_COPY.emptyTitle);
    expect(
      empty?.querySelector('[data-slot="empty-state-description"]'),
    ).toBeNull();
    expect(
      empty?.querySelector('[data-slot="empty-state-actions"]'),
    ).toBeNull();
    expect(footer()).toBeNull();
  },
};

/**
 * Loading a cart with lines: row, badge and amount skeletons, Checkout
 * disabled. `loading` is an arg, so a tester ends the read from Controls.
 */
export const LoadingWithLines: Story = {
  args: {
    loading: true,
    promoState: {
      status: "applied",
      label: storyPromoLabel("WELCOME100"),
      discountAmount: "−HK$100.00",
    },
    estimatedTotal: "HK$42,600.00",
  },
  play: async ({ args }) => {
    if (!args.loading) return;
    // shared-ui-store-cart-SC-08
    const canvas = drawer();
    expect(headerBadgeLoading()).toBe(true);
    expect(emptyState()).toBeNull();
    const shownFooter = footer();
    expect(shownFooter).toBeInTheDocument();
    // Subtotal, discount and estimated total each hold a skeleton.
    expect(
      shownFooter?.querySelectorAll('[aria-busy="true"]').length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
    expect(
      document.body.querySelector(
        '[data-slot="cart-drawer-body"] [aria-busy="true"]',
      ),
    ).not.toBeNull();
  },
};

/**
 * Loading a cart with no lines: a blank body, a badge skeleton and no footer.
 * `loading` is an arg; turned off, the empty state shows.
 */
export const LoadingNoLines: Story = {
  args: {
    loading: true,
    items: [],
    subtotal: "HK$0.00",
    estimatedTotal: "HK$0.00",
  },
  play: async ({ args }) => {
    if (!args.loading) return;
    // shared-ui-store-cart-SC-40
    expect(headerBadgeLoading()).toBe(true);
    expect(rows()).toHaveLength(0);
    expect(emptyState()).toBeNull();
    expect(footer()).toBeNull();
  },
};

const ONLY_DELISTED_ITEMS: readonly CartItemSummary[] = SAMPLE_CART_ITEMS.map(
  (item) => ({ ...item }),
);

/**
 * Every line turns `unavailable` after the open read: the drawer removes them
 * with one toast and ends on the empty state.
 */
export const OnlyDelistedLines: Story = {
  args: { onRemoveItem: fn() },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] =
      useState<readonly CartItemSummary[]>(ONLY_DELISTED_ITEMS);

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
            onRemoveItem={(id) => {
              args.onRemoveItem?.(id);
              setItems((prev) => prev.filter((item) => item.id !== id));
            }}
            onFetchStatusAndPrice={async () => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              setItems((prev) =>
                prev.map((item) => ({ ...item, status: "unavailable" })),
              );
            }}
          />
        </div>
      </>
    );
  },
  play: async ({ args, canvasElement }) => {
    // shared-ui-store-cart-SC-42
    toast.dismiss();
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open Cart" }),
    );
    await settled();
    await waitFor(() => expect(emptyState()).toBeInTheDocument());
    await waitFor(() =>
      expect(drawer().getAllByText("Items removed from cart")).toHaveLength(1),
    );
    expect(args.onRemoveItem).toHaveBeenCalledTimes(ONLY_DELISTED_ITEMS.length);
    expect(rows()).toHaveLength(0);
    expect(headerBadge()).toBeNull();
    expect(footer()).toBeNull();
  },
};

/** Every line sold out: listed with the footer, no count, no empty state */
export const OnlySoldOutLines: Story = {
  args: {
    items: SAMPLE_CART_ITEMS.map((item) => ({
      ...item,
      status: "soldOut" as const,
    })),
  },
  play: async () => {
    // shared-ui-store-cart-SC-45
    const canvas = drawer();
    expect(rows()).toHaveLength(SAMPLE_CART_ITEMS.length);
    expect(canvas.getAllByText("Sold Out")).toHaveLength(
      SAMPLE_CART_ITEMS.length,
    );
    expect(emptyState()).toBeNull();
    expect(headerBadge()).toBeNull();
    expect(footer()).toBeInTheDocument();
  },
};

const MIXED_UNAVAILABLE_NAME =
  "1998 Japanese Base Set No Rarity Charmander PSA 10";

/**
 * One active, one sold-out and one unavailable line the consumer keeps: the
 * badge counts the active line alone and the unavailable line never renders.
 */
export const MixedLineStates: Story = {
  args: {
    loading: false,
    items: [
      SAMPLE_CART_ITEMS[0],
      { ...SAMPLE_CART_ITEMS[1], status: "soldOut" },
      {
        id: "item-unavailable",
        name: MIXED_UNAVAILABLE_NAME,
        price: "HK$3,200.00",
        quantity: 1,
        status: "unavailable",
      },
    ],
    onRemoveItem: fn(),
  },
  play: async () => {
    // shared-ui-store-cart-SC-05 and shared-ui-store-cart-SC-49
    const canvas = drawer();
    expect(headerBadge()).toBe("1");
    expect(rows()).toHaveLength(2);
    expect(canvas.queryByText(MIXED_UNAVAILABLE_NAME)).not.toBeInTheDocument();
    expect(footer()).toBeInTheDocument();
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

/** Composed read-only tender context keeps facts while omitting mutations. */
export const ReadOnlyTenderContext: Story = {
  render: (args) => {
    const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });
    const [points, setPoints] = useState<PointsState>({ status: "collapsed" });

    return (
      <CartDrawer
        {...args}
        promoState={promo}
        heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
        selectedHeldPromoId={null}
        pointsState={points}
        pointsBalanceLabel="You’ve 1,200 pts."
        onPromoStateChange={setPromo}
        onPointsStateChange={setPoints}
      />
    );
  },
  play: async () => {
    const canvas = drawer();

    await userEvent.click(
      canvas.getByRole("button", { name: /Select or enter code/i }),
    );
    const promo = canvas.getByRole("dialog", { name: "Promo code" });
    const promoView = within(promo);
    expect(promoView.getByText("WELCOME100")).toBeInTheDocument();
    expect(promoView.getByText("SAVE200")).toBeInTheDocument();
    expect(promoView.getByText("Not valid for this order")).toBeInTheDocument();
    expect(
      promoView.queryByPlaceholderText("Enter promo code"),
    ).not.toBeInTheDocument();
    expect(
      promoView.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    expect(
      within(promoView.getByRole("group", { name: "WELCOME100" })).queryByRole(
        "button",
        { name: "Apply" },
      ),
    ).not.toBeInTheDocument();

    await userEvent.click(promoView.getByRole("button", { name: "Back" }));
    await waitFor(() => {
      expect(
        canvas.queryByRole("dialog", { name: "Promo code" }),
      ).not.toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", { name: /Use points/i }));
    expect(canvas.getByText(/1 pt = HK\$1\./)).toBeInTheDocument();
    expect(canvas.getByText(/You’ve 1,200 pts\./)).toBeInTheDocument();
    expect(canvas.queryByPlaceholderText("0")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Use max" }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByText("HK$42,700.00", { exact: true })).toHaveLength(
      2,
    );
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

export const TenderPendingWithOpenPromoSheet: Story = {
  args: {
    promoState: { status: "expanded" },
    pointsState: { status: "applied", amountLabel: "HK$120.00" },
    selectedHeldPromoId: "held-welcome",
    onApplyPromo: fn(),
    onSelectHeldPromo: fn(),
    onRemovePromo: fn(),
    onApplyPoints: fn(),
    onUseMaxPoints: fn(),
    onRemovePoints: fn(),
    onCheckout: fn(),
  },
  render: (args) => {
    const [tenderPending, setTenderPending] = useState(false);
    return (
      <CartDrawer
        {...args}
        tenderPending={tenderPending}
        onApplyPromo={async (code) => {
          args.onApplyPromo?.(code);
          setTenderPending(true);
          return false;
        }}
      />
    );
  },
  play: async ({ args }) => {
    const canvas = drawer();
    const promo = within(canvas.getByRole("dialog", { name: "Promo code" }));
    const input = promo.getByPlaceholderText("Enter promo code");
    const apply = promo.getAllByRole("button", { name: "Apply" })[0];
    const heldApply = within(
      promo.getByRole("group", { name: "WELCOME100" }),
    ).getByRole("button", { name: "Apply" });
    const checkout = canvas.getByRole("button", {
      name: "Proceed to Checkout",
    });
    const removePoints = canvas.getByRole("button", { name: "Remove" });

    await userEvent.type(input, "SAVE");
    await userEvent.click(apply);
    await waitFor(() => expect(input).toBeDisabled());
    expect(input).toBeDisabled();
    expect(apply).toBeDisabled();
    expect(heldApply).toBeDisabled();
    expect(checkout).toBeDisabled();
    expect(removePoints).toHaveAttribute("aria-disabled", "true");
    expect(promo.getByRole("button", { name: "Back" })).toBeInTheDocument();

    apply.click();
    heldApply.click();
    checkout.click();
    removePoints.click();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(args.onApplyPromo).toHaveBeenCalledTimes(1);
    expect(args.onSelectHeldPromo).not.toHaveBeenCalled();
    expect(args.onCheckout).not.toHaveBeenCalled();
    expect(args.onRemovePoints).not.toHaveBeenCalled();
  },
};

/** Shared interaction guard: the cart can still be dismissed while mutations wait. */
export const InteractionPending: Story = {
  args: {
    interactionPending: true,
    promoState: { status: "collapsed" },
    pointsState: null,
    onClose: fn(),
    onPromoStateChange: fn(),
    onRemoveItem: fn(),
    onCheckout: fn(),
  },
  play: async ({ args }) => {
    const canvas = drawer();
    await userEvent.click(
      canvas.getByRole("button", {
        name: DEFAULT_CART_COPY.header.closeCartLabel,
      }),
    );
    expect(args.onClose).toHaveBeenCalledTimes(1);

    const overlay = document.body.querySelector<HTMLElement>(
      '[data-slot="drawer-overlay"]',
    );
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay as HTMLElement);
    await userEvent.keyboard("{Escape}");
    expect(args.onClose).toHaveBeenCalledTimes(3);
    expect(args.onRemoveItem).not.toHaveBeenCalled();
    expect(args.onCheckout).not.toHaveBeenCalled();
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
 * After open fetch, a delisted catalogue line is cleared and named in the
 * bottom-right toast. Remaining lines stay.
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
            copy={{
              ...args.copy,
              unavailableItemsRemovedDescription: `No longer sold: ${DELISTED_PRODUCT_NAME}`,
            }}
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
    // Cart-validation SC-09: a withdrawn product is named as unavailable.
    toast.dismiss();
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
      canvas.getByText(`No longer sold: ${DELISTED_PRODUCT_NAME}`),
    ).toBeInTheDocument();
    expect(canvas.queryByText(DELISTED_PRODUCT_NAME)).not.toBeInTheDocument();
  },
};
