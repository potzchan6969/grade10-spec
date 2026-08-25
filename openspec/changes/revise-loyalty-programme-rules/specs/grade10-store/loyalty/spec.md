# Loyalty — delta

## ADDED Requirements

### Requirement: Tier points and redeemable points are counted separately

The programme SHALL count two quantities for each member. Tier points are the
points earned inside a qualifying window; they decide tier and SHALL NOT be
reduced by a redemption. Redeemable points are the spendable balance; they rise
on earning and fall on redemption.

Every earning and every reward grant SHALL add the same amount to both
counts; an operator correction SHALL add to the redeemable balance alone. A redemption
SHALL reduce redeemable points alone. A claw-back SHALL reduce both.

The two SHALL run on independent clocks: a tier's validity is measured from the
date that tier was activated for that member, and the redeemable balance's
expiry is measured from that member's most recent earning or redemption.
Neither clock SHALL move the other.

#### Scenario: Redeeming costs no tier progress

- **WHEN** a member holding 600 tier points and 600 redeemable points redeems a reward priced at 500 points
- **THEN** their redeemable balance is 100
- **AND** their tier points are still 600, and their tier is unchanged

#### Scenario: Earning credits both counts

- **WHEN** a member earns 40 points
- **THEN** their tier points and their redeemable balance each rise by 40

#### Scenario: Losing the balance does not lose the tier

- **WHEN** a member's redeemable balance expires
- **THEN** they keep the tier they hold until that tier's own validity period ends

#### Scenario: Losing the tier does not lose the balance

- **WHEN** a member is downgraded at the end of a validity period
- **THEN** their redeemable balance is unchanged

### Requirement: A tier is activated the moment it is reached, and earns from the next purchase

A member SHALL be promoted at the instant their tier points inside the
qualifying window reach a tier's threshold, including on their first recorded
purchase, without waiting for any scheduled pass.

The spend that triggers a promotion SHALL be priced at the tier the member held
before it. The higher multiplier SHALL apply from the member's next earning
onward.

#### Scenario: A first purchase can promote

- **WHEN** a member's first recorded purchase takes their tier points to a tier's threshold
- **THEN** they hold that tier from that instant

#### Scenario: The triggering purchase earns at the old rate

- **WHEN** a purchase takes a member's tier points from below a tier's threshold to at or above it
- **THEN** that purchase earns at the multiplier of the tier they held before it
- **AND** their next purchase earns at the new tier's multiplier

#### Scenario: A promotion dates the validity period

- **WHEN** a member is promoted
- **THEN** one tier history entry records the move and that earning caused it
- **AND** the tier's validity period is measured from the instant that entry records

### Requirement: A tier is valid for a fixed period, and is re-qualified or lost

A member's effective tier SHALL be the highest of: the entry tier, any earned
tier whose validity period has not ended, and any live invitation.

Each earned tier SHALL carry a validity period, measured from the date that tier
was activated for that member. Earning that tier's retention threshold in tier
points inside the validity period SHALL start a fresh validity period at the
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

#### Scenario: Re-qualifying keeps the tier

- **WHEN** a member earns at least the retention threshold in tier points inside their tier's validity period
- **THEN** they keep that tier
- **AND** a fresh validity period starts at the instant the previous one ends

#### Scenario: Not re-qualifying drops the tier

- **WHEN** a member's validity period ends and they earned less than the retention threshold inside it
- **THEN** they hold the entry tier from that instant, unless a higher tier is still live by earning or invitation

#### Scenario: Losing a tier resets the climb

- **WHEN** a member is demoted at the end of a validity period and then makes a small purchase
- **THEN** only earnings dated after the demotion count toward reaching the tier again
- **AND** the earnings from the lapsed period do not re-promote them

#### Scenario: Spending points does not demote

- **WHEN** a member redeems every point that qualified them for their tier
- **THEN** they keep that tier until its validity period ends

#### Scenario: A drop is observed, not scheduled

- **WHEN** a validity period or a dated invitation passes its end
- **THEN** the member stops holding that tier from that instant
- **AND** the drop is recorded the next time that member is evaluated

