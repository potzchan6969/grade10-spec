---
title: Order Details
spec: grade10-site/store/order-detail
order: 7
---

Order Details is one private account of a Store purchase. The address names an
order, while the owner check decides whether anything can be shown; an unknown
id and another collector's id deliberately look the same.

The first delivery shows only facts the typed Store order already carries:
items, quoted and paid totals, refunds, fulfilment, estimates, and tracking.
Payment method, address, discounts, shipping, tax, product images, and loyalty
stay absent until the Store supplies them. Omitting those groups is more useful
than filling the designed page with claims the frontend cannot prove.

## Order

🚧 **Owner-only address** — a signed-in collector sees one order at
`grade10.com/profile/orders/<order-id>`; sign-in keeps the collector at that
address; an unknown order and another collector's order look the same

🚧 **Known facts** — the page shows the supplied order identity, items, money,
address, payment and refund facts, and leaves each missing fact absent

🚧 **Progress and tracking** — a collector sees the Store-supplied fulfilment
state and can follow a safe carrier address when one is supplied

🚧 **Read states** — loading, localized failure with Retry, and not-found stay
distinct at the same address

## Order Summary

🚧 When the settled order applied points, Order Summary shows a **Points**
credit after Discount — label names how many were deducted (for example
`Points (100 pts)`), value is the money credit in the same success style as the
cart drawer — and omits that row when no points were applied.

**Amount marks** — summary lines use `$` with two decimals (`$1,770.00`),
except bare `$0` when the amount is zero; Total keeps `HK$` with two decimals
(`HK$1,704.50`)

## Designs

::story{id="store-order-detail-orderdetails--item-coupon" title="One order, in detail"}

::story{id="store-order-detail-orderdetails--with-points-credit" title="Points credit on the summary"}

::story{id="store-order-detail-orderdetails--no-optional-groups" title="An order with only supplied facts"}
