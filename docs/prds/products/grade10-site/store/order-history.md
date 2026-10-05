---
title: Your Orders
spec: grade10-site/store/order-history
order: 6
---

Your Orders is the signed-in collector's way back to Store purchases after
checkout. It has its own account address rather than living inside the profile
screen, because order loading and order actions are an independent job.

It gives a collector one place to review active and past purchases, open an
order, or return to the Store when the account is empty.

## Orders

🚧 **Private address** — a signed-in collector reaches their Store purchases at
`grade10.com/profile/orders`; sign-in keeps the collector at that address

🚧 **Active and Past** — the page keeps orders needing attention above completed
or refunded purchases, with the newest order first in each group

🚧 **Order actions** — a collector opens one order or follows a Store-supplied
carrier address when it is safe to open

🚧 **Read states** — loading stays distinct from empty, and a failed read offers
localized Retry without replacing the address

🚧 **Empty account** — a collector with no purchases gets a shopping path back
to the Store

## Designs

::story{id="pages-store-store-order-history-page--filled" title="Your Orders, filled"}

::story{id="store-order-history-orderhistory--empty" title="An account with no orders"}
