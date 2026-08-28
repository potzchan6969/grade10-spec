import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Link } from "@grade10/design-system/components/forms/link";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { Center } from "@grade10/design-system/components/layout/center";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/sonner";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, Plus, Trash, X } from "@phosphor-icons/react";
import { Skeleton } from "boneyard-js/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type {
  CartDrawerCopy,
  CartDrawerFooterCopy,
  CartDrawerHeaderCopy,
  CartItemCopy,
  CartItemSummary,
  PromoState,
} from "./types";

type AppliedPromo = Extract<PromoState, { status: "applied" }>;

const COLLAPSE_EASE = "cubic-bezier(0.23,1,0.32,1)";
const CART_ITEM_EXIT_MS = 220;

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

type CartItemSlotProps = {
  onClick?: () => void;
  className?: string;
};

/**
 * Product / Cart / Cart Item Slot (`4735:5944`).
 *
 * An interactive empty placeholder row filling the baseline grid up to 5 slots.
 * Clicking closes the drawer and guides the shopper to browse more items.
 */
function CartItemSlot({ onClick, className }: CartItemSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/slot w-full shrink-0 cursor-pointer rounded-lg border border-dashed border-border bg-muted p-6 transition-all hover:bg-muted-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
      data-slot="cart-item-slot"
      aria-label="Add more items to cart"
    >
      <Center className="h-4 text-secondary-foreground">
        <Plus aria-hidden size={20} weight="regular" />
      </Center>
    </button>
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
  originalPrice: "HK$26,000.00",
  quantity: 1,
  maxQuantity: 3,
  status: "default",
};

/**
 * Product / Cart / Cart Item (`4761:1494`, `4765:2301`, `4761:1486`).
 *
 * Displays a single line item in the cart drawer across default,
 * adjusted-quantity, and sold-out states.
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
      gap="sm"
      vAlign="center"
      className={cn("w-full shrink-0 px-6 pt-4", className)}
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
  loading?: boolean;
  emptySlotCount?: number;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
  onBrowseMore?: () => void;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer Body (`4735:6493`).
 *
 * Renders the scrollable list of active and sold-out cart items,
 * followed by baseline placeholder slots up to the minimum visual count.
 * Exceeding items receive top and bottom scroll-fade mask hints.
 */
function CartDrawerBody({
  items,
  copy,
  loading = false,
  emptySlotCount = 0,
  onQuantityChange,
  onRemoveItem,
  onItemClick,
  onBrowseMore,
  className,
}: CartDrawerBodyProps) {
  const emptySlots = Array.from({ length: emptySlotCount }, (_, i) => i);
  const [exitingIds, setExitingIds] = useState(() => new Set<string>());
  const exitTimersRef = useRef<Map<string, number>>(new Map());

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
        "scroll-fade min-h-0 flex-1 overflow-y-auto px-6 py-4",
        className,
      )}
      data-slot="cart-drawer-body"
    >
      {/* Populated Items */}
      {items.map((item, index) => {
        const exiting = exitingIds.has(item.id);
        const hasRowBelow =
          index < items.length - 1 || (!loading && emptySlotCount > 0);

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
      })}

      {/* Baseline Placeholder Slots — hidden while status/price are fetching */}
      {!loading
        ? emptySlots.map((slotIdx, index) => (
            <div
              key={`empty-slot-${slotIdx}`}
              className={cn(index < emptySlots.length - 1 && "mb-4")}
            >
              <CartItemSlot onClick={onBrowseMore} />
            </div>
          ))
        : null}
    </VStack>
  );
}

type CartDrawerFooterProps = {
  subtotal: ReactNode;
  estimatedTotal: ReactNode;
  shippingEstimate?: ReactNode;
  loading?: boolean;
  promoState?: PromoState;
  copy: CartDrawerFooterCopy;
  onPromoStateChange?: (next: PromoState) => void;
  onApplyPromo?: (code: string) => Promise<boolean> | boolean;
  onRemovePromo?: () => void;
  /**
   * Starts checkout. May return a promise (e.g. create Shopify session).
   * The button stays on the redirecting label until navigation or rejection;
   * the shared component does not perform the redirect itself.
   */
  onCheckout?: () => Promise<void> | void;
  className?: string;
};

/**
 * Product / Cart / Cart Drawer Footer (`4791:2773`).
 *
 * Renders subtotal, applied discount, shipping estimate, estimated total,
 * collapsible promo code input with validation, and the checkout action.
 */
