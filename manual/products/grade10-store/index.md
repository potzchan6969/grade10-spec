---
title: Store
---

The Grade10 store is the trading-card and collectibles shop at
`grade10.com/store`. A collector lands on the main page, filters and sorts the
product listing, opens a product details page, picks a grade, adds it to the
cart and checks out. Shopify owns the catalogue, prices the checkout and takes
the money; Grade10 keeps its own order of record and shows the buyer every
order they have placed.

Purchases feed the points programme, which has its own section:
[Membership](/p/membership).

## Who uses it

- **Collectors** browse and buy.
- **Staff** work the orders queue in the admin panel and the till in the
  physical shop.
- **Admins** run the store from the console. Every operator move is
  permission-gated, second-factor-gated, and appended to a tamper-evident
  trail.

## How the pieces fit

Shopify is authoritative for products, inventory and the money actually
charged. The store keeps the order, its items and its events in its own
database, and a settlement webhook is what moves an order from pending to paid
— honoured only when the recorded checkout reference carries the event's cart
token, because an order id on a webhook is a claim rather than proof.

When an order settles, the store hands the goods amount to the membership
programme over a service binding. The programme prices it into points and never
learns who the buyer is beyond a user id: names and email addresses stay in the
identity system behind that system's own permission.

Main Page, Product Listing and Product Details Page carry a durable spec.
Cart, Checkout and Orders ship ahead of one, and their pages say so.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023" title="Store page — the main page assembly"}

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
