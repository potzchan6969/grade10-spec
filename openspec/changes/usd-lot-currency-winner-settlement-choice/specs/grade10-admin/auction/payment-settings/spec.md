# grade10-admin/auction/payment-settings Specification

## Purpose

Lets a payment-authorized operator manage the minimum buyer premium used by
auction invoices as one USD amount and manage the card fee rule for each
settlement currency, USD and HKD, from the Auction admin section.

## Feature set

- Payment settings
  - Premium minimum: one USD minimum, zero or more, typed and read in the bid currency
  - Currencies held: card fee rules for USD and HKD, the two settlement currencies; JPY is not held
  - Card fee rule: one rule each for USD and HKD, a percentage and a fixed amount, or no rule
  - Card at setup: a winner is offered card only in a currency with a rule; USD needs Finance's rule before launch

## ADDED Requirements

### Requirement: Payment Settings hold card rules for USD and HKD only

Payment Settings SHALL hold card fee rules for the two settlement currencies,
`USD` and `HKD`, and for no other currency. A save naming any other currency,
JPY included, SHALL be refused and SHALL change nothing stored. Grade10 SHALL
hold no premium minimum for HKD or JPY.

A card fee rule SHALL be typed and read in its own currency's major units. A
rule for USD and a rule for HKD SHALL be independent: each has its own
percentage, fixed amount and live example, and either may be empty.

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-lpf rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-13 - A rule for JPY is refused
**Serves:** grade10-admin-auction-payment-settings-US-03 - Finance keeps one card rule per settlement currency

- **GIVEN** the HKD rule is 3.4% and 235 minor units
- **WHEN** an operator whose roles are exactly `finance` saves a JPY rule of
  `3.4`% and `0`
- **THEN** Grade10 refuses the save
- **AND** the stored rules are unchanged

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-vst rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-14 - USD and HKD rules are kept side by side
**Serves:** grade10-admin-auction-payment-settings-US-03 - Finance keeps one card rule per settlement currency

- **GIVEN** an operator whose roles are exactly `finance`
- **WHEN** they save a USD rule of `4.4`% and `0.30`, and an HKD rule of
  `3.4`% and `2.35`
- **THEN** Grade10 stores USD 4.4% and 30 minor units, and HKD 3.4% and 235
  minor units
- **AND** Payment settings reads no JPY rule

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-rmb rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-15 - A USD rule does not need an HKD rule
**Serves:** grade10-admin-auction-payment-settings-US-03 - Finance keeps one card rule per settlement currency

- **GIVEN** no card rule has been saved
- **WHEN** an operator whose roles are exactly `finance` saves a USD rule of
  `4.4`% and `0.30`, leaving HKD empty
- **THEN** Grade10 stores USD 4.4% and 30 minor units, and no rule in HKD
- **AND** a winner in USD is offered card on an order they have not confirmed


## RENAMED Requirements

- FROM: `### Requirement: Operators manage auction currency premium minimums`
- TO: `### Requirement: Operators manage the auction premium minimum`

### Requirement: Operators manage the auction premium minimum

Grade10 SHALL expose a Payment settings tab under the `/auction` admin section
to an operator with payment processing, `auction:payment`. The tab SHALL show
exactly one current minimum buyer premium, one USD amount. The operator SHALL
type it in USD major units, `5.00` for US$5.00, and Grade10 SHALL store the
matching non-negative integer count of USD minor units; zero is allowed. A save
SHALL replace the minimum atomically and record the acting operator and
timestamp. The initial minimum SHALL be 0 minor units in USD.

Grade10 SHALL hold no premium minimum for HKD or JPY. An HKD order converts
the premium with its other lines, per `grade10-site/auction/winner-order`.

An operator without payment processing SHALL not receive the minimum and SHALL
not be able to save it. A save naming a currency other than USD, a negative
amount, or an amount finer than the currency's minor unit SHALL be refused
without changing the stored value.

Scenario `grade10-admin-auction-payment-settings-SC-01` keeps its title with
its id. The title is historical: the operator holds payment processing, and
there is one minimum, not one per currency.

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-erw rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-01 - Settlement operator reads all currency minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator holds payment processing
- **WHEN** they open Payment settings under `/auction`
- **THEN** Grade10 shows one premium minimum of 0 minor units in USD on the initial value

Scenario `grade10-admin-auction-payment-settings-SC-02` keeps its title with
its id. The title is historical: the operator holds payment processing, and
the save replaces one USD minimum, not a mapping.

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-veg rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-02 - Settlement operator replaces the mapping
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator holds payment processing
- **WHEN** they save a premium minimum of USD `1.00`
- **THEN** Grade10 stores and returns exactly 100 minor units in USD
- **AND** records the acting operator and save timestamp

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-ieg rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-03 - Invalid mapping is atomic
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** the current premium minimum is 100 minor units in USD
- **WHEN** an operator submits a premium minimum in HKD or a negative amount
- **THEN** Grade10 refuses the save
- **AND** the stored minimum remains 100 minor units in USD

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-s8d rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-04 - Other operators cannot read or write minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator lacks payment processing
- **WHEN** they request or submit Payment settings
- **THEN** Grade10 refuses the operation

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-qzp rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-05 - Finance keeps the minimums
**Serves:** grade10-admin-auction-payment-settings-US-01 - Operator maintains the auction premium minimums

