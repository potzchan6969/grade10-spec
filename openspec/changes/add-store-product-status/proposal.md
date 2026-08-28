**Author:** @jeffffej0909 - 2026-08-28

## Why

A collector cannot tell from the storefront whether a card is one they can
still buy, and the three surfaces that answer do not agree. The listing draws a
tile as sold out or not, the card's page says for sale or not for sale, and the
cart drawer refreshes on open and marks a line sold out — three vocabularies,
each derived ad hoc from whatever the consuming application decided a Shopify
inventory read meant.

The evidence is the shape of the existing contracts: `ProductCard` takes a
boolean sold-out condition, `CartItemStatus` takes its own separate vocabulary,
and neither is derived from a stated rule. Nothing in `openspec/specs/` says
what an inventory field means to a collector, so every surface is free to
answer differently. The cost lands at checkout, where
`grade10-store/shopify-commerce` validates against live Shopify and refuses a
line the collector had every reason to believe was fine.

**Metric:** share of checkout attempts refused for an item that browsing had
shown as buyable. A stated derivation applied identically on all three surfaces
should move that toward zero; today it is unmeasured, so the first delivery
establishes the baseline. *(Assumption — the source PRD names no metric.)*

**Acceptance signal:** the same variant, at the same instant, reads the same on
its tile, on its card page, and on its cart line.

## What Changes

- **One stated derivation from inventory to what a collector sees.** Available
  quantity alone decides it: at or below zero the variant is out of stock,
  above zero it is available. `inventoryPolicy` is not read for MVP, so a
  variant set to `continue` with no stock reads out of stock and cannot be
  bought — the store never offers what it does not hold.
- **Availability is the only fact derived from quantity.** A surface says
  whether a variant can be bought and nothing more about how much remains: no
  count, no scarcity treatment, no label separating one available variant from
  another. A variant with one left is offered exactly as one with four hundred.
- **Unavailable is a cart-line condition only.** A product not published to the
  sales channel is absent from the listing and its address already answers 404
  under `grade10-store/product-page`. The only place a collector meets it is a
  cart line whose product was delisted mid-session, reported distinctly from
  out of stock.
- **A card's tile reflects its most available variant.** Available beats out of
  stock; a card is out of stock only when every variant on it is. Per-variant
  availability stays on the card's page.

No component contract changes. The listing already takes availability as a
supplied condition and already refuses to derive one itself; this change states
what the store must put into it.

## Non-Goals

- **Low stock, scarcity cues, and remaining counts.** Deliberately removed
  rather than deferred: the change now states that quantity produces
  availability and nothing else, so a surface cannot reintroduce a scarcity
  treatment without a change that says so. A later change may revisit it.
- **Pre-order.** `inventoryPolicy: continue` is deliberately not honoured as a
  sellable condition. Taking an order for stock the store does not hold is a
  product decision with its own fulfilment, payment-timing and cancellation
  consequences, and it needs its own change.
- **Multi-location inventory.** Single-location assumption; available quantity
  is read as one number.
- **Refresh cadence.** Whether a surface reads availability live or from cache
  is engineering's, bounded by the invalidation
  `grade10-store/shopify-commerce` already requires.
- **Visual treatment.** Whether out-of-stock and unavailable are drawn alike is
  design's; this change fixes only what each surface must communicate.
- **`CartItemStatus`'s own values.** The cart drawer's status vocabulary is
  being changed right now by `cart-drawer-unavailable-items`, which adds
  `unavailable`. This change states what the store must put into that type, and
  does not touch the type itself.
- **Checkout refusal.** Already `grade10-store/shopify-commerce`.

## Capabilities

### New Capabilities

- `grade10-store/product-status`: the single derivation from inventory facts to
  what a collector is told about buying a variant, the variant-to-product
  rollup, and what the listing, the card page and the cart must each
  communicate.

### Modified Capabilities

None. No existing requirement changes: `shared-ui/store-product-listing`
already takes a supplied sold-out condition and already forbids deriving one,
and `grade10-store/product-page`'s per-variant for-sale requirement is
unchanged by stating where that condition comes from.

## Impact

No change to `packages/ui` or `packages/i18n` — the listing's supplied
condition and the existing `soldOutSuffix` and `notForSaleNote` copy already
carry everything this change requires a surface to say. The work is in the
consuming store applications, which must derive the supplied condition from the
stated rule rather than from one of their own.

Depends on `add-grade10-shopify-store` for `grade10-store/shopify-commerce`,
which establishes Shopify as authoritative for inventory. Overlaps
`cart-drawer-unavailable-items` on the cart line; that change owns the
component contract, this one owns what the store puts into it. No Figma change.
