## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a card-backed bid within its scheduled window, closes each listing at its
effective close, and relays every committed change to the pages open on it. A
**listing** is the sole customer-facing term for one auctioned card.

## Feature set

- Catalogue
  - Auction listings only: collectors browse listings, never Buy Now, with money as minor units
  - Absolute close: the highest accepted bid wins; there is no reserve
  - Live cards: catalogue and Featured cards show each committed bid, extension and close without a reload
- Bidding window
  - Scheduled start and close: a bid must meet the minimum next amount between the scheduled start and the effective close
  - Opening price: a first bid must reach the starting price, or the currency's lowest increment on a 0 start
  - Extended bidding after the close: a lot with a bid by its scheduled close stays open until bidding stops, lot by lot, up to an optional cap
  - A price move restarts the timer: only a bid that moves the public price extends; a leader raising their own maximum does not
  - Late window ends at the effective close: no bid counts at or after it, however late the close is recorded; a duration or a cap of 0 means no extension
- Card authorization
  - Optional authorization: disabled by default; a valid bid does not wait for or create a bid-time authorization hold
  - One hold per bidder: an outbid authorization is released; a delayed lower hold cannot land
  - A bid counts when its payment confirms: a confirm after the effective close loses with no grace and its hold is released; with holds off, a bid counts when placed
  - Lone first bid still confirming: at the scheduled close it leaves the lot unsold, and its hold is released
- Closing a due lot
  - Closed at the close: a lot is settled at its deadline by whichever reaches it first - the lot's own alarm, then a read that finds it overdue
  - Sweep as the net: the five-minute sweep still settles any lot nobody reached
  - Bids never settle: a bid or a payment confirm refuses a lot past its effective close and never closes it
- Live relay
  - After the commit: each committed bid, extension and close reaches every open lot page and catalogue card, read back from the database
  - Relays decide nothing: the relay holds no state the database does not, so losing it loses nothing
  - Polling fallback: a page that cannot hold a live line polls
- Public contract
  - Listing and extension terms: a consumer reads the scheduled close, the recorded close, the extension duration, and the cap
  - Service time: a public read gives the auction service's clock
- Stripe failures
  - Explicit handling: incomplete configuration and a missed webhook are repaired without double-charging
- Identity bar on a bid
  - Held at the storefront: a bid at or above the bar is held before the auction hears of it
  - A verified bidder above the bar bids; another is sent to verify

## ADDED Requirements

### Requirement: Catalogue cards follow each lot live

Every catalogue card and Featured slide SHALL show each committed bid,
extension and close on its lot without a reload: the current bid, the bid
count, the recorded close and the countdown. Its countdown SHALL run on the
auction service's clock and round up, as the lot page's does under
`grade10-site/auction/listing-page`. A card SHALL show no result until the
close is recorded.

#### Scenario: grade10-site-auction-auction-SC-65 - A bid on a lot moves its card
**Serves:** `Catalogue` - a collector reads the catalogue while another collector bids

- **GIVEN** a collector reading the catalogue, which shows an open lot's card
- **WHEN** a bid on that lot is accepted from another page
- **THEN** the card shows the new current bid and bid count without a reload

#### Scenario: grade10-site-auction-auction-SC-66 - An extension restarts the card's countdown
**Serves:** `Catalogue` - a collector reads the catalogue while a lot extends

- **GIVEN** a catalogue card on a lot in extended bidding
- **WHEN** a price-moving bid sets a later recorded close
- **THEN** the card's countdown counts to the new recorded close without a
  reload

#### Scenario: grade10-site-auction-auction-SC-88 - A card past its close shows no result until the close is recorded
**Serves:** `Catalogue` - a collector reads a lot's card as its close passes

- **GIVEN** a catalogue card on a lot whose effective close has passed and
  whose close is not yet recorded
- **WHEN** the card shows the lot
- **THEN** it shows the existing closed state with the current bid as it
  stood, and no result
- **AND** once the close is recorded it shows the recorded result without a
  reload

### Requirement: A bid counts when its payment confirms

With bid-time authorization holds on, a bid SHALL count at the moment its
card authorization confirms, judged then against the listing's window. With
holds off, a bid SHALL count when it is placed.

