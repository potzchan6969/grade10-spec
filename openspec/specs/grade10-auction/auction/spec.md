# grade10-auction/auction Specification

## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a card-backed bid within its scheduled window. A **listing** is the sole
customer-facing term for one auctioned card.

## Feature set

- Catalogue
  - Auction listings only: collectors browse listings, never Buy Now, with money as minor units
  - Absolute close: the highest accepted bid wins; there is no reserve
- Bidding window
  - Scheduled and extendable: a bid must meet the increment inside the window; a late valid bid can extend up to a cap
- Card authorization
  - One hold per bidder: an outbid authorization is released; a delayed lower hold cannot land
- Public contract
  - Listing and extension terms: a consumer can read the listing contract
- Stripe failures
  - Explicit handling: incomplete configuration and a missed webhook are repaired without double-charging

## User journeys

### auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

**Accepted by:**

- `auction-SC-01` — A collector browses Auction listings
- `auction-SC-02` — A closed listing is absolute
- `auction-SC-03` — Money facts use minor units and currency
- `auction-SC-13` — A consumer reads a listing contract

### auction-US-02: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a bid accepted only when it meets the increment inside the scheduled window,
**so that** a late valid bid can extend the close without passing the cap.

**Accepted by:**

- `auction-SC-04` — A bid must meet the next increment
- `auction-SC-05` — A bid outside the window is refused
- `auction-SC-06` — A late valid bid extends the close
- `auction-SC-07` — An extension cap limits an otherwise eligible extension
- `auction-SC-07a` — Window and duration may differ
- `auction-SC-07b` — Extension off does not move the close
- `auction-SC-08` — A bidder sees live bid facts

### auction-US-03: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.

**Accepted by:**

- `auction-SC-09` — An outbid authorization is released
- `auction-SC-10` — Concurrent bids keep the highest valid outcome
- `auction-SC-11` — A delayed lower authorization cannot land
- `auction-SC-12` — An invalid or duplicate Stripe event changes nothing twice
- `auction-SC-14` — Stripe configuration is incomplete
- `auction-SC-15` — A missed authorization webhook is repaired

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

#### Scenario: auction-SC-01 - A collector browses Auction listings

- **GIVEN** published Auction listings in Pokémon, MTG, and basketball-card categories
- **WHEN** a collector opens the Auction catalogue
- **THEN** Grade10 returns those Auction listings grouped or identifiable by category
- **AND** it returns no Buy Now listing or purchasable stock count

#### Scenario: auction-SC-02 - A closed listing is absolute

- **GIVEN** a listing closes with an accepted highest bid
- **WHEN** Grade10 determines its outcome
- **THEN** that highest accepted bidder wins the listing
- **AND** no reserve condition changes the outcome

#### Scenario: auction-SC-03 - Money facts use minor units and currency

- **GIVEN** an Auction listing with a starting price and buyer fee
- **WHEN** Grade10 returns its listing or checkout facts
- **THEN** every monetary amount is an integer minor-unit value and an ISO 4217 currency code
- **AND** no browser-supplied monetary value determines an accepted bid or payable total

### Requirement: Bids are valid only within the scheduled, extendable window

Each listing SHALL have a scheduled bidding start and close. A bidder MAY place
a bid only from the scheduled start through the recorded close. A valid bid
SHALL meet or exceed the current bid plus the listing's configured increment;
when there is no current bid, it SHALL meet or exceed the starting price.

Each listing SHALL carry an extension policy: an **extension window** and an
**extension duration**, both in whole seconds. When both are zero, extension is
off. When both are greater than zero, the extension window MUST NOT exceed the
extension duration. Omitted at create, both SHALL default to 1800 seconds (30
minutes).

When extension is armed and Grade10 accepts a valid bid with remaining time
less than or equal to the extension window, it SHALL set that listing's close
to exactly the extension duration after the accepted bid. A listing MAY define
an extension cap; when it does, its close SHALL NOT exceed its scheduled close
plus that cap. Grade10 SHALL apply this rule to every later valid bid until the
extension duration passes without a valid bid or the cap is reached.

Grade10 SHALL display the current recorded close and, to an authenticated
bidder, their committed maximum on that listing.

#### Scenario: auction-SC-04 - A bid must meet the next increment

- **GIVEN** an open listing with a current bid and configured increment
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

#### Scenario: auction-SC-05 - A bid outside the window is refused

- **GIVEN** a listing whose scheduled start has not arrived or whose recorded close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

#### Scenario: auction-SC-06 - A late valid bid extends the close

- **GIVEN** an open listing whose extension window is 1800 seconds and extension duration is 1800 seconds
- **AND** 1800 seconds or less remain until its recorded close
- **WHEN** Grade10 accepts a valid bid at time T
- **THEN** the listing close becomes T plus 1800 seconds
- **AND** another valid bid within the resulting extension window applies the same rule again

