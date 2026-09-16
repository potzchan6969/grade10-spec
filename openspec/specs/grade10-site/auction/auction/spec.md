# grade10-site/auction/auction Specification

## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a card-backed bid within its scheduled window. A **listing** is the sole
customer-facing term for one auctioned card.

## Feature set

- Catalogue
  - Auction listings only: collectors browse listings, never Buy Now, with money as minor units
  - Absolute close: the highest accepted bid wins; there is no reserve
- Bidding window
  - Scheduled start and close: a bid must meet the increment between the scheduled start and the recorded close
  - Extended bidding after the close: a lot with a bid by its scheduled close stays open until bidding stops, lot by lot, up to an optional cap
- Card authorization
  - Optional authorization: disabled by default; a valid bid does not wait for or create a bid-time authorization hold
  - One hold per bidder: an outbid authorization is released; a delayed lower hold cannot land
- Public contract
  - Listing and extension terms: a consumer reads the scheduled close, the recorded close, the extension duration, and the cap
- Stripe failures
  - Explicit handling: incomplete configuration and a missed webhook are repaired without double-charging

## Requirements

### Requirement: Auction listing facts are available

Grade10 SHALL publish a catalogue of Auction listings. It SHALL NOT publish or
represent Auction Buy Now listings in this capability.

Auction listings SHALL be absolute: when a listing closes with accepted bids,
the highest accepted bid wins. Grade10 SHALL NOT configure, store, return, or
evaluate a reserve amount, reserve state, or reserve-based no-sale outcome.

All money facts SHALL be an integer count of minor units paired with an ISO
4217 currency code. A listing's applicable fee, currency, region, and deadline
terms SHALL be an immutable snapshot of the operational policy effective when
the listing becomes available for bidding.

#### Scenario: grade10-site-auction-auction-SC-01 - A collector browses Auction listings
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** published Auction listings in Pokémon, MTG, and basketball-card categories
- **WHEN** a collector opens the Auction catalogue
- **THEN** Grade10 returns those Auction listings grouped or identifiable by category
- **AND** it returns no Buy Now listing or purchasable stock count

#### Scenario: grade10-site-auction-auction-SC-02 - A closed listing is absolute
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** a listing closes with an accepted highest bid
- **WHEN** Grade10 determines its outcome
- **THEN** that highest accepted bidder wins the listing
- **AND** no reserve condition changes the outcome

#### Scenario: grade10-site-auction-auction-SC-03 - Money facts use minor units and currency
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** an Auction listing with a starting price and buyer fee
- **WHEN** Grade10 returns its listing or checkout facts
- **THEN** every monetary amount is an integer minor-unit value and an ISO 4217 currency code
- **AND** no browser-supplied monetary value determines an accepted bid or payable total

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
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with a current bid and configured increment
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

#### Scenario: grade10-site-auction-auction-SC-05 - A bid outside the window is refused
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing whose scheduled start has not arrived or whose recorded close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

#### Scenario: grade10-site-auction-auction-SC-06 - A late valid bid extends the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC
- **WHEN** Grade10 accepts a valid bid at 20:10 UTC
- **THEN** the recorded close becomes 20:40 UTC
- **AND** a further valid bid accepted at 20:35 UTC moves it to 21:05 UTC

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

#### Scenario: grade10-site-auction-auction-SC-23 - Each listing runs its own extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** two listings with scheduled close 20:00 UTC, both in extended
  bidding with recorded close 20:30 UTC
- **WHEN** Grade10 accepts a valid bid on the first at 20:10 UTC
- **THEN** the first listing's recorded close is 20:40 UTC
- **AND** the second listing's recorded close is still 20:30 UTC

#### Scenario: grade10-site-auction-auction-SC-24 - A new bidder may bid during extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding, and a collector who placed no bid on
  it before its scheduled close
- **WHEN** that collector submits a valid bid
- **THEN** Grade10 accepts it
- **AND** the recorded close becomes the extension duration after that bid

### Requirement: Card-backed bids have one releasable authorization per bidder and listing

Before accepting a bid, Grade10 SHALL obtain a Stripe card authorization for
that bidder and active listing using a selected saved or recent payment method.
For each bidder/listing pair, Grade10 SHALL maintain at most one active
authorization and SHALL raise it only when the bidder raises their committed
bid amount. A bid is accepted only after its corresponding authorized outcome
is recorded.

