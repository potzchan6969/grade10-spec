## Feature set

- Invoice
  - Fee tooltips: Buyer’s Premium, Shipping & Handling, Insurance and Payment Processing Fee carry brief info tooltips on the order summary when those lines are shown
  - Insurance before send: before the invoice is sent, Order Summary shows Insurance as TBD with the other fee rows; after send, Insurance stays optional and absent when none
  - Insurance tip copy: the Insurance tooltip reads `0.9% of the order value during transit.`

## ADDED Requirements

### Requirement: Insurance info tooltip

On Winner Order's order summary, Insurance explains itself when the line is
shown.

**Tooltip** - When the Insurance line is shown, Grade10 SHALL offer a brief
info tooltip beside it.

**Copy** - The tooltip SHALL read `0.9% of the order value during transit.`

#### Scenario: winner-order-SC-169 - A shown Insurance line carries its info tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an invoice with Insurance of 4000 minor units in
  HKD
- **WHEN** the winner opens Winner Order
- **THEN** the Insurance line shows 4000 minor units in HKD
- **AND** the line offers a brief info tooltip
- **AND** the tooltip reads `0.9% of the order value during transit.`

#### Scenario: winner-order-SC-170 - An absent Insurance line offers no tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an invoice without adding Insurance
- **WHEN** the winner opens Winner Order
- **THEN** no Insurance line is shown
- **AND** no Insurance tooltip is offered

### Requirement: Insurance before the invoice is sent

Before an operator sends the invoice, Order Summary names Insurance without an
amount.

**Before send** - Before an operator has sent the invoice, Winner Order's order
summary SHALL show Insurance as TBD with the other fee rows.

**No amount** - Grade10 SHALL NOT show a calculated Insurance amount before the
invoice is sent.

#### Scenario: winner-order-SC-171 - Insurance reads TBD before the invoice is sent
**Serves:** winner-order-US-01 - the winner reads Order Summary before the
invoice is sent

- **GIVEN** an auction order before an operator has sent its invoice
- **WHEN** the winner reads the order summary
- **THEN** Insurance is shown as TBD with the other fee rows
- **AND** no calculated Insurance amount is shown
- **AND** the Insurance line offers a brief info tooltip that reads
  `0.9% of the order value during transit.`
