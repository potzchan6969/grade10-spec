## Feature set

- Reward definitions
  - Kind, discount, scope: a reward states what it takes off and where,
    honoured wherever its coupon is spent
  - Console-authored: the reward form sets the whole definition without the
    admin API
- Coupon settlement
  - One path for every reward: a physical reward settles as an ordinary
    sale, its coupon at 100% off
  - One discount at a time: a reward coupon holds the order's single slot,
    per `grade10-site/store/discounts` (delivered by
    `mint-coupons-as-discount-codes`, not by this change)
- Operator permissions
  - Cancellation stands alone: gated by its own permission, not point
    movement
- Member disclosure
  - Channel limits shown first: an artifact-backed channel discloses its
    cap before points leave
  - Activity names its channel: every entry says where it came from

## ADDED Requirements

### Requirement: A reward names a kind, a discount and a scope

Every reward SHALL carry a kind — a product coupon that takes money off, or
a gift that adds a free line — and a discount and a scope stating what it
takes off and where. A product coupon's discount SHALL be a fixed amount, or
a percentage capped at a maximum discount; its scope SHALL be named products
or variants, a filter over the catalog's worlds and types, or the whole
order. A gift SHALL name the variant it adds and SHALL carry a minimum spend
greater than zero; a product coupon's minimum spend is optional.

This definition SHALL be copied onto the coupon a redemption issues,
unchanged by any later edit to the reward, and SHALL be what the coupon
takes off wherever it is applied — online or at the till, identically.

#### Scenario: grade10-site-loyalty-programme-SC-152 - A fixed-amount coupon takes a set amount off its scope

- **WHEN** a member applies a coupon whose discount is a fixed amount
- **THEN** that amount comes off the lines its scope matches, online or at
  the till alike

#### Scenario: grade10-site-loyalty-programme-SC-153 - A percentage coupon is capped at its maximum discount

- **WHEN** a member applies a coupon whose discount is a percentage with a
  maximum
- **THEN** the amount taken off never exceeds that maximum, however large
  the matching lines are

#### Scenario: grade10-site-loyalty-programme-SC-154 - A coupon scoped to a catalog filter matches worlds and types

- **WHEN** a member applies a coupon scoped to a filter over the catalog's
  worlds and types
- **THEN** only the lines matching that filter are discounted

#### Scenario: grade10-site-loyalty-programme-SC-155 - A coupon scoped to the whole order applies across every line

- **WHEN** a member applies a coupon scoped to the whole order
- **THEN** every line in the order shares the discount

#### Scenario: grade10-site-loyalty-programme-SC-156 - A gift adds a free line for its own variant

- **WHEN** a member applies a coupon whose kind is a gift
- **THEN** a free line for the variant it names is added to the order

#### Scenario: grade10-site-loyalty-programme-SC-157 - A gift below its minimum spend does not apply

- **WHEN** a basket does not yet reach a gift's minimum spend
- **THEN** the gift is refused until the basket reaches it

### Requirement: The console's reward form authors a reward's full definition

The operator console's reward form SHALL set a reward's kind, discount and
scope alongside its slug, name, description, cost, stock and window, so that
creating or editing any reward — including one carrying a definition — needs
no direct use of an administrative API.

#### Scenario: grade10-site-loyalty-programme-SC-158 - A reward with a definition is created from the console alone

- **WHEN** an operator creates a reward naming its kind, discount and scope
  in the console
- **THEN** the reward is saved with that definition, with no separate API
  call

### Requirement: A redemption settles as a coupon, whatever the reward

Every reward SHALL be delivered as a coupon, taking off what its definition
states: a product coupon or a gift takes off what its discount and scope
name, and a physical reward's coupon takes 100% off the reward's own
variant — so redeeming a physical reward completes as an ordinary sale
rather than waiting for a separate handover. A coupon SHALL carry its own
validity period, taken from the reward it came from, independent of the
member's balance expiry.

Redemption SHALL be one way: no member action SHALL convert an issued
coupon, used or unused, back into points.

A coupon SHALL be usable in the online store and at the counter, applied to
the order automatically — no separate code is given to the member to type.
A coupon SHALL NOT apply to an auction purchase, and points SHALL NOT be
spent against one. That a coupon holds the order's one discount slot is a
`grade10-site/store/discounts` requirement (`mint-coupons-as-discount-codes`
delivers it), not restated as a scenario here.

A member SHALL be able to read the coupons they hold, each with its code,
what it is for, its validity period, and whether it has been used.

#### Scenario: grade10-site-loyalty-programme-SC-159 - A physical reward's coupon takes 100% off its own variant

- **WHEN** a member redeems a reward that is a physical item
- **THEN** the redemption issues a coupon that takes 100% off the reward's
  own variant
- **AND** no separate collection record is created

#### Scenario: grade10-site-loyalty-programme-SC-160 - A member cannot undo a redemption

- **WHEN** a member holding an unused coupon asks for their points back
- **THEN** no member surface offers it, and the points are not returned

#### Scenario: grade10-site-loyalty-programme-SC-161 - A coupon expires on its own terms

- **WHEN** a coupon's validity period ends
- **THEN** it can no longer be used
- **AND** the member's redeemable balance is unaffected

#### Scenario: grade10-site-loyalty-programme-SC-162 - Points buy nothing at an auction

- **WHEN** a member attempts to pay for an auction purchase with points or
  with a coupon
