**Author:** @ecchochan - 2026-09-15

## Why

The money points take off an order is a discount titled "Points". On the
till's cart and the paid order, "Points" reads as a count of points, not as
money taken off, so a member and a shopkeeper each have to work out what the
line means. The owner chose "Deduction from Points".

The measure: **every points order promised after the switch is paid with a
discount titled "Deduction from Points"**, and till promises that expire
unpaid do not rise during the rollout.

## What Changes

- **The discount is titled "Deduction from Points"** on the online draft
  order and the till's cart, and so on the paid order.
- **A discount titled "Points" still counts as the member's points.** Carts,
  parked sales and unpaid drafts written before the switch carry it, and
  paid orders keep it forever; every reader accepts both titles.
- **Every reader knows the new title before anything writes it.** The store
  and the till first accept both titles while still writing "Points"; both
  writers switch only once no till older than that runs at any location.

## Non-Goals

- Labels for the same money on the site — the checkout summary row and the
  cart drawer footer — stay as they are.
- The till panel's own row for the points spent keeps its label.
- Orders already paid keep the title they were paid with.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `grade10-site/store/membership`: the order-level discount points promise
  is titled "Deduction from Points", and a discount titled "Points" counts as
  the same one.

## Impact

- The online draft order and settlement (`packages/grade10-store`)
- The till extension's write and every read of its points discount
  (`integrations/shopify-pos/grade10`), in two extension versions: one that
  reads both titles, then one that writes the new one
- The browser till, the admin simulator and the demo lane, which read what
  the extension writes

## References

- [Shopify Integration · POS Extension](../../../docs/prds/products/grade10-site/loyalty/shopify-integration.md#pos-extension)
- [Paying with Points](../../../docs/prds/products/grade10-site/loyalty/paying-with-points.md)