| Confirms | Outcome |
| --- | --- |
| Before the effective close | The bid counts, and may move the price and the close |
| At or after the effective close | The bid does not count, and its hold is released. No grace |
| Never, while the listing closes | The close marks the bid lost and releases its hold |

A bid still confirming SHALL NOT count toward entering extended bidding. A
listing whose only bid is still confirming at its scheduled close SHALL close
unsold. The bidder whose bid did not count SHALL be told their bid did not go
through.

#### Scenario: grade10-site-auction-auction-SC-67 - A confirmation after the close loses
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** bid-time holds are on, and a listing whose effective close is
  20:30:00 UTC with a leader at 120000 HKD minor units
- **WHEN** a bid of 130000 HKD minor units placed at 20:29:59 UTC has its
  authorization confirmed at 20:30:01 UTC
- **THEN** the bid does not count, and the current bid stays 120000 HKD minor
  units
- **AND** its hold is released
- **AND** the recorded close does not move

#### Scenario: grade10-site-auction-auction-SC-68 - A lone first bid still confirming leaves the lot unsold
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** bid-time holds are on, extension duration 1800 seconds, and a
  listing whose only bid is still confirming at its scheduled close
- **WHEN** the listing settles
- **THEN** it closes unsold at its scheduled close and does not enter extended
  bidding
- **AND** that bid is lost and its hold is released

#### Scenario: grade10-site-auction-auction-SC-69 - A confirmation before the close counts
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** bid-time holds are on, and a listing in extended bidding with
  recorded close 20:30:00 UTC
- **WHEN** a valid bid that moves the price has its authorization confirmed at
  20:29:59 UTC
- **THEN** the bid counts and the recorded close becomes the extension
  duration after 20:29:59 UTC

#### Scenario: grade10-site-auction-auction-SC-86 - With holds off a bid counts when placed
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** bid-time holds are off, and a listing in extended bidding with an
  extension duration of 1800 seconds and recorded close 20:30:00 UTC
- **WHEN** a valid bid that moves the price is placed at 20:29:59 UTC
- **THEN** the bid counts when placed, with no wait for a payment
- **AND** the recorded close becomes 20:59:59 UTC

### Requirement: A due lot is settled at its close

Grade10 SHALL settle a listing when a deadline passes: open bidding at its
start, enter extended bidding at its scheduled close, or close it at its
effective close, whichever is due. Whoever reaches a due listing first
settles it:

1. The listing's own timer, at the deadline
2. Any read that finds the listing past its effective close, after it answers
   and without delaying the answer
3. The five-minute sweep, for a listing nothing else reached

Settling a listing twice SHALL change nothing the first did not. A bid or a
payment confirmation that finds a listing past its effective close SHALL be
refused and SHALL NOT close the listing; its answer SHALL NOT depend on
whether a close succeeds. Until the close is recorded, a public read SHALL NOT
report the listing Ended or name a result.

#### Scenario: grade10-site-auction-auction-SC-70 - A lot closes at its close with nobody watching
**Serves:** `Closing a due lot` - the listing's own timer settles it

- **GIVEN** an open listing with no accepted bid, scheduled close 20:00:00 UTC,
  no page open on it, and no sweep due before 20:05:00 UTC
- **WHEN** 20:00:00 UTC passes
- **THEN** the listing is recorded closed unsold before the next sweep runs

#### Scenario: grade10-site-auction-auction-SC-71 - A read settles an overdue lot
**Serves:** `Closing a due lot` - a read finds the listing past its close

- **GIVEN** a listing past its effective close whose timer did not settle it
- **WHEN** a collector reads the listing
- **THEN** the read answers with no result and does not report Ended
- **AND** the listing is recorded closed after that answer, before the next
  sweep runs

#### Scenario: grade10-site-auction-auction-SC-72 - The sweep settles what nothing reached
**Serves:** `Closing a due lot` - the sweep is the net

- **GIVEN** a listing past its effective close that neither its timer nor a
  read settled
- **WHEN** the sweep runs
- **THEN** the listing is recorded closed with the outcome its accepted bids
  decide

#### Scenario: grade10-site-auction-auction-SC-73 - Settling twice changes nothing
**Serves:** `Closing a due lot` - two settles reach one listing

- **GIVEN** a listing past its effective close
- **WHEN** its timer and a read settle it at the same moment
- **THEN** it is closed once, with one outcome, one winner order when it sold,
  and one release per losing hold

