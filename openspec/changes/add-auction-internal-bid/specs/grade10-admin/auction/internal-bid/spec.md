# grade10-admin/auction/internal-bid Specification

## Purpose

Lets an auction admin protect a lot's final price with a house maximum that
collectors cannot see, committed at a time the admin chooses and then bid like
any collector's maximum - [Internal Bid](/p/grade10-admin/auction/internal-bid).

## Feature set

- Setting an internal bid
  - Amount and time: one house maximum per Created or Published listing, with a required commit time from the start to the scheduled close
  - Internal bidder: a required pick of one active internal bidder profile per listing, changeable only before its time
  - Save limits: an amount above the ceiling or below the starting price, or a commit time already past, is refused at Save
  - Listing edits: a Created listing's window, starting-price or currency change that leaves the internal bid outside its limits clears it, and the admin sees that
  - Unpublished at its time: an internal bid whose time comes while the listing is still Created is Not placed
  - Before its time: amount and time change or are removed freely, and the house is not in the bidding
- Committing at the set time
  - Commit: at its time Grade10 commits the amount as a maximum, resolved once like any commitment
  - Too late: an amount already short of the minimum next bid is not placed, and the admin sees that
- Changing a committed internal bid
  - Raise: any time the lot takes a bid, as a new commitment
  - Lower: only when the leader and the current bid stay the same, never below a bid already placed for the house
  - Fixed time: the commit time no longer changes
- Internal bidder win
  - Order: a lot an internal bidder leads at the close opens its order and invoice for that internal bidder, flagged internal, with the internal bidder's billing address
  - By hand: an operator sends the invoice, lets it expire and cancels the order, as for any unpaid order
  - Flag: a reserve holder reads the listing flagged as won by its internal bidder; other operators read the buyer as House
  - No letters: no order letter goes to an internal bidder
- Internal bidders
  - Profiles: internal bidder profiles, each a name, a unique email label and a billing address, kept in auction admin with no site account behind them
  - Rename and retire: a label is fixed once the profile has bid; a profile is retired only when no Scheduled internal bid, and no Not placed internal bid on a listing before its effective close, uses it, and keeps its history
- Access
  - Secret floor: only `auction:reserve` sets or reads an internal bid; reserve holders see which internal bidder bid; other operators see the house's bids and orders labelled House; the audit trail never records the amount or the time

## ADDED Requirements

### Requirement: An admin sets an internal bid on a listing

An admin holding `auction:reserve` SHALL:

1. Open a listing that is `created` or `published` and has not reached its
   scheduled close.
2. Enter the internal bid: an amount, the internal bidder it bids as, and
   the time Grade10 commits it.
3. Save. Grade10 accepts or refuses the save in the same answer.
4. Read the internal bid back on the listing, with its internal bidder and
   its state.

A listing SHALL carry at most one internal bid, and its internal bid SHALL
name one internal bidder. A save on a listing that has one SHALL change it
and SHALL NOT add a second. One internal bidder MAY serve the internal bids
of many listings.

| Field | Rule |
| --- | --- |
| Amount | Whole major units in the listing's currency, held as minor units; at least the listing's starting price, above 0, and at most the ceiling `grade10-site/auction/bid-increments` sets for that currency |
| Internal bidder | Required. One internal bidder profile, under "An admin keeps internal bidder profiles"; one being chosen or changed is Active. It changes only while the internal bid is Scheduled or Cleared, or the listing has none; a Placed or Not placed internal bid keeps its internal bidder, retired or not |
| Time | Required. From the listing's scheduled start to its scheduled close, both included; a time being set or changed is later than the moment of the save. A Not placed internal bid keeps its time |

Grade10 SHALL refuse a save that breaks a rule below, naming the rule, and
SHALL store nothing:

| Refused when | Refusal |
| --- | --- |
| The listing is `draft`, `closed`, `settled` or `canceled`; or it is past its scheduled close and has no Placed or Not placed internal bid | Not editable |
| The amount, the internal bidder or the time is missing | Required |
| An internal bidder being chosen or changed is Retired | Retired internal bidder |
| The internal bidder is changed on a Placed or Not placed internal bid | Internal bidder is fixed |
| The amount is not a whole number of major units | Whole amount |
| The amount is below the starting price | Below the starting price, naming it |
| The amount is above the ceiling | Above the ceiling, naming it |
| A time being set or changed is before the scheduled start or after the scheduled close | Outside the bidding window |
| A time being set or changed is at or before the moment of the save | Time has passed |

A save that changes the internal bidder of a Placed or Not placed internal
bid SHALL be refused as Internal bidder is fixed, whatever its amount.

Grade10 SHALL NOT judge the amount against the listing's minimum next bid at
Save; it judges it at the time, under "Internal bid states". An internal bid
SHALL change no listing fact a collector reads until Grade10 commits it, per
`grade10-site/auction/auto-bidding`; choosing or changing its internal bidder
before then changes none either.

