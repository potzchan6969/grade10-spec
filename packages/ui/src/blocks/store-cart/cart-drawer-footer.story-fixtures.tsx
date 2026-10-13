/** Shared fixtures and meta pieces for the CartDrawerFooter story files. */
import type { Decorator, Meta } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { fn } from "storybook/test";
import type { CartDrawerFooter } from "./cart-drawer";
import { DEFAULT_CART_COPY, parseStoryMoney } from "./fixtures";
import type { PointsState, PromoState } from "./types";

const heldPromoSelectionSpy = fn();
const interactiveTypedPromoSpy = fn();
const pendingDraftPromoSpy = fn();
const pendingBrowseSpy = fn();

function promoDiscountAmount(promo: PromoState): string | null {
  return promo.status === "applied" ? String(promo.discountAmount) : null;
}

function pointsCreditHkd(points: PointsState): number | null {
  return points.status === "applied"
    ? parseStoryMoney(String(points.amountLabel))
    : null;
}

const container: Decorator[] = [
  (Story) => (
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar">
      <Story />
    </div>
  ),
];

/** Host that nests the promo sheet the same way CartDrawer does (parent tucks). */
function FooterWithPromoNest({
  children,
  promoOpen,
  sheet,
}: {
  children: ReactNode;
  promoOpen: boolean;
  sheet: ReactNode;
}) {
  return (
    <div className="relative h-[640px] overflow-hidden">
      <div
        data-nested-drawer-open={promoOpen || undefined}
        className={[
          "flex h-full flex-col justify-end transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          promoOpen
            ? "origin-left scale-[0.96] opacity-80 pointer-events-none"
            : "scale-100 opacity-100",
        ].join(" ")}
      >
        {children}
      </div>
      {sheet}
    </div>
  );
}

/** The meta pieces every CartDrawerFooter story file shares. */
const footerMeta = {
  decorators: container,
  args: {
    subtotal: "HK$42,700.00",
    estimatedTotal: "HK$42,700.00",
    shippingEstimate: "Calculated at checkout",
    promoState: { status: "collapsed" },
    pointsState: { status: "collapsed" },
    pointsBalanceLabel: "You’ve 1,200 pts.",
    copy: DEFAULT_CART_COPY.footer,
    onPromoStateChange: fn(),
    onRemovePromo: fn(),
    onPointsStateChange: fn(),
    onApplyPoints: fn(),
    onUseMaxPoints: fn(),
    onRemovePoints: fn(),
    onCheckout: fn(),
  },
} satisfies Pick<Meta<typeof CartDrawerFooter>, "decorators" | "args">;

export {
  container,
  FooterWithPromoNest,
  footerMeta,
  heldPromoSelectionSpy,
  interactiveTypedPromoSpy,
  pendingBrowseSpy,
  pendingDraftPromoSpy,
  pointsCreditHkd,
  promoDiscountAmount,
};
