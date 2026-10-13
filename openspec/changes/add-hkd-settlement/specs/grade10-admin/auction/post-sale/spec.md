# grade10-admin/auction/post-sale Specification

## Feature set

- Invoice in the settlement currency
  - Currency of the order: the operator sends the invoice in the winner's chosen currency, `USD` or `HKD`
  - HKD amounts: for an HKD order the operator enters the HKD amounts; Grade10 holds no rate and converts nothing

## ADDED Requirements

### Requirement: The operator sends the invoice in the settlement currency

The operator SHALL send an invoice in the order's settlement currency, and
every amount on it, including fees and the order total, SHALL be in that
currency. For an `HKD` order the operator SHALL enter each amount in HKD;
Grade10 SHALL NOT convert the winning bid and SHALL NOT offer a rate.

#### Scenario: grade10-admin-auction-post-sale-SC-XX - An HKD order is invoiced in HKD

- **GIVEN** an order whose winner confirmed HKD settlement
- **WHEN** the operator prepares the invoice
- **THEN** the amounts are entered and shown in HKD

## MODIFIED Requirements

None.

## REMOVED Requirements

None.
