# Loyalty — delta

## MODIFIED Requirements

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `TierCard`, `TierInfoCard`,
`TierLadder`, `HowPointsWork`, `MemberPass`, `RewardMenu`, `CouponList`, and
`PointHistory` — and the props and copy type of each.

`TierCard` SHALL wear the skin of the tier held — silver, gold or black,
taken through a `variant` prop and never derived from the tier name the
consumer words — and SHALL render that tier name, the spendable balance,
what the balance pays at checkout as the consumer formats it, and the tier's
earn line. Where the tier names a qualifying threshold `TierCard` SHALL
render the qualifying count apart from the balance, never summed into it,
with the progress toward the threshold; where it names none it SHALL render
neither count nor progress. The card SHALL NOT be interactive. It SHALL NOT name a balance-expiry
day or count, nor derive any expiry wording from a clock or a balance of its
own — the whole balance lapses on one shared inactivity date, never in
parts.
The membership surface SHALL still render one line naming how many points
expire and the day they go, in the tone supplied with it, a member holding
no points seeing no such line — that line is the surface's own, never the
card's, and it SHALL NOT derive its day or tone from a clock or a balance of
its own.
`MemberPass` SHALL wear the skin of the tier held — silver, gold or
black, taken through a `variant` prop and never derived from the tier
name the consumer words — and SHALL render that tier name and the
member's account email, there being no name collected at registration.
`MemberPass` SHALL render the consumer's identification token as the
scannable code verbatim — the square alone, no typed code beside it —
and SHALL NOT mint, persist or substitute it — a fresh token arrives
only through props after `onRefresh` reports the ask. While a refresh is
in flight the refresh control SHALL show busy, and a refused refresh
SHALL toast the reason the consumer passes, once per refusal. When a
fresh token arrives, `MemberPass` SHALL dip the square out of view and
settle the fresh one in — a transition, never an abrupt swap — and
SHALL swap instantly under reduced motion. A refused refresh SHALL leave
the earlier code on show with its countdown running. The consumer SHALL render
`MemberPass` only once it holds a token; the block draws no placeholder of
its own. `MemberPass` SHALL
render a countdown to the next rotation, which the consumer sets inside the
code's life — never an expired rendering, the consumer rotating the code out
before it lapses — and SHALL carry no used state of its own: a code the till takes is
answered by the next minted token arriving through props,
so the pass keeps rotating rather than freezing on what was spent.
`TierInfoCard` SHALL render one tier of the programme — its name, the ask
its rung states as consumer-worded copy, and its benefits behind checks —
and SHALL wear the held tier's emphasis, a primary border and its tint,
where a `currentTier` prop marks it the rung held, never derived from the
tier name.

`TierLadder` SHALL draw the tiers in climb order inside a card — each rung
through the stepper, earned rungs beneath the held tier completed, the held
rung in progress, unearned rungs upcoming — and SHALL draw no connector
into a rung marked `invitationOnly`. Where the held rung is invitation-only
every other rung SHALL read upcoming, never completed, and neither the
qualifying count nor its footnote SHALL render however they are passed;
otherwise the count SHALL render inside the ladder's card only where both
the count and its target arrive. The ladder SHALL receive its rungs, the
held rung's index and the figures through props.

`HowPointsWork` SHALL render the programme's mechanics as rows — an icon,
a title and a body each, the icons the consumer's own — stacked on a
narrow viewport and paired across a wide one, every word arriving through
props.

`RewardMenu` SHALL price each reward in points, state a
money-off reward's own validity period, and state what its coupon cannot be
spent without — the basket it has to reach, and the one channel it is good at,
where it is good at only one. `CouponList` SHALL carry each issued
coupon - what it is for, its own expiry, and whether it is spent, void or
expired - and a code only where the consumer passes one; a reward coupon
carries none.
`PointHistory` SHALL name entries in terms a member reads, name the channel
each came from, and SHALL NOT carry an operator reason, a retry key, or
internal pricing. It SHALL render the earned, used and pending totals the
consumer passes it, offer a filter for each of those kinds alongside an
unfiltered view, and count the entries each filter answers on its trigger. A
filter that answers no entries SHALL NOT draw a trigger, and a ledger with
no entries at all SHALL draw the empty state the consumer supplies — message,
second line, and action if any. Pending entries SHALL group under their own
card ahead of the months; settled entries SHALL group by month and year. The
day on an entry is the day its points landed, so a pending entry carries no
date.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, or an equivalent content prop where the shape is
a list, and SHALL receive every count, date and state through props — none
of them SHALL fetch, subscribe to, or store product state.

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

