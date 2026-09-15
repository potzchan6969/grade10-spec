# grade10-site/auction/account-record Specification

## Purpose
A signed-in collector's own record of the auction listings they bookmark —
by watching or by bidding — on one My Auctions table: how a watch is made
and removed, how a bid enrolls the list, what Your Standing shows while a
listing is open and after it closes, and what a winner and a losing bidder
are told once a listing closes. The detailed Bidding index and listing
history remain the contract of `grade10-site/auction/bidding-history`.
Owner-only — nobody but the collector sees their record.

## Feature set

- **Watching a listing**
  - Watch and unwatch: lets a collector mark interest before they are ready to
    bid, from wherever the listing is shown.
  - Private by default: a watch says nothing to anyone but its owner, so
    marking interest costs nothing.
  - Watch limit: keeps the list a considered one and the read bounded.
- **The Watching page**
  - Four listing states: answers whether a listing is open and how soon it
    closes, and refuses to answer more than that.
  - Ordering and the bid marker: puts the next close first and hands a listing
    the collector already bid on over to the Bidding page.
- **The Bidding page**
  - Tab boundary: provides the account entry point and account-level groups;
    the detailed index, filters, and listing story come from
    `grade10-site/auction/bidding-history`.
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not.
  - Three groups: separates the listings that still need the collector from
    the ones that are finished.
- **After a close**
  - Winner's payment and shipment: lets a winner follow their own listing to
    delivery without contacting Grade10.
  - Losing bidder's card hold: says what happened to their authorization, so a
    pending hold is not read as a charge.
- **Reaching the record**
  - Ownership: resolves the record from the session and nothing else.
  - Landing, empty, and failed reads: makes an unused record and a broken one
    tell the collector different things.

## Requirements

### Requirement: A collector watches a listing from where it is shown

Grade10 SHALL let a signed-in collector watch and unwatch a listing from that
listing's own page and from the catalogue that lists it. A watch SHALL be
private to the collector who made it: no other collector's record changes, and
no count of watchers appears on any public surface.

Unwatching SHALL be reversible immediately after the act, without the collector
finding the listing again.

A watch attempt carrying no session SHALL record no watch. Grade10 SHALL NOT
hold a watch for an anonymous visitor.

#### Scenario: grade10-site-auction-account-record-SC-01 - A collector watches from a listing's page
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a signed-in collector reading a published listing's own page
- **WHEN** they watch it
- **THEN** that listing is on their Watching page
- **AND** the listing's page shows it as watched

#### Scenario: grade10-site-auction-account-record-SC-02 - A collector watches from the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a signed-in collector reading the auction catalogue
- **WHEN** they watch a listing without opening it
- **THEN** that listing is on their Watching page
- **AND** they are still on the catalogue

#### Scenario: grade10-site-auction-account-record-SC-03 - Unwatching can be undone
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector who has just unwatched a listing
- **WHEN** they undo that act
- **THEN** the listing is on their Watching page again
- **AND** they did not have to find the listing a second time

#### Scenario: grade10-site-auction-account-record-SC-04 - A watch without a session is not recorded
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a visitor carrying no session
- **WHEN** they attempt to watch a listing
- **THEN** Grade10 records no watch
- **AND** no watch appears for any collector

#### Scenario: grade10-site-auction-account-record-SC-05 - A watch is private
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** one collector who watches a listing and a second collector who does
  not
- **WHEN** the second collector reads that listing's page, the catalogue, and
  their own record
- **THEN** nothing tells them the first collector watches it
- **AND** no watcher count is shown

### Requirement: A watch outlives the listing it was made on

Grade10 SHALL keep a collector's watch when the listing stops being published,
and SHALL show that listing on the Watching page as Ended rather than removing
the row.

Grade10 SHALL enforce a maximum number of watches per collector. An attempt to
watch beyond that maximum SHALL be refused, SHALL record no watch, and SHALL
tell the collector the maximum has been reached. The maximum's value is a
design decision and is not fixed by this requirement.

#### Scenario: grade10-site-auction-account-record-SC-06 - The watch maximum refuses a further watch
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector holding the maximum number of watches
- **WHEN** they watch another listing
- **THEN** Grade10 refuses it and records no watch
- **AND** the collector is told the maximum has been reached

#### Scenario: grade10-site-auction-account-record-SC-07 - An unpublished listing stays on the page
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector watching a listing that Grade10 then stops publishing
- **WHEN** they open their Watching page
- **THEN** that listing is still listed
- **AND** its state is Ended

### Requirement: Watching states

A listing on the Watching page SHALL carry exactly one of these states. The
page SHALL NOT report where the collector stands as a bidder; that is the
Bidding page's.

