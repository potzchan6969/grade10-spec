---
title: Cart and checkout
summary: The client-owned cart, live pricing against Shopify, and the order that exists before the buyer ever reaches a payment page.
order: 4
---

:::callout{kind="note"}
Not yet covered by a spec. Cart and checkout ship today, but their requirements
live in an in-flight change (`grade10-store/shopify-commerce`) and in the
commerce architecture docs, not in a durable capability. Read this page as a
description of what runs, not as a contract.
:::

The cart belongs to the browser. Lines sit in `localStorage` under `cart.v1`
until a pricing rule needs a server cart, which is why adding to it is instant
and why the drawer re-reads the catalogue every time it opens — marking lines
that sold out, and dropping lines the store no longer sells with one toast
saying so.

Checkout is Shopify's, and money is never something a client supplies. The store
prices every line live against Shopify at the moment of checkout; the browser
sends variants, quantities and site-relative redirect paths, and nothing else. A
cache never sets a charge. Availability is checked in the same pass, so a cart
asking for more than exists is refused before an order exists to refuse.

The order is Grade10's own record, written in one transaction before the checkout
is created at Shopify under a deterministic key derived from the order id. What
the buyer was charged and what the store quoted are kept as two different numbers,
because they are two different facts.

:::flow{title="Checkout, end to end"}
## Add to the cart
The collector opens a card, picks a grade and adds it. The cart is the browser's
until checkout needs otherwise.

## Open the drawer
Every line is re-read against the catalogue: current price, current status.
Sold-out lines are marked, delisted lines leave.

## Price it live
The store asks Shopify what each line costs right now. A variant that does not
sell rejects; a quantity beyond what is available rejects.

## Write the order
A payment customer is created if the buyer has none, and the order and its items
are inserted in one transaction. Only then is the checkout created at Shopify.

## Pay at Shopify
The buyer is redirected to Shopify's hosted checkout, served under
`checkout.grade10.com` so it carries our name.

## Settle
A webhook arrives and is honoured only when the recorded checkout reference
carries the event's cart token. The order moves pending, processing, paid.

## Earn
The order event drains, and the goods amount out of the charge is what loyalty
prices into points.

## Land on the order
The buyer arrives at a Grade10 order page. A just-placed order reads `pending` —
neither an error nor an empty page. The page polls.
:::

Order statuses run `pending → processing → paid | failed | canceled | expired`,
plus `paid → refunded` and `expired → paid`.

:::callout{kind="warning"}
The docs disagree about guest checkout. The commerce architecture doc says the
store is signed-in only; a live `checkout.createCheckoutWithEmail` procedure
writes an order with no owner and defers the account to the payment. The
architecture doc does not describe that path at all.
:::

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Cart drawer"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4765-2301" title="Cart item, adjusted row" set="Product / Cart / Cart Item"}

::story{id="store-cart-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-cartdrawer--unavailable-items-removed" title="Lines the store no longer sells, leaving"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

## In flight

::changes{spec="grade10-store/shopify-commerce"}

:::detail{title="For engineers" for="engineer"}
The checkout pages themselves are described in
[storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md)
— ten answers and five outcome kinds — and that doc records the pages as waiting
on design. The order machine, the recovery ladder and refunds are in
[commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md).

Operators get a checkout test page under an **Overrider** nav heading, in
development and staging only: a production build carries neither the page, its
route, its nav entry, nor the heading above it. It drives the real `checkout.*`
procedures against a real Shopify shop, and offers both **Buy as me** and **Buy
with this email**, the second answering `signInRequired` for an address an
account already holds.
:::