#### Scenario: grade10-site-auction-auction-SC-74 - A bid past the close does not close the lot
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** a listing past its effective close whose close is not yet recorded
- **WHEN** a bidder submits a valid bid
- **THEN** Grade10 refuses the bid and creates no accepted bid
- **AND** the refusal is answered even when closing the listing fails

### Requirement: Every committed change reaches the open pages

After Grade10 commits a change to a public listing - an accepted bid, an
extension, a close, or the listing ceasing to be public - it SHALL send the
listing to every open lot page and catalogue card on it. What it sends SHALL
be the whole listing as read back from the database after the commit, never a
value a writer supplied, and SHALL carry the listing's version, which rises
with every change. A page SHALL keep the higher version it holds, so an older
update or an older read never replaces a newer one.

The relay SHALL hold nothing the database does not; losing it loses no bid and
no result. A page that cannot hold a live connection SHALL poll. Live updates
SHALL carry nothing a public listing read does not: no bidder identity, no
private maximum, no storefront and no card facts.

#### Scenario: grade10-site-auction-auction-SC-75 - An older update does not replace a newer one
**Serves:** `Live relay` - updates and reads arrive out of order

- **GIVEN** a page holding a listing at version 12
- **WHEN** an update or a read of that listing at version 11 arrives
- **THEN** the page keeps version 12

#### Scenario: grade10-site-auction-auction-SC-76 - A live update carries only public facts
**Serves:** `Live relay` - a page receives a live update

- **WHEN** a live update for a listing reaches a page
- **THEN** it carries no bidder identity, private maximum, storefront or card
  fact that the public listing read does not return

#### Scenario: grade10-site-auction-auction-SC-77 - A page without a live connection still catches up
**Serves:** `Live relay` - a page cannot open its live connection

- **GIVEN** a page on an open listing that cannot open a live connection
- **WHEN** a bid on that listing is accepted
- **THEN** the page shows the new current bid on its next poll, without a
  reload

#### Scenario: grade10-site-auction-auction-SC-79 - A lot that stops being public leaves open pages
**Serves:** `Live relay` - a listing is called off while pages are open

- **GIVEN** a page open on a public listing
- **WHEN** the listing is called off
- **THEN** the page learns the listing is gone without a reload

### Requirement: A public read gives the service time

Grade10 SHALL answer a public time read with the auction service's current
time, with no session, no database read and no caching. Pages count down on
this clock under `grade10-site/auction/listing-page`.

#### Scenario: grade10-site-auction-auction-SC-80 - The time read answers the service clock
**Serves:** `Public contract` - a page reads the service time

- **WHEN** a page reads the public time twice, one second apart
- **THEN** each answer is the auction service's time when it answered
- **AND** neither answer may be cached

## MODIFIED Requirements

### Requirement: Bids are valid only within the scheduled, extendable window

Each listing SHALL have a scheduled bidding start and a scheduled close. A
bidder MAY place a bid only from the scheduled start until the listing's
effective close. A valid bid SHALL meet or exceed the minimum next amount that
`grade10-site/auction/bid-increments` sets; before any accepted bid, that is
the listing's opening price - its starting price, or the currency's lowest
increment when the starting price is 0.

Each listing SHALL carry an **extension duration** in whole seconds, and MAY
carry an **extension cap** in whole seconds. An extension duration of zero, or
an extension cap of zero, turns extended bidding off. Omitted at create, the
extension duration SHALL default to 1800 seconds (30 minutes). A listing SHALL
carry no extension window. Each listing's extended bidding SHALL run on its
own, whatever campaign it belongs to.

| Term | Value |
| --- | --- |
| **Extension reach** | The shorter of the extension duration and the cap; 0 when extended bidding is off |
| **Effective close** | The recorded close once extended bidding has started; before that, the scheduled close plus the extension reach for a listing with an accepted bid and extended bidding on, and one millisecond after the scheduled close otherwise, so a bid at exactly the scheduled close counts |
| **Price-moving bid** | An accepted bid after which the current bid is higher than before it |

A listing is **in extended bidding** from its scheduled close until its
recorded close, once it has entered extended bidding by the steps below.

Grade10 SHALL close each listing as follows.

