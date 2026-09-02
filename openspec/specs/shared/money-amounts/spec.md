# shared/money-amounts Specification

## Purpose
How a money amount becomes something a person reads, and how it converts to
and from the decimal amounts external systems quote.

A money amount is always an integer count of minor units plus an ISO 4217
currency code. This capability governs everything that happens between that
pair and a reader: which power of ten separates minor units from a major
amount, what an unrecognized currency does, and the two shapes money takes on
screen — one for a collector, one for an operator. It binds every Grade10
surface that shows money: storefront pages, admin panels, demos, and the
messages the platform sends.

Which currency a brand quotes in, and whether a spend in another currency is
accepted, are decided elsewhere and unchanged here.

## Feature set

- Minor-unit conversion
  - ISO 4217 exponent: each currency's own exponent separates minor units from a major amount
  - External decimals: a decimal an external system quotes converts to minor units and back exactly
  - Excess precision: a decimal too precise for its currency fails rather than rounding silently
- Unrecognized currencies
  - Failure over fallback: a code with no known exponent stops the conversion or display, naming that code
  - Neutral error: the error names the platform's money handling rather than any one integration
- Audience shapes
  - Collector shape: the currency's symbol with the amount, punctuated for the reader's own locale
  - Operator shape: the ISO 4217 code with the amount, unambiguous across rows that span currencies
  - Shape consistency: two surfaces of one audience show the same amount as identical text
- Sent messages
  - English formatting: money in a message is grouped and punctuated in English, matching the language it is written in

## Requirements
### Requirement: An amount converts by its own currency's exponent

Every conversion between an integer count of minor units and a decimal
amount SHALL use the minor-unit exponent that ISO 4217 assigns to that
amount's currency. No surface SHALL assume a fixed exponent for every
currency.

#### Scenario: money-amounts-SC-01 - A two-decimal currency

- **GIVEN** an amount of 249000 minor units in HKD, a currency with exponent 2
- **WHEN** the amount is displayed
- **THEN** the major amount shown is 2,490.00

#### Scenario: money-amounts-SC-02 - A currency with no minor unit

- **GIVEN** an amount of 249000 minor units in JPY, a currency with exponent 0
- **WHEN** the amount is displayed
- **THEN** the major amount shown is 249,000
- **AND** no fractional digits are shown

#### Scenario: money-amounts-SC-03 - A three-decimal currency

- **GIVEN** an amount of 249000 minor units in KWD, a currency with exponent 3
- **WHEN** the amount is displayed
- **THEN** the major amount shown is 249.000

#### Scenario: money-amounts-SC-04 - A decimal amount from an external system

- **GIVEN** a decimal amount quoted by an external system as the text `1.15` in HKD
- **WHEN** it is converted to minor units
- **THEN** the result is exactly 115
- **AND** converting 115 HKD minor units back yields the text `1.15`

#### Scenario: money-amounts-SC-05 - A decimal amount too precise for its currency

- **GIVEN** a decimal amount quoted as the text `1.155` in HKD, a currency with exponent 2
- **WHEN** it is converted to minor units
- **THEN** the conversion fails
- **AND** no rounded amount is returned

### Requirement: An unrecognized currency stops the operation

A currency code the platform holds no ISO 4217 exponent for SHALL cause the
conversion or display to fail with an error naming that code. No surface
SHALL fall back to a default exponent, render the digits unconverted, or
substitute another currency.

#### Scenario: money-amounts-SC-06 - Displaying an unrecognized currency

- **WHEN** an amount is displayed in a currency code the platform holds no exponent for
- **THEN** the display fails with an error naming that currency code

#### Scenario: money-amounts-SC-07 - Converting an unrecognized currency

- **WHEN** a decimal amount in a currency code the platform holds no exponent for is converted to minor units
- **THEN** the conversion fails with an error naming that currency code

#### Scenario: money-amounts-SC-08 - The error does not name one integration

- **GIVEN** a surface that has no payment provider involved in it
- **WHEN** it displays an amount in an unrecognized currency
- **THEN** the error names the currency and the platform's money handling, and does not name a payment provider

### Requirement: Money takes one shape per audience

The platform SHALL render money in exactly two shapes, and every surface
SHALL use the shape its audience calls for.

A **collector-facing** surface — a storefront page, a demo of one, or any
screen a customer reaches — SHALL render the currency's symbol with the
amount, grouped and punctuated for the reader's own locale.

An **operator-facing** surface — an admin panel table or detail view — SHALL
render the ISO 4217 currency code with the amount, grouped and punctuated,
because an operator reads rows that may span currencies and the code is
unambiguous where a symbol is not.

Both shapes SHALL group thousands. Neither SHALL be produced by a surface's
own local formatting.

#### Scenario: money-amounts-SC-09 - Two collector surfaces agree

- **GIVEN** the same amount and currency shown on the store page and on the auction page
- **WHEN** both are rendered for the same reader
- **THEN** both show identical text

#### Scenario: money-amounts-SC-10 - An operator sees the currency code

- **GIVEN** an admin order table row of 249000 minor units in HKD
- **WHEN** the row is rendered
- **THEN** it shows the ISO code `HKD` with the amount `2,490.00`
- **AND** the thousands are grouped

#### Scenario: money-amounts-SC-11 - Two operator tables agree

- **GIVEN** an order table, a member ledger table, and an auction table each showing the same amount and currency
- **WHEN** each is rendered
- **THEN** all three show identical text

#### Scenario: money-amounts-SC-12 - A collector reads their own locale

- **GIVEN** two readers of the same collector-facing amount whose locales punctuate numbers differently
- **WHEN** the amount is rendered for each
- **THEN** each sees their own locale's grouping and decimal marks
- **AND** both see the same currency's symbol

### Requirement: A message the platform sends reads in one language

Money rendered into a message the platform sends — an email, a notification —
SHALL be formatted in English, independent of any reader's locale, so the
amount matches the language the message is written in.

#### Scenario: money-amounts-SC-13 - An auction email

- **GIVEN** an outbid or lot-won email carrying an amount
- **WHEN** the message is rendered
- **THEN** the amount is grouped and punctuated in English
- **AND** the rendering does not vary with the recipient's locale

