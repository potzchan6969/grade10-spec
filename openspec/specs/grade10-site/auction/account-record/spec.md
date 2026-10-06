# grade10-site/auction/account-record Specification

## Purpose
A signed-in collector's own record of the auction listings they bookmark —
by watching or by bidding — on one My Auctions table: how a watch is made
and removed, how a bid enrolls the list, what Status shows while a listing is
open and after it closes, and what a winner and a losing bidder
are told once a listing closes. The detailed Bidding index and listing
history remain the contract of `grade10-site/auction/bidding-history`.
Owner-only — nobody but the collector sees their record.

## Feature set

- **After a close**
  - Overdue Status: a won lot whose setup or payment window has passed reads
    Setup Overdue or Payment Overdue
  - Payment Verifying: a won lot whose payment proof waits for an operator reads Payment Verifying
  - Winner's payment and shipment: lets a winner follow their own listing to
    delivery without contacting Grade10.
  - Losing bidder's card hold: none is taken, so the row says the card was not
    charged and a lost listing is not read as a charge.
  - Result from the record: Your Standing reads Won or Didn't win from the
    recorded result, never from the page's own clock.
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
    next valid bid must clear when they do not; a refused attempt adds no row
    and moves no Status, so a leader stays Leading and an outbid collector
    stays Outbid.
  - Three groups: separates the listings that still need the collector from
    the ones that are finished.
  - Auction's price: a bidding row shows the auction's current price, or its
    final price once it closes, never the collector's own bid.
- **Reaching the record**
  - Ownership: resolves the record from the session and nothing else.
  - Landing, empty, and failed reads: makes an unused record and a broken one
    tell the collector different things.
- **Tabs by bidding window**
  - Active, Upcoming, Ended: every row sits in the tab its bidding window names.
  - Landing: My Auctions opens on Active; the title count stays the total.
- **Row actions**
  - Ended alerts: Email alerts show disabled on a closed lot.
  - Won entry: a Won row opens its auction order.

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

<!-- trace:scenario id=g10.auction-account-record.SC-vwk rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-01 - A collector watches from a listing's page
**Serves:** grade10-site-auction-account-record-US-05 - Watch from the auction with alerts toast

- **GIVEN** a signed-in collector reading a published listing's own page who
  has not bid on it
- **WHEN** they watch it
- **THEN** that listing is on My Auctions
- **AND** the listing's page shows it as watched
- **AND** a toast says email alerts are on for this auction with **View My
  Auctions**, which opens My Auctions

<!-- trace:scenario id=g10.auction-account-record.SC-e7i rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-02 - A collector watches from the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a signed-in collector reading the auction catalogue
- **WHEN** they watch a listing without opening it
- **THEN** that listing is on My Auctions
- **AND** they are still on the catalogue

<!-- trace:scenario id=g10.auction-account-record.SC-ewb rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-03 - Unwatching can be undone
**Serves:** grade10-site-auction-account-record-US-05 - Watch from the auction with alerts toast

- **GIVEN** a collector who has just unwatched a listing from its page and
  has not bid on it
- **WHEN** they undo that act
- **THEN** the listing is on My Auctions again
- **AND** they did not have to find the listing a second time

<!-- trace:scenario id=g10.auction-account-record.SC-ub6 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-04 - A watch without a session is not recorded
**Serves:** grade10-site-auction-account-record-US-01 - Mark a listing now and find it again later

- **GIVEN** a visitor carrying no session
- **WHEN** they attempt to watch a listing
- **THEN** Grade10 records no watch
- **AND** no watch appears for any collector

<!-- trace:scenario id=g10.auction-account-record.SC-w7y rev=1 -->
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
timing under the title and `--` in Status when they have not bid —
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

<!-- trace:scenario id=g10.auction-account-record.SC-n3a rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-06 - The watch maximum refuses a further watch
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector holding the maximum number of watches
- **WHEN** they watch another listing
- **THEN** Grade10 refuses it and records no watch
- **AND** the collector is told the maximum has been reached

<!-- trace:scenario id=g10.auction-account-record.SC-cba rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-07 - An unpublished listing stays on the page
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector with a listing on My Auctions that Grade10 then
  unpublishes or removes
- **WHEN** they open My Auctions
- **THEN** that listing is not listed

<!-- trace:scenario id=g10.auction-account-record.SC-bge rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-40 - A closed published listing stays on My Auctions
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector watching a listing that then closes while Grade10
  still publishes it
