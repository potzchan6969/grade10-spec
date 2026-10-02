# grade10-site/auction/auction Specification

## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a bid on their card on file within its scheduled window, closes each
listing at its effective close, and relays every committed change to the pages
open on it. A **listing** is the sole customer-facing term for one auctioned
card.

## Feature set

- Card on file
  - No card hold: a bid stands when it is accepted; nothing is held or charged
    on the card when a collector bids
  - Accepted or refused at once: a bid is judged under the lot's lock and
    answered in one reply
- Refused attempts
  - Not a bid: a refused attempt writes no bid, no standing and no history,
    and moves nobody's row
  - Said on the bid form: the refusal shows on the bid form, in words that
    name what the bidder can do
  - Operator-side record: each refusal is one structured operational log
    naming the bidder, the lot, the code, the amount and the floor
  - Lost answer: a bid whose answer is lost on the way back reads as placed
    when the bidder's standing holds it
- Erased leader
  - Runner-up takes the lead: the highest maximum left leads, priced from the
    maxima left and never above the price before the erasure
- Closing a due lot
  - Bids never settle: a bid refuses a lot past its effective close and never
    closes it

## MODIFIED Requirements

### Requirement: A bid at or above the identity bar needs a verified bidder

The storefront that forwards a bid SHALL compare the bid's amount to the
brand's bar before the auction hears of it. At or above the bar it SHALL
forward the bid only for a bidder whose standing is `verified` on the day of
the bid, and SHALL otherwise refuse the bid naming that a verified identity is
needed and where to verify, and the auction records nothing.
Below the bar a bid SHALL ask nothing about identity. On a brand that deploys
no identity store the bar SHALL not exist.

<!-- trace:scenario id=g10.auction-auction.SC-uhh rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-16 - An unverified bidder above the bar is held at the storefront
**Serves:** grade10-site-auction-auction-US-04 - Collector meets the identity bar on a high-value bid

- **GIVEN** a signed-in bidder whose standing is `unverified` or `expired`
- **WHEN** they place a bid of the bar or more
- **THEN** the bid is refused as needing a verified identity, and the
  auction records no bid
- **AND** the bid form says: Bids this high need a verified identity. Verify
  from your account, then bid again.

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

<!-- trace:scenario id=g10.auction-auction.SC-jsr rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-04 - A bid must meet the next increment
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with a current bid
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it records no bid for that attempt

<!-- trace:scenario id=g10.auction-auction.SC-5ao rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-05 - A bid outside the window is refused
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** a listing whose scheduled start has not arrived or whose effective close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

<!-- trace:scenario id=g10.auction-auction.SC-2js rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-06 - A late valid bid extends the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid at 20:10 UTC
- **THEN** the recorded close becomes 20:40 UTC
- **AND** a further price-moving bid accepted at 20:35 UTC moves it to 21:05 UTC

<!-- trace:scenario id=g10.auction-auction.SC-p70 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07 - An extension cap limits an otherwise eligible extension
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** a listing in extended bidding with an extension cap, whose recorded
  close is its scheduled close plus that cap
- **WHEN** Grade10 accepts a valid bid
- **THEN** it accepts the bid without changing the recorded close
- **AND** the listing closes at its scheduled close plus that cap

<!-- trace:scenario id=g10.auction-auction.SC-n8w rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07a - Window and duration may differ
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 300 seconds, and one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:05 UTC

<!-- trace:scenario id=g10.auction-auction.SC-z62 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-07b - Extension off does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing whose extension duration is zero and which has an
  accepted bid
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

<!-- trace:scenario id=g10.auction-auction.SC-dnt rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-08 - A bidder sees live bid facts
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card facts

<!-- trace:scenario id=g10.auction-auction.SC-a33 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-19 - A listing with no bid closes at its scheduled close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with no accepted bid and an extension duration of
  1800 seconds
- **WHEN** its scheduled close arrives
- **THEN** the listing closes at its scheduled close
- **AND** it does not enter extended bidding

<!-- trace:scenario id=g10.auction-auction.SC-cib rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-20 - One bid is enough to enter extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC, an extension
  duration of 1800 seconds, and exactly one accepted bid before 20:00 UTC
- **WHEN** 20:00 UTC arrives
- **THEN** the listing is in extended bidding with recorded close 20:30 UTC
- **AND** with no further bid it closes at 20:30 UTC

<!-- trace:scenario id=g10.auction-auction.SC-z5s rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-21 - A bid before the scheduled close does not move the close
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with scheduled close 20:00 UTC and an extension
  duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at 19:59 UTC
- **THEN** the recorded close is still 20:00 UTC

