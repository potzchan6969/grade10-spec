**Author:** @ecchochan - 2026-10-02

## Why

A bid no longer holds money on the bidder's card: grade10#773 removed bid
card holds, and grade10#785 made a refused attempt leave no trace on My
Auctions. The record still describes holds and the states they fed.

- **A losing bidder is told about a hold no bid takes any more** - My
  Auctions' Didn't win row is specified to say the hold is being released or
  released. The build says the card was not charged, on a lot lost at the
  close and on a called-off lot.
- **An open listing reads states the build no longer has** - My Auctions'
  Status lists Bid submitted and Bid not accepted, the latter with a "card
  authorization failed" reason, and a leader whose raise is refused fits both
  Leading and Bid not accepted. The build shows Leading or Outbid, and a
  refused attempt moves nothing.
- **Analytics waits on an authorization** - Bid Placed fires "after
  authorization confirms", and Invoice Paid is kept from a hold capture.
  Neither authorization nor capture exists.
- **The pages describe the hold** - Bidding's My Auctions, Auction Management
  and the Auction Service architecture page still walk authorizations,
  releases and re-authorization.

**Metric:** scenarios and draft cases in account-record and analytics that
name a bid card hold or a Status the build cannot show - from eleven to none.

## What Changes

- **An open listing's Status** - Leading or Outbid. A refused attempt adds no
  row and moves no Status: a leader whose raise is refused stays Leading. The
  refusal shows on the bid panel, never on My Auctions. The requirement is
  renamed.
- **A bid's bookmark** - a bid Grade10 accepts enrolls the listing on My
  Auctions; a refused one does not. The requirement is modified.
- **A losing bidder's row** - Didn't win says the card was not charged, on a
  lot lost at the close and on a called-off lot. The requirement is renamed
  and US-04 reworded.
- **Analytics** - Bid Placed fires when a maximum is accepted, and the
  bid-hold clause and its scenario go. The rule is renamed.
- **Suites** - the draft cases that read a hold or the dropped states are
  rewritten at the next `<v>`, two cases are added for a refused attempt, and
  the case for a first bid confirming after the close is deprecated.
- **Pages** - the hold lines leave Bidding's My Auctions, Auction Management
  and Auction Service.

A requirement that drops a scenario is renamed with its whole block, since
`validate:changes` refuses a modified block that drops one. Each keeps its
scenario ids.

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/account-record` - "A bid bookmarks the listing on My
  Auctions" enrolls on a bid Grade10 accepts.
- `grade10-site/auction/account-record` - "A bidder's standing while a
  listing is open" becomes "An open listing reads Leading or Outbid".
- `grade10-site/auction/account-record` - "A losing bidder is told what
  happened to their card hold" becomes "A losing bidder reads that their card
  was not charged".
- `grade10-site/analytics/analytics` - "The browser may send client event
  names only" becomes "The browser sends client event names only", without
  the authorization or the bid-hold clause.

## Impact

- **Pages** - Bidding's My Auctions (`docs/prds/products/grade10-site/auction/bidding.md`)
  says a losing bidder's card was not charged and lists Leading and Outbid
  as the open-lot Status; Auction Management
  (`docs/prds/products/grade10-admin/auction/management.md`) and Auction
  Service (`docs/prds/platform/auction-service.md`) lose their hold lines, and
  the shared Auction Record page (`docs/prds/products/shared/ui/auction-record.md`)
  its dropped states. The lines are unmarked, since the build already shows
  every outcome.
- **grade10** - no behaviour change. grade10#773 and grade10#785 build the
  contract; the grade10 group retags the tests that hold it. Consumer app: the grade10 site
  (`apps/frontend/grade10`).
- **Component exports** - none move.
