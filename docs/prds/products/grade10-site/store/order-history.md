---
title: Your Orders
spec: grade10-site/store/order-history
order: 6
---

Your Orders is the signed-in collector's way back to Store purchases after
checkout. It has its own account address rather than living inside the profile
screen, because order loading and order actions are an independent job.

The first delivery uses the owner-scoped order list already available to the
frontend. It keeps Active above Past and sends a collector into one order or to
the carrier when the Store supplies a safe tracking address. No-orders is a
shopping path, not a blank account page.

- **URL** — `grade10.com/profile/orders`

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534" title="Order history, filled"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424" title="Order history, empty"}

::story{id="pages-order-history-page--filled" title="Your Orders, filled"}

::story{id="store-order-history-orderhistory--empty" title="An account with no orders"}

## In flight

::changes{spec="grade10-site/store/order-history"}

::changes{spec="grade10-site/store/order-status"}
