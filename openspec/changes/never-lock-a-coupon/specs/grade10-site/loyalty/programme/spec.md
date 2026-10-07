# Loyalty — delta

## Feature set

- Membership and ledger
  - Retry safety: a mutation repeated under its own key answers once and
    records nothing twice; a coupon claim's key answers only while that claim
    stands
- Rewards and redemption
  - Settlement by kind: every reward is issued as a coupon at once; a
    physical reward's coupon takes 100% off its own variant, so it completes
    as an ordinary sale; a code is minted only for the sale that claims it,
    and a gift at the till is its own line with no code
  - Claiming a coupon: a coupon is held by nothing and is spent only by a paid
    order; claiming it on any sale releases the claim that stood before, and
    the code minted for that sale is deactivated
  - Reversal of a claimed coupon: an operator's reversal is refused while a
    sale is claiming the coupon, and names that sale
- Member surface
  - Coupon wallet: a coupon a sale claims reads as it would unclaimed, and
    nothing the member or the till panel shows names the sale claiming one

## ADDED Requirements

### Requirement: A coupon is held by nothing, and the newest claim is the only live one

A claim SHALL NOT hold a coupon: until a paid order takes it, a coupon a sale
claims SHALL be as spendable by its member as it would be unclaimed. No order,
draft or counter sale SHALL make it unspendable anywhere else, and no surface
SHALL offer a coupon it would then refuse as unavailable.

Claiming a coupon on a sale SHALL release the claim standing on any other
sale, in one movement, so that exactly one sale claims a coupon at a time. The
sale that loses the claim SHALL no longer claim the coupon, and the discount
code minted for it SHALL be deactivated. An online order that loses the claim
SHALL be cancelled with the member's other superseded drafts. A counter sale
SHALL keep its cart, because the shop owns that cart and it can still be
tendered; a cart that already carries the code, or a gift's line, can still
collect, and is settled as `grade10-site/store/discounts` requires.

The earlier claim SHALL be released before the new one is made. A claim SHALL
be refused only where the earlier one cannot be released — an online
checkout the provider reports collected, one the provider will not close, or
a sale whose order is not yet written and whose claim is under five minutes
old, since it may still be submitting — and that refusal SHALL say an
earlier sale stands rather than say the coupon is unavailable. A code
the shop will not deactivate SHALL NOT refuse a claim: the shop goes on
honouring a code a sale already carries whatever becomes of it, so refusing
there would cost a member their coupon and guard nothing.

A sale that names the shop's allocations SHALL spend a coupon only where the
shop gave its cut. A paid sale that does not carry the coupon it promised
SHALL give it back rather than spend it.
A coupon SHALL be spent once: by the sale that claims it, or, where no sale
claims it, by a paid sale that carried its cut. How a counter sale that
carried a coupon its order had given up is settled and reported is
`grade10-site/store/discounts`' own requirement.

A coupon an ended order has not yet given back SHALL NOT refuse a claim: the
claim SHALL take it back from that order first, as it does from any earlier
sale. A claim left by a checkout that stopped before its order was written
SHALL NOT refuse a claim either once it is five minutes old, past any checkout
still writing that order: the new claim SHALL release it first. A checkout
SHALL NOT write its order more than a minute after its claim, and SHALL be
refused instead, so a release never meets an order still being written.

A counter sale SHALL release its claim when another sale claims the coupon,
when a newer promise retires the sale, or an hour after its last plan,
whatever coupon it holds. An online order SHALL release its claim when it is
cancelled. An online order that expires SHALL keep its claim until its code
can no longer be collected, and the programme's own clock SHALL then release
it; a claim on another sale meanwhile closes that order first, as it does any
earlier sale, and is refused by name where it cannot. Every other sale that
ends SHALL give its claim back itself rather than leave the coupon to the
programme's clock.

A sale that gave its claim back SHALL be able to claim the coupon again.
Whether a counter sale can still carry the coupon's cut is
`grade10-site/store/discounts`' own requirement.