- **WHEN** any of the membership surface's components is rendered
- **THEN** every count, date, state and word it shows arrived through props

<!-- trace:scenario id=g10.loyalty-programme.SC-mp1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp1 - The pass is rendered only once a token exists
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the consumer holds no token yet
- **THEN** the consumer does not render `MemberPass`
- **AND** the block draws no placeholder of its own

<!-- trace:scenario id=g10.loyalty-programme.SC-mp6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp6 - A refresh shows busy and a refusal keeps the earlier code
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the member asks for a fresh code and the ask is in flight
- **THEN** the refresh control shows busy
- **AND** a refused ask toasts the consumer's reason once, leaving the earlier code on show with its countdown running

<!-- trace:scenario id=g10.loyalty-programme.SC-mp7 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp7 - The countdown runs to the next rotation
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `MemberPass` renders a token with the time to its next rotation
- **THEN** the countdown reads down to that rotation
- **AND** no expired code is ever drawn, the consumer rotating the code out before it lapses

<!-- trace:scenario id=g10.loyalty-programme.SC-mp8 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp8 - A taken code is answered by the next token
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the till takes the pass's code and the consumer mints the next token
- **THEN** the pass shows the next token, keeping its rotation rather than freezing on the spent one
- **AND** the pass carries no used state of its own

<!-- trace:scenario id=g10.loyalty-programme.SC-mp2 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp2 - The pass encodes the consumer's token, never its own
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `MemberPass` renders a token
- **THEN** the scannable square encodes that token verbatim, no typed
  code beside it
- **AND** the pass mints, persists and substitutes it never

<!-- trace:scenario id=g10.loyalty-programme.SC-mp3 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp3 - The pass wears the skin of the tier held
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `MemberPass` is rendered for a silver, a gold or a black member
- **THEN** it wears that tier's skin, taken from the `variant` prop
- **AND** the skin never follows the tier name the consumer words

<!-- trace:scenario id=g10.loyalty-programme.SC-mp4 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp4 - A fresh code swaps the code area, never snaps
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a fresh token arrives after `onRefresh` reported the ask
- **THEN** the square eases out of view and the fresh one settles in
- **AND** under reduced motion the swap is instant

<!-- trace:scenario id=g10.loyalty-programme.SC-mp5 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-mp5 - The pass names the member by account email
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** `MemberPass` is rendered
- **THEN** it carries the member's account email under the tier name
- **AND** no display name, none being collected at registration

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

<!-- trace:scenario id=g10.loyalty-programme.SC-vkq rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-275 - The held tier wears the emphasis
**Serves:** grade10-site-loyalty-programme-US-13 - Member compares tiers and learns how points work

- **WHEN** `TierInfoCard` renders the rung marked `currentTier`
- **THEN** it wears the primary border and its tint
- **AND** the unheld rungs wear the plain border

<!-- trace:scenario id=g10.loyalty-programme.SC-rwd rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-276 - An invitation-held tier earns nothing beneath it
**Serves:** grade10-site-loyalty-programme-US-13 - Member compares tiers and learns how points work

- **WHEN** `TierLadder` renders a member whose held rung is `invitationOnly`
- **THEN** every other rung reads upcoming, never completed
- **AND** no connector is drawn into the held rung, and neither the qualifying count nor its footnote renders

<!-- trace:scenario id=g10.loyalty-programme.SC-xnm rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-277 - The qualifying line waits for both figures
**Serves:** grade10-site-loyalty-programme-US-13 - Member compares tiers and learns how points work

- **WHEN** `TierLadder` renders with a qualifying count but no target, or a target but no count
- **THEN** no qualifying line is rendered

<!-- trace:scenario id=g10.loyalty-programme.SC-fzj rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-278 - The mechanics rows take the consumer's icons and words
**Serves:** grade10-site-loyalty-programme-US-13 - Member compares tiers and learns how points work

- **WHEN** `HowPointsWork` renders a member's mechanics
- **THEN** every row's icon, title and body arrived through props
- **AND** the rows stack on a narrow viewport and pair across a wide one