<!-- trace:scenario id=g10.auction-auction.SC-h4d rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-22 - A bid at the scheduled close counts toward entry
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing with no accepted bid, scheduled close 20:00:00 UTC,
  and an extension duration of 1800 seconds
- **WHEN** Grade10 accepts a valid bid at exactly 20:00:00 UTC
- **THEN** the listing is in extended bidding with recorded close 20:30:00 UTC

<!-- trace:scenario id=g10.auction-auction.SC-ch5 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-23a - Each listing runs its own extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** two listings with scheduled close 20:00 UTC, both in extended
  bidding with recorded close 20:30 UTC
- **WHEN** Grade10 accepts a price-moving bid on the first at 20:10 UTC
- **THEN** the first listing's recorded close is 20:40 UTC
- **AND** the second listing's recorded close is still 20:30 UTC

<!-- trace:scenario id=g10.auction-auction.SC-bz7 rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-24 - A new bidder may bid during extended bidding
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

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
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

- **GIVEN** an open listing whose extension duration is zero, with scheduled
  close 20:00:00 UTC and a current bid of 100000 HKD minor units
- **WHEN** a valid bid of 110000 HKD minor units arrives at exactly
  20:00:00 UTC
- **THEN** Grade10 accepts it
- **AND** the listing closes at 20:00:00 UTC with that bid winning

#### Scenario: grade10-site-auction-auction-SC-84 - A cap of zero turns extended bidding off
**Serves:** grade10-site-auction-auction-US-02 - Collector places a bid inside the window

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

### Requirement: A due lot is settled at its close

Grade10 SHALL settle a listing when a deadline passes: open bidding at its
start, enter extended bidding at its scheduled close, or close it at its
effective close, whichever is due. Whoever reaches a due listing first
settles it:

1. The listing's own timer, at the deadline
2. Any read that finds the listing past its effective close, after it answers
   and without delaying the answer
3. The five-minute sweep, for a listing nothing else reached

Settling a listing twice SHALL change nothing the first did not. A bid that
finds a listing past its effective close SHALL be refused and SHALL NOT close the listing; its answer SHALL NOT depend on
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
- **THEN** it is closed once, with one outcome and one winner order when it
  sold

#### Scenario: grade10-site-auction-auction-SC-74 - A bid past the close does not close the lot
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** a listing past its effective close whose close is not yet recorded
- **WHEN** a bidder submits a valid bid
- **THEN** Grade10 refuses the bid and creates no accepted bid
- **AND** the refusal is answered even when closing the listing fails

## RENAMED Requirements

- FROM: `### Requirement: A bid counts when its payment confirms`
- TO: `### Requirement: A bid counts when it is accepted`

### Requirement: A bid counts when it is accepted

Grade10 SHALL judge each bid in one step under the listing's lock - every
refusal rule, then the bid accepted or refused - and answer the bidder with
that outcome in the same reply. An accepted bid SHALL count from that moment,
judged against the listing's window at that moment. It stands on the card
linked to the bidder's account, under `grade10-site/auction/bid-payment-method`:
nothing SHALL be held, authorized or charged on the card when a collector bids,
and no bid SHALL wait on a payment provider. No bid SHALL be left between
accepted and refused.

Bids that arrive together SHALL be judged one at a time in one listing order,
each against the state the one before it left.

| Arrives | Outcome |
| --- | --- |
| Before the effective close | Judged at once; if accepted, it counts and may move the price and the close |
| At or after the effective close | Refused, with no grace |

<!-- trace:scenario id=g10.auction-auction.SC-t3k rev=2 -->
#### Scenario: grade10-site-auction-auction-SC-23 - A bid holds nothing on the card
**Serves:** grade10-site-auction-auction-US-02 - a collector with a linked card bids on an open lot

- **WHEN** a collector with a linked card submits a valid bid on an open listing
- **THEN** Grade10 accepts the bid under the listing's bid rules in the same
  answer
- **AND** nothing is held, authorized or charged on the card, and no payment
  provider is asked

<!-- trace:scenario id=g10.auction-auction.SC-uha rev=1 -->
#### Scenario: grade10-site-auction-auction-SC-10 - Concurrent bids keep the highest valid outcome
**Serves:** grade10-site-auction-auction-US-02 - two collectors bid on one lot at the same moment

- **GIVEN** two bidders submit different valid bid amounts against the same current listing state
- **WHEN** Grade10 evaluates the requests concurrently
- **THEN** it records bid outcomes in one listing order
- **AND** the current bid is the highest valid accepted amount
- **AND** no lower bid can overwrite that current bid

