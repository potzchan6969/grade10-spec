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

const codesIn = (items: readonly CouponItem[]) => {
  const html = renderToStaticMarkup(
    createElement(CouponList, {
      copy: COPY,
      state: { status: "ready", data: items },
    }),
  );
  return [...html.matchAll(/data-slot="coupon-list-code"[^>]*>([^<]*)</g)].map(
    (match) => match[1],
  );
};

describe("CouponList", () => {
  it("grade10-site-loyalty-programme-SC-243 shows a store coupon's code and none for a reward coupon", () => {
    expect(
      codesIn([
        {
          id: "store",
          amount: "HK$50 off",
          code: "SUMMER-50",
          expiry: "Until 1 Dec",
          status: "open",
        },
        {
          id: "reward",
          amount: "HK$20 off",
          expiry: "Until 1 Dec",
          status: "open",
        },
      ]),
    ).toEqual(["SUMMER-50"]);
  });
});
