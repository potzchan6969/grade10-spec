# grade10-site/loyalty/programme Specification

## Purpose

A points-and-tiers membership programme: members earn points on qualifying
spend, points expire, tiers change what a member earns, and points buy items
from a reward menu. One programme runs per product, configured with its own
currency, earn rate, expiry window and tier ladder.

Product context: [Grade10 loyalty programme](../../../../../docs/prds/products/grade10-site/loyalty/index.md).

## Feature set

- Membership and ledger
  - Member record: one per user identity, created by the first activity
    recorded, holding no personal data
  - Point ledger: dated entries that are never edited, so a balance is always
    derived rather than stored
  - Two counts: earning credits the balance and the tier progress; redeeming
    spends only the balance, so spending points never costs a tier
  - Retry safety: a mutation repeated under its own key answers once and
    records nothing twice
- Earning and expiry
  - Earn pricing: a money amount becomes points at the programme's rate and
    the member's multiplier, in the rounding order the deployment names
  - Qualifying spend: what the member paid for eligible goods, after
    discounts and coupons, apportioned so a discount cannot be pushed onto
    the non-earning lines; gift cards, fees and auctions earn nothing
  - Inactivity expiry: the whole balance lapses on one date after the
    inactivity window with no earn and no redemption; either pushes that date
    out, never in
  - Operator credits: a grant, a correction, a reversal or a reward given
    outright takes the date the balance already names and pushes it no
    further; where nothing is live, it starts the window from its own day
  - Purchase recording: a completed sale reaches the programme exactly once,
    from any channel, even when loyalty is unreachable
  - Refund claw-back: returned money loses the points it earned, never more
    than the member still holds from it, and the tier is judged again at once
- Tiers and invitations
  - Instant promotion: reaching the threshold promotes at that purchase; the
    next purchase earns at the new rate
  - Fixed period: a tier holds for its validity period and is kept by
    re-qualifying inside it, or lost; losing it resets the climb
  - Ladder validation: an ambiguous ladder stops the product at boot rather
    than when a member is evaluated
  - Invitation grants: a tier nobody can earn is held only through an
    operator's dated, revocable grant
  - Grade10's configuration: the currency, rate, inactivity window, tier
    period and ladder the product deploys
- Rewards and redemption
  - Reward menu: rewards priced in points, optionally stocked, optionally live
    only inside a window
  - Redemption record: what the member paid is kept, so repricing never
    rewrites what an earlier redemption cost
  - Settlement by kind: a coupon is minted at once; a physical reward waits
    for collection, and waiting is not a failure; handover completes once
    and notifies the member
  - Per-unit rewards: one redemption records quantity times unit price; a
    quantity above the bound is refused by name
  - Points at checkout: points pay part of a bill at the programme's rate,
    debited once when the paid order lands, and earn nothing on that part
  - Reversal: an operator's reversal of an unused redemption returns what it
    took under the balance's one date, and nothing into a window that has
    passed; a spent artifact stays spent
- Operator console
  - Permission split: reading a member, moving points, granting and removing
    tiers and editing rewards are held separately
  - Second factor and audit: a change needs a verified session and a
    hash-chained record that cannot be rewritten unseen
  - Identity boundary: names and email addresses stay in the identity system,
    behind that system's own permission
  - Expiry restart: an operator runs the inactivity window again from today,
    giving a balance more time without the member earning or redeeming
- Member surface
  - Membership home: tier, balance, tier progress, the tier period and the one
    date the balance expires on, in one place
  - Private activity: a member's own history without operator reasons, retry
    keys or the pricing behind an entry
  - Deletion: deleting the account ends the membership at once
## Requirements
### Requirement: One member record per user, created on first activity

The programme SHALL hold exactly one member record per user identity, created
the first time anything is recorded for that user, and SHALL treat joining as a
separate act from having activity recorded.

The member record SHALL hold no personal data beyond the user identity. Names,
email addresses and every other identity attribute stay in the identity system.

#### Scenario: grade10-site-loyalty-programme-SC-01 - Activity precedes joining
**Serves:** Membership and ledger - activity precedes joining

- **WHEN** points are recorded for a user who has never joined
- **THEN** a member record exists and holds those points
- **AND** the member is reported as not joined until they join

#### Scenario: grade10-site-loyalty-programme-SC-02 - Joining is idempotent
**Serves:** Membership and ledger - joining is idempotent

- **WHEN** a member joins more than once
- **THEN** the first join date stands and later attempts change nothing

### Requirement: The ledger is the only source of a balance

Every point movement SHALL be recorded as a dated entry that is never edited or
deleted. Both a member's balance and their tier progress SHALL be derived by
asking the ledger, never stored as running totals.

#### Scenario: grade10-site-loyalty-programme-SC-03 - Balance excludes expired and spent points
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a redeemable balance is asked for at a given instant
- **THEN** it counts every credit recorded before that instant, less what has been spent or clawed back
- **AND** it counts nothing once the member's inactivity window has passed

#### Scenario: grade10-site-loyalty-programme-SC-126 - Tier progress is derived from the same entries
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** tier progress is asked for over a given window
- **THEN** it counts the earnings dated inside that window and after the member's most recent demotion, less any claw-backs against them
- **AND** redemptions do not appear in it

#### Scenario: grade10-site-loyalty-programme-SC-04 - A balance never goes negative
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** any debit is recorded
- **THEN** it draws only on credits that have points remaining
- **AND** no sequence of recorded activity can drive a member below zero

#### Scenario: grade10-site-loyalty-programme-SC-05 - Every debit is fully accounted
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a debit is recorded
- **THEN** the credits it drew from, and how much it took from each, are recorded
- **AND** those amounts sum to exactly the debit

### Requirement: Every recorded mutation answers the same way when retried

Each mutation a caller can retry SHALL be identified by a caller-supplied key.
A retry under the same key SHALL return the original answer without recording
anything again. The same key carrying different input SHALL be refused as a
conflict.

#### Scenario: grade10-site-loyalty-programme-SC-10 - A retry is free
**Serves:** Membership and ledger - a retry is free

- **WHEN** a caller repeats a mutation under a key it already used
- **THEN** the original answer is returned and no new entry is recorded

#### Scenario: grade10-site-loyalty-programme-SC-11 - A reused key with new input is refused
**Serves:** Membership and ledger - a reused key with new input is refused

- **WHEN** a caller repeats a key with input that differs from the first call
- **THEN** the call is refused as a conflict

### Requirement: The redeemable balance expires after a period of inactivity

A member's whole redeemable balance SHALL expire once the programme's inactivity
window has passed with no earning and no redemption. Any qualifying spend and
any redemption SHALL reset that window for the whole balance, whatever the age
of the points in it — including a spend too small to earn a whole point, which
is activity even when it credits nothing.