A scenario of this capability that saves an internal bid without naming its
internal bidder saves it with an Active one, and a re-save keeps the one the
internal bid already names.

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
- **WHEN** the admin saves an internal bid of 1000000100 USD minor units
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

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-2s1 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-22 - A time at the scheduled close is accepted
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin commits the house at the last moment the lot takes a bid

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T20:00:00Z
- **THEN** Grade10 accepts it and the internal bid reads Scheduled at
  2026-11-02T20:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-avn rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-23 - An amount that is not whole is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin enters a part of a major unit

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`
- **WHEN** the admin saves an internal bid of 50050 HKD minor units at
  2026-11-02T18:00:00Z
- **THEN** Grade10 refuses it, asking for a whole amount
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-9ve rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-24 - An amount below the starting price is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin enters a floor under the opening price

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`, with a
  starting price of 20000 HKD minor units
- **WHEN** the admin saves an internal bid of 19900 HKD minor units at
  2026-11-02T18:00:00Z
- **THEN** Grade10 refuses it, naming the starting price of 20000 HKD minor
  units
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-urt rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-25 - A draft listing takes no internal bid
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin tries to protect a lot still being written

- **GIVEN** a `draft` `HKD` listing with a starting price of 20000 HKD minor
  units, a start and a close
- **WHEN** an admin holding `auction:reserve` saves an internal bid of 50000
  HKD minor units at a time inside its window
- **THEN** Grade10 refuses it as not editable
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-awq rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-26 - An admin sets an internal bid on a created listing
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin prepares the floor before publishing

- **GIVEN** a `created` `HKD` listing starting 2026-11-02T08:00:00Z and
  closing 2026-11-02T20:00:00Z, at 2026-11-01T09:00:00Z
- **WHEN** an admin holding `auction:reserve` saves an internal bid of 50000
  HKD minor units at 2026-11-02T18:00:00Z
- **THEN** Grade10 accepts it and the internal bid reads Scheduled
- **AND** when the listing is published, the internal bid still reads
  Scheduled at 50000 HKD minor units and 2026-11-02T18:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-otk rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-27 - An amount below the price at Save waits for its time
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin sets a floor on a lot already running above it

- **GIVEN** an open `HKD` listing closing 2026-11-02T20:00:00Z, where a
  collector leads at 52000 HKD minor units, at 2026-11-02T12:00:00Z
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z
- **THEN** Grade10 accepts it and the internal bid reads Scheduled
- **AND** the listing's current bid and leader are unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-m8q rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-41 - A save with no time is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin leaves the commit time empty

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`
- **WHEN** the admin saves an internal bid of 50000 HKD minor units with no
  time
- **THEN** Grade10 refuses it, asking for the time
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-fti rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-48 - A lot past its scheduled close takes no new internal bid
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin tries to protect a lot already in extended bidding

- **GIVEN** a published `HKD` listing whose scheduled close of
  2026-11-02T20:00:00Z has passed and which is in extended bidding until
  2026-11-02T20:03:00Z, with no internal bid, at 2026-11-02T20:01:00Z
- **WHEN** an admin holding `auction:reserve` saves an internal bid of 50000
  HKD minor units at 2026-11-02T20:02:00Z
- **THEN** Grade10 refuses it as not editable
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ols rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-54 - A save with no internal bidder is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin leaves the internal bidder unchosen

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`, and an
  Active internal bidder named Harbour Cards
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z with no internal bidder
- **THEN** Grade10 refuses it, asking for the internal bidder
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-1af rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-55 - A retired internal bidder is refused
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin names an internal bidder no longer in use

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01`, and a
  Retired internal bidder named Old Stock
- **WHEN** the admin saves an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z as Old Stock
- **THEN** Grade10 refuses it, saying the internal bidder is retired
- **AND** the listing has no internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-dnq rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-56 - Before its time the admin changes the internal bidder
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin picks another internal bidder before the house has bid

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-01` with its
  Scheduled internal bid as Harbour Cards, and an Active internal bidder named
  Kowloon Vault, at 2026-11-02T12:00:00Z
- **WHEN** the admin saves the same amount and time as Kowloon Vault
- **THEN** Grade10 accepts it and the internal bid reads Scheduled as Kowloon
  Vault, at 50000 HKD minor units and 2026-11-02T18:00:00Z
- **AND** the listing's public facts are unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-i32 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-57 - After its time the internal bidder is fixed
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin tries to change who the house bids as once its time has come

- **GIVEN** two `HKD` listings, one with a Placed and one with a Not placed
  internal bid, each as Harbour Cards, and an Active internal bidder
  named Kowloon Vault
- **WHEN** the admin saves each internal bid at its own amount as Kowloon
  Vault
- **THEN** Grade10 refuses each, saying the internal bidder is fixed
- **AND** each internal bid still reads as Harbour Cards, in the state and at
  the amount it had

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-rzl rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-58 - One internal bidder serves two listings
**Serves:** grade10-admin-auction-internal-bid-US-01 - the admin protects two lots as the same internal bidder

- **GIVEN** two published `HKD` listings with no internal bid, and an Active
  internal bidder named Harbour Cards
- **WHEN** the admin saves an internal bid on each as Harbour Cards
- **THEN** Grade10 accepts both
- **AND** each listing carries one internal bid, as Harbour Cards

### Requirement: A listing edit clears an internal bid it leaves outside its limits

When an operator saves a change to a `created` listing that leaves its
internal bid outside a limit below, Grade10 SHALL:

- Accept or refuse the change exactly as it would on a listing with no
  internal bid, and answer the operator the same way.
