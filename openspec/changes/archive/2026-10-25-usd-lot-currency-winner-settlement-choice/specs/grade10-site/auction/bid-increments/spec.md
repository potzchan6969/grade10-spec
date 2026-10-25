# grade10-site/auction/bid-increments Specification

## Purpose

Makes the next auction bid proportionate to the price being beaten, using one
Grade10-owned USD schedule for every auction, which bids in USD alone.

## Feature set

- Currency schedules
  - USD only: every auction is bid in USD, one schedule, and HKD and JPY tiers retire
  - Currency boundary: any currency other than USD cannot price an auction
- Bid ceiling
  - One USD ceiling: a single upper limit of USD 10,000,000 for every lot
  - Refusal above it: a manual bid or an auto-bid maximum above the ceiling is refused

## REMOVED Feature set

- Currency schedules
  - Fixed policy: retired USD, HKD and JPY schedules
- Bid ceiling
  - Per-currency ceiling: replaced by the single USD ceiling

## ADDED Requirements

### Requirement: Every lot is bid in USD and no other currency stays

Grade10 SHALL price and bid every Auction listing in USD: the starting price,
every bid, every auto-bid maximum, the minimum next amount, the increment and
the ceiling. A collector SHALL always type USD. No listing SHALL carry another
currency, and no schedule or ceiling SHALL exist for HKD or JPY.

A listing that carried another currency before this change SHALL be read as
USD with its amounts unchanged and nothing converted, per
`grade10-admin/auction/listing`.

<!-- trace:scenario id=g10.auction-bid-increments.SC-tke rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-13 - An overwritten listing bids on the USD schedule
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** an open listing whose currency was `HKD` and was overwritten to
  `USD`, with a current bid of 800000 minor units
- **WHEN** Grade10 calculates its minimum bid
- **THEN** the minimum bid is 805000 minor units in USD

<!-- trace:scenario id=g10.auction-bid-increments.SC-ws7 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-14 - A listing publishes its amounts in USD
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **WHEN** a collector reads an open listing
- **THEN** its starting price, current bid, minimum next amount and ceiling
  are each an integer count of minor units paired with `USD`


## MODIFIED Requirements

### Requirement: Grade10 owns the supported-currency schedules

Grade10 SHALL price Auction listings only in `USD`. The schedule is an ordered
set of lower-inclusive price tiers. The last tier has no upper bound. Every
amount is an integer count of minor units paired with `USD`.

| Currency | Price from (minor units) | Increment (minor units) |
| --- | ---: | ---: |
| USD | 0 | 100 |
| USD | 10000 | 500 |
| USD | 50000 | 1000 |
| USD | 100000 | 2500 |
| USD | 500000 | 5000 |
| USD | 1000000 | 10000 |

Grade10 SHALL select the tier with the greatest Price from that does not exceed
the amount being raised from. It SHALL NOT retain a per-listing increment. The HKD and JPY schedules no
longer exist.

Scenario `grade10-site-auction-bid-increments-SC-01` keeps its title with its
id. The title is historical: a first bid may stand on the starting price.

<!-- trace:scenario id=g10.auction-bid-increments.SC-vqb rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-01 - A first bid clears the starting-price tier
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing with a starting price of 20000 minor units and no accepted bid
- **WHEN** a collector reads its minimum bid
- **THEN** Grade10 reports 20000 minor units, the starting price

<!-- trace:scenario id=g10.auction-bid-increments.SC-mn9 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-02 - A boundary selects the higher tier
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose current bid is 10000 minor units
- **WHEN** Grade10 calculates its minimum bid
- **THEN** the minimum bid is 10500 minor units

<!-- trace:scenario id=g10.auction-bid-increments.SC-u6t rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-03 - A bid may exceed the minimum
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose minimum bid is 10500 minor units
- **WHEN** a collector bids 12000 minor units
- **THEN** Grade10 accepts the bid

<!-- trace:scenario id=g10.auction-bid-increments.SC-b2w rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-04 - A bid below the minimum is refused
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose minimum bid is 10500 minor units
- **WHEN** a collector bids 10499 minor units
- **THEN** Grade10 refuses the bid and names 10500 minor units as the minimum

<!-- trace:scenario id=g10.auction-bid-increments.SC-ijk rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-05 - An open listing publishes its next minimum
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **WHEN** a collector reads an open listing
- **THEN** its facts include the minimum next amount as integer minor units in USD

<!-- trace:scenario id=g10.auction-bid-increments.SC-p50 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-21 - Every lot reads the same schedule
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** two open USD listings with different starting prices and categories, each with a current bid of P minor units
- **WHEN** Grade10 calculates the minimum bid of each listing
- **THEN** both minimum bids are P plus the increment the configured schedule selects for P
- **AND** neither listing holds an increment or a schedule of its own