#### Scenario: An operator removes a tier granted in error

- **WHEN** an operator with the permission removes a tier inside its validity period
- **THEN** the member falls to the highest tier they still hold
- **AND** the removal is recorded with who did it and why

#### Scenario: Tier history records each move

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

#### Scenario: A discount reduces what the purchase earns

- **WHEN** a discount reduces what a member pays for qualifying goods
- **THEN** qualifying spend is the amount after the discount, not the amount before it

#### Scenario: A coupon reduces what the purchase it pays for earns

- **WHEN** a member pays for part of a qualifying basket with a redeemed coupon
- **THEN** qualifying spend is the basket less the coupon's value

#### Scenario: An order discount cannot be pushed onto the non-earning lines

- **WHEN** an order-level discount applies to an order that is four fifths qualifying goods and one fifth shipping, measured before the discount
- **THEN** four fifths of the discount reduces qualifying spend
- **AND** the fifth falling on shipping reduces nothing

#### Scenario: A fully discounted order earns nothing

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

Every ledger entry SHALL record the channel the activity came from.

#### Scenario: Shipping and service fees earn nothing

- **WHEN** a purchase carries qualifying goods, a shipping charge and a grading service fee
- **THEN** qualifying spend is the qualifying goods alone

#### Scenario: A gift card earns once, not twice

- **WHEN** a member buys a gift card
- **THEN** that purchase earns nothing
- **AND** spending that gift card on qualifying goods later earns as any other purchase does

#### Scenario: An auction win earns nothing

- **WHEN** a member wins an auction
- **THEN** no points are granted

#### Scenario: A credit top-up earns nothing

- **WHEN** a member tops up store credit
- **THEN** no points are granted

#### Scenario: An unlisted category earns nothing

- **WHEN** a purchase carries a line in a category the programme does not list as qualifying
- **THEN** that line is excluded from qualifying spend
- **AND** the rest of the purchase earns

#### Scenario: An entry names its channel

- **WHEN** any earning or redemption is recorded
- **THEN** the entry carries the channel that sold, taken from the programme's closed set
- **AND** a recording naming no channel, or one outside that set, is refused

### Requirement: The redeemable balance expires after a period of inactivity

A member's whole redeemable balance SHALL expire once the programme's inactivity
window has passed with no earning and no redemption. Any qualifying spend, any
reward grant, and any redemption SHALL reset that window for the whole balance,
whatever the age of the points in it — including a spend too small to earn a
whole point, which is activity even when it credits nothing.

Resetting SHALL only ever push the window out. An activity dated in the past
SHALL NOT pull a member's expiry earlier than an activity already recorded, so a
late-arriving record can shorten no balance.

The balance SHALL stop counting at the instant the window passes, without
waiting for any scheduled process. A refund, a claw-back, or an operator
correction SHALL NOT reset the window. Points already expired SHALL NOT be
revived by later activity.

Expiry SHALL be recorded as a dated entry like any other movement, naming the
whole amount it removed.

#### Scenario: Buying keeps the whole balance alive

- **WHEN** a member earns points eleven months after their previous activity
- **THEN** the whole balance, oldest points included, expires an inactivity window after this earning
- **AND** not an inactivity window after the earning that produced those older points

#### Scenario: Redeeming also resets the window

- **WHEN** a member redeems and records no other activity
- **THEN** the remaining balance expires an inactivity window after that redemption

#### Scenario: Expiry needs no sweep

- **WHEN** a member's inactivity window passes
- **THEN** their balance stops counting toward what they can spend immediately

#### Scenario: Expired points do not come back

- **WHEN** a member whose balance has expired makes a purchase
- **THEN** the new earning starts a fresh balance and a fresh inactivity window
- **AND** nothing that expired returns

#### Scenario: A correction does not extend the balance's life

- **WHEN** an operator corrects a balance, or a refund claws points back
- **THEN** the member's inactivity window is unchanged

#### Scenario: A campaign grant keeps the balance alive

