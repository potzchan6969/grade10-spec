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
listing's own page and from the catalogue that lists it, **when they have no
bid on that listing**. A watch SHALL be private to the collector who made it:
no other collector's record changes, and no count of watchers appears on any
public surface.

Unwatching SHALL be reversible immediately after the act, without the
collector finding the listing again.

A watch attempt carrying no session SHALL record no watch. Grade10 SHALL NOT
hold a watch for an anonymous visitor.

When the collector watches from a listing's own page, Grade10 SHALL announce
that email alerts are on for that listing and SHALL offer a way to open My
Auctions from that announcement. When they unwatch from a listing's own page,
Grade10 SHALL announce the removal (email alerts off for that listing) and
SHALL offer Undo.

#### Scenario: grade10-site-auction-account-record-SC-01 - A collector watches from a listing's page
**Serves:** grade10-site-auction-account-record-US-05 - Watch from the lot with alerts toast

- **GIVEN** a signed-in collector reading a published listing's own page who
  has not bid on it
- **WHEN** they watch it
- **THEN** that listing is on My Auctions
- **AND** the listing's page shows it as watched
- **AND** a toast says email alerts are on for this lot with **View My
  Auctions**, which opens My Auctions

#### Scenario: grade10-site-auction-account-record-SC-02 - A collector watches from the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a signed-in collector reading the auction catalogue
- **WHEN** they watch a listing without opening it
- **THEN** that listing is on My Auctions
- **AND** they are still on the catalogue

#### Scenario: grade10-site-auction-account-record-SC-03 - Unwatching can be undone
**Serves:** grade10-site-auction-account-record-US-05 - Watch from the lot with alerts toast

- **GIVEN** a collector who has just unwatched a listing from its page and
  has not bid on it
- **WHEN** they undo that act
- **THEN** the listing is on My Auctions again
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

Grade10 SHALL keep a collector's bookmark on My Auctions when the listing
closes while it remains published, and SHALL show that listing with close
timing under the title and `--` in Your Standing when they have not bid —
rather than removing the row solely because bidding ended.

Grade10 SHALL remove the listing from My Auctions when it unpublishes or
removes that listing (including an unsold listing taken down). Scenario
`grade10-site-auction-account-record-SC-07` records that removal (its title
is historical).

Grade10 SHALL enforce a maximum number of watches per collector. An attempt to
watch beyond that maximum SHALL be refused, SHALL record no watch, and SHALL
tell the collector the maximum has been reached. The maximum's value is a
design decision and is not fixed by this requirement. A bid that enrolls the
list SHALL count toward the same maximum.

#### Scenario: grade10-site-auction-account-record-SC-06 - The watch maximum refuses a further watch
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector holding the maximum number of watches
- **WHEN** they watch another listing
- **THEN** Grade10 refuses it and records no watch
- **AND** the collector is told the maximum has been reached

#### Scenario: grade10-site-auction-account-record-SC-07 - An unpublished listing stays on the page
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector with a listing on My Auctions that Grade10 then
  unpublishes or removes
- **WHEN** they open My Auctions
- **THEN** that listing is not listed

#### Scenario: grade10-site-auction-account-record-SC-40 - A closed published listing stays on My Auctions
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector watching a listing that then closes while Grade10
  still publishes it
- **WHEN** they open My Auctions
- **THEN** that listing is still listed
- **AND** Your Standing is `--` when they have not bid

### Requirement: Watching states

A listing on My Auctions that the collector has not bid on SHALL NOT carry a
bidder standing. Your Standing for that row SHALL be `--`. Close and open
timing SHALL appear with the listing identity, not as Scheduled, Live, Ending
soon, or Active values in Your Standing.

#### Scenario: grade10-site-auction-account-record-SC-08 - A scheduled listing says when it opens
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a watched listing that is published and whose start has not arrived
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries when bidding opens with the listing
  identity
- **AND** Your Standing is `--`

#### Scenario: grade10-site-auction-account-record-SC-09 - Ending soon begins at 60 minutes
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a watched listing whose recorded close is 60 minutes or less away
  and has not passed
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries the close with the listing identity
- **AND** Your Standing is `--` when they have not bid

