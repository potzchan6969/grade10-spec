## Purpose

A signed-in collector's own record of the auction listings they watch and the
listings they have bid on: how a watch is made and removed, what each page
tells them about a listing's standing, and what a winner and a losing bidder
are told once a listing closes. Owner-only — nobody but the collector sees
their record.

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
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not.
  - Three groups: separates the listings that still need the collector from the
    ones that are finished.
- **After a close**
  - Winner's payment and shipment: lets a winner follow their own listing to
    delivery without contacting Grade10.
  - Losing bidder's card hold: says what happened to their authorization, so a
    pending hold is not read as a charge.
- **Reaching the record**
  - Ownership: resolves the record from the session and nothing else.
  - Landing, empty, and failed reads: makes an unused record and a broken one
    tell the collector different things.

## User journeys

### account-auction-record-US-01: Mark a listing now and find it again later

As a collector, I want to watch listings I am interested in before bidding
opens, so that I can find them again when it does without searching the
catalogue a second time.

**Accepted by:** `account-auction-record-SC-01`,
`account-auction-record-SC-02`, `account-auction-record-SC-03`,
`account-auction-record-SC-04`, `account-auction-record-SC-05`,
`account-auction-record-SC-06`, `account-auction-record-SC-07`,
`account-auction-record-SC-08`, `account-auction-record-SC-09`,
`account-auction-record-SC-10`, `account-auction-record-SC-11`,
`account-auction-record-SC-12`, `account-auction-record-SC-13`,
`account-auction-record-SC-32`

### account-auction-record-US-02: See where I stand across every listing I bid on

As a bidder, I want one place that says which of my listings I still lead and
which I have lost, so that I can act on the ones that still need me before they
close.

**Accepted by:** `account-auction-record-SC-14`,
`account-auction-record-SC-15`, `account-auction-record-SC-16`,
`account-auction-record-SC-17`, `account-auction-record-SC-18`,
`account-auction-record-SC-19`, `account-auction-record-SC-28`,
`account-auction-record-SC-29`, `account-auction-record-SC-30`,
`account-auction-record-SC-31`, `account-auction-record-SC-33`,
`account-auction-record-SC-34`

### account-auction-record-US-03: Follow a listing I won through to delivery

As a winner, I want to see what I owe and where my card is, so that I do not
have to ask Grade10 what happens next.

**Accepted by:** `account-auction-record-SC-20`,
`account-auction-record-SC-21`, `account-auction-record-SC-22`,
`account-auction-record-SC-23`, `account-auction-record-SC-24`

### account-auction-record-US-04: Know my money is coming back when I lose

As a losing bidder, I want to see that my card hold is released, so that a
pending authorization on my statement does not read as a charge for a listing I
did not win.

**Accepted by:** `account-auction-record-SC-25`,
`account-auction-record-SC-26`, `account-auction-record-SC-27`

## ADDED Requirements

### Requirement: A collector watches a listing from where it is shown

Grade10 SHALL let a signed-in collector watch and unwatch a listing from that
listing's own page and from the catalogue that lists it. A watch SHALL be
private to the collector who made it: no other collector's record changes, and
no count of watchers appears on any public surface.

Unwatching SHALL be reversible immediately after the act, without the collector
finding the listing again.

A watch attempt carrying no session SHALL record no watch. Grade10 SHALL NOT
hold a watch for an anonymous visitor.

#### Scenario: account-auction-record-SC-01 - A collector watches from a listing's page

- **GIVEN** a signed-in collector reading a published listing's own page
- **WHEN** they watch it
- **THEN** that listing is on their Watching page
- **AND** the listing's page shows it as watched

#### Scenario: account-auction-record-SC-02 - A collector watches from the catalogue

- **GIVEN** a signed-in collector reading the auction catalogue
- **WHEN** they watch a listing without opening it
- **THEN** that listing is on their Watching page
- **AND** they are still on the catalogue

#### Scenario: account-auction-record-SC-03 - Unwatching can be undone

- **GIVEN** a collector who has just unwatched a listing
- **WHEN** they undo that act
- **THEN** the listing is on their Watching page again
- **AND** they did not have to find the listing a second time

#### Scenario: account-auction-record-SC-04 - A watch without a session is not recorded

