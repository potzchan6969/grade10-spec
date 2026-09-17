## Feature set

- Invoice
  - Buyer's premium: 20% of the winning bid or the currency's minimum charge, whichever is higher, computed by Grade10

## ADDED Requirements

### Requirement: Grade10 computes the buyer's premium

Grade10 SHALL compute every invoice's buyer's premium; no operator SHALL
enter, waive or change it. The premium SHALL be the larger of:

1. 20% of the hammer price (read by the winner as Winning Bid) alone,
   rounded half up to the nearest minor unit, and
2. the minimum charge for the lot's currency.

Shipping, insurance and tax SHALL NOT be part of its base. The premium SHALL be
an integer count of minor units in the lot's currency.

Grade10 owns one minimum charge per supported currency:

| Currency | Minimum charge (minor units) |
| --- | --- |
| USD | 0 |
| HKD | 0 |
| JPY | 0 |

A minimum of 0 SHALL mean no minimum. A changed rate or minimum SHALL apply
to invoices sent or reissued after it takes effect; an invoice already sent
SHALL keep its amounts.

#### Scenario: winner-order-SC-40 - The premium is 20% of the winning bid
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 250000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 50000 minor units in HKD
- **AND** the operator was not asked to enter it

#### Scenario: winner-order-SC-41 - The minimum charge applies when it is higher
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 50000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 20000 minor units in HKD

#### Scenario: winner-order-SC-42 - A zero minimum leaves the rounded 20%
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the JPY minimum charge is 0
- **AND** an auction order with a hammer price of 1003 minor units in JPY
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 201 minor units in JPY

#### Scenario: winner-order-SC-43 - A sent invoice keeps its premium when the minimum changes
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** an invoice sent with a hammer price of 50000 and a buyer's premium of 10000 minor units in HKD while the HKD minimum was 0
- **WHEN** the HKD minimum changes to 20000 minor units
- **THEN** that invoice's buyer's premium stays 10000 minor units in HKD
- **AND** an invoice reissued for that order afterwards carries 20000 minor units in HKD
