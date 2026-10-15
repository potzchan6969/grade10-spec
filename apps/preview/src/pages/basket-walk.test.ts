import { describe, expect, it } from "vitest";
import {
  type BasketSettings,
  DEFAULT_BASKET,
  priceBasket,
} from "./basket-walk";

/** The cart Screens list the box first, then the card. */
const SEALED_LINE = 0;
const GRADED_LINE = 1;

const price = (settings: Partial<BasketSettings>) =>
  priceBasket({ ...DEFAULT_BASKET, ...settings });

describe("priceBasket", () => {
  it("takes an order coupon off the list price when no site discount runs", () => {
    const basket = price({});
    expect(basket.outcome).toBe("applied");
    expect(basket.subtotal).toBe("HK$39,200.00");
    expect(basket.promoState).toEqual({
      status: "applied",
      label: "Discount (GRD-50-7Q2M)",
      discountAmount: "−HK$50.00",
    });
    expect(basket.estimatedTotal).toBe("HK$39,150.00");
  });

  it("stacks the code on the sale, which stays on its line", () => {
    const basket = price({ siteDiscount: "product-sale" });
    expect(basket.outcome).toBe("stacked");
    expect(basket.items[GRADED_LINE]).toMatchObject({
      price: "HK$34,200.00",
      originalPrice: "HK$38,000.00",
    });
    expect(basket.estimatedTotal).toBe("HK$35,350.00");
  });

  it("lifts the sale where the code replaces it, and a product code sits on its line", () => {
    const basket = price({
      siteDiscount: "product-sale",
      coupon: "product",
      shopAnswer: "replace",
    });
    expect(basket.outcome).toBe("replaced");
    expect(basket.items[GRADED_LINE]).toMatchObject({
      price: "HK$34,200.00",
      originalPrice: "HK$38,000.00",
      couponCode: "GRD-10-PSA1",
    });
    expect(basket.promoState).toEqual({ status: "collapsed" });
    expect(basket.estimatedTotal).toBe("HK$35,400.00");
  });

  it("takes a stacked product code off the sale price", () => {
    const basket = price({ siteDiscount: "product-sale", coupon: "product" });
    expect(basket.items[GRADED_LINE]).toMatchObject({ price: "HK$30,780.00" });
    expect(basket.subtotal).toBe("HK$31,980.00");
  });

  it("keeps the order discount and names the refusal when the shop refuses the code", () => {
    const basket = price({
      siteDiscount: "order-discount",
      shopAnswer: "refuse",
    });
    expect(basket.outcome).toBe("refused");
    expect(basket.orderDiscounts).toEqual([
      { label: "Discount (Spend HK$30,000, 5% off)", amount: "−HK$1,960.00" },
    ]);
    expect(basket.promoState).toEqual({
      status: "expanded",
      error: "Cannot combine with the sale on this order",
    });
    expect(basket.heldCode?.applicable).toBe(false);
    expect(basket.estimatedTotal).toBe("HK$37,240.00");
  });

  it("holds a code the basket is too small for, saying how much more it needs", () => {
    const basket = price({ coupon: "too-small" });
    expect(basket.outcome).toBe("not-valid");
    expect(basket.heldCode).toMatchObject({
      applicable: false,
      inapplicableReason: "Add HK$10,800.00 more to use this promo code",
    });
    expect(basket.estimatedTotal).toBe("HK$39,200.00");
  });

  it("takes points after the discounts and the code, and trims a promise larger than the bill", () => {
    expect(price({ points: "500" }).estimatedTotal).toBe("HK$38,650.00");
    const trimmed = price({ points: "max", balance: "50000" });
    expect(trimmed.pointsAsked).toBe(50000);
    expect(trimmed.pointsTaken).toBe(39150);
    expect(trimmed.estimatedTotal).toBe("HK$0.00");
    expect(price({ points: "max" }).pointsTaken).toBe(1250);
  });

  it("leaves a sold-out line out of the subtotal, and a product code with nothing to cut is held", () => {
    const basket = price({ lines: "sold-out", coupon: "product" });
    expect(basket.items[GRADED_LINE].status).toBe("soldOut");
    expect(basket.subtotal).toBe("HK$1,200.00");
    expect(basket.heldCode?.inapplicableReason).toBe(
      "Nothing in this order is a graded card",
    );
  });

  it("prices the boxes the shop filled when it had fewer than asked", () => {
    const basket = price({ lines: "adjusted", coupon: "none" });
    expect(basket.items[SEALED_LINE]).toMatchObject({
      quantity: 2,
      status: "adjusted",
    });
    expect(basket.subtotal).toBe("HK$40,400.00");
  });

  it("meets a site discount and a code in 20 ways, each one the cart Scenario's settings reach", () => {
    const ways = new Set<string>();
    for (const siteDiscount of [
      "none",
      "product-sale",
      "order-discount",
    ] as const)
      for (const coupon of ["none", "order", "product", "too-small"] as const)
        for (const shopAnswer of ["stack", "replace", "refuse"] as const)
          ways.add(
            `${siteDiscount}/${coupon}/${price({ siteDiscount, coupon, shopAnswer }).outcome}`,
          );
    expect(ways.size).toBe(20);
  });

  it("prices every basket the cart Scenario's settings reach", () => {
    const totals: Record<string, string> = {};
    for (const points of ["500", "none"] as const)
      for (const siteDiscount of [
        "none",
        "product-sale",
        "order-discount",
      ] as const)
        for (const coupon of ["none", "order", "product", "too-small"] as const)
          for (const shopAnswer of ["stack", "replace", "refuse"] as const) {
            const basket = price({ siteDiscount, coupon, shopAnswer, points });
            if (basket.outcome === "refused")
              expect(basket.promoState).toEqual({
                status: "expanded",
                error: "Cannot combine with the sale on this order",
              });
            totals[
              `${points} pts · ${siteDiscount} · ${coupon} · ${basket.outcome}`
            ] = basket.estimatedTotal;
          }
    for (const settings of [
      { siteDiscount: "product-sale", points: "max", balance: "1250" },
      { siteDiscount: "product-sale", points: "max", balance: "50000" },
      { coupon: "product", lines: "sold-out", points: "500" },
      { siteDiscount: "order-discount", lines: "adjusted", points: "500" },
    ] as const) {
      const basket = price(settings);
      expect(basket.pointsState?.status).toBe("applied");
      totals[Object.values(settings).join(" · ")] = basket.estimatedTotal;
    }
    expect(totals).toMatchInlineSnapshot(`
      {
        "500 pts · none · none · no-code": "HK$38,700.00",
        "500 pts · none · order · applied": "HK$38,650.00",
        "500 pts · none · product · applied": "HK$34,900.00",
        "500 pts · none · too-small · not-valid": "HK$38,700.00",
        "500 pts · order-discount · none · no-code": "HK$36,740.00",
        "500 pts · order-discount · order · refused": "HK$36,740.00",
        "500 pts · order-discount · order · replaced": "HK$38,650.00",
        "500 pts · order-discount · order · stacked": "HK$36,690.00",
        "500 pts · order-discount · product · refused": "HK$36,740.00",
        "500 pts · order-discount · product · replaced": "HK$34,900.00",
        "500 pts · order-discount · product · stacked": "HK$33,130.00",
        "500 pts · order-discount · too-small · not-valid": "HK$36,740.00",
        "500 pts · product-sale · none · no-code": "HK$34,900.00",
        "500 pts · product-sale · order · refused": "HK$34,900.00",
        "500 pts · product-sale · order · replaced": "HK$38,650.00",
        "500 pts · product-sale · order · stacked": "HK$34,850.00",
        "500 pts · product-sale · product · refused": "HK$34,900.00",
        "500 pts · product-sale · product · replaced": "HK$34,900.00",
        "500 pts · product-sale · product · stacked": "HK$31,480.00",
        "500 pts · product-sale · too-small · not-valid": "HK$34,900.00",
        "none pts · none · none · no-code": "HK$39,200.00",
        "none pts · none · order · applied": "HK$39,150.00",
        "none pts · none · product · applied": "HK$35,400.00",
        "none pts · none · too-small · not-valid": "HK$39,200.00",
        "none pts · order-discount · none · no-code": "HK$37,240.00",
        "none pts · order-discount · order · refused": "HK$37,240.00",
        "none pts · order-discount · order · replaced": "HK$39,150.00",
        "none pts · order-discount · order · stacked": "HK$37,190.00",
        "none pts · order-discount · product · refused": "HK$37,240.00",
        "none pts · order-discount · product · replaced": "HK$35,400.00",
        "none pts · order-discount · product · stacked": "HK$33,630.00",
        "none pts · order-discount · too-small · not-valid": "HK$37,240.00",
        "none pts · product-sale · none · no-code": "HK$35,400.00",
        "none pts · product-sale · order · refused": "HK$35,400.00",
        "none pts · product-sale · order · replaced": "HK$39,150.00",
        "none pts · product-sale · order · stacked": "HK$35,350.00",
        "none pts · product-sale · product · refused": "HK$35,400.00",
        "none pts · product-sale · product · replaced": "HK$35,400.00",
        "none pts · product-sale · product · stacked": "HK$31,980.00",
        "none pts · product-sale · too-small · not-valid": "HK$35,400.00",
        "order-discount · adjusted · 500": "HK$37,830.00",
        "product · sold-out · 500": "HK$700.00",
        "product-sale · max · 1250": "HK$34,100.00",
        "product-sale · max · 50000": "HK$0.00",
      }
    `);
  });
});
