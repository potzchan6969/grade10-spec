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

**Private address** - a signed-in collector reaches their Store purchases at
`grade10.com/profile/orders`; sign-in keeps the collector at that address

**Active and Past** - the page keeps active orders above past ones, with
the newest order first in each group. An order is past once nothing is left
to happen on it: Completed, Canceled, or Refunded and either refunded in full
or every item fulfilled. A partly refunded order still owed items, and a held
or scheduled order whatever its refund, stay active

**Recorded orders** - a web checkout appears once the shop records the
order; one that fails or expires before then never appears -
[Order Status](/p/grade10-site/commerce/order-status)

**Order actions** - a collector opens one order or follows a Store-supplied
carrier address when it is safe to open

❓ **A safe carrier address** - an `https` address opens; any other scheme,
such as `javascript:`, offers no Track Order. Engineering confirms

**Read states** - loading stays distinct from empty, and a failed read offers
localized Retry without replacing the address

**Empty account** - a collector with no purchases gets a shopping path back
to the Store

**Guest orders** - a paid guest order joins the account whose proven email
it was placed under, at payment when that account exists and otherwise at
that account's next sign-in, and is listed from then on -
[Checkout](/p/grade10-site/store/checkout#guest-checkout)

🚧 **No points** - a joined guest order earns none

## Product Pictures

🚧 **Recognise a purchase** - order items show their current product pictures,
as the cart does, including earlier purchases. When a picture cannot be supplied,
the order remains readable with its existing placeholder.

## Designs

::story{id="store-order-history-screens-order-history--filled" title="Your Orders, filled"}

::story{id="store-order-history-blocks-orderhistory--empty" title="An account with no orders"}

::story{id="store-order-history-screens-order-history--with-guest-orders" title="Guest orders under the member's email, listed"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Order pictures | Decided | Use the first current product picture, as the cart does. Images identify products; recorded names, quantities and money remain the purchase's facts. Historical image storage is outside this change. Selected from the recommended fix on 2026-10-22. | Product |
| Guest orders after sign-in | Decided | Every paid guest order placed under an email appears in the account automatically once a sign-in proves that email — the way Shopify customer accounts and WooCommerce already list a guest's orders under a proven email, and the reason the member is the order's owner rather than a recipient of a saved link. Linking gives the order an owner and earns nothing. Decided 2026-10-13, earning dropped 2026-10-14; supersedes prompt-only saving (earlier 2026-10-13), which itself superseded the first email-match row (2026-10-12). | Product |
| Join at payment | Decided | A guest order placed under the proven email of an existing account joins that account at payment, so it is listed without waiting for a sign-in. Decided 2026-10-13, the owner's answer. | Product |
| A changed sign-in email | Decided | A guest order joins under the email the account holds. A member whose Google account changes its email keeps the old one on the account, so guest orders under the new email do not join it. Accepted: a Gmail address cannot change, and following Google's email would move an identity across auth, the store, loyalty and Shopify for a rare case. Decided 2026-10-14, the owner's answer. | Product |
:::
