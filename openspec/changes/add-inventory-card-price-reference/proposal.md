**Author:** @htonyl - 2026-09-03

## Why

Inventory operators cannot consistently identify a collectible card, classify
it for discovery, or view a current market reference while creating house
stock. A pasted PriceCharting page alone is not a durable provider identity,
and hand-entered prices quickly become stale during an active auction.

**Metric:** share of created Collectible Cards with all required taxonomy tags
and a confirmed PriceCharting identity; cache-hit rate for product-price reads.

## What Changes

- **Card product identity** — adds the controlled `Collectible Cards` product
  type and requires an IP, Item, and Category tag on every product.
- **PriceCharting matching** — lets an inventory admin paste a PriceCharting
  link for a Collectible Card, select the confirmed search match, and retains
  both the canonical link and provider product id.
- **Current PSA-oriented price reference** — serves the current ungraded
  baseline and provider-returned PSA-relevant grade values from an expiring
  cache, with source and last-updated information.
- **Auction-aware freshness** — keeps a normal 24-hour price cache while an
  active Grade10 auction can request a refresh no more often than every four
  hours.
- **Bulk card intake** — accepts a CSV of new card products, validates every
  required tag and PriceCharting match in a reviewable preview, then creates
  the complete batch atomically.

## Non-Goals

- PSA population counts, certificate verification, label details, or
  population reports.
- Historic PriceCharting prices, historic sales, a price chart, or durable
  Grade10 price-history records.
- Page scraping, browser-side provider tokens, or an external-auction feed.
- PriceCharting support for non-card collectible types or any additional type
  vocabulary beyond `Collectible Cards`.
- Updating existing products through a CSV, multiple tags per controlled role,
  or a partial import.
- A new shared design-system component or Figma frame.

## Capabilities

### New Capabilities

- `grade10-admin/inventory/card-price-reference`: controlled card identity,
  required reusable tags, PriceCharting match confirmation, and cached
  PSA-oriented price reference in the inventory console.

### Modified Capabilities

- None.

## Impact

- Depends on the product record and inventory console from
  `add-grade10-inventory` landing first.
- Adds inventory contracts, a migration, provider client and cache policy to
  the Grade10 inventory service, its admin API, and its admin frontend.
- Adds a server-only PriceCharting subscription token and respects the
  provider's one-request-per-second limit.
- Lets Grade10 Auction request the shorter refresh cadence through an internal
  event/entrypoint; it does not grant Auction provider credentials.
- Adds an elevated inventory-admin CSV preview and confirmation surface; CSV
  data is temporary import state, not a permanent file archive.
