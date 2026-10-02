# grade10-site/auction/auction Specification

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
  - Extended bidding after the close: a lot with a bid by its scheduled close stays open until bidding stops, lot by lot, up to an optional cap
  - Opening price: a first bid must reach the starting price, or the currency's lowest increment on a 0 start
  - A price move restarts the timer: only a bid that moves the public price extends; a leader raising their own maximum does not
  - Late window ends at the effective close: no bid counts at or after it, however late the close is recorded; a duration or a cap of 0 means no extension
- Card authorization
  - Optional authorization: disabled by default; a valid bid does not wait for or create a bid-time authorization hold
  - One hold per bidder: an outbid authorization is released; a delayed lower hold cannot land
  - A bid counts when its payment confirms: a confirm after the effective close loses with no grace and its hold is released; with holds off, a bid counts when placed
  - Lone first bid still confirming: at the scheduled close it leaves the lot unsold, and its hold is released
- Public contract
  - Listing and extension terms: a consumer reads the scheduled close, the recorded close, the extension duration, and the cap
  - Service time: a public read gives the auction service's clock
- Stripe failures
  - Explicit handling: incomplete configuration and a missed webhook are repaired without double-charging
- Identity bar on a bid
  - Held at the storefront: a bid at or above the bar is held before the auction hears of it
  - A verified bidder above the bar bids; another is sent to verify
- Closing a due lot
  - Closed at the close: a lot is settled at its deadline by whichever reaches it first - the lot's own alarm, then a read that finds it overdue
  - Sweep as the net: the five-minute sweep still settles any lot nobody reached
  - Bids never settle: a bid or a payment confirm refuses a lot past its effective close and never closes it
- Live relay
  - After the commit: each committed bid, extension and close reaches every open lot page and catalogue card, read back from the database
  - Relays decide nothing: the relay holds no state the database does not, so losing it loses nothing
  - Polling fallback: a page that cannot hold a live line polls
- Featured catalogue band
  - Dedicated Featured read: `/auction` loads Featured from its own public answer, separate from All auctions
  - Operator slides: when at least one complete slot is set, `/auction` leads with a full-width carousel of those slides in operator order
  - Slide facts: each slide shows the slot's front page image as banner and slab (load failure falls back to the lot's first gallery image, else the stage default background), lot title, status chrome by lot status, relative Ends in / Opens in from served close or open, and money on Active only (current bid rolls when the amount increases after first paint; Upcoming shows no money until the lot opens)
  - Open lot: Bid Now on Active or View Auction on Upcoming opens that lot's details page
  - Progress: dots advance among two or three slides; on a small viewport stage previous/next and swipe also advance; a single slide needs no multi-dot advance or stage previous/next
- Quiet catalogue
  - Featured then All auctions: the only sections on `/auction` in this layout; Featured is absent when no complete slot is set
  - No category section: no Categories heading, tiles, or busy filter chrome
  - Resting All auctions: every visible lot including featured ones, in the catalogue resting order below Featured when Featured is present
  - All auctions load more: infinite scroll appends the next batch; Boneyard skeleton cards while that batch settles; no pagination
  - Upcoming cards hide money: an Upcoming All auctions card shows no starting bid until the lot is Active
- Catalogue watch
  - Shared watch on cards: All auctions cards use the same watch as the lot page and My Auctions; closed lots show none

## Requirements

### Requirement: A bid at or above the identity bar needs a verified bidder

The storefront that forwards a bid SHALL compare the bid's amount to the
brand's bar before the auction hears of it. At or above the bar it SHALL
forward the bid only for a bidder whose standing is `verified` on the day of
the bid, and SHALL otherwise refuse the bid naming that a verified identity is
needed and where to verify — no hold is taken and the auction records nothing.
Below the bar a bid SHALL ask nothing about identity. On a brand that deploys
no identity store the bar SHALL not exist.