- **GIVEN** a visitor carrying no session
- **WHEN** they attempt to watch a listing
- **THEN** Grade10 records no watch
- **AND** no watch appears for any collector

#### Scenario: account-auction-record-SC-05 - A watch is private

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

#### Scenario: account-auction-record-SC-06 - The watch maximum refuses a further watch

- **GIVEN** a collector holding the maximum number of watches
- **WHEN** they watch another listing
- **THEN** Grade10 refuses it and records no watch
- **AND** the collector is told the maximum has been reached

#### Scenario: account-auction-record-SC-07 - An unpublished listing stays on the page

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

#### Scenario: account-auction-record-SC-08 - A scheduled listing says when it opens

- **GIVEN** a watched listing that is published and whose start has not arrived
- **WHEN** the collector opens their Watching page
- **THEN** that listing's state is Scheduled
- **AND** the row carries when bidding opens

#### Scenario: account-auction-record-SC-09 - Ending soon begins at 60 minutes

- **GIVEN** a watched listing whose recorded close is 60 minutes or less away
  and has not passed
- **WHEN** the collector opens their Watching page
- **THEN** that listing's state is Ending soon

#### Scenario: account-auction-record-SC-10 - Every way of ending reads as Ended

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

#### Scenario: account-auction-record-SC-11 - The next close is first

- **GIVEN** watched listings closing in two hours, in ten minutes, and one that
  closed yesterday
- **WHEN** the collector opens their Watching page
- **THEN** the listing closing in ten minutes is before the one closing in two
  hours
- **AND** the listing that closed yesterday is after both

#### Scenario: account-auction-record-SC-12 - A watched listing they bid on is marked

- **GIVEN** a collector who watches a listing and has placed a bid on it
- **WHEN** they open their Watching page
- **THEN** that listing is marked as one they bid on
- **AND** opening the mark takes them to that listing on the Bidding page

#### Scenario: account-auction-record-SC-13 - Unwatching leaves the bid alone

- **GIVEN** a collector who watches a listing and has bid on it
- **WHEN** they unwatch it
- **THEN** the listing is gone from their Watching page
- **AND** it is still on their Bidding page with their standing unchanged

### Requirement: A bidder's standing while a listing is open

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

#### Scenario: account-auction-record-SC-14 - The highest bidder is Leading

- **GIVEN** an open listing on which the collector holds the highest valid bid
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Leading

#### Scenario: account-auction-record-SC-15 - Outbid carries the minimum next bid

- **GIVEN** an open listing on which a higher valid bid than the collector's
  stands
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Outbid
- **AND** the row carries the minimum next valid bid as an integer count of
  minor units with its ISO 4217 currency code

#### Scenario: account-auction-record-SC-16 - A refused bid says why it was refused

- **GIVEN** a collector whose last bid on an open listing was refused for being
  below the minimum next bid
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Bid not accepted
- **AND** the row says the bid was below the minimum next bid

#### Scenario: account-auction-record-SC-17 - A bid awaiting acceptance is not a standing

- **GIVEN** a collector who has placed a bid Grade10 has not yet accepted
- **WHEN** they open their Bidding page
- **THEN** that listing's state is Bid submitted
- **AND** the row does not claim they are Leading

### Requirement: The Bidding page groups by what is still owed

The Bidding page SHALL place every listing the collector has bid on into
exactly one of three groups: **Active** while its bidding window is open, **Won**
when the collector is its winner, and **Didn't win** for every other closed
listing they bid on.

#### Scenario: account-auction-record-SC-18 - A won listing sits under Won

- **GIVEN** a closed listing whose winner is the collector
- **WHEN** they open their Bidding page
- **THEN** that listing is under Won

#### Scenario: account-auction-record-SC-19 - A listing lost at close sits under Didn't win

- **GIVEN** a closed listing the collector bid on whose winner is someone else
- **WHEN** they open their Bidding page
- **THEN** that listing is under Didn't win

### Requirement: A winner reads their own payment and shipment state

A listing under Won SHALL carry the collector-facing state below, projected
from the listing's payment and shipment records. Grade10 SHALL show a single
**Paid**, whether collection was recorded as card capture or as an operator's
manual record.

| Collector state | Reached from |
| --- | --- |
| Awaiting payment | Card capture is still being attempted |
| Payment problem | Card capture gave up, or a wire is expected. Carries how to reach Grade10 |
| Paid | Grade10 has recorded collection, by either route |
| Shipped | Shipment has started and is not complete |
| Delivered | Shipment is complete |