#### Scenario: grade10-site-auction-account-record-SC-10 - Every way of ending reads as Ended
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** three watched listings the collector has not bid on — one sold,
  one that closed with no winner, and one called off — each still published
- **WHEN** the collector opens My Auctions
- **THEN** all three remain listed
- **AND** each carries `--` in Your Standing

### Requirement: The Watching page orders by close and marks what was bid on

My Auctions SHALL show one table of every listing the collector bookmarks —
by watching or by bidding. A listing SHALL appear at most once. The former
Watching and Bidding sections and the bid-on mark between them SHALL NOT
appear.

Lots on which the collector has placed at least one bid SHALL appear before
lots they only watch. Within each band, listings SHALL order by the soonest
recorded close first, with listings whose bidding is over after those still
open.

Unwatching a listing SHALL be offered only when the collector has no bid on
that listing. Unwatching SHALL NOT change any bid. A listing with a bid SHALL
remain on My Auctions until Grade10 unpublishes or removes it, or until the
collector no longer has a bid record that enrolls it — and SHALL NOT offer
Unwatch while a bid stands.

#### Scenario: grade10-site-auction-account-record-SC-11 - The next close is first
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** watched-only listings closing in two hours, in ten minutes, and
  one that closed yesterday
- **WHEN** the collector opens My Auctions
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

#### Scenario: grade10-site-auction-account-record-SC-12 - A watched listing they bid on is marked
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector with one listing they only watch and one listing they
  have bid on
- **WHEN** they open My Auctions
- **THEN** the bid listing appears before the watch-only listing
- **AND** each listing appears once

#### Scenario: grade10-site-auction-account-record-SC-13 - Unwatching leaves the bid alone
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers no Unwatch
- **AND** their standing is unchanged

### Requirement: A bidder's standing while a listing is open

A My Auctions row for a listing the collector has bid on SHALL be an
account-facing summary. The detailed index, private action log, and listing
chronology SHALL follow the `grade10-site/auction/bidding-history` contract;
this capability SHALL NOT create a second bidding history or event log.

A listing on My Auctions whose bidding window is open and on which the
collector has bid SHALL carry exactly one of these values in Your Standing.

| State | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands. Carries the minimum next valid bid |
| Bid submitted | The collector placed a bid Grade10 has not yet accepted |
| Bid not accepted | Grade10 refused the collector's last bid. Carries which of: below the minimum next bid, the window had closed, or card authorization failed |

Your Standing SHALL NOT use Ending soon, Scheduled, Live, or Active. Close
urgency SHALL appear with the listing identity.

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Leading

#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: grade10-site-auction-account-record-SC-16 - A refused bid says why it was refused
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector whose last bid on an open listing was refused for being
  below the minimum next bid
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Bid not accepted
- **AND** the row says the bid was below the minimum next bid

#### Scenario: grade10-site-auction-account-record-SC-17 - A bid awaiting acceptance is not a standing
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has placed a bid Grade10 has not yet accepted
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Bid submitted
- **AND** the row does not claim they are Leading

### Requirement: The Bidding page groups by what is still owed

After close, a listing the collector bid on SHALL carry exactly one of **Won**
or **Didn't win** in Your Standing on My Auctions. My Auctions SHALL NOT
present separate Active, Won, and Didn't win section groups. The durable
Bidding History index remains the source for listing-level history and its
Active/Completed filtering.

#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Won

#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Didn't win

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the auction order's derived status, projected
from the invoice status, fulfilment status, address confirmation, and
delivery confirmation defined by
`grade10-site/auction/order-status`. The account record SHALL show the same
status vocabulary as the auction order and SHALL NOT invent a second payment
or shipment state.

| Collector state | Reached from |
| --- | --- |
| Awaiting Address | No invoice has been sent, and the winner has confirmed no delivery address |
| Preparing Invoice | No invoice has been sent, and the winner has confirmed a delivery address |
| Pending Payment | Invoice status is `pending` or `expired` |
| Processing | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

This surface SHALL remain read-only. It SHALL offer no control that records
payment, requests a wire, records shipment, changes an address, or changes an
auction order's status.

