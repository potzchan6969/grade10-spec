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

- **URL** — `grade10.com/profile/orders/<order-id>`

## What it looks like

::story{id="store-order-detail-orderdetails--item-coupon" title="One order, in detail"}

::story{id="store-order-detail-orderdetails--no-optional-groups" title="An order with only supplied facts"}

## In flight

::changes{spec="grade10-site/store/order-detail"}

::changes{spec="grade10-site/commerce/order-status"}

::changes{spec="shared/ui/store-order-detail"}
