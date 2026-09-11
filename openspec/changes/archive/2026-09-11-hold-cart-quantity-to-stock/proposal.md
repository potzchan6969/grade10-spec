**Author:** @seankcw - 2026-09-09

## Why

A collector raised a card's quantity to 43 on the browse listing while the
shop held 41. Nothing refused it, nothing said anything, and the order came
back with 41. The number the control showed was never a number the shop would
honour, and the collector found that out after buying.

The stepper on a listing tile counts without a ceiling. The shop's count
reaches that tile — it rides the same catalogue read the product page uses —
and the tile discards it, so the control has nothing to stop against.

The same shop tells the collector three different stories about the same
limit. The product page stops at the count and says nothing about why. The
cart drawer stops at it and says nothing either. The listing tile does not
stop at all. Only the cart's review says anything, after the fact, by reducing
a line the collector already thought they had bought.

Metric: increments that report a quantity the shop will not honour. Zero is
the target, and it is unmeasured today because nothing records a count that
outruns the shelf.

## What Changes

- **A cart control stops where the shop's count stops** — on the listing
  tile, the product page and the cart drawer, wherever the shop exposes a
  count. Where it exposes none, nothing is capped
- **A stopped control says why** — the collector is told how many are left at
  the moment the control refuses to go higher, rather than being left to guess
  that it is broken
- **A tile says when few are left** — the remaining count on a card the shop
  is nearly out of, on the threshold the product page already uses
- **The cap is advisory and stays advisory** — the shop's count is stale the
  moment it is read, so the cart's review remains the only authority and goes
  on correcting a line it cannot honour

## Non-Goals

- **Preventing an oversell** — a cap on a stale count cannot, and two
  collectors racing for the last card still meet at review. This change makes
  a control honest, not a ledger correct
- **The cart's review** — its clamping and its low-stock warning are the
  correction path this change leans on, and neither changes
- **The front door's merchandised row** — it offers no cart, and scarcity
  there is a merchandising decision with its own evidence to gather
- **A threshold per surface** — one definition of "few are left" serves every
  surface, and a second would leave the shop unable to say which is right
- **Showing a count on every card** — a remaining count is drawn where it is
  news, not as standing pressure to hurry

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: the card's cart control stops at a
  supplied maximum, and the card displays a supplied remaining count
- `grade10-site/store/product-listing`: the listing supplies the shop's count
  to its cards
- `grade10-site/store/product-page`: the page holds a collector to the shop's
  count and says how many are left when it does
- `shared/ui/store-cart`: the cart line's stepper stops at its supplied
  maximum and says why

## Impact

- **`@grade10/ui`** — `ProductCard` and `ProductCardImage` accept a maximum
  and a remaining count, both optional, so a consumer that supplies neither is
  unaffected. `CartItem` already accepts a maximum and already stops at it;
  what it gains is the reason
- **Grade10 site** — the listing passes the count its catalogue read already
  carries and currently discards; the product page and the cart drawer keep
  the caps they have and state them
- **The catalogue read** — unchanged. The shop's per-variant count already
  ships in the shared product fields every catalogue read selects, so no query
  and no Shopify scope moves
- **ZZZ** — no consumer of either surface
