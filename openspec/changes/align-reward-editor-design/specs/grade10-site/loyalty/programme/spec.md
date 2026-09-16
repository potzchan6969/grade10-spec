## Feature set

- Operator console
  - Reward form: kind, discount, scope and combine setting beside the menu entry; a free item is its own choice and reopens as one

## MODIFIED Requirements

### Requirement: A reward names a kind, a discount and a scope

Every reward SHALL carry a kind — a product coupon that takes money off, or
a gift that adds a free line — and a discount and a scope stating what it
takes off and where. A product coupon's discount SHALL be a fixed amount, or
a percentage with an optional maximum discount; its scope SHALL be named
products or variants, a filter over the catalog's worlds and types, or the
whole order. A gift SHALL name the variant it adds and SHALL carry a minimum
spend greater than zero; a product coupon's minimum spend is optional.

Every reward SHALL also state a combine setting: whether its coupon stacks
with the shop's own product discounts, order discounts and shipping
discounts, each allowed or not. A reward MAY state none. What a coupon's
code carries, and the store's default a reward stating none takes, are
`grade10-site/store/discounts`' own requirement, and a reward's setting is
one case of it.

This definition SHALL be copied onto the coupon a redemption issues,
unchanged by any later edit to the reward, and SHALL be what the coupon
takes off wherever it is applied — online or at the till, identically.

#### Scenario: grade10-site-loyalty-programme-SC-152 - A fixed-amount coupon takes a set amount off its scope
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a fixed amount
- **THEN** that amount comes off the lines its scope matches, online or at
  the till alike

#### Scenario: grade10-site-loyalty-programme-SC-153 - A percentage coupon is capped at its maximum discount
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a percentage with a
  maximum
- **THEN** the amount taken off never exceeds that maximum, however large
  the matching lines are

#### Scenario: grade10-site-loyalty-programme-SC-154 - A coupon scoped to a catalog filter matches worlds and types
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon scoped to a filter over the catalog's
  worlds and types
- **THEN** only the lines matching that filter are discounted

#### Scenario: grade10-site-loyalty-programme-SC-155 - A coupon scoped to the whole order applies across every line
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon scoped to the whole order
- **THEN** every line in the order shares the discount

#### Scenario: grade10-site-loyalty-programme-SC-156 - A gift adds a free line for its own variant
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose kind is a gift
- **THEN** a free line for the variant it names is added to the order

#### Scenario: grade10-site-loyalty-programme-SC-157 - A gift below its minimum spend does not apply
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a basket does not yet reach a gift's minimum spend
- **THEN** the gift is refused until the basket reaches it

### Requirement: The console's reward form authors a reward's full definition

The operator console's reward form SHALL set a reward's kind, discount,
scope and combine setting alongside its slug, name, description, cost, stock
and window, so that creating or editing any reward — including one carrying
a definition — needs no direct use of an administrative API.

The form SHALL offer three choices, each saved as one of the two kinds:

| Choice | The operator sets | Minimum spend | Saved as |
| --- | --- | --- | --- |
| Money off | A discount and a scope | Optional | A product coupon with that discount and scope |
| Free item | One variant | Optional | A product coupon at 100%, with no maximum discount, scoped to that variant |
| Gift with a purchase | One variant | Required | A gift naming that variant |

A stored product coupon at 100%, with no maximum discount, scoped to exactly
one variant SHALL open in the form as a free item, whether the reward is
opened or duplicated into a new one. Any other stored product coupon SHALL
open as money off, a capped or wider 100% discount included.

#### Scenario: grade10-site-loyalty-programme-SC-158 - A reward with a definition is created from the console alone
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator creates a reward naming its kind, discount, scope and
  combine setting in the console
- **THEN** the reward is saved with that definition, with no separate API
  call

#### Scenario: grade10-site-loyalty-programme-SC-187 - A free item is created from one variant
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator chooses Free item, picks one variant and saves
- **THEN** the reward is saved as a product coupon at 100%, with no maximum
  discount, scoped to that variant

#### Scenario: grade10-site-loyalty-programme-SC-188 - A stored free item reopens as a free item
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon at 100%, with no maximum
  discount, scoped to one variant, with a minimum spend of 50000 HKD minor
  units
- **WHEN** an operator opens it, or duplicates it into a new reward
- **THEN** Free item is chosen, with that variant picked
- **AND** 50000 HKD minor units is its minimum spend

#### Scenario: grade10-site-loyalty-programme-SC-189 - A capped or wider 100% discount stays money off
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon at 100%, either with a
  maximum discount or scoped to two variants
- **WHEN** an operator opens it in the reward form
- **THEN** Money off is chosen, with that discount and scope
