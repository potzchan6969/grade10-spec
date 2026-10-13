# grade10-admin/auction/payment-settings Specification

## Feature set

- Settlement currencies
  - Card rule per settlement currency: Finance holds one card fee rule each for `USD` and `HKD`; USD and HKD launch with none
  - Bank details per settlement currency: Grade10 holds USD and HKD details, a sample account outside production and the account Finance confirms in production
  - Buyer's premium minimum: read for the order's settlement currency; JPY stays in the mapping, dormant

## ADDED Requirements

### Requirement: Card rules and bank details are read per settlement currency

Payment Settings SHALL hold, for each of `USD` and `HKD`, at most one card fee
rule, and Grade10 SHALL read the rule and the bank details of the order's
settlement currency when it offers a method and when it prices an invoice. A
currency with no card rule SHALL NOT offer card, and a currency with no bank
details SHALL NOT offer bank transfer, per `grade10-site/auction/winner-order`.
The `JPY` entries stay in the mapping and no order reads them.

#### Scenario: grade10-admin-auction-payment-settings-SC-XX - An HKD order reads the HKD rule

- **GIVEN** Payment Settings holds an HKD card rule and no USD card rule
- **WHEN** a winner settling in HKD reaches the payment-method step
- **THEN** card is offered

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
