# grade10-admin/auction/internal-bid Specification

## Purpose

Lets an auction admin protect a lot's final price with a house maximum that
collectors cannot see, committed at a time the admin chooses and then bid like
any collector's maximum - [Auction Management · Listings](/p/grade10-admin/auction/management#listings).

## Feature set

- Setting an internal bid
  - Amount and time: one house maximum per listing, with a required commit time from the start to the scheduled close
  - Before its time: amount and time change or are removed freely, and the house is not in the bidding
- Committing at the set time
  - Commit: at its time Grade10 commits the amount as a maximum, resolved once like any commitment
  - Too late: an amount already short of the minimum next bid is not placed, and the admin sees that
- Changing a committed internal bid
  - Raise: any time the lot takes a bid, as a new commitment
  - Lower: only when the leader and the current bid stay the same, never below a bid already placed for the house
  - Fixed time: the commit time no longer changes
- Bought in
  - House win: a lot the house leads at the close closes Bought in, with no order, stock released and Relist offered
- Access
  - Secret floor: only `auction:reserve` sets, reads or learns of an internal bid, and the audit trail records that one was set, never its amount

## ADDED Requirements

### Requirement: An admin sets an internal bid on a listing

An admin holding `auction:reserve` SHALL:

1. Open a listing that is `draft`, `created` or `published`, has a scheduled
   start and a scheduled close, and has not reached its scheduled close.
2. Enter the internal bid: an amount and the time Grade10 commits it.
3. Save. Grade10 accepts or refuses the save in the same answer.
4. Read the internal bid back on the listing, with its state.

A listing SHALL carry at most one internal bid. Saving on a listing that has
one changes it and SHALL NOT add a second.

| Field | Rule |
| --- | --- |
| Amount | Integer minor units in the listing's currency, above 0 and at most the ceiling `grade10-site/auction/bid-increments` sets for that currency |
| Time | Required. At or after the listing's scheduled start, at or before its scheduled close, and later than the moment of the save |

Grade10 SHALL refuse a save that breaks a rule in the table, naming the rule,
and SHALL store nothing. An internal bid SHALL change no listing fact a
collector reads until Grade10 commits it, per
`grade10-site/auction/auto-bidding`.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-dq6 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-01 - An admin sets an internal bid on a published listing
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin protects a lot before it opens

- **GIVEN** a published `HKD` listing starting 2026-11-02T08:00:00Z, closing
  2026-11-02T20:00:00Z, with a starting price of 20000 HKD minor units and no
  bids
- **AND** an admin holding `auction:reserve` at 2026-11-01T09:00:00Z
- **WHEN** they save an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z
- **THEN** Grade10 accepts it and the listing shows the internal bid as
  Scheduled, with that amount and time
- **AND** the listing's public facts show no bid and a starting price of
  20000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-mxk rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-02 - A time outside the bidding window is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin picks a time the lot cannot reach

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T20:00:01Z
- **THEN** Grade10 refuses it, naming the bidding window
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-tbo rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-03 - A time already passed is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin sets a time on a lot already open

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`, at
  2026-11-02T12:00:00Z
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T11:00:00Z
- **THEN** Grade10 refuses it, naming the time
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-5x7 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-04 - An amount above the ceiling is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin enters an amount the currency cannot take

- **GIVEN** a published `USD` listing whose scheduled close has not passed
- **WHEN** the admin saves an internal bid of 1000000001 USD minor units
- **THEN** Grade10 refuses it, naming the ceiling of 1000000000 USD minor
  units
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-i7f rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-05 - A second save changes the one internal bid
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin saves again on a protected lot

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01` with
  its Scheduled internal bid
- **WHEN** the admin saves an internal bid of 60000 HKD minor units at
  2026-11-02T19:00:00Z
- **THEN** the listing carries one internal bid, of 60000 HKD minor units at
  2026-11-02T19:00:00Z

### Requirement: Internal bid states

An internal bid SHALL be in one of these states, and the admin SHALL see its
state on the listing beside its amount and time.

| State | Meaning | Amount | Time | Removable |
| --- | --- | --- | --- | --- |
| Scheduled | Its time has not arrived; the house is not in the bidding | Changes freely | Changes freely | Yes |
| Placed | Grade10 committed it at its time | Raised, or lowered under "An admin changes a committed internal bid" | Fixed | No |
| Not placed | At its time it was short of the minimum next bid, and nothing was placed | Raised, which places it at once; or lowered | Fixed | No |

Grade10 SHALL move an internal bid from Scheduled to Placed or Not placed at
its time, whether or not anyone has the listing open, per
`grade10-site/auction/auto-bidding`. A raise of a Not placed internal bid
that Grade10 accepts SHALL move it to Placed.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-jtj rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-06 - Before its time an admin changes the amount and the time
**Serves:** grade10-admin-auction-internal-bid-US-02 - the admin reacts before the house has bid

- **GIVEN** a published `HKD` listing open since 2026-11-02T08:00:00Z and
  closing 2026-11-02T20:00:00Z, with a Scheduled internal bid of 50000 HKD
  minor units at 2026-11-02T18:00:00Z, at 2026-11-02T12:00:00Z
