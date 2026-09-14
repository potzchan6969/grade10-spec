**Author:** @brianchacha6969 - 2026-09-14

## Why

A collector can open a product the shop took down minutes ago, or reach for a
price the shop has already changed: the listing answers from a copy of the
catalogue rebuilt by age, 5 minutes behind where it is in use and a day behind
where it is not, and a location holding no copy makes its first collector wait
on a whole read of the catalogue. The shop already reports every product and
stock change to the store within seconds; nothing acts on it.

Metric: seconds from the shop's read answering a change to the copy every
location reads, p95; seconds from the shop's report to its read answering the
change, p95; and the listing's answer time at a location holding no copy.

## What Changes

- **One copy per shop** — the store keeps the catalogue copy in one place per
  shop, applies each change the shop reports and re-reads the whole catalogue
  every 5 minutes; every location follows that copy instead of building its own
- **Seconds after save** — a product published, taken down or repriced, and
  stock that moves, reach the listing everywhere within seconds of the shop's
  own reads answering the change
- **No listing view reads the shop** — the copy carries whole products, so the
  grid, its count and its sidebar answer from it alone and keep answering
  while the shop is unreachable
- **No location waits on a read of the catalogue** — a location holding no
  copy takes the store's

## Non-Goals

- **A queryable index in the store's database** — the step after this, when a
  catalogue outgrows one memory pass
- **A copy cut to what a card draws** — the copy carries whole products until
  it passes 1 MB; the cut is recorded as the step then
- **Faster than the shop** — the shop's report and its own reads are the
  floor; a report that never arrives is caught by the re-read
- **A listing narrowed to a collection, the cart's review and checkout** —
  read the shop live, as they do
- **Suggestions, a collection combined with facets, free text past the title**
  — sibling changes and open decisions

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: the listing follows the shop within
  seconds and answers while the shop is unreachable

## Impact

- **Store worker** — a catalogue keeper, one Durable Object per shop, the
  first a deployed worker of this repository binds; the webhook route hands
  product and stock events to it; the 5-minute cron re-reads through it; the
  listing reads follow it; the per-location cache tiers and product hydration
  go
- **Shopify port** — the product read and the walk carry the shop's
  `updatedAt`; the product webhook carries its `updated_at`
- **Contracts** — unchanged: the listing returns whole products, as today
- **Bindings and deploy** — both brands' store workers declare the keeper and
  its migration; the deploy pipeline ships a worker whose class lifecycle
  changed whole, since a version upload cannot carry that
- **Conventions** — `docs/conventions/backend.md` records the one Durable
  Object a deployed worker binds, and why
- **Scenario ids** — SC-42 to SC-48 added
- **Manual** — the pages under References; the mechanism is
  [the design note](../../../docs/references/store-catalogue-index.md)

No domain impact: a collector's path through the listing is unchanged; only
what the listing holds moves sooner.

## Open questions

- Whether a manual stock adjustment fires `products/update` on the dev shop;
  yes retires the re-read on stock events — Engineering
- Whether a product published or taken down in bulk fires `products/update`;
  no leaves those to the 5-minute re-read — Engineering, on the dev shop
- How long the shop's own reads lag its report, measured on staging; past
  10 seconds at p95 the read-back moves to the Admin API — Engineering

## References

- [Product Listing · Following the Shop](../../../docs/prds/products/grade10-site/store/product-listing.md#following-the-shop)
- [Commerce · Catalog](../../../docs/prds/products/grade10-site/commerce/commerce.md#catalog)