Every Won listing SHALL offer a clear **View order** (or equivalent) entry that
opens that lot's Winner Order, including when the derived status is Cancelled
or Refunded. Listings that are not Won SHALL NOT offer that entry.

A Won listing SHALL NOT carry secondary helper detail lines under its standing
(address prompts, invoice-coming copy, order totals, or how to reach Grade10).
How to reach Grade10 when the invoice is `expired` SHALL appear on Winner Order
only.

Didn’t win hold being-released and released copy remains governed by the durable
hold requirements folded with `redesign-my-auctions-table`; this change does not
remove them.

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
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** a won listing whose invoice status is `expired`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Pending Payment
- **AND** the row offers View order into Winner Order
- **AND** the row does not itself carry how to reach Grade10

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
**Serves:** After a close - a cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded
**Serves:** After a close - a refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded

#### Scenario: grade10-site-auction-account-record-SC-47 - A won lot with no address reads Awaiting Address
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** a won listing whose auction order has no sent invoice and no confirmed delivery address
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Awaiting Address

#### Scenario: grade10-site-auction-account-record-SC-48 - A confirmed address with no invoice reads Preparing Invoice
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** a won listing whose winner has confirmed a delivery address and whose invoice has not been sent
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Invoice

#### Scenario: grade10-site-auction-account-record-SC-56 - Every Won standing offers View order
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** won listings in Awaiting Address, Pending Payment, Shipped, and Refunded
- **WHEN** the winner opens My Auctions
- **THEN** each of those rows offers View order into that lot's Winner Order

#### Scenario: grade10-site-auction-account-record-SC-57 - Didn’t win offers no View order
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** a listing whose standing is Didn’t win
- **WHEN** the winner opens My Auctions
- **THEN** that row offers no View order entry to Winner Order

#### Scenario: grade10-site-auction-account-record-SC-58 - A Won row carries no secondary helper lines
**Serves:** grade10-site-auction-account-record-US-08 - Winner opens settlement from My Auctions

- **GIVEN** a won listing in Awaiting Address and a won listing whose invoice is `expired`
- **WHEN** the winner opens My Auctions
- **THEN** neither row shows secondary helper detail under its standing
- **AND** both rows still show their standing and View order

### Requirement: A losing bidder is told what happened to their card hold

A listing whose Your Standing is Didn't win on which the collector held a card
authorization SHALL say whether that authorization is still being released or
is released. When no bid-time authorization exists, Grade10 SHALL show no hold
release status. Grade10 SHALL NOT describe an authorization as released while
its release is still in flight.

A listing the collector bid on that was called off SHALL appear with Didn't
win standing carrying the same statement about their authorization, while the
listing remains published.

#### Scenario: grade10-site-auction-account-record-SC-25 - A release in flight says so
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder sees the card hold released

- **GIVEN** a closed listing the collector did not win, whose authorization
  Grade10 has marked for release and whose release is not complete
- **WHEN** they open My Auctions
- **THEN** the row says the hold is being released
- **AND** it does not say the hold is released

#### Scenario: grade10-site-auction-account-record-SC-26 - A completed release says so
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder sees the card hold released

- **GIVEN** the same listing once its release is complete
- **WHEN** the collector opens My Auctions
- **THEN** the row says the hold is released

#### Scenario: grade10-site-auction-account-record-SC-27 - A called-off listing tells the bidder about the hold
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder sees the card hold released

- **GIVEN** a listing the collector bid on that Grade10 called off and still
  publishes
- **WHEN** they open My Auctions
- **THEN** that listing's Your Standing is Didn't win
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

My Auctions SHALL open as one page. It SHALL NOT land on separate Bidding or
Watching sections.

An empty My Auctions (no rows) SHALL offer a way into the catalogue, and SHALL
NOT be presented as a failure.

A read Grade10 could not complete SHALL be shown as a failure that can be
retried, and SHALL NOT be shown as an empty record.

A value that follows the clock — a close, a current bid, a minimum next bid —
that Grade10 could not refresh SHALL be shown as not current rather than
presented as current.

The page title SHALL carry a badge whose count equals the number of rows on
the table.

