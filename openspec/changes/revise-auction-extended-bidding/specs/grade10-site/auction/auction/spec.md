## Feature set

- Bidding window
  - Scheduled start and close: a bid must meet the increment between the
    scheduled start and the recorded close
  - Extended bidding after the close: a lot with a bid by its scheduled close
    stays open until bidding stops, lot by lot, up to an optional cap
- Public contract
  - Listing and extension terms: a consumer reads the scheduled close, the
    recorded close, the extension duration, and the cap

## MODIFIED Requirements

### Requirement: Bids are valid only within the scheduled, extendable window

Each listing SHALL have a scheduled bidding start and a scheduled close. A
bidder MAY place a bid only from the scheduled start through the recorded
close. A valid bid SHALL meet or exceed the current bid plus the listing's
configured increment; when there is no current bid, it SHALL meet or exceed the
starting price.

Each listing SHALL carry an **extension duration** in whole seconds, and MAY
carry an **extension cap** in whole seconds. An extension duration of zero
turns extended bidding off. Omitted at create, the extension duration SHALL
default to 1800 seconds (30 minutes). A listing SHALL carry no extension
window. Each listing's extended bidding SHALL run on its own, whatever
campaign it belongs to.

A listing is **in extended bidding** from its scheduled close until its
recorded close, once it has entered extended bidding by the steps below.

Grade10 SHALL close each listing as follows.

1. Until the scheduled close, the recorded close is the scheduled close. An
   accepted bid SHALL NOT move it.
2. At the scheduled close, a listing with no accepted bid SHALL close.
3. At the scheduled close, a listing with at least one accepted bid and extended
   bidding on SHALL enter extended bidding. Its recorded close SHALL become the
   scheduled close plus the extension duration. A bid accepted at exactly the
   scheduled close SHALL count as accepted by it.
4. During extended bidding, any bidder MAY bid, whether or not they bid before
   the scheduled close. Each accepted bid SHALL set the recorded close to
   exactly the extension duration after that bid.
5. When an extension cap is set, the recorded close SHALL NOT exceed the
   scheduled close plus that cap. A valid bid that would move it further SHALL
   be accepted without moving it.
6. The listing SHALL close at its recorded close.

Worked example. Scheduled close 20:00 UTC, extension duration 1800 seconds, no
cap.

| Listing | Bids by 20:00 | Bids after 20:00 | Closes |
| --- | --- | --- | --- |
| A | None | — | 20:00 |
| B | One | None | 20:30 |
| C | Three | 20:10, then 20:35 | 21:05 |

Grade10 SHALL display the current recorded close and, to an authenticated
bidder, their committed maximum on that listing.

Scenario `grade10-site-auction-auction-SC-07a` keeps its title with its id. The
title is historical: a listing no longer carries an extension window.

#### Scenario: grade10-site-auction-auction-SC-04 - A bid must meet the next increment

- **GIVEN** an open listing with a current bid and configured increment
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

#### Scenario: grade10-site-auction-auction-SC-05 - A bid outside the window is refused

- **GIVEN** a listing whose scheduled start has not arrived or whose recorded close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

#### Scenario: grade10-site-auction-auction-SC-06 - A late valid bid extends the close

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC
- **WHEN** Grade10 accepts a valid bid at 20:10 UTC
- **THEN** the recorded close becomes 20:40 UTC
- **AND** a further valid bid accepted at 20:35 UTC moves it to 21:05 UTC

#### Scenario: grade10-site-auction-auction-SC-07 - An extension cap limits an otherwise eligible extension

- **GIVEN** a listing in extended bidding with an extension cap, whose recorded
  close is its scheduled close plus that cap
- **WHEN** Grade10 accepts a valid bid
- **THEN** it accepts the bid without changing the recorded close
- **AND** the listing closes at its scheduled close plus that cap

#### Scenario: grade10-site-auction-auction-SC-07a - Window and duration may differ

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 300 seconds, and one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:05 UTC

#### Scenario: grade10-site-auction-auction-SC-07b - Extension off does not move the close

- **GIVEN** an open listing whose extension duration is zero and which has an
  accepted bid
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

#### Scenario: grade10-site-auction-auction-SC-08 - A bidder sees live bid facts

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card authorization facts

#### Scenario: grade10-site-auction-auction-SC-19 - A listing with no bid closes at its scheduled close

- **GIVEN** an open listing with no accepted bid and an extension duration of
  1800 seconds
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

#### Scenario: grade10-site-auction-auction-SC-20 - One bid is enough to enter extended bidding

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 1800 seconds, and exactly one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:30 UTC
- **AND** with no further bid it closes at 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-21 - A bid before the scheduled close does not move the close

- **GIVEN** an open listing with scheduled close 20:00 UTC and an extension
  duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at 19:59 UTC
- **THEN** the recorded close is still 20:00 UTC

#### Scenario: grade10-site-auction-auction-SC-22 - A bid at the scheduled close counts toward entry

- **GIVEN** an open listing with no accepted bid, scheduled close 20:00:00 UTC,
  and an extension duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at exactly 20:00:00 UTC
- **THEN** the listing is in extended bidding with recorded close 20:30:00 UTC

#### Scenario: grade10-site-auction-auction-SC-23 - Each listing runs its own extended bidding

- **GIVEN** two listings with scheduled close 20:00 UTC, both in extended
  bidding with recorded close 20:30 UTC
- **WHEN** Grade10 accepts a valid bid on the first at 20:10 UTC
- **THEN** the first listing's recorded close is 20:40 UTC
- **AND** the second listing's recorded close is still 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-24 - A new bidder may bid during extended bidding

- **GIVEN** a listing in extended bidding, and a collector who placed no bid on
  it before its scheduled close
- **WHEN** that collector submits a valid bid
- **THEN** Grade10 accepts it
- **AND** the recorded close becomes the extension duration after that bid

### Requirement: Public Auction contracts use listing and extension terms

Public Auction contracts, routes, and customer-visible content SHALL use
`listing` and `listingId` for the auctioned-card unit; they SHALL NOT use
`auction item`, `auctionItemId`, or `lot`. They SHALL use `extension` for the
extended-bidding duration and cap; they SHALL NOT use `anti-snipe` or
`antiSnipe`.

A public listing read SHALL expose the listing's scheduled close, its recorded
close, its extension duration, and its optional extension cap in seconds,
using `extension` terminology. It SHALL NOT expose an extension window.

#### Scenario: grade10-site-auction-auction-SC-13 - A consumer reads a listing contract

- **WHEN** a customer application reads a public Auction listing or its extension facts
- **THEN** its contract uses listing and extension terms
- **AND** it exposes the scheduled close, the recorded close, the extension
  duration, and the extension cap when set
- **AND** it exposes no extension window and no reserve state
