---
title: Cart
order: 4
---

:::callout{kind="note"}
Ships ahead of a contract of its own: the commerce spec is still being written
by the change shown below. The drawer's shared blocks are specified durably in
`shared-ui/store-cart`.
:::

The cart belongs to the browser. Lines sit in `localStorage` under `cart.v1`
until a pricing rule needs a server cart, which is why adding to it is instant
and why the drawer re-reads the catalogue every time it opens — marking lines
that sold out, and dropping lines the store no longer sells with one toast
saying so.

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Cart drawer"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4765-2301" title="Cart item, adjusted row" set="Product / Cart / Cart Item"}

::story{id="store-cart-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-cartdrawer--unavailable-items-removed" title="Lines the store no longer sells, leaving"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

## In flight

::changes{spec="grade10-store/shopify-commerce"}
