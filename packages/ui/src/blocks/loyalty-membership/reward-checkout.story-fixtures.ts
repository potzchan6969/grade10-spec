import { fn, within } from "storybook/test";
import { BALANCE } from "./fixtures";

/** The copy and args every RewardCheckout story shares. */
export const checkoutMeta = {
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: {
      useAt: "Use at",
      validFor: "Valid for",
      pointBalance: "Point Balance",
      points: "pts",
      pointCount: (points: number) => points.toLocaleString("en-HK"),
      pointsNeeded: (missing: number) =>
        `Need ${missing.toLocaleString("en-HK")} more pts`,
      redeemFor: (cost: number) => `Redeem for ${cost} pts`,
      cancel: "Cancel",
      redeemedCouponTitle: "Added to your coupons",
      redeemedItemTitle: "Ready to Collect",
      done: "Done",
      viewCoupons: "View Coupons",
    },
    balance: BALANCE,
    open: true,
    onOpenChange: fn(),
    onRedeem: fn(),
    onDone: fn(),
    viewCouponsHref: "#coupons",
  },
};

/* The surface renders in a portal; query the document, not the canvas root. */
export const sheet = () => within(document.body);
