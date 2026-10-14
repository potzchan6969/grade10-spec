import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  CartDrawerBody,
  CartDrawerFooter,
  CartDrawerHeader,
  type CartItemSummary,
  type PointsState,
  type PromoState,
} from "@grade10/ui";
import { type ReactNode, useEffect, useRef } from "react";
import { STORE_CART_COPY } from "../store-content";
import { GUEST_BAR_ASK, GUEST_FOOTER_COPY } from "./cart-content";
import { GuestBarSignInAsk } from "./guest-bar-ask";

/**
 * The cart drawer's header, rows and footer without the drawer, for a card in
 * a Flow. `CartDrawer` portals to the body and covers the page, so a flow step
 * composes its parts instead. Not a block: the shared compound is `CartDrawer`.
 */

const POINTS_COLLAPSED: PointsState = { status: "collapsed" };
const POINTS_BALANCE_LABEL = "You’ve 1,200 pts.";
const noop = () => undefined;

type CartPanelNotice = {
  title: string;
  description?: string;
  action?: ReactNode;
};

type CartPanelProps = {
  items: readonly CartItemSummary[];
  subtotal: string;
  estimatedTotal: string;
  loading?: boolean;
  checkoutDisabled?: boolean;
  /** Presses Proceed once so the pending label shows, as a redirect would. */
  startCheckout?: boolean;
  pointsState?: PointsState | null;
  promoState?: PromoState;
  /** A guest's panel: guest checkout copy, the quiet sign-in line, no points. */
  guest?: boolean;
  /** Goods at the HKD 120,000 bar: the sign-in ask stands for the footer. */
  atBar?: boolean;
  onSignIn?: () => void;
  notice?: CartPanelNotice;
};

function CartPanelNoticeBar({ title, description, action }: CartPanelNotice) {
  return (
    <VStack gap="sm" className="rounded-md border border-border p-4">
      <Text size="sm" weight="medium">
        {title}
      </Text>
      {description ? (
        <Text size="sm" className="text-secondary-foreground">
          {description}
        </Text>
      ) : null}
      {action}
    </VStack>
  );
}

function CartPanel({
  items,
  subtotal,
  estimatedTotal,
  loading = false,
  checkoutDisabled = false,
  startCheckout = false,
  pointsState = POINTS_COLLAPSED,
  promoState = { status: "collapsed" },
  guest = false,
  atBar = false,
  onSignIn = noop,
  notice,
}: CartPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startCheckout) return;
    const proceed = Array.from(
      rootRef.current?.querySelectorAll("button") ?? [],
    ).find(
      (button) =>
        button.textContent?.trim() === STORE_CART_COPY.footer.checkoutButton,
    );
    proceed?.click();
  }, [startCheckout]);

  const lines = items.filter(
    (item) => item.status !== "soldOut" && item.status !== "unavailable",
  ).length;

  return (
    <div ref={rootRef} className="flex w-full flex-col">
      <CartDrawerHeader
        itemCount={lines}
        copy={STORE_CART_COPY.header}
        onClose={noop}
        loading={loading}
      />
      <CartDrawerBody
        items={items}
        copy={STORE_CART_COPY.item}
        emptyTitle={STORE_CART_COPY.emptyTitle}
        emptyDescription={STORE_CART_COPY.emptyDescription}
        loading={loading}
        onQuantityChange={noop}
        onRemoveItem={noop}
      />
      {notice ? (
        <div className="px-6 pb-4">
          <CartPanelNoticeBar {...notice} />
        </div>
      ) : null}
      {atBar ? (
        <GuestBarSignInAsk
          subtotal={subtotal}
          shippingEstimate={STORE_CART_COPY.footer.shippingValue}
          estimatedTotal={estimatedTotal}
          subtotalLabel={STORE_CART_COPY.footer.subtotalLabel}
          shippingLabel={STORE_CART_COPY.footer.shippingLabel}
          estimatedTotalLabel={STORE_CART_COPY.footer.estimatedTotalLabel}
          prompt={GUEST_BAR_ASK.prompt}
          action={GUEST_BAR_ASK.action}
          onSignIn={onSignIn}
        />
      ) : (
        <CartDrawerFooter
          subtotal={subtotal}
          estimatedTotal={estimatedTotal}
          shippingEstimate={STORE_CART_COPY.footer.shippingValue}
          loading={loading}
          checkoutDisabled={checkoutDisabled}
          promoState={promoState}
          pointsState={guest ? null : pointsState}
          pointsBalanceLabel={POINTS_BALANCE_LABEL}
          copy={guest ? GUEST_FOOTER_COPY : STORE_CART_COPY.footer}
          onPromoStateChange={noop}
          onPointsStateChange={noop}
          onApplyPoints={() => false}
          onUseMaxPoints={noop}
          onRemovePoints={noop}
          onSignIn={guest ? onSignIn : undefined}
        />
      )}
    </div>
  );
}

export type { CartPanelNotice, CartPanelProps };
export { CartPanel };
