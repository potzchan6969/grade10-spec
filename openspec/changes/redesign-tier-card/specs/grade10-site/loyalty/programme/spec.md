# Loyalty — delta

## MODIFIED Requirements

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `TierCard`, `RewardMenu`,
`CouponList`, and `ActivityList` — and the props and copy type of each.

`TierCard` SHALL wear the skin of the tier held — silver, gold or black,
taken through a `variant` prop and never derived from the tier name the
consumer words — and SHALL render that tier name, the spendable balance,
what the balance pays at checkout as the consumer formats it, and the tier's
earn line. Where the tier names a qualifying threshold `TierCard` SHALL
render the qualifying count apart from the balance, never summed into it,
with the progress toward the threshold; where it names none it SHALL render
neither count nor progress. Given an `href` to the tier-and-benefits surface,
the whole card SHALL be the link to it. It SHALL NOT name a balance-expiry
day or count, nor derive any expiry wording from a clock or a balance of its
own — the whole balance lapses on one shared inactivity date, never in
parts.
The membership surface SHALL still render one line naming how many points
expire and the day they go, in the tone supplied with it, a member holding
no points seeing no such line — that line is the surface's own, never the
card's, and it SHALL NOT derive its day or tone from a clock or a balance of
its own.
`RewardMenu` SHALL price each reward in points, state a
money-off reward's own validity period, and state what its coupon cannot be
spent without — the basket it has to reach, and the one channel it is good at,
where it is good at only one. `CouponList` SHALL carry each issued
coupon - what it is for, its own expiry, and whether it is spent, void or
expired - and a code only where the consumer passes one; a reward coupon
carries none.
`ActivityList` SHALL name entries in terms a member reads, name the channel
each came from, and SHALL NOT carry an operator reason, a retry key, or
internal pricing.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and SHALL receive every count, date and state
through props — none of them SHALL fetch, subscribe to, or store product
state.

The operator console composes these same exports as brand-owned view code and
SHALL require no export of its own.

<!-- trace:scenario id=g10.loyalty-programme.SC-5u1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-123 - The two counts are never summed
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member holds spendable points and qualifying points that differ
- **THEN** the summary shows both figures separately
- **AND** no single combined total is rendered

<!-- trace:scenario id=g10.loyalty-programme.SC-y9e rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-124 - A member's activity carries nothing operator-facing
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an entry was written by an operator correction
- **THEN** the member's activity names the entry in member-readable terms
- **AND** it carries no operator reason, retry key or internal pricing

<!-- trace:scenario id=g10.loyalty-programme.SC-lig rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-125 - The components take content, not sources
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** any of the four components is rendered
- **THEN** every count, date, state and word it shows arrived through props

<!-- trace:scenario id=g10.loyalty-programme.SC-8qm rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-255 - The card wears the skin of the tier held
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `TierCard` is rendered for a silver, a gold or a black member
- **THEN** it wears that tier's skin, taken from the `variant` prop
- **AND** the skin never follows the tier name the consumer words

<!-- trace:scenario id=g10.loyalty-programme.SC-3vf rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-256 - A tier that names no threshold renders no progress
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `TierCard` is rendered for a tier that names no qualifying threshold
- **THEN** neither the qualifying count nor its progress is rendered

<!-- trace:scenario id=g10.loyalty-programme.SC-6xz rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-257 - The whole card opens the tier-and-benefits surface
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `TierCard` is given an `href`
- **THEN** the whole card is the link to it, the Benefits affordance included
- **AND** a plain press reports `onClick` while a modified press keeps the link's behaviour

<!-- trace:scenario id=g10.loyalty-programme.SC-tzp rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-185 - The summary names one expiry line
**Serves:** grade10-site-loyalty-programme-US-04 - the membership surface names one expiry line

- **WHEN** a member holding points reads their membership
- **THEN** one line names how many points expire and the day they go
- **AND** a member holding no points is shown no such line

<!-- trace:scenario id=g10.loyalty-programme.SC-dml rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-186 - The expiry line warns inside the last 30 days
**Serves:** grade10-site-loyalty-programme-US-04 - the expiry line warns inside the last 30 days

- **WHEN** a member's balance expires in 30 days or fewer
- **THEN** the line is rendered in the warning tone, and says what keeps the points
- **AND** a balance expiring later is rendered in the plain tone

<!-- trace:scenario id=g10.loyalty-programme.SC-ipk rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-243 - A reward coupon carries no code in the coupon list
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **GIVEN** a member holding a reward coupon, and a store coupon whose code the consumer passes
- **WHEN** `CouponList` renders them
- **THEN** the store coupon shows its code, and the reward coupon shows none
