# Bid increments — delta

## Purpose

Makes the next auction bid proportionate to the price being beaten, using one
Grade10-owned schedule for each supported auction currency.

## Feature set

- Currency schedules
  - Fixed policy: Grade10 owns the USD, HKD, and JPY tiers
  - Currency boundary: unsupported currencies cannot price an auction
- Minimum bid
  - One lookup rule: manual and proxy bidding select the tier from the amount
    being beaten
  - Flexible offer: a bidder may exceed, but not fall below, the minimum

## ADDED Requirements

### Requirement: Grade10 owns the supported-currency schedules

Grade10 SHALL price Auction listings only in `USD`, `HKD`, or `JPY`. The
schedule for a currency is an ordered set of lower-inclusive price tiers. The
last tier has no upper bound. Every amount is an integer count of minor units
paired with that ISO 4217 currency.

| Currency | Price from (minor units) | Increment (minor units) |
| --- | ---: | ---: |
| USD | 0 | 100 |
| USD | 10000 | 500 |
| USD | 50000 | 1000 |
| USD | 100000 | 2500 |
| USD | 500000 | 5000 |
| USD | 1000000 | 10000 |
| HKD | 0 | 1000 |
| HKD | 80000 | 4000 |
| HKD | 400000 | 8000 |
| HKD | 800000 | 20000 |
| HKD | 4000000 | 40000 |
| HKD | 8000000 | 80000 |
| JPY | 0 | 100 |
| JPY | 15000 | 500 |
| JPY | 75000 | 1000 |
| JPY | 150000 | 4000 |
| JPY | 750000 | 8000 |
| JPY | 1500000 | 15000 |

Grade10 SHALL select the tier with the greatest Price from that does not exceed
the amount being raised from. It SHALL NOT retain a per-listing increment or
apply a USD, HKD, or JPY schedule to another currency.

#### Scenario: grade10-site-auction-bid-increments-SC-01 - A first bid clears the starting-price tier

- **GIVEN** an open HKD listing with a starting price of 20000 minor units and no accepted bid
- **WHEN** a collector reads its minimum bid
- **THEN** Grade10 reports 21000 minor units

#### Scenario: grade10-site-auction-bid-increments-SC-02 - A boundary selects the higher tier

- **GIVEN** an open USD listing whose current bid is 10000 minor units
- **WHEN** Grade10 calculates its minimum bid
- **THEN** the minimum bid is 10500 minor units

#### Scenario: grade10-site-auction-bid-increments-SC-03 - A bid may exceed the minimum

- **GIVEN** an open USD listing whose minimum bid is 10500 minor units
- **WHEN** a collector bids 12000 minor units
- **THEN** Grade10 accepts the bid

#### Scenario: grade10-site-auction-bid-increments-SC-04 - A bid below the minimum is refused

- **GIVEN** an open USD listing whose minimum bid is 10500 minor units
- **WHEN** a collector bids 10499 minor units
- **THEN** Grade10 refuses the bid and names 10500 minor units as the minimum

#### Scenario: grade10-site-auction-bid-increments-SC-05 - An open listing publishes its next minimum

- **WHEN** a collector reads an open listing
- **THEN** its facts include the minimum next amount as integer minor units in the listing currency

### Requirement: The minimum uses the amount being beaten

Before any accepted bid, Grade10 SHALL add the starting-price tier increment
to the starting price. After an accepted manual bid, it SHALL add the current
public-price tier increment to that price. With two or more proxy maxima, it
SHALL add the second-highest maximum's tier increment to that maximum and cap
the result at the leader's maximum. The result is the minimum next amount.

Grade10 SHALL accept any whole amount at or above the minimum next amount and
refuse an amount below it. It SHALL not create intermediate bids.

#### Scenario: grade10-site-auction-bid-increments-SC-07 - A manual floor uses the current public price

- **GIVEN** an open HKD listing whose current public price is 800000 minor units
- **WHEN** Grade10 calculates the next minimum
- **THEN** the minimum is 820000 minor units

### Requirement: Unsupported currencies are refused before auctioning

Grade10 SHALL refuse an attempt to create, update, or schedule an Auction
listing in a currency other than USD, HKD, or JPY. The refusal SHALL leave the
listing and its schedule-derived pricing facts unchanged.

#### Scenario: grade10-site-auction-bid-increments-SC-06 - An unsupported currency cannot be scheduled

- **GIVEN** a complete draft listing
- **WHEN** an operator sets its currency to EUR and schedules it
- **THEN** Grade10 refuses the request
- **AND** the listing remains unscheduled