#### Scenario: auction-SC-07 - An extension cap limits an otherwise eligible extension

- **GIVEN** an open listing with an extension cap and a recorded close at that cap
- **WHEN** Grade10 accepts a valid bid inside its extension window
- **THEN** it accepts the bid without changing the recorded close
- **AND** it does not extend the listing beyond its configured cap

#### Scenario: auction-SC-07a - Window and duration may differ

- **GIVEN** an open listing whose extension window is 300 seconds and extension duration is 1800 seconds
- **AND** 300 seconds or less remain until its recorded close
- **WHEN** Grade10 accepts a valid bid at time T
- **THEN** the listing close becomes T plus 1800 seconds
- **AND** a bid accepted with more than 300 seconds remaining does not extend the close

#### Scenario: auction-SC-07b - Extension off does not move the close

- **GIVEN** an open listing whose extension window and extension duration are both zero
- **WHEN** Grade10 accepts a valid bid with one second remaining
- **THEN** it accepts the bid without changing the recorded close

#### Scenario: auction-SC-08 - A bidder sees live bid facts

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card authorization facts

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

#### Scenario: auction-SC-09 - An outbid authorization is released

- **GIVEN** a bidder has the active authorization for an open listing
- **WHEN** Grade10 accepts a higher valid bid from another bidder
- **THEN** Grade10 marks the outbid bidder's authorization for asynchronous release
- **AND** the outbid bidder no longer has an eligible top authorization for that listing
- **AND** Grade10 records the Stripe release outcome when it arrives

#### Scenario: auction-SC-10 - Concurrent bids keep the highest valid outcome

- **GIVEN** two bidders submit different valid bid amounts against the same current listing state
- **WHEN** Grade10 evaluates the requests concurrently
- **THEN** it records bid outcomes in one listing order
- **AND** the current bid is the highest valid accepted amount
- **AND** no lower bid can overwrite that current bid

#### Scenario: auction-SC-11 - A delayed lower authorization cannot land

- **GIVEN** a bidder's card authorization is pending for a listing
- **AND** Grade10 has accepted a higher valid bid before Stripe confirms that pending authorization
- **WHEN** Stripe later confirms the lower authorization
- **THEN** Grade10 releases the lower authorization
- **AND** it does not record that lower bid as accepted or change the current bid

#### Scenario: auction-SC-12 - An invalid or duplicate Stripe event changes nothing twice

- **GIVEN** Grade10 receives a Stripe authorization, release, or capture webhook
- **WHEN** the webhook signature is invalid or its provider event was already processed
- **THEN** Grade10 rejects the invalid event or returns the duplicate outcome without another state transition
- **AND** it does not duplicate a bid, hold, release, capture, invoice, or order state

### Requirement: Public Auction contracts use listing and extension terms

Public Auction contracts, routes, and customer-visible content SHALL use
`listing` and `listingId` for the auctioned-card unit; they SHALL NOT use
`auction item`, `auctionItemId`, or `lot`. They SHALL use `extension` for the
late-bid window, duration, and cap; they SHALL NOT use `anti-snipe` or
`antiSnipe`.

A public listing read SHALL expose the listing's extension window, extension
duration, and optional extension cap in seconds, using `extension` terminology.

#### Scenario: auction-SC-13 - A consumer reads a listing contract

- **WHEN** a customer application reads a public Auction listing or its extension facts
- **THEN** its contract uses listing and extension terms
- **AND** it exposes the extension window, extension duration, and extension cap when set
- **AND** it exposes no reserve state

### Requirement: Stripe configuration and delayed authorization facts are handled explicitly

Grade10 SHALL require the configured Stripe account, payment-method capability,
webhook secret, and authorization/capture capability before it offers a
card-backed Auction action. Missing configuration or an unsupported Stripe
outcome SHALL fail the affected action explicitly without exposing credentials,
card data, or customer address data. A scheduled reconciliation SHALL query
Stripe by the recorded provider reference to repair a delayed or missed valid
webhook.

#### Scenario: auction-SC-14 - Stripe configuration is incomplete

- **GIVEN** an Auction operation requiring Stripe
- **WHEN** required Stripe configuration is absent or does not support the required authorization/capture action
- **THEN** Grade10 fails that operation explicitly naming the unavailable capability
- **AND** it does not silently create a bid or fixture-backed outcome

#### Scenario: auction-SC-15 - A missed authorization webhook is repaired

- **GIVEN** Stripe has confirmed a bid authorization but Grade10 has not processed its webhook
- **WHEN** scheduled reconciliation reaches its recorded provider reference
- **THEN** Grade10 reads that authorization outcome
- **AND** it applies the authorization outcome exactly once
