**Author:** @mason5991 - 2026-09-30
**Co-author:** @ecchochan - 2026-10-01

## Why

Two collectors watching the same lot see different things. Each page counts
down on its own device, so the remaining seconds disagree. Only the
five-minute sweep closes a lot, so a lot that ends at 20:00:00 closes up to
five minutes later, and meanwhile a page that reaches its own deadline shows
Unsold to everyone, the winner included. A bid confirmed after the effective
close is still accepted while the sweep lags, and can extend the lot again. A
bid on one page reaches another only on its next poll, and My Auctions shows
a bidder their own last bid where the auction's price belongs.

**Metric** - open lot pages and catalogue cards on one lot show the same
remaining seconds, the same status and the same recorded close after an
accepted bid, an extension or a close; the close lag, from the effective
close to the committed close, is measured rather than asserted; and every
bidder's My Auctions Ended row shows the auction's final price.

## What Changes

- **One clock** - every page counts down on the auction service's clock, not
  the device's, and a countdown rounds up so the last second never reads 0
- **Live pages** - one room per lot and one for the catalogue send each
  committed change to every open page; rooms read the committed lot back from
  Postgres and decide nothing
- **The close happens at the close** - the lot room's alarm settles a lot at
  its deadline, a read that finds a lot overdue settles it next, and the
  sweep stays the net
- **A bid counts when its payment confirms** - a confirm after the effective
  close loses with no grace and its hold is released; a lone first bid still
  confirming at the scheduled close leaves the lot unsold
- **Only a bid that moves the price extends** - a leader raising their own
  maximum does not keep the lot open
- **The late window has an end** - the scheduled close plus the extension
  reach; a duration or a cap of 0 means no extension
- **No new states** - between the close and the result, pages show the
  existing Closed state with no result yet; the public status stays
  Upcoming, Active, Ended, and every moment in between uses existing copy
- **My Auctions** - a bidding row shows the auction's current or final price,
  and after the close the standing reads Won or Did not win from the
  committed result

**Rollout** - rooms and sockets ship behind the `auction.realtime` flag; the
close rules ship without one.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction` - when a bid counts, which bids extend, the
  bounded late window, who settles a due lot, and the live relay after a
  commit
- `grade10-site/auction/listing-page` - the service clock, live updates
  without a reload, Closed with no result until the close commits, and Won
  or Did not win from the committed result
- `grade10-site/auction/account-record` - a bidding row's money is the
  auction's current or final price

## Impact

- **Auction worker** - one room class for lots and the catalogue, a public
  time route, live socket routes, a settle function shared by the alarm, an
  overdue read and the sweep, and the bounded late window on the bid and
  confirm paths
- **Storefront frontends** - the service clock and live updates on the lot
  page, the catalogue and Featured; the store's countdown blocks read one
  clock that rounds up
- **Unchanged** - the three lot statuses in `grade10-site/auction/lot-status`,
  the copy catalogue, Postgres as the only authority, and the sweep
- **Flow** - [assets/live-relay.svg](assets/live-relay.svg)

## Open Questions

None. The product owner's rulings of 2026-10-01 settle every question this
change raised - [Decisions](decisions.md#decisions).

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
- [Bidding · My Auctions, Watchlist and Notifications](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
- [Auction Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
- [Auction Service · Money invariants](../../../docs/prds/platform/auction-service.md#money-invariants)
- [Auction Service · Live lots](../../../docs/prds/platform/auction-service.md#live-lots)
