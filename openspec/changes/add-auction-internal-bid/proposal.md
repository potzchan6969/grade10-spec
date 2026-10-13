**Author:** @htonyl - 2026-10-07

## Why

Every Grade10 lot is an absolute sale, so the house has one way to keep a
consigned card from selling far under its worth: a high starting price. That
puts collectors off bidding early, and once bidding opens it protects
nothing. Admins need to protect the final price without raising the opening
price.

**Metric** - protected lots that close sold below their internal amount: 0.
Share of protected lots an internal bidder wins, tracked against the
starting prices on lots with no internal bid.

## What Changes

- **BREAKING** **Internal bid on a listing** - an admin with secret-floor
  access sets a house maximum on a listing. Grade10 bids it like any
  collector's maximum: second-highest plus one increment, hidden, under a
  listing pseudonym. The highest bid at the close may now be the house's,
  which reverses the bidding PRD's "Absolute sale" decision
- **Committed at a set time** - the admin picks when Grade10 commits the
  internal bid, between the start and the scheduled close. Until then the
  house is not in the bidding, so early collector bids meet no floor
- **Editable within limits** - before its time, the amount and the time can
  change or be removed. After it, the time is fixed and the amount can go up
  until the close, or down only when the leader and the current bid stay as
  they are, and never below a bid already placed for the house. Collector
  maximums stay raise-only
- **Too late is visible** - an internal bid that is already short of the next
  bid at its time is not placed. The admin sees that and can still raise it
- **Internal bidder win** - a lot an internal bidder wins reads sold to
  collectors. Its order and invoice go to that internal bidder, flagged
  internal; an operator sends the invoice, lets it expire after 7 days and
  cancels the order, as for any unpaid order. Only a reserve holder sees the
  listing flagged as the internal bidder's win
- **Internal bidders** - an admin keeps several internal bidder profiles in
  auction admin, and picks one for each listing's internal bid
- **Secret to staff** - only `auction:reserve` (admin) sets an internal bid or
  sees its amount, time or state. Other operators see nothing of it until the
  house bids, then its bids and orders labelled House,
  never the amount or the time. The audit trail records each set, change and
  removal without the amount or the time, so an operator with audit access
  may learn that a lot has one

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/auction/internal-bid`: setting, scheduling, editing and
  reading a listing's house maximum, its access, and the internal bidder's order as
  operators see it

### Modified Capabilities

- `grade10-site/auction/auto-bidding`: the house maximum takes part in the
  two-maximum rule, is committed at a set time rather than by a bidder, and
  is the one maximum that may be lowered
- `grade10-site/auction/auction`: a lot an internal bidder leads at the close
  reads sold, and its order is the internal bidder's
- `grade10-site/auction/notifications`: a house win sends the ordinary lost
  and watched-sold letters and no winner letter, and the house is never
  mailed
- `grade10-site/auction/winner-order`: the order a close opens for an internal
  bidder takes its billing address and sends no letter

## Impact

- **Auction service** - a house maximum per listing, its commit at a set time
  on the lot's own clock, the lowering rule, and an internal bidder's order
  that takes the profile's address and sends no letters
- **Auth contracts** - `auction:reserve` comes into use, and its description
  changes from a seller's reserve to the internal bid
- **Admin listing editor** - an internal bid section shown only under
  `auction:reserve`, readable on a published listing
- **Public reads and letters** - the house's bids, standing and win read like
  a collector's under its pseudonym

## Suite Impact

- No product impact: the change touches one domain per product (auction); `grade10-admin/product-tcs.md` traces no capability this change touches, and grade10-site has no `product-tcs.md`
- No platform impact: the store has no `platform-tcs.md`, and the admin-to-site path is walked by the `grade10-admin/auction` domain case

## Release Gate

- **Legal** - confirms the auction terms wording for an undisclosed house bid
  before release. The author held "undisclosed" against the interview's
  recommendation to disclose (decisions.md Q1, Q31). Planning and the build
  go ahead; release waits on Legal, and a disclosure ruling is a follow-up
  change

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Post-Bidding · The Close](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-close)
- [Internal Bid · Internal Bid](../../../docs/prds/products/grade10-admin/auction/internal-bid.md#internal-bid)