The window SHALL be counted in calendar months on the programme's clock — the
same day of the month and time of day, the programme's months on — and a day
the target month does not have SHALL land on that month's last day. It is never
a count of days.

Resetting SHALL only ever push the window out. An activity dated in the past
SHALL NOT pull a member's expiry earlier than an activity already recorded, so a
late-arriving record can shorten no balance.

The balance SHALL stop counting at the instant the window passes, without
waiting for any scheduled process. A refund, a claw-back, an operator
correction, a campaign grant, or a reward an operator hands over outright SHALL
NOT reset the window. Points already expired SHALL NOT be revived by later
activity.

A member who holds any redeemable points SHALL have exactly one date on which
all of them expire. A credit an operator records SHALL take the date the
member's window already names, whatever date its own event carries. Where the
member holds no point that is still live, such a credit SHALL start the window
from its own date instead, which starts no life for anything that has already
lapsed.

A reversal SHALL give back only points that still have life. Where the
member's window has passed, what the debit took SHALL NOT be written back: no
credit is recorded that the next sweep would only remove, and the reversal
SHALL name the points it could not return rather than reporting a balance it
did not restore.

Each credit SHALL also carry its own expiry date, set when it is recorded, and a
credit SHALL count while the later of that date and the member's inactivity
window is still ahead. Once the dates already recorded have been brought up to
the window, no credit SHALL be recorded beyond it, and the two can disagree
only where the window has already passed.

Expiry SHALL be recorded as a dated entry like any other movement, naming the
whole amount it removed.

#### Scenario: grade10-site-loyalty-programme-SC-94 - Buying keeps the whole balance alive
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member earns points eleven months after their previous activity
- **THEN** the whole balance, oldest points included, expires an inactivity window after this earning
- **AND** not an inactivity window after the earning that produced those older points

#### Scenario: grade10-site-loyalty-programme-SC-95 - Redeeming also resets the window
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member redeems and records no other activity
- **THEN** the remaining balance expires an inactivity window after that redemption

#### Scenario: grade10-site-loyalty-programme-SC-96 - Expiry needs no sweep
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member's inactivity window passes
- **THEN** their balance stops counting toward what they can spend immediately

#### Scenario: grade10-site-loyalty-programme-SC-97 - Expired points do not come back
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member whose balance has expired makes a purchase
- **THEN** the new earning starts a fresh balance and a fresh inactivity window
- **AND** nothing that expired returns

#### Scenario: grade10-site-loyalty-programme-SC-98 - A correction does not extend the balance's life
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** an operator corrects a balance, or a refund claws points back
- **THEN** the member's inactivity window is unchanged
- **AND** points the correction adds expire with the rest of the balance

#### Scenario: grade10-site-loyalty-programme-SC-99 - A campaign grant does not keep the balance alive
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** an operator grants campaign points as a reward
- **THEN** the member's inactivity window is unchanged
- **AND** the granted points expire with the rest of the balance, on the date that window already names

#### Scenario: grade10-site-loyalty-programme-SC-100 - A spend too small to earn still counts as activity
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member's qualifying spend is below the price of one point
- **THEN** no points are credited
- **AND** the member's inactivity window is reset from that spend

#### Scenario: grade10-site-loyalty-programme-SC-101 - A late record cannot shorten the balance's life
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a purchase dated before the member's most recent activity is recorded
- **THEN** the balance's expiry is left where the later activity put it
- **AND** it is never pulled back toward the older date

#### Scenario: grade10-site-loyalty-programme-SC-150 - The window is calendar months, not a day count
**Serves:** Earning and expiry - the window is calendar months, not a day count

- **WHEN** a member's last activity is 3 January at 10:00 in the programme's zone
- **THEN** the balance lapses on 3 January the next year at 10:00, whether that is 365 or 366 days on
- **AND** an activity on 29 February lapses on 28 February the next year

#### Scenario: grade10-site-loyalty-programme-SC-151 - A record older than the window is written already lapsed
**Serves:** Earning and expiry - a record older than the window is written already lapsed

- **WHEN** an earning dated more than an inactivity window ago is recorded
- **THEN** its points are recorded with their own date already past, and count nothing
- **AND** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-102 - A partial sweep converges
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

#### Scenario: grade10-site-loyalty-programme-SC-180 - Operator points to an empty balance start the window
**Serves:** grade10-site-loyalty-programme-US-05 - operator points to an empty balance start the window

- **WHEN** an operator adds points to a member who holds no live points
- **THEN** those points expire an inactivity window after their own date
- **AND** a credit whose own date is already an inactivity window past is written already lapsed, and nothing that had lapsed counts again

#### Scenario: grade10-site-loyalty-programme-SC-181 - A backdated grant joins the window already running
**Serves:** grade10-site-loyalty-programme-US-05 - a backdated grant joins the window already running

- **WHEN** an operator adds points dated before today to a member whose balance is live
- **THEN** those points expire with the rest of the balance
- **AND** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-182 - Handing over a reward is not the member's activity
**Serves:** grade10-site-loyalty-programme-US-05 - a reward handed over is the operator's act, not the member's

- **WHEN** an operator gives a member a reward outright, without the member spending points for it
- **THEN** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-183 - A reversal into a lapsed balance returns nothing spendable
**Serves:** grade10-site-loyalty-programme-US-06 - a reversal into a lapsed balance says what it could not return

- **WHEN** a payment in points is reversed after the member's window has passed
- **THEN** no points are written back and the balance stays empty
- **AND** the answer names the points it could not return, rather than refusing the reversal

### Requirement: A tier ladder is ordered, and refused at boot when it is not

A programme's ladder SHALL be rejected when the product starts, not when a
member is evaluated, if it is ambiguous about which tier a member holds.

An earned tier is one a member reaches by earning. A tier reachable only by
invitation is not an earned tier: it lives by its invitation's own dates and is
exempt from every rule below that names an earned tier.

A ladder SHALL carry exactly one entry tier, which SHALL be its lowest rung.
Tier identifiers SHALL be unique. Each earned tier SHALL ask more qualifying
points than the tier below it, and every earned tier SHALL measure them over the
same window. Each earned tier SHALL resolve to a validity period equal to that
window — a term longer or shorter than the window it is measured over cannot be
re-qualified in — and to a retention threshold greater than zero and no greater
than the qualifying points that tier asks for; a programme naming no retention
threshold SHALL resolve it to that tier's own attainment points rather than be
refused. The programme SHALL carry an inactivity window longer than zero. The
programme's time zone SHALL name a real zone.

#### Scenario: grade10-site-loyalty-programme-SC-17 - Two tiers share an identifier
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a ladder repeats a tier identifier
- **THEN** the product fails to start, naming the identifier

#### Scenario: grade10-site-loyalty-programme-SC-18 - No entry tier, or more than one
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a ladder has other than exactly one tier every member starts on
- **THEN** the product fails to start, saying how many it found

