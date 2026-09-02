---
title: Orders
order: 6
---

:::callout{kind="note"}
Not yet covered by a spec of its own. The Your Orders surface ships, and its
shared blocks are specified durably in `shared-ui/store-order-history` — but no
`grade10-store` capability states the store's own requirements yet.
:::

Shopify takes the money; Grade10 keeps the order. That separation is the whole
point of this surface — the buyer never has to go to a payment provider to find
out what they bought, and the store can show an order the moment it exists rather
than once a webhook lands.

The buyer comes back from Shopify's checkout to a Grade10 order page. A
just-placed order reads `pending`, which is neither an error nor an empty page;
the page polls until settlement moves it on. What the buyer was charged
(`total_paid_minor`) and what the store quoted (`subtotal_minor`) stay separate
numbers, so a shipping or tax difference never rewrites the quote.

The account holds every order in two sections, Active and Past, each order a card
carrying its status and its line items, with Track Order where there is something
to track. An account with no orders gets an empty state rather than an empty list.

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534" title="Order history, filled"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424" title="Order history, empty"}

::story{id="pages-order-history-page--filled" title="Your Orders, whole"}

::story{id="store-order-history-orderhistory--empty" title="An account with no orders"}

::story{id="store-order-detail-orderdetails--item-coupon" title="One order, in detail"}

:::callout{kind="warning"}
The order detail block has no spec at all — durable or in flight — although it
ships components, types and stories. Order history has an in-flight change with
every task done; it has simply not been archived into a durable capability yet.
:::

## In flight

::changes{spec="shared-ui/store-order-history"}
