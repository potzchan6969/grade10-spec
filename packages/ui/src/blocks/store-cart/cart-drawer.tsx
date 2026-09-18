import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Link } from "@grade10/design-system/components/forms/link";
import { NumberInput } from "@grade10/design-system/components/forms/number-input";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Drawer,
  DrawerContent,
} from "@grade10/design-system/components/overlays/drawer";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  ShoppingCart,
  Tag,
  Trash,
  X,
} from "@phosphor-icons/react";
import { Skeleton } from "boneyard-js/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { rollValue } from "../shared/rolling-value";
import { PromoTicket } from "./promo-ticket";
import type {
  CartDrawerCopy,
  CartDrawerFooterCopy,
  CartDrawerHeaderCopy,
  CartItemCopy,
  CartItemSummary,
  HeldPromoCode,
  PointsState,
  PromoNotice,
  PromoState,
} from "./types";

type AppliedPromo = Extract<PromoState, { status: "applied" }>;
type AppliedPoints = Extract<PointsState, { status: "applied" }>;

const COLLAPSE_EASE = "cubic-bezier(0.23,1,0.32,1)";
const CART_ITEM_EXIT_MS = 220;

function normalizePromoNotice(notice: PromoNotice): {
  title: string;
  description?: string;
} {
  return typeof notice === "string" ? { title: notice } : notice;
}

function promoNoticeKey(notice: PromoNotice): string {
  if (typeof notice === "string") return notice;
  return notice.description
    ? `${notice.title}\0${notice.description}`
    : notice.title;
}

/** Height + opacity reveal for promo discount ↔ “Use promo code” swap. */
function PromoSectionReveal({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      style={{ transitionTimingFunction: COLLAPSE_EASE }}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0",
          )}
          style={{ transitionTimingFunction: COLLAPSE_EASE }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type CartItemProps = {
  item: CartItemSummary;
  copy: CartItemCopy;
  loading?: boolean;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  onClickProduct?: () => void;
  className?: string;
};

type CartItemContentProps = Omit<CartItemProps, "loading">;

const CART_ITEM_SKELETON_FIXTURE: CartItemSummary = {
  id: "skeleton",
  name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
  price: "HK$24,500.00",
  quantity: 1,
  maxQuantity: 3,
  status: "default",
};

/**
 * Product / Cart / Cart Item (`4761:1494`, `4765:2301`, `4761:1486`).
 *
 * Displays a single line item in the cart drawer across default,
 * adjusted-quantity, sold-out, catalogue-sale, and product-coupon states.
 * Product coupons show `couponCode` under the price line with the discounted
 * unit price; that cut must not also appear as a footer `PromoState` discount.
 */
function CartItemContent({
  item,
  copy,
  onQuantityChange,
  onRemove,
  onClickProduct,
  className,
}: CartItemContentProps) {
  const isSoldOut = item.status === "soldOut";
  const isAdjusted = item.status === "adjusted";
  const isDiscounted = item.originalPrice != null;
  const [adjustedWarningDismissed, setAdjustedWarningDismissed] =
    useState(false);
  const previousStatusRef = useRef(item.status);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = item.status;
    if (item.status === "adjusted" && previousStatus !== "adjusted") {
      setAdjustedWarningDismissed(false);
    }
    if (item.status !== "adjusted") {
      setAdjustedWarningDismissed(false);
    }
  }, [item.status]);

  const showLowStockWarning = isAdjusted && !adjustedWarningDismissed;

  const handleQuantityChange = (quantity: number) => {
    if (isAdjusted) {
      setAdjustedWarningDismissed(true);
    }
    onQuantityChange?.(quantity);
  };

  return (
    <HStack
      gap="md"
      vAlign="start"
      className={cn("w-full py-2", className)}
      data-slot="cart-item"
      data-status={item.status || "default"}
    >
      {/* Product Image Thumbnail */}
      <button
        type="button"
        onClick={onClickProduct}
        className={cn(
          "relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          isSoldOut && "opacity-50",
        )}
      >
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.imageAlt || item.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
      </button>

      {/* Details & Status Warnings */}
      <VStack gap="xs" className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onClickProduct}
          className={cn(
            "w-full cursor-pointer text-left text-sm font-medium leading-5 text-foreground hover:underline focus-visible:outline-none",
            isSoldOut && "opacity-50",
          )}
        >
          {item.name}
        </button>

        <HStack
          gap="sm"
          vAlign="center"
          className={cn("w-full whitespace-nowrap", isSoldOut && "opacity-50")}
        >
          <span className="text-sm font-normal leading-5 text-foreground">
            {item.price}
          </span>
          {isDiscounted ? (
            <span className="text-sm font-normal leading-5 text-secondary-foreground line-through">
              {item.originalPrice}
            </span>
          ) : null}
        </HStack>

        {item.couponCode != null ? (
          <HStack
            gap="xs"
            vAlign="center"
            className={cn("w-full", isSoldOut && "opacity-50")}
          >
            <span aria-hidden className="shrink-0 text-secondary-foreground">
              <Tag size={14} weight="bold" />
            </span>
            <span className="text-xs leading-4 text-secondary-foreground">
              {item.couponCode}
            </span>
          </HStack>
        ) : null}

        {isSoldOut ? (
          <span className="w-full text-xs font-semibold leading-4 text-destructive">
            {copy.soldOutLabel}
          </span>
        ) : null}

        {showLowStockWarning ? (
          <span className="w-full text-xs font-semibold leading-4 text-secondary-foreground">
            {copy.lowStockWarning}
          </span>
        ) : null}

        {item.remainingLabel != null ? (
          <span
            data-slot="cart-item-remaining"
            className="w-full text-xs font-semibold leading-4 text-destructive"
          >
            {item.remainingLabel}
          </span>
        ) : null}
      </VStack>

      {/* Action: StepperInput or Sold-Out Remove */}
      <div className={cn("shrink-0", !isSoldOut && "w-28")}>
        {isSoldOut ? (
          <IconButton
            size="sm"
            variant="outline"
            aria-label={copy.removeItemLabel}
            onClick={onRemove}
          >
            <Trash aria-hidden size={14} />
          </IconButton>
        ) : (
          <StepperInput
            aria-label={item.name}
            className="w-full"
            decrementAtMinIcon={<Trash aria-hidden />}
            decrementAtMinLabel={copy.removeItemLabel}
            decrementLabel={copy.decreaseQtyLabel}
            incrementLabel={copy.increaseQtyLabel}
            max={item.maxQuantity}
            min={1}
            onDecrementAtMin={onRemove}
            onValueChange={handleQuantityChange}
            size="md"
            value={item.quantity}
          />
        )}
      </div>
    </HStack>
  );
}

