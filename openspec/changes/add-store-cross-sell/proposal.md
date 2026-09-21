**Author:** @jeffffej0909 - 2026-09-21

Product context: [You May Also Like](../../../docs/prds/products/grade10-site/store/cross-sell.md) and [Product Details · You May Also Like](../../../docs/prds/products/grade10-site/store/product-page.md#you-may-also-like).

## Why

A collector who reaches a card and does not buy it has nowhere to go but back
to the listing. The catalogue already holds the cards beside it. The stock
keeper knows which ones belong together. The page shows none of them.

**Metric:** rail opens and the add-to-cart rate of the sessions that open
one, as [Measurement](../../../docs/prds/products/grade10-site/store/cross-sell.md#product-decisions)
defines them; unmeasured until instrumented.

## What Changes

- **A rail under the card**, headed **You may also like**, shows up to six
  cards a collector can open without a trip back to the listing.
- **The stock keeper's picks first** — the cards a stock keeper chose for this
  card in the Shopify dashboard, in their order; a chosen card that is sold out
  stays, says so and still opens, and one the catalogue no longer holds is left
  out.
- **Similar cards fill the rest** — cards sharing this card's world, its
  language or its collectible type, weighed in that order and newest first
  among equals; sold-out cards and the card itself are never among them.
- **No rail where there is nothing to show** — a card with no picks and no
  similar card shows no rail and leaves no empty space.
- **In the page as it arrives** — the rail is in the product page's response,
  so it is there before any script runs and the page does not move when it
  appears.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/cross-sell` — the rail: what it holds, in what order,
  when it shows, its place on the card's page, and the picks and the similar
  rule that fill it.

### Modified Capabilities

None.

## Impact

- The store's catalogue read in `grade10` gains each card's picks and the
  facts the similar rule weighs; how is the tech design's.
- A rail block in `packages/ui` composing the listing's product card without
  its cart control, and the heading in `packages/i18n` in every language of
  the shared layer; the export set is the requirements'.
- `redesign-store-product-detail-page` is Building on the same page; this
  change lands the rail on the redesigned page and carries no delta on
  `grade10-site/store/product-page`.

## Follow-on changes

- Customers also bought: cards most often bought together with this one, from
  the store's paid orders, once the store has orders to count.

## References

- [You May Also Like · The Rail](../../../docs/prds/products/grade10-site/store/cross-sell.md#the-rail)
- [You May Also Like · Picks](../../../docs/prds/products/grade10-site/store/cross-sell.md#picks)
- [You May Also Like · Similar Cards](../../../docs/prds/products/grade10-site/store/cross-sell.md#similar-cards)
- [Product Details · You May Also Like](../../../docs/prds/products/grade10-site/store/product-page.md#you-may-also-like)