#### Scenario: grade10-site-loyalty-programme-SC-19 - The entry tier is not the lowest rung
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the tier every member starts on is not first in the ladder
- **THEN** the product fails to start

#### Scenario: grade10-site-loyalty-programme-SC-20 - A higher tier is cheaper than the one below it
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an earned tier asks no more qualifying points than the tier beneath it
- **THEN** the product fails to start, naming both amounts
- **AND** no member can hold a tier they skipped past

#### Scenario: grade10-site-loyalty-programme-SC-21 - Earned tiers measure over different windows
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** two earned tiers count qualifying points over different periods
- **THEN** the product fails to start, naming the periods

#### Scenario: grade10-site-loyalty-programme-SC-127 - A retention threshold asks more than the tier itself
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an earned tier's retention threshold is greater than the qualifying points that tier asks for
- **THEN** the product fails to start, naming both amounts

#### Scenario: grade10-site-loyalty-programme-SC-128 - An earned tier has no validity period
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an earned tier carries a validity period of zero or less
- **THEN** the product fails to start, naming the tier

#### Scenario: grade10-site-loyalty-programme-SC-129 - The programme has no inactivity window
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the programme's inactivity window is zero or less
- **THEN** the product fails to start

#### Scenario: grade10-site-loyalty-programme-SC-22 - The programme names a zone that does not exist
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the programme's time zone is not a real IANA zone
- **THEN** the product fails to start, naming it

### Requirement: Grade10's programme

Grade10 SHALL run the programme in HKD on Asia/Hong_Kong time, granting one
point per HKD 10 of qualifying spend — floored to whole base points before the
tier multiplier applies — redeeming one point as HKD 1 at checkout, with a
member's redeemable balance expiring after twelve months carrying no earning
and no redemption.

Its ladder SHALL be, in ascending rank:

| Tier | Earns | Reached by | Valid for | Retained by |
| --- | --- | --- | --- | --- |
| Silver | 1× | Every member starts here | Always | — |
| Gold | 1.2× | 500 points earned in a rolling twelve months | Twelve months from activation | 500 points earned inside the validity period |
| Black | 1.7× | Invitation only | The invitation's own end date | A further invitation |

The persisted identifiers for those tiers SHALL be `silver`, `gold` and
`black`, matching their public names. The pre-launch Platinum and Diamond
identifiers SHALL NOT remain as compatibility aliases.

The annual cap on Black and the approval step before granting it are not
enforced by the programme and are not specified here.

These are the values the product deploys, not a range it may vary within. They
change by deploying a different configuration, never by an operator edit —
an operator who can rewrite what a purchase earns can mint money. The reward
menu is the intended lever and is editable.

Why these numbers, and what is still open about the top tier and the retention
threshold:
[Grade10 loyalty programme](../../../../../../../docs/prds/products/membership/index.md).

#### Scenario: grade10-site-loyalty-programme-SC-23 - A purchase earns at the member's rate
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a Gold member completes a HKD 1,000 qualifying purchase
- **THEN** they earn 120 points

#### Scenario: grade10-site-loyalty-programme-SC-130 - A fractional point is dropped
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a Silver member's qualifying spend is HKD 125.50
- **THEN** they earn 12 points

#### Scenario: grade10-site-loyalty-programme-SC-131 - Grade10 floors base points before the multiplier
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a Gold member's qualifying spend is HKD 139
- **THEN** they earn 15 points, never 16

#### Scenario: grade10-site-loyalty-programme-SC-24 - The second tier is reached by spending
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member's tier progress over the rolling twelve months reaches 500
- **THEN** they hold Gold from that instant

#### Scenario: grade10-site-loyalty-programme-SC-132 - Tier records use the public identifiers
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** enrollment, promotion or demotion records a Silver or Gold tier
- **THEN** the persisted identifier is `silver` or `gold`, respectively
- **AND** no record uses `platinum` or `diamond`

#### Scenario: grade10-site-loyalty-programme-SC-133 - Gold is retained by earning again
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a Gold member earns 500 points inside their validity period
- **THEN** they hold Gold for a further twelve months

#### Scenario: grade10-site-loyalty-programme-SC-134 - Gold lapses after a quiet year
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a Gold member earns 300 points in the twelve months following their upgrade
- **THEN** they hold Silver from the instant those twelve months end

#### Scenario: grade10-site-loyalty-programme-SC-135 - A quiet year empties the balance
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member records no earning and no redemption for twelve months
- **THEN** their redeemable balance is zero

#### Scenario: grade10-site-loyalty-programme-SC-136 - A point is worth one Hong Kong dollar at checkout
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member pays 100 points toward an HKD 800 purchase
- **THEN** HKD 100 is covered by points and HKD 700 remains payable in money
- **AND** the purchase earns on HKD 700

#### Scenario: grade10-site-loyalty-programme-SC-25 - The top tier cannot be bought
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member earns any number of points
- **THEN** they never reach Black by earning alone

### Requirement: An invitation-only tier is granted and revoked by an operator

A tier the programme marks as invitation-only SHALL be held only through an
explicit grant, which names who granted it and why, may carry an end date, and
may be revoked. A member SHALL hold at most one live invitation per tier.

An operator SHALL be able to list live invitations, so a grant can be found and
revoked, and SHALL be able to read which tiers the programme defines rather than
naming one from memory.

#### Scenario: grade10-site-loyalty-programme-SC-26 - A grant names an unknown tier
**Serves:** Tiers and invitations - a grant names an unknown tier

- **WHEN** a grant names a tier the programme does not define
- **THEN** it is refused as not found and nothing is recorded

#### Scenario: grade10-site-loyalty-programme-SC-27 - A grant names the entry tier
**Serves:** Tiers and invitations - a grant names the entry tier

- **WHEN** a grant names the tier every member starts on
- **THEN** it is refused as invalid

#### Scenario: grade10-site-loyalty-programme-SC-28 - Live grants can be found
**Serves:** Tiers and invitations - live grants can be found

- **WHEN** an operator lists invitations
- **THEN** every live grant is listed with its member, tier, reason and end date

### Requirement: A reward menu priced in points, and a redemption that remembers its price

The programme SHALL hold a menu of rewards, each priced in points, each carrying
the validity period of the coupon it issues, optionally limited in stock, and
optionally live only within a date window. Redeeming SHALL record what the member
paid at that moment and the coupon validity that applied, so repricing a reward,
or changing how long its coupon lasts, never changes what an earlier redemption
cost or how long its coupon runs.

A member SHALL be able to list what they have redeemed and the state of each.

#### Scenario: grade10-site-loyalty-programme-SC-29 - Repricing does not rewrite history
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a reward's point cost changes after a member redeemed it
- **THEN** the earlier redemption still records the price the member paid