#### Scenario: grade10-site-auction-account-record-SC-30 - A bidder lands on Bidding
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has bid on at least one listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table that includes that listing
- **AND** they are not sent to a separate Bidding section

#### Scenario: grade10-site-auction-account-record-SC-31 - A collector who has never bid lands on Watching
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has never placed a bid and watches at least one
  listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table
- **AND** each row's Your Standing is `--`

#### Scenario: grade10-site-auction-account-record-SC-32 - An empty Watching page offers the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector with no listings on My Auctions
- **WHEN** they open it
- **THEN** the page offers a way into the auction catalogue
- **AND** it does not report an error

#### Scenario: grade10-site-auction-account-record-SC-33 - A failed read is not an empty record
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector whose record Grade10 cannot read
- **WHEN** they open it
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty record

#### Scenario: grade10-site-auction-account-record-SC-34 - A value that could not be refreshed says so
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a record whose rows are shown but whose current bid could not be
  refreshed
- **WHEN** the collector reads it
- **THEN** that value is shown as not current

#### Scenario: grade10-site-auction-account-record-SC-41 - The title badge matches the row count
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector with three listings on My Auctions
- **WHEN** they open it
- **THEN** the badge beside the page title shows 3

### Requirement: A bid bookmarks the lot and announces alerts once

A bid puts the lot on My Auctions with email alerts on, and the collector is
told once.

**Bid bookmarks** - Placing a bid on a listing SHALL bookmark that listing on
My Auctions without a separate Watch.

**Alerts on** - Grade10 SHALL turn email alerts on for that listing by default
(same enrolment as watching).

**Announced once** - When that bid first bookmarks the listing for the
collector, Grade10 SHALL announce that email alerts are on for the lot **at
most once per listing per collector**. That fact SHALL be stored on the
account. A later bid, page view, or device SHALL NOT show the same announcement
again for that pair.

#### Scenario: grade10-site-auction-account-record-SC-45 - A bid bookmarks without a separate Watch
**Serves:** grade10-site-auction-account-record-US-06 - A bid bookmarks and toasts alerts once

- **GIVEN** a signed-in collector who has not watched listing L
- **WHEN** they place a bid on L that Grade10 accepts as bookmarking L
- **THEN** L is on My Auctions
- **AND** they did not need a separate Watch for L to appear

#### Scenario: grade10-site-auction-account-record-SC-46 - The bid-alerts toast is once per lot
**Serves:** grade10-site-auction-account-record-US-06 - A bid bookmarks and toasts alerts once

- **GIVEN** a signed-in collector who has never been shown the bid-alerts
  toast for listing L
- **WHEN** their bid bookmarks L
- **THEN** a toast says email alerts are on for this lot
- **AND** a second successful bid on L does not show that toast again

### Requirement: A bid bookmarks the listing on My Auctions

When a signed-in collector places a bid on a listing, Grade10 SHALL enroll
that listing on My Auctions as a bookmark if it is not already there. The
collector SHALL NOT need a separate Watch for that listing to appear.

#### Scenario: grade10-site-auction-account-record-SC-42 - A first bid enrolls My Auctions
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a signed-in collector who does not watch a listing
- **WHEN** they place a bid on it
- **THEN** that listing is on My Auctions
- **AND** Your Standing reflects their bid standing

### Requirement: Watch-only rows offer Unwatch; bid rows offer Email alerts only

Email alerts is on every row; Unwatch is only on a row with no bid.

**Email alerts** - Every My Auctions row SHALL offer Email alerts when the
application supplies that control.

**Unwatch** - A row for a listing the collector has not bid on SHALL offer
Unwatch. A row for a listing they have bid on SHALL NOT offer Unwatch.

#### Scenario: grade10-site-auction-account-record-SC-43 - Watch-only can be unwatched
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector watching a listing they have not bid on
- **WHEN** they unwatch it from My Auctions
- **THEN** the listing leaves My Auctions
- **AND** Email alerts for that listing turn off with the watch

#### Scenario: grade10-site-auction-account-record-SC-44 - A bid row keeps Email alerts without Unwatch
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector with a bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers Email alerts
- **AND** it does not offer Unwatch