- **WHEN** an operator grants campaign points as a reward
- **THEN** the whole balance expires an inactivity window after that grant

#### Scenario: A spend too small to earn still counts as activity

- **WHEN** a member's qualifying spend is below the price of one point
- **THEN** no points are credited
- **AND** the member's inactivity window is reset from that spend

#### Scenario: A late record cannot shorten the balance's life

- **WHEN** a purchase dated before the member's most recent activity is recorded
- **THEN** the balance's expiry is left where the later activity put it
- **AND** it is never pulled back toward the older date

#### Scenario: A partial sweep converges

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

### Requirement: A redemption settles by what the reward is, and never turns back into points

A reward that takes money off SHALL be delivered as a coupon carrying a discount
code. A reward that is a physical item SHALL be delivered by handing the item
over, and SHALL NOT be settled as a discount code. A coupon SHALL carry its own
validity period, taken from the reward it came from, independent of the member's
balance expiry.

Redemption SHALL be one way: no member action SHALL convert an issued coupon,
used or unused, back into points.

A coupon SHALL be usable in the online store and at the counter. A coupon SHALL
NOT apply to an auction purchase, and points SHALL NOT be spent against one.

A member SHALL be able to read the coupons they hold, each with its code, what it
is for, its validity period, and whether it has been used.

#### Scenario: A physical reward is not a discount code

- **WHEN** a member redeems a reward that is a physical item
- **THEN** the redemption records an item owed to them, and no discount code is issued

#### Scenario: A member cannot undo a redemption

- **WHEN** a member holding an unused coupon asks for their points back
- **THEN** no member surface offers it, and the points are not returned

#### Scenario: A coupon expires on its own terms

- **WHEN** a coupon's validity period ends
- **THEN** it can no longer be used
- **AND** the member's redeemable balance is unaffected

#### Scenario: Points buy nothing at an auction

- **WHEN** a member attempts to pay for an auction purchase with points or with a coupon
- **THEN** it is refused

### Requirement: The programme owns balances and tiers, whatever channel sells

The programme SHALL hold the member record, both point counts, the tier, and
every coupon it issues, keyed to the Grade10 account identity. No commerce,
point-of-sale, or payment platform SHALL be the source of truth for a member's
balance, tier, or coupon.

Earning and redemption SHALL both be available in the online store and at the
counter. A channel the programme does not run on SHALL neither earn nor redeem,
and a purchase there SHALL complete regardless.

#### Scenario: One balance across both channels

- **WHEN** a member earns online and then redeems at the counter
- **THEN** both act on the same balance, and the counter sees the online earning

#### Scenario: The channel's copy is not the balance

- **WHEN** a channel has recorded a purchase the programme has not yet accepted
- **THEN** what the member reads as their balance is the programme's, not the channel's

### Requirement: Points pay at checkout, at the programme's exchange rate

A member SHALL be able to pay part of a qualifying purchase with redeemable
points, converted at the programme's exchange rate, on any channel that sells.
Paying with points SHALL reduce the redeemable balance alone, SHALL count as
activity for the inactivity window, and SHALL NOT earn: qualifying spend counts
only what the member paid in money.

How a channel carries that payment is the channel's own concern — a checkout
that debits the balance directly and one that settles the same debit through a
money-off artifact SHALL cost the member the same points and record one
redemption either way. What an artifact may then be spent on is the channel's
rule, not the programme's: a channel MAY require a purchase to reach the
artifact's own value or refuse to combine it with another discount, and a
member offered points on such a channel SHALL be told what they can spend
before the points leave their balance, never after.

#### Scenario: Points reduce the bill

- **WHEN** a member pays points toward a purchase
- **THEN** the amount they owe in money falls by those points at the programme's exchange rate
- **AND** their redeemable balance falls by the points paid

#### Scenario: The part paid with points earns nothing

- **WHEN** a purchase is paid partly with points and partly with money
- **THEN** points are earned on the money part alone

#### Scenario: One debit however the channel settles it

- **WHEN** a member pays 100 points toward a purchase on a channel that settles through a money-off artifact
- **THEN** 100 points leave their balance, the same as a channel debiting directly
- **AND** exactly one redemption is recorded for that payment

