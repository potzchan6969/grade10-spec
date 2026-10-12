# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Winner's choice at setup: while confirming the order the winner picks USD or HKD as the settlement currency
  - Order in the chosen currency: the invoice, order total, fees, payments, refunds and order letters carry the settlement currency; the winning bid stays a USD fact
  - ❓ Conversion: the rate's source, lock point and rounding are pending PM/Finance
  - ❓ Disclosure: whether the invoice and letters print the USD winning bid beside the converted totals is pending PM

## ADDED Requirements

### Requirement: The winner chooses a settlement currency at order setup

At order setup the winner SHALL choose the order's settlement currency from
`USD` and `HKD`; nothing is preselected. Once an invoice is sent the order's
currency SHALL NOT change.

The invoice and every payment, refund and order letter for that order SHALL
carry the settlement currency. A bid amount on a winner-facing surface SHALL
stay in the lot's USD. Payment-method availability — card fee rule, bank
details — SHALL key off the settlement currency.

❓ The USD→HKD conversion rate's source, the moment it locks, and the rounding
applied are pending PM/Finance and are not specified by this requirement.

#### Scenario: grade10-site-auction-winner-order-SC-XX - Winner picks settlement currency at setup

- **GIVEN** a winner setting up an order won on a `USD` lot
- **WHEN** they open the payment-method step
- **THEN** they choose USD or HKD settlement before confirming
- **AND** the invoice carries the chosen currency

#### Scenario: grade10-site-auction-winner-order-SC-XX - Payment methods key off the settlement currency

- **GIVEN** a winner settling in `HKD`
- **WHEN** the payment methods are listed
- **THEN** each method offered follows the HKD card rule and HKD bank details,
  not the lot's USD

## MODIFIED Requirements

None — existing payment-method "by currency" phrasing now reads against the
settlement currency; the requirement text is unchanged until the PM confirms.

## REMOVED Requirements

None.