#### Scenario: grade10-site-loyalty-programme-SC-137 - Re-dating a reward's coupon does not shorten one already issued
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a reward's coupon validity period changes after a member redeemed it
- **THEN** the coupon already issued keeps the validity it was issued with

#### Scenario: grade10-site-loyalty-programme-SC-30 - Stock is not oversold
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** two members redeem the last unit of a limited reward at once
- **THEN** exactly one succeeds and the other is refused as out of stock

#### Scenario: grade10-site-loyalty-programme-SC-31 - A reward outside its window cannot be redeemed
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member redeems a reward that is archived, or outside its live window
- **THEN** the redemption is refused

#### Scenario: grade10-site-loyalty-programme-SC-32 - The public menu shows only what a member can buy
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** the reward menu is read without signing in
- **THEN** it lists only live, unarchived rewards, each with its point price and the validity of the coupon it issues
- **AND** it does not disclose stock counts or edit history

### Requirement: A refund claws back what that money earned, and no more

When money is returned, the programme SHALL remove the points that money earned,
priced at the rate each credit recorded, and SHALL never remove more than the
member still holds from that money. A claw-back SHALL reduce both the member's
balance and their tier progress, SHALL NOT reset the member's
inactivity window, and SHALL re-evaluate the member's tier at once: money
returned is spend that never happened, so the tier it bought does not survive
it.

Splitting a refund into several parts SHALL claw back exactly what one refund
for the whole sum would have.

#### Scenario: grade10-site-loyalty-programme-SC-35 - A split refund matches a single refund
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a refund is recorded in two parts
- **THEN** the total clawed back equals what one refund of the combined amount removes

#### Scenario: grade10-site-loyalty-programme-SC-36 - A member who already spent the points is not driven negative
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a refund exceeds what the member still holds from that money
- **THEN** the shortfall is recorded and counted by cause
- **AND** the member's balance does not go below zero

#### Scenario: grade10-site-loyalty-programme-SC-37 - A refund before its earning is not lost
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a refund names money that has not yet earned anything
- **THEN** it is refused as not found and nothing is recorded
- **AND** a later retry claws back once the earning lands

#### Scenario: grade10-site-loyalty-programme-SC-38 - A claw-back cancels the tier contribution it removes
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** points are clawed back
- **THEN** the tier contribution of the earning they came from is reduced by the same amount
- **AND** it leaves the qualifying window at the same time that earning does

#### Scenario: grade10-site-loyalty-programme-SC-145 - A claw-back withdraws an unsupported retention extension
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **GIVEN** a purchase inside a tier's validity period reached its retention threshold and started a fresh validity period
- **WHEN** that purchase is fully refunded and the remaining points inside the original validity period no longer reach the retention threshold
- **THEN** the fresh validity period is withdrawn
- **AND** the member keeps the tier only until the original validity period ends
- **AND** their retention progress reflects only the points that remain

#### Scenario: grade10-site-loyalty-programme-SC-146 - A claw-back can demote
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a claw-back takes a member's tier progress below what attained their tier
- **THEN** they hold the tier their remaining points still reach, from that instant
- **AND** the drop is recorded in tier history

### Requirement: A purchase earns its points exactly once, even when loyalty is unreachable

A product that sells to a member SHALL record every completed purchase and every
refund against the programme, exactly once per money event, and SHALL keep
trying until the programme accepts it.

Selling SHALL NOT depend on the programme being reachable: a purchase SHALL
complete whether or not points can be recorded at that moment.

The product's selling currency SHALL match the programme's currency, and a
mismatch SHALL be detected when the product starts, not when a member buys
something.

#### Scenario: grade10-site-loyalty-programme-SC-39 - Points survive an outage
**Serves:** Earning and expiry - points survive an outage

- **WHEN** a purchase completes while the programme is unreachable
- **THEN** the purchase still completes for the buyer
- **AND** the points are granted once the programme is reachable again, without anyone re-entering them

#### Scenario: grade10-site-loyalty-programme-SC-40 - A repeated delivery grants nothing twice
**Serves:** Earning and expiry - a repeated delivery grants nothing twice

- **WHEN** the same money event is delivered to the programme more than once
- **THEN** the points are granted once

#### Scenario: grade10-site-loyalty-programme-SC-41 - One money event, one identity
**Serves:** Earning and expiry - one money event, one identity

- **WHEN** a purchase reaches its completed state through any path — a payment
  notification, a scheduled reconciliation, or a read that repairs it
- **THEN** exactly one money event is recorded for it, carrying an identity stable across retries

#### Scenario: grade10-site-loyalty-programme-SC-42 - A partial refund claws back only its own part
**Serves:** Earning and expiry - a partial refund claws back only its own part

- **WHEN** part of a purchase is refunded, and later another part
- **THEN** each refund claws back only the points its own amount earned

#### Scenario: grade10-site-loyalty-programme-SC-43 - A currency mismatch stops the product from starting
**Serves:** Earning and expiry - a currency mismatch stops the product from starting

- **WHEN** a product sells in a currency the programme does not run in
- **THEN** the product fails to start, naming both currencies

#### Scenario: grade10-site-loyalty-programme-SC-44 - A refused recording is reported, not swallowed
**Serves:** Earning and expiry - a refused recording is reported, not swallowed

- **WHEN** the programme refuses a recording
- **THEN** the refusal is logged and counted by its reason
- **AND** it is never reported as success

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
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** an operator without the action's permission attempts it
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-149 - Moving points does not carry tier removal
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** an operator holding only the point-movement permission attempts
  to remove a tier
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-164 - Moving points does not carry redemption cancellation
**Serves:** grade10-site-loyalty-programme-US-10 - Operator cancels a redemption under its own permission

- **WHEN** an operator holding only the point-movement permission attempts
  to cancel a redemption
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-46 - The record survives an attempt to rewrite it
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** any recorded operator action is altered or removed
- **THEN** verifying the log reports the position at which it breaks

#### Scenario: grade10-site-loyalty-programme-SC-47 - An action with no place to record it does not run
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** the operator log cannot be written
- **THEN** the action is refused rather than completed unrecorded

### Requirement: Operator point grants distinguish correction from reward

An operator SHALL be able both to correct a balance without affecting tier
progress, and to grant points that count toward tier progress. Each SHALL carry
a reason and SHALL be recorded in the operator log.

Before either is written, the console SHALL name the date the points will
expire on, so an operator adding points to a balance about to lapse sees it.

#### Scenario: grade10-site-loyalty-programme-SC-48 - A correction does not move a member up
**Serves:** Operator console - a correction does not move a member up

- **WHEN** an operator corrects a balance
- **THEN** the points are spendable
- **AND** the member's progress toward the next tier is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-49 - A campaign grant moves a member up
**Serves:** Operator console - a campaign grant moves a member up