#### Scenario: A channel's own limit is disclosed before the points go

- **WHEN** a channel settles through an artifact that cannot be spent on the member's cart
- **THEN** the member is told before any points leave their balance

### Requirement: Deleting the account ends the membership at once

When a member's Grade10 account is deleted, the programme SHALL immediately
end the membership: the redeemable balance and tier progress SHALL fall to
zero, unexpired coupons SHALL be voided, and redemptions awaiting collection
SHALL be cancelled without refund. The ledger's record SHALL survive — nothing
is erased, the identity simply holds nothing any more.

#### Scenario: Deletion clears what the member held

- **WHEN** a member's account is deleted
- **THEN** their balance and tier progress are zero, their coupons are void, and their pending collections are cancelled

#### Scenario: Deletion does not wait for a window

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

#### Scenario: Base points floor before the multiplier

- **WHEN** the deployed order floors base points first
- **THEN** the money becomes whole base points at the earn rate
- **AND** the multiplier applies to those whole points, floored again

#### Scenario: A single floor at the end

- **WHEN** the deployed order floors once at the end
- **THEN** the point total is floored once after applying the rate and the
  multiplier, not at each step

#### Scenario: A foreign currency is refused

- **WHEN** a spend arrives in a currency the programme does not run in
- **THEN** it is refused as invalid, naming both currencies
- **AND** no ledger entry is written

#### Scenario: Backdated activity keeps its own date

- **WHEN** a spend carries a date in the past
- **THEN** its tier contribution follows that date
- **AND** its effect on the inactivity window follows the expiry rule, never shortening it
- **AND** the multiplier applied is the tier the member held immediately before it is priced

#### Scenario: Future-dated activity is refused

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

#### Scenario: An expired unused code returns nothing by itself

- **WHEN** a discount code passes its validity with no use
- **THEN** the points remain spent
- **AND** the forfeit is counted where an operator can read it

#### Scenario: An operator cancellation is the credit path

- **WHEN** an operator cancels a redemption whose artifact went unused
- **THEN** the points return per the reversal rules
- **AND** the cancellation records who and why

#### Scenario: A used artifact is never reversed

- **WHEN** a cancellation names a redemption whose artifact was used
- **THEN** it is refused

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `MembershipSummary`, `RewardMenu`,
`CouponList`, and `ActivityList` — and the props and copy type of each.

`MembershipSummary` SHALL render the two counts as two counts, never one
total, alongside the tier held, the date its validity ends, and progress
toward retention. `RewardMenu` SHALL price each reward in points and state a
money-off reward's own validity period. `CouponList` SHALL carry each issued
code, what it is for, its own expiry, and whether it is spent or void.
`ActivityList` SHALL name entries in terms a member reads, and SHALL NOT carry
an operator reason, a retry key, or internal pricing.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and SHALL receive every count, date and state
through props — none of them SHALL fetch, subscribe to, or store product
state.

The operator console composes these same exports as brand-owned view code and
SHALL require no export of its own.

#### Scenario: The two counts are never summed

- **WHEN** a member holds spendable points and qualifying points that differ
- **THEN** the summary shows both figures separately
- **AND** no single combined total is rendered

#### Scenario: A member's activity carries nothing operator-facing

- **WHEN** an entry was written by an operator correction
- **THEN** the member's activity names the entry in member-readable terms
- **AND** it carries no operator reason, retry key or internal pricing

#### Scenario: The components take content, not sources

- **WHEN** any of the four components is rendered
- **THEN** every count, date, state and word it shows arrived through props

## MODIFIED Requirements

### Requirement: The ledger is the only source of a balance

Every point movement SHALL be recorded as a dated entry that is never edited or
deleted. Both the redeemable balance and the tier point count SHALL be derived
by asking the ledger, never stored as running totals.

#### Scenario: Balance excludes expired and spent points

- **WHEN** a redeemable balance is asked for at a given instant
- **THEN** it counts every credit recorded before that instant, less what has been spent or clawed back
- **AND** it counts nothing once the member's inactivity window has passed