When a bidder is outbid by a higher accepted bid, Grade10 SHALL immediately
mark that bidder's active authorization for asynchronous release. It SHALL also
mark every unsuccessful bidder's authorization for asynchronous release when the
listing closes. Stripe webhook signatures SHALL be verified over the unmodified
raw body before processing; provider events and bid requests SHALL be
idempotent. A delayed authorization for a bid that is no longer high enough
SHALL be marked for release and SHALL NOT become an accepted bid.

#### Scenario: grade10-site-auction-auction-SC-09 - An outbid authorization is released
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** a bidder has the active authorization for an open listing
- **WHEN** Grade10 accepts a higher valid bid from another bidder
- **THEN** Grade10 marks the outbid bidder's authorization for asynchronous release
- **AND** the outbid bidder no longer has an eligible top authorization for that listing
- **AND** Grade10 records the Stripe release outcome when it arrives

#### Scenario: grade10-site-auction-auction-SC-10 - Concurrent bids keep the highest valid outcome
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** two bidders submit different valid bid amounts against the same current listing state
- **WHEN** Grade10 evaluates the requests concurrently
- **THEN** it records bid outcomes in one listing order
- **AND** the current bid is the highest valid accepted amount
- **AND** no lower bid can overwrite that current bid

#### Scenario: grade10-site-auction-auction-SC-11 - A delayed lower authorization cannot land
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** a bidder's card authorization is pending for a listing
- **AND** Grade10 has accepted a higher valid bid before Stripe confirms that pending authorization
- **WHEN** Stripe later confirms the lower authorization
- **THEN** Grade10 releases the lower authorization
- **AND** it does not record that lower bid as accepted or change the current bid

#### Scenario: grade10-site-auction-auction-SC-12 - An invalid or duplicate Stripe event changes nothing twice
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** Grade10 receives a Stripe authorization, release, or capture webhook
- **WHEN** the webhook signature is invalid or its provider event was already processed
- **THEN** Grade10 rejects the invalid event or returns the duplicate outcome without another state transition
- **AND** it does not duplicate a bid, hold, release, capture, invoice, or order state

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
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **WHEN** a customer application reads a public Auction listing or its extension facts
- **THEN** its contract uses listing and extension terms
- **AND** it exposes the scheduled close, the recorded close, the extension
  duration, and the extension cap when set
- **AND** it exposes no extension window and no reserve state

### Requirement: Stripe configuration and delayed authorization facts are handled explicitly

Grade10 SHALL require the configured Stripe account, payment-method capability,
webhook secret, and authorization/capture capability before it offers a
card-backed Auction action. Missing configuration or an unsupported Stripe
outcome SHALL fail the affected action explicitly without exposing credentials,
card data, or customer address data. A scheduled reconciliation SHALL query
Stripe by the recorded provider reference to repair a delayed or missed valid
webhook.

#### Scenario: grade10-site-auction-auction-SC-14 - Stripe configuration is incomplete
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** an Auction operation requiring Stripe
- **WHEN** required Stripe configuration is absent or does not support the required authorization/capture action
- **THEN** Grade10 fails that operation explicitly naming the unavailable capability
- **AND** it does not silently create a bid or fixture-backed outcome

#### Scenario: grade10-site-auction-auction-SC-15 - A missed authorization webhook is repaired
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** Stripe has confirmed a bid authorization but Grade10 has not processed its webhook
- **WHEN** scheduled reconciliation reaches its recorded provider reference
- **THEN** Grade10 reads that authorization outcome
- **AND** it applies the authorization outcome exactly once

### Requirement: A standard bid does not require a bid-time authorization

When bid-time authorization holds are disabled, Grade10 SHALL accept a valid
bid without waiting for or creating a bid-time authorization. The existing
hold-backed behavior remains governed by
`grade10-site/auction/bid-payment-method` when enabled.

#### Scenario: grade10-site-auction-auction-SC-23 - The default bid path creates no authorization hold
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** bid-time authorization holds are disabled
- **WHEN** a collector submits a valid bid on an open listing
- **THEN** Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe
- **AND** it creates no bid-time authorization