const CART_ITEM_FIXTURE = (
  <CartItemContent
    copy={{
      lowStockWarning: "Low stock. Quantity adjusted",
      soldOutLabel: "Sold Out",
      removeItemLabel: "Remove item",
      decreaseQtyLabel: "Decrease quantity",
      increaseQtyLabel: "Increase quantity",
    }}
    item={CART_ITEM_SKELETON_FIXTURE}
    onClickProduct={() => {}}
    onQuantityChange={() => {}}
    onRemove={() => {}}
  />
);

function CartItem({ loading = false, className, ...props }: CartItemProps) {
  if (!loading) {
    return <CartItemContent className={className} {...props} />;
  }

  return (
    <Skeleton
      animate="pulse"
      className={cn("w-full", className)}
      color="#E6E6E6"
      darkColor="rgba(249, 250, 250, 0.05)"
      fixture={CART_ITEM_FIXTURE}
      loading
      name="store-cart-item"
      // Bones are keyed by viewport; the row is narrower than the window.
      select="viewport"
      transition={300}
    >
      <CartItemContent {...props} item={CART_ITEM_SKELETON_FIXTURE} />
    </Skeleton>
  );
}

function CartAmountSkeleton({
  loading,
  children,
  className,
  size = "sm",
}: {
  loading: boolean;
  children: ReactNode;
  className?: string;
  /** Match the footer value’s line box: `sm` = text-sm/leading-5, `lg` = text-base/leading-6. */
  size?: "sm" | "lg";
}) {
  if (!loading) {
    return children;
  }

  return (
    <Skeleton
      animate="pulse"
      className={cn("inline-block", size === "lg" ? "h-6" : "h-5", className)}
      color="#E6E6E6"
      darkColor="rgba(249, 250, 250, 0.05)"
      loading
      name={size === "lg" ? "store-cart-amount-lg" : "store-cart-amount"}
      transition={300}
    >
      {children}
    </Skeleton>
  );
}

