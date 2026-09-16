---
title: Cart Drawer
spec: shared/ui/store-cart
order: 5
reviewed: 2026-09-11
---

The cart is a drawer that slides in over the page. It lists the items the
shopper is buying and fades at the edge when there is more to scroll to. When
the cart holds nothing, it shows the design-system empty state — title and
description only, no button to leave.

Opening it re-reads current status and price against the catalogue behind
skeleton placeholders, because a cart is the one place a stale price is
expensive. Sold-out lines are marked, and the count badge on the header ignores
them, so the number a shopper sees is the number they can buy. A line's stepper
stops at a maximum the application supplies, beside a remaining count the
application words; the drawer derives neither. A line already carrying the
low-stock warning shows both — one says what was already changed, the other
says what is left.

It closes three ways — the close control, the dimmed backdrop, and Escape — and
locks the page behind it while it is open. Pressing checkout puts the button
into a redirecting state and hands the intent to the application, which is what
actually creates the checkout session.

## Tender Actions

🚧 **Tender actions need an answer** — a promo or points action appears only
when the application supplies the callback that can perform it. The drawer can
show current tender context without offering an action that cannot change it.

## Site Sale And Promo Codes

🚧 An automatic storewide sale on a line shows as the sale unit price with the
list price struck through. The summary does not add a separate Store sale row
for that cut.

🚧 When a promo code stacks on that sale, the lines keep the sale and
compare-at, the Subtotal is their sum, and the footer names only the code's
Discount. When the code replaces the sale, lines return to list price and the
footer shows only the code. When the code is refused, lines stay on the sale
and the sheet names why. Removing a code that replaced the sale puts the sale
back on the lines.

::story{id="store-cart-cartdrawer--default" title="The drawer with items"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

::story{id="store-cart-cartdrawer--fetching-on-open" title="The skeleton state while the drawer re-reads prices"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Historical Figma — superseded by Storybook"}
