import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CouponList } from "./coupon-list";
import type { CouponItem } from "./types";

const COPY = {
  label: "Your coupons",
  maskedCode: "Hidden",
  spent: "Spent",
  void: "Void",
  expired: "Expired",
};

const markup = (items: readonly CouponItem[]) =>
  renderToStaticMarkup(
    createElement(CouponList, {
      copy: COPY,
      state: { status: "ready", data: items },
    }),
  );

const STORE: CouponItem = {
  id: "store",
  amount: "HK$50 off",
  code: "SUMMER-50",
  expiry: "Until 1 Dec",
  status: "open",
};

const REWARD: CouponItem = {
  id: "reward",
  amount: "HK$20 off",
  expiry: "Until 1 Dec",
  status: "open",
};

describe("CouponList", () => {
  it("grade10-site-loyalty-programme-SC-243 shows a store coupon's code and none for a reward coupon", () => {
    const html = markup([STORE, REWARD]);
    expect(html).toContain("SUMMER-50");
    /* The reward coupon carries no code — its stub falls back to its own
     * expiry. */
    expect(html.match(/Until 1 Dec/g)).toHaveLength(2);
  });

  it("draws a Use now control only where an open coupon carries a scan", () => {
    const html = markup([
      {
        ...REWARD,
        qrCode: {
          value: "g10:redeem:reward:7Q2M",
          altText: "Show this code to store staff",
          toggleLabel: "Use now",
        },
      },
      STORE,
    ]);
    expect(html.match(/Use now/g)).toHaveLength(1);
  });
});
