# grade10-site/auction/winner-order Specification

## Feature set

- USD settlement
  - Order in USD: an auction order is a USD order; the invoice, order total, fees, payments, refunds and order letters carry `USD`, as the winning bid does
  - Methods in USD: card where Payment Settings holds a USD card rule; bank transfer where Grade10 holds USD bank details
  - Rails in USD: View Bank Details shows Hong Kong local bank transfer and SWIFT, and no FPS
  - HKD settlement: out of scope here, per `add-hkd-settlement`

## ADDED Requirements

### Requirement: An auction order is settled in USD

An auction order SHALL carry `USD` as its currency from the win, and the
invoice and every payment, refund and order letter for that order SHALL carry
`USD`. A winner-facing amount SHALL read `US$`. Payment-method availability -
card fee rule, bank details, minimum charge - SHALL read the USD entries.

For a USD order Grade10 SHALL offer card, Hong Kong local bank transfer and
overseas transfer by SWIFT, each only where Grade10 can take it, per "The winner
chooses a payment method with the address". Bank transfer is one choice at
setup; its rails are read on the invoice, per "A bank transfer invoice shows how
to pay". View Bank Details SHALL show the Hong Kong local and SWIFT rails of
the USD account and SHALL NOT show FPS.

#### Scenario: grade10-site-auction-winner-order-SC-XX - A USD order offers card and bank transfer

- **GIVEN** an auction order in USD Awaiting Setup, where Grade10 holds USD
  bank details and Payment Settings holds a USD card rule
- **WHEN** the winner reaches the payment-method step
- **THEN** card and bank transfer are offered
- **AND** no settlement-currency choice is shown

#### Scenario: grade10-site-auction-winner-order-SC-XX - A USD order's bank details show Hong Kong local and SWIFT

- **GIVEN** a USD bank transfer invoice
- **WHEN** the winner opens View Bank Details
- **THEN** the dialog shows the Hong Kong local and SWIFT rails
- **AND** it shows no FPS rail

## MODIFIED Requirements

The by-currency phrasing in "The winner chooses a payment method with the
address" - offered by currency, the sample HKD account and the HKD-only bank
details table - reads against the USD order's entries while this change is
the only one in force. The requirement text itself is unchanged until the PM
confirms.

## REMOVED Requirements

None.