function CartDrawerFooter({
  subtotal,
  estimatedTotal,
  shippingEstimate,
  loading = false,
  promoState = { status: "collapsed" },
  copy,
  onPromoStateChange,
  onApplyPromo,
  onRemovePromo,
  onCheckout,
  className,
}: CartDrawerFooterProps) {
  const [promoInput, setPromoInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const inputId = useId();
  const lastAppliedRef = useRef<AppliedPromo | null>(null);
  const [discountMounted, setDiscountMounted] = useState(
    promoState.status === "applied",
  );
  const [promoTriggerMounted, setPromoTriggerMounted] = useState(
    promoState.status !== "applied",
  );

  const isExpanded = promoState.status === "expanded";
  const isApplied = promoState.status === "applied";
  if (isApplied) {
    lastAppliedRef.current = promoState;
  }
  const appliedView = isApplied ? promoState : lastAppliedRef.current;
  const errorMessage =
    promoState.status === "expanded" ? promoState.error : undefined;

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

  // Cart re-fetch disables checkout — clear a stale redirecting state.
  useEffect(() => {
    if (loading) setIsRedirecting(false);
  }, [loading]);

  const handleApply = async () => {
    if (!promoInput.trim() || isVerifying || isRedirecting) return;
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

  const handleCheckout = async () => {
    if (loading || isRedirecting) return;
    setIsRedirecting(true);
    try {
      await onCheckout?.();
      // Stay on Redirecting… — consumer navigates (e.g. Shopify checkout).
    } catch {
      setIsRedirecting(false);
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
      gap="md"
      className={cn("w-full shrink-0 border-t border-border p-6", className)}
      data-slot="cart-drawer-footer"
    >
      {/* Line Items Summary */}
      <VStack gap="none" className="w-full">
        {/* Subtotal */}
        <HStack
          gap="none"
          vAlign="center"
          className="w-full justify-between pb-2"
        >
          <span className="text-sm font-normal leading-5 text-foreground">
            {copy.subtotalLabel}
          </span>
          <CartAmountSkeleton loading={loading}>
            <span className="text-sm font-normal leading-5 text-foreground">
              {subtotal}
            </span>
          </CartAmountSkeleton>
        </HStack>

        {/* Applied Promo Discount — collapses when removed */}
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
                <Link
                  size="sm"
                  variant="error"
                  render={<button type="button" />}
                  onClick={onRemovePromo}
                >
                  {copy.removePromo}
                </Link>
              </HStack>
              <CartAmountSkeleton loading={loading}>
                <span className="text-sm font-medium leading-5 text-success">
                  {appliedView.discountAmount}
                </span>
              </CartAmountSkeleton>
            </HStack>
          </PromoSectionReveal>
        ) : null}

        {/* Shipping */}
        <HStack gap="none" vAlign="center" className="w-full justify-between">
          <span className="text-sm font-normal leading-5 text-foreground">
            {copy.shippingLabel}
          </span>
          <span className="text-sm font-normal leading-5 text-foreground">
            {shippingEstimate ?? copy.shippingValue}
          </span>
        </HStack>
      </VStack>

      {/* Estimated Total & Promo Code Section */}
      <VStack gap="none" className="w-full">
        <HStack gap="none" vAlign="center" className="w-full justify-between">
          <span className="text-base font-semibold leading-6 text-foreground">
            {copy.estimatedTotalLabel}
          </span>
          <CartAmountSkeleton loading={loading} size="lg">
            <span className="text-base font-semibold leading-6 text-foreground">
              {estimatedTotal}
            </span>
          </CartAmountSkeleton>
        </HStack>

        {/* Promo trigger — expands back in when discount is cleared */}
        {promoTriggerMounted ? (
          <PromoSectionReveal open={!isApplied}>
            <VStack gap="none" className="w-full pt-2">
              <button
                type="button"
                onClick={() =>
                  onPromoStateChange?.({
                    status: isExpanded ? "collapsed" : "expanded",
                  })
                }
                className="group/promo inline-flex w-fit cursor-pointer items-center gap-1 text-sm font-normal text-foreground underline focus-visible:outline-none"
              >
                <span>{copy.usePromoCode}</span>
                <span
                  className={cn(
                    "inline-flex transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                    isExpanded && "rotate-180",
                  )}
                >
                  <CaretDown aria-hidden size={14} />
                </span>
              </button>

              <PromoSectionReveal open={isExpanded}>
                <HStack gap="sm" vAlign="start" className="w-full pt-2">
                  <div className="flex-1">
                    <TextInput
                      id={inputId}
                      placeholder={copy.promoPlaceholder}
                      value={promoInput}
                      status={errorMessage ? "error" : "default"}
                      message={errorMessage}
                      disabled={isVerifying}
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
                    disabled={!promoInput.trim() || isVerifying}
                    loading={isVerifying}
                    onClick={handleApply}
                  >
                    {copy.applyPromo}
                  </Button>
                </HStack>
              </PromoSectionReveal>
            </VStack>
          </PromoSectionReveal>
        ) : null}
      </VStack>

      {/* Checkout Action */}
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
  onPromoStateChange?: (next: PromoState) => void;
  onApplyPromo?: (code: string) => Promise<boolean> | boolean;
  onRemovePromo?: () => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
  onBrowseMore?: () => void;
  onCheckout?: () => Promise<void> | void;
  className?: string;
};

const MIN_ROW_BASELINE = 5;

/**
 * Product / Cart / Cart Drawer (`4735:6493` & `4674:3831`).
 *
 * Slide-out cart drawer with a dimmed backdrop overlay.
 *
 * Behavior & Anatomy:
 * - On cart open: fetches product status and price info via `onFetchStatusAndPrice` or controlled `loading`.
 *   During loading, each cart item, header count badge, subtotal, discount amount, and estimated total
 *   display as Boneyard skeleton; empty item slots are hidden; checkout is disabled.
 * - Scroll-fade: body displays shadcn scroll-fade top/bottom masks when items overflow.
 * - Dismissal: Closes via ✕ button, clicking dimmed backdrop overlay, or pressing Esc.
 * - Minimum 5-slot grid: When fewer than 5 items are in the cart, empty slot placeholders
 *   are rendered to maintain the visual baseline. When 5 or more items are present, no
 *   empty slots are rendered and the list scrolls.
 * - Empty state: Renders 5 empty slot placeholders, hides the count badge in the header,
 *   and hides the footer entirely.
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
  onPromoStateChange,
  onApplyPromo,
  onRemovePromo,
  onQuantityChange,
  onRemoveItem,
  onItemClick,
  onBrowseMore,
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
      toast(copy.unavailableItemsRemoved);
    }
  }, [open, isLoading, items, onRemoveItem, copy.unavailableItemsRemoved]);

  // Never paint unavailable rows (sold-out treatment stays for `soldOut` only).
  const visibleItems = items.filter((item) => item.status !== "unavailable");

  // Exclude sold-out items from badge count
  const activeItemCount = visibleItems.filter(
    (i) => i.status !== "soldOut",
  ).length;
  const isEmpty = visibleItems.length === 0;

  // Compute placeholder slots up to 5-row baseline
  const emptySlotCount = Math.max(0, MIN_ROW_BASELINE - visibleItems.length);

  // Esc key dismissal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      {/* Dimmed backdrop overlay (`4674:3832`) */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={copy.header.closeCartLabel}
        onClick={onClose}
        className={cn(
          // Keep mounted while closed so opacity can animate out — do not
          // toggle visibility (that snaps the exit).
          "fixed inset-0 cursor-pointer border-0 bg-overlay backdrop-blur-[calc(var(--blur-xl)/2)] transition-[opacity,backdrop-filter] motion-reduce:transition-none",
          open
            ? "opacity-100 duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            : "opacity-0 duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
        )}
      />

      {/* Slide-out Drawer Surface (`4735:6493`) */}
      <VStack
        role="dialog"
        aria-modal="true"
        aria-label={copy.header.title}
        gap="none"
        className={cn(
          // iOS-like drawer curve; open a beat longer than close.
          "fixed top-2 right-2 bottom-2 z-10 w-(--container-md) overflow-hidden rounded-4xl border border-border/50 bg-sidebar/95 backdrop-blur-xl shadow-lg transition-transform will-change-transform motion-reduce:transition-none motion-reduce:will-change-auto",
          open
            ? "translate-x-0 duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            : "translate-x-[calc(100%+0.5rem)] duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
        )}
      >
        {/* Header */}
        <CartDrawerHeader
          itemCount={activeItemCount}
          copy={copy.header}
          loading={isLoading}
          onClose={onClose}
        />

        {/* Scrollable Body */}
        <CartDrawerBody
          items={visibleItems}
          copy={copy.item}
          loading={isLoading}
          emptySlotCount={emptySlotCount}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
          onItemClick={onItemClick}
          onBrowseMore={() => {
            onClose();
            onBrowseMore?.();
          }}
        />

        {/* Footer: Hidden entirely in empty state */}
        {!isEmpty ? (
          <CartDrawerFooter
            subtotal={subtotal}
            estimatedTotal={estimatedTotal}
            shippingEstimate={shippingEstimate}
            loading={isLoading}
            promoState={promoState}
            copy={copy.footer}
            onPromoStateChange={onPromoStateChange}
            onApplyPromo={onApplyPromo}
            onRemovePromo={onRemovePromo}
            onCheckout={onCheckout}
          />
        ) : null}
      </VStack>
    </div>
  );
}

export type {
  CartDrawerBodyProps,
  CartDrawerFooterProps,
  CartDrawerHeaderProps,
  CartDrawerProps,
  CartItemProps,
  CartItemSlotProps,
};
export {
  CartDrawer,
  CartDrawerBody,
  CartDrawerFooter,
  CartDrawerHeader,
  CartItem,
  CartItemSlot,
};