#### Scenario: Tier points are derived from the same entries

- **WHEN** a tier point count is asked for over a given window
- **THEN** it counts the earnings dated inside that window and after the member's most recent demotion, less any claw-backs against them
- **AND** redemptions do not appear in it

#### Scenario: A balance never goes negative

- **WHEN** any debit is recorded
- **THEN** it draws only on credits that have points remaining
- **AND** no sequence of recorded activity can drive a member below zero

#### Scenario: Every debit is fully accounted

- **WHEN** a debit is recorded
- **THEN** the credits it drew from, and how much it took from each, are recorded
- **AND** those amounts sum to exactly the debit

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

#### Scenario: Two tiers share an identifier

- **WHEN** a ladder repeats a tier identifier
- **THEN** the product fails to start, naming the identifier

#### Scenario: No entry tier, or more than one

- **WHEN** a ladder has other than exactly one tier every member starts on
- **THEN** the product fails to start, saying how many it found

#### Scenario: The entry tier is not the lowest rung

- **WHEN** the tier every member starts on is not first in the ladder
- **THEN** the product fails to start

#### Scenario: A higher tier is cheaper than the one below it

- **WHEN** an earned tier asks no more qualifying points than the tier beneath it
- **THEN** the product fails to start, naming both amounts
- **AND** no member can hold a tier they skipped past

#### Scenario: Earned tiers measure over different windows

- **WHEN** two earned tiers count qualifying points over different periods
- **THEN** the product fails to start, naming the periods

#### Scenario: A retention threshold asks more than the tier itself

- **WHEN** an earned tier's retention threshold is greater than the qualifying points that tier asks for
- **THEN** the product fails to start, naming both amounts

#### Scenario: An earned tier has no validity period

- **WHEN** an earned tier carries a validity period of zero or less
- **THEN** the product fails to start, naming the tier

#### Scenario: The programme has no inactivity window

- **WHEN** the programme's inactivity window is zero or less
- **THEN** the product fails to start

#### Scenario: The programme names a zone that does not exist

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
| Gold | 1.2× | 500 tier points inside a rolling twelve months | Twelve months from activation | 500 tier points inside the validity period |
| Black | 1.7× | Invitation only | The invitation's own end date | A further invitation |

The annual cap on Black and the approval step before granting it are not
enforced by the programme and are not specified here.

These are the values the product deploys, not a range it may vary within. They
change by deploying a different configuration, never by an operator edit —
an operator who can rewrite what a purchase earns can mint money. The reward
menu is the intended lever and is editable.

Why these numbers, and what is still open about the top tier and the retention
threshold:
[Grade10 loyalty programme](../../../../docs/prds/loyalty/programme.md).

#### Scenario: A purchase earns at the member's rate

- **WHEN** a Gold member completes a HKD 1,000 qualifying purchase
- **THEN** they earn 120 points

#### Scenario: A fractional point is dropped

- **WHEN** a Silver member's qualifying spend is HKD 125.50
- **THEN** they earn 12 points

#### Scenario: Grade10 floors base points before the multiplier

- **WHEN** a Gold member's qualifying spend is HKD 139
- **THEN** they earn 15 points, never 16

#### Scenario: The second tier is reached by spending

- **WHEN** a member's tier points inside the rolling twelve months reach 500
- **THEN** they hold Gold from that instant

#### Scenario: Gold is retained by earning again

- **WHEN** a Gold member earns 500 tier points inside their validity period
- **THEN** they hold Gold for a further twelve months

#### Scenario: Gold lapses after a quiet year

- **WHEN** a Gold member earns 300 tier points in the twelve months following their upgrade
- **THEN** they hold Silver from the instant those twelve months end

#### Scenario: A quiet year empties the balance

- **WHEN** a member records no earning and no redemption for twelve months
- **THEN** their redeemable balance is zero

#### Scenario: A point is worth one Hong Kong dollar at checkout

