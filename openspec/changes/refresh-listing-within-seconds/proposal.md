**Author:** @brianchacha6969 - 2026-09-14

## Why

A collector can open a product the shop took down minutes ago, or reach for a
price the shop has already changed: the listing answers from a copy of the
catalogue rebuilt by age, 5 minutes behind where it is in use and a day behind
where it is not, and a location holding no copy makes its first collector wait
on a whole read of the catalogue. The shop already reports every product and
stock change to the store within seconds; nothing acts on it.

Metric: seconds from the shop's report of a change to the copy every location
reads, p95; and the listing's answer time at a location holding no copy.

## What Changes

- **One keeper per shop** — the store keeps the catalogue copy in one place per
  shop, applies each change the shop reports and re-reads the whole catalogue
  every 5 minutes; every location follows it instead of building its own copy
- **Seconds after save** — a product published, taken down or repriced, and
  stock that moves, reach the listing everywhere a few seconds after the shop
  saves
- **Cards in the copy** — the copy carries what a card shows, so a listing view
  reads nothing from the shop and the grid keeps answering while the shop is
  unreachable
- **No location waits on a read of the catalogue** — a location holding no
  copy takes the keeper's
- **The listing item narrows** — the products a listing returns carry what a
  card draws and nothing more; a product's own page keeps the whole product

## Non-Goals

- **A queryable index in the store's database** — the step after this, when a
  catalogue outgrows one memory pass
- **Faster than the shop** — the shop's report is the floor; a report that
  never arrives is caught by the re-read
- **The cart's review and checkout** — read the shop live, as they do
- **Suggestions, a collection combined with facets, free text past the title**
  — sibling changes and open decisions

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: the listing follows the shop within
  seconds and answers while the shop is unreachable

## Impact

- **Store worker** — a catalogue keeper, one Durable Object per shop; the
  webhook route hands product and stock events to it; the 5-minute cron
  re-reads through it; the listing reads follow it; the per-location cache
  tiers and product hydration go
- **Shopify port** — the catalogue read carries a card's fields; a product is
  read by id for the read-back; the read of products by ids goes
- **Contracts** — the listing item is a card the product extends; the
  storefront and the admin frontends narrow their types to it, with no
  behaviour change
- **Bindings** — both brands' store workers declare the keeper; nothing to
  provision
- **Scenario ids** — SC-42 to SC-47 added
- **Manual** — the pages under References; the mechanism is
  [the design note](../../../docs/references/store-catalogue-index.md)

No domain impact: a collector's path through the listing is unchanged; only
what the listing holds moves sooner.

## Open questions

- none

## References

- [Product Listing · Following the Shop](../../../docs/prds/products/grade10-site/store/product-listing.md#following-the-shop)
- [Commerce · Catalog](../../../docs/prds/products/grade10-site/commerce/commerce.md#catalog)