- Clear the internal bid in the same save, so Grade10 never commits it.
- Show an admin holding `auction:reserve` that the internal bid was cleared
  by a listing edit, with its amount, its internal bidder, its time and when
  it was cleared, until an admin saves a new one.

| Edit | Clears the internal bid when |
| --- | --- |
| Start or scheduled close | Its time falls outside the new bidding window |
| Starting price | Its amount is below the new starting price |
| Currency | Its amount, kept as the same count of minor units, is below the starting price, above the ceiling `grade10-site/auction/bid-increments` sets for the new currency, or not a whole major unit of the new currency |

The rule holds for a Scheduled internal bid and for one Not placed while the
listing was still `created`. An edit that leaves every limit met SHALL keep
the internal bid unchanged.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-rzd rev=2 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-28 - A window change past the time clears the internal bid
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's window moves under a floor set before it was published

- **GIVEN** a `created` `HKD` listing closing 2026-11-02T20:00:00Z, with a
  Scheduled internal bid of 50000 HKD minor units at 2026-11-02T18:00:00Z as
  Harbour Cards
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they move its scheduled close to 2026-11-02T17:00:00Z and save
- **THEN** Grade10 accepts the save, and its answer says nothing of an
  internal bid
- **AND** an admin holding `auction:reserve` then sees the internal bid
  cleared by a listing edit, with 50000 HKD minor units, Harbour Cards and
  2026-11-02T18:00:00Z
- **AND** when 2026-11-02T18:00:00Z passes, Grade10 places no bid for the
  house on the listing

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-bjb rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-29 - A window change that keeps the time keeps the internal bid
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's window moves around a floor that still fits

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-28` before
  the change
- **WHEN** an operator moves its scheduled close to 2026-11-02T21:00:00Z and
  saves
- **THEN** the internal bid still reads Scheduled at 50000 HKD minor units and
  2026-11-02T18:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-36t rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-34 - A starting price raised over the internal bid clears it
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's opening price moves above a floor set before it was published

- **GIVEN** two `created` `HKD` listings with a starting price of 20000 HKD
  minor units, one with a Scheduled internal bid of 50000 HKD minor units and
  one with none
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they raise each starting price to 60000 HKD minor units and save
- **THEN** Grade10 accepts both saves with the same answer
- **AND** an admin holding `auction:reserve` sees the first listing's internal
  bid cleared by a listing edit, with 50000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-wib rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-35 - A currency change past the new ceiling clears the internal bid
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's currency moves under a floor its new ceiling cannot hold

- **GIVEN** a `created` `HKD` listing with a starting price of 20000 HKD minor
  units and a Scheduled internal bid of 6000000000 HKD minor units
- **WHEN** an operator changes its currency to `USD` and saves
- **THEN** Grade10 accepts the save, and its answer says nothing of an
  internal bid
- **AND** an admin holding `auction:reserve` sees the internal bid cleared by
  a listing edit, with 6000000000 minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-9xf rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-36 - A starting price that stays under the internal bid keeps it
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's opening price moves under a floor that still fits

- **GIVEN** a `created` `HKD` listing with a starting price of 20000 HKD minor
  units and a Scheduled internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z
- **WHEN** an operator raises its starting price to 50000 HKD minor units and
  saves
- **THEN** the internal bid still reads Scheduled at 50000 HKD minor units and
  2026-11-02T18:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-qzx rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-42 - A currency change keeps the internal bid's minor units
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's currency moves under a floor that still fits

- **GIVEN** a `created` `HKD` listing with a starting price of 20000 HKD minor
  units and a Scheduled internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z
- **WHEN** an operator changes its currency to `USD` and saves
- **THEN** the internal bid still reads Scheduled at 50000 USD minor units and
  2026-11-02T18:00:00Z

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ps0 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-43 - A currency change that leaves the amount not whole clears the internal bid
**Serves:** grade10-admin-auction-internal-bid-US-08 - the lot's currency moves to one where the floor is not a whole amount

- **GIVEN** a `created` `JPY` listing with a starting price of 20000 JPY minor
  units and a Scheduled internal bid of 50050 JPY minor units
- **WHEN** an operator changes its currency to `HKD` and saves
- **THEN** Grade10 accepts the save, and its answer says nothing of an
  internal bid
- **AND** an admin holding `auction:reserve` sees the internal bid cleared by
  a listing edit, with 50050 minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-pzs rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-51 - A new save replaces a cleared internal bid
**Serves:** grade10-admin-auction-internal-bid-US-08 - the admin protects the lot again after a listing edit cleared its floor

- **GIVEN** a `created` `HKD` listing starting 2026-11-02T08:00:00Z and
  closing 2026-11-02T20:00:00Z, with a starting price of 60000 HKD minor
  units, whose internal bid of 50000 a starting-price change cleared, at
  2026-11-01T09:00:00Z
- **WHEN** an admin holding `auction:reserve` saves an internal bid of 70000
  HKD minor units at 2026-11-02T18:00:00Z
- **THEN** Grade10 accepts it and the internal bid reads Scheduled at 70000
  HKD minor units and 2026-11-02T18:00:00Z
- **AND** the admin no longer sees that a listing edit cleared it

### Requirement: Internal bid states

An internal bid SHALL be in one of these states, and the admin SHALL see its
state on the listing beside its amount and time.

| State | Meaning | Amount | Internal bidder | Time | Removable |
| --- | --- | --- | --- | --- | --- |
| Scheduled | Its time has not arrived; the house is not in the bidding | Changes under the Save rules | Changes under the Save rules | Changes under the Save rules | Yes |
| Placed | Grade10 committed it at its time | Raised, or lowered under "An admin changes a placed internal bid" | Fixed | Fixed | No |
| Not placed | At its time it was short of the minimum next bid, or the listing was still `created`; nothing was placed | Saved again under the Save rules, its time kept, under "An admin learns an internal bid came too late": while the listing is `created` it stays Not placed; while the listing takes bids, a save at or above the minimum next bid, its own amount included, places it at once, a lower below it stays Not placed, and a raise below it is refused | Fixed | Fixed | Yes |
| Cleared | A listing edit left it outside its limits; Grade10 never commits it | - | Shown; the next save names an Active one | - | Replaced by the next save |

Grade10 SHALL move an internal bid from Scheduled to Placed or Not placed at
its time, whether or not anyone has the listing open, per
`grade10-site/auction/auto-bidding`. An internal bid whose time arrives while
the listing is still `created` SHALL be Not placed, and publishing the
listing afterwards SHALL NOT commit it. A save of a Not placed internal bid
that Grade10 places SHALL move it to Placed.

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
SHALL be able to:

1. Save it again while the listing takes bids, at any amount the Save rules
   allow, its time kept. A save at or above the minimum next bid, its own
   amount included, places it at once. Below the minimum next bid, a lower
   (an amount below the stored amount) is accepted, stays Not placed and
   changes nothing a collector reads; any other save below it, a raise or the
   same amount, is refused, naming the minimum next bid, and leaves it Not
   placed.
2. Save it at any amount the Save rules allow while the listing is still
   `created`, its time kept. It stays Not placed and changes nothing a
   collector reads.
3. Remove it. The listing then has no internal bid.

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

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ujg rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-30 - A not-placed internal bid is lowered
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin lets the lot sell but keeps a record of the floor

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09` with its
  Not placed internal bid of 50000 HKD minor units
