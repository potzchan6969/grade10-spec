# Loyalty — delta

## Feature set

- Rewards and redemption
  - Claiming a coupon: a coupon is held by nothing and is spent only by a paid
    order; claiming it on any sale releases the claim that stood before, and
    the order that carried it loses the cut and has its code deactivated
  - Reversal: an operator's reversal is refused while an order is claiming the
    coupon, and names that order
- Member surface
  - Coupon wallet: every coupon the member holds reads as spendable until a
    paid order takes it, and no surface names the sale claiming one

## ADDED Requirements

### Requirement: A coupon is held by nothing, and the newest claim is the only live one

A coupon SHALL be spendable by its member until a paid order takes it. No
order, draft or counter sale SHALL make it unspendable anywhere else, and no
surface SHALL offer a coupon it would then refuse as unavailable.

Claiming a coupon on a sale SHALL release the claim standing on any other
sale, in one movement, so that exactly one sale claims a coupon at a time. The
sale that loses the claim SHALL lose the coupon's cut, and the discount code
minted for it SHALL be deactivated. An online order that loses the claim SHALL
be cancelled with the member's other superseded drafts; a counter sale SHALL
keep its cart and collect without the cut, because the shop owns that cart and
it can still be tendered.

The earlier claim SHALL be released before the new one is made. A claim SHALL
be refused only where the earlier one cannot be released — a sale that has
already taken money, or a checkout the provider will not kill — and that
refusal SHALL say so rather than say the coupon is unavailable. A code the shop
will not deactivate SHALL NOT refuse a claim: the shop goes on honouring a code
a sale already carries whatever becomes of it, so refusing there would cost a
member their coupon and guard nothing.

A sale SHALL spend a coupon only where the shop gave its cut. A paid sale that
does not carry the coupon it promised SHALL give it back rather than spend it,
and one that carries a coupon the sale no longer claims SHALL be counted and
reported with the order on it. A coupon SHALL be spent by whichever sale
settles first, and never twice.

A claim SHALL be released when the sale holding it ends, whether it is
cancelled, superseded, or left to run out its own clock. No sale SHALL end
holding a claim and leave the coupon to a later sweep.

Asking the programme twice for a claim that still stands SHALL answer with
that same claim. Once a claim has been released, it SHALL NOT answer for the
sale that made it: the same sale asking again SHALL be given a new claim,
because the coupon is back in the member's wallet and refusing there would
refuse a coupon they can see. A claim the shop has already collected SHALL go
on refusing a second.

The member SHALL NOT be told anything when an earlier claim is released, and
SHALL NOT be shown which sale claims a coupon.

#### Scenario: grade10-site-loyalty-programme-SC-190 - A coupon on an unfinished checkout is still spendable
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member who chose a coupon at checkout and did not pay
- **WHEN** they start another checkout and choose the same coupon
- **THEN** the coupon applies to the new checkout
- **AND** the earlier order is cancelled and its code deactivated

#### Scenario: grade10-site-loyalty-programme-SC-191 - A counter sale keeps its cart and loses the cut
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon was applied to a counter sale nobody tendered
- **WHEN** they claim that coupon at an online checkout
- **THEN** the checkout carries the coupon's cut
- **AND** the counter sale is not cancelled, its code is deactivated, and the sale collects without the cut

#### Scenario: grade10-site-loyalty-programme-SC-192 - The counter claims a coupon an open checkout holds
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member with an open online checkout carrying a coupon
- **WHEN** they present that coupon at a till, or staff apply it from the panel
- **THEN** the counter sale carries the coupon's cut
- **AND** the online order is cancelled

#### Scenario: grade10-site-loyalty-programme-SC-193 - A second counter takes the coupon from the first
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is on a sale at one till
- **WHEN** they present the same coupon at another till
- **THEN** the second sale carries the cut and the first sale's code is deactivated

#### Scenario: grade10-site-loyalty-programme-SC-194 - A claim is refused where the earlier checkout will not die
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member claiming a coupon carried by an online checkout the provider will not kill
- **WHEN** the claim is made
- **THEN** it is refused, saying an earlier sale stands rather than that the coupon is unavailable
- **AND** the earlier checkout keeps the cut

