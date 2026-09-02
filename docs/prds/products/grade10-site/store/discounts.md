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
- **Coupons** — minted by the store, or by a member spending points
  1. **Order coupon** — an amount off the whole order; a single-use code
     `PREFIX-XXXXXXXX` with an expiry, typed like any discount code
  2. **Product coupon** — an amount off each unit of named products
  3. **Gift** — an item added free once the goods pass a threshold
  4. **Membership coupon** — an order coupon a member buys with points at
     **HKD 1** a point, listed on their membership page:
     [Coupons](/p/grade10-site/loyalty/coupons), earned as
     [Points Earning](/p/grade10-site/loyalty/points-earning) says, bought on
     the [Rewards](/p/grade10-site/loyalty/rewards) menu
- **Points as credits** — at checkout, points come straight off the goods at
  **HKD 1** a point, capped at the balance and at the goods after coupons,
  never at shipping or tax
  1. **Nothing is held** — points stay spendable until an order is paid; a
     checkout walked away from costs nothing, and a newer checkout replaces
     the older one
  2. **Where it is on** — development and staging; production `TBC`
- **Together** — a sale price, product coupons, a gift, and one order code
  ride on one order; ❓ points beside an order code on the same order

## What it looks like

::story{id="store-cart-cartdrawer--promo-code-interaction" title="A code typed in the cart"}

::story{id="store-order-detail-orderdetails--item-coupon" title="An order with a product coupon"}

::story{id="store-order-detail-orderdetails--order-discount" title="An order with an order coupon"}

:::detail{title="How the draft order carries it" for="engineer"}
- **One draft order per checkout** — never a Storefront cart; a line carries
  variant and quantity only, so the shop prices at payment and nothing is
  locked or reserved
- **Customer** — the draft's purchasing entity is the member's paired Shopify
  customer, so a customer-scoped code evaluates
- **Points** — one order-level fixed applied discount titled Points; nothing
  is held, a newer checkout deletes the older draft, and points spent
  elsewhere first capture short at settlement
- **Order coupon** — a single-use shop discount code, prefix and an
  eight-character suffix, minted with its expiry when the coupon is issued
  and sent in the draft's discount codes; a code the shop drops deletes the
  draft and refuses the checkout
- **Product coupon** — a fixed per-unit applied discount on the line, titled
  Coupon
- **Gift** — a line added at live price with its whole value taken off, by
  the same per-line discount
- **Shipping** — a carrier service callback quotes the flat rule from the
  pre-discount goods, [Shipping](/p/grade10-site/store/shipping); ❓ the
  staging shop's plan refuses to register it
- **Where** — `packages/grade10-store/backend/src/services/coupons`,
  `services/pointsTender.ts`, `adapters/shopify/shopifyProvider.ts`,
  `services/shipping/rates.ts`, `worker/routes/carrier.ts`
:::