- **WHEN** the admin lowers it to 40000 HKD minor units
- **THEN** Grade10 accepts it and the internal bid reads Not placed at 40000
  HKD minor units
- **AND** the listing's current bid, leader, bid count and public history are
  unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-te0 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-31 - A not-placed internal bid is removed
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin lets the lot sell

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09` with its
  Not placed internal bid
- **WHEN** the admin removes it
- **THEN** the listing has no internal bid
- **AND** the listing's current bid, leader, bid count and public history are
  unchanged

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-oml rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-37 - An internal bid whose time comes before publishing is not placed
**Serves:** grade10-admin-auction-internal-bid-US-05 - the lot was still unpublished when the house's time came

- **GIVEN** a `created` `HKD` listing with no publish at, starting
  2026-11-02T08:00:00Z with a starting price of 20000 HKD minor units, and a
  Scheduled internal bid of 50000 HKD minor units at 2026-11-02T18:00:00Z
- **WHEN** 2026-11-02T18:00:00Z passes with the listing still `created`
- **AND** an operator publishes it at 2026-11-02T18:30:00Z
- **THEN** the admin sees the internal bid as Not placed, with 50000 HKD minor
  units and 2026-11-02T18:00:00Z
- **AND** the published listing has no bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-r5u rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-38 - A save places an internal bid not placed before publishing
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin puts the house in once the lot is open

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-37` before
  it is published
- **WHEN** the admin raises the internal bid to 60000 HKD minor units
- **THEN** Grade10 accepts it, and it stays Not placed at 60000 HKD minor
  units
- **AND** once the listing is published and taking bids with no bid on it,
  a save at the same 60000 HKD minor units is accepted, the internal bid
  reads Placed and the house leads at 20000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-x95 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-52 - A re-save of a not-placed internal bid still short is refused
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin saves the short amount again

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09` with its
  Not placed internal bid of 50000 HKD minor units
- **WHEN** the admin saves it again at 50000 HKD minor units
- **THEN** Grade10 refuses it, naming 53000 HKD minor units as the minimum
  next bid
- **AND** the internal bid stays Not placed at 50000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-tbl rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-53 - A lower that still reaches the minimum next bid places it
**Serves:** grade10-admin-auction-internal-bid-US-05 - the admin loosens a floor set before publishing once the lot opens

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-38`,
  published and taking bids with no bid on it, its internal bid Not placed at
  60000 HKD minor units
- **WHEN** the admin lowers it to 40000 HKD minor units
- **THEN** Grade10 accepts it and the internal bid reads Placed at 40000 HKD
  minor units
- **AND** the house leads at 20000 HKD minor units

### Requirement: An admin changes a placed internal bid

Once an internal bid is Placed, its time SHALL NOT change and it SHALL NOT be
removed. Until the listing's effective close, the admin SHALL be able to:

1. Raise the amount at any time the listing takes a bid. Grade10 SHALL treat
   the raise as a new commitment of the house maximum, per
   `grade10-site/auction/auto-bidding`.
2. Lower the amount. Grade10 SHALL accept a lower amount only when the
   listing's leader and current bid stay the same, and SHALL refuse one below
   any bid already placed for the house on the listing, per
   `grade10-site/auction/auto-bidding`.

