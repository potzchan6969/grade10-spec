import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  CartDrawer,
  type CartItemSummary,
  type PointsState,
  type PromoState,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_SITE_HEADER,
} from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import {
  ADJUSTED_ITEMS,
  APPLIED_TOTAL,
  BOOSTER_NAME,
  CART_REVIEW_FAILED,
  CHECKOUT_PAY_STORY_ID,
  DELISTED_ITEMS,
  DELISTED_LINE_ID,
  DELISTED_NAME,
  HELD_PROMO_CODES,
  POINTS_APPLIED,
  POINTS_BALANCE_LABEL,
  POINTS_COLLAPSED,
  PRODUCT_DETAIL_STORY_ID,
  READY_ITEMS,
  READY_SUBTOTAL,
  SITE_SALE_ITEMS,
  SITE_SALE_SUBTOTAL,
  SOLD_OUT_ITEMS,
  UNCHECKED_ITEMS,
  UNCHECKED_TOTAL,
} from "../cart-content";

/** Simulated open-time status read; long enough to see the loading state. */
const FETCH_MS = 600;

type CartDrawerPageProps = {
  items: readonly CartItemSummary[];
  subtotal: string;
  estimatedTotal: string;
  loading?: boolean;
  checkoutDisabled?: boolean;
  checkout?: "ready" | "pending" | "failed";
  pointsState?: PointsState | null;
  /** The open-time review cannot finish: lines unchecked and a retry toast. */
  reviewFailed?: boolean;
  /** A delisted line is marked unavailable by the open-time read. */
  delistOnOpen?: boolean;
};

/** The drawer portals to the body, so every query reads the body. */
const drawer = () => within(document.body);

/**
 * A plain store page with the cart drawer open over it. The page owns the
 * drawer's open state, the lines and the promo sheet; the drawer receives
 * props and reports changes. The nav Cart button reopens a closed drawer.
 */
function CartDrawerPage({
  items: initialItems,
  subtotal,
  estimatedTotal,
  loading = false,
  checkoutDisabled = false,
  checkout = "ready",
  pointsState = POINTS_COLLAPSED,
  reviewFailed = false,
  delistOnOpen = false,
}: CartDrawerPageProps) {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState(initialItems);
  const [points, setPoints] = useState(pointsState);
  const [promo, setPromo] = useState<PromoState>({ status: "collapsed" });

  useEffect(() => {
    if (!reviewFailed) return;
    const id = toast.error(CART_REVIEW_FAILED.title, {
      description: CART_REVIEW_FAILED.description,
      duration: Number.POSITIVE_INFINITY,
      action: { label: CART_REVIEW_FAILED.retry, onClick: () => undefined },
    });
    return () => {
      toast.dismiss(id);
    };
  }, [reviewFailed]);

  const fetchStatusAndPrice = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setItems((previous) =>
          previous.map((item) =>
            item.id === DELISTED_LINE_ID
              ? { ...item, status: "unavailable" }
              : item,
          ),
        );
        resolve();
      }, FETCH_MS);
    });

  const onCheckout =
    checkout === "pending"
      ? () => new Promise<void>(() => undefined)
      : checkout === "failed"
        ? () => Promise.reject(new Error("Shopify session failed"))
        : () => navigateToStory(CHECKOUT_PAY_STORY_ID);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} onCartClick={() => setOpen(true)} />
      <main className="flex-1" />
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        subtotal={subtotal}
        estimatedTotal={estimatedTotal}
        shippingEstimate={STORE_CART_COPY.footer.shippingValue}
        loading={loading}
        copy={STORE_CART_COPY}
        checkoutDisabled={checkoutDisabled}
        onFetchStatusAndPrice={delistOnOpen ? fetchStatusAndPrice : undefined}
        promoState={promo}
        onPromoStateChange={setPromo}
        heldPromoCodes={HELD_PROMO_CODES}
        pointsState={points}
        pointsBalanceLabel={POINTS_BALANCE_LABEL}
        onPointsStateChange={setPoints}
        onApplyPoints={(amount) => {
          const credit = Number(amount.replace(/[^0-9]/g, ""));
          if (!credit) return false;
          setPoints({
            status: "applied",
            amountLabel: `−HK$${credit.toLocaleString("en-HK")}.00`,
          });
          return true;
        }}
        onUseMaxPoints={() => setPoints(POINTS_APPLIED)}
        onRemovePoints={() => setPoints(POINTS_COLLAPSED)}
        onQuantityChange={(id, quantity) =>
          setItems((previous) =>
            previous.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          )
        }
        onRemoveItem={(id) =>
          setItems((previous) => previous.filter((item) => item.id !== id))
        }
        onItemClick={() => navigateToStory(PRODUCT_DETAIL_STORY_ID)}
        onCheckout={onCheckout}
      />
    </div>
  );
}

const meta = {
  title: "Store/Cart/Screens/Cart Drawer",
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

/** Proceed starts the hosted-payment redirect and holds the Redirecting label. */
export const CheckoutRedirecting: Story = {
  args: { checkout: "pending" },
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