- **WHEN** they open My Auctions
- **THEN** that listing is still listed
- **AND** Status is `--` when they have not bid

### Requirement: Watching states

A listing on My Auctions that the collector has not bid on SHALL NOT carry a
bidder standing. Status for that row SHALL be `--`. Close and open
timing SHALL appear with the listing identity, not as Scheduled, Live, Ending
soon, or Active values in Status.

<!-- trace:scenario id=g10.auction-account-record.SC-h9h rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-08 - A scheduled listing says when it opens
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a watched listing that is published and whose start has not arrived
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries when bidding opens with the listing
  identity
- **AND** Status is `--`

<!-- trace:scenario id=g10.auction-account-record.SC-myi rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-09 - Ending soon begins at 60 minutes
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a watched listing whose recorded close is 60 minutes or less away
  and has not passed
- **WHEN** the collector opens My Auctions
- **THEN** that listing's row carries the close with the listing identity
- **AND** Status is `--` when they have not bid

<!-- trace:scenario id=g10.auction-account-record.SC-w21 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-10 - Every way of ending reads as Ended
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** three watched listings the collector has not bid on — one sold,
  one that closed with no winner, and one called off — each still published
- **WHEN** the collector opens My Auctions
- **THEN** all three remain listed
- **AND** each carries `--` in Status

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

<!-- trace:scenario id=g10.auction-account-record.SC-v08 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-11 - The next close is first
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** watched-only listings closing in two hours, in ten minutes, and
  one that closed yesterday
- **WHEN** the collector opens My Auctions
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

<!-- trace:scenario id=g10.auction-account-record.SC-oug rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-12 - A watched listing they bid on is marked
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector with one listing they only watch and one listing they
  have bid on
- **WHEN** they open My Auctions
- **THEN** the bid listing appears before the watch-only listing
- **AND** each listing appears once

<!-- trace:scenario id=g10.auction-account-record.SC-93f rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-13 - Unwatching leaves the bid alone
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers no Unwatch
- **AND** their standing is unchanged

### Requirement: The Bidding page groups by what is still owed

After close, a listing the collector bid on SHALL carry exactly one of **Won**
or **Didn't win** in Status on My Auctions, read from the recorded result and
never from the page's own clock. Its price SHALL be the listing's final price,
the same on every bidder's row. My Auctions SHALL NOT
present separate Active, Won, and Didn't win section groups. The durable
Bidding History index remains the source for listing-level history and its
Active/Completed filtering.

<!-- trace:scenario id=g10.auction-account-record.SC-44t rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-18 - A won listing sits under Won
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Won

<!-- trace:scenario id=g10.auction-account-record.SC-5y1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-19 - A listing lost at close sits under Didn't win
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win

<!-- trace:scenario id=g10.auction-account-record.SC-b5w rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-66 - Every bidder's row shows the final price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing that closed with a winning bid of 150000 HKD minor units,
  on which the collector's own last bid was 120000 HKD minor units
- **WHEN** they open My Auctions
- **THEN** that row reads Didn't win with a price of 150000 HKD minor units
- **AND** the winner's row on their own My Auctions shows 150000 HKD minor
  units

<!-- trace:scenario id=g10.auction-account-record.SC-fkr rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-67 - A result appears only once the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a collector leading a listing whose effective close has passed
- **WHEN** the close is recorded with them as the winner
- **THEN** their row reads Won from then on, and did not read Won or Didn't
  win before it

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the auction order's derived status, projected
from the invoice status, fulfilment status, address confirmation, and
delivery confirmation defined by
`grade10-site/auction/order-status`. The account record SHALL show the same
status vocabulary as the auction order and SHALL NOT invent a second payment
or shipment state.

| Collector state | Reached from |
| --- | --- |
| Awaiting Setup | The setup deadline has not passed, no invoice has been sent, and the winner has confirmed no delivery address |
| Preparing Invoice | No invoice has been sent, and the winner has confirmed a delivery address |
| Payment Verifying | Invoice status is `payment_verifying` |
| Pending Payment | Invoice status is `pending` and the payment deadline has not passed |
| Setup Overdue | The setup deadline has passed without a confirmed delivery address |
| Payment Overdue | Invoice status is `expired` after the payment deadline |
| Processing | Invoice status is `paid`, and fulfilment status is `unfulfilled` |
| Shipped | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is not confirmed |
| Delivered | Invoice status is `paid`, fulfilment status is `fulfilled`, and delivery is confirmed |
| Cancelled | Invoice status is `cancelled` |
| Refunded | Invoice status is `refunded` |