- **WHEN** a member pays 100 points toward an HKD 800 purchase
- **THEN** HKD 100 is covered by points and HKD 700 remains payable in money
- **AND** the purchase earns on HKD 700

#### Scenario: The top tier cannot be bought

- **WHEN** a member earns any number of points
- **THEN** they never reach Black by earning alone

### Requirement: A reward menu priced in points, and a redemption that remembers its price

The programme SHALL hold a menu of rewards, each priced in points, each carrying
the validity period of the coupon it issues, optionally limited in stock, and
optionally live only within a date window. Redeeming SHALL record what the member
paid at that moment and the coupon validity that applied, so repricing a reward,
or changing how long its coupon lasts, never changes what an earlier redemption
cost or how long its coupon runs.

A member SHALL be able to list what they have redeemed and the state of each.

#### Scenario: Repricing does not rewrite history

- **WHEN** a reward's point cost changes after a member redeemed it
- **THEN** the earlier redemption still records the price the member paid

#### Scenario: Re-dating a reward's coupon does not shorten one already issued

- **WHEN** a reward's coupon validity period changes after a member redeemed it
- **THEN** the coupon already issued keeps the validity it was issued with

#### Scenario: Stock is not oversold

- **WHEN** two members redeem the last unit of a limited reward at once
- **THEN** exactly one succeeds and the other is refused as out of stock

#### Scenario: A reward outside its window cannot be redeemed

- **WHEN** a member redeems a reward that is archived, or outside its live window
- **THEN** the redemption is refused

#### Scenario: The public menu shows only what a member can buy

- **WHEN** the reward menu is read without signing in
- **THEN** it lists only live, unarchived rewards, each with its point price and the validity of the coupon it issues
- **AND** it does not disclose stock counts or edit history

### Requirement: Reversing a redemption restores the exact points it consumed

Reversing a redemption SHALL be an operator action, recorded in the operator log.
No member action SHALL reverse one.

A reversal SHALL be possible only while what the redemption produced is
unconsumed — a coupon not yet used, or a physical reward not yet collected. It
is the remedy for a reward that cannot be honoured, such as an item out of
stock. It SHALL return exactly the number of points the redemption consumed, as
entries pointing back at the credits those points came from so a later claw-back
can still reach them, and SHALL void an unused coupon or cancel a waiting
collection. A coupon already used, or a reward already handed over, SHALL NOT be
reversed, and its points stay spent. A redemption that produced nothing to
consume SHALL still be reversible on the same terms.
Returned points SHALL rejoin the redeemable balance under the inactivity window
already running: a reversal SHALL NOT reset that window, and SHALL return nothing
to a member whose window has already passed.

A member's tier points SHALL be unaffected by a reversal, because the redemption
did not reduce them. Stock SHALL be returned only when the redemption actually
consumed a unit.

#### Scenario: A reversal voids the coupon

- **WHEN** an operator reverses a redemption
- **THEN** the coupon it issued can no longer be used
- **AND** the points it consumed return to the member's redeemable balance

#### Scenario: A collected reward cannot be reversed

- **WHEN** an operator reverses a redemption whose physical reward was already handed over
- **THEN** it is refused and the points stay spent

#### Scenario: A waiting collection is cancelled by the reversal

- **WHEN** an operator reverses a redemption whose physical reward is still waiting
- **THEN** the points return and the collection is cancelled

#### Scenario: A used coupon cannot be reversed

- **WHEN** an operator reverses a redemption whose coupon has already been used
- **THEN** the reversal is refused and the points stay spent
- **AND** the operator is told why

#### Scenario: A member cannot reverse their own redemption

- **WHEN** a member asks to reverse a redemption
- **THEN** no member surface offers it

#### Scenario: Restored points keep their original expiry

- **WHEN** a redemption is reversed
- **THEN** the restored points rejoin the credits they were taken from, keeping those credits' own dates
- **AND** they fall under the member's inactivity window already running, which the reversal does not reset

#### Scenario: A reversal after the balance expired returns nothing

- **WHEN** an operator reverses a redemption for a member whose inactivity window has already passed
- **THEN** no points are returned, and the operator is told why