#### Scenario: grade10-site-loyalty-programme-SC-201 - A counter sale never refuses a claim
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member claiming a coupon carried by a counter sale, and a shop that will not deactivate its code
- **WHEN** the claim is made
- **THEN** it stands and the new sale carries the cut
- **AND** the deactivation is retried until the shop agrees the code is gone

#### Scenario: grade10-site-loyalty-programme-SC-202 - A sale that did not carry the coupon gives it back
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a counter sale that promised a coupon and collected without its cut
- **WHEN** the sale settles
- **THEN** the coupon is unused and spendable, and nothing is recorded as having come off that sale

#### Scenario: grade10-site-loyalty-programme-SC-200 - A coupon on a sale that took money is not moved
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is carried by a sale that has been paid
- **WHEN** they claim that coupon on another sale
- **THEN** the claim is refused and the paid sale keeps the cut

#### Scenario: grade10-site-loyalty-programme-SC-195 - A coupon two sales collected is spent once and reported
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a coupon whose earlier sale collected a deactivated code and whose later sale also collected
- **WHEN** both settle
- **THEN** the coupon is spent by whichever settles first
- **AND** the other is reported with the order on it, and is not spent again

#### Scenario: grade10-site-loyalty-programme-SC-203 - A sale that gave a coupon back can claim it again

- **GIVEN** a counter sale that claimed a coupon and gave it back, leaving the coupon spendable
- **WHEN** the same sale claims that coupon again
- **THEN** the claim is made and the sale carries the cut

#### Scenario: grade10-site-loyalty-programme-SC-204 - Asking twice for a claim that stands answers the same claim

- **GIVEN** a sale holding a claim on a coupon
- **WHEN** the same sale asks for that claim again
- **THEN** it is answered with the claim it already holds, and the coupon is claimed once

#### Scenario: grade10-site-loyalty-programme-SC-205 - A counter sale that runs out of time gives the coupon back

- **GIVEN** a counter sale holding a coupon that the member walked away from
- **WHEN** the sale runs out its own clock
- **THEN** the coupon is spendable again at once, and the sale keeps its cart

#### Scenario: grade10-site-loyalty-programme-SC-196 - No surface names the sale claiming a coupon
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a member whose coupon is claimed by a sale
- **WHEN** they read their coupons, the cart prices them, or staff open the member's panel
- **THEN** every coupon reads as spendable, and none names the sale claiming it

## MODIFIED Requirements

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
it from their own session and the till scans it. Either way the coupon's
code SHALL be minted the moment it is chosen, against that session's sale,
and SHALL be reused for every later plan of the same sale. The member SHALL
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

#### Scenario: grade10-site-loyalty-programme-SC-159 - A physical reward's coupon takes 100% off its own variant
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a physical reward's coupon takes 100% off its own variant

- **WHEN** a member redeems a reward that is a physical item
- **THEN** the redemption issues a coupon that takes 100% off the reward's
  own variant
- **AND** no separate collection record is created

#### Scenario: grade10-site-loyalty-programme-SC-166 - A coupon reaches the counter by the member presenting it
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a coupon, identified at a till and attached to
  the sale
- **WHEN** they present that coupon from their own session and the till
  scans it
- **THEN** the sale carries the coupon's cut
- **AND** the code was minted when the member chose the coupon, not before

#### Scenario: grade10-site-loyalty-programme-SC-172 - Staff apply a member's coupon from the till session
**Serves:** grade10-site-loyalty-programme-US-07 - Member redeems any reward as one coupon

- **GIVEN** a member holding a coupon, identified at a till and attached to
  the sale
- **WHEN** staff apply that coupon from the member's open coupons in the
  panel
- **THEN** the sale carries the coupon's cut
- **AND** a later plan of the same sale keeps the coupon and mints no
  second code

#### Scenario: grade10-site-loyalty-programme-SC-197 - An unpaid sale never spent the coupon
**Serves:** grade10-site-loyalty-programme-US-11 - Member spends a coupon wherever they are, whatever they left open

