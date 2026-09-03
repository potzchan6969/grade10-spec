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

The POS terminal (Shopify POS UI extension) rings the sale on Shopify's own cart, and the store records it as one order per till session:
- Staff identify the member (QR on the member card, short code, or exact email) and attach them as the cart's customer
- The store plans the sale from the cart's lines, the coupons chosen, and the points asked for, answers what to put on the cart, and writes one order row for the session; a re-plan rewrites the same row
- The terminal writes the order id on the cart first, then the discounts:
  - Gift (line added, per-item 100% off custom discount)
  - Per-product coupon (per-product custom discount)
  - Points as credits (order-wise custom discount titled `Points`)
  - Order coupon (Shopify Discount code, the shop evaluates it)
- The store trims the promise to what the cart actually took; a discount that did not land is not one the member pays for
- Nothing is held: points leave the balance when the paid order lands, never at apply; the promise expires after an hour, and the shop's cart can still collect after that
- Undo before tender: staff remove every discount from the cart, then the order id, and the promise is dropped
- Switches: the terminal, email spend, phone identify and spend, cart identify and spend, each a per-shop flag the operator flips from the admin console; QR and short code carry no switch of their own, so stopping the counter means the terminal switch

## What it looks like

::story{id="store-cart-cartdrawer--promo-code-interaction" title="A code typed in the cart"}

::story{id="store-order-detail-orderdetails--item-coupon" title="An order with a product coupon"}

::story{id="store-order-detail-orderdetails--order-discount" title="An order with an order coupon"}

:::detail{title="How the draft order carries it" for="engineer"}
- **Where** — `packages/grade10-store/backend/src/services/coupons`,
  `services/pointsTender.ts`, `adapters/shopify/shopifyProvider.ts`,
  `services/shipping/rates.ts`, `worker/routes/carrier.ts`
:::
