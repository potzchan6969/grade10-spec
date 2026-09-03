---
title: Discounts
order: 20
---

A discount is money off the bill. Four kinds reach a collector, and every one
lands on the order through the same Shopify draft order.

- **Sale price** — set on the product in Shopify; the listing, the card, and
  the cart show the price and, struck through, the price it was
- **Discount code** — typed in the cart drawer; the total shows the cut, and a
  code the shop refuses stops the checkout with the code named
- **Rewards** — redeemed by points, or from special events (e.g. birthday),
  selected to use in cart OR auto-applied
  1. **Order coupon** — an amount off the whole order; a single-use code
     `PREFIX-XXXXXXXX` with an expiry, bind to a Shopify Discount
  2. **Product coupon** — an amount off each unit of named products,
     custom per-product discount on the draft order, NOT bind to Shopify
     Discount
  3. **Gift** — an item added free once the goods pass a threshold,
     custom per-item discount on the draft order, NOT bind to Shopify
     Discount
- **Points as credits** — **HKD 1** per point
  1. **Nothing is held** — points stay spendable until an order is paid; a
     checkout walked away from costs nothing, and a newer checkout replaces
     the older one
  2. **Where it is on** — everywhere


## Online Draft Order Mechanism

A Draft Order is created for each checkout, with the following discounts (if any):
- Discount code (Shopify Discount code)
- Order coupon (Shopify Discount code)
- Per-product coupon (per-product custom discount)
- Points as credits (order-wise discount)
- Gift (per-item 100% off custom discount)
- [Shipping](/p/grade10-site/store/shipping) fee is determined by custom carrier service API, conditionally free


## On-site Mechanism

TBC

## What it looks like

::story{id="store-cart-cartdrawer--promo-code-interaction" title="A code typed in the cart"}

::story{id="store-order-detail-orderdetails--item-coupon" title="An order with a product coupon"}

::story{id="store-order-detail-orderdetails--order-discount" title="An order with an order coupon"}

:::detail{title="How the draft order carries it" for="engineer"}
- **Where** — `packages/grade10-store/backend/src/services/coupons`,
  `services/pointsTender.ts`, `adapters/shopify/shopifyProvider.ts`,
  `services/shipping/rates.ts`, `worker/routes/carrier.ts`
:::