type CartDrawerHeaderProps = {
  itemCount: number;
  copy: CartDrawerHeaderCopy;
  onClose: () => void;
  loading?: boolean;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer Header (`4735:6260`).
 *
 * Shows the drawer title, non-sold-out item count badge, and dismissal button.
 */
function CartDrawerHeader({
  itemCount,
  copy,
  onClose,
  loading = false,
  className,
}: CartDrawerHeaderProps) {
  return (
    <HStack
      gap="lg"
      vAlign="center"
      className={cn("w-full shrink-0 px-6 pt-6", className)}
      data-slot="cart-drawer-header"
    >
      <HStack gap="sm" vAlign="center" className="min-w-0 flex-1">
        <h2 className="text-2xl font-semibold leading-8 text-foreground">
          {copy.title}
        </h2>
        {loading ? (
          <Skeleton
            animate="pulse"
            className="inline-block size-7 shrink-0"
            color="#E6E6E6"
            darkColor="rgba(249, 250, 250, 0.05)"
            loading
            name="store-cart-badge"
            transition={300}
          >
            <Badge variant="brand">{itemCount || 0}</Badge>
          </Skeleton>
        ) : itemCount > 0 ? (
          <Badge variant="brand">{itemCount}</Badge>
        ) : null}
      </HStack>
      <IconButton
        size="md"
        variant="outline"
        aria-label={copy.closeCartLabel}
        onClick={onClose}
      >
        <X aria-hidden size={16} />
      </IconButton>
    </HStack>
  );
}

type CartDrawerBodyProps = {
  items: readonly CartItemSummary[];
  copy: CartItemCopy;
  emptyTitle: string;
  emptyDescription?: string;
  loading?: boolean;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer Body (`4735:6493`).
 *
 * Renders the scrollable list of active and sold-out cart items, or the
 * design-system empty state when the cart holds nothing. Exceeding items
 * receive top and bottom scroll-fade mask hints.
 */
function CartDrawerBody({
  items,
  copy,
  emptyTitle,
  emptyDescription,
  loading = false,
  onQuantityChange,
  onRemoveItem,
  onItemClick,
  className,
}: CartDrawerBodyProps) {
  const [exitingIds, setExitingIds] = useState(() => new Set<string>());
  const exitTimersRef = useRef<Map<string, number>>(new Map());
  const isEmpty = items.length === 0 && !loading;

  useEffect(() => {
    return () => {
      for (const timerId of exitTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      exitTimersRef.current.clear();
    };
  }, []);

  // Drop exit bookkeeping if the consumer removed the row another way.
  useEffect(() => {
    const liveIds = new Set(items.map((item) => item.id));
    setExitingIds((prev) => {
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (liveIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
          const timerId = exitTimersRef.current.get(id);
          if (timerId != null) {
            window.clearTimeout(timerId);
            exitTimersRef.current.delete(id);
          }
        }
      }
      return changed ? next : prev;
    });
  }, [items]);

  const requestRemove = (itemId: string) => {
    if (exitingIds.has(itemId)) return;

    if (prefersReducedMotion()) {
      onRemoveItem?.(itemId);
      return;
    }

    setExitingIds((prev) => new Set(prev).add(itemId));
    const timerId = window.setTimeout(() => {
      exitTimersRef.current.delete(itemId);
      // Keep `itemId` in exitingIds until `items` drops it — clearing here
      // would expand the row again for a frame before the parent re-renders.
      onRemoveItem?.(itemId);
    }, CART_ITEM_EXIT_MS);
    exitTimersRef.current.set(itemId, timerId);
  };

  return (
    <VStack
      gap="none"
      className={cn(
        "scroll-fade min-h-0 flex-1 overflow-y-auto px-6 py-6",
        isEmpty && "justify-center",
        className,
      )}
      data-slot="cart-drawer-body"
    >
      {isEmpty ? (
        <EmptyState
          frameless
          title={emptyTitle}
          description={emptyDescription}
          icon={<ShoppingCart aria-hidden weight="regular" />}
        />
      ) : (
        items.map((item, index) => {
          const exiting = exitingIds.has(item.id);
          const hasRowBelow = index < items.length - 1;

          return (
            <div
              key={item.id}
              aria-hidden={exiting}
              className={cn(
                "grid transition-[grid-template-rows] duration-[220ms] motion-reduce:transition-none",
                exiting ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
              )}
              style={{ transitionTimingFunction: COLLAPSE_EASE }}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "transition-[opacity,transform,margin] duration-[220ms] motion-reduce:transition-none",
                    hasRowBelow && !exiting ? "mb-4" : "mb-0",
                    exiting
                      ? "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0"
                      : "translate-y-0 opacity-100",
                  )}
                  style={{ transitionTimingFunction: COLLAPSE_EASE }}
                >
                  <CartItem
                    item={item}
                    copy={copy}
                    loading={loading}
                    onQuantityChange={(q) => onQuantityChange?.(item.id, q)}
                    onRemove={() => requestRemove(item.id)}
                    onClickProduct={() => onItemClick?.(item.id)}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </VStack>
  );
}

type CartDrawerFooterProps = {
  subtotal: ReactNode;
  estimatedTotal: ReactNode;
  shippingEstimate?: ReactNode;
  loading?: boolean;
  promoState?: PromoState;
  /**
   * When set, shown once as a toast (e.g. promo cleared after the cart
   * changed) — same pattern as unavailable item removal. Consumer owns when
   * to set/clear it; not rendered inline. A bare string is the title; an
   * object may add an optional description.
   */
  promoNotice?: PromoNotice;
  /**
   * Points tender. Pass a state object to show Use points; omit or `null` to
   * hide (e.g. while balance is loading). Checkout is members-only — there is
   * no guest checkout path. Does not debit the loyalty ledger; the consumer
   * applies a draft discount only, and the balance moves when the order is paid.
   */
  pointsState?: PointsState | null;
  /** e.g. "You’ve 1,200 pts." — follows the rate in the points field message. */
  pointsBalanceLabel?: ReactNode;
  copy: CartDrawerFooterCopy;
  onPromoStateChange?: (next: PromoState) => void;
  onRemovePromo?: () => void;
  onPointsStateChange?: (next: PointsState) => void;
  onApplyPoints?: (amount: string) => Promise<boolean> | boolean;
  onUseMaxPoints?: () => void;
  onRemovePoints?: () => void;
  /**
   * Starts checkout. May return a promise (e.g. create Shopify session).
   * Checkout is members-only — the app authenticates before opening this
   * drawer or before `onCheckout` runs. Attach the one applied promo code
   * (typed or held) and any points amount to the draft order, then redirect
   * to Shopify. The button stays on the redirecting label until navigation
   * succeeds. On rejection, the button restores and a toast shows
   * `checkoutFailed`. The shared component does not perform the redirect.
   */
  onCheckout?: () => Promise<void> | void;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer Footer (`4791:2773`).
 *
 * Renders subtotal, applied promo/points lines, compact promo-code and Use
 * points rows (typed amount — partial redeem so promo codes can still use
 * points), shipping, estimated total, and checkout. Enter/held-list UI lives
 * in `CartPromoSheet`, not inline here.
 */
function CartDrawerFooter({
  subtotal,
  estimatedTotal,
  shippingEstimate,
  loading = false,
  promoState = { status: "collapsed" },
  promoNotice,
  pointsState = null,
  pointsBalanceLabel,
  copy,
  onPromoStateChange,
  onRemovePromo,
  onPointsStateChange,
  onApplyPoints,
  onUseMaxPoints,
  onRemovePoints,
  onCheckout,
  className,
}: CartDrawerFooterProps) {
  const [pointsInput, setPointsInput] = useState("");
  const [isVerifyingPoints, setIsVerifyingPoints] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pointsInputId = useId();
  const lastAppliedRef = useRef<AppliedPromo | null>(null);
  const lastAppliedPointsRef = useRef<AppliedPoints | null>(null);
  const [discountMounted, setDiscountMounted] = useState(
    promoState.status === "applied",
  );
  const [promoTriggerMounted, setPromoTriggerMounted] = useState(
    promoState.status !== "applied",
  );
  const showPoints = pointsState != null;
  const isPointsApplied = pointsState?.status === "applied";
  const isPointsExpanded = pointsState?.status === "expanded";
  const [pointsCreditMounted, setPointsCreditMounted] =
    useState(isPointsApplied);
  const lastToastedPromoNoticeRef = useRef<string | null>(null);
  const [pointsTriggerMounted, setPointsTriggerMounted] = useState(
    showPoints && !isPointsApplied,
  );

  const isApplied = promoState.status === "applied";
  if (isApplied) {
    lastAppliedRef.current = promoState;
  }
  if (isPointsApplied && pointsState) {
    lastAppliedPointsRef.current = pointsState;
  }
  const appliedView = isApplied ? promoState : lastAppliedRef.current;
  const appliedPointsView = isPointsApplied
    ? pointsState
    : lastAppliedPointsRef.current;
  const pointsErrorMessage =
    pointsState?.status === "expanded" ? pointsState.error : undefined;
  const pointsContext =
    pointsErrorMessage ??
    (pointsBalanceLabel || copy.pointsRateLabel || onUseMaxPoints ? (
      <span>
        {copy.pointsRateLabel ? `${copy.pointsRateLabel}.` : null}
        {copy.pointsRateLabel && pointsBalanceLabel ? " " : null}
        {pointsBalanceLabel}
        {onUseMaxPoints ? (
          <>
            {copy.pointsRateLabel || pointsBalanceLabel ? " " : null}
            <Link
              size="xs"
              variant="secondary"
              render={<button type="button" />}
              disabled={isVerifyingPoints || isRedirecting}
              onClick={onUseMaxPoints}
            >
              {copy.useMaxPoints}
            </Link>
          </>
        ) : null}
      </span>
    ) : undefined);

  // Keep discount / promo-trigger mounted through collapse so height can animate.
  useEffect(() => {
    if (isApplied) {
      setDiscountMounted(true);
      const timeoutId = window.setTimeout(
        () => setPromoTriggerMounted(false),
        200,
      );
      return () => window.clearTimeout(timeoutId);
    }
    setPromoTriggerMounted(true);
    const timeoutId = window.setTimeout(() => setDiscountMounted(false), 200);
    return () => window.clearTimeout(timeoutId);
  }, [isApplied]);

  useEffect(() => {
    if (!showPoints) {
      setPointsCreditMounted(false);
      setPointsTriggerMounted(false);
      return;
    }
    if (isPointsApplied) {
      setPointsCreditMounted(true);
      const timeoutId = window.setTimeout(
        () => setPointsTriggerMounted(false),
        200,
      );
      return () => window.clearTimeout(timeoutId);
    }
    setPointsTriggerMounted(true);
    const timeoutId = window.setTimeout(
      () => setPointsCreditMounted(false),
      200,
    );
    return () => window.clearTimeout(timeoutId);
  }, [showPoints, isPointsApplied]);

  // Cart re-fetch disables checkout — clear a stale redirecting state.
  useEffect(() => {
    if (loading) setIsRedirecting(false);
  }, [loading]);

  // Promo cleared — toast once per notice value (same rail as unavailable items).
  useEffect(() => {
    if (!promoNotice) {
      lastToastedPromoNoticeRef.current = null;
      return;
    }
    const key = promoNoticeKey(promoNotice);
    if (lastToastedPromoNoticeRef.current === key) return;
    lastToastedPromoNoticeRef.current = key;
    const { title, description } = normalizePromoNotice(promoNotice);
    toast.warning(title, description ? { description } : undefined);
  }, [promoNotice]);

  const handleApplyPoints = async () => {
    if (!pointsInput.trim() || isVerifyingPoints || isRedirecting) return;
    setIsVerifyingPoints(true);
    try {
      const success = await onApplyPoints?.(pointsInput.trim());
      if (success) {
        setPointsInput("");
      }
    } finally {
      setIsVerifyingPoints(false);
    }
  };

  const handleCheckout = async () => {
    if (loading || isRedirecting) return;
    setIsRedirecting(true);
    try {
      await onCheckout?.();
      // Stay on Redirecting… — consumer navigates (e.g. Shopify checkout).
    } catch {
      setIsRedirecting(false);
      toast.error(copy.checkoutFailed);
    }
  };

  const handlePointsKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyPoints();
    }
  };

  return (
    <VStack
      gap="lg"
      className={cn("w-full shrink-0 border-t border-border p-6", className)}
      data-slot="cart-drawer-footer"
    >
      {/* Line items: subtotal → promo slot → points slot → shipping */}
      <VStack gap="none" className="w-full">
        <HStack
          gap="none"
          vAlign="center"
          className="w-full justify-between pb-2"
        >
          <span className="text-sm font-normal leading-5 text-foreground">
            {copy.subtotalLabel}
          </span>
          <CartAmountSkeleton loading={loading}>
            {rollValue(subtotal, {
              className: "text-sm font-normal leading-5 text-foreground",
              loading,
            })}
          </CartAmountSkeleton>
        </HStack>

        {/* Promo slot — trigger or applied Discount; always above points */}
        {discountMounted || promoTriggerMounted ? (
          <VStack gap="none" className="w-full">
            {discountMounted && appliedView ? (
              <PromoSectionReveal open={isApplied}>
                <HStack
                  gap="none"
                  vAlign="center"
                  className="w-full justify-between pb-2"
                >
                  <HStack gap="xs" vAlign="center">
                    <span className="text-sm font-normal leading-5 text-foreground">
                      Discount ({appliedView.code})
                    </span>
                    {onRemovePromo ? (
                      <Link
                        size="sm"
                        variant="error"
                        render={<button type="button" />}
                        onClick={onRemovePromo}
                      >
                        {copy.removePromo}
                      </Link>
                    ) : null}
                  </HStack>
                  <CartAmountSkeleton loading={loading}>
                    <span className="text-sm font-medium leading-5 text-success">
                      {appliedView.discountAmount}
                    </span>
                  </CartAmountSkeleton>
                </HStack>
              </PromoSectionReveal>
            ) : null}

            {promoTriggerMounted && onPromoStateChange ? (
              <PromoSectionReveal open={!isApplied}>
                <VStack gap="none" className="w-full pb-2">
                  <button
                    type="button"
                    onClick={() => onPromoStateChange?.({ status: "expanded" })}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 text-left text-sm font-normal leading-5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span>{copy.usePromoCode}</span>
                    <span className="inline-flex items-center gap-0.5 text-secondary-foreground">
                      <span>{copy.selectOrEnterPromoCode}</span>
                      <CaretRight aria-hidden size={14} />
                    </span>
                  </button>
                </VStack>
              </PromoSectionReveal>
            ) : null}
          </VStack>
        ) : null}

        {/* Points slot — trigger or applied credit; always below promo */}
        {showPoints && (pointsCreditMounted || pointsTriggerMounted) ? (
          <VStack gap="none" className="w-full">
            {pointsCreditMounted && appliedPointsView ? (
              <PromoSectionReveal open={isPointsApplied}>
                <HStack
                  gap="none"
                  vAlign="center"
                  className="w-full justify-between pb-2"
                >
                  <HStack gap="xs" vAlign="center">
                    <span className="text-sm font-normal leading-5 text-foreground">
                      {copy.pointsLabel}
                    </span>
                    {onRemovePoints ? (
                      <Link
                        size="sm"
                        variant="error"
                        render={<button type="button" />}
                        onClick={onRemovePoints}
                      >
                        {copy.removePoints}
                      </Link>
                    ) : null}
                  </HStack>
                  <CartAmountSkeleton loading={loading}>
                    <span className="text-sm font-medium leading-5 text-success">
                      {appliedPointsView.amountLabel}
                    </span>
                  </CartAmountSkeleton>
                </HStack>
              </PromoSectionReveal>
            ) : null}

            {pointsTriggerMounted ? (
              <PromoSectionReveal open={!isPointsApplied}>
                <VStack gap="none" className="w-full pb-2">
                  {onPointsStateChange ? (
                    <button
                      type="button"
                      aria-expanded={!!isPointsExpanded}
                      onClick={() =>
                        onPointsStateChange({
                          status: isPointsExpanded ? "collapsed" : "expanded",
                        })
                      }
                      className="inline-flex w-fit cursor-pointer items-center gap-1 text-left text-sm font-normal leading-5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <span>{copy.usePoints}</span>
                      <span
                        className={cn(
                          "inline-flex shrink-0 text-secondary-foreground transition-transform duration-200 motion-reduce:transition-none",
                          isPointsExpanded && "rotate-180",
                        )}
                        style={{ transitionTimingFunction: COLLAPSE_EASE }}
                      >
                        <CaretDown aria-hidden size={14} />
                      </span>
                    </button>
                  ) : null}

                  <PromoSectionReveal open={!!isPointsExpanded}>
                    {onApplyPoints ? (
                      <HStack gap="sm" vAlign="start" className="w-full pt-2">
                        <div className="flex-1">
                          <NumberInput
                            id={pointsInputId}
                            placeholder={copy.pointsPlaceholder}
                            unit={copy.pointsUnit}
                            value={pointsInput}
                            min={0}
                            step={1}
                            status={pointsErrorMessage ? "error" : "default"}
                            message={pointsContext}
                            disabled={isVerifyingPoints}
                            onClear={
                              pointsInput
                                ? () => {
                                    setPointsInput("");
                                    if (pointsErrorMessage) {
                                      onPointsStateChange?.({
                                        status: "expanded",
                                      });
                                    }
                                  }
                                : undefined
                            }
                            onChange={(e) => {
                              setPointsInput(e.target.value);
                              if (pointsErrorMessage) {
                                onPointsStateChange?.({ status: "expanded" });
                              }
                            }}
                            onKeyDown={handlePointsKeyDown}
                          />
                        </div>
                        <Button
                          size="md"
                          variant="outline"
                          disabled={!pointsInput.trim() || isVerifyingPoints}
                          loading={isVerifyingPoints}
                          onClick={handleApplyPoints}
                        >
                          {copy.applyPoints}
                        </Button>
                      </HStack>
                    ) : (
                      pointsContext
                    )}
                  </PromoSectionReveal>
                </VStack>
              </PromoSectionReveal>
            ) : null}
          </VStack>
        ) : null}

        <HStack gap="none" vAlign="center" className="w-full justify-between">
          <span className="text-sm font-normal leading-5 text-foreground">
            {copy.shippingLabel}
          </span>
          <span className="text-sm font-normal leading-5 text-foreground">
            {shippingEstimate ?? copy.shippingValue}
          </span>
        </HStack>
      </VStack>

      <HStack gap="none" vAlign="center" className="w-full justify-between">
        <span className="text-base font-semibold leading-6 text-foreground">
          {copy.estimatedTotalLabel}
        </span>
        <CartAmountSkeleton loading={loading} size="lg">
          {rollValue(estimatedTotal, {
            className: "text-base font-semibold leading-6 text-foreground",
            loading,
          })}
        </CartAmountSkeleton>
      </HStack>

      <Button
        size="lg"
        variant="default"
        disabled={loading || isRedirecting}
        loading={isRedirecting}
        onClick={handleCheckout}
        className="w-full"
      >
        {isRedirecting ? copy.checkoutRedirecting : copy.checkoutButton}
      </Button>
    </VStack>
  );
}

type CartPromoSheetProps = {
  open: boolean;
  copy: CartDrawerFooterCopy;
  promoState: PromoState;
  /** Live held codes only — omit expired/void; filtering is consumer-owned. */
  heldPromoCodes?: readonly HeldPromoCode[] | null;
  selectedHeldPromoId?: string | null;
  onClose: () => void;
  onPromoStateChange?: (next: PromoState) => void;
  onApplyPromo?: (code: string) => Promise<boolean> | boolean;
  onSelectHeldPromo?: (id: string) => void;
  /** Opens Account → Loyalty (new tab when the page exists). */
  onBrowseLoyalty?: () => void;
};

/**
 * Nested promo-code sheet: enter a code and/or pick held codes.
 * Parent cart stays mounted behind; no second backdrop.
 * Held list is live codes only — expired codes are never shown here.
 */
function CartPromoSheet({
  open,
  copy,
  promoState,
  heldPromoCodes = null,
  selectedHeldPromoId = null,
  onClose,
  onPromoStateChange,
  onApplyPromo,
  onSelectHeldPromo,
  onBrowseLoyalty,
}: CartPromoSheetProps) {
  const [promoInput, setPromoInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputId = useId();
  const errorMessage =
    promoState.status === "expanded" ? promoState.error : undefined;

  const showHeldSection = heldPromoCodes != null;
  const heldList =
    heldPromoCodes && heldPromoCodes.length > 0 ? heldPromoCodes : null;
  const applicableHeld = heldList?.filter((c) => c.applicable) ?? [];
  const inapplicableHeld = heldList?.filter((c) => !c.applicable) ?? [];

  useEffect(() => {
    if (!open) {
      setPromoInput("");
      setIsVerifying(false);
    }
  }, [open]);

  const handleApply = async () => {
    if (!promoInput.trim() || isVerifying) return;
    setIsVerifying(true);
    try {
      const success = await onApplyPromo?.(promoInput.trim());
      if (success) {
        setPromoInput("");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <VStack
      role="dialog"
      aria-modal="true"
      aria-label={copy.promoSheetTitle}
      aria-hidden={!open}
      gap="none"
      data-slot="cart-promo-sheet"
      className={cn(
        "absolute inset-0 z-20 bg-sidebar transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        open
          ? "translate-x-0"
          : "pointer-events-none translate-x-full motion-reduce:translate-x-0 motion-reduce:opacity-0",
      )}
    >
      <HStack gap="sm" vAlign="center" className="w-full shrink-0 px-6 pt-4">
        <IconButton
          size="md"
          variant="outline"
          aria-label={copy.promoSheetBackLabel}
          onClick={onClose}
        >
          <CaretLeft aria-hidden size={16} />
        </IconButton>
        <h2 className="min-w-0 flex-1 text-2xl font-semibold leading-8 text-foreground">
          {copy.promoSheetTitle}
        </h2>
      </HStack>

      <VStack gap="md" className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {onApplyPromo ? (
          <HStack gap="sm" vAlign="start" className="w-full">
            <div className="flex-1">
              <TextInput
                id={inputId}
                placeholder={copy.promoPlaceholder}
                value={promoInput}
                status={errorMessage ? "error" : "default"}
                message={errorMessage}
                disabled={isVerifying || !open}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (errorMessage) {
                    onPromoStateChange?.({ status: "expanded" });
                  }
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              size="md"
              variant="outline"
              disabled={!promoInput.trim() || isVerifying || !open}
              loading={isVerifying}
              onClick={handleApply}
            >
              {copy.applyPromo}
            </Button>
          </HStack>
        ) : null}

        {showHeldSection ? (
          heldList ? (
            <VStack gap="md" className="w-full">
              {applicableHeld.length > 0 ? (
                <VStack gap="sm" className="w-full">
                  <span className="text-xs font-medium leading-4 text-secondary-foreground">
                    {copy.yourPromoCodes}
                  </span>
                  <VStack gap="sm" className="w-full">
                    {applicableHeld.map((code) => {
                      const selected = selectedHeldPromoId === code.id;
                      return (
                        <PromoTicket
                          key={code.id}
                          code={code}
                          selected={selected}
                          action={
                            onSelectHeldPromo ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isVerifying || !open}
                                onClick={() => onSelectHeldPromo(code.id)}
                              >
                                {copy.applyHeldPromo}
                              </Button>
                            ) : null
                          }
                        />
                      );
                    })}
                  </VStack>
                </VStack>
              ) : null}

              {inapplicableHeld.length > 0 ? (
                <VStack gap="sm" className="w-full">
                  <span className="text-xs font-medium leading-4 text-secondary-foreground">
                    {copy.notValidPromoCodes}
                  </span>
                  <VStack gap="sm" className="w-full">
                    {inapplicableHeld.map((code) => (
                      <PromoTicket key={code.id} code={code} muted />
                    ))}
                  </VStack>
                </VStack>
              ) : null}
            </VStack>
          ) : (
            <EmptyState
              compact
              title={copy.noHeldPromoCodes}
              icon={<Tag aria-hidden weight="regular" />}
              actions={
                onBrowseLoyalty ? (
                  <Button
                    size="md"
                    variant="secondary"
                    disabled={!open}
                    onClick={onBrowseLoyalty}
                  >
                    {copy.browseLoyaltyOffers}
                  </Button>
                ) : undefined
              }
            />
          )
        ) : null}
      </VStack>
    </VStack>
  );
}

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: readonly CartItemSummary[];
  subtotal: ReactNode;
  estimatedTotal: ReactNode;
  shippingEstimate?: ReactNode;
  copy: CartDrawerCopy;
  loading?: boolean;
  onFetchStatusAndPrice?: () => Promise<void> | void;
  promoState?: PromoState;
  /** Live held codes only — omit expired/void; filtering is consumer-owned. */
  heldPromoCodes?: readonly HeldPromoCode[] | null;
  selectedHeldPromoId?: string | null;
  /**
   * When set, the footer shows it once as a toast (promo cleared after cart
   * change) — same pattern as unavailable item removal. A bare string is the
   * title; an object may add an optional description.
   */
  promoNotice?: PromoNotice;
  pointsState?: PointsState | null;
  pointsBalanceLabel?: ReactNode;
  onPromoStateChange?: (next: PromoState) => void;
  onApplyPromo?: (code: string) => Promise<boolean> | boolean;
  onRemovePromo?: () => void;
  onSelectHeldPromo?: (id: string) => void;
  onPointsStateChange?: (next: PointsState) => void;
  onApplyPoints?: (amount: string) => Promise<boolean> | boolean;
  onUseMaxPoints?: () => void;
  onRemovePoints?: () => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
  /** Opens Account → Loyalty from the empty held-promo state (new tab when wired). */
  onBrowseLoyalty?: () => void;
  onCheckout?: () => Promise<void> | void;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer (`4735:6493` & `4674:3831`).
 *
 * Slide-out cart drawer with a dimmed backdrop overlay.
 *
 * Behavior & Anatomy:
 * - On cart open: fetches product status and price info via `onFetchStatusAndPrice` or controlled `loading`.
 *   During loading, each cart item, header count badge, subtotal, discount amount, points amount, and estimated total
 *   display as Boneyard skeleton; the empty-cart empty state is hidden; checkout is disabled.
 * - Footer: after subtotal (and any applied Discount / Points lines), compact
 *   **Promo code · Select or enter code ›** and **Use points** rows align like
 *   shipping. Promo opens a nested sheet; points stay typed amount on this layer
 *   (partial redeem). Shopper copy never says “coupon”. Checkout attaches both
 *   to the Shopify draft.
 * - Scroll-fade: body displays shadcn scroll-fade top/bottom masks when items overflow.
 * - Dismissal: Closes via ✕ button, clicking dimmed backdrop overlay, or pressing Esc.
 *   When the nested promo sheet is open, Esc and backdrop collapse the sheet first;
 *   a second Esc or backdrop click closes the cart.
 * - Empty state: Renders the design-system empty state with no action button, hides
 *   the count badge in the header, and hides the footer entirely.
 * - Active item badge: Counts active items, excluding sold-out items.
 * - Unavailable (delisted) items: After open loading ends, lines with status
 *   `unavailable` are removed via `onRemoveItem` without rendering a row, and
 *   a single design-system toast uses `copy.unavailableItemsRemoved`.
 */
function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  estimatedTotal,
  shippingEstimate,
  copy,
  loading,
  onFetchStatusAndPrice,
  promoState,
  heldPromoCodes,
  selectedHeldPromoId,
  promoNotice,
  pointsState,
  pointsBalanceLabel,
  onPromoStateChange,
  onApplyPromo,
  onRemovePromo,
  onSelectHeldPromo,
  onPointsStateChange,
  onApplyPoints,
  onUseMaxPoints,
  onRemovePoints,
  onQuantityChange,
  onRemoveItem,
  onItemClick,
  onBrowseLoyalty,
  onCheckout,
  className,
}: CartDrawerProps) {
  const [isFetching, setIsFetching] = useState(false);
  const removedUnavailableIdsRef = useRef(new Set<string>());
  const didToastUnavailableRef = useRef(false);
  const onFetchStatusAndPriceRef = useRef(onFetchStatusAndPrice);
  onFetchStatusAndPriceRef.current = onFetchStatusAndPrice;

  // Fetch status and price only when the drawer opens — not on parent
  // re-renders while open (e.g. quantity changes recreating inline handlers).
  useEffect(() => {
    if (!open) {
      setIsFetching(false);
      removedUnavailableIdsRef.current.clear();
      didToastUnavailableRef.current = false;
      return;
    }

    const fetchStatusAndPrice = onFetchStatusAndPriceRef.current;
    if (fetchStatusAndPrice) {
      setIsFetching(true);
      let isMounted = true;
      Promise.resolve(fetchStatusAndPrice()).finally(() => {
        if (isMounted) {
          setIsFetching(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [open]);

  const isLoading = loading ?? isFetching;

  // After open loading ends, silently drop delisted catalogue lines and toast once per open.
  useEffect(() => {
    if (!open || isLoading) return;

    const unavailableIds = items
      .filter(
        (item) =>
          item.status === "unavailable" &&
          !removedUnavailableIdsRef.current.has(item.id),
      )
      .map((item) => item.id);
    if (unavailableIds.length === 0) return;

    for (const id of unavailableIds) {
      removedUnavailableIdsRef.current.add(id);
      onRemoveItem?.(id);
    }
    if (!didToastUnavailableRef.current) {
      didToastUnavailableRef.current = true;
      toast.warning(
        copy.unavailableItemsRemoved,
        copy.unavailableItemsRemovedDescription
          ? { description: copy.unavailableItemsRemovedDescription }
          : undefined,
      );
    }
  }, [
    open,
    isLoading,
    items,
    onRemoveItem,
    copy.unavailableItemsRemoved,
    copy.unavailableItemsRemovedDescription,
  ]);

  // Never paint unavailable rows (sold-out treatment stays for `soldOut` only).
  const visibleItems = items.filter((item) => item.status !== "unavailable");

  // Exclude sold-out items from badge count
  const activeItemCount = visibleItems.filter(
    (i) => i.status !== "soldOut",
  ).length;
  const isEmpty = visibleItems.length === 0;

  const promoSheetOpen = promoState?.status === "expanded";

  return (
    <Drawer
      open={open}
      swipeDirection="right"
      onOpenChange={(next) => {
        if (next) return;
        // Esc / outside press: collapse nested promo before closing the cart.
        if (promoSheetOpen) {
          onPromoStateChange?.({ status: "collapsed" });
          return;
        }
        onClose();
      }}
    >
      {/* Slide-out Drawer Surface (`4735:6493`) — chrome lives on DS Drawer */}
      <DrawerContent aria-label={copy.header.title} className={className}>
        {/* Parent cart layer — tucks back while nested promo sheet is open */}
        <VStack
          gap="none"
          data-nested-drawer-open={promoSheetOpen || undefined}
          className={cn(
            "relative min-h-0 flex-1 transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
            promoSheetOpen
              ? "origin-left scale-[0.96] opacity-80 pointer-events-none"
              : "scale-100 opacity-100",
          )}
        >
          <CartDrawerHeader
            itemCount={activeItemCount}
            copy={copy.header}
            loading={isLoading}
            onClose={onClose}
          />

          <CartDrawerBody
            items={visibleItems}
            copy={copy.item}
            emptyTitle={copy.emptyTitle}
            emptyDescription={copy.emptyDescription}
            loading={isLoading}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
            onItemClick={onItemClick}
          />

          {!isEmpty ? (
            <CartDrawerFooter
              subtotal={subtotal}
              estimatedTotal={estimatedTotal}
              shippingEstimate={shippingEstimate}
              loading={isLoading}
              promoState={promoState}
              promoNotice={promoNotice}
              pointsState={pointsState}
              pointsBalanceLabel={pointsBalanceLabel}
              copy={copy.footer}
              onPromoStateChange={onPromoStateChange}
              onRemovePromo={onRemovePromo}
              onPointsStateChange={onPointsStateChange}
              onApplyPoints={onApplyPoints}
              onUseMaxPoints={onUseMaxPoints}
              onRemovePoints={onRemovePoints}
              onCheckout={onCheckout}
            />
          ) : null}
        </VStack>

        {/* Nested promo sheet — parent stays mounted; no second backdrop */}
        <CartPromoSheet
          open={promoSheetOpen}
          copy={copy.footer}
          promoState={promoState ?? { status: "collapsed" }}
          heldPromoCodes={heldPromoCodes}
          selectedHeldPromoId={selectedHeldPromoId}
          onClose={() => onPromoStateChange?.({ status: "collapsed" })}
          onPromoStateChange={onPromoStateChange}
          onApplyPromo={onApplyPromo}
          onSelectHeldPromo={onSelectHeldPromo}
          onBrowseLoyalty={onBrowseLoyalty}
        />
      </DrawerContent>
    </Drawer>
  );
}

export type {
  CartDrawerBodyProps,
  CartDrawerFooterProps,
  CartDrawerHeaderProps,
  CartDrawerProps,
  CartItemProps,
  CartPromoSheetProps,
};
export {
  CartDrawer,
  CartDrawerBody,
  CartDrawerFooter,
  CartDrawerHeader,
  CartItem,
  CartPromoSheet,
};
