## Feature set

- Stock is a ceiling
  - Supplied maximum: the cart control stops where the consumer says the shop's count stops
  - No maximum, no ceiling: a consumer that supplies none keeps a control that counts on
- What is left, said
  - Supplied remaining count: the card displays how many are left, in the consumer's own words
  - Consumer decides when: the card shows what it is given and judges nothing about scarcity

## ADDED Requirements

### Requirement: The cart control stops at a supplied maximum

The cart control SHALL NOT report a quantity above a maximum the consumer
supplies. At that maximum the increment affordance SHALL be inoperable, SHALL
be exposed as unavailable to assistive technology, and SHALL leave the
reported quantity unchanged when activated.

Where the consumer supplies no maximum, the control SHALL report whatever
quantity the shopper asks for, without a ceiling of its own. The card SHALL
NOT derive a maximum from the supplied count, the in-cart condition, or the
sold-out condition.

Decrement is unaffected at the maximum, so a shopper who reaches it can still
go back down.

#### Scenario: shared-ui-store-product-listing-SC-56 - The control stops at the maximum

- **GIVEN** a product supplied as in the cart with a count of `2` and a maximum of `2`
- **WHEN** a shopper activates the increment affordance
- **THEN** no quantity is reported
- **AND** the affordance is exposed as unavailable

#### Scenario: shared-ui-store-product-listing-SC-57 - Below the maximum the control counts on

- **GIVEN** a product supplied as in the cart with a count of `1` and a maximum of `2`
- **WHEN** a shopper activates the increment affordance
- **THEN** `2` is reported once

#### Scenario: shared-ui-store-product-listing-SC-58 - No maximum supplied

- **GIVEN** a product supplied as in the cart with a count of `2` and no maximum
- **WHEN** a shopper activates the increment affordance
- **THEN** `3` is reported once

#### Scenario: shared-ui-store-product-listing-SC-59 - Decrement still works at the maximum

- **GIVEN** a product supplied as in the cart with a count of `2` and a maximum of `2`
- **WHEN** a shopper activates the decrement control
- **THEN** `1` is reported once

### Requirement: The card displays a supplied remaining count

The card SHALL display a remaining count where the consumer supplies one, and
SHALL display none where the consumer supplies none. The count SHALL be
displayed as supplied: the card SHALL NOT derive it, format it, compare it
against a threshold, or decide from it that a product is scarce.

A sold-out product SHALL NOT display a remaining count, because there is
nothing left to be running out of.

#### Scenario: shared-ui-store-product-listing-SC-60 - A remaining count is displayed as supplied

- **GIVEN** an available product supplied with a remaining count of `Only 3 left`
- **WHEN** the card is rendered
- **THEN** `Only 3 left` is displayed on the card
- **AND** no other remaining-count copy is shown

#### Scenario: shared-ui-store-product-listing-SC-61 - No remaining count supplied

- **GIVEN** an available product supplied with no remaining count
- **WHEN** the card is rendered
- **THEN** no remaining count is displayed

#### Scenario: shared-ui-store-product-listing-SC-62 - A sold-out product says nothing about what is left

- **GIVEN** a product supplied as sold out and with a remaining count
- **WHEN** the card is rendered
- **THEN** no remaining count is displayed
- **AND** the sold-out treatment and its supplied label are displayed
