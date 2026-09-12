## Feature set

- Stock is a ceiling
  - Supplied maximum: a line's stepper stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a line supplied none keeps a stepper that counts on
- What is left, said
  - Supplied remaining count: the line displays how many are left, in the consumer's own words
  - Consumer decides when: the line shows what it is given and judges nothing about scarcity

## ADDED Requirements

### Requirement: A cart line's stepper stops at its supplied maximum

A line's stepper SHALL NOT invoke `onQuantityChange` with a quantity above the
maximum the consumer supplies for that line. At that maximum the increment
control SHALL be inoperable and SHALL be exposed as unavailable to assistive
technology.

Where the consumer supplies no maximum for a line, its stepper SHALL report
whatever quantity the shopper asks for. `CartItem` SHALL NOT derive a maximum
from the line's quantity or its status.

Decrement is unaffected at the maximum, and removal at quantity one SHALL go
on being reported as it is today.

#### Scenario: shared-ui-store-cart-SC-17 - The stepper stops at the maximum

- **GIVEN** a line supplied with a quantity of `2` and a maximum of `2`
- **WHEN** the shopper activates its increment control
- **THEN** `onQuantityChange` is not invoked
- **AND** the control is exposed as unavailable

#### Scenario: shared-ui-store-cart-SC-18 - No maximum supplied

- **GIVEN** a line supplied with a quantity of `2` and no maximum
- **WHEN** the shopper activates its increment control
- **THEN** `onQuantityChange` is invoked with `3`

#### Scenario: shared-ui-store-cart-SC-19 - Decrement still works at the maximum

- **GIVEN** a line supplied with a quantity of `2` and a maximum of `2`
- **WHEN** the shopper activates its decrement control
- **THEN** `onQuantityChange` is invoked with `1`

### Requirement: A cart line displays a supplied remaining count

A line SHALL display a remaining count where the consumer supplies one for
that line, and none where the consumer supplies none. The count SHALL be
displayed as supplied: `CartItem` SHALL NOT derive it, format it, or decide
from it that a line is nearly out.

A line displaying the low-stock warning SHALL be able to display both, since
one says what was already changed and the other says what is left.

#### Scenario: shared-ui-store-cart-SC-20 - A remaining count is displayed as supplied

- **GIVEN** a line supplied with a remaining count of `Only 2 left`
- **WHEN** the drawer is rendered
- **THEN** `Only 2 left` is displayed on that line
- **AND** no other remaining-count copy is shown

#### Scenario: shared-ui-store-cart-SC-21 - No remaining count supplied

- **GIVEN** a line supplied with no remaining count
- **WHEN** the drawer is rendered
- **THEN** no remaining count is displayed on that line