#### Scenario: Tier progress is untouched by a reversal

- **WHEN** a redemption is reversed
- **THEN** the member's tier points are unchanged

#### Scenario: An unlimited reward returns no stock

- **WHEN** a redemption of a reward that had unlimited stock is reversed
- **THEN** no stock is returned

### Requirement: A refund claws back what that money earned, and no more

When money is returned, the programme SHALL remove the points that money earned,
priced at the rate each credit recorded, and SHALL never remove more than the
member still holds from that money. A claw-back SHALL reduce both the member's
redeemable balance and their tier points, SHALL NOT reset the member's
inactivity window, and SHALL re-evaluate the member's tier at once: money
returned is spend that never happened, so the tier it bought does not survive
it.

Splitting a refund into several parts SHALL claw back exactly what one refund
for the whole sum would have.

#### Scenario: A split refund matches a single refund

- **WHEN** a refund is recorded in two parts
- **THEN** the total clawed back equals what one refund of the combined amount removes

#### Scenario: A member who already spent the points is not driven negative

- **WHEN** a refund exceeds what the member still holds from that money
- **THEN** the shortfall is recorded and counted by cause
- **AND** the member's balance does not go below zero

#### Scenario: A refund before its earning is not lost

- **WHEN** a refund names money that has not yet earned anything
- **THEN** it is refused as not found and nothing is recorded
- **AND** a later retry claws back once the earning lands

#### Scenario: A claw-back cancels the tier contribution it removes

- **WHEN** points are clawed back
- **THEN** the tier contribution of the earning they came from is reduced by the same amount
- **AND** it leaves the qualifying window at the same time that earning does

#### Scenario: A claw-back can demote

- **WHEN** a claw-back takes a member's tier points below what attained their tier
- **THEN** they hold the tier their remaining points still reach, from that instant
- **AND** the drop is recorded in tier history

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, when that tier's
validity period ends, their progress toward retaining it, their progress to the
next earned tier, their redeemable balance, and the date that balance expires if
they record no further activity. Their own activity list SHALL NOT disclose
operator reasons, retry keys, or the internal pricing of an entry.

Each activity entry SHALL name what it was for, and which channel it came from,
in terms the member can read.

#### Scenario: The two counts are shown as two counts

- **WHEN** a member reads their membership
- **THEN** the points that decide their tier and the points they can spend are shown as separate named figures

#### Scenario: An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: A retired reward is still readable in history

- **WHEN** a member reads an activity entry for a reward that has since been archived
- **THEN** the entry still names that reward

### Requirement: A member runs their own membership from one surface

A signed-in member SHALL be able to see their tier and when it lapses, their
progress toward retaining it and toward the next earned tier, their redeemable
balance and when it expires; join if they have not; read their activity; browse
the reward menu; redeem; and see the coupons they hold, each with its code,
state and validity period.

Redeeming twice by accident SHALL cost nothing, including when the member
reloads between attempts.

#### Scenario: A member who never joined is invited to

- **WHEN** a member with recorded activity but no join date opens the surface
- **THEN** they are shown how to join, and their existing points

#### Scenario: A double redemption costs one

- **WHEN** a member submits the same redemption twice, with or without a reload in between
- **THEN** exactly one redemption is recorded

#### Scenario: A coupon is readable as soon as it is issued

- **WHEN** a member completes a redemption
- **THEN** the coupon's code and validity period are shown to them without a further step

#### Scenario: Dates read in the programme's time zone

- **WHEN** a member reads a date the programme computed
- **THEN** it reads the same wherever the member is, in the programme's time zone

### Requirement: Operators act through named permissions, with a second factor and a tamper-evident record

Every operator action SHALL require a named permission, a session resolved
without cache, and — where the environment enforces it — a second factor
verified for that session. Every operator action that changes something SHALL be
recorded in a hash-chained log whose breakage is detectable.

Operator permissions SHALL separate reading a member's loyalty state, moving
points, granting invitations, editing the reward menu, removing a tier a member
holds, and cancelling a redemption, so an operator can hold one without the
others. Removing a tier and cancelling a redemption SHALL each be their own
permission: both undo something a member can see, and neither follows from
being allowed to move points.