- **WHEN** an operator grants campaign or sign-up points
- **THEN** those points count toward the next tier

#### Scenario: grade10-site-loyalty-programme-SC-184 - The form names the date before the points are written
**Serves:** grade10-site-loyalty-programme-US-05 - the grant form names the expiry date before writing

- **WHEN** an operator opens the form that adds points to a member
- **THEN** it names the day those points will expire
- **AND** it says when they would start the member's window rather than join one

### Requirement: An operator runs the programme from one console

An operator SHALL be able, subject to their own permissions, to: find a member
and read their loyalty state and activity; correct a balance and grant campaign
points; restart a member's expiry window; grant and revoke an invitation-only
tier and list live grants; remove a tier a member holds; create, edit and
archive rewards and see archived and scheduled ones; find a redemption and
reverse or cancel it; read what members have forfeited to expiry; and read the
operator log and verify it has not been tampered with.

The console SHALL show an operator only the sections their permissions allow,
using the same permission the action itself requires, so that what is shown and
what is allowed cannot disagree.

Where a second factor is required and missing, the console SHALL take the
operator to enrol or verify rather than reporting a refusal.

#### Scenario: grade10-site-loyalty-programme-SC-50 - Sections match permissions
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** an operator holding only the loyalty read permission opens the console
- **THEN** they can find and read members
- **AND** no section offering point movement, expiry restart, invitations, rewards, tier removal, redemption cancellation or the operator log is shown

#### Scenario: grade10-site-loyalty-programme-SC-51 - A missing second factor opens the gate
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** an operator attempts an action their role allows but their session has no verified second factor
- **THEN** the console takes them to verify, and the action completes afterwards

#### Scenario: grade10-site-loyalty-programme-SC-52 - A stale console reports what broke
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** the console reads a response whose shape it does not recognise
- **THEN** it reports which call failed to decode, rather than showing missing values

#### Scenario: grade10-site-loyalty-programme-SC-53 - A member can be found again later
**Serves:** grade10-site-loyalty-programme-US-05 - Operator runs the programme from one console

- **WHEN** an operator opens a member and shares the address of that view
- **THEN** the same member opens for the recipient

### Requirement: Reading a member's identity requires the identity permission

The programme holds no names or email addresses. Where a console shows them,
they SHALL be read from the identity system under the same permission the
identity administration surface requires, and SHALL NOT be obtainable through a
loyalty permission alone.

An identity read SHALL be possible only for an operator whose own session
carries that permission and a verified second factor; holding a connection
between services SHALL NOT by itself grant it.

Identity read SHALL NOT be stored in the programme, cached by any shared cache,
or written into the operator log; the log SHALL record which records were read,
by whom, and how many.

#### Scenario: grade10-site-loyalty-programme-SC-54 - A loyalty permission alone shows no identities
**Serves:** Operator console - a loyalty permission alone shows no identities

- **WHEN** an operator holding loyalty permissions but not the identity permission finds a member
- **THEN** the member's loyalty state is shown
- **AND** no name or email address is shown

#### Scenario: grade10-site-loyalty-programme-SC-55 - A service connection is not an authorisation
**Serves:** Operator console - a service connection is not an authorisation

- **WHEN** a service holding a connection to the identity system requests identities without an operator session carrying the identity permission
- **THEN** the request is refused

#### Scenario: grade10-site-loyalty-programme-SC-56 - Identity is never served from a shared cache
**Serves:** Operator console - identity is never served from a shared cache

- **WHEN** a response carrying identity is returned
- **THEN** it is marked as belonging to that caller alone and is not stored in a shared cache

#### Scenario: grade10-site-loyalty-programme-SC-57 - An identity read is recorded without copying the identities
**Serves:** Operator console - an identity read is recorded without copying the identities

- **WHEN** an operator reads member identities
- **THEN** the log records who read, which records, and how many
- **AND** it does not record the names or email addresses themselves

#### Scenario: grade10-site-loyalty-programme-SC-58 - A failed identity read does not degrade to blanks
**Serves:** Operator console - a failed identity read does not degrade to blanks

- **WHEN** the identity system cannot be reached
- **THEN** the console reports the failure
- **AND** no member is shown with a blank identity

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, when that
tier's validity period ends, their progress toward retaining it, their
progress to the next earned tier, their redeemable balance, and the one date
that balance expires on. Their own activity list SHALL NOT disclose operator
reasons, retry keys, or the internal pricing of an entry.

Each activity entry SHALL name what it was for, and which channel it came
from, in terms the member can read.

#### Scenario: grade10-site-loyalty-programme-SC-147 - The two counts are shown as two counts
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member reads their membership
- **THEN** the points that decide their tier and the points they can spend
  are shown as separate named figures

#### Scenario: grade10-site-loyalty-programme-SC-59 - An operator's reason stays out of a member's view
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: grade10-site-loyalty-programme-SC-60 - Retry keys and internal pricing stay out of a member's view
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: grade10-site-loyalty-programme-SC-61 - A retired reward is still readable in history
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member reads an activity entry for a reward that has since been
  archived
- **THEN** the entry still names that reward

#### Scenario: grade10-site-loyalty-programme-SC-165 - An activity entry names its channel
**Serves:** grade10-site-loyalty-programme-US-08 - Member sees what a channel does to their points, before and after

- **WHEN** a member reads an activity entry
- **THEN** it names the channel that activity came from, in terms the
  member can read

### Requirement: A member runs their own membership from one surface

A signed-in member SHALL be able to see their tier and when it lapses, their
progress toward retaining it and toward the next earned tier, their redeemable
balance and when it expires; join if they have not; read their activity; browse
the reward menu; redeem; and see the coupons they hold, each with its code,
state and validity period.

Redeeming twice by accident SHALL cost nothing, including when the member
reloads between attempts.

#### Scenario: grade10-site-loyalty-programme-SC-62 - A member who never joined is invited to
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member with recorded activity but no join date opens the surface
- **THEN** they are shown how to join, and their existing points

#### Scenario: grade10-site-loyalty-programme-SC-63 - A double redemption costs one
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member submits the same redemption twice, with or without a reload in between
- **THEN** exactly one redemption is recorded

#### Scenario: grade10-site-loyalty-programme-SC-148 - A coupon is readable as soon as it is issued
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member completes a redemption
- **THEN** the coupon's code and validity period are shown to them without a further step

#### Scenario: grade10-site-loyalty-programme-SC-64 - Dates read in the programme's time zone
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member reads a date the programme computed
- **THEN** it reads the same wherever the member is, in the programme's time zone

### Requirement: A per-unit reward redeems in a chosen quantity

The reward menu MAY price a reward per unit. Redeeming such a reward SHALL take
a quantity, cost exactly the unit price times the quantity in one recorded
redemption, and remember both the unit price and the quantity so repricing never
changes what it cost.