- **THEN** it is refused

## MODIFIED Requirements

### Requirement: Operators act through named permissions, with a second factor and a tamper-evident record

Every operator action SHALL require a named permission, a session resolved
without cache, and — where the environment enforces it — a second factor
verified for that session. Every operator action that changes something
SHALL be recorded in a hash-chained log whose breakage is detectable.

Operator permissions SHALL separate reading a member's loyalty state, moving
points, granting invitations, editing the reward menu, removing a tier a
member holds, and cancelling a redemption, so an operator can hold one
without the others. Removing a tier and cancelling a redemption SHALL each
be their own permission: both undo something a member can see, and neither
follows from being allowed to move points.

#### Scenario: grade10-site-loyalty-programme-SC-45 - A permission is required per action

- **WHEN** an operator without the action's permission attempts it
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-149 - Moving points does not carry tier removal

- **WHEN** an operator holding only the point-movement permission attempts
  to remove a tier
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-164 - Moving points does not carry redemption cancellation

- **WHEN** an operator holding only the point-movement permission attempts
  to cancel a redemption
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-46 - The record survives an attempt to rewrite it

- **WHEN** any recorded operator action is altered or removed
- **THEN** verifying the log reports the position at which it breaks

#### Scenario: grade10-site-loyalty-programme-SC-47 - An action with no place to record it does not run

- **WHEN** the operator log cannot be written
- **THEN** the action is refused rather than completed unrecorded

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, when that
tier's validity period ends, their progress toward retaining it, their
progress to the next earned tier, their redeemable balance, and the date
that balance expires if they record no further activity. Their own activity
list SHALL NOT disclose operator reasons, retry keys, or the internal
pricing of an entry.

Each activity entry SHALL name what it was for, and which channel it came
from, in terms the member can read.

#### Scenario: grade10-site-loyalty-programme-SC-147 - The two counts are shown as two counts

- **WHEN** a member reads their membership
- **THEN** the points that decide their tier and the points they can spend
  are shown as separate named figures

#### Scenario: grade10-site-loyalty-programme-SC-59 - An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: grade10-site-loyalty-programme-SC-60 - Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: grade10-site-loyalty-programme-SC-61 - A retired reward is still readable in history

- **WHEN** a member reads an activity entry for a reward that has since been
  archived
- **THEN** the entry still names that reward

#### Scenario: grade10-site-loyalty-programme-SC-165 - An activity entry names its channel

- **WHEN** a member reads an activity entry
- **THEN** it names the channel that activity came from, in terms the
  member can read

### Requirement: Points pay at checkout, at the programme's exchange rate

A member SHALL be able to pay part of a qualifying purchase with redeemable
points, converted at the programme's exchange rate, on any channel that
sells. Paying with points SHALL reduce the redeemable balance alone, SHALL
count as activity for the inactivity window, and SHALL NOT earn: qualifying
spend counts only what the member paid in money.

How a channel carries that payment is the channel's own concern — a
checkout that debits the balance directly and one that settles the same
debit through a money-off artifact SHALL cost the member the same points
and record one redemption either way. What an artifact may then be spent on
is the channel's rule, not the programme's: a channel MAY require a
purchase to reach the artifact's own value or refuse to combine it with
another discount. A member offered points on such a channel SHALL be told
what they can spend before the points leave their balance, never after.

#### Scenario: grade10-site-loyalty-programme-SC-109 - Points reduce the bill

- **WHEN** a member pays points toward a purchase
- **THEN** the amount they owe in money falls by those points at the
  programme's exchange rate
- **AND** their redeemable balance falls by the points paid

#### Scenario: grade10-site-loyalty-programme-SC-110 - The part paid with points earns nothing

- **WHEN** a purchase is paid partly with points and partly with money
- **THEN** points are earned on the money part alone

#### Scenario: grade10-site-loyalty-programme-SC-111 - One debit however the channel settles it

- **WHEN** a member pays 100 points toward a purchase on a channel that
  settles through a money-off artifact
- **THEN** 100 points leave their balance, the same as a channel debiting
  directly
- **AND** exactly one redemption is recorded for that payment

#### Scenario: grade10-site-loyalty-programme-SC-112 - A channel's own limit is disclosed before the points go

- **WHEN** a channel settles through an artifact that cannot be spent on the
  member's cart
- **THEN** the member is told before any points leave their balance

## REMOVED Requirements

### Requirement: A physical reward waits to be collected in person

**Reason**: Counter collection and the fulfilment queue are retired; a
physical reward now settles the instant its coupon is applied, as an
ordinary sale.

**Migration**: A physical reward's redemption issues a 100%-off coupon
under "A redemption settles as a coupon, whatever the reward"; nothing
waits for a handover, and scenarios SC-67, SC-68 and SC-69 retire with this
requirement.

### Requirement: A redemption settles by what the reward is, and never turns back into points

**Reason**: A physical reward no longer settles by a separate handover; its
coupon takes 100% off the same way a product coupon or a gift does, so the
requirement is restated to cover every reward kind alike.

**Migration**: Replaced by "A redemption settles as a coupon, whatever the
reward" above. Scenarios SC-103 through SC-106 retire with this
requirement; the behaviour each named — a physical reward as a coupon, no
undoing a redemption, a coupon's own expiry, and no points at an
auction — continues under SC-159 through SC-162.