1. Until the scheduled close, the recorded close is the scheduled close. An
   accepted bid SHALL NOT move it.
2. A bid at exactly the scheduled close SHALL count, whether or not extended
   bidding is on.
3. At the scheduled close, a listing with no accepted bid, or with extended
   bidding off, SHALL close.
4. At the scheduled close, a listing with at least one accepted bid and
   extended bidding on SHALL enter extended bidding. Its recorded close SHALL
   become the scheduled close plus the extension reach.
5. During extended bidding, any bidder MAY bid, whether or not they bid before
   the scheduled close. Each price-moving bid SHALL set the recorded close to
   exactly the extension duration after that bid. Equal maxima that raise the
   current bid are price-moving, whoever keeps the lead. A bid that leaves the
   current bid where it was - a leader raising their own maximum - SHALL be
   accepted without moving the recorded close.
6. When an extension cap is set, the recorded close SHALL NOT exceed the
   scheduled close plus that cap. A valid bid that would move it further SHALL
   be accepted without moving it.
7. The listing SHALL close at its effective close. No bid SHALL count at or
   after it, however late the close is recorded.

Worked example. Scheduled close 20:00 UTC, extension duration 1800 seconds, no
cap, every bid after 20:00 price-moving.

| Listing | Bids by 20:00 | Bids after 20:00 | Closes |
| --- | --- | --- | --- |
| A | None | — | 20:00 |
| B | One | None | 20:30 |
| C | Three | 20:10, then 20:35 | 21:05 |
| D | One | A leader's raise at 20:10 | 20:30 |

Grade10 SHALL display the current recorded close and, to an authenticated
bidder, their committed maximum on that listing.

Scenario `grade10-site-auction-auction-SC-07a` keeps its title with its id. The
title is historical: a listing no longer carries an extension window.

#### Scenario: grade10-site-auction-auction-SC-04 - A bid must meet the next increment
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with a current bid
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

#### Scenario: grade10-site-auction-auction-SC-05 - A bid outside the window is refused
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing whose scheduled start has not arrived or whose effective close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

#### Scenario: grade10-site-auction-auction-SC-06 - A late valid bid extends the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid at 20:10 UTC
- **THEN** the recorded close becomes 20:40 UTC
- **AND** a further price-moving bid accepted at 20:35 UTC moves it to 21:05 UTC

#### Scenario: grade10-site-auction-auction-SC-07 - An extension cap limits an otherwise eligible extension
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding with an extension cap, whose recorded
  close is its scheduled close plus that cap
- **WHEN** Grade10 accepts a valid bid
- **THEN** it accepts the bid without changing the recorded close
- **AND** the listing closes at its scheduled close plus that cap

#### Scenario: grade10-site-auction-auction-SC-07a - Window and duration may differ
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 300 seconds, and one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:05 UTC

#### Scenario: grade10-site-auction-auction-SC-07b - Extension off does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing whose extension duration is zero and which has an
  accepted bid
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

#### Scenario: grade10-site-auction-auction-SC-08 - A bidder sees live bid facts
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card authorization facts

#### Scenario: grade10-site-auction-auction-SC-19 - A listing with no bid closes at its scheduled close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with no accepted bid and an extension duration of
  1800 seconds
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

#### Scenario: grade10-site-auction-auction-SC-20 - One bid is enough to enter extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 1800 seconds, and exactly one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:30 UTC
- **AND** with no further bid it closes at 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-21 - A bid before the scheduled close does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC and an extension
  duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at 19:59 UTC
- **THEN** the recorded close is still 20:00 UTC

#### Scenario: grade10-site-auction-auction-SC-22 - A bid at the scheduled close counts toward entry
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with no accepted bid, scheduled close 20:00:00 UTC,
  and an extension duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at exactly 20:00:00 UTC
- **THEN** the listing is in extended bidding with recorded close 20:30:00 UTC

#### Scenario: grade10-site-auction-auction-SC-23a - Each listing runs its own extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** two listings with scheduled close 20:00 UTC, both in extended
  bidding with recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid on the first at 20:10 UTC
- **THEN** the first listing's recorded close is 20:40 UTC
- **AND** the second listing's recorded close is still 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-24 - A new bidder may bid during extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding, and a collector who placed no bid on
  it before its scheduled close