#### Scenario: grade10-site-auction-auction-SC-86 - A bid in the last second counts when accepted
**Serves:** grade10-site-auction-auction-US-11 - Bidder is held to the close with everyone else

- **GIVEN** a listing in extended bidding with an extension duration of 1800
  seconds and recorded close 20:30:00 UTC
- **WHEN** a valid bid that moves the price arrives at 20:29:59 UTC
- **THEN** Grade10 accepts it, and it counts in that answer
- **AND** the recorded close becomes 20:59:59 UTC

## REMOVED Requirements

### Requirement: Card-backed bids have one releasable authorization per bidder and listing

**Reason:** No bid takes a card authorization. A bid stands on the card on file
when it is accepted, and only the winner pays, through hosted Checkout, so
being outbid or losing has nothing to release.

**Migration:** `grade10-site-auction-auction-SC-10` moves to "A bid counts
when it is accepted", serving `grade10-site-auction-auction-US-02` since
`grade10-site-auction-auction-US-03` retires. `grade10-site-auction-auction-SC-09`,
`grade10-site-auction-auction-SC-11` and `grade10-site-auction-auction-SC-12`
retire.

### Requirement: Stripe configuration and delayed authorization facts are handled explicitly

**Reason:** Nothing is authorized or captured at bid time, so there is no
authorization outcome or webhook to reconcile. Card linking is
`grade10-site/auction/bid-panel-enrollment`'s, and the winner's payment is
`grade10-site/auction/winner-order`'s.

**Migration:** `grade10-site-auction-auction-SC-14` and
`grade10-site-auction-auction-SC-15` retire.

### Requirement: A standard bid does not require a bid-time authorization

**Reason:** No switch turns bid-time holds on, so the rule holds for every bid
and has no other path to set apart.

**Migration:** `grade10-site-auction-auction-SC-23` moves to "A bid counts when
it is accepted".

## ADDED Requirements

### Requirement: A refused bid places nothing

A bid Grade10 refuses SHALL place nothing. It SHALL write no bid, no standing,
no bidding-history entry and no My Auctions row, and SHALL move nothing: not
the price, the leader, the close, the bid count, any bidder's maximum or row,
nor the listing's version, so no open page is sent an update. The bidder's
record SHALL never show a refused attempt.

The bid form SHALL say why under the bid action, in the words below, and
nowhere else: never in a toast, and never in the words the server sent.

| Refused when | Code | The bid form says |
| --- | --- | --- |
| The amount is not a valid count of minor units | `INVALID_AMOUNT` | Enter a valid amount. |
| At or above the identity bar without a verified identity, at the storefront | `IDENTITY_REQUIRED` | Bids this high need a verified identity. Verify from your account, then bid again. |
| Below the minimum next bid | `AMOUNT_TOO_LOW` | Minimum bid is {amount}. with the minimum next bid |
| Above the currency's ceiling | `AMOUNT_TOO_HIGH` | Maximum bid is {amount}. with the ceiling |
| Not above the bidder's own maximum on the listing | `MAXIMUM_NOT_RAISED` | Your new maximum must be higher than your current one. |
| No linked card, or the bidder was never registered with one | `PAYMENT_METHOD_REQUIRED`, `NOT_REGISTERED` | Link a card to bid. |
| Another card after the first accepted bid on the listing | `PAYMENT_METHOD_REFUSED` | This listing's card is locked after the first accepted bid. |
| Bidding is suspended on the account | `SUSPENDED` | Bidding is suspended on this account. Contact Us to resolve it. |
| The account is banned from bidding | `BANNED` | This account cannot bid. |
| Before the start or at or after the effective close, an unknown listing, another currency, an erased bidder, or a refusal with no row above | `NOT_BIDDABLE`, `LISTING_NOT_FOUND`, `CURRENCY_MISMATCH`, `BIDDER_DELETED` | Your bid did not go through. |

Where several refusals apply, the first in this order answers: invalid amount,
unknown listing, not biddable, not registered, suspended, banned, erased
bidder, another currency, above the ceiling, maximum not raised, below the
minimum, no card, another card. The storefront answers the identity bar before
the auction hears of the bid.

Each refusal the auction service answers SHALL be one structured operational
log entry at the auction service, naming the bidder, the listing, the code, the
maximum sent and, where the refusal names one, the floor or the ceiling: the
minimum next bid or the currency's highest maximum. The entry is for operators and SHALL NOT reach the bidder's record.

#### Scenario: grade10-site-auction-auction-SC-89 - A refused first bid leaves no trace
**Serves:** grade10-site-auction-auction-US-14 - a collector's first bid on a lot is refused because the price moved

