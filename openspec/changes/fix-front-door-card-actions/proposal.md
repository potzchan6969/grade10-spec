**Author:** @seankcw - 2026-09-08

## Why

The front door offers a collector an Add to cart on every merchandised card,
and nothing happens when they press it. The row supplies the words for the
control but no way to report a quantity, and the card falls back to doing
nothing — so the button draws, takes the press, and swallows it. Measured on
the seeded catalogue: two cards in the row, two live-looking Add to cart
buttons, zero of them wired.

The same cards say nothing about what they are. A card the shop has sold out
renders at full strength, with no sold-out mark and the same dead button; a
card the shop has marked down shows today's price with no sign it moved. The
listing says both, from the same catalogue read — the front door simply never
passes them on.

Underneath is a contract that cannot express a shop window. A card draws its
cart control whenever the product is not sold out, so a surface that
merchandises rather than sells has no way to leave it off, and a consumer who
forgets to wire one gets a button that silently fails instead of a compile
error or no button at all.

Metric: presses on the front door's cart control that reach a cart. It is zero
today and unmeasured, because nothing records a press that goes nowhere.

## What Changes

- **A card offers a cart only where the surface sells** — the control is drawn
  where the consumer supplies a way to change the quantity, and nowhere else.
  **BREAKING:** a consumer relying on the control appearing without one loses
  it, which is the defect this closes
- **The front door merchandises** — its cards open the product's own page and
  offer no cart, which is what the row was always doing minus the button that
  pretended otherwise
- **A front-door card says it is sold out** — the sold-out treatment and mark
  the listing already shows, from the same condition
- **A front-door card says it was marked down** — what it used to cost, struck
  through beside what it costs now, on the same rule the rest of the store
  reads a compare-at by

## Non-Goals

- **Selling from the front door** — adding a working cart to the row is the
  other way to close this, and is ruled out here
- **The collection grid** above the row, which is unchanged
- **The listing's own cards**, which already say all three things
- **Recording presses that go nowhere** — the metric is what a working control
  reports, not instrumentation of the broken one

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the card's cart control is drawn only
  where the consumer supplies a way to change the quantity
- `grade10-site/store/home`: the merchandised row's cards carry sold-out and
  former-price conditions, and offer no cart

## Impact

- **`@grade10/ui`** — `ProductCard` and `ProductCardImage` stop defaulting the
  quantity callback, so the control follows the consumer's intent. No export
  moves and no prop is added: the handler's presence is the signal
- **Grade10 site** — the front door's merchandised row passes the two
  conditions it already reads and stops supplying cart copy it cannot honour
- **The listing** — unaffected; it supplies a handler and keeps its cart
- **ZZZ** — no consumer of this card