The member SHALL NOT be told that a claim moved, and SHALL NOT be shown which
sale claims a coupon; a till spend they were already told landed is corrected
as `grade10-site/store/membership` requires.

<!-- trace:scenario id=g10.loyalty-programme.SC-lbx rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-190 - A coupon on an unfinished checkout is still spendable
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member who chose a coupon at checkout and did not pay
- **WHEN** they start another checkout and choose the same coupon
- **THEN** the coupon applies to the new checkout
- **AND** the earlier order is cancelled and its code deactivated

<!-- trace:scenario id=g10.loyalty-programme.SC-lfq rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-191 - A counter sale keeps its cart and loses its claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon was applied to a counter sale nobody tendered
- **WHEN** they claim that coupon at an online checkout
- **THEN** the checkout carries the coupon's cut
- **AND** the counter sale is not cancelled and keeps its cart, and its code is deactivated

<!-- trace:scenario id=g10.loyalty-programme.SC-m19 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-192 - The counter claims a coupon an open checkout holds
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member with an open online checkout carrying a coupon
- **WHEN** they present that coupon at a till, or staff apply it from the panel
- **THEN** the counter sale carries the coupon's cut
- **AND** the online order is cancelled

<!-- trace:scenario id=g10.loyalty-programme.SC-hxh rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-193 - A second counter takes the coupon from the first
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is on a sale at one till
- **WHEN** they present the same coupon at another till
- **THEN** the second sale carries the cut and the first sale's code is deactivated

<!-- trace:scenario id=g10.loyalty-programme.SC-avv rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-240 - Two sales claiming one coupon at once leave one live claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member holding a coupon no sale claims
- **WHEN** two sales claim it at the same moment
- **THEN** neither is told the coupon is unavailable
- **AND** exactly one code minted for it is live

<!-- trace:scenario id=g10.loyalty-programme.SC-ail rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-194 - A claim is refused where the earlier checkout will not close
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member claiming a coupon carried by an online checkout the provider will not close
- **WHEN** the claim is made
- **THEN** it is refused, saying an earlier sale stands rather than that the coupon is unavailable
- **AND** the earlier checkout keeps the cut

<!-- trace:scenario id=g10.loyalty-programme.SC-fwa rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-201 - A counter sale never refuses a claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member claiming a coupon carried by a counter sale, and a shop that will not deactivate its code
- **WHEN** the claim is made
- **THEN** it stands and the new sale carries the cut
- **AND** the deactivation is retried until the shop agrees, or until the code has run out its own time

<!-- trace:scenario id=g10.loyalty-programme.SC-oc6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-202 - A sale that did not carry the coupon gives it back
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale that promised a coupon and collected without its cut
- **WHEN** the sale settles
- **THEN** the coupon is unused and spendable, and nothing is recorded as having come off that sale

<!-- trace:scenario id=g10.loyalty-programme.SC-pxx rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-200 - A coupon on a sale that took money is not moved
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is carried by an online checkout they have paid, before the store has settled it
- **WHEN** they claim that coupon on another sale
- **THEN** the claim is refused, saying an earlier sale stands
- **AND** the paid checkout keeps the cut

<!-- trace:scenario id=g10.loyalty-programme.SC-h5a rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-239 - A tendered counter sale whose order has not arrived does not refuse a claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale carrying a member's coupon, tendered, whose paid order has not reached the store
- **WHEN** the member claims that coupon on another sale
- **THEN** the claim stands and the new sale carries the cut
- **AND** the counter sale's code is deactivated

<!-- trace:scenario id=g10.loyalty-programme.SC-f9s rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-195 - A coupon two sales collected is spent once
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a coupon claimed by a later sale, whose earlier counter sale collected its deactivated code
- **WHEN** both sales are paid, in either order
- **THEN** the coupon is used once, by the later sale
- **AND** the earlier sale spends nothing

<!-- trace:scenario id=g10.loyalty-programme.SC-6ok rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-203 - A sale that gave a coupon back can claim it again
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale whose plan was refused after it claimed a coupon, before any code was minted, so the claim was given back
- **WHEN** staff plan the same sale again with that coupon
- **THEN** the claim is made and the sale carries the cut

