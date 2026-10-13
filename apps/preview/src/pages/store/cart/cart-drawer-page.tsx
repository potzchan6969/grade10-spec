import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import {
  CartDrawer,
  type CartItemSummary,
  type PointsState,
  type PromoState,
  SiteHeader,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { within } from "storybook/test";
import {
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_SITE_HEADER,
} from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import {
  CART_REVIEW_FAILED,
  DELISTED_LINE_ID,
  GUEST_FOOTER_COPY,
  HELD_PROMO_CODES,
  ORDER_CONFIRMED_STORY_ID,
  POINTS_APPLIED,
  POINTS_BALANCE_LABEL,
  POINTS_COLLAPSED,
  PRODUCT_DETAIL_STORY_ID,
  PUBLIC_PROMO_CODES,
  SIGN_IN_STORY_ID,
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
  /** Signed-out drawer: guest checkout primary, sign-in line, public codes, no points. */
  guest?: boolean;
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
  guest = false,
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
        : guest
          ? () => navigateToStory(ORDER_CONFIRMED_STORY_ID)
          : () => undefined;

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
        copy={
          guest
            ? { ...STORE_CART_COPY, footer: GUEST_FOOTER_COPY }
            : STORE_CART_COPY
        }
        checkoutDisabled={checkoutDisabled}
        onFetchStatusAndPrice={delistOnOpen ? fetchStatusAndPrice : undefined}
        promoState={promo}
        onPromoStateChange={setPromo}
        heldPromoCodes={guest ? null : HELD_PROMO_CODES}
        publicPromoCodes={PUBLIC_PROMO_CODES}
        pointsState={guest ? null : points}
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
        onSignIn={guest ? () => navigateToStory(SIGN_IN_STORY_ID) : undefined}
      />
    </div>
  );
}

export type { CartDrawerPageProps };
export { CartDrawerPage, drawer };
