**Author:** @mason5991 - 2026-09-30
**Co-author:** @ecchochan - 2026-10-01; @jeffffej0909 - 2026-09-29, for the zero starting price

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

**Rollout** - rooms, sockets and the close rules ship with no flag; a
rollback is a code revert. The room class deploys alone first, after
migration 0013, because a Durable Object migration is a rollback barrier
(Q11).

## Zero Starting Price

Folded from `allow-zero-starting-price` (Q15). Operators cannot run a
no-reserve lot that opens at nothing: create refuses a starting price of 0. A
0 start lets the market set the price from the first bid.

**Metric** - share of created listings that start at 0, and their first-bid
rate against listings with a positive start.

- **Starting price of 0 accepted** - a draft and create accept 0 in USD, HKD
  and JPY; negative and non-whole amounts are still refused - **BREAKING**
  against the current rule that a starting price is greater than zero
- **Opening price** - the first bid must reach the starting price, or the
  currency's lowest increment on a 0 start, and a lone bidder stands there;
  one increment above the current bid applies from the second bid (Q19)
- **One first-bid rule** - `bid-increments`, which asked for the starting
  price plus its increment, is rewritten to the opening price, so the two
  bidding specs and the application agree (Q27)
- **Built** - its code is merged in grade10 (#667)
- **Suites above** - no domain or product case turns on the starting price:
  the grade10-site auction domain suite's first bid stands at the starting
  price, which the opening price keeps, and no grade10-admin product or
  domain case reads it

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction` - a first bid meets the opening price, when a
  bid counts, which bids extend, the late window ending at the effective close, who settles a due lot, and the live relay after a
  commit
- `grade10-site/auction/listing-page` - the service clock, live updates
  without a reload, Closed with no result until the close commits, and Won
  or Did not win from the committed result
- `grade10-site/auction/account-record` - a bidding row's money is the
  auction's current or final price
- `grade10-admin/auction/listing` - a starting price may be 0
- `grade10-site/auction/auto-bidding` - a lone maximum on a 0 start stands at
  the lowest increment, not at 0 (Q19)
- `grade10-site/auction/bid-increments` - before any bid, the minimum is the
  opening price, not the starting price plus its increment (Q27)

## Impact

- **Auction worker** - one room class for lots and the catalogue, a public
  time route, live socket routes, a settle function shared by the alarm, an
  overdue read and the sweep, and the bounded late window on the bid and
  confirm paths
- **Storefront frontends** - the service clock and live updates on the lot
  page, the catalogue and Featured; the store's countdown blocks read one
  clock that rounds up
- **grade10-admin** - the listing form and API validation accept a starting
  price of 0
- **Copy catalogue** - one key added, holding each locale's existing first
  sentence of the failed-bid string (Q13); no new wording
- **Unchanged** - the three lot statuses in `grade10-site/auction/lot-status`,
  Postgres as the only authority, and the sweep
- **Flow** - [assets/live-relay.svg](assets/live-relay.svg)

## Open Questions

None. The product owner's rulings of 2026-10-01 settle Q1 to Q15 and Q31 to
Q35, and `allow-zero-starting-price`'s interview settled Q16 to Q30 -
[Decisions](decisions.md#decisions).

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
- [Bidding · My Auctions, Watchlist and Notifications](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
- [Auction Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Auction Service · Money invariants](../../../docs/prds/platform/auction-service.md#money-invariants)
- [Auction Service · Live lots](../../../docs/prds/platform/auction-service.md#live-lots)