- **WHEN** that collector submits a valid bid
- **THEN** Grade10 accepts it
- **AND** the recorded close becomes the extension duration after that bid

#### Scenario: grade10-site-auction-auction-SC-81 - A leader raising their own maximum does not extend
**Serves:** grade10-site-auction-auction-US-12 - Bidder keeps a lot open only by moving its price

- **GIVEN** a listing in extended bidding with recorded close 20:30 UTC, whose
  leader stands at 100000 HKD minor units with a maximum of 150000 HKD minor
  units
- **WHEN** the leader raises their maximum to 200000 HKD minor units at
  20:10 UTC
- **THEN** Grade10 accepts the new maximum and the current bid stays 100000
  HKD minor units
- **AND** the recorded close stays 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-82 - Equal maxima at a higher price extend
**Serves:** grade10-site-auction-auction-US-12 - Bidder keeps a lot open only by moving its price

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC, at a current bid of 100000 HKD minor
  units, whose leader A has a maximum of 200000 HKD minor units
- **WHEN** bidder B sets a maximum of 200000 HKD minor units at 20:10 UTC
- **THEN** the current bid becomes 200000 HKD minor units and A keeps the lead
  as the earlier
- **AND** the recorded close becomes 20:40 UTC

#### Scenario: grade10-site-auction-auction-SC-83 - A bid at the scheduled close counts with extension off
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing whose extension duration is zero, with scheduled
  close 20:00:00 UTC and a current bid of 100000 HKD minor units
- **WHEN** a valid bid of 110000 HKD minor units arrives at exactly
  20:00:00 UTC
- **THEN** Grade10 accepts it
- **AND** the listing closes at 20:00:00 UTC with that bid winning

#### Scenario: grade10-site-auction-auction-SC-84 - A cap of zero turns extended bidding off
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with an extension duration of 1800 seconds, an
  extension cap of 0, and an accepted bid before its scheduled close
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** a bid after it is refused

#### Scenario: grade10-site-auction-auction-SC-85 - The late window ends at the extension reach
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 1800 seconds, an extension cap of 600 seconds, an accepted bid
  before 20:00 UTC, and no extension recorded yet
- **WHEN** a valid bid arrives at 20:11 UTC
- **THEN** Grade10 refuses it
- **AND** the listing closes at 20:10 UTC with the earlier bid winning

#### Scenario: grade10-site-auction-auction-SC-87 - A bid at the recorded close does not count, however late the close is recorded
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** listing C of the worked example, in extended bidding with recorded
  close 21:05:00 UTC after the price-moving bid at 20:35:00 UTC, and its close
  not yet recorded
- **WHEN** a valid bid that would move the price arrives at exactly 21:05:00
  UTC, or at 21:05:30 UTC
- **THEN** Grade10 refuses it and the recorded close stays 21:05:00 UTC
- **AND** when the close is recorded, the bid from 20:35:00 UTC wins

#### Scenario: grade10-site-auction-auction-SC-62 - A first bid may stand on the starting price
**Serves:** grade10-site-auction-auction-US-02 - Collector opens the bidding on a lot nobody has bid on

- **GIVEN** an open `HKD` listing with a starting price of 20000 minor units and no accepted bid
- **WHEN** a bidder bids 20000 minor units
- **THEN** Grade10 accepts the bid and the current bid is 20000 minor units
- **AND** the next minimum is 21000 minor units

#### Scenario: grade10-site-auction-auction-SC-64 - A first bid below the starting price is refused
**Serves:** grade10-site-auction-auction-US-02 - Collector opens the bidding on a lot nobody has bid on

- **GIVEN** an open `HKD` listing with a starting price of 20000 minor units and no accepted bid
- **WHEN** a bidder bids 19999 minor units
- **THEN** Grade10 refuses the bid and names 20000 minor units as the minimum valid amount

#### Scenario: grade10-site-auction-auction-SC-63 - A first bid on a 0 start must reach the lowest increment
**Serves:** grade10-site-auction-auction-US-02 - Collector opens the bidding on a lot that starts at nothing

- **GIVEN** an open `USD` listing with a starting price of 0 and no accepted bid
- **WHEN** a bidder bids 1 minor unit
- **THEN** Grade10 refuses the bid and names 100 minor units as the minimum valid amount