A raise or a lower SHALL hold to the amount rules of the Save, and SHALL bid
as the internal bidder the internal bid names, even once that internal bidder
is Retired. Grade10 SHALL refuse every other change, naming the reason, and leave the internal bid as
it was:

| Refused when | Refusal |
| --- | --- |
| The time is changed after it has arrived | Time is fixed |
| The internal bidder is changed | Internal bidder is fixed |
| A Placed internal bid is removed | Time is fixed |
| A raise is below the listing's minimum next bid | Below the minimum next bid, naming it |
| A lower amount would move the leader or the current bid | Moves the lead or the current bid |
| A lower amount is below a bid already placed for the house | Below the house's bid, naming that bid |
| The listing has passed its effective close | Not taking bids |

When a lower is both below a bid already placed for the house and would move
the leader or the current bid, Grade10 SHALL name only "Below the house's
bid", with that bid.

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

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-x8q rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-47 - A leading house lowers to its current bid
**Serves:** grade10-admin-auction-internal-bid-US-04 - the admin loosens the floor while the house leads

- **GIVEN** an `HKD` listing where the house leads at 31000 HKD minor units
  with a Placed internal bid of 50000 over collector A's maximum of 30000
- **WHEN** the admin lowers the internal bid to 31000 HKD minor units
- **THEN** Grade10 accepts it and the internal bid reads 31000 HKD minor units
- **AND** the house still leads at 31000 HKD minor units, with no public bid
  record added

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

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-16a rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-50 - A lower that moves the price and goes below the house's bid names the house's bid
**Serves:** grade10-admin-auction-internal-bid-US-04 - the admin lowers under a bid the house placed while it leads

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-47` before
  its lower, where the house's one bid is at 31000 HKD minor units
- **WHEN** the admin lowers the internal bid to 30500 HKD minor units
- **THEN** Grade10 refuses it, naming the house's bid of 31000 HKD minor
  units, and does not say it moves the lead or the current bid
- **AND** the house still leads at 31000 HKD minor units and the internal bid
  reads 50000

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-hsd rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-44 - A raise of a placed internal bid still short is refused
**Serves:** grade10-admin-auction-internal-bid-US-03 - the admin's raise does not reach the next bid

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-13` before
  the raise, where the minimum next bid is 52000 HKD minor units
- **WHEN** the admin raises the internal bid to 51500 HKD minor units
- **THEN** Grade10 refuses it, naming 52000 HKD minor units as the minimum
  next bid
- **AND** the collector still leads at 51000 HKD minor units and the internal
  bid reads Placed at 50000

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-6v8 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-45 - A raise after the effective close is refused
**Serves:** grade10-admin-auction-internal-bid-US-03 - the admin returns to a lot that has stopped taking bids

- **GIVEN** an `HKD` listing past its effective close, where a collector led
  over a Placed internal bid of 50000 HKD minor units
- **WHEN** the admin raises the internal bid to 90000 HKD minor units
- **THEN** Grade10 refuses it, as not taking bids
- **AND** the internal bid reads Placed at 50000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-wmp rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-46 - A lower after the effective close is refused
**Serves:** grade10-admin-auction-internal-bid-US-04 - the admin returns to a lot that has stopped taking bids

- **GIVEN** an `HKD` listing past its effective close, where the house led at
  31000 HKD minor units with a Placed internal bid of 50000
- **WHEN** the admin lowers the internal bid to 40000 HKD minor units
- **THEN** Grade10 refuses it, as not taking bids
- **AND** the internal bid reads Placed at 50000 HKD minor units

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ubh rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-59 - A placed internal bid raises as its retired internal bidder
**Serves:** grade10-admin-auction-internal-bid-US-03 - the admin keeps protecting a lot after retiring the internal bidder it bids as

- **GIVEN** an `HKD` listing where a collector leads at 51000 HKD minor units
  with a maximum of 60000, over a Placed internal bid of 50000 as Harbour
  Cards, and Harbour Cards has since been retired
- **WHEN** the admin raises the internal bid to 80000 HKD minor units
- **THEN** Grade10 accepts it and the house leads at 61000 HKD minor units
- **AND** the internal bid reads Placed at 80000 HKD minor units as Harbour
  Cards

### Requirement: An admin reads a lot the house bought in

When a listing closes with the house leading, the admin SHALL see it Bought
in, per `grade10-admin/auction/listing`, with the internal bid Placed at its
last amount. The listing SHALL have no order to open, its stock SHALL be
released as at an Unsold close, and it SHALL offer Relist, per
`grade10-admin/auction/listing`. The close itself is
`grade10-site/auction/auction`'s.

The house SHALL never be a lot's winner for the rules of
`grade10-site/auction/winner-order`, `grade10-site/auction/notifications-order`
and `grade10-admin/auction/post-sale`, though collectors read it as the
winning bidder. For a bought-in lot Grade10 SHALL:

| Capability | What a bought-in lot gets |
| --- | --- |
| `grade10-site/auction/winner-order` | No auction order and no invoice |
| `grade10-site/auction/notifications-order` | No won, address or other order letter, to anyone |
| `grade10-admin/auction/post-sale` | No row or outcome in the post-sale queue, and no Open order on its Listings row |

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-hat rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-17 - A house win reads Bought in with no order
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin tells a bought-in lot from a sale

