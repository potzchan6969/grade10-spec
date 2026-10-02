**Author:** @ecchochan - 2026-10-02

## Why

A tester placed a bid, saw it as placed, and then read Bid not accepted on My
Auctions. The record still describes two things grade10 no longer does:

- **A bid holds money on the card** - the specs walk a bid-time card
  authorization: a bid that counts only once its payment confirms, a hold
  released when the bidder is outbid or loses, an "Authorizing…" state, and a
  losing row that says the hold is being released. grade10#773 and its repair
  #783 removed every hold: a bid stands on the card on file the moment it is
  accepted, and only the winner pays, through hosted Checkout.
- **A refused attempt reads as a bid** - the specs keep every refused maximum
  in the bidder's history with its reason, list a listing whose every attempt
  was refused as failed-only, and show Bid submitted and Bid not accepted on My
  Auctions. grade10#785 made a refused attempt write nothing: the refusal
  shows on the bid form that made it, and nowhere else.

grade10#795 and grade10-spec#829 gave the bid form its own words for a
maximum not raised, a suspended bidder and a banned one. grade10#789 ended
each history page on a whole auction decision.

**Metric** - requirements, journeys and draft cases that name a bid-time card
hold, a payment-confirmed bid, a refused attempt in the bidder's record, or a
Bid submitted or Bid not accepted standing: from about 120 to none.

## What Changes

- **No bid-time card hold** - a bid stands on the card on file when it is
  accepted, and nothing is held or charged on the card at bid time. Only the
  winner pays, through hosted Checkout. `bid-payment-method` keeps card
  linking, the card a lot locks to, and the premium disclosure.
- **Not charged, said plainly** - a losing row and a called-off row on My
  Auctions read "Your card was not charged."
- **A refused bid is not a bid** - a refused attempt writes no bid, no My
  Auctions row, no bidding-history entry and no standing, and moves no row. The
  bid form shows why, in the bid form's own words. Bid submitted, Bid not
  accepted, failed-only and the refusal-reason vocabulary go.
- **Refusals stay operator-side** - each refusal is one structured operational
  log at the auction service's boundary, naming the bidder, the lot, the code,
  the amount and the floor. grade10 adds the bidder, the amount and the floor
  to the line it writes today.
- **A lost answer** - a bid whose answer is lost on the way back still reads as
  placed when the bidder's standing holds it.
- **Erasing the leader** - the runner-up takes the lead, re-priced from the
  maxima left, never above the price before the erasure.
- **Whole decisions per page** - a history page ends on a whole auction
  decision.
- **If holds return** - the invariant they must keep is recorded as a decision,
  so a future hold never revokes an accepted bid.

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction` - a bid counts when it is accepted; a refused
  attempt places nothing and the bid form says why; an erased leader's lot
  re-stands on the runner-up; the authorization requirements go.
- `grade10-site/auction/bid-payment-method` - shrinks to card linking, the
  card a lot locks to, and the premium disclosure.
- `grade10-site/auction/auto-bidding` - a maximum stands without a card
  authorization; the hold requirement goes.
- `grade10-site/auction/bid-panel-enrollment` - the authorization states and
  hold copy go from the panel and setup.
- `grade10-site/auction/account-record` - an outbid collector whose raise is
  refused stays Outbid; `my-auctions-without-bid-holds` already settled the
  rest of My Auctions.
- `grade10-site/auction/bidding-history` - the index and history hold only
  placed bids; failed-only, refused attempts and refusal reasons go; a page
  ends on a whole decision.
- `grade10-site/auction/listing-page` - the result words lose Authorizing…
  and the bid confirmed after the close.
- `grade10-site/auction/winner-order` - a lot close no longer releases a
  hold.
- `grade10-site/analytics/analytics` - a refused maximum records no Bid
  Placed.
- `shared/ui/auction-listing` - the enrollment and lost-standing requirements
  stop naming authorization.
- The `grade10-site/auction` domain suite - its hold and refused-attempt cases
  are rewritten or retired.

## Impact

- **Pages** - Bidding, Post-Bidding, Display, Account, Auction Management,
  Auction Record and Listing Page blocks, Account Data and Auction Service
  state what runs, unmarked, since grade10 already shows every outcome
  (`page_waived`).
- **grade10** - one small change: the refusal log line names the bidder, the
  amount and the floor; the new tests cite their scenario ids;
  `docs/architecture/auction.md` drops the refused maximum from bid history and
  links the archived relay change. Consumer app: the grade10 site
  (`apps/frontend/grade10`) and the auction service.
- **Changes in flight** - `complete-auction-post-sale`,
  `define-public-auction-identifiers` and `close-overdue-address-confirmation`
  carry text this change rewrites; each reconciles at its own acceptance,
  which refuses a requirement that moved since it began.
- **Component exports** - none move.

## Follow-on changes

- **Retrying a bid safely** - a resubmitted attempt answers its original
  outcome: the bid form sends one key per confirmed attempt, the auction
  replays the first answer for that key, and refuses the key reused with
  another maximum. The retry replaces the read of the bidder's standing after
  a lost answer, and closes the race where that read runs before the commit

## Open questions

None.

## References

- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic)
- [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel)
- [Post-Bidding · The Close](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-close)
