## Feature set

- Bid ceiling
  - Per-currency ceiling: one upper limit for every lot in USD, HKD, and JPY
  - Refusal above it: a manual bid or an auto-bid maximum above the ceiling is refused

## ADDED Requirements

### Requirement: A bid never exceeds its currency's ceiling

Grade10 SHALL hold every Auction bid amount to one ceiling for the listing's
currency, the same on every lot. Operators SHALL NOT change it.

| Currency | Ceiling (minor units) | Ceiling as read |
| --- | --- | --- |
| USD | 1000000000 | USD 10,000,000 |
| HKD | 8000000000 | HKD 80,000,000 |
| JPY | 150000000000 | JPY 150,000,000,000 |

Grade10 SHALL accept an amount equal to the ceiling. It SHALL refuse a manual
bid or an auto-bid maximum above the ceiling, name the ceiling in the refusal,
and leave the listing's price, leader and every maximum unchanged. When the
minimum next amount would exceed the ceiling, Grade10 SHALL refuse every
further bid on that listing.

#### Scenario: grade10-site-auction-bid-increments-SC-08 - A bid at the ceiling is accepted

- **GIVEN** an open USD listing whose minimum bid is 999990000 minor units
- **WHEN** a collector bids 1000000000 minor units
- **THEN** Grade10 accepts the bid

#### Scenario: grade10-site-auction-bid-increments-SC-09 - A bid above the ceiling is refused

- **GIVEN** an open HKD listing whose minimum bid is 820000 minor units
- **WHEN** a collector bids 8000000001 minor units
- **THEN** Grade10 refuses the bid and names 8000000000 minor units as the ceiling
- **AND** the listing's price and leader are unchanged

#### Scenario: grade10-site-auction-bid-increments-SC-10 - An auto-bid maximum above the ceiling is refused

- **GIVEN** an open JPY listing whose minimum bid is 150000 minor units
- **WHEN** a collector commits an auto-bid maximum of 150000000001 minor units
- **THEN** Grade10 refuses the maximum and names 150000000000 minor units as the ceiling
- **AND** no maximum is recorded for that collector

#### Scenario: grade10-site-auction-bid-increments-SC-11 - A listing at the ceiling takes no further bid

- **GIVEN** an open USD listing whose current bid is 1000000000 minor units
- **WHEN** another collector bids on it
- **THEN** Grade10 refuses the bid and names 1000000000 minor units as the ceiling