- **GIVEN** an `HKD` listing where the house leads at 31000 HKD minor units
  with a Placed internal bid of 50000
- **WHEN** the listing closes and an admin opens it
- **THEN** it reads Bought in, with the internal bid Placed at 50000 HKD minor
  units
- **AND** no order exists for it, and its stock is released

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-80a rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-49 - A bought-in lot reaches no order, order letter or post-sale queue
**Serves:** grade10-admin-auction-internal-bid-US-06 - the admin finds no order work for a lot the house won

- **GIVEN** an `HKD` listing that closed with the house leading at 31000 HKD
  minor units, and a second listing that closed with collector A winning
- **WHEN** an admin holding `auction:reserve` opens the post-sale queue and
  the Listings table
- **THEN** the post-sale queue holds the collector's lot and no row for the
  house's lot
- **AND** the house's Listings row offers no Open order
- **AND** Grade10 sent no won or address letter for the house's lot

### Requirement: An admin keeps internal bidder profiles

An **internal bidder** is a profile an internal bid bids as. It has a name
and an email label, and no site account behind it. An admin holding
`auction:reserve` SHALL:

1. Open Internal bidders in auction admin and read every profile with its
   name, its email label and its state.
2. Add a profile with a name and an email label. It is Active.
3. Rename a profile at any time, or change its email label until a bid has
   been placed for it on any listing.
4. Retire a profile that no Scheduled internal bid names, and no Not placed
   internal bid on a listing that has not passed its effective close.

| Field | Rule |
| --- | --- |
| Name | Required; may change at any time |
| Email label | Required; an email address, unique among every profile, Retired ones included, compared without regard to letter case; fixed once a bid has been placed for the profile on any listing |

| State | Offered at Save | Can be named by a new or changed internal bid | History |
| --- | --- | --- | --- |
| Active | Yes | Yes | Kept |
| Retired | No | No | Kept |

Grade10 SHALL refuse a profile act that breaks a rule below, naming the rule,
and SHALL change nothing:

| Refused when | Refusal |
| --- | --- |
| The name or the email label is missing | Required |
| The email label is not an email address | Not an email address |
| Another profile has the email label | Email label in use |
| The email label is changed after a bid has been placed for the profile | Email label is fixed |
| A Scheduled internal bid, or a Not placed internal bid on a listing that has not passed its effective close, names the profile, when it is retired | In use, naming each of those listings |

Grade10 SHALL NOT delete a profile. A Retired profile SHALL keep every bid
placed for it, and the reads under "Other operators read the house's bids as
House" SHALL show it as they did before it was retired. Every read SHALL show
a profile's current name.

An internal bidder SHALL bid only through internal bids. Adding one SHALL
create no site account, and no site bid panel SHALL accept a bid for it. Its
email label is a label only: Grade10 SHALL address no letter to an internal
bidder, per `grade10-site/auction/notifications`.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-piq rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-60 - An admin adds an internal bidder
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin adds an internal bidder to bid as

- **GIVEN** an admin holding `auction:reserve`
- **WHEN** they add an internal bidder named Harbour Cards with the email
  label harbour@internal.grade10.example
- **THEN** Grade10 accepts it and Internal bidders lists Harbour Cards as
  Active, with that email label
- **AND** Harbour Cards is offered as the internal bidder when the admin sets
  an internal bid on a listing
- **AND** no site account exists for harbour@internal.grade10.example

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-h93 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-61 - An email label another profile has is refused
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin reuses an email label already taken

- **GIVEN** an Active internal bidder with the email label
  harbour@internal.grade10.example, and a Retired one with the email label
  old@internal.grade10.example
- **WHEN** the admin adds an internal bidder with the email label
  Harbour@internal.grade10.example, and another with
  old@internal.grade10.example
- **THEN** Grade10 refuses each, saying the email label is in use
- **AND** Internal bidders lists the same two profiles as before

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ec7 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-62 - A rename after bidding shows in the listing's bids
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin renames an internal bidder that has already bid

- **GIVEN** an internal bidder named Harbour Cards, for which a bid of 31000
  HKD minor units has been placed on a listing
- **WHEN** the admin renames it Harbour Cards Ltd
- **THEN** Grade10 accepts it
- **AND** an admin holding `auction:reserve` reads that listing's bid at 31000
  HKD minor units as House, Harbour Cards Ltd

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-2x8 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-63 - The email label is fixed once the profile has bid
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin changes the email label of an internal bidder

- **GIVEN** an internal bidder named Harbour Cards, for which a bid has been
  placed on a listing, and one named Kowloon Vault, whose only internal bid
  is Scheduled
- **WHEN** the admin changes the email label of each
- **THEN** Grade10 refuses Harbour Cards's change, saying the email label is
  fixed, and keeps its email label
- **AND** Grade10 accepts Kowloon Vault's change, and its Scheduled internal
  bid still names Kowloon Vault

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-9ng rev=2 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-64 - An internal bidder in use is not retired
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin retires an internal bidder a coming internal bid still needs

- **GIVEN** an internal bidder named Harbour Cards, named by a Scheduled
  internal bid on listing L1, and one named Kowloon Vault, named by a Not
  placed internal bid on listing L2, which still takes bids
