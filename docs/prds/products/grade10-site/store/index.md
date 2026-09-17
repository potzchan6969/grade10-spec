---
title: Store
icon: storefront
---

The Grade10 store is the trading-card and collectibles shop at
`grade10.com/store`.

## Where It Is Open

**Not open to the public yet** — the store's pages are carried in
development and staging, and on no lane the public reaches —
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Who Owns What

- **Shopify owns**
  1. Product catalog
  2. Inventory
  3. Orders
  4. Shipping
- **Grade10 owns**
  1. Account system
  2. Membership and loyalty program
  3. Rewards

## Users

- **Collectors** — browse and buy
- **Shopkeepers** — sell at the till in the physical shop, through the
  Shopify app on an iPad
- **Stock keepers** — manage inventory in the Shopify dashboard
- **Admins** — manage store-wide configuration in the admin panel: account
  suspension, discount promotions, the coupon catalog

:::detail{title="Code map" for="engineer"}
- **Storefront** — `apps/frontend/grade10`, composing `@grade10/ui` blocks
- **Data layers** — `packages/grade10-store/frontend`
- **Backend** — grade10's `store` worker, also mounting the till gateway and
  the loyalty programme's Shopify half
- **Store admin** — `@grade10/store-admin-frontend`, rendered by the merged
  grade10 admin panel
- **Loyalty admin** — `@grade10/loyalty-admin-frontend`, rendered by the same
  panel
- **Commerce architecture** —
  [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md):
  Shopify, the order machine, the recovery ladder, refunds
- **Loyalty architecture** —
  [docs/architecture/loyalty.md](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md):
  ledger, tiers, expiry, claw-back, the fulfilment drain
- **Checkout domain** —
  [docs/architecture/checkout-domain.md](https://github.com/9gag/grade10/blob/main/docs/architecture/checkout-domain.md):
  hosting Shopify's checkout under our own name
:::