| State | When |
| --- | --- |
| Scheduled | Published, bidding has not opened. Carries when it opens. |
| Live | Bidding open, more than 60 minutes to the recorded close |
| Ending soon | Bidding open, 60 minutes or less to the recorded close |
| Ended | Bidding is over, however it ended — sold, unsold, or called off |

#### Scenario: grade10-site-auction-account-record-SC-08 - A scheduled listing says when it opens
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a watched listing that is published and whose start has not arrived
- **WHEN** the collector opens their Watching page
- **THEN** that listing's state is Scheduled
- **AND** the row carries when bidding opens

#### Scenario: grade10-site-auction-account-record-SC-09 - Ending soon begins at 60 minutes
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a watched listing whose recorded close is 60 minutes or less away
  and has not passed
- **WHEN** the collector opens their Watching page
- **THEN** that listing's state is Ending soon

#### Scenario: grade10-site-auction-account-record-SC-10 - Every way of ending reads as Ended
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** three watched listings — one sold, one that closed with no winner,
  and one called off
- **WHEN** the collector opens their Watching page
- **THEN** all three carry the state Ended

### Requirement: The Watching page orders by close and marks what was bid on

The Watching page SHALL order listings by the soonest recorded close first,
with listings whose bidding is over after those still open.

A watched listing the collector has also bid on SHALL be marked as one they bid
on and SHALL open that listing's row on the Bidding page in one step.

Unwatching a listing SHALL NOT change any bid the collector placed on it, and
SHALL NOT remove it from the Bidding page.

#### Scenario: grade10-site-auction-account-record-SC-11 - The next close is first
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** watched listings closing in two hours, in ten minutes, and one that
  closed yesterday
- **WHEN** the collector opens their Watching page
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

#### Scenario: grade10-site-auction-account-record-SC-12 - A watched listing they bid on is marked
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector who watches a listing and has placed a bid on it
- **WHEN** they open their Watching page
- **THEN** that listing is marked as one they bid on
- **AND** opening the mark takes them to that listing on the Bidding page

#### Scenario: grade10-site-auction-account-record-SC-13 - Unwatching leaves the bid alone
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector who watches a listing and has bid on it
- **WHEN** they unwatch it
- **THEN** the listing is gone from their Watching page
- **AND** it is still on their Bidding page with their standing unchanged

### Requirement: A bidder's standing while a listing is open

A Bidding page row SHALL be an account-facing summary. The detailed index,
private action log, and listing chronology SHALL follow the
`grade10-site/auction/bidding-history` contract; this capability SHALL NOT
create a second bidding history or event log.

A listing on the Bidding page whose bidding window is open SHALL carry exactly
one of these states.

| State | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands. Carries the minimum next valid bid |
| Bid submitted | The collector placed a bid Grade10 has not yet accepted |
| Bid not accepted | Grade10 refused the collector's last bid. Carries which of: below the minimum next bid, the window had closed, or card authorization failed |
| Ending soon | Open, 60 minutes or less to the recorded close, at any standing above |

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Leading

#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: grade10-site-auction-account-record-SC-16 - A refused bid says why it was refused
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a collector whose last bid on an open listing was refused for being
  below the minimum next bid
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Bid not accepted
- **AND** the row says the bid was below the minimum next bid

#### Scenario: grade10-site-auction-account-record-SC-17 - A bid awaiting acceptance is not a standing
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a collector who has placed a bid Grade10 has not yet accepted
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Bid submitted
- **AND** the row does not claim they are Leading

### Requirement: The Bidding page groups by what is still owed

The account record SHALL place every listing the collector has bid on into
exactly one of three account-level groups: **Active** while its bidding window
is open, **Won** when the collector is its winner, and **Didn't win** for every
other closed listing they bid on. The durable Bidding History index remains the
source for listing-level history and its Active/Completed filtering; these
groups are the My Auctions presentation of that record.

#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open their Bidding page
- **THEN** that listing is under Won

#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open their Bidding page
- **THEN** that listing is under Didn't win

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the auction order's derived status, projected
from the invoice status, fulfilment status, payment deadline, and delivery
confirmation defined by `grade10-site/auction/order-status`. The account record
SHALL show the same status vocabulary as the auction order and SHALL NOT invent
a second payment or shipment state.

| Collector state | Reached from |
| --- | --- |
| Pending Payment | Invoice status is `pending`, and the payment deadline has not elapsed |
| Expired | Invoice status is `pending`, and the payment deadline has elapsed |
| Processing | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

This surface SHALL remain read-only. It SHALL offer no control that records
payment, requests a wire, records shipment, changes an address, or changes an
auction order's status.

