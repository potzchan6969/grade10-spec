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
- **First bid unchanged** — the minimum first bid stays the starting price
  plus its tier increment, so a 0 start opens at the currency's lowest
  increment; the bidding rules do not change
- **One first-bid rule** — the auction requirement that still takes a first
  bid at the starting price is rewritten to the same rule (Q12), and the
  application's first-bid floor moves with it on every start

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-admin/auction/listing` — starting price may be 0
- `grade10-site/auction/auto-bidding` — a lone maximum on a 0 start stands
  at the lowest increment, not at 0 (Q4, held)
- `grade10-site/auction/auction` — a first bid meets the starting price plus
  its tier increment, not the starting price (Q12)

## Impact

- **grade10-admin** — listing form and API validation accept 0
- **No `@grade10/ui` export change**
- **grade10-site** — the first-bid floor rises by one tier increment on
  every lot with no bid yet, matching the Bidding page; the price a lone
  maximum stands at on a 0 start follows Q4

## Suites Above

- **grade10-site/auction** — `grade10-site-auction-e2e-US03-TC01-1` bid at the
  starting price; revised in this change's `domain-tcs.md`
- No domain impact: grade10-admin/auction — its cases trace publish and
  post-sale, and none turns on the starting price
- No product impact: grade10-admin — no product case turns on the starting
  price; grade10-site and the platform carry no product or platform suite

## Open questions

None — settled in the interview (`decisions.md`).

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
