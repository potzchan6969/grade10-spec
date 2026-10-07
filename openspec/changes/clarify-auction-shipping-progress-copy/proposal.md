**Author:** @tangconst - 2026-09-30

Product context: [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order) and [Order Status](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-status).

## Why

A paid, undispatched order badges **Processing** while Order Progress pings
on **Shipped**. The ping marks the current phase; past-tense **Shipped**
reads as already dispatched. Collectors cannot tell packing from transit.

**Metric:** on Preparing Shipment Winner Order and My Auctions stories, the badge
reads Preparing Shipment and Order Progress pings on Shipping with
Preparing to ship subtext (target: 100%).

## What Changes

- **Progress step 4** — **Shipped** becomes **Shipping** (phase noun beside
  Address, Invoice, Payment).
- **Paid, undispatched status** — **Processing** becomes **Preparing
  Shipment** on Winner Order, My Auctions, My Auction Orders, and admin
  queue outcomes that show the same derived name.
- **Shipping subtext** — while Preparing Shipment, Shipping reads Preparing
  to ship; while Shipped, the day-only date and tracking number remain. The
  tracking number is the carrier link, with no separate button or carrier
  name in the progress chrome, as the Post-Bidding product record requires.
- **Derivation unchanged** — invoice `paid` + fulfilment `unfulfilled` still
  yields that status; only the display name moves.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/order-status` — derived display name Preparing
  Shipment for paid, undispatched.
- `grade10-site/auction/winner-order` — five progress steps; Shipping phase;
  Preparing Shipment subtext.
- `grade10-site/auction/account-record` — My Auctions Won status vocabulary.
- `grade10-site/auction/lot-status` — order-derived name in the lot→Ended map.

Admin queue outcomes that mirror the derived name are updated in
`complete-auction-post-sale`. My Auction Orders and related Winner Order
payment-confirm copy are updated in `add-my-auction-orders`.

## Impact

- Preview Winner Order / My Auctions labels, i18n `auctionOrders.status.processing`,
  auction-record fixtures.
- Consuming `grade10-site` adapts labels on submodule bump; admin queue copy
  follows with `complete-auction-post-sale`.
- Store order status copy stays Processing (separate vocabulary).
- PRD Progress Under Shipping line and Progress stepper decision carry 🚧
  this change delivers. Order Progress adds no separate carrier name. The
  carrier-name row in `Records the winner keeps` is removed by
  `add-winner-order-tax-line`, which carries that requirement.
- Shipped badge tone matches Preparing Shipment (`default`) on Winner Order
  and My Auctions — see `ui-design.md`.

## Open Questions

None.

**Archive:** @tangconst after implementation verification.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Order Status](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-status)
