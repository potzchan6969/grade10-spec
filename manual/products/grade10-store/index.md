---
title: Grade10 Store
summary: The trading-card shop — a Shopify catalogue, Grade10's own order record, and a points programme riding on both.
---

The Grade10 store is the trading-card and collectibles shop at `grade10.com/store`.
A collector lands on a front door, browses a listing they can filter and sort,
opens one card's own page, picks a grade and adds it to the cart. Checkout is
Shopify's: Shopify owns the catalogue, prices its own checkout and takes the
money, while Grade10 keeps its own order of record and shows the buyer every
order they have placed.

Riding on the same purchases is the loyalty programme — points, tiers and a
reward menu. A member earns on qualifying spend, their tier changes the rate
they earn at, and points buy things off a menu. The same points also spend at
the counter of the physical shop.

## Who uses it

- **Collectors** browse, buy, and run their own membership.
- **Staff** work the till in the physical shop — attaching a member to a sale so
  it earns, spending points on their behalf, handing over collected rewards —
  and work the orders queue in the admin panel.
- **Admins** run the programme from the console: adjusting points, granting and
  revoking invitation tiers, editing the reward menu, reading liability, working
  the fulfilment queue. Every operator move is permission-gated,
  second-factor-gated, and appended to a tamper-evident trail.

## How the pieces fit

Shopify is authoritative for products, inventory and the money actually charged.
The store keeps the order, its items and its events in its own database, and a
settlement webhook is what moves an order from pending to paid — honoured only
when the recorded checkout reference carries the event's cart token, because an
order id on a webhook is a claim rather than proof.

When an order settles, the store hands loyalty the goods amount over a service
binding. Loyalty prices it into points and never learns who the buyer is beyond
a user id: names and email addresses stay in the identity system behind that
system's own permission.

Four store surfaces carry a durable spec — the front door, the browse listing, a
card's own page, and loyalty. Checkout and orders ship without one, and their
pages here say so.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023" title="Store page — the front door assembly"}

:::detail{title="Where the code lives" for="engineer"}
The storefront is `apps/frontend/grade10` composing `@grade10/ui` blocks; its
data layers sit in `packages/grade10-store/frontend`. The backend is grade10's
`store` worker, which also mounts the till gateway and the loyalty programme's
Shopify half. Operator surfaces are `@grade10/store-admin-frontend` and
`@grade10/loyalty-admin-frontend`, rendered by the merged grade10 admin panel.

- [Commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
  — Shopify, the order machine, the recovery ladder, refunds
- [Loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
  — ledger, tiers, expiry, claw-back, the fulfilment drain
- [Checkout domain](https://github.com/9gag/grade10/blob/main/docs/architecture/checkout-domain.md)
  — hosting Shopify's checkout under our own name
:::