This surface SHALL be read-only. It SHALL offer no control that records
payment, requests a wire, or records shipment.

#### Scenario: account-auction-record-SC-20 - Card capture reads as Paid

- **GIVEN** a won listing whose card capture succeeded and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Paid

#### Scenario: account-auction-record-SC-21 - Manual collection reads as the same Paid

- **GIVEN** a won listing whose collection an operator recorded outside Stripe,
  and which has not shipped
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Paid
- **AND** it is the same state a card capture produces, distinguished nowhere on
  this surface

#### Scenario: account-auction-record-SC-22 - A payment problem says how to reach Grade10

- **GIVEN** a won listing whose card capture gave up
- **WHEN** the winner opens their Bidding page
- **THEN** that listing's state is Payment problem
- **AND** the row carries how to reach Grade10

#### Scenario: account-auction-record-SC-23 - Shipment states reach the winner

- **GIVEN** one won listing whose shipment has started and one whose shipment is
  complete
- **WHEN** the winner opens their Bidding page
- **THEN** the first listing's state is Shipped and the second's is Delivered

#### Scenario: account-auction-record-SC-24 - The winner is offered no write

- **GIVEN** a won listing in any payment or shipment state
- **WHEN** the winner opens their Bidding page
- **THEN** no control on the surface records payment, requests a wire, or
  records shipment

### Requirement: A losing bidder is told what happened to their card hold

A listing under Didn't win on which the collector held a card authorization
SHALL say whether that authorization is still being released or is released.
Grade10 SHALL NOT describe an authorization as released while its release is
still in flight.

A listing the collector bid on that was called off SHALL appear under Didn't
win carrying the same statement about their authorization.

#### Scenario: account-auction-record-SC-25 - A release in flight says so

- **GIVEN** a closed listing the collector did not win, whose authorization
  Grade10 has marked for release and whose release is not complete
- **WHEN** they open their Bidding page
- **THEN** the row says the hold is being released
- **AND** it does not say the hold is released

#### Scenario: account-auction-record-SC-26 - A completed release says so

- **GIVEN** the same listing once its release is complete
- **WHEN** the collector opens their Bidding page
- **THEN** the row says the hold is released

#### Scenario: account-auction-record-SC-27 - A called-off listing tells the bidder about the hold

- **GIVEN** a listing the collector bid on that Grade10 called off
- **WHEN** they open their Bidding page
- **THEN** that listing is under Didn't win
- **AND** the row says what happened to their authorization

### Requirement: The record belongs to its owner alone

Grade10 SHALL resolve an auction record from the caller's session and no other
input. A request carrying no session SHALL be refused and SHALL return no
record. No input a collector supplies SHALL select another collector's record.

#### Scenario: account-auction-record-SC-28 - A signed-out request is refused

- **GIVEN** a request carrying no session
- **WHEN** it reads an auction record
- **THEN** Grade10 refuses it as unauthenticated
- **AND** returns no watch and no bid

#### Scenario: account-auction-record-SC-29 - A collector cannot address another record

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

#### Scenario: account-auction-record-SC-30 - A bidder lands on Bidding

- **GIVEN** a collector who has bid on at least one listing
- **WHEN** they open their auction record
- **THEN** they are on the Bidding page

#### Scenario: account-auction-record-SC-31 - A collector who has never bid lands on Watching

- **GIVEN** a collector who has never placed a bid
- **WHEN** they open their auction record
- **THEN** they are on the Watching page

#### Scenario: account-auction-record-SC-32 - An empty Watching page offers the catalogue

- **GIVEN** a collector watching no listing
- **WHEN** they open their Watching page
- **THEN** the page offers a way into the auction catalogue
- **AND** it does not report an error

#### Scenario: account-auction-record-SC-33 - A failed read is not an empty record

- **GIVEN** a collector whose record Grade10 cannot read
- **WHEN** they open it
- **THEN** the page reports that the read failed and offers to retry
- **AND** it does not show an empty record

#### Scenario: account-auction-record-SC-34 - A value that could not be refreshed says so

- **GIVEN** a record whose rows are shown but whose current bid could not be
  refreshed
- **WHEN** the collector reads it
- **THEN** that value is shown as not current