- **GIVEN** an operator whose roles are exactly `finance`
- **WHEN** they save a premium minimum of USD `5.00`
- **THEN** Grade10 stores and returns 500 minor units in USD


## MODIFIED Requirements

### Requirement: Operators manage the Stripe card fee rule

The card rule is what prices a card invoice's payment processing fee. Bank
transfer carries no rule; its fee is the operator's own, per
`grade10-admin/auction/post-sale`.

**Rules** - Payment settings SHALL hold, for each of USD and HKD, the two
settlement currencies, one card rule: a percentage and a fixed amount together:

| Part | Typed as | Range |
| --- | --- | --- |
| Percentage | A percentage, `3.4` for 3.4% | At least 0 and below 100, to at most two decimal places |
| Fixed amount | The currency's major units, `2.35` for HK$2.35 | Zero or more, stored as an integer count of minor units |

**No rule** - A rule with both parts empty SHALL be no rule. Grade10 SHALL
refuse a rule with only one part filled. Zero is a value: a rule of 0% and 0 is
a rule, and suggests a fee of 0.

**No seed** - Nothing SHALL be stored before the first save. Until then, every
currency has no rule.

**The suggestion** - For a subtotal, a rule SHALL suggest the fee that leaves
the subtotal whole after the rule's percentage of the whole charge and its
fixed amount are taken from it: the order total is the subtotal plus the fixed
amount, divided by one less the percentage and rounded up to the next minor
unit, and the fee is that order total less the subtotal.

**Live example** - Beside each rule, the page SHALL show the fee the rule
suggests on a subtotal of 1,000 in the currency's major units, and follow the
rule as the operator types it.

**Saved whole** - A save SHALL replace both currencies' rules at once and
record the acting operator and the time. Grade10 SHALL refuse a save, changing
nothing stored, when a rule breaks the ranges above or has only one part, or
names a currency other than USD or HKD.

**Applies forward** - A saved rule SHALL be where a card invoice's fee on a
quote or a reissue made after it starts, per `grade10-admin/auction/post-sale`.
It SHALL NOT change a sent invoice.

**Card at setup** - A winner SHALL be offered card at order setup only in a
currency with a rule, per `grade10-site/auction/winner-order`. Until Finance
saves a rule for a currency, a winner in it reads that card is not yet
available there, and no card invoice in it can be sent.

**Access** - Only an operator with payment processing, `auction:payment`,
SHALL open or save Payment Settings.

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-pzf rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-06 - No rule saved yet
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** no card rule has been saved
- **WHEN** an operator with payment processing opens Payment settings
- **THEN** USD and HKD each show no rule

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-cac rev=2 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-07 - A save replaces the rules whole
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** no card rule has been saved
- **AND** an operator whose roles are exactly `finance`
- **WHEN** they save HKD `3.4`% and `2.35`, leaving USD empty
- **THEN** Grade10 stores HKD 3.4% and 235 minor units, and no rule in USD
- **AND** records that operator and the time of the save

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-5h3 rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-08 - Half a rule or a percentage out of range is refused
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** the HKD rule is 3.4% and 235 minor units, and no other rule
- **WHEN** an operator saves a USD rule of `4.4`% with no fixed amount, then an
  HKD rule of `3.405`%, then one of `100`%
- **THEN** Grade10 refuses each save
- **AND** the stored rules are unchanged

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-su9 rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-09 - A rule grosses the subtotal up
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** the HKD rule is 3.4% and 235 minor units
- **WHEN** Grade10 suggests the fee for a subtotal of 312000 minor units in HKD
- **THEN** it suggests a fee of 11225 and an order total of 323225 minor units
  in HKD

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-lon rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-10 - Other operators cannot read or change the rules
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they request or save the card rules
- **THEN** Grade10 refuses the operation
- **AND** the stored rules are unchanged

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-g3v rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-11 - Each rule shows its fee on an example subtotal
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** an operator with payment processing on Payment settings
- **WHEN** they type an HKD rule of `3.4`% and `2.35`
- **THEN** beside the rule the page shows a fee of 3763 on a subtotal of 100000
  minor units in HKD, read as HKD 37.63 on HKD 1,000.00

<!-- trace:scenario id=g10adm.auction-payment-settings.SC-qak rev=1 -->
#### Scenario: grade10-admin-auction-payment-settings-SC-12 - Saving a card rule offers card in that currency
**Serves:** grade10-admin-auction-payment-settings-US-02 - Finance keeps the Stripe card fee rule

- **GIVEN** Payment Settings holds no USD card rule
- **AND** an auction order in USD Awaiting Setup, whose winner reads that card
  is not yet available in USD
- **WHEN** an operator whose roles are exactly `finance` saves a USD rule of
  `4.4`% and `0.30`
- **AND** the winner returns to the payment method choice
- **THEN** card is offered on that order


## REMOVED Requirements

None.