- **WHEN** the admin changes it to 40000 HKD minor units at
  2026-11-02T17:00:00Z
- **THEN** Grade10 accepts it and the internal bid reads Scheduled at 40000
  HKD minor units and 2026-11-02T17:00:00Z
- **AND** the listing's public facts are unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-1c4 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-07 - Before its time an admin removes the internal bid
**Serves:** grade10-admin-auction-internal-bid-US-02 - the admin decides the lot needs no floor

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-06` before
  its internal bid's time
- **WHEN** the admin removes the internal bid
- **THEN** the listing has no internal bid
- **AND** when 2026-11-02T18:00:00Z passes, Grade10 places no bid for the
  house on the listing

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-glg rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-08 - At its time the internal bid reads Placed
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin sees the house entered the bidding

- **GIVEN** a published `HKD` listing where a collector leads at 20000 HKD
  minor units with a maximum of 30000, and a Scheduled internal bid of 50000
  HKD minor units at 2026-11-02T18:00:00Z
- **WHEN** 2026-11-02T18:00:00Z passes with no page open on the listing
- **THEN** the admin sees the internal bid as Placed
- **AND** the listing's current bid is 31000 HKD minor units

### Requirement: An admin learns an internal bid came too late

When an internal bid is Not placed, the admin SHALL see Not placed on the
listing, with the amount, the time and the listing's current minimum next
bid. Grade10 SHALL NOT tell a collector, in a listing fact or a letter, that
an internal bid was not placed. Until the listing's effective close the admin
SHALL be able to raise it; a raise at or above the minimum next bid places it
at once, and a raise below it is refused, naming the minimum next bid, and
leaves it Not placed.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-11v rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-09 - An internal bid short at its time is not placed
**Serves:** grade10-admin-auction-internal-bid-US-05 - the price had already passed the house's amount

- **GIVEN** a published `HKD` listing where a collector leads at 52000 HKD
  minor units, so the minimum next bid is 53000, and a Scheduled internal bid
  of 50000 HKD minor units at 2026-11-02T18:00:00Z
- **WHEN** 2026-11-02T18:00:00Z passes
- **THEN** the admin sees the internal bid as Not placed, with 50000 HKD minor
  units, 2026-11-02T18:00:00Z and a minimum next bid of 53000 HKD minor units
- **AND** the listing's current bid, leader and bid count are unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-quv rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-10 - Raising a not-placed internal bid places it at once
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin answers a lot running hot

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09`, where
  the leader's maximum is 60000 HKD minor units and the internal bid is Not
  placed
- **WHEN** the admin raises the internal bid to 70000 HKD minor units before
  the listing's effective close
- **THEN** Grade10 accepts it and the internal bid reads Placed
- **AND** the house leads the listing at 61000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-qom rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-11 - A raise still short is refused
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin's raise does not reach the next bid

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09` with its
  Not placed internal bid
- **WHEN** the admin raises the internal bid to 52500 HKD minor units
- **THEN** Grade10 refuses it, naming 53000 HKD minor units as the minimum
  next bid
- **AND** the internal bid stays Not placed at 50000 HKD minor units

### Requirement: An admin changes a committed internal bid

Once an internal bid's time has arrived, its time SHALL NOT change and it
SHALL NOT be removed. Until the listing's effective close, the admin SHALL be
able to:

1. Raise the amount at any time the listing takes a bid. Grade10 SHALL treat
   the raise as a new commitment of the house maximum, per
   `grade10-site/auction/auto-bidding`.
2. Lower the amount. Grade10 SHALL accept a lower amount only when the
   listing's leader and current bid stay the same, and SHALL refuse one below
   any bid already placed for the house on the listing, per
   `grade10-site/auction/auto-bidding`.

Grade10 SHALL refuse every other change, naming the reason, and leave the
internal bid as it was:

| Refused when | Refusal |
| --- | --- |
| The time is changed after it has arrived | Time is fixed |
| The internal bid is removed after its time has arrived | Time is fixed |
| A lower amount would move the leader or the current bid | Moves the lead or the current bid |
| A lower amount is below a bid already placed for the house | Below the house's bid, naming that bid |
| The listing has passed its effective close | Not taking bids |

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-xfi rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-12 - The time is fixed once it has arrived
**Serves:** grade10-admin-auction-internal-bid-US-03 - the admin returns to a committed internal bid

- **GIVEN** a listing with a Placed internal bid committed at
  2026-11-02T18:00:00Z
- **WHEN** the admin changes its time to 2026-11-02T19:00:00Z, or removes it
- **THEN** Grade10 refuses each, saying the time is fixed
- **AND** the internal bid still reads Placed at its amount and
  2026-11-02T18:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-lqc rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-13 - An admin raises a placed internal bid
**Serves:** grade10-admin-auction-internal-bid-US-03 - the lot is running hotter than expected

- **GIVEN** an `HKD` listing where a collector leads at 51000 HKD minor units
  with a maximum of 60000, over a Placed internal bid of 50000
- **WHEN** the admin raises the internal bid to 80000 HKD minor units
- **THEN** Grade10 accepts it and the house leads at 61000 HKD minor units
- **AND** the internal bid reads Placed at 80000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-spg rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-14 - An admin lowers a placed internal bid that moves nothing
**Serves:** grade10-admin-auction-internal-bid-US-04 - the admin loosens the floor without moving the lot

- **GIVEN** an `HKD` listing where collector C leads at 41000 HKD minor units
  with a maximum of 60000 over collector A's 40000, and a Placed internal bid
  of 25000 whose only house bid was placed at 20000, all in HKD minor units
- **WHEN** the admin lowers the internal bid to 21000 HKD minor units
- **THEN** Grade10 accepts it and the internal bid reads 21000 HKD minor units
- **AND** C still leads at 41000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-eng rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-15 - A lower that moves the current bid is refused
**Serves:** grade10-admin-auction-internal-bid-US-04 - the lower would change what collectors see

- **GIVEN** an `HKD` listing where collector A leads at 26000 HKD minor units
  with a maximum of 40000, priced by a Placed internal bid of 25000
- **WHEN** the admin lowers the internal bid to 24000 HKD minor units
- **THEN** Grade10 refuses it, saying it moves the lead or the current bid
- **AND** A still leads at 26000 HKD minor units and the internal bid reads
  25000

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-u2x rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-16 - A lower below the house's own bid is refused
**Serves:** grade10-admin-auction-internal-bid-US-04 - the lower would go under a bid the house already placed

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-14`
- **WHEN** the admin lowers the internal bid to 19000 HKD minor units
- **THEN** Grade10 refuses it, naming the house's bid of 20000 HKD minor units
- **AND** the internal bid reads 25000 HKD minor units

