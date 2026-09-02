# Bid increments — delta

## Purpose

How far a bid must clear the one before it. A listing carries a table of price
ranges, each with the increment that applies inside it, so a lot steps in small
amounts when it is cheap and large amounts once it is not. This capability owns
the table, what makes one valid, how a tier is found, and the minimum bid the
table produces on an active listing.

## ADDED Requirements

### Requirement: A listing carries an increment table

Every Auction listing SHALL carry an **increment table**: an ordered list of
one or more tiers. Each tier SHALL state the amount it starts at and the
increment that applies inside it, both as integer counts of minor units in the
listing's currency.

A table SHALL be valid only when all of the following hold:

- The first tier starts at zero.
- Each later tier starts above the tier before it.
- The last tier has no upper bound.
- Every increment is greater than zero.

Tiers SHALL be contiguous: a tier runs from the amount it starts at up to, but
not including, the amount the next tier starts at. There SHALL be no gap and no
overlap, and no amount from zero upward SHALL fall outside the table.

Grade10 SHALL refuse a table that is not valid, and SHALL name the tier that
fails.

#### Scenario: bid-increments-SC-01 - A table covers every amount from zero

- **GIVEN** a listing whose increment table starts at zero and whose last tier has no upper bound
- **WHEN** Grade10 looks up any amount from zero upward
- **THEN** exactly one tier contains it

#### Scenario: bid-increments-SC-02 - A table not starting at zero is refused

- **GIVEN** a proposed increment table whose first tier starts at 1000 minor units
- **WHEN** an operator saves it
- **THEN** Grade10 refuses it
- **AND** it names the first tier as the one that fails

#### Scenario: bid-increments-SC-03 - A table with a zero increment is refused

- **GIVEN** a proposed increment table with a tier whose increment is 0 minor units
- **WHEN** an operator saves it
- **THEN** Grade10 refuses it
- **AND** it names that tier

#### Scenario: bid-increments-SC-04 - A table whose tiers do not ascend is refused

- **GIVEN** a proposed increment table whose third tier starts at or below its second
- **WHEN** an operator saves it
- **THEN** Grade10 refuses it
- **AND** it names that tier

#### Scenario: bid-increments-SC-05 - A single-tier table is valid

- **GIVEN** a proposed increment table of one tier starting at zero with an increment of 2500 minor units
- **WHEN** an operator saves it
- **THEN** Grade10 accepts it
- **AND** every amount from zero upward takes an increment of 2500 minor units

### Requirement: A tier is found by the amount it contains

Grade10 SHALL find an amount's tier as the tier whose start is the greatest
start not above that amount. The increment for an amount SHALL be that tier's
increment.

An amount equal to a tier's start SHALL fall in that tier, not the one below.

#### Scenario: bid-increments-SC-06 - An amount inside a tier

- **GIVEN** the house default table, where the tier starting at 20000 minor units has an increment of 2500
- **WHEN** Grade10 finds the increment for 22500 minor units
- **THEN** the increment is 2500 minor units

#### Scenario: bid-increments-SC-07 - An amount on a tier boundary takes the higher tier

- **GIVEN** the house default table, where a tier starts at 50000 minor units with an increment of 5000, and the tier below it starts at 20000 with an increment of 2500
- **WHEN** Grade10 finds the increment for exactly 50000 minor units
- **THEN** the increment is 5000 minor units

#### Scenario: bid-increments-SC-08 - An amount below every other tier

- **GIVEN** the house default table, whose first tier starts at zero with an increment of 200 minor units
- **WHEN** Grade10 finds the increment for 100 minor units
- **THEN** the increment is 200 minor units

#### Scenario: bid-increments-SC-09 - An amount above every tier start

- **GIVEN** the house default table, whose last tier starts at 150000000 minor units with an increment of 10000000
- **WHEN** Grade10 finds the increment for 900000000 minor units
- **THEN** the increment is 10000000 minor units

### Requirement: The minimum bid on an active listing

For a listing open for bids, Grade10 SHALL determine the **minimum bid** as
follows:

- WHEN the listing has no accepted bid, the minimum bid SHALL be its starting
  price plus the increment for the tier containing the **starting price**.
- WHEN the listing has an accepted bid, the minimum bid SHALL be the current
  bid plus the increment for the tier containing the **current bid**.

In both cases the amount stepped from is the amount a bidder must beat: the
starting price before anyone has bid, the current bid afterwards. A listing's
starting price is always greater than zero, so the minimum bid always stands
above the starting price and can never be zero.

Grade10 SHALL refuse a bid below the minimum bid and SHALL name the minimum
bid when it does.

Grade10 SHALL publish the minimum bid as a fact of an open listing, so a
bidder is told what will be accepted before they attempt it.

#### Scenario: bid-increments-SC-10 - The first bid clears the starting price by one increment

