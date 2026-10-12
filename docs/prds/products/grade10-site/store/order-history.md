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

**Guest orders** - a paid guest order placed under the email a member signs
in with is listed with their orders. It stays a guest order: it earns no
points and belongs to no account -
[Checkout](/p/grade10-site/store/checkout#guest-checkout)

## Designs

::story{id="store-order-history-screens-order-history--filled" title="Your Orders, filled"}

::story{id="store-order-history-blocks-orderhistory--empty" title="An account with no orders"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Guest orders after sign-in | Decided | List a paid guest order under the member whose sign-in proves its email, with no points; the order stays a guest order. Shopify customer accounts and WooCommerce both match past guest orders by a proven email, and the guest's own order link already went to that inbox. Confirmed by the owner 2026-10-12. | Product |
:::
