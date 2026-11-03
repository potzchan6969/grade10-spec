## Feature set

- Rewards and redemption
  - Settlement by kind: every reward is issued as a coupon at once; a
    physical reward's coupon takes 100% off its own variant, so it completes
    as an ordinary sale; a code is minted only for the sale that claims it,
    and a gift at the till is its own line with no code
  - Till scope: a reward scoped to named products or a catalog filter is good
    online only, because a till sale names its goods by variant alone; the menu
    says so before it is bought, and the till refuses it however it reaches
    the sale
- Operator console
  - Reward form: kind, discount, scope and combine setting beside the menu
    entry; a free item is its own choice and reopens as one, and a reward
    stored with a retired handover keeps it

## MODIFIED Requirements

### Requirement: A reward names a kind, a discount and a scope

Every reward SHALL carry a kind - a product coupon that takes money off, or
a gift that adds a free line - and a discount and a scope stating what it
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
takes off wherever it is applied - online or at the till, identically.

A product coupon scoped to named products or to a catalog filter SHALL be
good in every channel it names, the till included: the till SHALL read each
line's product and catalog filters before it applies such a coupon, SHALL
take it off the lines its scope matches, and SHALL refuse it where the catalog
cannot place a line rather than guess. The console's reward form SHALL save
such a reward for the channels the operator chose. A gift SHALL be good at the
till alone, whatever channels it names.

A reward MAY hold its coupon to the member's birthday month. A member MAY
give a birthday, a month and a day with no year, once; the member SHALL NOT
change it after, and an operator holding the adjust permission MAY correct or
clear it, recorded in the audit trail with a reason. Such a coupon SHALL be
good, and such a reward SHALL be bought, only while the date in Hong Kong
falls in that month, and SHALL be refused to a member with no birthday on
file, before any points are spent.

<!-- trace:scenario id=g10.loyalty-programme.SC-qyo rev=3 -->
#### Scenario: grade10-site-loyalty-programme-SC-152 - A fixed-amount coupon takes a set amount off its scope
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a fixed amount
- **THEN** that amount comes off the lines its scope matches, online or at
  the till

<!-- trace:scenario id=g10.loyalty-programme.SC-gmn rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-153 - A percentage coupon is capped at its maximum discount
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a percentage with a
  maximum
- **THEN** the amount taken off never exceeds that maximum, however large
  the matching lines are

<!-- trace:scenario id=g10.loyalty-programme.SC-0tt rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-247 - A percentage coupon with no maximum takes its whole rate
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a percentage with no
  maximum discount
- **THEN** that percentage comes off every line its scope matches, however
  large the lines are

<!-- trace:scenario id=g10.loyalty-programme.SC-90a rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-154 - A coupon scoped to a catalog filter matches worlds and types
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon scoped to a filter over the catalog's
  worlds and types
- **THEN** only the lines matching that filter are discounted

<!-- trace:scenario id=g10.loyalty-programme.SC-29i rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-155 - A coupon scoped to the whole order applies across every line
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon scoped to the whole order
- **THEN** every line in the order shares the discount

<!-- trace:scenario id=g10.loyalty-programme.SC-mn8 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-156 - A gift adds a free line for its own variant
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose kind is a gift
- **THEN** a free line for the variant it names is added to the order

<!-- trace:scenario id=g10.loyalty-programme.SC-3q5 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-157 - A gift below its minimum spend does not apply
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a basket does not yet reach a gift's minimum spend
- **THEN** the gift is refused until the basket reaches it

<!-- trace:scenario id=g10.loyalty-programme.SC-oqd rev=3 -->
#### Scenario: grade10-site-loyalty-programme-SC-248 - The till takes a coupon scoped to named products or a filter
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a coupon scoped to named products or to a
  catalog filter, good at the till
- **WHEN** staff apply it to a sale holding one matching line and one other
- **THEN** the cut comes off the matching line alone
- **AND** where the catalog cannot place a line of the sale, the coupon is
  refused and the sale's price is unchanged

<!-- trace:scenario id=g10.loyalty-programme.SC-62s rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-245 - The menu states the channels of a reward scoped to named products or a filter
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a reward scoped to named products or to a catalog filter, for
  online and the till
- **WHEN** a member reads the reward menu
- **THEN** the reward is offered for online and the till, before any points
  are spent

<!-- trace:scenario id=g10.loyalty-programme.SC-1bu rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-249 - A reward scoped to named products or a filter keeps the channels chosen
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator scopes a money-off reward to named products or to a
  catalog filter in the reward form and chooses online and the till
- **THEN** the form offers every channel
- **AND** saving it saves it for online and the till

<!-- trace:scenario id=g10.loyalty-programme.SC-rwu rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-250 - A stored reward scoped to named products that names the till keeps the till
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon scoped to named products,
  for online and the till
- **WHEN** an operator opens it in the reward form and saves it unchanged
- **THEN** it is saved for online and the till

<!-- trace:scenario id=g10.loyalty-programme.SC-n27 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-365 - A birthday coupon is good in the member's birthday month alone
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member whose birthday is in March, holding a coupon held to the
  birthday month