#### Scenario: grade10-site-auction-account-record-SC-20 - Card capture reads as Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `paid` and whose fulfilment status is `unfulfilled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-21 - Manual collection reads as the same Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose collection an operator recorded outside Stripe is `paid`, and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

#### Scenario: grade10-site-auction-account-record-SC-22 - A payment problem says how to reach Grade10
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `pending` and whose payment deadline has passed
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Expired
- **AND** the row carries how to reach Grade10

#### Scenario: grade10-site-auction-account-record-SC-23 - Shipment states reach the winner
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose paid order is fulfilled without delivery confirmation and one whose paid order has delivery confirmation
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped
- **AND** the second listing's state is Delivered

#### Scenario: grade10-site-auction-account-record-SC-24 - The winner is offered no write
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in any auction-order status
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, requests a wire, records shipment, changes an address, or changes the order status

#### Scenario: grade10-site-auction-account-record-SC-35 - A cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded

### Requirement: A losing bidder is told what happened to their card hold

A listing under Didn't win on which the collector held a card authorization
SHALL say whether that authorization is still being released or is released.
Grade10 SHALL NOT describe an authorization as released while its release is
still in flight.

A listing the collector bid on that was called off SHALL appear under Didn't
win carrying the same statement about their authorization.

#### Scenario: grade10-site-auction-account-record-SC-25 - A release in flight says so
**Serves:** grade10-site-auction-account-record-US-04 - Know my money is coming back when I lose

- **GIVEN** a closed listing the collector did not win, whose authorization
  Grade10 has marked for release and whose release is not complete
- **WHEN** they open their Bidding page
- **THEN** the row says the hold is being released
- **AND** it does not say the hold is released

#### Scenario: grade10-site-auction-account-record-SC-26 - A completed release says so
**Serves:** grade10-site-auction-account-record-US-04 - Know my money is coming back when I lose

- **GIVEN** the same listing once its release is complete
- **WHEN** the collector opens their Bidding page
- **THEN** the row says the hold is released

#### Scenario: grade10-site-auction-account-record-SC-27 - A called-off listing tells the bidder about the hold
**Serves:** grade10-site-auction-account-record-US-04 - Know my money is coming back when I lose

- **GIVEN** a listing the collector bid on that Grade10 called off
- **WHEN** they open their Bidding page
- **THEN** that listing is under Didn't win
- **AND** the row says what happened to their authorization

### Requirement: The record belongs to its owner alone

Grade10 SHALL resolve an auction record from the caller's session and no other
input. A request carrying no session SHALL be refused and SHALL return no
record. No input a collector supplies SHALL select another collector's record.

#### Scenario: grade10-site-auction-account-record-SC-28 - A signed-out request is refused
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a request carrying no session
- **WHEN** it reads an auction record
- **THEN** Grade10 refuses it as unauthenticated
- **AND** returns no watch and no bid

#### Scenario: grade10-site-auction-account-record-SC-29 - A collector cannot address another record
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a signed-in collector
- **WHEN** they read an auction record
- **THEN** the record is their own session's
- **AND** no input they supply selects a different collector's record

### Requirement: Landing, empty, and failed reads

The record SHALL open on Bidding when the collector has bid on at least one
listing, and on Watching otherwise.

An empty Watching page and an empty Bidding page SHALL each offer a way into
the catalogue, and SHALL NOT be presented as a failure. A group of the Bidding
page with no listings SHALL NOT empty the page while another group has one.

A read Grade10 could not complete SHALL be shown as a failure that can be
retried, and SHALL NOT be shown as an empty record.

A value that follows the clock — a close, a current bid, a minimum next bid —
that Grade10 could not refresh SHALL be shown as not current rather than
presented as current.

#### Scenario: grade10-site-auction-account-record-SC-30 - A bidder lands on Bidding
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a collector who has bid on at least one listing
- **WHEN** they open their auction record
- **THEN** they are on the Bidding page

#### Scenario: grade10-site-auction-account-record-SC-31 - A collector who has never bid lands on Watching
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a collector who has never placed a bid
- **WHEN** they open their auction record
- **THEN** they are on the Watching page

#### Scenario: grade10-site-auction-account-record-SC-32 - An empty Watching page offers the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a collector watching no listing
- **WHEN** they open their Watching page
- **THEN** the page offers a way into the auction catalogue
- **AND** it does not report an error

#### Scenario: grade10-site-auction-account-record-SC-33 - A failed read is not an empty record
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a collector whose record Grade10 cannot read
- **WHEN** they open it
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty record

#### Scenario: grade10-site-auction-account-record-SC-34 - A value that could not be refreshed says so
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a record whose rows are shown but whose current bid could not be
  refreshed
- **WHEN** the collector reads it
- **THEN** that value is shown as not current
