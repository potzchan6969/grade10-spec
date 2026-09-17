# grade10-site/auction/winner-order Specification

## Purpose
Keeps the invoice premium calculated from the winning bid while disclosing its
rate earlier on the bid panel. The winner order also carries one invoice per
lot, its confirmed delivery address, settlement, deadline, receipt, tracker
and delivery proof.

## Feature set

- Invoice premium
  - Fixed rate: 20% of the winning bid
  - Integer amount: rounded to the nearest minor unit
  - Bid-panel boundary: only the rate appears before invoicing
- Premium minimum
  - Currency minimum: the current Auction Payment settings mapping sets the lower bound for the calculated premium

## ADDED Requirements

### Requirement: An invoice calculates the buyer's premium

When Grade10 creates or reissues an auction invoice, the buyer's premium SHALL
be the larger of 20% of the winning bid and the current minimum for the invoice
currency. The percentage amount is rounded to the nearest minor unit with half
values rounded up. A minimum of 0 means no minimum. The
premium SHALL be included in the invoice final amount and in every invoice
receipt. A bid panel SHALL disclose only the 20% rate; it SHALL not display this
calculated amount before an invoice exists.

#### Scenario: grade10-site-auction-winner-order-SC-46 - Invoice carries 20% of the winning bid
**Serves:** grade10-site-auction-winner-order-US-07 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 250000 HKD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the invoice buyer's premium is 50000 HKD minor units
- **AND** the final amount includes that 50000 HKD premium

#### Scenario: grade10-site-auction-winner-order-SC-47 - Fractional minor-unit premium rounds deterministically
**Serves:** grade10-site-auction-winner-order-US-07 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 101 USD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the buyer's premium is 20 USD minor units
- **AND** the amount is an integer minor-unit value