<!-- trace:scenario id=g10.auction-bid-increments.SC-bs0 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-22 - The schedule starts at 0 and its last tier is unbounded
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** the configured schedule
- **WHEN** Grade10 selects the tier for the amount 0, and for an amount above the Price from of every tier
- **THEN** the tier for 0 is the first tier, so no amount lies below it
- **AND** the tier for the larger amount is the last tier, whatever that amount
- **AND** every amount from 0 upward falls in exactly one tier

### Requirement: The minimum uses the amount being beaten

Before any accepted bid, the minimum next amount SHALL be the listing's
opening price: the starting price, or the tier increment for 0 when the
starting price is 0. After an accepted manual bid, it SHALL add the current
public-price tier increment to that price. With two or more proxy maxima, it
SHALL add the second-highest maximum's tier increment to that maximum and cap
the result at the leader's maximum. The result is the minimum next amount.

Grade10 SHALL accept any whole amount at or above the minimum next amount and
refuse an amount below it. It SHALL not create intermediate bids.

<!-- trace:scenario id=g10.auction-bid-increments.SC-xjw rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-07 - A manual floor uses the current public price
**Serves:** Minimum bid - a manual floor uses the current public price

- **GIVEN** an open USD listing whose current public price is 800000 minor units
- **WHEN** Grade10 calculates the next minimum
- **THEN** the minimum is 805000 minor units

<!-- trace:scenario id=g10.auction-bid-increments.SC-w8f rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-12 - A 0 start opens at the lowest increment
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector enters the opening bid on a lot that starts at nothing

- **GIVEN** an open `USD` listing with a starting price of 0 and no accepted bid
- **WHEN** a collector reads its minimum bid
- **THEN** Grade10 reports 100 minor units

<!-- trace:scenario id=g10.auction-bid-increments.SC-a64 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-17 - A changed schedule moves the next minimum on an open lot
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose current bid is P minor units, and the configured tier for P has an increment of X minor units
- **WHEN** the configured increment for that tier becomes Y minor units, with Y not equal to X, and Grade10 next calculates the minimum bid
- **THEN** the minimum bid is P plus Y minor units
- **AND** the listing needs no change of its own to read it

<!-- trace:scenario id=g10.auction-bid-increments.SC-bj0 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-18 - A standing bid keeps its amount through a change
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing where a collector leads at P minor units with a maximum of M minor units
- **WHEN** the configured values change so that the increment for P differs
- **THEN** the current bid stays P minor units and the leader keeps their maximum of M minor units
- **AND** the bid count and the recorded bids are unchanged

<!-- trace:scenario id=g10.auction-bid-increments.SC-w3o rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-19 - A bid sized for the old minimum is refused after a change
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose current bid is P minor units, a collector whose page still shows the minimum P plus X minor units, and a change that makes the configured increment for P larger than X
- **WHEN** the collector bids P plus X minor units
- **THEN** Grade10 refuses the bid and names P plus the new increment as the minimum
- **AND** the current bid and the leader are unchanged

<!-- trace:scenario id=g10.auction-bid-increments.SC-ywg rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-20 - A proxy resolution reads the schedule in force
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing where collector A leads with a maximum of MA minor units, and a collector B whose maximum MB minor units is at least the minimum next amount and below MA
- **WHEN** B commits that maximum
- **THEN** the current bid is the lesser of MA and MB plus the increment the configured schedule selects for MB
- **AND** a later change to the configured values leaves that current bid as it stands

<!-- trace:scenario id=g10.auction-bid-increments.SC-cx4 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-23 - A bid with cents is refused
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose minimum bid is M minor units, a whole-dollar amount, led by another collector
- **WHEN** a collector bids M plus one minor unit
- **THEN** Grade10 refuses the bid and names the whole-dollar rule
- **AND** the current bid, the leader and every maximum are unchanged, and no bid is recorded

<!-- trace:scenario id=g10.auction-bid-increments.SC-kc7 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-24 - An operator's starting price with cents is refused
**Serves:** Minimum bid - the operator's save is refused before a collector meets the price

- **GIVEN** a USD listing whose starting price is a whole-dollar amount S minor units
- **WHEN** an operator sets its starting price to S plus one minor unit
- **THEN** Grade10 refuses the write and names the whole-dollar rule
- **AND** the listing's starting price stays S minor units

<!-- trace:scenario id=g10.auction-bid-increments.SC-y9s rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-25 - A consignment ask with cents makes no listing
**Serves:** Minimum bid - the listing sync refuses the ask against its own caller

- **GIVEN** a consignment ask for the auction whose price is a whole-dollar amount S minor units plus one minor unit
- **WHEN** Grade10 makes the listing from the ask
- **THEN** Grade10 refuses to make it and names the whole-dollar rule
- **AND** no listing exists for the ask, and the ask is unchanged