- **WHEN** the member applies it on 31 March at 23:30 in Hong Kong
- **THEN** it applies
- **AND** applied on 1 April at 00:10 in Hong Kong, it is refused

<!-- trace:scenario id=g10.loyalty-programme.SC-6d5 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-366 - A member with no birthday on file is refused a birthday reward
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member with no birthday on file
- **WHEN** the member buys a reward held to the birthday month, or applies a
  coupon held to it
- **THEN** it is refused, and no points are spent

<!-- trace:scenario id=g10.loyalty-programme.SC-xnd rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-367 - A member gives a birthday once and staff correct it
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member who has given a birthday
- **WHEN** the member gives a different one
- **THEN** it is refused, and the birthday on file is unchanged
- **AND** an operator holding the adjust permission can correct or clear it
  with a reason, recorded in the audit trail

### Requirement: The console's reward form authors a reward's full definition

The operator console's reward form SHALL set a reward's kind, discount,
scope and combine setting alongside its slug, name, description, cost, stock
and window, so that creating or editing any reward - including one carrying
a definition - needs no direct use of an administrative API.

The form SHALL offer three choices, each saved as one of the two kinds:

| Choice | The operator sets | Minimum spend | Saved as |
| --- | --- | --- | --- |
| Money off | A discount and a scope | Optional | A product coupon with that discount and scope |
| Free item | One variant | Optional | A product coupon at 100%, with no maximum discount, scoped to that variant |
| Gift with a purchase | One variant | Required | A gift naming that variant |

Moving to one of the three choices from another SHALL open it with nothing
picked or entered, carrying nothing over from the choice before.

A stored product coupon at 100%, with no maximum discount, scoped to exactly
one variant SHALL open in the form as a free item, whether the reward is
opened or duplicated into a new one. Any other stored product coupon SHALL
open as money off, a capped or wider 100% discount included. A reward stored
with a handover the programme has retired - a manual handover, or a counter
collection - SHALL open with no choice made and SHALL keep that handover,
unchanged, while the fields beside it are edited; once the operator makes one
of the three choices, it SHALL save as that choice. A duplicate of it SHALL
open as money off.

The form SHALL save nothing while the choice lacks a part it needs, or
while the window ends before it starts, and SHALL name what is missing.
Beside the form, a basket check SHALL state what the reward's coupon would
take off a basket the operator builds, or why it would not apply, without
saving the reward.

<!-- trace:scenario id=g10.loyalty-programme.SC-7w0 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-158 - A reward with a definition is created from the console alone
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator creates a reward naming its kind, discount, scope and
  combine setting in the console
- **THEN** the reward is saved with that definition, with no separate API
  call

<!-- trace:scenario id=g10.loyalty-programme.SC-72a rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-187 - A free item is created from one variant
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator chooses Free item, on a new reward or one being
  edited, picks one variant and saves
- **THEN** the reward is saved as a product coupon at 100%, with no maximum
  discount, scoped to that variant

<!-- trace:scenario id=g10.loyalty-programme.SC-2m8 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-253 - A choice moved to from another opens empty
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** an operator who chose Free item and picked one variant
- **WHEN** they choose Money off
- **THEN** Money off opens on an amount, with none entered, scoped to named
  variants, with none picked
- **AND** choosing Free item again opens it with no variant picked

<!-- trace:scenario id=g10.loyalty-programme.SC-zq0 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-188 - A stored free item reopens as a free item
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon at 100%, with no maximum
  discount, scoped to one variant, with a minimum spend of 50000 HKD minor
  units
- **WHEN** an operator opens it, or duplicates it into a new reward
- **THEN** Free item is chosen, with that variant picked
- **AND** 50000 HKD minor units is its minimum spend

<!-- trace:scenario id=g10.loyalty-programme.SC-jnr rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-189 - A capped or wider 100% discount stays money off
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon at 100% that has a maximum
  discount, or that is scoped to two variants, or to one named product
- **WHEN** an operator opens it in the reward form
- **THEN** Money off is chosen, with that discount and scope

<!-- trace:scenario id=g10.loyalty-programme.SC-ji6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-246 - A reward stored with a retired handover keeps it until a choice is made
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a manual handover or a counter collection
- **WHEN** an operator opens it in the reward form
- **THEN** no choice is made
- **AND** changing its name and saving keeps that handover, unchanged
- **AND** duplicating it opens a new reward on Money off
- **AND** choosing Money off with a discount and a scope, then saving, saves
  it as a product coupon

<!-- trace:scenario id=g10.loyalty-programme.SC-h6j rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-251 - A reward missing a part is not saved
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator saves a reward whose choice lacks a part it needs - a
  free item or a gift with no variant, money off with no amount or with
  nothing picked in its scope, a gift with no minimum spend - or whose window
  ends before it starts
- **THEN** nothing is saved
- **AND** the form names what is missing

<!-- trace:scenario id=g10.loyalty-programme.SC-fut rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-252 - The basket check states what the coupon would take off
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward in the form whose definition is complete
- **WHEN** the operator builds a basket in the basket check
- **THEN** the check states what the coupon would take off that basket, or
  why it would not apply
- **AND** the reward is not saved
