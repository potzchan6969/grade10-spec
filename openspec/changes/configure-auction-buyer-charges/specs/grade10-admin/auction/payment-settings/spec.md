# grade10-admin/auction/payment-settings Specification

## Purpose
Lets a settlement-authorized operator manage the minimum buyer-premium mapping
used by auction invoices from the Auction admin section.

## Feature set

- Payment settings
  - Auction tab: Payment settings lives under `/auction`
  - Currency mapping: USD, HKD, and JPY each have one non-negative integer minor-unit minimum
  - Safe defaults: USD 0, HKD 0, and JPY 0 minor units
  - Authorized writes: settlement permission is required to read or change values

## ADDED Requirements

### Requirement: Operators manage auction currency premium minimums

Grade10 SHALL expose a Payment settings tab under the `/auction` admin section
to an operator with the auction settlement permission. The tab SHALL show
exactly one current non-negative integer minimum buyer-premium amount in minor
units for each of USD, HKD, and JPY. A save SHALL replace the complete mapping
atomically and record the acting operator and timestamp. The initial mapping
SHALL be USD 0, HKD 0, and JPY 0 minor units.

An operator without the auction settlement permission SHALL not receive the
mapping and SHALL not be able to save it. A save with a missing currency, an
unsupported currency, a negative amount, or a non-integer amount SHALL be
refused without changing any stored value.

#### Scenario: grade10-admin-auction-payment-settings-SC-01 - Settlement operator reads all currency minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator has the auction settlement permission
- **WHEN** they open Payment settings under `/auction`
- **THEN** Grade10 shows USD 0, HKD 0, and JPY 0 minor units on the initial mapping

#### Scenario: grade10-admin-auction-payment-settings-SC-02 - Settlement operator replaces the mapping
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator has the auction settlement permission
- **WHEN** they save USD 100, HKD 500, and JPY 100 as non-negative integer minor units
- **THEN** Grade10 stores and returns exactly that complete mapping
- **AND** records the acting operator and save timestamp

#### Scenario: grade10-admin-auction-payment-settings-SC-03 - Invalid mapping is atomic
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** the current mapping is USD 0, HKD 0, and JPY 0 minor units
- **WHEN** an operator submits a mapping with an unsupported currency or a negative amount
- **THEN** Grade10 refuses the save
- **AND** all three stored values remain unchanged

#### Scenario: grade10-admin-auction-payment-settings-SC-04 - Other operators cannot read or write minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator lacks the auction settlement permission
- **WHEN** they request or submit Payment settings
- **THEN** Grade10 refuses the operation