#### Scenario: A permission is required per action

- **WHEN** an operator without the action's permission attempts it
- **THEN** the action is refused

#### Scenario: Moving points does not carry tier removal

- **WHEN** an operator holding only the point-movement permission attempts to
  remove a tier
- **THEN** the action is refused

#### Scenario: The record survives an attempt to rewrite it

- **WHEN** any recorded operator action is altered or removed
- **THEN** verifying the log reports the position at which it breaks

#### Scenario: An action with no place to record it does not run

- **WHEN** the operator log cannot be written
- **THEN** the action is refused rather than completed unrecorded

### Requirement: An operator runs the programme from one console

An operator SHALL be able, subject to their own permissions, to: find a member
and read their loyalty state and activity; correct a balance and grant campaign
points; grant and revoke an invitation-only tier and list live grants; remove a
tier a member holds; create, edit and archive rewards and see archived and
scheduled ones; find a redemption and reverse or cancel it; read what members
have forfeited to expiry; and read the operator log and verify it has not been
tampered with.

The console SHALL show an operator only the sections their permissions allow,
using the same permission the action itself requires, so that what is shown and
what is allowed cannot disagree.

Where a second factor is required and missing, the console SHALL take the
operator to enrol or verify rather than reporting a refusal.

#### Scenario: Sections match permissions

- **WHEN** an operator holding only the loyalty read permission opens the console
- **THEN** they can find and read members
- **AND** no section offering point movement, invitations, rewards, tier removal, redemption cancellation or the operator log is shown

#### Scenario: A missing second factor opens the gate

- **WHEN** an operator attempts an action their role allows but their session has no verified second factor
- **THEN** the console takes them to verify, and the action completes afterwards

#### Scenario: A stale console reports what broke

- **WHEN** the console reads a response whose shape it does not recognise
- **THEN** it reports which call failed to decode, rather than showing missing values

#### Scenario: A member can be found again later

- **WHEN** an operator opens a member and shares the address of that view
- **THEN** the same member opens for the recipient

## REMOVED Requirements

### Requirement: Earning is priced once, in the programme's own currency

**Reason**: The owner set the rounding order — money becomes whole base points
before the tier multiplier — and engineering carries the order as deployed
configuration, so "rounded once at the end" is one deployable choice, not the
rule.

**Migration**: Replaced by "Earning is priced in the programme's own currency,
on its deployed rounding order". The currency, backdating, and future-dating
rules carry over unchanged.

### Requirement: Points expire on a fixed window and stop counting immediately

**Reason**: The programme moves to activity-based expiry. The whole redeemable
balance now expires after twelve months carrying no earning and no redemption,
rather than each credit expiring twelve months after the activity that earned
it. Replaced by "The redeemable balance expires after a period of inactivity",
which carries the scheduled-pass scenario forward unchanged.

**Migration**: Hold one last-activity date per member, taken from that member's
most recent earning or redemption. Each credit keeps its own date, and a credit
counts while either date is still ahead, so the member's date is what binds from
the change-over on. Credits already past their own date at the change-over SHALL
be settled as expired before the member's date is written, so nothing the old
rule had already taken comes back.

### Requirement: Tier is derived, ratchets up on earning, and never silently drops

**Reason**: A tier is no longer permanent. It is activated when reached, valid
for a fixed period, and lost at the end of that period unless the retention
threshold was earned inside it. Replaced by "A tier is activated the moment it
is reached, and earns from the next purchase" and "A tier is valid for a fixed
period, and is re-qualified or lost", which carry the invitation-lapse and
tier-history scenarios forward, along with the rule that spent or expired points
do not cost a member their tier inside its validity period.

**Migration**: Give every member holding an earned tier an activation date of
the date this change deploys, so each gets a full validity period to re-qualify
in. Backdating activation to the purchase that first qualified them would demote
members on the day it lands, under a rule that did not exist when they earned
the tier.
