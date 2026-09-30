**Author:** @jeffffej0909 - 2026-09-29

## Why

Operators cannot run a no-reserve lot that opens at nothing: create refuses
a starting price of 0. A 0 start lets the market set the price from the
first bid.

**Metric:** share of created listings that start at 0, and their first-bid
rate against listings with a positive start.

## What Changes

- **Starting price of 0 accepted** — a draft and create accept 0 in USD, HKD
  and JPY; negative and non-whole amounts are still refused — **BREAKING**
  against the current rule that a starting price is greater than zero
- **Opening price** — the first bid must reach the starting price, or the
  currency's lowest increment on a 0 start, and a lone bidder stands there;
  one increment above the current bid applies from the second bid (Q4)
- **One first-bid rule** — `bid-increments`, which asked for the starting
  price plus its increment, is rewritten to the opening price, so the two
  bidding specs and the application agree (Q12)

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-admin/auction/listing` — starting price may be 0
- `grade10-site/auction/auto-bidding` — a lone maximum on a 0 start stands
  at the lowest increment, not at 0 (Q4)
- `grade10-site/auction/auction` — a first bid meets the opening price (Q12)
- `grade10-site/auction/bid-increments` — before any bid, the minimum is the
  opening price, not the starting price plus its increment (Q12)

## Impact

- **grade10-admin** — listing form and API validation accept 0
- **No `@grade10/ui` export change**
- **grade10-site** — on a 0 start the first-bid floor and a lone bidder's
  price are the lowest increment; a non-zero start keeps today's floor

## Suites Above

- No domain impact: grade10-site/auction — its first-bid case bids at the
  starting price, which the opening price keeps
- No domain impact: grade10-admin/auction — its cases trace publish and
  post-sale, and none turns on the starting price
- No product impact: grade10-admin — no product case turns on the starting
  price; grade10-site and the platform carry no product or platform suite

## Open questions

None — settled in the interview (`decisions.md`).

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
