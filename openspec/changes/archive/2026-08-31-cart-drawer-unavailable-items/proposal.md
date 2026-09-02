**Author:** @constancetang - 2026-08-26

## Why

A collector who opens their cart can still see a line for a product the store
has taken off sale entirely — not sold out, not low stock, gone. The
drawer already refreshes status and price on open, and keeps sold-out rows
visible with a remove control; a delisted product has no row that should stay.
Leaving it forces the collector to notice and clear it themselves, or to hit
checkout and fail later.

**Metric:** share of cart opens where a delisted line is cleared before the
collector acts — from none today to every open that finds one.
**Acceptance signal:** opening the cart after a product is taken off sale shows
no row for it and one toast explaining why.

## What Changes

- **Delisted lines leave the cart after the open refresh.** When status/price
  fetch finishes and a line is marked unavailable (product removed from the
  store catalogue), `CartDrawer` removes it without showing a sold-out row.
- **One toast tells the collector.** A single bottom-right toast —
  “Some item(s) have been removed as they’re no longer available” — fires when
  at least one such line was cleared on that open. Copy is consumer-supplied.
- **`CartItemStatus` gains `unavailable`.** Distinct from `soldOut` and
  `adjusted`. **BREAKING** for consumers that exhaustively switch on status.
- **`CartDrawerCopy` gains the toast string.** **BREAKING** for consumers that
  construct copy without the new field.

## Non-Goals

- **Sold-out and low-stock treatment.** `soldOut` and `adjusted` stay as they
  are — visible rows with their own copy and controls.
- **Who decides a product is 下架.** The consuming application marks status
  after its Shopify (or other) refresh; the drawer only reacts.
- **Checkout refusal for unavailable variants.** That remains
  `grade10-store/shopify-commerce`.
- **Toast chrome redesign.** Uses the existing design-system toaster; this
  change only places the message and depends on the app mounting `Toaster` at
  bottom-right.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/store-cart`: after open loading ends, unavailable lines are
  removed silently with one toast; status and copy contracts updated.

## Impact

`packages/ui` cart drawer block and its stories; design-system re-exports
`toast` beside `Toaster` so the drawer imports the primitive from one place.
Consuming store apps must supply the new copy field, mount `Toaster` at
`bottom-right`, and map a delisted Shopify product to `status: "unavailable"`
on cart refresh. No Figma frame change — unavailable lines are never drawn.