<!-- trace:scenario id=g10.loyalty-programme.SC-4ph rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-205 - A counter sale that runs out of time gives the coupon back
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale holding a coupon that the member walked away from
- **WHEN** an hour passes since the sale's last plan
- **THEN** the coupon is spendable again, and the sale keeps its cart

<!-- trace:scenario id=g10.loyalty-programme.SC-11m rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-234 - A retired counter sale gives back the coupon it holds
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale holding one of the member's coupons, nobody tendered
- **WHEN** the member checks out online with a different coupon, which retires the counter sale
- **THEN** the coupon the counter sale held is spendable again and its code is deactivated
- **AND** the counter sale keeps its cart

<!-- trace:scenario id=g10.loyalty-programme.SC-7xj rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-237 - A coupon an ended order still holds is taken back at once
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose online order carrying a coupon was cancelled, before the programme was told to give that coupon back
- **WHEN** staff apply that coupon at a till
- **THEN** the sale carries the coupon's cut, rather than being told the coupon is unavailable

<!-- trace:scenario id=g10.loyalty-programme.SC-qhr rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-241 - A claim a stopped checkout left is taken back
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is claimed by a checkout that stopped before its order was written, more than five minutes ago, past any checkout still writing it
- **WHEN** they claim that coupon at a till or at an online checkout
- **THEN** the sale carries the coupon's cut, rather than being told the coupon is unavailable

<!-- trace:scenario id=g10.loyalty-programme.SC-f9r rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-242 - A claim a sale may still be submitting is refused by name
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is claimed by a sale whose order is not yet written, less than five minutes ago
- **WHEN** they claim that coupon at a till or at an online checkout
- **THEN** it is refused, saying an earlier sale stands rather than that the coupon is unavailable
- **AND** the claim that stood is not released

<!-- trace:scenario id=g10.loyalty-programme.SC-6jz rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-244 - A checkout that writes its order a minute after its claim is refused
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a checkout that claimed a member's coupon and has not yet written its order
- **WHEN** it comes to write the order more than a minute after the claim
- **THEN** the checkout is refused and no order is written
- **AND** the coupon is spendable again

<!-- trace:scenario id=g10.loyalty-programme.SC-lft rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-196 - No member or till surface names the sale claiming a coupon
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is claimed by a sale
- **WHEN** they read their coupons, the cart prices them, or staff open the member's panel
- **THEN** the coupon reads as spendable, as it would unclaimed, and none names the sale claiming it

## MODIFIED Requirements

### Requirement: Every recorded mutation answers the same way when retried

Each mutation a caller can retry SHALL be identified by a caller-supplied key.
A retry under the same key SHALL return the original answer without recording
anything again. The same key carrying different input SHALL be refused as a
conflict.

A coupon claim's key SHALL answer only while that claim stands. A retry of a
claim that still stands SHALL answer with that same claim. Once the claim has
been given back, the same key SHALL make a new claim, because the coupon is
back in the member's wallet and refusing there would refuse a coupon they can
see. A claim the shop has already collected SHALL go on refusing a second.

<!-- trace:scenario id=g10.loyalty-programme.SC-sn2 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-10 - A retry is free
**Serves:** Membership and ledger - a retry is free

- **WHEN** a caller repeats a mutation under a key it already used
- **THEN** the original answer is returned and no new entry is recorded

<!-- trace:scenario id=g10.loyalty-programme.SC-84w rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-11 - A reused key with new input is refused
**Serves:** Membership and ledger - a reused key with new input is refused

- **WHEN** a caller repeats a key with input that differs from the first call
- **THEN** the call is refused as a conflict

<!-- trace:scenario id=g10.loyalty-programme.SC-br3 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-204 - Asking twice for a claim that stands answers the same claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a sale holding a claim on a coupon
- **WHEN** the same sale asks for that claim again
- **THEN** it is answered with the claim it already holds, and the coupon is claimed once