A programme offering a per-unit reward SHALL carry a per-redemption quantity
bound and a per-member daily bound, both greater than zero, and SHALL be refused
at boot when either is missing. A quantity above either bound SHALL be refused
naming the bound it broke — never silently clipped.

#### Scenario: grade10-site-loyalty-programme-SC-65 - One redemption, one debit
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a member redeems a per-unit reward at quantity five
- **THEN** exactly one redemption records five times the unit price
- **AND** the balance falls by exactly that amount

#### Scenario: grade10-site-loyalty-programme-SC-66 - A quantity above the bound is refused
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a redemption asks for more than the programme's per-redemption
  bound allows
- **THEN** it is refused naming the bound and nothing is recorded

### Requirement: Tier progress is a sum over a period, not a second balance

A member SHALL hold one balance, which rises on earning and falls on
redemption. Tier progress SHALL be the points that member earned inside a
stated period, summed from the same entries; it decides tier and SHALL NOT be
reduced by a redemption.

Every earning and every reward grant SHALL add to the balance and count toward
progress; an operator correction SHALL add to the balance alone. A redemption
SHALL reduce the balance alone. A claw-back SHALL reduce both, dated to the
earning it cancels.

The two SHALL run on independent clocks: a tier's validity is measured from the
date that tier was activated for that member, and the balance's expiry is
measured from that member's most recent earning or redemption.
Neither clock SHALL move the other.

#### Scenario: grade10-site-loyalty-programme-SC-70 - Redeeming costs no tier progress
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member whose balance is 600 and whose tier progress is 600 redeems a reward priced at 500 points
- **THEN** their balance is 100
- **AND** their tier progress is still 600, and their tier is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-71 - Earning adds to the balance and the progress
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member earns 40 points
- **THEN** their balance rises by 40, and the 40 counts toward their tier progress

#### Scenario: grade10-site-loyalty-programme-SC-72 - Losing the balance does not lose the tier
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member's balance expires
- **THEN** they keep the tier they hold until that tier's own validity period ends

#### Scenario: grade10-site-loyalty-programme-SC-73 - Losing the tier does not lose the balance
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member is downgraded at the end of a validity period
- **THEN** their redeemable balance is unchanged

### Requirement: A tier is activated the moment it is reached, and earns from the next purchase

A member SHALL be promoted at the instant their tier progress inside the
qualifying window reaches a tier's threshold, including on their first recorded
purchase, without waiting for any scheduled pass.

The spend that triggers a promotion SHALL be priced at the tier the member held
before it. The higher multiplier SHALL apply from the member's next earning
onward.

#### Scenario: grade10-site-loyalty-programme-SC-74 - A first purchase can promote
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member's first recorded purchase takes their tier progress to a tier's threshold
- **THEN** they hold that tier from that instant

#### Scenario: grade10-site-loyalty-programme-SC-75 - The triggering purchase earns at the old rate
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a purchase takes a member's tier progress from below a tier's threshold to at or above it
- **THEN** that purchase earns at the multiplier of the tier they held before it
- **AND** their next purchase earns at the new tier's multiplier

#### Scenario: grade10-site-loyalty-programme-SC-76 - A promotion dates the validity period
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member is promoted
- **THEN** one tier history entry records the move and that earning caused it
- **AND** the tier's validity period is measured from the instant that entry records

### Requirement: A tier is valid for a fixed period, and is re-qualified or lost

A member's effective tier SHALL be the highest of: the entry tier, any earned
tier whose validity period has not ended, and any live invitation.

Each earned tier SHALL carry a validity period, measured from the date that tier
was activated for that member. Earning that tier's retention threshold inside
the validity period SHALL start a fresh validity period at the
instant the previous one ends, counted again from zero for the new period.

A member who has not earned the retention threshold inside the validity period
SHALL lose that tier at the instant the period ends, falling to the highest tier
they still hold by earning or invitation — the entry tier when none is live. The
drop SHALL take effect at that instant, without waiting for a scheduled pass,
and SHALL be recorded the next time that member is evaluated.

Losing a tier SHALL also reset the member's tier progress: earnings dated
before the drop SHALL NOT count toward reaching or retaining any tier
afterwards, so the climb starts again from zero.

A tier SHALL NOT be lost inside its validity period except through a claw-back
or an operator's recorded act, and SHALL NOT be lost because the points that
qualified the member for it were spent or expired.

An operator holding the permission SHALL be able to remove a tier a member holds,
whatever its period says, recorded with who and why — the remedy for a tier
granted or reached in error.

#### Scenario: grade10-site-loyalty-programme-SC-77 - Re-qualifying keeps the tier
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member earns at least the retention threshold inside their tier's validity period
- **THEN** they keep that tier
- **AND** a fresh validity period starts at the instant the previous one ends

#### Scenario: grade10-site-loyalty-programme-SC-78 - Not re-qualifying drops the tier
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member's validity period ends and they earned less than the retention threshold inside it
- **THEN** they hold the entry tier from that instant, unless a higher tier is still live by earning or invitation

#### Scenario: grade10-site-loyalty-programme-SC-79 - Losing a tier resets the climb
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member is demoted at the end of a validity period and then makes a small purchase
- **THEN** only earnings dated after the demotion count toward reaching the tier again
- **AND** the earnings from the lapsed period do not re-promote them

#### Scenario: grade10-site-loyalty-programme-SC-80 - Spending points does not demote
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member redeems every point that qualified them for their tier
- **THEN** they keep that tier until its validity period ends

#### Scenario: grade10-site-loyalty-programme-SC-81 - A drop is observed, not scheduled
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a validity period or a dated invitation passes its end
- **THEN** the member stops holding that tier from that instant
- **AND** the drop is recorded the next time that member is evaluated

#### Scenario: grade10-site-loyalty-programme-SC-82 - An operator removes a tier granted in error
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** an operator with the permission removes a tier inside its validity period
- **THEN** the member falls to the highest tier they still hold
- **AND** the removal is recorded with who did it and why

#### Scenario: grade10-site-loyalty-programme-SC-83 - Tier history records each move
**Serves:** grade10-site-loyalty-programme-US-01 - Member holds one balance, with tier progress counted apart

- **WHEN** a member's effective tier changes
- **THEN** one entry records the move and what caused it

### Requirement: Qualifying spend is what the member actually paid for qualifying goods

Points SHALL be granted from qualifying spend: the qualifying lines of a
purchase, after every discount and every redeemed coupon, as an integer count of
minor units in the programme's currency.

A discount or coupon applied to a whole order SHALL be apportioned across its
lines in proportion to each line's pre-discount amount, and only the share
falling on qualifying lines SHALL reduce qualifying spend.

Qualifying spend SHALL never be less than zero.