<!-- trace:scenario id=g10.auction-auction.SC-uhh rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-16 - An unverified bidder above the bar is held at the storefront
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified` or `expired`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is refused as needing a verified identity, the auction
  records no bid and takes no hold, and the bidder is told to verify from
  their account

<!-- trace:scenario id=g10.auction-auction.SC-d78 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-17 - A verified bidder above the bar bids
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `verified`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is forwarded to the auction as any other

<!-- trace:scenario id=g10.auction-auction.SC-ndj rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-18 - A bid below the bar asks nothing
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** any signed-in bidder
- **WHEN** they place a bid below the bar
- **THEN** no standing is read and the bid is forwarded as any other

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

<!-- trace:scenario id=g10.auction-auction.SC-ian rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-01 - A collector browses Auction listings
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** published Auction listings in Pokémon, MTG, and basketball-card categories
- **WHEN** a collector opens the Auction catalogue
- **THEN** Grade10 returns those Auction listings grouped or identifiable by category
- **AND** it returns no Buy Now listing or purchasable stock count

<!-- trace:scenario id=g10.auction-auction.SC-fec rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-02 - A closed listing is absolute
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** a listing closes with an accepted highest bid
- **WHEN** Grade10 determines its outcome
- **THEN** that highest accepted bidder wins the listing
- **AND** no reserve condition changes the outcome

<!-- trace:scenario id=g10.auction-auction.SC-djb rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-03 - Money facts use minor units and currency
**Serves:** grade10-site-auction-auction-US-01 - Collector browses Auction listings

- **GIVEN** an Auction listing with a starting price and buyer fee
- **WHEN** Grade10 returns its listing or checkout facts
- **THEN** every monetary amount is an integer minor-unit value and an ISO 4217 currency code
- **AND** no browser-supplied monetary value determines an accepted bid or payable total

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

<!-- trace:scenario id=g10.auction-auction.SC-jsr rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-04 - A bid must meet the next increment
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with a current bid
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

<!-- trace:scenario id=g10.auction-auction.SC-5ao rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-05 - A bid outside the window is refused
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing whose scheduled start has not arrived or whose effective close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

<!-- trace:scenario id=g10.auction-auction.SC-2js rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-06 - A late valid bid extends the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid at 20:10 UTC
- **THEN** the recorded close becomes 20:40 UTC
- **AND** a further price-moving bid accepted at 20:35 UTC moves it to 21:05 UTC

<!-- trace:scenario id=g10.auction-auction.SC-p70 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07 - An extension cap limits an otherwise eligible extension
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** a listing in extended bidding with an extension cap, whose recorded
  close is its scheduled close plus that cap
- **WHEN** Grade10 accepts a valid bid
- **THEN** it accepts the bid without changing the recorded close
- **AND** the listing closes at its scheduled close plus that cap

<!-- trace:scenario id=g10.auction-auction.SC-n8w rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07a - Window and duration may differ
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 300 seconds, and one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:05 UTC

<!-- trace:scenario id=g10.auction-auction.SC-z62 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07b - Extension off does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing whose extension duration is zero and which has an
  accepted bid
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

<!-- trace:scenario id=g10.auction-auction.SC-dnt rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-08 - A bidder sees live bid facts
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card authorization facts

<!-- trace:scenario id=g10.auction-auction.SC-a33 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-19 - A listing with no bid closes at its scheduled close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with no accepted bid and an extension duration of
  1800 seconds
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

<!-- trace:scenario id=g10.auction-auction.SC-cib rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-20 - One bid is enough to enter extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 1800 seconds, and exactly one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:30 UTC
- **AND** with no further bid it closes at 20:30 UTC

<!-- trace:scenario id=g10.auction-auction.SC-z5s rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-21 - A bid before the scheduled close does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC and an extension
  duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at 19:59 UTC
- **THEN** the recorded close is still 20:00 UTC

<!-- trace:scenario id=g10.auction-auction.SC-h4d rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-22 - A bid at the scheduled close counts toward entry
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** an open listing with no accepted bid, scheduled close 20:00:00 UTC,
  and an extension duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at exactly 20:00:00 UTC
- **THEN** the listing is in extended bidding with recorded close 20:30:00 UTC

<!-- trace:scenario id=g10.auction-auction.SC-ch5 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-23a - Each listing runs its own extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a card-backed bid inside the window

- **GIVEN** two listings with scheduled close 20:00 UTC, both in extended
  bidding with recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid on the first at 20:10 UTC
- **THEN** the first listing's recorded close is 20:40 UTC
- **AND** the second listing's recorded close is still 20:30 UTC

<!-- trace:scenario id=g10.auction-auction.SC-bz7 rev=1 -->
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

<!-- trace:scenario id=g10.auction-auction.SC-mrb rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-09 - An outbid authorization is released
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** a bidder has the active authorization for an open listing
- **WHEN** Grade10 accepts a higher valid bid from another bidder
- **THEN** Grade10 marks the outbid bidder's authorization for asynchronous release
- **AND** the outbid bidder no longer has an eligible top authorization for that listing
- **AND** Grade10 records the Stripe release outcome when it arrives

<!-- trace:scenario id=g10.auction-auction.SC-uha rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-10 - Concurrent bids keep the highest valid outcome
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** two bidders submit different valid bid amounts against the same current listing state
- **WHEN** Grade10 evaluates the requests concurrently
- **THEN** it records bid outcomes in one listing order
- **AND** the current bid is the highest valid accepted amount
- **AND** no lower bid can overwrite that current bid

<!-- trace:scenario id=g10.auction-auction.SC-8h7 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-11 - A delayed lower authorization cannot land
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** a bidder's card authorization is pending for a listing
- **AND** Grade10 has accepted a higher valid bid before Stripe confirms that pending authorization
- **WHEN** Stripe later confirms the lower authorization
- **THEN** Grade10 releases the lower authorization
- **AND** it does not record that lower bid as accepted or change the current bid

<!-- trace:scenario id=g10.auction-auction.SC-fna rev=1 -->
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

<!-- trace:scenario id=g10.auction-auction.SC-kg8 rev=1 -->
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

<!-- trace:scenario id=g10.auction-auction.SC-lk6 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-14 - Stripe configuration is incomplete
**Serves:** grade10-site-auction-auction-US-03 - Collector's card hold is released when they are outbid

- **GIVEN** an Auction operation requiring Stripe
- **WHEN** required Stripe configuration is absent or does not support the required authorization/capture action
- **THEN** Grade10 fails that operation explicitly naming the unavailable capability
- **AND** it does not silently create a bid or fixture-backed outcome

<!-- trace:scenario id=g10.auction-auction.SC-9io rev=1 -->
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

<!-- trace:scenario id=g10.auction-auction.SC-t3k rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-23 - The default bid path creates no authorization hold
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** bid-time authorization holds are disabled
- **WHEN** a collector submits a valid bid on an open listing
- **THEN** Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe
- **AND** it creates no bid-time authorization

### Requirement: The catalogue has one resting order

The Auction catalogue SHALL list the lots a collector can see by their external
lot status, in the order this table reads, as `grade10-site/auction/lot-status`
defines those statuses:

| External lot status | Ordered by |
| --- | --- |
| **Active** | Soonest close first |
| **Upcoming** | Soonest start first |
| **Ended** | Most recent close first |

Two lots one status orders alike SHALL be ordered by their lot record, so the
catalogue's order is total. The order SHALL be the one the catalogue answers
with, not one applied to the lots already read: reading the catalogue a page at
a time SHALL list the lots in the same order as reading it whole, and SHALL
list no lot twice and skip none.

A collector MAY ask for another order the catalogue can answer; it replaces the
resting order and is settled on the lot record the same way.

**All auctions** — every visible lot, including lots that also appear in
Featured, in that resting order. When Featured is present, All auctions SHALL
sit below it.

<!-- trace:scenario id=g10.auction-auction.SC-5vk rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-25 - Open lots lead the catalogue
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** lots of all three statuses, among them an Ended lot that closed
  before an Active lot closes
- **WHEN** a collector opens the Auction catalogue
- **THEN** every Active lot is listed before every Upcoming lot
- **AND** every Upcoming lot is listed before every Ended lot

<!-- trace:scenario id=g10.auction-auction.SC-c4r rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-26 - Each status has its own order
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** two Active lots closing an hour apart, two Upcoming lots starting a
  day apart, and two Ended lots closed a week apart
- **WHEN** a collector opens the Auction catalogue
- **THEN** the Active lots are listed soonest close first
- **AND** the Upcoming lots are listed soonest start first
- **AND** the Ended lots are listed most recent close first

<!-- trace:scenario id=g10.auction-auction.SC-icd rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-27 - A tie is settled the same way every read
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** two lots of one status that its order cannot tell apart
- **WHEN** the catalogue is read twice
- **THEN** the two lots are in the same order both times

<!-- trace:scenario id=g10.auction-auction.SC-zvy rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-28 - Paging does not change the order
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a catalogue holding more lots than one page lists
- **WHEN** it is read a page at a time to the end
- **THEN** the lots are in the same order as reading the catalogue whole
- **AND** no lot is listed twice and none is missing

#### Scenario: grade10-site-auction-auction-SC-40 - Featured lots still appear in All auctions below Featured
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** at least one complete Featured slide and that lot also among the
  visible catalogue lots
- **WHEN** a collector opens `/auction`
- **THEN** All auctions sits below Featured
- **AND** the featured lot appears again in All auctions in the resting order

### Requirement: Catalogue cards follow each lot live

Every catalogue card and Featured slide SHALL show each committed bid,
extension and close on its lot without a reload: the current bid, the
recorded close and the countdown, and on a catalogue card the bid count. A
Featured slide SHALL show no bid count. Its countdown SHALL run on the
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

### Requirement: Featured leads the catalogue when complete slides are set

`/auction` SHALL open with a Featured band when at least one complete slide is
available, and SHALL omit that band when none are. Featured SHALL be loaded
from its own public read, separate from the All auctions catalogue page.

**Complete slide** — a Featured slot that holds both an eligible lot and its
front page image, and whose lot is published Active or Upcoming at read time
**Order** — slides appear in the operator's slot order
**Absent** — with no complete slide, the page has no Featured band

#### Scenario: grade10-site-auction-auction-SC-43 - Featured appears when a complete slide is set
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** at least one complete Featured slot with a published Active or
  Upcoming lot and its front page image
- **WHEN** a collector opens `/auction`
- **THEN** the page leads with Featured in operator order


#### Scenario: grade10-site-auction-auction-SC-57 - Featured loads from its own public read
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** at least one complete Featured slide
- **WHEN** a collector opens `/auction`
- **THEN** Featured is answered by the dedicated Featured public read
- **AND** that answer includes each slide's front page image and the banner lot facts

#### Scenario: grade10-site-auction-auction-SC-30 - Featured is absent when no complete slide is set
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** every Featured slot is empty or incomplete, or every filled slot's
  lot is no longer published Active or Upcoming
- **WHEN** a collector opens `/auction`
- **THEN** the page shows no Featured band
- **AND** All auctions is the first catalogue section

### Requirement: Each Featured slide shows the curated lot facts

Each Featured slide SHALL show the facts in this table. Money amounts SHALL be
an integer count of minor units paired with an ISO 4217 currency code. The
slide MAY compose `FeaturedAuctionsBanner` with `ListingRollingMoneyDisplay`
and `ListingCountdownDisplay`.

| Fact | Shows |
| --- | --- |
| Front page image | The slot's uploaded image as banner background and lot slab; if it fails to load, the lot's first gallery image, else the stage default background |
| Title | The lot's title |
| Status | Active: LIVE BIDDING with a live status dot. Upcoming: UPCOMING with no live status dot |
| Countdown | Relative **Ends in** (Active) or **Opens in** (Upcoming) with the All auctions short remaining form; no Extended label; recorded close moves with the same freshness as the live current bid |
| Money | Active: served current bid; rolls when that amount **increases** after first paint. Upcoming: no money until the lot opens |
| Open lot | Active: Bid Now. Upcoming: View Auction. Either opens that lot's details page |

#### Scenario: grade10-site-auction-auction-SC-31 - A Featured slide shows front page image, title, status, countdown and bid
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Active lot with a served
  close and a current bid in minor units and ISO currency
- **WHEN** a collector views that slide on `/auction`
- **THEN** the slide shows the slot front page image as banner and slab, the lot title,
  LIVE BIDDING with a live status dot, relative Ends in from the served close,
  and the current bid as minor units with that currency code

#### Scenario: grade10-site-auction-auction-SC-32 - The current bid rolls when the served amount increases
**Serves:** grade10-site-auction-auction-US-10 - Collector sees a live Featured bid and clock

- **GIVEN** an Active Featured slide whose served current bid **increases** after
  first paint while the collector is on `/auction`
- **WHEN** the new amount is shown
- **THEN** the current bid updates with a rolling number to the new minor-unit
  amount and currency code

#### Scenario: grade10-site-auction-auction-SC-33 - An Upcoming Featured slide counts down to open
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** a complete Featured slide for a published Upcoming lot with a
  served open time
- **WHEN** a collector views that slide
- **THEN** the slide shows UPCOMING with no live status dot, View Auction, and
  Opens in from the served open
- **AND** the slide shows no starting bid and no money amount

### Requirement: Bid Now or View Auction opens the lot details page

An Active Featured slide SHALL offer Bid Now. An Upcoming Featured slide SHALL
offer View Auction. Activating either SHALL open that lot's details page.

#### Scenario: grade10-site-auction-auction-SC-34 - Bid Now opens an Active lot's details page
**Serves:** grade10-site-auction-auction-US-08 - Collector opens a Featured lot

- **GIVEN** an Active Featured slide
- **WHEN** the collector activates Bid Now
- **THEN** that lot's details page opens

#### Scenario: grade10-site-auction-auction-SC-58 - View Auction opens an Upcoming lot's details page
**Serves:** grade10-site-auction-auction-US-08 - Collector opens a Featured lot

- **GIVEN** an Upcoming Featured slide
- **WHEN** the collector activates View Auction
- **THEN** that lot's details page opens

### Requirement: Progress advances among two or three Featured slides

When Featured holds two or three complete slides, `/auction` SHALL show
progress that advances among them. On a small viewport the stage SHALL also
offer previous/next and horizontal swipe to advance among those slides. A
single complete slide SHALL NOT require multi-dot advance or stage previous/next.
Progress MAY use `CarouselProgress`.

#### Scenario: grade10-site-auction-auction-SC-35 - Progress advances among two or three slides
**Serves:** grade10-site-auction-auction-US-07 - Collector advances Featured slides

- **GIVEN** two or three complete Featured slides on `/auction`
- **WHEN** the collector advances with the progress control, or on a small
  viewport with stage previous/next or a horizontal swipe
- **THEN** each curated slide becomes visible in turn without leaving Featured

#### Scenario: grade10-site-auction-auction-SC-36 - One Featured slide needs no multi-dot advance
**Serves:** grade10-site-auction-auction-US-06 - Collector reads Featured on the catalogue

- **GIVEN** exactly one complete Featured slide
- **WHEN** a collector views Featured
- **THEN** that slide is shown
- **AND** multi-dot advance among slides is not required
- **AND** stage previous/next is not required

### Requirement: The catalogue layout is Featured then All auctions only

On `/auction` in this layout, the only catalogue sections SHALL be Featured
(when present) and All auctions. The page SHALL NOT show a Categories heading,
category tiles, or busy filter chrome.

#### Scenario: grade10-site-auction-auction-SC-37 - The quiet layout has no category section
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a collector opens `/auction` with or without Featured
- **WHEN** the page is shown
- **THEN** there is no Categories heading, no category tiles, and no busy
  filter chrome
- **AND** the only catalogue sections are Featured when present and All
  auctions


#### Scenario: grade10-site-auction-auction-SC-42 - The catalogue address stays /auction without a category query
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** a collector opens the Auction catalogue from the Auction nav
- **WHEN** the page is shown
- **THEN** the address is `/auction` with no category query

### Requirement: All auctions cards use the shared watch

Each All auctions card that may be watched SHALL offer the same watch as the
lot page and My Auctions. A closed lot's card SHALL show no watch. The card MAY
compose `AuctionCard` with `WatchButton`.

#### Scenario: grade10-site-auction-auction-SC-38 - A signed-in collector watches from an All auctions card
**Serves:** grade10-site-auction-auction-US-09 - Collector watches from an All auctions card

- **GIVEN** a signed-in collector reading an open lot on All auctions
- **WHEN** they toggle watch on that card
- **THEN** the lot is watched or unwatched the same way as on the lot page and
  My Auctions

#### Scenario: grade10-site-auction-auction-SC-39 - A closed lot's card shows no watch
**Serves:** grade10-site-auction-auction-US-09 - Collector watches from an All auctions card

- **GIVEN** an Ended lot on All auctions
- **WHEN** a collector reads its card
- **THEN** the card shows no watch control


#### Scenario: grade10-site-auction-auction-SC-41 - Featured remains when All auctions is empty
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** at least one complete Featured slide and no lots in All auctions
- **WHEN** a collector opens `/auction`
- **THEN** Featured is shown
- **AND** All auctions shows that there are no auctions

### Requirement: All auctions loads more as the collector scrolls

All auctions SHALL NOT show pagination controls. When more lots remain than the
list has shown, scrolling near the end of All auctions SHALL load the next
batch. While that batch is loading, All auctions SHALL append Boneyard skeleton
cards below the lots already shown and SHALL keep those lots visible. When no
further lots remain, no load trigger SHALL appear.

#### Scenario: grade10-site-auction-auction-SC-59 - More All auctions lots load on scroll
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** All auctions holds more lots than the first batch shows
- **WHEN** the collector scrolls near the end of the shown lots
- **THEN** the next batch of lots is loaded
- **AND** lots already shown stay visible
- **AND** the combined list stays in the catalogue resting order

#### Scenario: grade10-site-auction-auction-SC-60 - Loading more shows skeleton cards
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** All auctions is loading the next batch
- **WHEN** the collector reads the list
- **THEN** Boneyard skeleton cards appear below the lots already shown
- **AND** those lots remain visible above the skeletons

### Requirement: Upcoming catalogue cards withhold money until open

An Upcoming lot on Featured or on an All auctions card SHALL NOT show a starting
bid or other money amount. Money SHALL appear once the lot is Active (Featured
current bid; All auctions current bid).

#### Scenario: grade10-site-auction-auction-SC-61 - An Upcoming All auctions card shows no money
**Serves:** grade10-site-auction-auction-US-05 - Collector reads the catalogue in one order

- **GIVEN** an Upcoming lot on All auctions
- **WHEN** a collector reads its card
- **THEN** the card shows no starting bid and no money amount
- **AND** the card still shows Opens in from the served open
