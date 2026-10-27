# Loyalty — delta

## Feature set

- Rewards and redemption
  - Member-readable code: every redemption mints one member-readable code
    at the moment it settles, unique to that redemption and bound to the
    member — gift or discount alike — and the scan QR names that
    redemption; the ticket shows code or collection line by context
- Member surface
  - Reward shop: the menu draws each reward as a card — the item's art or
    the coupon's gift tile, name, description, its deadline where the
    reward names one, and the price in points — and a press on the card
    opens the checkout surface
  - Reward checkout: a bottom sheet under 640px, a dialog from it up; it
    restates the reward, names where its coupon is spendable and how long
    it is good for, shows the balance before and after, refuses a short
    balance whole, and draws the redeemed state in the same surface
  - Redeemed ticket: a discount coupon's ticket carries the unique code the
    redemption minted; a gift's ticket names the collection in the code's
    place; no surface outside the cart offers Apply

## ADDED Requirements

### Requirement: A redemption's member-readable code is unique to it

Where a reward settles, the redemption SHALL mint one member-readable code
at the moment the coupon is issued — unique to that redemption, bound to
the member, and good at the channels the coupon names — and that holds
for a physical reward as for a money-off coupon. The code SHALL NOT be
shared across redemptions, so a code another member reads answers as one
nobody minted for them. The staff-facing scan QR SHALL be a short-lived,
single-use presentation of the member card naming that redemption, never
the code itself, so reading the code cannot spend it. Whether a ticket shows the code is
the surface's choice — a collection ticket names the collection in the
code's place.

The member-readable code is separate from the discount code a sale's claim
mints for that coupon's spend: claiming mints and deactivates per sale as
`grade10-site/loyalty/programme` already requires, unchanged by this code.

<!-- trace:scenario id=g10.loyalty-programme.SC-w4n rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-262 - The code is minted once per redemption
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** two redemptions of the same money-off reward settle
- **THEN** each coupon carries a different member-readable code
- **AND** each code answers only for the member it was minted to

<!-- trace:scenario id=g10.loyalty-programme.SC-q8z rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-263 - A physical reward mints a code the collection ticket leaves unseen
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** a redemption of a physical reward settles
- **THEN** it carries a member-readable code like a discount's
- **AND** its scan QR names that redemption, not its code
- **AND** the collection ticket names the collection in the code's place

## MODIFIED Requirements

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `TierCard`, `TierInfoCard`,
`TierLadder`, `HowPointsWork`, `MemberPass`, `RewardMenu`, `RewardItem`,
`RewardCheckout`, `CouponList`, and `ActivityList` — and the props and copy
type of each.

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
SHALL swap instantly under reduced motion. `MemberPass` SHALL
still render the code's life as a countdown while it lives — never an
expired rendering, the consumer rotating the code out before it lapses —
and SHALL carry no used state of its own: a code the till takes is
answered by the next minted token arriving through props,
so the pass keeps rotating rather than freezing on what was spent.