#### Scenario: grade10-site-loyalty-programme-SC-84 - A discount reduces what the purchase earns
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a discount reduces what a member pays for qualifying goods
- **THEN** qualifying spend is the amount after the discount, not the amount before it

#### Scenario: grade10-site-loyalty-programme-SC-85 - A coupon reduces what the purchase it pays for earns
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member pays for part of a qualifying basket with a redeemed coupon
- **THEN** qualifying spend is the basket less the coupon's value

#### Scenario: grade10-site-loyalty-programme-SC-86 - An order discount cannot be pushed onto the non-earning lines
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** an order-level discount applies to an order that is four fifths qualifying goods and one fifth shipping, measured before the discount
- **THEN** four fifths of the discount reduces qualifying spend
- **AND** the fifth falling on shipping reduces nothing

#### Scenario: grade10-site-loyalty-programme-SC-87 - A fully discounted order earns nothing
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** discounts and coupons reduce qualifying spend to zero or below
- **THEN** no points are granted and no ledger entry is written

### Requirement: What earns points, and what does not

Purchases in the online store and at the counter SHALL earn. Every other source
SHALL earn nothing until the programme is specified to accept it.

Shipping charges, grading service fees, the purchase of a gift card, a credit
top-up, an auction win, and any line in a category the programme does not list
as qualifying SHALL NOT be qualifying spend.

Paying with a gift card or with store credit SHALL NOT change what a purchase
earns: qualifying goods bought with either earn as any other purchase does.

Every ledger entry SHALL record the channel the activity came from, valued
from one closed set: the channels that sell, and one non-sale value for a
row no channel sold — a correction, an expiry, a campaign grant. Nothing
defaults: a writer that names no channel is refused.

#### Scenario: grade10-site-loyalty-programme-SC-88 - Shipping and service fees earn nothing
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a purchase carries qualifying goods, a shipping charge and a grading service fee
- **THEN** qualifying spend is the qualifying goods alone

#### Scenario: grade10-site-loyalty-programme-SC-89 - A gift card earns once, not twice
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member buys a gift card
- **THEN** that purchase earns nothing
- **AND** spending that gift card on qualifying goods later earns as any other purchase does

#### Scenario: grade10-site-loyalty-programme-SC-90 - An auction win earns nothing
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member wins an auction
- **THEN** no points are granted

#### Scenario: grade10-site-loyalty-programme-SC-91 - A credit top-up earns nothing
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member tops up store credit
- **THEN** no points are granted

#### Scenario: grade10-site-loyalty-programme-SC-92 - A non-earning line earns nothing
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a purchase carries a line the programme names as non-earning — a grading service fee, a gift card, a credit top-up
- **THEN** that line is excluded from qualifying spend
- **AND** the rest of the purchase earns
- **AND** ❓ a line in no named category earns until a catalogue taxonomy exists to list qualifying categories; the seller reads a reserved SKU-prefix blocklist, and the white list this rule was drafted as is revisited when the taxonomy lands

#### Scenario: grade10-site-loyalty-programme-SC-93 - An entry names its channel
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** any earning or redemption is recorded
- **THEN** the entry carries the channel that sold, taken from the programme's closed set
- **AND** a recording naming no channel, or one outside that set, is refused
- **AND** a correction, an expiry or a campaign grant carries the non-sale value, never a selling channel

### Requirement: The programme owns balances and tiers, whatever channel sells

The programme SHALL hold the member record, both point counts, the tier, and
every coupon it issues, keyed to the Grade10 account identity. No commerce,
point-of-sale, or payment platform SHALL be the source of truth for a member's
balance, tier, or coupon.

Earning and redemption SHALL both be available in the online store and at the
counter. A channel the programme does not run on SHALL neither earn nor redeem,
and a purchase there SHALL complete regardless.

#### Scenario: grade10-site-loyalty-programme-SC-107 - One balance across both channels
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a member earns online and then redeems at the counter
- **THEN** both act on the same balance, and the counter sees the online earning

#### Scenario: grade10-site-loyalty-programme-SC-108 - The channel's copy is not the balance
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a channel has recorded a purchase the programme has not yet accepted
- **THEN** what the member reads as their balance is the programme's, not the channel's

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
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a member pays points toward a purchase
- **THEN** the amount they owe in money falls by those points at the
  programme's exchange rate
- **AND** their redeemable balance falls by the points paid

#### Scenario: grade10-site-loyalty-programme-SC-110 - The part paid with points earns nothing
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a purchase is paid partly with points and partly with money
- **THEN** points are earned on the money part alone

#### Scenario: grade10-site-loyalty-programme-SC-111 - One debit however the channel settles it
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a member pays 100 points toward a purchase on a channel that
  settles through a money-off artifact
- **THEN** 100 points leave their balance, the same as a channel debiting
  directly
- **AND** exactly one redemption is recorded for that payment

#### Scenario: grade10-site-loyalty-programme-SC-112 - A channel's own limit is disclosed before the points go
**Serves:** grade10-site-loyalty-programme-US-08 - Member sees what a channel does to their points, before and after

- **WHEN** a channel settles through an artifact that cannot be spent on the
  member's cart
- **THEN** the member is told before any points leave their balance

### Requirement: Deleting the account ends the membership at once

When a member's Grade10 account is deleted, the programme SHALL immediately
end the membership: the redeemable balance and tier progress SHALL fall to
zero, unexpired coupons SHALL be voided, and redemptions awaiting collection
SHALL be cancelled without refund. The ledger's record SHALL survive — nothing
is erased, the identity simply holds nothing any more.

#### Scenario: grade10-site-loyalty-programme-SC-113 - Deletion clears what the member held
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a member's account is deleted
- **THEN** their balance and tier progress are zero, their coupons are void, and their pending collections are cancelled

#### Scenario: grade10-site-loyalty-programme-SC-114 - Deletion does not wait for a window
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** an account is deleted inside a live inactivity window or tier term
- **THEN** the clearing is immediate, not deferred to either clock

### Requirement: Earning is priced in the programme's own currency, on its deployed rounding order

Points SHALL be granted from qualifying spend using the programme's earn rate
and the member's tier multiplier. The deployed configuration SHALL name where
the floor lands: either the money becomes whole base points before the
multiplier and the result floors again, or the total floors once after the rate
and the multiplier. The order changes by deploying a different configuration,
never by an operator edit.

The multiplier applied SHALL be the tier the member held immediately before this
spend is priced, so a spend that promotes a member earns at the tier they were
on when they made it.

A spend recorded in a currency other than the programme's SHALL be refused as
invalid rather than converted.

#### Scenario: grade10-site-loyalty-programme-SC-115 - Base points floor before the multiplier
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** the deployed order floors base points first
- **THEN** the money becomes whole base points at the earn rate
- **AND** the multiplier applies to those whole points, floored again

