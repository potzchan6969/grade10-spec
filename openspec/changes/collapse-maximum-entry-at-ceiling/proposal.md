**Author:** @tangconst - 2026-10-13

## Why

A collector whose private maximum already sits at the listing currency's bid ceiling sees a raise panel that offers only amounts the auction refuses: three quick-bid chips above the ceiling, a `Min.` line naming an impossible amount, the one legal value drawn as an error, and a dead commit button. The service already refuses every further bid on such a lot; the panel never learned the rule, so the numbers on screen are unreachable and a collector cannot tell why.

## What Changes

- **BREAKING - Ceiling-bound chips** - a quick-bid amount computed above the supplied ceiling is offered at the ceiling, captioned as the limit; chips that collapse onto the same amount merge to one chip
- **No entry without a legal amount** - when the raise floor exceeds the ceiling, the chips, custom field and bid action give way to a status row: the amount reached, and a line that the auction accepts no higher amount; the buyer-fee line stays
- **Two collapsed readings** - a collector holding a maximum sees their `Max` amount with the limit line; a collector holding none, on a lot whose next minimum is already above the ceiling, sees the ceiling amount with the same kind of line
- **Ceiling reaches the floor** - the leader's raise floor is resolved against the ceiling, so `floor > ceiling` is the single condition behind the collapse

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/auction-listing`: quick-bid chips clamp to the supplied ceiling, and the bid panel offers no amount entry when no legal amount exists

## Impact

- **Pages** - [Listing Page Blocks - Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum) and [Bidding Rules - Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel)
- **Exports and consumers** - `ListingAuctionBidCard` behavior changes for the Grade10 collector site and shared preview; its existing copy type gains three required keys (`maximumAtCeiling`, `biddingAtCeiling`, `ceilingChip`), with no new component export and no change to the view contract
- **Repositories** - shared helpers, component, catalogs, fixtures and stories in `9gag/grade10-spec`; copy supply and browser regression in `9gag/grade10`
- **Related work** - [cap-custom-maximum-at-currency-ceiling](../cap-custom-maximum-at-currency-ceiling/) put the ceiling on the typed draft; this change extends the same ceiling to the chips and the floor, on the same requirement's neighbor

**No domain impact:** ceilings, increments, refusal codes, logs and bid side effects are unchanged; the service already refuses what the collapsed row now explains.

**No product impact:** no broader journey or smoke outcome changes beyond the scoped bid-panel presentation.

## References

- [Listing Page Blocks · Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum)
- [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel) - the collapsed row and clamped chips