This surface SHALL remain read-only. It SHALL offer no control that records
payment, uploads payment proof, requests a wire, records shipment, changes an
address or payment method, or changes an auction order's status.

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

<!-- trace:scenario id=g10.auction-account-record.SC-1lv rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-20 - Card capture reads as Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `paid` and whose fulfilment status is `unfulfilled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

<!-- trace:scenario id=g10.auction-account-record.SC-pu6 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-21 - Manual collection reads as the same Paid
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose collection an operator recorded outside Stripe is `paid`, and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Processing

<!-- trace:scenario id=g10.auction-account-record.SC-m3u rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-22 - An expired payment reads Payment Overdue
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `expired`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment Overdue
- **AND** the row offers View order into Winner Order
- **AND** the row does not itself carry how to reach Grade10

<!-- trace:scenario id=g10.auction-account-record.SC-byk rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-23 - Shipment states reach the winner
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose paid order is fulfilled without delivery confirmation and one whose paid order has delivery confirmation
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped
- **AND** the second listing's state is Delivered

<!-- trace:scenario id=g10.auction-account-record.SC-4sy rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-24 - The winner is offered no write
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in any auction-order status
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, uploads payment proof, requests a wire, records shipment, changes an address or payment method, or changes the order status

<!-- trace:scenario id=g10.auction-account-record.SC-xi1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-35 - A cancelled order remains Cancelled
**Serves:** After a close - a cancelled order remains Cancelled

- **GIVEN** a won listing whose invoice status is `cancelled`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Cancelled

<!-- trace:scenario id=g10.auction-account-record.SC-91a rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-36 - A refunded order remains Refunded
**Serves:** After a close - a refunded order remains Refunded

- **GIVEN** a won listing whose invoice status is `refunded`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Refunded

<!-- trace:scenario id=g10.auction-account-record.SC-uh6 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-47 - A won lot with no address reads Awaiting Setup
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose auction order has no sent invoice, no confirmed delivery address, and whose setup deadline has not passed
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Awaiting Setup

<!-- trace:scenario id=g10.auction-account-record.SC-ahn rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-48 - A confirmed address with no invoice reads Preparing Invoice
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose winner has confirmed a delivery address and whose invoice has not been sent
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Preparing Invoice

<!-- trace:scenario id=g10.auction-account-record.SC-pnn rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-56 - Every Won standing offers View order
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** won listings in Awaiting Setup, Pending Payment, Payment Verifying, Shipped, and Refunded
- **WHEN** the winner opens My Auctions
- **THEN** each of those rows offers View order into that lot's Winner Order

<!-- trace:scenario id=g10.auction-account-record.SC-fn7 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-57 - Didn’t win offers no View order
**Serves:** After a close - a lost listing does not open a Winner Order

- **GIVEN** a listing whose standing is Didn’t win
- **WHEN** the winner opens My Auctions
- **THEN** that row offers no View order entry to Winner Order

<!-- trace:scenario id=g10.auction-account-record.SC-skc rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-58 - A Won row carries no secondary helper lines
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing in Awaiting Setup and a won listing whose invoice is `expired`
- **WHEN** the winner opens My Auctions
- **THEN** neither row shows secondary helper detail under its standing
- **AND** both rows still show their standing and View order

<!-- trace:scenario id=g10.auction-account-record.SC-haw rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-60 - Proof waiting for an operator reads Payment Verifying
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** a won listing whose invoice status is `payment_verifying`
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment Verifying
- **AND** the row offers View order and no upload control

<!-- trace:scenario id=g10.auction-account-record.SC-fgb rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-61 - The row follows the proof check
**Serves:** grade10-site-auction-account-record-US-03 - Follow a listing I won through to delivery

- **GIVEN** one won listing whose proof an operator returned, and one whose proof an operator confirmed, neither shipped
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Pending Payment
- **AND** the second listing's state is Processing

### Requirement: The record belongs to its owner alone

Grade10 SHALL resolve an auction record from the caller's session and no other
input. A request carrying no session SHALL be refused and SHALL return no
record. No input a collector supplies SHALL select another collector's record.

<!-- trace:scenario id=g10.auction-account-record.SC-qmd rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-28 - A signed-out request is refused
**Serves:** grade10-site-auction-account-record-US-02 - See where I stand across every listing I bid on

- **GIVEN** a request carrying no session
- **WHEN** it reads an auction record
- **THEN** Grade10 refuses it as unauthenticated
- **AND** returns no watch and no bid

<!-- trace:scenario id=g10.auction-account-record.SC-ogi rev=1 -->
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

<!-- trace:scenario id=g10.auction-account-record.SC-cu5 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-30 - A bidder lands on Bidding
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has bid on at least one listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table that includes that listing
- **AND** they are not sent to a separate Bidding section

<!-- trace:scenario id=g10.auction-account-record.SC-m7p rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-31 - A collector who has never bid lands on Watching
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector who has never placed a bid and watches at least one
  listing
- **WHEN** they open their auction record
- **THEN** they see one My Auctions table
- **AND** each row's Status is `--`

<!-- trace:scenario id=g10.auction-account-record.SC-20r rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-32 - An empty Watching page offers the catalogue
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector with no listings on My Auctions
- **WHEN** they open it
- **THEN** the page offers a way into the auction catalogue
- **AND** it does not report an error

<!-- trace:scenario id=g10.auction-account-record.SC-c2n rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-33 - A failed read is not an empty record
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector whose record Grade10 cannot read
- **WHEN** they open it
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty record

<!-- trace:scenario id=g10.auction-account-record.SC-1o1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-34 - A value that could not be refreshed says so
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a record whose rows are shown but whose current bid could not be
  refreshed
- **WHEN** the collector reads it
- **THEN** that value is shown as not current

<!-- trace:scenario id=g10.auction-account-record.SC-db4 rev=1 -->
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
collector, Grade10 SHALL announce that email alerts are on for the auction **at
most once per listing per collector**. That fact SHALL be stored on the
account. A later bid, page view, or device SHALL NOT show the same announcement
again for that pair.

<!-- trace:scenario id=g10.auction-account-record.SC-baj rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-45 - A bid bookmarks without a separate Watch
**Serves:** grade10-site-auction-account-record-US-06 - A bid bookmarks and toasts alerts once

- **GIVEN** a signed-in collector who has not watched listing L
- **WHEN** they place a bid on L that Grade10 accepts as bookmarking L
- **THEN** L is on My Auctions
- **AND** they did not need a separate Watch for L to appear

<!-- trace:scenario id=g10.auction-account-record.SC-6mu rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-46 - The bid-alerts toast is once per lot
**Serves:** grade10-site-auction-account-record-US-06 - A bid bookmarks and toasts alerts once

- **GIVEN** a signed-in collector who has never been shown the bid-alerts
  toast for listing L
- **WHEN** their bid bookmarks L
- **THEN** a toast says email alerts are on for this auction
- **AND** a second successful bid on L does not show that toast again

### Requirement: A bid bookmarks the listing on My Auctions

When a signed-in collector places a bid Grade10 accepts on a listing, Grade10
SHALL enroll that listing on My Auctions as a bookmark if it is not already
there. The collector SHALL NOT need a separate Watch for that listing to
appear.

<!-- trace:scenario id=g10.auction-account-record.SC-7on rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-42 - A first bid enrolls My Auctions
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a signed-in collector who does not watch a listing
- **WHEN** they place a bid on it that Grade10 accepts
- **THEN** that listing is on My Auctions
- **AND** Status reflects their bid standing

### Requirement: Watch-only rows offer Unwatch; bid rows offer Email alerts only

Email alerts is on every row; Unwatch is only on a row with no bid.

**Email alerts** - Every My Auctions row SHALL offer Email alerts when the
application supplies that control.

**Unwatch** - A row for a listing the collector has not bid on SHALL offer
Unwatch. A row for a listing they have bid on SHALL NOT offer Unwatch.

<!-- trace:scenario id=g10.auction-account-record.SC-5we rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-43 - Watch-only can be unwatched
**Serves:** grade10-site-auction-account-record-US-01 - Collector bookmarks a listing and finds it on My Auctions

- **GIVEN** a collector watching a listing they have not bid on
- **WHEN** they unwatch it from My Auctions
- **THEN** the listing leaves My Auctions
- **AND** Email alerts for that listing turn off with the watch

<!-- trace:scenario id=g10.auction-account-record.SC-wqw rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-44 - A bid row keeps Email alerts without Unwatch
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** a collector with a bid on a listing on My Auctions
- **WHEN** they read that row
- **THEN** the row offers Email alerts
- **AND** it does not offer Unwatch

### Requirement: My Auctions names overdue orders in the Status column

The My Auctions list SHALL call the mixed standing and order-state column
Status. A missed setup deadline SHALL render Setup Overdue and an expired
invoice SHALL render Payment Overdue. Both rows SHALL retain View order and
the same lot and winning-bid facts as the Won row.

<!-- trace:scenario id=g10.auction-account-record.SC-zid rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-63 - My Auctions names both overdue states
**Serves:** grade10-site-auction-account-record-US-09 - Winner finds an overdue order in My Auctions

- **GIVEN** one order in Setup Overdue and one in Payment Overdue
- **WHEN** the winner reads My Auctions
- **THEN** the column header is Status
- **AND** the two rows show their matching overdue labels and View order

### Requirement: My Auctions groups its rows into Active, Upcoming and Ended tabs

My Auctions SHALL place every row in exactly one of three tabs, shown in this
order, and SHALL open on Active.

| Tab | Holds listings whose |
| --- | --- |
| Active | Bidding window is open |
| Upcoming | Bidding window has not opened |
| Ended | Bidding is over, however it ended |

A listing SHALL move to the tab its window names when the window changes. The
row order, row content and row actions inside each tab SHALL be those the
table already follows. The page title badge SHALL count the rows across all
three tabs.

A tab with no rows while another tab has rows SHALL say that tab has no lots,
and SHALL NOT be presented as a failure.

<!-- trace:scenario id=g10.auction-account-record.SC-11c rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-49 - Each listing sits in the tab its window names
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a collector watching one listing whose bidding has not opened, one
  whose bidding is open, and one that has closed
- **WHEN** they open each tab of My Auctions
- **THEN** Upcoming lists only the first, Active only the second, and Ended
  only the third

<!-- trace:scenario id=g10.auction-account-record.SC-slt rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-50 - A listing moves tab when its window opens
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a watched listing in the Upcoming tab
- **WHEN** its bidding window opens and the collector reopens My Auctions
- **THEN** the listing is in the Active tab
- **AND** it is not in the Upcoming tab

<!-- trace:scenario id=g10.auction-account-record.SC-evx rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-51 - An empty tab is not a failure
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a collector with Active listings and no Upcoming listings
- **WHEN** they open the Upcoming tab
- **THEN** the tab says it has no lots
- **AND** it does not report an error

<!-- trace:scenario id=g10.auction-account-record.SC-vlf rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-53 - My Auctions opens on Active
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a collector with listings in all three tabs
- **WHEN** they open My Auctions
- **THEN** the Active tab is shown

<!-- trace:scenario id=g10.auction-account-record.SC-doc rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-54 - The title count covers every tab
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a collector with one Upcoming, one Active and one Ended listing
- **WHEN** they open My Auctions
- **THEN** the badge beside the page title shows 3

### Requirement: Ended rows lock Email alerts

A row in the Ended tab SHALL show Email alerts disabled, SHALL NOT let the
collector change them, and SHALL leave the listing's alert setting unchanged.

<!-- trace:scenario id=g10.auction-account-record.SC-r26 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-52 - Ended rows lock Email alerts
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a listing in the Ended tab of My Auctions
- **WHEN** the collector tries to change its Email alerts
- **THEN** the control is disabled
- **AND** the listing's alert setting is unchanged

### Requirement: A Won row opens its auction order

A Won row SHALL offer the application-supplied entry point to that lot's
auction order. Selecting it SHALL open the matching order, per
`grade10-site/auction/auction-orders`. The row SHALL remain read-only: it
SHALL NOT record payment, confirm or change an address, or change order status.

<!-- trace:scenario id=g10.auction-account-record.SC-we1 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-55 - A Won row opens its order
**Serves:** grade10-site-auction-account-record-US-07 - Collector reads My Auctions by bidding window

- **GIVEN** a closed listing whose winner is the collector and whose auction
  order is identified by the row
- **WHEN** the collector selects the row's order entry point
- **THEN** the matching auction order opens
- **AND** no payment, address, or order-status write occurs on My Auctions

### Requirement: An open listing reads Leading or Outbid

A My Auctions row for a listing the collector has bid on SHALL be an
account-facing summary. The detailed index, private action log, and listing
chronology SHALL follow the `grade10-site/auction/bidding-history` contract;
this capability SHALL NOT create a second bidding history or event log.

A listing on My Auctions whose bidding window is open and on which the
collector has bid SHALL carry exactly one of these values in Status.

| State | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands. Carries the minimum next valid bid |

A refused attempt SHALL NOT be a bid. It SHALL add no row to My Auctions and
SHALL change no row's Status or price: a leader whose raise is refused stays
Leading, and an outbid collector whose raise is refused stays Outbid. The
refusal SHALL NOT appear on My Auctions; the bid form shows it.

Status SHALL NOT use Ending soon, Scheduled, Live, or Active. Close
urgency SHALL appear with the listing identity.

The row's price SHALL be the auction's current bid on that listing, never the
collector's own bid. A listing past its effective close whose close is not yet
recorded SHALL keep its open Status, SHALL stay in the Active tab, and SHALL
carry no minimum next valid bid.

Every amount SHALL be an integer count of minor units with an ISO 4217 currency
code.

<!-- trace:scenario id=g10.auction-account-record.SC-2h8 rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-14 - The highest bidder is Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Leading

<!-- trace:scenario id=g10.auction-account-record.SC-ana rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-15 - Outbid carries the minimum next bid
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

<!-- trace:scenario id=g10.auction-account-record.SC-n1y rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-69 - A leader whose raise is refused stays Leading
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** Grade10 refuses their raise
- **AND** they open My Auctions
- **THEN** that listing's Status is Leading
- **AND** the refused raise has not moved the row's price

<!-- trace:scenario id=g10.auction-account-record.SC-8te rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-70 - A refused first bid adds no row
**Serves:** grade10-site-auction-account-record-US-02 - Collector sees standing across every lot they bid on

- **GIVEN** an open listing the collector has neither watched nor bid on
- **WHEN** their first bid on it is refused
- **AND** they open My Auctions
- **THEN** no row for that listing appears in any tab

<!-- trace:scenario id=g10.auction-account-record.SC-dsc rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-71 - An outbid collector whose raise is refused stays Outbid
**Serves:** grade10-site-auction-account-record-US-02 - a refused raise leaves the collector reading the standing they had

- **GIVEN** an open `HKD` listing on which the collector is Outbid with a
  maximum of 25000 HKD minor units, at a current bid of 30000 HKD minor units
  and a minimum next bid of 31000 HKD minor units
- **WHEN** they raise their maximum to 30500 HKD minor units, and Grade10
  refuses it as below the minimum
- **AND** they open My Auctions
- **THEN** that listing's Status is Outbid
- **AND** the row's price is still 30000 HKD minor units

<!-- trace:scenario id=g10.auction-account-record.SC-fao rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-64 - An outbid row shows the auction's price
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** an open listing on which the collector bid 100000 HKD minor units
  and the current bid is 120000 HKD minor units
- **WHEN** they open My Auctions
- **THEN** that row's price is 120000 HKD minor units

<!-- trace:scenario id=g10.auction-account-record.SC-abi rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-65 - A lot past its close keeps its standing until the close is recorded
**Serves:** grade10-site-auction-account-record-US-10 - Bidder reads each lot's price and result on My Auctions

- **GIVEN** a listing past its effective close, whose close is not yet
  recorded, on which the collector holds the highest valid bid
- **WHEN** they open My Auctions
- **THEN** that row is in the Active tab with Status Leading and no minimum
  next valid bid
- **AND** it reads neither Won nor Didn't win

### Requirement: A losing bidder reads that their card was not charged

A listing whose Status is Didn't win SHALL say that the collector's card was
not charged. A listing the collector bid on that was called off SHALL appear
with Didn't win standing carrying the same statement, while the listing
remains published. A Won listing SHALL NOT carry it.

<!-- trace:scenario id=g10.auction-account-record.SC-n9l rev=1 -->
#### Scenario: grade10-site-auction-account-record-SC-68 - A lot lost at the close says the card was not charged
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder knows they were not charged

- **GIVEN** a closed listing the collector bid on and did not win
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win
- **AND** the row says their card was not charged

<!-- trace:scenario id=g10.auction-account-record.SC-2e8 rev=2 -->
#### Scenario: grade10-site-auction-account-record-SC-27 - A called-off listing says the card was not charged
**Serves:** grade10-site-auction-account-record-US-04 - Losing bidder knows they were not charged

- **GIVEN** a listing the collector bid on that Grade10 called off and still
  publishes
- **WHEN** they open My Auctions
- **THEN** that listing's Status is Didn't win
- **AND** the row says their card was not charged
