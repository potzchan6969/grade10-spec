---
title: My Orders
spec: grade10-site/store/order-history
order: 6
---

My Orders is the signed-in collector's way back to Store purchases after
checkout: active and past purchases in one place, each order a click away. It
has its own account address rather than sitting inside the profile screen,
because loading and acting on orders is a job of its own.

## Orders

- **Private Address** — `grade10.com/profile/orders`, for the signed-in
  collector; signing in keeps them at that address
- **Active and Past** — active orders above past ones, newest first in each.
  An order is past once nothing is left to happen on it: Completed, Canceled or
  Refunded. A partly refunded order shows its progress and stays active until
  it completes; a held or scheduled order stays active whatever its refund
  - **Status Badge** — the badge its Order Details shows —
    [Order Status](/p/grade10-site/commerce/order-status#badges)
  - **Order Actions** — opening the order, and tracking it at the carrier
    address the Store supplies, when that address is safe to open
- **Recorded Orders** — a web checkout is listed once the shop records the
  order; one that fails or expires first never is —
  [Order Status](/p/grade10-site/commerce/order-status)
- 🚧 **Store Orders Only** — a ticket order from
  [Tickets](/p/grade10-site/ticketing) is never listed; it is on
  [Your Tickets](/p/grade10-site/ticketing/your-tickets)
- **Read States** — loading looks different from empty; a failed read offers
  Retry in the collector's language and keeps the address
- **Empty Account** — a way back to the Store to shop

:::callout{kind="note"}
- ❓ **A Safe Carrier Address** — an `https` address opens; any other scheme, such as `javascript:`, offers no tracking. Engineering confirms
:::

::story{id="store-order-history-screens-order-history--filled" title="My Orders, filled"}

::story{id="store-order-history-blocks-orderhistory--empty" title="An account with no orders"}

## Product Pictures

- 🚧 **Recognise a Purchase** — each item shows its product's current
  picture, as the cart does, earlier purchases too; with no picture, the
  placeholder, and the order still reads

## Guest Orders

- **Joined Guest Orders** — a paid guest order is listed from the moment it
  joins the account its email proves —
  [Checkout](/p/grade10-site/store/checkout#guest-checkout)
  - **No Points** — a joined guest order earns none

::story{id="store-order-history-screens-order-history--with-guest-orders" title="Guest orders under the member's email, listed"}

:::detail{title="Product decisions" for="pm"}
- **Page name** — "My Orders", the words the account menu uses to open it, with the order details breadcrumb and back link following; keeping "Your Orders" left the menu item and the page it opens under two names
- **Order pictures** — the first current product picture, as the cart does: images identify products, while recorded names, quantities and money remain the purchase's facts; storing a purchase-time image was ruled out
- **Guest orders after sign-in** — every paid guest order under an email joins once a sign-in proves it, the way Shopify customer accounts and WooCommerce list a guest's orders, so the member owns the order rather than holding a saved link; joining earns nothing
- **A changed sign-in email** — a guest order joins under the email the account holds; following Google's email would move an identity across auth, the store, loyalty and Shopify for a rare case, and a Gmail address cannot change
:::
