**Author:** @jeffffej0909 - 2026-08-28

## Why

A collector cannot tell from the storefront whether a card is one they can
still buy. The listing draws a tile as sold out or not, the card's page says
for sale or not for sale, and the cart drawer refreshes on open and marks a
line sold out — three surfaces, three vocabularies, all derived ad hoc from
whatever the consuming application decided a Shopify inventory read meant. A
tile with four copies left reads identically to one with four hundred, so the
scarcity a collector is actually buying on is invisible until checkout, and a
line the collector believed was fine fails at the Shopify validation step that
`grade10-store/shopify-commerce` already specifies.

The evidence is the shape of the existing contracts: `ProductCard` takes a
boolean sold-out condition, `CartItemStatus` takes its own separate vocabulary,
and neither is derived from a stated rule. Nothing in `openspec/specs/` says
what a Shopify inventory field means to a collector, so every surface is free
to answer differently and they do.

**Metric:** share of checkout attempts refused for an item that browsing had
shown as buyable. A stated derivation applied identically on all three surfaces
should move that toward zero; today it is unmeasured, so the first delivery
establishes the baseline. *(Assumption — the source PRD names no metric.)*

**Acceptance signal:** the same variant, at the same instant, reads the same on
its tile, on its card page, and on its cart line.

## What Changes

- **One stated derivation from Shopify inventory to what a collector sees.**
  `quantityAvailable` alone decides it: at or below zero the variant is out of
  stock, above zero it is available. `inventoryPolicy` is not read for MVP, so
  a variant set to `continue` with no stock reads out of stock and cannot be
  bought — the store never offers what it does not hold.
- **Low stock is an overlay, not a status.** A variant is available *and*
  additionally flagged low stock when fewer than 5 remain. Two independent
  facts rather than one status, so a surface can show scarcity without
  reclassifying what the collector can do.
- **Unavailable is a cart-line condition only.** A product not published to the
  sales channel is absent from the listing and its address already answers 404
  under `grade10-store/product-page`. The only place a collector meets it is a
  cart line whose product was delisted mid-session.
- **A card's tile reflects its most available variant.** Available beats out of
  stock; the tile carries the low-stock flag of whichever variant won. Per
  variant status stays on the card's page.
- **`ProductCard`, `ProductCardImage` and `ProductList` take a status and a
  low-stock flag in place of a sold-out boolean.** **BREAKING** for every
  consuming application, which must map its Shopify read to the stated
  derivation rather than to a boolean of its own.

## Non-Goals

- **Pre-order.** `inventoryPolicy: continue` is deliberately not honoured as a
  sellable condition. Taking an order for stock the store does not hold is a
  product decision with its own fulfilment, payment-timing and cancellation
  consequences, and it needs its own change.
- **A low-stock threshold that varies by category.** Flat below-5 for MVP, as
  the PRD confirms.
- **Merchant-configurable thresholds.** No admin surface; the threshold is a
  stated requirement, not a setting.
- **Multi-location inventory.** Single-location assumption; `quantityAvailable`
  is read as one number.
- **Refresh cadence.** Whether a surface reads status live or from cache is
  engineering's, bounded by the invalidation `grade10-store/shopify-commerce`
  already requires.
- **Visual treatment.** Whether out-of-stock and unavailable are drawn alike is
  design's; this change fixes only what each surface must communicate.
- **`CartItemStatus`'s own values.** The cart drawer's status vocabulary is
  being changed right now by `cart-drawer-unavailable-items`, which adds
  `unavailable`. This change states what the store must put into that type, and
  does not touch the type itself.
- **Checkout refusal.** Already `grade10-store/shopify-commerce`.

## Capabilities

### New Capabilities

- `grade10-store/product-status`: the single derivation from Shopify inventory
  facts to what a collector is told about buying a variant, the low-stock
  overlay, the variant-to-product rollup, and what the listing, the card page
  and the cart must each communicate.

### Modified Capabilities

- `shared-ui/store-product-listing`: the sold-out boolean carried by
  `ProductList`, `ProductCard` and `ProductCardImage` becomes a status plus a
  low-stock flag, and the surface's export list gains the status type.

## Impact

`packages/ui` listing block — `ProductList`, `ProductCard`, `ProductCardImage`
and their prop types and stories. `packages/i18n` needs copy for the low-stock
and out-of-stock labels; `shared/en/product.json` today carries only
`soldOutSuffix` and `notForSaleNote`. Consuming store applications must replace
their sold-out boolean with the stated derivation at every call site.

Depends on `add-grade10-shopify-store` for `grade10-store/shopify-commerce`,
which establishes Shopify as authoritative for inventory. Overlaps
`cart-drawer-unavailable-items` on the cart line; that change owns the
component contract, this one owns what the store puts into it. No Figma change
required — the low-stock treatment reuses the drawn sold-out badge slot.