- **WHEN** the admin retires each
- **THEN** Grade10 refuses Harbour Cards, naming L1, and Kowloon Vault,
  naming L2
- **AND** both stay Active

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-bio rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-65 - A retired internal bidder keeps its history and is no longer offered
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin retires an internal bidder whose lots have closed

- **GIVEN** an internal bidder named Harbour Cards whose only internal bid is
  on a listing that closed bought in, the house leading at 31000 HKD minor
  units
- **WHEN** the admin retires Harbour Cards
- **THEN** Grade10 accepts it and Internal bidders lists Harbour Cards as
  Retired
- **AND** Harbour Cards is not offered when the admin sets an internal bid on
  another listing
- **AND** an admin holding `auction:reserve` still reads the closed listing's
  bid at 31000 HKD minor units as House, Harbour Cards

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-uem rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-70 - A Not placed internal bid on a closed listing does not keep its internal bidder in use
**Serves:** grade10-admin-auction-internal-bid-US-09 - the admin retires an internal bidder whose only Not placed internal bid is on a lot that has closed

- **GIVEN** an internal bidder named Kowloon Vault whose only internal bid is
  Not placed at 50000 HKD minor units on listing L3, which closed with
  collector A winning at 53000 HKD minor units
- **WHEN** the admin retires Kowloon Vault
- **THEN** Grade10 accepts it and Internal bidders lists Kowloon Vault as
  Retired
- **AND** an admin holding `auction:reserve` still reads L3's internal bid as
  Not placed at 50000 HKD minor units, as Kowloon Vault

### Requirement: Only secret-floor access reaches an internal bid

Only an operator holding `auction:reserve` SHALL set, change, remove or read
an internal bid: its amount, its internal bidder, its time and its state.
Only such an operator SHALL open, add, rename, change or retire an internal
bidder profile. For any other operator:

- Auction admin SHALL show no Internal bidders page, and the listing editor
  SHALL show no internal bid section. Until the listing
  closes it SHALL show nothing that says the listing has, had or may have
  one; once a lot closes bought in, it reads Bought in, per
  `grade10-admin/auction/listing`, and still shows no amount, time or state.
- Grade10 SHALL refuse a set, change, remove or read of an internal bid, and
  any read or act on an internal bidder profile, and change nothing.
- No operator read SHALL show that a listing has an internal bid before a bid
  is placed for the house on it, except the audit trail below. A Scheduled, Not placed or Cleared internal
  bid leaves no trace in any read open to them. Once the house has bid, its
  bids read House under "Other operators read the house's bids as House".

The audit trail SHALL record each set, change and removal with the operator,
the listing and the time it was made, and SHALL NOT record the internal bid's
amount, its internal bidder or its time. It SHALL record each add, rename,
email label change and retirement of an internal bidder profile with the
operator, the profile and the time it was made, and SHALL NOT record a
listing or an internal bid amount with it. An operator holding audit access without
`auction:reserve` MAY learn from it that a listing's internal bid was set,
changed or removed, never its amount or its time. `auction:reserve` SHALL read, in the roles list, as the
grant that sets and reads a listing's internal bid and keeps the internal
bidders.

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

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-53a rev=2 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-20 - The audit trail records a set without its amount
**Serves:** grade10-admin-auction-internal-bid-US-07 - an auditor reads who protected a lot

- **GIVEN** an admin who saved an internal bid of 50000 HKD minor units at
  2026-11-02T18:00:00Z as Harbour Cards on a listing
- **WHEN** an operator holding audit access reads the audit trail for that
  listing
- **THEN** it shows the admin set an internal bid on the listing, and when
- **AND** it shows neither 50000, 2026-11-02T18:00:00Z nor Harbour Cards

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-d57 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-66 - Staff cannot open or change internal bidders
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator without secret-floor access looks for the house's bidders

- **GIVEN** an Active internal bidder named Harbour Cards
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they open auction admin, and call Grade10 to list the internal
  bidders, to rename Harbour Cards and to add one
- **THEN** auction admin shows them no Internal bidders page
- **AND** Grade10 refuses each call, and Harbour Cards is unchanged and the
  only internal bidder

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-d6h rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-68 - The audit trail records an internal bidder act without a listing
**Serves:** grade10-admin-auction-internal-bid-US-09 - an auditor reads who changed the house's bidders

- **GIVEN** an internal bidder named Harbour Cards, named by a Scheduled
  internal bid of 50000 HKD minor units on a listing
- **WHEN** an admin holding `auction:reserve` renames it Harbour Cards Ltd,
  and an operator holding audit access reads the audit trail
- **THEN** it shows the admin renamed the internal bidder, and when
- **AND** the entry names no listing and shows no 50000

### Requirement: Other operators read the house's bids as House

Every operator read that lists a listing's bids or bidders SHALL name the
house **House**, never its listing pseudonym, and SHALL show nothing of it
until a bid is placed for it. On a listing, the house is the internal bidder
the listing's internal bid names. Collectors still read the house only under its
listing pseudonym, per `grade10-site/auction/auto-bidding`. For an operator
without `auction:reserve`:

