**Author:** @htonyl - 2026-10-24

## Why

A collector reading one listing's story on My bids sees a challenger's bid sit above the automatic response it set off, so the price seems to climb down the page: the lower amount on top, the higher beneath it. Grade10 issue 9gag/grade10#1292 settled the reading as the price ladder, higher on top. The metric that would move is reports from collectors that a listing's story reads out of order, which should fall to none.

## What Changes

- **Highest bid on top** - a listing's combined history follows bid amount, the higher amount above the lower
- **Response above its cause** - when a bid and the automatic bid it set off share a timestamp, the automatic response reads above the challenger's bid, because the challenger's bid is the older of the two
- **Maximum set below its bid** - an owner's maximum-set event follows the same rule and reads below the bid it causes
- **Cases follow** - the scenario and the walk that state the old order are restated to match; the end-to-end test that decides the walk is named, and its expectation changes with it

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bidding-history`: the combined history's order within one timestamp, replacing "the challenger's public record SHALL precede the automatic response"

## Impact

- **Consumer app** - `9gag/grade10`: one ordering change in `combinedHistory.ts`, made after acceptance; the end-to-end test `apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts` decides the walk and changes its expectation with it
- **Contract** - no component export changes
- **Domain suite** - No domain impact: `g10.auction-dmn` cases that trace this journey assert no history order

## References

- [Bidding Rules · Bidding History](../../../docs/prds/products/grade10-site/auction/bidding.md#bidding-history)