`RewardMenu` SHALL draw each reward as a card — the item's art or the
coupon's gift tile, the name, the description, the deadline where the
reward names one, and the price in points — and SHALL report a press on the
card rather than perform a redemption. A pointer over the card SHALL lift
its fill to the subtle background. Whether the balance can pay SHALL be
judged against the balance the consumer supplies, never derived. A
redemption SHALL always be one unit: the menu SHALL offer no quantity
control. A money-off reward's card SHALL still state its own validity period,
and state what its coupon cannot be spent without — the basket it has to
reach, and the one channel it is good at, where it is good at only one. The
card `RewardMenu` draws per reward SHALL be the exported `RewardItem`, which
consumers may place outside the menu.
`RewardCheckout` SHALL draw the checkout surface as a bottom sheet under
640px and as a dialog from 640px up. On the dialog the actions sit on the
trailing edge behind a Cancel, not stretched across the surface; on the
sheet the redeem action spans it. In its confirm phase it SHALL restate
the reward — its hero, the deadline where named, the name and description —
name where the coupon is spendable and how long it is good for, as supplied,
show the balance before and after the cost, and refuse a short balance
whole with the readout in the warning tone. A refusal the reward is gone
for SHALL close the surface — the refusal is raised outside it. A refusal
the member can retry SHALL leave the surface open and the press live, and
a balance dropped mid-checkout SHALL re-read the deficit row; either
refusal is raised outside the surface. Given a
redemption it SHALL
draw the redeemed phase in the same surface: the member-readable code a
discount coupon's ticket carries, the collection a gift's ticket names in
the code's place. Where the redemption supplies a scan QR the ticket
SHALL carry a Use now control in its action slot, and the surface SHALL
draw the scan QR as its own card apart from the ticket — collapsed until
the member opens it — placed where the surface lays the scan out, never
inside the ticket; a ticket facing the till from any member-opened
surface carries the control, and the cart's select sheet carries none.
A spent coupon's ticket SHALL mute, name it used, and drop the scan
control. The surface SHALL
offer no Apply action — applying a coupon to a basket belongs to the cart
alone.
`CouponList` SHALL carry each issued
coupon - what it is for, its own expiry, and whether it is spent, void or
expired - and a code only where the consumer passes one; a reward coupon
carries none. The coupons page SHALL list no spent coupon — a spent one
leaves the section.
`ActivityList` SHALL name entries in terms a member reads, name the channel
each came from, and SHALL NOT carry an operator reason, a retry key, or
internal pricing.

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

- **WHEN** any of the membership components is rendered
- **THEN** every count, date, state and word it shows arrived through props

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

<!-- trace:scenario id=g10.loyalty-programme.SC-m7v rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-264 - The shop draws a card per reward
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** `RewardMenu` renders an item and a coupon
- **THEN** the item's card carries its art and the coupon's carries the gift tile
- **AND** each names its reward, description, deadline where supplied and price in points
- **AND** a press reports the reward's id through `onSelect` and performs no redemption

<!-- trace:scenario id=g10.loyalty-programme.SC-j2f rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-265 - The menu offers no quantity
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** `RewardMenu` renders
- **THEN** no quantity control is drawn
- **AND** no quantity reaches the checkout surface

<!-- trace:scenario id=g10.loyalty-programme.SC-k9s rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-266 - The checkout surface swaps at 640px
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** `RewardCheckout` opens under 640px, and again at 640px or wider
- **THEN** the narrow open is a bottom sheet and the wide open is a dialog

<!-- trace:scenario id=g10.loyalty-programme.SC-p4d rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-267 - A short balance is refused whole, before the points go
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **GIVEN** a balance short of the reward's cost
- **WHEN** the confirm phase renders
- **THEN** the balance row names the deficit in the warning tone
- **AND** the redeem action is disabled

<!-- trace:scenario id=g10.loyalty-programme.SC-t8b rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-268 - The redeemed ticket carries the code or the collection, never Apply
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **WHEN** the redeemed phase renders for a discount coupon and for a gift
- **THEN** the coupon's ticket carries the unique code the redemption minted
- **AND** the gift's ticket names the collection in the code's place
- **AND** where the redemption supplies a scan token the ticket draws the QR
- **AND** neither draws an Apply action

<!-- trace:scenario id=g10.loyalty-programme.SC-t8c rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-269 - A run-out refusal closes the surface
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **GIVEN** the reward ran out — the consumer passes the refusal
- **WHEN** the confirm phase renders
- **THEN** the surface asks to close
- **AND** the refusal is raised outside the surface

<!-- trace:scenario id=g10.loyalty-programme.SC-t8d rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-270 - A retryable refusal keeps the surface
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **GIVEN** the redemption died on the wire — retryable, the consumer never
  passes the gone refusal
- **WHEN** the confirm phase renders
- **THEN** the surface stays open and the press stays live
- **AND** the refusal is raised outside the surface

<!-- trace:scenario id=g10.loyalty-programme.SC-t8e rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-271 - A balance dropped mid-checkout re-reads the deficit
**Serves:** grade10-site-loyalty-programme-US-12 - Member browses the shop, confirms the cost and sees the redemption

- **GIVEN** the balance fell short elsewhere since the surface opened — the
  consumer re-passes the lower balance
- **WHEN** the confirm phase renders
- **THEN** the deficit row re-reads the shortfall and refuses whole
- **AND** the shortfall is raised outside the surface
