---
title: The cart drawer
summary: A slide-out cart that keeps its shape, re-reads prices on open, and hands checkout to the application.
spec: shared-ui/store-cart
order: 5
---

The cart is a drawer that slides in over the page. It always shows at least five
rows — real items first, then placeholder slots — so its shape does not jump
when the cart is nearly empty, and it fades at the edge when there is more to
scroll to.

Opening it re-reads current status and price against the catalogue behind
skeleton placeholders, because a cart is the one place a stale price is
expensive. Sold-out lines are marked, and the count badge on the header ignores
them, so the number a shopper sees is the number they can buy.

::spec{id="shared-ui/store-cart" requirement="Item count badge excludes sold-out items"}

It closes three ways — the close control, the dimmed backdrop, and Escape — and
locks the page behind it while it is open. Pressing checkout puts the button
into a redirecting state and hands the intent to the application, which is what
actually creates the checkout session.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Cart Drawer"}

::story{id="store-cart-cartdrawer--default" title="The drawer with items"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart, still five rows tall"}

::story{id="store-cart-cartdrawer--fetching-on-open" title="The skeleton state while the drawer re-reads prices"}

## What a shopper does

::journeys{id="shared-ui/store-cart"}

## The contract

::spec{id="shared-ui/store-cart"}
