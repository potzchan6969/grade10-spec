---
title: Checkout
order: 5
---

Checkout is Shopify's page, under `checkout.grade10.com`. The store hands it
the cart, Shopify takes the address and the money, and the order comes back
to Grade10.

:::flow{title="From the cart to the order"}
# Leaving the store

## Collector — Press checkout
In the cart drawer, signed in with Google or a magic link.

## Store — Read every line live
Current price and stock, from Shopify. A line that moved comes back named.

# On Shopify's page

## Collector — Fill in shipping and pay
Address, shipping option, discount code, payment. Shipping and tax are added
here, so the cart's subtotal is not the charge.

## Shopify — Take the payment
An item that sold out in the meantime is refused, with the item named.

# Back at Grade10

## Shopify — Tell the store
The order moves from pending to paid within seconds.

## Collector — Press Continue shopping
On Shopify's confirmation page, back to the store.

## Collector — Find the order
In Your Orders.
:::

- **Members only** — checkout is signed in; guest checkout is in the code,
  launching with it `TBC`
- **The bar** — goods worth **HKD 120,000** or more need a verified buyer;
  an unverified one is sent to [verify from their account](/p/grade10-site/account/identity)
  before any order is made
- **The cart** — kept while the collector is at Shopify; cleared once the
  order is paid
- **A second press** — returns the same checkout, never a second order

:::detail{title="Design record" for="engineer"}
- **The pages** — [storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md): five outcome kinds, one treatment per kind
- **The order machine, recovery, refunds** — [commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Test page" for="engineer"}
- **Test page** — under an **Overrider** nav heading, development and staging only; drives the real checkout procedures against a real shop, as the signed-in buyer or with a typed email
:::