<!-- trace:scenario id=g10.loyalty-programme.SC-ef4 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-235 - A claim given back makes a new claim under the same key
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a sale whose claim on a coupon was given back, leaving the coupon spendable
- **WHEN** the same sale asks for that coupon again under the same key
- **THEN** a new claim is made, rather than a refusal

<!-- trace:scenario id=g10.loyalty-programme.SC-z6m rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-236 - A claim the shop collected refuses a second
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a sale whose claim on a coupon the shop collected
- **WHEN** the same key asks for that coupon again
- **THEN** it is refused, and the coupon is used once

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

A coupon SHALL be usable in the online store, applied to the order without
the member typing anything. At the counter, a coupon SHALL reach the sale
inside the till session staff opened for the member, one of two ways: staff
apply it from the member's open coupons in the panel, or the member presents
it from their own session and the till scans it. Either way a product
coupon's code SHALL be minted the moment it is chosen, against that session's
sale, and SHALL be reused for every later plan of the same sale; a gift SHALL
reach the sale as its own line and carry no code, as
`grade10-site/store/discounts` requires. The member SHALL
be attached to the sale before either way is offered. A coupon SHALL NOT
apply to an auction purchase, and points SHALL NOT be spent against one. The
order's one discount-code slot is `grade10-site/store/discounts`' own
requirement, and a coupon is one case of it.

A coupon SHALL be marked used by a paid order and by nothing else. A coupon on
a sale nobody paid SHALL never have been spent, whatever became of that sale.

A member SHALL be able to read the coupons they hold — what each is for, its
validity period, and whether it has been used — and to present one for a
counter sale. A coupon's code SHALL NOT be shown as the coupon's identity or
offered for the member to keep: it is minted for one sale, and what the
member presents is the code for that sale alone.

<!-- trace:scenario id=g10.loyalty-programme.SC-gmp rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-159 - A physical reward's coupon takes 100% off its own variant
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a physical reward's coupon takes 100% off its own variant

- **WHEN** a member redeems a reward that is a physical item
- **THEN** the redemption issues a coupon that takes 100% off the reward's
  own variant
- **AND** no separate collection record is created

<!-- trace:scenario id=g10.loyalty-programme.SC-wks rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-166 - A coupon reaches the counter by the member presenting it
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a product coupon, identified at a till and
  attached to the sale
- **WHEN** they present that coupon from their own session and the till
  scans it
- **THEN** the sale carries the coupon's cut
- **AND** the code was minted when the member chose the coupon, not before

<!-- trace:scenario id=g10.loyalty-programme.SC-z32 rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-172 - Staff apply a member's coupon from the till session
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a product coupon, identified at a till and
  attached to the sale
- **WHEN** staff apply that coupon from the member's open coupons in the
  panel
- **THEN** the sale carries the coupon's cut
- **AND** a later plan of the same sale keeps the coupon and mints no
  second code

<!-- trace:scenario id=g10.loyalty-programme.SC-fhj rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-197 - An unpaid sale never spent the coupon
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a coupon carried by a sale that expired, was cancelled, or was abandoned
- **WHEN** the member reads their coupons
- **THEN** the coupon is unused

<!-- trace:scenario id=g10.loyalty-programme.SC-ve1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-160 - A member cannot undo a redemption
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a member cannot undo a redemption

- **WHEN** a member holding an unused coupon asks for their points back
- **THEN** no member surface offers it, and the points are not returned

<!-- trace:scenario id=g10.loyalty-programme.SC-zzl rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-161 - A coupon expires on its own terms
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a coupon expires on its own terms

- **WHEN** a coupon's validity period ends
- **THEN** it can no longer be used
- **AND** the member's redeemable balance is unaffected

<!-- trace:scenario id=g10.loyalty-programme.SC-cji rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-162 - Points buy nothing at an auction
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - points buy nothing at an auction

- **WHEN** a member attempts to pay for an auction purchase with points or
  with a coupon
- **THEN** it is refused

### Requirement: A member runs their own membership from one surface

