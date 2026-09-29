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

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-admin/auction/listing` — starting price may be 0
- `grade10-site/auction/auto-bidding` — a lone maximum on a 0 start stands
  at the lowest increment, not at 0 (Q4, held)

## Impact

- **grade10-admin** — listing form and API validation accept 0
- **No `@grade10/ui` export change**
- **grade10-site** — the first-bid minimum already covers a 0 start; the
  price a lone maximum stands at does not, and follows Q4

## Open questions

None — settled in the interview (`decisions.md`).

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