| Read | What it shows of the house |
| --- | --- |
| Bid ledger and listing activity | Each bid placed for the house that the public history records, as House, with its amount, its Accepted At and that Grade10 placed it; no account, email, name or maximum, and no row for a raise or a lower that records no public bid |
| Bidder summaries | House and its bid count; no account, email, name or maximum |
| Stats | The house counted in the bidder count, and its bids in the bid count |
| Listings table and the listing's own page | The listing as any listing with its bids until the close, then Bought in, per `grade10-admin/auction/listing` |

No read open to them SHALL show the house's maximum, any commitment, raise or
lower of it, or the internal bid's time before the house bids. A house bid's
own Accepted At SHALL show, as the public history shows it, even where it
equals the internal bid's time. An operator holding
`auction:reserve` reads the same rows as House with the internal bidder's name
and email label where a collector's row shows an account, the house's
maximum, and every commitment, raise and lower, per
`grade10-site/auction/auto-bidding`. No internal bidder SHALL appear in the
bidder moderation list, and a search of the Listings table by an email SHALL
NOT match an internal bidder's email label, for any operator.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-ftu rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-32 - Staff read the house's bids as House
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator without secret-floor access reads a protected lot's bids

- **GIVEN** an open `HKD` listing where collector A, shown to collectors as
  Bidder 1, bid with a maximum of 30000, and the house, shown to collectors as
  Bidder 2, leads at 31000 HKD minor units with a maximum of 50000
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they read the listing's bid ledger and bidder summaries
- **THEN** they see House's bid at 31000 HKD minor units with its Accepted At,
  and A's bid with A's account and maximum
- **AND** House's rows show no account, email, name, maximum or Bidder 2

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-2l8 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-33 - Stats count the house as a bidder
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator reads how many bid on a protected lot

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-32`, with
  one bid by A and one placed for the house
- **WHEN** an operator whose roles are exactly `staff` opens its Stats
- **THEN** the bidder count is 2
- **AND** the listing's bid count is 2, as collectors read it

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-27a rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-39 - A not-placed internal bid leaves no trace for staff
**Serves:** grade10-admin-auction-internal-bid-US-07 - the house's floor came too late and staff never learn it existed

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-09` with its
  Not placed internal bid, and collector A's bid as its only bid
- **AND** an operator whose roles are exactly `staff`
- **WHEN** they read its bid ledger, bidder summaries, activity and Stats
- **THEN** they see A's bid alone, a bidder count of 1 and a bid count of 1
- **AND** nothing names House or an internal bid

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-fs2 rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-40 - Staff see no row for a house raise or lower
**Serves:** grade10-admin-auction-internal-bid-US-07 - the house's maximum moves and staff see only the bids it placed

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-32`
- **WHEN** the admin raises the internal bid to 70000 HKD minor units, and
  then lowers it to 60000
- **AND** an operator whose roles are exactly `staff` reads its bid ledger and
  activity
- **THEN** they see House's one bid at 31000 HKD minor units
- **AND** no row shows 50000, 70000, 60000, a raise or a lower

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-epm rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-67 - A reserve holder reads which internal bidder bid
**Serves:** `grade10-admin-auction-internal-bid-US-09`, `grade10-site/auction/auto-bidding#grade10-site-auction-auto-bidding-US-04` - the admin traces which internal bidder the house bid as

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-32`, whose
  internal bid names Harbour Cards, with the email label
  harbour@internal.grade10.example
- **WHEN** an admin holding `auction:reserve` reads its bid ledger and bidder
  summaries
- **THEN** House's bid at 31000 HKD minor units reads House, Harbour Cards,
  harbour@internal.grade10.example, with a maximum of 50000
- **AND** an operator whose roles are exactly `staff` reading the same reads
  sees House with no name, email label or maximum

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-s2h rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-69 - An internal bidder's email label matches no Listings search
**Serves:** grade10-admin-auction-internal-bid-US-07 - an operator looks for the house among the bidders

- **GIVEN** the listing of `grade10-admin-auction-internal-bid-SC-67`
- **WHEN** an admin holding `auction:reserve`, and an operator whose roles
  are exactly `staff`, each search the Listings table by
  harbour@internal.grade10.example and read the bidder moderation list
- **THEN** the search matches no listing for either
- **AND** neither finds Harbour Cards in the bidder moderation list

### Requirement: Call-off and Relist drop the internal bid

Calling a listing off SHALL drop its internal bid, whatever its state: the
listing then has no internal bid, an admin holding `auction:reserve` reads
none on it, and Grade10 SHALL NOT commit one on it afterwards. A bid already
placed for the house SHALL be called off with every other bid, per
`grade10-admin/auction/listing`. A draft opened by Relist SHALL carry no
internal bid, per `grade10-admin/auction/listing`.

<!-- trace:scenario id=g10adm.auction-internal-bid.SC-p8p rev=1 -->
#### Scenario: grade10-admin-auction-internal-bid-SC-21 - A called-off listing never commits its internal bid
**Serves:** grade10-admin/auction/listing#grade10-admin-auction-listing-US-05 - an operator calls off a protected lot before its time

- **GIVEN** a published listing with a Scheduled internal bid at
  2026-11-02T18:00:00Z
- **WHEN** an operator calls the listing off at 2026-11-02T12:00:00Z
- **AND** 2026-11-02T18:00:00Z passes
- **THEN** Grade10 places no bid for the house on the listing