A signed-in member SHALL be able to see their tier and when it lapses, their
progress toward retaining it and toward the next earned tier, their redeemable
balance and when it expires; join if they have not; read their activity; browse
the reward menu; redeem; and see the coupons they hold, each with its state and
validity period.

Redeeming twice by accident SHALL cost nothing, including when the member
reloads between attempts.

<!-- trace:scenario id=g10.loyalty-programme.SC-zdb rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-62 - A member who never joined is invited to
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member with recorded activity but no join date opens the surface
- **THEN** they are shown how to join, and their existing points

<!-- trace:scenario id=g10.loyalty-programme.SC-yh1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-63 - A double redemption costs one
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member submits the same redemption twice, with or without a reload in between
- **THEN** exactly one redemption is recorded

<!-- trace:scenario id=g10.loyalty-programme.SC-l3t rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-148 - A coupon is readable as soon as it is issued
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member completes a redemption
- **THEN** the coupon and its validity period are shown to them without a further step

<!-- trace:scenario id=g10.loyalty-programme.SC-phf rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-64 - Dates read in the programme's time zone
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member reads a date the programme computed
- **THEN** it reads the same wherever the member is, in the programme's time zone

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `MembershipSummary`, `RewardMenu`,
`CouponList`, and `ActivityList` — and the props and copy type of each.

`MembershipSummary` SHALL render the two counts as two counts, never one
total, alongside the tier held, the date its validity ends, and progress
toward retention. Where it is given an expiry line it SHALL render one line
naming how many points expire and the day they go, in the tone supplied with
it, and where it is given none it SHALL render no such line. It SHALL NOT
derive that line, that day, or that tone from a clock or a balance of its own;
the consumer withholds the line for a member holding no points.
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

### Requirement: Reversing a redemption restores the points it consumed, while its coupon is unused

Reversing a redemption SHALL be an operator action, recorded in the operator
log. No member action SHALL reverse one.

A reversal SHALL be possible only while the coupon the redemption issued is
unused. It is the remedy for a reward that cannot be honoured, such as an
item out of stock. It SHALL return exactly the number of points the
redemption consumed, as entries pointing back at the credits those points
came from so a later claw-back can still reach them, and SHALL void the
unused coupon. A coupon already used SHALL NOT be reversed, and its points
stay spent — including where the order that spent it is later refunded or
cancelled: the goods and the money go back, the coupon does not, and the
points it bought stay spent. Points a member spent as a discount on that same
order are returned by the refund, which is a separate movement from the
coupon. A redemption that produced nothing to consume SHALL still be
reversible on the same terms.

A reversal SHALL be refused while a sale is claiming the coupon, and SHALL
name that sale, because voiding a coupon whose code a sale can still collect
would return the points and give the discount. A claim that nothing else ever
moves SHALL be released on the programme's own clock, so a reversal is never
refused forever. That clock SHALL outlast every code minted for the claim, so
it never frees a coupon whose code a sale can still collect.

Returned points SHALL rejoin the redeemable balance under the inactivity
window already running: a reversal SHALL NOT reset that window, and SHALL
return nothing to a member whose window has already passed.

A member's tier progress SHALL be unaffected by a reversal, because the
redemption did not reduce it. Stock SHALL be returned only when the
redemption actually consumed a unit.

<!-- trace:scenario id=g10.loyalty-programme.SC-dd5 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-168 - A reversal voids the coupon
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a reversal voids the coupon

- **WHEN** an operator reverses a redemption
- **THEN** the coupon it issued can no longer be used
- **AND** the points it consumed return to the member's redeemable balance

<!-- trace:scenario id=g10.loyalty-programme.SC-l3j rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-169 - A used coupon cannot be reversed
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a used coupon cannot be reversed

- **WHEN** an operator reverses a redemption whose coupon has already been used
- **THEN** the reversal is refused and the points stay spent
- **AND** the operator is told why

