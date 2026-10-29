---
title: Cart Validation
spec: grade10-site/store/cart-validation
order: 4
---

Cart Validation is the promise behind every cart decision: a held line is only
an intention until the shop answers what it can sell now.

## Checks

- **Cart Check** — taken each time the Cart Drawer opens, before it shows
  current facts, so the collector can fix the cart early
- **Checkout Check** — taken again before checkout creates an order; it makes
  the final order decision
- **Shop's Final Word** — neither check guarantees the shop will accept the
  order

## Line Changes

- **Fewer Than Asked** — a line the shop can fill only in part drops to what
  it can fill, and the collector is told the store changed it
  - **Never Grown** — a line keeps its quantity when more comes back
- **New Price** — the shop's current price, said to have changed, a rise as
  plainly as a fall; that price is the line's from then on
- **Sold-Out Line** — a variant the shop still lists but does not sell; it
  stays in the cart, marked Sold out, for the collector to remove
  - **Totals** — the subtotal, shipping and total leave it out
  - **Checkout** — takes only the lines that still sell; Proceed to Checkout
    stays unavailable only when no line still sells
- **Product That Left the Shop** — a line whose product left the store's
  channel, or whose variant no longer exists; it leaves the cart when it opens
  or when checkout finds it
  - **Removal Notice** — one notice names every line removed

## At Checkout

- **Moved Lines** — when the checkout check finds lines that moved, the drawer
  stays open and one notice names each of them with what happened to it
- **Filled Short** — a cart the shop would fill short is refused, naming the
  line and how many the shop would fill; nothing is sold short
- **Back to the Cart** — a checkout the store's check or the shop refuses
  reads the cart again as opening it does, so each line shows the shop's
  current answer
- **Checkout Price** — every line priced from the checkout check, never from
  an earlier read or a price the browser sends

## Failed Checks

- **Check That Cannot Finish** — every affected line reads unchecked, Retry is
  offered, and checkout stays unavailable until the store has a current answer
  - **Unchecked State** — replaces each line's last availability and price,
    and the cart total
- **Cart That Never Loaded** — Retry is offered and checkout stays
  unavailable; the drawer names no line and never says the cart is empty, as
  [Store Cart](/p/shared/ui/store-cart) shows a cart not yet read

:::detail{title="Product decisions" for="pm"}
A collector should learn about a moved cart line while they can still fix it,
not only after asking to pay. The store therefore treats a recorded line as an
intent and the shop's current answer as evidence.

- **No stale fallback** — a failed read blocks a current claim and checkout rather than falling back to the line's recorded facts
- **Distinct outcomes** — reduced quantity, sold out, withdrawn and repriced are different facts, because the collector resolves them differently
- **Not in scope** — the Cart Drawer's layout; browse refresh cadence; checkout creation and the hosted-checkout lifecycle; overriding the shop's inventory policy
- ❓ **Unmeasured** — preventable checkout refusals, for a line the open cart had presented as current; nothing records them yet. Product confirms
:::
