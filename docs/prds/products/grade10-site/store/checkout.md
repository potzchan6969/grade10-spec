---
title: Checkout
spec: grade10-site/store/shopify-commerce
order: 5
---

Checkout is Shopify's page, under `checkout.grade10.com`. The store hands it
the cart, Shopify takes the address and the money, and the order comes back
to Grade10.

:::flow{title="From the cart to the order"}
# Leaving the store

## Collector — Press checkout
In the cart drawer.

## Store — Ask for an email
A known email signs in by magic link. Any other continues as a guest.

## Store — Read every line live
Current price and stock, from Shopify. A line that moved comes back named.
Stock is held for **15 minutes**.

# On Shopify's page

## Collector — Fill in shipping and pay
Address, shipping option, discount code, payment. Shipping and tax are added
here, so the cart's subtotal is not the charge.

## Shopify — Take the payment
A hold that ran out sends the collector back to start again, with the item
named.

# Back at Grade10

## Shopify — Tell the store
The order moves from pending to paid within seconds.

## Collector — Find the order
In Your Orders. A guest gets an account on the email they paid with, opened
by magic link.
:::

- **The cart** — kept while the collector is at Shopify; cleared once the
  order is paid
- **A second press** — returns the same checkout, never a second order
- ❓ **Back after paying** — whether Shopify sends the collector to the order
  page, or they open Your Orders themselves
- ❓ **Guest checkout** — the spec lets a guest pay and links an account after;
  the store's architecture doc says signed-in only

:::detail{title="For engineers" for="engineer"}
- **The pages** — [storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md): five outcome kinds, one treatment per kind
- **The order machine, recovery, refunds** — [commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
- **Test page** — under an **Overrider** nav heading, development and staging only; drives the real checkout procedures against a real shop, as the signed-in buyer or with a typed email
:::