<!-- trace:scenario id=g10.loyalty-programme.SC-m7u rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-198 - A reversal is refused while a sale claims the coupon
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a coupon claimed by a sale that can still collect its code
- **WHEN** an operator reverses the redemption that issued it
- **THEN** the reversal is refused, naming that sale

<!-- trace:scenario id=g10.loyalty-programme.SC-jqk rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-199 - A claim nothing moves is released on the programme's clock
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a claim on a coupon that no sale carries, left by a checkout that stopped before its order was written
- **WHEN** the claim has stood longer than any code minted for it can be collected
- **THEN** the coupon is spendable again and an operator can reverse the redemption that issued it

<!-- trace:scenario id=g10.loyalty-programme.SC-t6q rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-238 - The clock never frees a coupon whose code is live
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** an online order that expired claiming a coupon, with the code minted for it
- **WHEN** the code can still be collected
- **THEN** the claim stands, and an operator's reversal is refused naming that order
- **AND** the claim is released only after the code can no longer be collected

<!-- trace:scenario id=g10.loyalty-programme.SC-0nd rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-167 - A refunded sale does not return the coupon
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a sale that spent a member's coupon and is then refunded
- **WHEN** the refund settles
- **THEN** the coupon stays used and the points it cost stay spent
- **AND** any points the member spent as a discount on that sale are returned

<!-- trace:scenario id=g10.loyalty-programme.SC-8ec rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-170 - A member cannot reverse their own redemption
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a member cannot reverse their own redemption

- **WHEN** a member asks to reverse a redemption
- **THEN** no member surface offers it

<!-- trace:scenario id=g10.loyalty-programme.SC-gby rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-171 - Restored points keep their original expiry
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - restored points keep their original expiry

- **WHEN** a redemption is reversed
- **THEN** the restored points rejoin the credits they were taken from, keeping those credits' own dates

<!-- trace:scenario id=g10.loyalty-programme.SC-q28 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-173 - A reversal after the balance expired returns nothing
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an operator reverses a redemption for a member whose inactivity window has already passed
- **THEN** no points are returned, and the operator is told why

<!-- trace:scenario id=g10.loyalty-programme.SC-eol rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-174 - Tier progress is untouched by a reversal
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a redemption is reversed
- **THEN** the member's tier progress is unchanged

<!-- trace:scenario id=g10.loyalty-programme.SC-j0k rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-175 - An unlimited reward returns no stock
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a redemption of a reward that had unlimited stock is reversed
- **THEN** no stock is returned

### Requirement: A spent redemption stays spent when its artifact expires

When the coupon a redemption issued passes its own validity unused, the points
SHALL NOT return by themselves: the member bought it, and letting it lapse is
the member's responsibility. A discount code minted for one sale is not that
artifact: when it dies, its coupon goes back to the member's wallet and
nothing is forfeit. Points SHALL return only through an explicit operator
cancellation, recorded with who and why. A coupon that was used SHALL never be
reversed into points; any remedy for a used coupon is money, outside the
programme.

What members forfeit to expiry SHALL be counted and readable by an operator,
never silent.

<!-- trace:scenario id=g10.loyalty-programme.SC-dqm rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-120 - An expired unused code returns nothing by itself
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a coupon passes its validity with no use
- **THEN** the points remain spent
- **AND** the forfeit is counted where an operator can read it

<!-- trace:scenario id=g10.loyalty-programme.SC-5v5 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-233 - A code that dies with its sale forfeits nothing
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a coupon inside its validity, claimed by an online order that expired, whose code can no longer be collected
- **WHEN** the programme's clock releases the claim
- **THEN** the coupon is unused and spendable, rather than lapsed
- **AND** nothing is counted as forfeit

<!-- trace:scenario id=g10.loyalty-programme.SC-x8s rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-121 - An operator cancellation is the credit path
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** an operator cancels a redemption whose artifact went unused
- **THEN** the points return per the reversal rules
- **AND** the cancellation records who and why

<!-- trace:scenario id=g10.loyalty-programme.SC-xyn rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-122 - A used artifact is never reversed
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a cancellation names a redemption whose artifact was used
- **THEN** it is refused
