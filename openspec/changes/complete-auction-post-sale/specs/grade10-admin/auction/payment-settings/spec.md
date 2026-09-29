## Purpose

Lets an operator with payment processing keep, from the Auction admin section,
the minimum buyer premium per currency and the payment processing fee schedule
each invoice's fee starts from.

## Feature set

- Payment settings
  - Auction tab: Payment settings lives under `/auction`
  - Premium minimums: USD, HKD and JPY each have one minimum, zero or more, typed in major units
  - Safe defaults: USD 0, HKD 0 and JPY 0 until a save
  - Fee schedule: per currency, a card rule and a bank transfer rule, each a percentage and a fixed amount, or no rule
  - Live example: each rule shows the fee it suggests on a subtotal of 1,000 in its currency
  - Payment processing: `auction:payment` is required to read or change either

## MODIFIED Requirements

### Requirement: Operators manage auction currency premium minimums

Grade10 SHALL expose a Payment settings tab under the `/auction` admin section
to an operator with payment processing, `auction:payment`. The tab SHALL show
exactly one current minimum buyer premium for each of USD, HKD, and JPY. The
operator SHALL type each minimum in the currency's major units, `5.00` for
HK$5.00, and Grade10 SHALL store the matching non-negative integer count of
minor units; zero is allowed. A save SHALL replace the complete mapping
atomically and record the acting operator and timestamp. The initial mapping
SHALL be USD 0, HKD 0, and JPY 0 minor units.

An operator without payment processing SHALL not receive the mapping and SHALL
not be able to save it. A save with a missing currency, an unsupported
currency, a negative amount, or an amount finer than the currency's minor unit
SHALL be refused without changing any stored value.

Scenario `grade10-admin-auction-payment-settings-SC-01` keeps its title with
its id. The title is historical: the operator holds payment processing.

#### Scenario: grade10-admin-auction-payment-settings-SC-01 - Settlement operator reads all currency minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator holds payment processing
- **WHEN** they open Payment settings under `/auction`
- **THEN** Grade10 shows USD 0, HKD 0, and JPY 0 minor units on the initial mapping

Scenario `grade10-admin-auction-payment-settings-SC-02` keeps its title with
its id. The title is historical: the operator holds payment processing.

#### Scenario: grade10-admin-auction-payment-settings-SC-02 - Settlement operator replaces the mapping
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator holds payment processing
- **WHEN** they save USD `1.00`, HKD `5.00`, and JPY `100`
- **THEN** Grade10 stores and returns exactly USD 100, HKD 500, and JPY 100 minor units
- **AND** records the acting operator and save timestamp

#### Scenario: grade10-admin-auction-payment-settings-SC-03 - Invalid mapping is atomic
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** the current mapping is USD 0, HKD 0, and JPY 0 minor units
- **WHEN** an operator submits a mapping with an unsupported currency or a negative amount
- **THEN** Grade10 refuses the save
- **AND** all three stored values remain unchanged

#### Scenario: grade10-admin-auction-payment-settings-SC-04 - Other operators cannot read or write minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator lacks payment processing
- **WHEN** they request or submit Payment settings
- **THEN** Grade10 refuses the operation

#### Scenario: grade10-admin-auction-payment-settings-SC-05 - Finance keeps the minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator whose roles are exactly `finance`
- **WHEN** they save HKD `5.00`, and USD and JPY `0`
- **THEN** Grade10 stores and returns HKD 500, USD 0, and JPY 0 minor units

## ADDED Requirements

### Requirement: Operators manage the payment processing fee schedule

The fee schedule holds the rule each invoice's payment processing fee starts
from.

**Rules** - Payment settings SHALL hold, for each of USD, HKD and JPY, a card
rule and a bank transfer rule. A rule is a percentage and a fixed amount
together:

| Part | Typed as | Range |
| --- | --- | --- |
| Percentage | A percentage, `3.4` for 3.4% | At least 0 and below 100, to at most two decimal places |
| Fixed amount | The currency's major units, `2.35` for HK$2.35 | Zero or more, stored as an integer count of minor units |

**No rule** - A rule with both parts empty SHALL be no rule. Grade10 SHALL
refuse a rule with only one part filled. Zero is a value: a rule of 0% and 0 is
a rule, and suggests a fee of 0.

**No seed** - Nothing SHALL be stored before the first save. Until then, every
method in every currency has no rule.

**The suggestion** - For a subtotal, a rule SHALL suggest the fee that leaves
the subtotal whole after the rule's percentage of the whole charge and its
fixed amount are taken from it: the order total is the subtotal plus the fixed
amount, divided by one less the percentage and rounded up to the next minor
unit, and the fee is that order total less the subtotal.

**Live example** - Beside each rule, the page SHALL show the fee the rule
suggests on a subtotal of 1,000 in the currency's major units, and follow the
rule as the operator types it.

**Saved whole** - A save SHALL replace the whole schedule at once and record
the acting operator and the time. Grade10 SHALL refuse a save, changing
nothing stored, when a rule breaks the ranges above or has only one part, or
names a currency or method Grade10 does not support.

**Applies forward** - A saved schedule SHALL be where the fee on a quote or a
reissue made after it starts, per `grade10-admin/auction/post-sale`, and what
the winner reads at the payment method choice, per
`grade10-site/auction/winner-order`. It SHALL NOT change a sent invoice.

**Access** - Only an operator with payment processing, `auction:payment`,
SHALL open or save Payment Settings.

#### Scenario: grade10-admin-auction-payment-settings-SC-06 - A new schedule holds no rule
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** no fee schedule has been saved
- **WHEN** an operator with payment processing opens Payment settings
- **THEN** card and bank transfer show no rule in USD, HKD and JPY

#### Scenario: grade10-admin-auction-payment-settings-SC-07 - A save replaces the schedule whole
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** no fee schedule has been saved
- **AND** an operator whose roles are exactly `finance`
- **WHEN** they save HKD card `3.4`% and `2.35`, and HKD bank transfer `0`%
  and `0.00`, leaving USD and JPY empty
- **THEN** Grade10 stores HKD card 3.4% and 235 minor units, HKD bank transfer
  0% and 0 minor units, and no rule in USD or JPY
- **AND** records that operator and the time of the save

#### Scenario: grade10-admin-auction-payment-settings-SC-08 - Half a rule or a percentage out of range is refused
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** the HKD card rule is 3.4% and 235 minor units, and no other rule
- **WHEN** an operator saves a USD card rule of `4.4`% with no fixed amount,
  then an HKD card rule of `3.405`%, then one of `100`%
- **THEN** Grade10 refuses each save
- **AND** the stored schedule is unchanged

#### Scenario: grade10-admin-auction-payment-settings-SC-09 - A rule grosses the subtotal up
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** the HKD card rule is 3.4% and 235 minor units
- **WHEN** Grade10 suggests the fee for a subtotal of 312000 minor units in HKD
- **THEN** it suggests a fee of 11225 and an order total of 323225 minor units
  in HKD

#### Scenario: grade10-admin-auction-payment-settings-SC-10 - Other operators cannot read or change the schedule
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they request or save the fee schedule
- **THEN** Grade10 refuses the operation
- **AND** the stored schedule is unchanged

#### Scenario: grade10-admin-auction-payment-settings-SC-11 - Each rule shows its fee on an example subtotal
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the payment processing fee schedule

- **GIVEN** an operator with payment processing on Payment settings
- **WHEN** they type an HKD card rule of `3.4`% and `2.35`
- **THEN** beside the rule the page shows a fee of 3763 on a subtotal of 100000
  minor units in HKD, read as HKD 37.63 on HKD 1,000.00
