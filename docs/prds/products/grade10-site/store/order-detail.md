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

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654" title="Order details"}

::story{id="store-order-detail-orderdetails--item-coupon" title="One order, in detail"}

## In flight

::changes{spec="grade10-site/store/order-detail"}

::changes{spec="grade10-site/store/order-status"}

::changes{spec="shared/ui/store-order-detail"}