- **GIVEN** a coupon carried by a sale that expired, was cancelled, or was abandoned
- **WHEN** the member reads their coupons
- **THEN** the coupon is unused and spendable

#### Scenario: grade10-site-loyalty-programme-SC-160 - A member cannot undo a redemption
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a member cannot undo a redemption

- **WHEN** a member holding an unused coupon asks for their points back
- **THEN** no member surface offers it, and the points are not returned

#### Scenario: grade10-site-loyalty-programme-SC-161 - A coupon expires on its own terms
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - a coupon expires on its own terms

- **WHEN** a coupon's validity period ends
- **THEN** it can no longer be used
- **AND** the member's redeemable balance is unaffected

#### Scenario: grade10-site-loyalty-programme-SC-162 - Points buy nothing at an auction
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-07` - points buy nothing at an auction

- **WHEN** a member attempts to pay for an auction purchase with points or
  with a coupon
- **THEN** it is refused

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
refused forever.

Returned points SHALL rejoin the redeemable balance under the inactivity
window already running: a reversal SHALL NOT reset that window, and SHALL
return nothing to a member whose window has already passed.

A member's tier progress SHALL be unaffected by a reversal, because the
redemption did not reduce it. Stock SHALL be returned only when the
redemption actually consumed a unit.

#### Scenario: grade10-site-loyalty-programme-SC-168 - A reversal voids the coupon
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a reversal voids the coupon

- **WHEN** an operator reverses a redemption
- **THEN** the coupon it issued can no longer be used
- **AND** the points it consumed return to the member's redeemable balance

#### Scenario: grade10-site-loyalty-programme-SC-169 - A used coupon cannot be reversed
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a used coupon cannot be reversed

- **WHEN** an operator reverses a redemption whose coupon has already been used
- **THEN** the reversal is refused and the points stay spent
- **AND** the operator is told why

#### Scenario: grade10-site-loyalty-programme-SC-198 - A reversal is refused while a sale claims the coupon
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a coupon claimed by a sale that can still collect its code
- **WHEN** an operator reverses the redemption that issued it
- **THEN** the reversal is refused, naming that sale

#### Scenario: grade10-site-loyalty-programme-SC-199 - A claim nothing moves is released on the programme's clock
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a counter sale claiming a coupon that nobody tendered and nobody claimed elsewhere
- **WHEN** the claim has stood longer than any code minted for it can be collected
- **THEN** the coupon is spendable again and an operator can reverse the redemption that issued it

#### Scenario: grade10-site-loyalty-programme-SC-167 - A refunded sale does not return the coupon
**Serves:** grade10-site-loyalty-programme-US-06 - Operator reverses a redemption a member cannot be given

- **GIVEN** a sale that spent a member's coupon and is then refunded
- **WHEN** the refund settles
- **THEN** the coupon stays used and the points it cost stay spent
- **AND** any points the member spent as a discount on that sale are returned

#### Scenario: grade10-site-loyalty-programme-SC-170 - A member cannot reverse their own redemption
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - a member cannot reverse their own redemption

- **WHEN** a member asks to reverse a redemption
- **THEN** no member surface offers it

#### Scenario: grade10-site-loyalty-programme-SC-171 - Restored points keep their original expiry
**Serves:** `grade10-site-loyalty-programme-US-04`, `grade10-site-loyalty-programme-US-06` - restored points keep their original expiry

- **WHEN** a redemption is reversed
- **THEN** the restored points rejoin the credits they were taken from, keeping those credits' own dates

#### Scenario: grade10-site-loyalty-programme-SC-173 - A reversal after the balance expired returns nothing
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an operator reverses a redemption for a member whose inactivity window has already passed
- **THEN** no points are returned, and the operator is told why

#### Scenario: grade10-site-loyalty-programme-SC-174 - Tier progress is untouched by a reversal
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a redemption is reversed
- **THEN** the member's tier progress is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-175 - An unlimited reward returns no stock
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a redemption of a reward that had unlimited stock is reversed
- **THEN** no stock is returned