### Requirement: An admin reads a lot the house bought in

When a listing closes with the house leading, the admin SHALL see it Bought
in, per `grade10-admin/auction/listing`, with the internal bid Placed at its
last amount. The listing SHALL have no order to open, its stock SHALL be
released as at an Unsold close, and it SHALL offer Relist, per
`grade10-admin/auction/listing`. The close itself is
`grade10-site/auction/auction`'s.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-hat rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-17 - A house win reads Bought in with no order
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin tells a bought-in lot from a sale

- **GIVEN** an `HKD` listing where the house leads at 31000 HKD minor units
  with a Placed internal bid of 50000
- **WHEN** the listing closes and an admin opens it
- **THEN** it reads Bought in, with the internal bid Placed at 50000 HKD minor
  units
- **AND** no order exists for it, and its stock is released

### Requirement: Only secret-floor access reaches an internal bid

Only an operator holding `auction:reserve` SHALL set, change, remove or read
an internal bid, or learn from Grade10 that a listing has one before it
closes. For any other operator:

- The listing editor SHALL show no internal bid section and nothing that
  says a listing has, had or may have one.
- Grade10 SHALL refuse a set, change, remove or read of an internal bid and
  change nothing.

The audit trail SHALL record each set, change and removal with the operator,
the listing and the time it was made, and SHALL NOT record the internal bid's
amount or its time. `auction:reserve` SHALL read, in the roles list, as the
grant that sets and reads a listing's internal bid.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-n08 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-18 - Staff see no internal bid
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator without secret-floor access opens a protected lot

- **GIVEN** a published listing with a Scheduled internal bid
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they open the listing in the editor
- **THEN** the editor shows no internal bid section
- **AND** nothing on the listing says it has an internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-w8v rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-19 - Staff cannot set or read one on the server
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator without the grant calls the server directly

- **GIVEN** a published listing with a Scheduled internal bid, and an operator
  whose roles are exactly `staff`
- **WHEN** they call Grade10 to read it, and to save one of 90000 minor units
- **THEN** Grade10 refuses both
- **AND** the internal bid is unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-53a rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-20 - The audit trail records a set without its amount
**Serves:** grade10-admin-auction-internal-bid-US-07 - an auditor reads who protected a lot

- **GIVEN** an admin who saved an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z on a listing
- **WHEN** an operator holding audit access reads the audit trail for that
  listing
- **THEN** it shows the admin set an internal bid on the listing, and when
- **AND** it shows neither 50000 nor 2026-11-02T18:00:00Z

### Requirement: Call-off and Relist drop the internal bid

Calling a listing off SHALL drop its internal bid with the listing: Grade10
SHALL NOT commit it afterwards, and a bid already placed for the house SHALL
be called off with every other bid, per `grade10-admin/auction/listing`. A
draft opened by Relist SHALL carry no internal bid, per
`grade10-admin/auction/listing`.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-p8p rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-21 - A called-off listing never commits its internal bid
**Serves:** Setting an internal bid - an operator calls off a protected lot before its time

- **GIVEN** a published listing with a Scheduled internal bid at
  2026-11-02T18:00:00Z
- **WHEN** an operator calls the listing off at 2026-11-02T12:00:00Z
- **AND** 2026-11-02T18:00:00Z passes
- **THEN** Grade10 places no bid for the house on the listing
