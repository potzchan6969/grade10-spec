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

🚧 **Private address** - a signed-in collector reaches their Store purchases at
`grade10.com/profile/orders`; sign-in keeps the collector at that address

🚧 **Active and Past** - the page keeps active orders above past ones, with
the newest order first in each group. An order is past once nothing is left
to happen on it: Completed, Canceled, or Refunded and either refunded in full
or every item fulfilled. A partly refunded order still owed items, and a held
or scheduled order whatever its refund, stay active

🚧 **Recorded orders** - a web checkout appears once the shop records the
order; one that fails or expires before then never appears -
[Order Status](/p/grade10-site/commerce/order-status)

🚧 **Order actions** - a collector opens one order or follows a Store-supplied
carrier address when it is safe to open

🚧 **Read states** - loading stays distinct from empty, and a failed read offers
localized Retry without replacing the address

🚧 **Empty account** - a collector with no purchases gets a shopping path back
to the Store

**Guest orders** - a paid guest order joins the account whose proven email
it was placed under, at payment when that account exists and otherwise at
that account's next sign-in, and is listed from then on. One that joins before
it completes earns points when it completes; one that joins after earns
nothing - [Checkout](/p/grade10-site/store/checkout#guest-checkout)

## Designs

::story{id="store-order-history-screens-order-history--filled" title="Your Orders, filled"}

::story{id="store-order-history-blocks-orderhistory--empty" title="An account with no orders"}

::story{id="store-order-history-screens-order-history--with-guest-orders" title="Guest orders under the member's email, listed"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Guest orders after sign-in | Decided | Every paid guest order placed under an email appears in the account automatically once a sign-in proves that email — the way Shopify customer accounts and WooCommerce already list a guest's orders under a proven email, and the reason the member is the order's owner rather than a recipient of a saved link. Linking gives the order an owner: one still in progress earns points when it completes, one already complete earns nothing. Decided 2026-10-13; supersedes prompt-only saving (earlier 2026-10-13), which itself superseded the first email-match row (2026-10-12). | Product |
| Join at payment | Decided | A guest order placed under the proven email of an existing account joins that account at payment, so it is listed without waiting for a sign-in. Decided 2026-10-13, the owner's answer. | Product |
:::