- **GIVEN** an open `HKD` listing at a current bid of 120000 HKD minor units,
  whose minimum next bid is 124000 HKD minor units, and a collector with a
  linked card and no bid on it
- **WHEN** they submit a maximum of 122000 HKD minor units
- **THEN** the bid form says Minimum bid is {amount}. with 124000 HKD minor
  units
- **AND** the listing is on neither their My Auctions nor their bidding
  history
- **AND** the current bid, the leader and the bid count are unchanged

#### Scenario: grade10-site-auction-auction-SC-90 - An Outbid bidder's refused raise leaves their row where it was
**Serves:** grade10-site-auction-auction-US-14 - an Outbid bidder's raise is refused because the price moved

- **GIVEN** bidder B, Outbid with a maximum of 110000 HKD minor units on an
  open `HKD` listing whose minimum next bid is 124000 HKD minor units
- **WHEN** B submits a maximum of 122000 HKD minor units
- **THEN** the bid form says Minimum bid is {amount}. with 124000 HKD minor
  units
- **AND** B's My Auctions row still reads Outbid, in the same place
- **AND** B's maximum stays 110000 HKD minor units and their bidding history
  gains no entry

#### Scenario: grade10-site-auction-auction-SC-91 - Each refusal reads in its own words
**Serves:** grade10-site-auction-auction-US-14 - the bidder reads why a bid was refused

- **WHEN** a bid is refused for any reason the refusal table names
- **THEN** the bid form shows that row's words under the bid action
- **AND** no toast opens

#### Scenario: grade10-site-auction-auction-SC-92 - The server's words never reach the bid form
**Serves:** grade10-site-auction-auction-US-14 - a refusal the bid form has no words of its own for

- **WHEN** the auction refuses a bid with a code the table gives no words of
  its own, or with a message of its own
- **THEN** the bid form says Your bid did not go through.
- **AND** none of the server's message shows

#### Scenario: grade10-site-auction-auction-SC-93 - A refusal is kept for operators only
**Serves:** grade10-site-auction-auction-US-14 - an operator reads a refusal the bidder's record never shows

- **GIVEN** the refused first bid of `grade10-site-auction-auction-SC-89`
- **WHEN** the auction service answers the refusal
- **THEN** it writes one operational log entry naming the bidder, the listing,
  `AMOUNT_TOO_LOW`, 122000 HKD minor units sent and a floor of 124000 HKD minor
  units
- **AND** nothing of the refusal reaches the bidder's record, bidding history
  or My Auctions

### Requirement: A bid whose answer is lost reads as placed when the bidder's standing holds it

When the answer to a bid never reaches the bid form, the form SHALL read the
bidder's own standing on that listing before it says anything:

| The standing read | The bid form |
| --- | --- |
| Holds the maximum just sent | Reads the bid as placed: no error, and the panel, standing and history read again |
| Holds another maximum or none, or the read fails | Says Could not place this bid. under the bid action, and logs the cause |

#### Scenario: grade10-site-auction-auction-SC-94 - A committed bid behind a lost answer reads as placed
**Serves:** grade10-site-auction-auction-US-02 - a collector's bid commits but its answer is lost on the way back

- **GIVEN** a collector submits a maximum of 130000 HKD minor units on an open
  `HKD` listing, and the auction accepts it
- **WHEN** the answer is lost on the way back to the bid form
- **THEN** the bid form shows no error
- **AND** the panel shows their maximum of 130000 HKD minor units and their
  standing

#### Scenario: grade10-site-auction-auction-SC-95 - A lost answer with no bid behind it says so
**Serves:** grade10-site-auction-auction-US-02 - a collector's bid gets no answer and placed nothing

- **GIVEN** a collector submits a maximum of 130000 HKD minor units on an open
  `HKD` listing
- **WHEN** the answer is lost, and the standing read holds another maximum or
  none, or fails
- **THEN** the bid form says Could not place this bid. under the bid action
- **AND** the cause is logged

### Requirement: Erasing a bidder re-stands each lot on the maxima left

When a bidder's account is erased under `shared/auth/users`, Grade10 SHALL
withdraw every standing maximum they hold on a listing whose close is not yet
recorded, under that listing's lock, and re-stand the listing from the maxima
left. The withdrawn bids read as canceled.

1. The highest maximum left leads; between equal maxima, the earlier accepted
   one leads.
2. The price is the lowest of the price before the erasure, the new leader's
   maximum, and the next maximum left plus the increment
   `grade10-site/auction/bid-increments` selects for that maximum.
3. With one maximum left, the price is the lower of the price before and the
   opening price.