#### Scenario: grade10-site-loyalty-programme-SC-116 - A single floor at the end
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** the deployed order floors once at the end
- **THEN** the point total is floored once after applying the rate and the
  multiplier, not at each step

#### Scenario: grade10-site-loyalty-programme-SC-117 - A foreign currency is refused
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a spend arrives in a currency the programme does not run in
- **THEN** it is refused as invalid, naming both currencies
- **AND** no ledger entry is written

#### Scenario: grade10-site-loyalty-programme-SC-118 - Backdated activity keeps its own date
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a spend carries a date in the past
- **THEN** its tier contribution follows that date
- **AND** its effect on the inactivity window follows the expiry rule, never shortening it
- **AND** the multiplier applied is the tier the member held immediately before it is priced

#### Scenario: grade10-site-loyalty-programme-SC-119 - Future-dated activity is refused
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a spend carries a date more than five minutes ahead of now
- **THEN** it is refused as invalid

### Requirement: A spent redemption stays spent when its artifact expires

When what a redemption produced — a discount code, an uncollected
reward — passes its validity unused, the points SHALL NOT return by
themselves: the member bought it, and letting it lapse is the member's
responsibility. Points SHALL return only through an explicit operator
cancellation, recorded with who and why. An artifact that was used SHALL
never be reversed into points; any remedy for a used artifact is money,
outside the programme.

What members forfeit to expiry SHALL be counted and readable by an
operator, never silent.

#### Scenario: grade10-site-loyalty-programme-SC-120 - An expired unused code returns nothing by itself
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a discount code passes its validity with no use
- **THEN** the points remain spent
- **AND** the forfeit is counted where an operator can read it

#### Scenario: grade10-site-loyalty-programme-SC-121 - An operator cancellation is the credit path
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** an operator cancels a redemption whose artifact went unused
- **THEN** the points return per the reversal rules
- **AND** the cancellation records who and why

#### Scenario: grade10-site-loyalty-programme-SC-122 - A used artifact is never reversed
**Serves:** grade10-site-loyalty-programme-US-03 - Member redeems and can pay with points at checkout

- **WHEN** a cancellation names a redemption whose artifact was used
- **THEN** it is refused

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
spent without — the basket it has to reach, and the one channel it is good at
where it names only one. `CouponList` SHALL carry each issued
coupon — its code where the shop takes one — what it is for, its own expiry,
and whether it is spent, void or expired.
`ActivityList` SHALL name entries in terms a member reads, name the channel
each came from, and SHALL NOT carry an operator reason, a retry key, or
internal pricing.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and SHALL receive every count, date and state
through props — none of them SHALL fetch, subscribe to, or store product
state.

The operator console composes these same exports as brand-owned view code and
SHALL require no export of its own.

#### Scenario: grade10-site-loyalty-programme-SC-123 - The two counts are never summed
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** a member holds spendable points and qualifying points that differ
- **THEN** the summary shows both figures separately
- **AND** no single combined total is rendered

#### Scenario: grade10-site-loyalty-programme-SC-124 - A member's activity carries nothing operator-facing
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** an entry was written by an operator correction
- **THEN** the member's activity names the entry in member-readable terms
- **AND** it carries no operator reason, retry key or internal pricing

#### Scenario: grade10-site-loyalty-programme-SC-125 - The components take content, not sources
**Serves:** grade10-site-loyalty-programme-US-04 - Member reads two counts and redeems from one surface

- **WHEN** any of the four components is rendered
- **THEN** every count, date, state and word it shows arrived through props

#### Scenario: grade10-site-loyalty-programme-SC-185 - The summary names one expiry line
**Serves:** grade10-site-loyalty-programme-US-04 - the membership surface names one expiry line

- **WHEN** a member holding points reads their membership
- **THEN** one line names how many points expire and the day they go
- **AND** a member holding no points is shown no such line

#### Scenario: grade10-site-loyalty-programme-SC-186 - The expiry line warns inside the last 30 days
**Serves:** grade10-site-loyalty-programme-US-04 - the expiry line warns inside the last 30 days

- **WHEN** a member's balance expires in 30 days or fewer
- **THEN** the line is rendered in the warning tone, and says what keeps the points
- **AND** a balance expiring later is rendered in the plain tone

### Requirement: A reward names a kind, a discount and a scope

Every reward SHALL carry a kind — a product coupon that takes money off, or
a gift that adds a free line — and a discount and a scope stating what it
takes off and where. A product coupon's discount SHALL be a fixed amount, or
a percentage capped at a maximum discount; its scope SHALL be named products
or variants, a filter over the catalog's worlds and types, or the whole
order. A gift SHALL name the variant it adds and SHALL carry a minimum spend
greater than zero; a product coupon's minimum spend is optional.

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

#### Scenario: grade10-site-loyalty-programme-SC-158 - A reward with a definition is created from the console alone
**Serves:** grade10-site-loyalty-programme-US-09 - Operator authors a reward's full definition from the console

- **WHEN** an operator creates a reward naming its kind, discount, scope and
  combine setting in the console
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

### Requirement: An operator restarts a member's expiry window

An operator SHALL be able to run a member's inactivity window again from the
day they do it, so that a balance can be given more time without the member
earning or redeeming. The restart SHALL NOT name a day the operator chooses: it
lands an inactivity window from that day, on the programme's clock.

The restart SHALL carry a reason, SHALL be recorded in the operator log, and
SHALL NOT move points, so nothing about it reaches the member's activity. It
SHALL settle whatever has already lapsed before it moves the date, and SHALL
leave a window already further out where it stands. It SHALL require the same
permission as moving points.

#### Scenario: grade10-site-loyalty-programme-SC-176 - An operator restarts the window
**Serves:** grade10-site-loyalty-programme-US-05 - an operator restarts a member's window from the console

- **WHEN** an operator restarts a member's expiry window
- **THEN** the whole balance expires an inactivity window after that day
- **AND** the operator's reason is in the operator log

#### Scenario: grade10-site-loyalty-programme-SC-177 - A restart revives nothing
**Serves:** grade10-site-loyalty-programme-US-05 - a restart does not bring lapsed points back

- **WHEN** an operator restarts the window of a member whose balance has lapsed
- **THEN** what lapsed is written off first and does not return
- **AND** only points recorded after the lapse expire on the new date

#### Scenario: grade10-site-loyalty-programme-SC-178 - A restart never shortens a window
**Serves:** grade10-site-loyalty-programme-US-05 - a restart only ever pushes the date out

- **WHEN** an operator restarts the window of a member whose date is already further out
- **THEN** that date is left where it stands

#### Scenario: grade10-site-loyalty-programme-SC-179 - A restart moves no points
**Serves:** grade10-site-loyalty-programme-US-05 - a restart changes the date, never the balance

- **WHEN** an operator restarts a member's expiry window
- **THEN** the balance is unchanged
- **AND** nothing appears in the member's activity

