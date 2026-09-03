# Auto bidding

**Author:** @jeffffej0909 - 2026-08-24

Product context: [Auto bidding](../../../docs/prds/auction/auto-bidding.md).
Builds on [`add-grade10-auction`](../add-grade10-auction/proposal.md), which
delivered browse, the scheduled window, card-backed bids, and the extension
rule, and listed auto-bidding as a non-goal. This change is that non-goal.

## Why

A collector can only lead a Grade10 lot by being awake when it closes. Bidding
is manual, and the extension rule means the close moves every time a late bid
lands — so a lot that was scheduled to end at 6:00 pm can still be running at
8:00. A collector who wants a card has two options: sit on the page for hours,
or bid high early and hope. The first is a demand almost nobody meets; the
second overpays on purpose.

The evidence is in the extension rule itself. It exists because bidders arrive
at the last minute, and it works by pushing the close back for every one of
them. Every collector who cannot be there for that moving close is a bid the
lot never receives.

Auto bidding takes the maximum a collector is willing to pay and bids for
them in the lot's own increments, only as far as needed to lead. They set it
once and leave.

**Metric:** the share of accepted bids placed by the platform on a bidder's
behalf rather than by a person clicking, and the share of lots whose winner
was not on the page when the lot closed. **Acceptance signal:** a collector
sets a maximum, closes the tab, and wins at less than that maximum.

## What Changes

- **A bidder commits a maximum, not a bid.** They enter the most they will
  pay; the platform bids for them only as far as needed to lead.
- **The current bid is the second-highest maximum plus one increment**,
  capped at the leader's maximum — the eBay and Goldin resolve. A bid below
  the leader's maximum still adds the listing increment. The first bidder
  sits at the starting price.
- **The maximum stays hidden while it leads.** Another bidder learns it only
  by beating it, and then only because the current bid steps to it plus one
  increment.
- **The increment is the listing's own.** The one an operator already sets per
  listing. This change introduces **no** price-banded increment schedule; a
  lot's increment is a lot's own business.
- **Grade10 resolves once per new commitment.** It lands at the two-maximum
  price in one bid. Standing maxima do not keep bidding, and there is no
  auto-bid timer.
- **A maximum can be raised, never lowered.** Raising re-commits; lowering
  would withdraw a commitment other bidders have already bid against.
- **The card hold covers the maximum, not the current bid.** A bidder who
  commits 50000 minor units has 50000 authorized, even while the current bid
  is 22500. This keeps the existing one-authorization-per-bidder-per-listing
  rule true and means an auto bid never needs a fresh card check mid-auction.
- **An auto bid is a bid.** It extends the close exactly as a manual bid does,
  including inside the extension window, once per accepted commitment.

## Non-Goals

- **A price-banded increment table.** Explicitly rejected: increments stay
  per-listing.
- **Reserve prices.** They remain removed. Nothing here reintroduces a reserve
  amount, reserve state, or a reserve-based no-sale outcome.
- **Invoicing, orders, capture, or fulfilment.** The card hold model delivered
  by `add-grade10-auction` stands unchanged. What happens after a lot closes
  is out of scope and will be specified separately.
- **Lowering or withdrawing a maximum**, and cancelling a committed bid.
- **Telling a bidder they are about to be outbid**, or any nudge to raise a
  maximum. Notifications are `add-auction-notifications`.
- **Watching a lot.** That is `add-auction-watchlist`.
- **Changing what an operator can configure.** No new listing field.

## Capabilities

### New Capabilities

- `grade10-site/auction/auto-bidding`: a bidder commits a maximum and the platform
  bids for them — the two-maximum rule, that the price is the second-highest
  plus one increment, who leads on a tie, when a maximum may be raised, what
  stays hidden, how the card hold relates to the maximum, and that an auto bid
  resolves once per commitment.

### Modified Capabilities

None. `grade10-auction/auction` is still an in-flight change, so its
requirements cannot carry a delta yet. See Impact for the one reconciliation
its archive must make.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | The bid decision becomes an auto-bid resolution: it stores a maximum per bidder per listing, derives the current bid from the top two maximums, and settles ties by commit order. Still one serialized decision per listing. |
| `apps/backend/grade10/store` | Passes a maximum rather than a bid amount on the authenticated bid action. |
| `@grade10/auction-contracts` | The bid action carries a maximum. Listing facts gain the viewer's own maximum. **BREAKING** for any consumer sending a bare bid amount. |
| `@grade10/stripe-backend` | Authorizes the committed maximum instead of the current bid. Release behaviour is unchanged. |
| `apps/frontend/grade10` | The bid control asks for a maximum and explains that the collector may pay less. |
| `@grade10/ui` `ListingBidPanel` | Needs a slot for the viewer's own maximum. See `ui-design.md`. |
| `apps/admin/grade10` | Bid history shows both the maximum committed and the resulting current bid, so an operator can answer a dispute. |

**Reconciliation `add-grade10-auction` must make at archive.** Its requirement
*Bids are valid only within the scheduled, extendable window* says Grade10
displays "their highest accepted bid" to an authenticated bidder. Under auto
bidding a bidder's highest accepted bid and their committed maximum are
different numbers, and the useful one is the maximum. When that change folds
into `openspec/specs/`, that sentence needs updating to match
`auto-bidding-SC-05`. Recorded here so it is not lost.

**Ordering.** Independent of `add-auction-watchlist` and
`add-auction-notifications`. It shares no capability with either and can land
first, last, or alongside.