4. With no maximum left, the listing has no leader and no current bid, and the
   next bid must reach the opening price.
5. The price SHALL never rise above the price before the erasure. When neither
   the leader nor the price changes, nothing beyond the withdrawal is written.
6. Otherwise Grade10 records one bid placed on the new leader's behalf at the
   new price, and the new leader reads as Leading. The recorded close does not
   move.

Worked example. A `USD` listing opening at 10000 USD minor units, every amount
in USD minor units; the increment at each next maximum here is 500.

| Maxima before | Price before | Erased | Leader after | Price after |
| --- | ---: | --- | --- | ---: |
| A 20000, B 15000, C 12000 | 15500 | A | B | 12500 |
| A 20000, B 15000, C 12000 | 15500 | B | A | 12500 |
| A 50000, B 19800, C 10000 | 20000 | C | A | 20000, unchanged |
| A 20000, B 15000, C 11000 | 15500 | C | A | 15500, unchanged |
| A 20000, B 15000 | 15500 | A | B | 10000 |
| A alone | 10000 | A | None | None |

In the third row the next maximum plus one increment is 20300, above the price
before, so the price stays.

#### Scenario: grade10-site-auction-auction-SC-96 - The runner-up takes the lead from the maxima left
**Serves:** grade10-site-auction-auction-US-13 - the leader's account is erased and the runner-up's maximum is highest left

- **GIVEN** an open `USD` listing where A leads with a maximum of 20000, B holds
  15000 and C holds 12000, at a price of 15500, all in USD minor units
- **WHEN** A's account is erased
- **THEN** A's bids on the listing read as canceled
- **AND** B leads at 12500 USD minor units with a maximum of 15000 USD minor
  units
- **AND** the public bid history records one bid placed on B's behalf at 12500
  USD minor units

#### Scenario: grade10-site-auction-auction-SC-97 - Erasing the bidder who set the price re-prices the leader
**Serves:** grade10-site-auction-auction-US-13 - the bidder whose maximum set the price is erased

- **GIVEN** an open `USD` listing where A leads with a maximum of 20000, B holds
  15000 and C holds 12000, at a price of 15500, all in USD minor units
- **WHEN** B's account is erased
- **THEN** A still leads, at 12500 USD minor units

#### Scenario: grade10-site-auction-auction-SC-98 - A leader whose maximum outgrew the price keeps it
**Serves:** grade10-site-auction-auction-US-13 - the erasure would price the lot above where it stood

- **GIVEN** an open `USD` listing where A leads at 20000 USD minor units, after
  raising their maximum from 20000 to 50000, with B at 19800 and C at 10000
- **WHEN** C's account is erased
- **THEN** A still leads at 20000 USD minor units
- **AND** nothing is written beyond C's withdrawn bids

#### Scenario: grade10-site-auction-auction-SC-99 - Erasing a bidder who set nothing moves nothing
**Serves:** grade10-site-auction-auction-US-13 - a bidder below the runner-up is erased

- **GIVEN** an open `USD` listing where A leads with a maximum of 20000, B holds
  15000 and C holds 11000, at a price of 15500, all in USD minor units
- **WHEN** C's account is erased
- **THEN** A still leads at 15500 USD minor units, on the same bid

#### Scenario: grade10-site-auction-auction-SC-100 - One maximum left stands at the opening price
**Serves:** grade10-site-auction-auction-US-13 - the leader is erased and one bidder is left

- **GIVEN** an open `USD` listing opening at 10000 USD minor units, where A
  leads with a maximum of 20000 and B holds 15000, at a price of 15500, all in
  USD minor units
- **WHEN** A's account is erased
- **THEN** B leads at 10000 USD minor units

#### Scenario: grade10-site-auction-auction-SC-101 - Erasing the only bidder leaves no leader
**Serves:** grade10-site-auction-auction-US-13 - the lot's only bidder is erased

- **GIVEN** an open `USD` listing opening at 10000 USD minor units whose only
  bidder A leads at 10000 USD minor units
- **WHEN** A's account is erased
- **THEN** the listing has no leader and no current bid
- **AND** the next bid must reach 10000 USD minor units

#### Scenario: grade10-site-auction-auction-SC-102 - A re-stood lot closes on its new leader
**Serves:** grade10-site-auction-auction-US-13 - a lot re-stood after an erasure reaches its close

- **GIVEN** the listing of `grade10-site-auction-auction-SC-97`, with extended
  bidding off, re-stood with A leading at 12500 USD minor units
- **WHEN** its scheduled close passes
- **THEN** it closes sold to A at 12500 USD minor units
