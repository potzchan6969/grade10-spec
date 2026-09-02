---
title: Orders
spec: grade10-site/store/order-status
order: 6
---

Your Orders is where a collector follows an order after paying: every order on
one page, and a page for each.

- **Your Orders** — Active above Past, each order a card: number, status,
  date, total, its items; Track Order once a shipment is on its way; an
  account with no orders sees an empty state
- **Status** — one badge per order, from what Shopify says about the payment
  and the shipment
  1. **Processing** — paid, not shipped; a just-placed order reads this
     within seconds
  2. **Shipped** — on its way; Track Order opens the carrier's page
  3. **Completed** — shipped, paid, and closed; never a delivery confirmation
  4. **Canceled**
  5. **Refunded** — in full or in part
- **Order details** — the items, each with its own coupon where one applied;
  subtotal, discount, shipping, tax, total; the card or wallet that paid; the
  shipping address, or the pickup address with its opening hours; loyalty
  points to earn, then earned
- **Two numbers** — what the collector paid and what the store quoted stay
  apart; shipping and tax sit between them
- **URL** — `TBC`

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534" title="Order history, filled"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424" title="Order history, empty"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1683" title="Order details"}

::story{id="pages-order-history-page--filled" title="Your Orders, whole"}

::story{id="store-order-history-orderhistory--empty" title="An account with no orders"}

::story{id="store-order-detail-orderdetails--item-coupon" title="One order, in detail"}

## In flight

::changes{spec="grade10-site/store/order-status"}

::changes{spec="shared/ui/store-order-history"}
