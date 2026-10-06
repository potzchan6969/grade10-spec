## Feature set

- Rewards and redemption
  - Settlement by kind: every reward settles as a coupon minted at once; a
    physical reward's coupon takes 100% off its own variant, so it completes
    as an ordinary sale
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

A sale at the till names its goods by variant alone, so a product coupon
scoped to named products or to a catalog filter SHALL be good online only,
whatever channels it names: the console's reward form SHALL save it for the
online channel alone, the member's reward menu SHALL state it as good online
only, the till SHALL show it as online only before it is applied, and the
till SHALL refuse it however it reaches the sale. Neither way a coupon reaches
a counter sale under "A redemption settles as a coupon, whatever the reward"
SHALL take such a coupon.

<!-- trace:scenario id=g10.loyalty-programme.SC-qyo rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-152 - A fixed-amount coupon takes a set amount off its scope
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a fixed amount
- **THEN** that amount comes off the lines its scope matches, online, or at
  the till where its scope is named variants or the whole order

<!-- trace:scenario id=g10.loyalty-programme.SC-gmn rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-153 - A percentage coupon is capped at its maximum discount
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **WHEN** a member applies a coupon whose discount is a percentage with a
  maximum
- **THEN** the amount taken off never exceeds that maximum, however large
  the matching lines are

<!-- trace:scenario id=g10.loyalty-programme.SC-0tt rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-245 - A percentage coupon with no maximum takes its whole rate
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

<!-- trace:scenario id=g10.loyalty-programme.SC-oqd rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-246 - The till holds a coupon scoped to named products or a filter to online only
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a coupon scoped to named products or to a
  catalog filter, whichever channels the coupon names
- **WHEN** the member is identified at a till
- **THEN** the till shows that coupon as online only, before staff apply it
- **AND** staff cannot apply it to the sale
- **AND** the member presenting it from their own session is refused for that
  sale

<!-- trace:scenario id=g10.loyalty-programme.SC-62s rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-243 - The menu states a reward scoped to named products or a filter as online only
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a reward scoped to named products or to a catalog filter,
  whichever channels it names
- **WHEN** a member reads the reward menu
- **THEN** the reward states it is good online only, before any points are
  spent

<!-- trace:scenario id=g10.loyalty-programme.SC-1bu rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-247 - A reward scoped to named products or a filter is saved for online alone
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator scopes a money-off reward to named products or to a
  catalog filter in the reward form
- **THEN** the form shows the reward as online only, and offers no channel
  with the till
- **AND** saving it saves it for the online channel alone, whichever channel
  was chosen before

<!-- trace:scenario id=g10.loyalty-programme.SC-rwu rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-248 - A stored reward scoped to named products that names the till is saved online only
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a product coupon scoped to named products,
  for online and the till
- **WHEN** an operator opens it in the reward form and saves it unchanged
- **THEN** the form shows the reward as online only
- **AND** it is saved for the online channel alone
- **AND** moving its scope to named variants before saving shows the channels
  it was stored with again

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
#### Scenario: grade10-site-loyalty-programme-SC-244 - A reward stored with a retired handover keeps it until a choice is made
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward stored as a manual handover or a counter collection
- **WHEN** an operator opens it in the reward form
- **THEN** no choice is made
- **AND** changing its name and saving keeps that handover, unchanged
- **AND** duplicating it opens a new reward on Money off
- **AND** choosing Money off with a discount and a scope, then saving, saves
  it as a product coupon

<!-- trace:scenario id=g10.loyalty-programme.SC-h6j rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-249 - A reward missing a part is not saved
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator saves a reward whose choice lacks a part it needs — a
  free item or a gift with no variant, money off with no amount or with
  nothing picked in its scope, a gift with no minimum spend — or whose window
  ends before it starts
- **THEN** nothing is saved
- **AND** the form names what is missing

<!-- trace:scenario id=g10.loyalty-programme.SC-fut rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-250 - The basket check states what the coupon would take off
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **GIVEN** a reward in the form whose definition is complete
- **WHEN** the operator builds a basket in the basket check
- **THEN** the check states what the coupon would take off that basket, or
  why it would not apply
- **AND** the reward is not saved
