# grade10-site/auction/bid-increments Specification

## Purpose

Makes the next auction bid proportionate to the price being beaten, using one
Grade10-owned USD schedule for every auction. The schedule's values are
configuration; this capability holds the rule that reads them.

## Feature set

- Currency schedules
  - Configured schedule: the USD tiers are configuration, one for every auction, and no requirement states a tier amount
  - Schedule shape: lower-inclusive tiers, the last tier unbounded, a lowest tier from $0
  - Whole-dollar values: every tier bound and every increment is a whole-dollar amount
  - A change takes effect on the next bid: open lots included, standing bids untouched
- Minimum bid
  - One lookup rule: manual and proxy bidding select the tier from the amount being beaten, read from the configured schedule
  - Opening price: before any bid, the minimum is the starting price, or the lowest configured increment on a 0 start
  - Whole-dollar bids: a bid or a maximum is a whole-dollar amount at or above the minimum, and one that is not is refused

## MODIFIED Requirements

### Requirement: Grade10 owns the supported-currency schedules

Grade10 SHALL price Auction listings only in `USD`. One schedule governs every
auction. The schedule is configuration, not a requirement: an ordered set of
lower-inclusive price tiers, each pairing a Price from with an Increment. The
last tier has no upper bound. Every amount is an integer count of minor units
paired with `USD`. No requirement states a tier amount, and the values in force
are the configuration's, shown under Bid Increments on the Bidding page of the
manual.

Every Price from and every Increment SHALL be a whole-dollar amount: an integer
count of minor units that is a multiple of one major unit of `USD`. The count
per major unit comes from the USD exponent of the money module, not from a
figure in a requirement. An Increment SHALL also be positive.

The schedule SHALL hold a first tier from 0, so no amount lies below the first
tier. Like every other tier, the first tier's increment is a configured value.
Tiers SHALL ascend by Price from with no two tiers sharing one, and the
schedule SHALL NOT be empty.

Grade10 SHALL select the tier with the greatest Price from that does not exceed
the amount being raised from. It SHALL NOT retain a per-listing increment or
minimum. A change to the configured values SHALL apply to the next bid on every
lot, open lots included, and SHALL NOT change the amount of a bid already
standing. The HKD and JPY schedules no longer exist.

Scenario `grade10-site-auction-bid-increments-SC-01` keeps its title with its
id. The title is historical: a first bid may stand on the starting price.

<!-- trace:scenario id=g10.auction-bid-increments.SC-vqb rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-01 - A first bid clears the starting-price tier
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing with a starting price of 20000 minor units and no accepted bid
- **WHEN** a collector reads its minimum bid
- **THEN** Grade10 reports 20000 minor units, the starting price

<!-- trace:scenario id=g10.auction-bid-increments.SC-mn9 rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-02 - A boundary selects the higher tier
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** the configured schedule, and for each tier after the first, an open USD listing whose current bid equals that tier's Price from
- **WHEN** Grade10 calculates its minimum bid
- **THEN** the minimum bid is the current bid plus that tier's increment, not the previous tier's
- **AND** a listing whose current bid is one whole dollar below that Price from takes the previous tier's increment

<!-- trace:scenario id=g10.auction-bid-increments.SC-u6t rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-03 - A bid may exceed the minimum
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose minimum bid is M minor units
- **WHEN** a collector bids a whole-dollar amount greater than M minor units
- **THEN** Grade10 accepts the bid

<!-- trace:scenario id=g10.auction-bid-increments.SC-b2w rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-04 - A bid below the minimum is refused
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose minimum bid is M minor units
- **WHEN** a collector bids M minus one whole dollar
- **THEN** Grade10 refuses the bid and names M minor units as the minimum

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
Every tier increment SHALL be read from the configured schedule in force when
the minimum is calculated, and the minimum SHALL NOT be stored.

A bid or a maximum SHALL be a whole-dollar amount at or above the minimum next
amount. Grade10 SHALL accept any such amount and refuse an amount below the
minimum. Grade10 SHALL refuse an amount that is not whole dollars, naming the
rule, and leave the price, the leader and every maximum unchanged. It SHALL not
create intermediate bids.

<!-- trace:scenario id=g10.auction-bid-increments.SC-xjw rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-07 - A manual floor uses the current public price
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open USD listing whose current public price is P minor units, and whose configured tier for P has an increment of X minor units
- **WHEN** Grade10 calculates the next minimum
- **THEN** the minimum is P plus X minor units

<!-- trace:scenario id=g10.auction-bid-increments.SC-w8f rev=3 -->
#### Scenario: grade10-site-auction-bid-increments-SC-12 - A 0 start opens at the lowest increment
**Serves:** grade10-site-auction-bid-increments-US-01 - Collector places a bid across a price tier

- **GIVEN** an open `USD` listing with a starting price of 0 and no accepted bid
- **WHEN** a collector reads its minimum bid
- **THEN** Grade10 reports the increment of the lowest configured tier, the tier that holds 0

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

### Requirement: Every lot is bid in USD and no other currency stays

Grade10 SHALL price and bid every Auction listing in USD: the starting price,
every bid, every auto-bid maximum, the minimum next amount, the increment and
the ceiling. A collector SHALL always type USD. No listing SHALL carry another
currency, and no schedule or ceiling SHALL exist for HKD or JPY.

A listing that carried another currency before this change SHALL be read as
USD with its amounts unchanged and nothing converted, per
`grade10-admin/auction/listing`.

<!-- trace:scenario id=g10.auction-bid-increments.SC-tke rev=2 -->
#### Scenario: grade10-site-auction-bid-increments-SC-13 - An overwritten listing bids on the USD schedule
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **GIVEN** an open listing whose currency was `HKD` and was overwritten to
  `USD`, with a current bid of 800000 minor units
- **WHEN** Grade10 calculates its minimum bid
- **THEN** the minimum bid is 800000 minor units plus the configured increment for 800000 minor units, in USD

<!-- trace:scenario id=g10.auction-bid-increments.SC-ws7 rev=1 -->
#### Scenario: grade10-site-auction-bid-increments-SC-14 - A listing publishes its amounts in USD
**Serves:** grade10-site-auction-bid-increments-US-03 - Collector bids in USD on every lot

- **WHEN** a collector reads an open listing
- **THEN** its starting price, current bid, minimum next amount and ceiling
  are each an integer count of minor units paired with `USD`
