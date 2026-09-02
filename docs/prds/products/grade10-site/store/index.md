---
title: Store
---

The Grade10 store is the trading-card and collectibles shop at
`grade10.com/store`. Shopify owns the catalogue, the checkout price and the
money; Grade10 keeps its own order of record and shows the buyer every order
they have placed.

- **Shopify owns** — products, inventory, checkout pricing, the money charged
- **Grade10 owns** — the order, its items and its events, in its own database
- **Points** — purchases feed the programme, which has its own section:
  [Membership](/p/grade10-site/loyalty)
- **Specs** — Main Page, Product Listing and Product Details Page carry a
  durable spec; Cart, Checkout and Orders ship ahead of one, and their pages
  say so

## Who uses it

- **Collectors** — browse and buy
- **Staff** — work the orders queue in the admin panel and the till in the
  physical shop
- **Admins** — run the store from the console; every operator move is
  permission-gated, second-factor-gated, and appended to a tamper-evident
  trail

## How a purchase moves

:::flow{title="From landing to points"}
## Collector — Finds a card
Lands on the main page, filters and sorts the product listing, opens a product
details page, picks a grade.

## Collector — Adds it to the cart and checks out
Shopify prices the checkout and takes the money.

## Shopify — Settles the order
- **Settlement webhook** — moves the order from pending to paid
- **Honoured only** when the recorded checkout reference carries the event's
  cart token (an order id on a webhook is a claim, not proof)

## Store — Prices the goods into points
- **Goods amount** — handed to the membership programme over a service binding
- **Buyer identity** — the programme learns a user id and nothing more; names
  and email addresses stay in the identity system behind its own permission
:::

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023" title="Store page — the main page assembly"}

:::detail{title="Where the code lives" for="engineer"}
- **Storefront** — `apps/frontend/grade10`, composing `@grade10/ui` blocks;
  data layers in `packages/grade10-store/frontend`
- **Backend** — grade10's `store` worker, which also mounts the till gateway
  and the loyalty programme's Shopify half
- **Operator surfaces** — `@grade10/store-admin-frontend` and
  `@grade10/loyalty-admin-frontend`, rendered by the merged grade10 admin
  panel
- [Commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
  — Shopify, the order machine, the recovery ladder, refunds
- [Loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
  — ledger, tiers, expiry, claw-back, the fulfilment drain
- [Checkout domain](https://github.com/9gag/grade10/blob/main/docs/architecture/checkout-domain.md)
  — hosting Shopify's checkout under our own name
:::