- **GIVEN** an open listing on the house default table with a starting price of 20000 minor units and no accepted bid
- **AND** the tier containing 20000 minor units has an increment of 2500
- **WHEN** a bidder reads its minimum bid
- **THEN** the minimum bid is 22500 minor units

#### Scenario: bid-increments-SC-11 - A first bid at the minimum is accepted

- **GIVEN** the listing from the previous scenario
- **WHEN** a bidder bids exactly 22500 minor units
- **THEN** Grade10 accepts the bid

#### Scenario: bid-increments-SC-12 - A first bid at the starting price is refused

- **GIVEN** the listing from the previous scenario
- **WHEN** a bidder bids exactly 20000 minor units
- **THEN** Grade10 refuses the bid
- **AND** it names 22500 minor units as the minimum bid

#### Scenario: bid-increments-SC-13 - The minimum bid steps by the current bid's tier

- **GIVEN** an open listing on the house default table whose current bid is 22500 minor units
- **WHEN** a bidder reads its minimum bid
- **THEN** the minimum bid is 25000 minor units

#### Scenario: bid-increments-SC-14 - The minimum bid crosses into a higher tier

- **GIVEN** an open listing on the house default table whose current bid is 49900 minor units, in the tier starting at 20000 with an increment of 2500
- **WHEN** a bidder reads its minimum bid
- **THEN** the minimum bid is 52400 minor units
- **AND** that amount lies in the tier starting at 50000, which is permitted

#### Scenario: bid-increments-SC-15 - A bid below the minimum is refused by name

- **GIVEN** an open listing on the house default table whose current bid is 22500 minor units
- **WHEN** a bidder bids 24000 minor units
- **THEN** Grade10 refuses the bid
- **AND** it names 25000 minor units as the minimum bid

#### Scenario: bid-increments-SC-16 - A bid above the minimum is accepted

- **GIVEN** an open listing on the house default table whose current bid is 22500 minor units
- **WHEN** a bidder bids 40000 minor units
- **THEN** Grade10 accepts the bid

#### Scenario: bid-increments-SC-17 - The minimum bid is published

- **WHEN** a collector reads an open listing
- **THEN** its facts carry the minimum bid as an integer count of minor units with the listing's ISO 4217 currency code

#### Scenario: bid-increments-SC-22 - The first minimum uses the starting price's own tier

- **GIVEN** an open listing on the house default table with a starting price of 60000 minor units and no accepted bid
- **AND** the tier containing 60000 minor units has an increment of 5000
- **WHEN** a bidder reads its minimum bid
- **THEN** the minimum bid is 65000 minor units

### Requirement: A listing's table is seeded from the house default

Grade10 SHALL hold a **house default increment table** per currency it sells
in. When a listing is created without a table of its own, Grade10 SHALL copy
the house default for that listing's currency onto the listing.

The copy SHALL be a copy. A later change to the house default SHALL NOT alter
a listing that already holds a table.

An authorized operator SHALL be able to change the house default table. Doing
so SHALL be refused when the proposed table is not valid.

Grade10's house default table for `HKD` SHALL be the tiers below, stated as
the amount each starts at and its increment, in minor units:

| Starts at | Increment |
| --- | --- |
| 0 | 200 |
| 5000 | 500 |
| 10000 | 1000 |
| 20000 | 2500 |
| 50000 | 5000 |
| 100000 | 10000 |
| 250000 | 25000 |
| 500000 | 50000 |
| 1000000 | 100000 |
| 2000000 | 200000 |
| 3000000 | 300000 |
| 5000000 | 500000 |
| 10000000 | 1000000 |
| 20000000 | 2000000 |
| 30000000 | 2500000 |
| 60000000 | 5000000 |
| 100000000 | 5000000 |
| 150000000 | 10000000 |

#### Scenario: bid-increments-SC-18 - A created listing takes the house default

- **GIVEN** an operator creating an `HKD` listing without setting an increment table
- **WHEN** Grade10 creates it
- **THEN** the listing holds the house default `HKD` table
- **AND** its tier starting at 20000 minor units has an increment of 2500

#### Scenario: bid-increments-SC-19 - Changing the house default leaves existing listings alone

- **GIVEN** a created listing holding a copy of the house default table
- **WHEN** an authorized operator changes the house default table
- **THEN** the listing's own table is unchanged

#### Scenario: bid-increments-SC-20 - An invalid house default is refused

- **GIVEN** an authorized operator editing the house default table
- **WHEN** they save a table whose first tier does not start at zero
- **THEN** Grade10 refuses the change
- **AND** the house default table is unchanged

#### Scenario: bid-increments-SC-21 - An unauthorized operator cannot change the house default

- **GIVEN** a signed-in operator who may not set an auction's prices
- **WHEN** they change the house default table
- **THEN** Grade10 refuses the change
