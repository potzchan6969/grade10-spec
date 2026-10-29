---
title: Store
icon: storefront
---

The Grade10 store is the trading-card and collectibles shop at
`grade10.com/store`.

## Where It Is Open

- **Not open to the public yet** — carried in development and staging, on no
  lane the public reaches — [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

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

:::detail{title="How it works" for="engineer"}
- **Storefront** — the Grade10 site, composed from the shared store blocks
- **Backend** — Grade10's store service, which also serves the till and the
  loyalty programme's Shopify half
- **Admin** — the store and loyalty screens, both inside the one Grade10 admin
  panel
- **Commerce** —
  [commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md):
  Shopify, the order machine, the recovery ladder, refunds
- **Loyalty** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md):
  ledger, tiers, expiry, claw-back, the fulfilment drain
- **Checkout domain** —
  [checkout domain](https://github.com/9gag/grade10/blob/main/docs/architecture/checkout-domain.md):
  hosting Shopify's checkout under our own name
:::