<!-- trace:scenario id=g10.auction-bid-increments.SC-n5d rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-26 - A stored starting price with cents opens at the next whole dollar
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing stored with a starting price of S plus one minor unit, S being a whole-dollar amount, and no accepted bid
- **WHEN** a collector reads the listing page and its minimum bid
- **THEN** the page shows the starting price as stored, S plus one minor unit
- **AND** the minimum bid is S plus one major unit, the next whole dollar at or above the starting price
- **AND** a first bid of that minimum is accepted
- **AND** the stored starting price stays S plus one minor unit, and no migration or rounding touches it

<!-- trace:scenario id=g10.auction-bid-increments.SC-r3d rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-27 - The house maximum and an extended-bidding bid step on the same schedule
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing in extended bidding, led by a collector with a maximum of MA minor units, and a house maximum of MH minor units that is at least the minimum next amount and below MA
- **WHEN** the house commits MH
- **THEN** the current bid is the lesser of MA and MH plus the increment the configured schedule selects for MH
- **AND** the minimum next amount is the current bid plus the increment the configured schedule selects for it, as on a listing outside extended bidding

### Requirement: Unsupported currencies are refused before auctioning

Grade10 SHALL refuse an attempt to create, update, or schedule an Auction
listing in any currency other than USD. HKD and JPY are refused like any other.
The refusal SHALL leave the listing and its schedule-derived pricing facts
unchanged.

<!-- trace:scenario id=g10.auction-bid-increments.SC-60d rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-06 - An unsupported currency cannot be scheduled
**Serves:** Currency schedules - an unsupported currency cannot be scheduled

- **GIVEN** a complete draft listing
- **WHEN** an operator sets its currency to EUR and schedules it
- **THEN** Grade10 refuses the request
- **AND** the listing remains unscheduled

<!-- trace:scenario id=g10.auction-bid-increments.SC-5ea rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-15 - HKD cannot be scheduled
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** a complete draft listing
- **WHEN** an operator sets its currency to HKD and schedules it
- **THEN** Grade10 refuses the request
- **AND** the listing remains unscheduled

<!-- trace:scenario id=g10.auction-bid-increments.SC-gq8 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-16 - JPY cannot be scheduled
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** a complete draft listing
- **WHEN** an operator sets its currency to JPY and schedules it
- **THEN** Grade10 refuses the request
- **AND** the listing remains unscheduled

### Requirement: A bid never exceeds its currency's ceiling

Grade10 SHALL hold every Auction bid amount to one ceiling in USD, the same on
every lot. Operators SHALL NOT change it.

| Currency | Ceiling (minor units) | Ceiling as read |
| --- | --- | --- |
| USD | 1000000000 | USD 10,000,000 |

Grade10 SHALL accept an amount equal to the ceiling. It SHALL refuse a manual
bid or an auto-bid maximum above the ceiling, name the ceiling in the refusal,
and leave the listing's price, leader and every maximum unchanged. When the
minimum next amount would exceed the ceiling, Grade10 SHALL refuse every
further bid on that listing.

<!-- trace:scenario id=g10.auction-bid-increments.SC-c1v rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-08 - A bid at the ceiling is accepted
**Serves:** grade10-site-auction-bid-increments-US-02 - Collector bids up to the currency ceiling

- **GIVEN** an open USD listing whose minimum bid is 999990000 minor units
- **WHEN** a collector bids 1000000000 minor units
- **THEN** Grade10 accepts the bid

<!-- trace:scenario id=g10.auction-bid-increments.SC-hm3 rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-09 - A bid above the ceiling is refused
**Serves:** grade10-site-auction-bid-increments-US-02 - Collector bids up to the currency ceiling

- **GIVEN** an open USD listing whose minimum bid is 820000 minor units
- **WHEN** a collector bids 1000000001 minor units
- **THEN** Grade10 refuses the bid and names 1000000000 minor units as the ceiling
- **AND** the listing's price and leader are unchanged

<!-- trace:scenario id=g10.auction-bid-increments.SC-xnb rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-10 - An auto-bid maximum above the ceiling is refused
**Serves:** grade10-site-auction-bid-increments-US-02 - Collector bids up to the currency ceiling

- **GIVEN** an open USD listing whose minimum bid is 150000 minor units
- **WHEN** a collector commits an auto-bid maximum of 1000000001 minor units
- **THEN** Grade10 refuses the maximum and names 1000000000 minor units as the ceiling
- **AND** no maximum is recorded for that collector

<!-- trace:scenario id=g10.auction-bid-increments.SC-pd0 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-11 - A listing at the ceiling takes no further bid
**Serves:** grade10-site-auction-bid-increments-US-02 - Collector bids up to the currency ceiling

- **GIVEN** an open USD listing whose current bid is 1000000000 minor units
- **WHEN** another collector bids on it
- **THEN** Grade10 refuses the bid and names 1000000000 minor units as the ceiling


## REMOVED Requirements

None.
