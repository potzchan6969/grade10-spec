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
  - Retry safety: a mutation repeated under its own key answers once and
    records nothing twice
- Earning and expiry
  - Earn pricing: a money amount becomes points once, at the programme's rate
    and the member's multiplier
  - Point expiry: a credit stops counting the instant its window ends, with no
    sweep to wait for
  - Purchase recording: a completed sale reaches the programme exactly once,
    even when loyalty is unreachable
  - Refund claw-back: returned money loses the points it earned, and never
    more than the member still holds from it
- Tiers and invitations
  - Tier derivation: a tier reached by earning ratchets up and survives the
    expiry of the points that won it
  - Ladder validation: an ambiguous ladder stops the product at boot rather
    than when a member is evaluated
  - Invitation grants: a tier nobody can earn is held only through an
    operator's dated, revocable grant
  - Grade10's configuration: the currency, rate, expiry window and ladder the
    product deploys
- Rewards and redemption
  - Reward menu: rewards priced in points, optionally stocked, optionally live
    only inside a window
  - Redemption record: what the member paid is kept, so repricing never
    rewrites what an earlier redemption cost
  - Reversal: a reversed redemption returns each credit carrying its original
    expiry
- Operator console
  - Permission split: reading a member, moving points, granting tiers and
    editing rewards are held separately
  - Second factor and audit: a change needs a verified session and a
    hash-chained record that cannot be rewritten unseen
  - Identity boundary: names and email addresses stay in the identity system,
    behind that system's own permission
- Member surface
  - Membership home: tier, balance, progress to the next earned tier and
    points expiring soon, in one place
  - Private activity: a member's own history without operator reasons, retry
    keys or the pricing behind an entry

## Requirements

### Requirement: One member record per user, created on first activity

The programme SHALL hold exactly one member record per user identity, created
the first time anything is recorded for that user, and SHALL treat joining as a
separate act from having activity recorded.

The member record SHALL hold no personal data beyond the user identity. Names,
email addresses and every other identity attribute stay in the identity system.

#### Scenario: grade10-site-loyalty-programme-SC-01 - Activity precedes joining

- **WHEN** points are recorded for a user who has never joined
- **THEN** a member record exists and holds those points
- **AND** the member is reported as not joined until they join

#### Scenario: grade10-site-loyalty-programme-SC-02 - Joining is idempotent

- **WHEN** a member joins more than once
- **THEN** the first join date stands and later attempts change nothing

### Requirement: The ledger is the only source of a balance

Every point movement SHALL be recorded as a dated entry that is never edited or
deleted. A balance SHALL be derived by asking the ledger, never stored as a
running total.

#### Scenario: grade10-site-loyalty-programme-SC-03 - Balance excludes expired and spent points

- **WHEN** a balance is asked for at a given instant
- **THEN** it counts only credits that are unspent and unexpired at that instant

#### Scenario: grade10-site-loyalty-programme-SC-04 - A balance never goes negative

- **WHEN** any debit is recorded
- **THEN** it draws only on credits that have points remaining
- **AND** no sequence of recorded activity can drive a member below zero

#### Scenario: grade10-site-loyalty-programme-SC-05 - Every debit is fully accounted

- **WHEN** a debit is recorded
- **THEN** the credits it drew from, and how much it took from each, are recorded
- **AND** those amounts sum to exactly the debit

### Requirement: Earning is priced once, in the programme's own currency

Points SHALL be granted from a money amount using the programme's earn rate and
the member's tier multiplier, rounded down once at the end of the calculation.

A spend recorded in a currency other than the programme's SHALL be refused as
invalid rather than converted.

#### Scenario: grade10-site-loyalty-programme-SC-06 - Rounding happens once

- **WHEN** a spend is priced at a tier multiplier
- **THEN** the point total is floored once after applying the rate and the multiplier,
  not at each step

#### Scenario: grade10-site-loyalty-programme-SC-07 - A foreign currency is refused

- **WHEN** a spend arrives in a currency the programme does not run in
- **THEN** it is refused as invalid, naming both currencies
- **AND** no ledger entry is written

#### Scenario: grade10-site-loyalty-programme-SC-08 - Backdated activity keeps its own date

- **WHEN** a spend carries a date in the past
- **THEN** its expiry and its tier contribution follow that date
- **AND** the multiplier applied is the tier the member holds when it is processed

#### Scenario: grade10-site-loyalty-programme-SC-09 - Future-dated activity is refused

- **WHEN** a spend carries a date more than five minutes ahead of now
- **THEN** it is refused as invalid

### Requirement: Every recorded mutation answers the same way when retried

Each mutation a caller can retry SHALL be identified by a caller-supplied key.
A retry under the same key SHALL return the original answer without recording
anything again. The same key carrying different input SHALL be refused as a
conflict.

#### Scenario: grade10-site-loyalty-programme-SC-10 - A retry is free

- **WHEN** a caller repeats a mutation under a key it already used
- **THEN** the original answer is returned and no new entry is recorded

#### Scenario: grade10-site-loyalty-programme-SC-11 - A reused key with new input is refused

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
correction, or a campaign grant SHALL NOT reset the window. Points already
expired SHALL NOT be revived by later activity.

Each credit SHALL also carry its own expiry date, set when it is recorded, and a
credit SHALL count while the later of that date and the member's inactivity
window is still ahead. The two agree for every credit an activity records; they
differ for a credit no activity moved the window for — a campaign grant, a
correction, a restored redemption — which lives out its own date under a window
that has already passed.

Expiry SHALL be recorded as a dated entry like any other movement, naming the
whole amount it removed.

#### Scenario: grade10-site-loyalty-programme-SC-94 - Buying keeps the whole balance alive

- **WHEN** a member earns points eleven months after their previous activity
- **THEN** the whole balance, oldest points included, expires an inactivity window after this earning
- **AND** not an inactivity window after the earning that produced those older points

#### Scenario: grade10-site-loyalty-programme-SC-95 - Redeeming also resets the window

- **WHEN** a member redeems and records no other activity
- **THEN** the remaining balance expires an inactivity window after that redemption

#### Scenario: grade10-site-loyalty-programme-SC-96 - Expiry needs no sweep

- **WHEN** a member's inactivity window passes
- **THEN** their balance stops counting toward what they can spend immediately

#### Scenario: grade10-site-loyalty-programme-SC-97 - Expired points do not come back

- **WHEN** a member whose balance has expired makes a purchase
- **THEN** the new earning starts a fresh balance and a fresh inactivity window
- **AND** nothing that expired returns

#### Scenario: grade10-site-loyalty-programme-SC-98 - A correction does not extend the balance's life

- **WHEN** an operator corrects a balance, or a refund claws points back
- **THEN** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-99 - A campaign grant does not keep the balance alive

- **WHEN** an operator grants campaign points as a reward
- **THEN** the member's inactivity window is unchanged
- **AND** the granted points count until their own expiry date, even under a window that has already passed

#### Scenario: grade10-site-loyalty-programme-SC-100 - A spend too small to earn still counts as activity

- **WHEN** a member's qualifying spend is below the price of one point
- **THEN** no points are credited
- **AND** the member's inactivity window is reset from that spend

#### Scenario: grade10-site-loyalty-programme-SC-101 - A late record cannot shorten the balance's life

- **WHEN** a purchase dated before the member's most recent activity is recorded
- **THEN** the balance's expiry is left where the later activity put it
- **AND** it is never pulled back toward the older date

#### Scenario: grade10-site-loyalty-programme-SC-150 - The window is calendar months, not a day count

- **WHEN** a member's last activity is 3 January at 10:00 in the programme's zone
- **THEN** the balance lapses on 3 January the next year at 10:00, whether that is 365 or 366 days on
- **AND** an activity on 29 February lapses on 28 February the next year

#### Scenario: grade10-site-loyalty-programme-SC-151 - A record older than the window is written already lapsed

- **WHEN** an earning dated more than an inactivity window ago is recorded
- **THEN** its points are recorded with their own date already past, and count nothing
- **AND** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-102 - A partial sweep converges

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

### Requirement: Tier is derived, ratchets up on earning, and never silently drops

A member's tier SHALL be derived from the points they earned inside the
programme's qualifying window, the highest tier their own earning ever reached,
and any live invitation. A tier reached by earning SHALL NOT be lost when those
points later expire.

#### Scenario: grade10-site-loyalty-programme-SC-14 - Earned tier holds after points expire

- **WHEN** the points that qualified a member for a tier expire
- **THEN** the member keeps that tier

#### Scenario: grade10-site-loyalty-programme-SC-15 - An invitation lapse is observed, not scheduled

- **WHEN** a dated invitation passes its end
- **THEN** the member stops holding that tier from that instant
- **AND** the drop is recorded the next time that member is evaluated

#### Scenario: grade10-site-loyalty-programme-SC-16 - Tier history records each move

- **WHEN** a member's effective tier changes
- **THEN** one entry records the move and what caused it

### Requirement: A tier ladder is ordered, and refused at boot when it is not

A programme's ladder SHALL be rejected when the product starts, not when a
member is evaluated, if it is ambiguous about which tier a member holds.

A ladder SHALL carry exactly one entry tier, which SHALL be its lowest rung.
Tier identifiers SHALL be unique. Each earned tier SHALL ask more qualifying
points than the tier below it, and every earned tier SHALL measure them over
the same window. The programme's time zone SHALL name a real zone.

#### Scenario: grade10-site-loyalty-programme-SC-17 - Two tiers share an identifier

- **WHEN** a ladder repeats a tier identifier
- **THEN** the product fails to start, naming the identifier

#### Scenario: grade10-site-loyalty-programme-SC-18 - No entry tier, or more than one

- **WHEN** a ladder has other than exactly one tier every member starts on
- **THEN** the product fails to start, saying how many it found

#### Scenario: grade10-site-loyalty-programme-SC-19 - The entry tier is not the lowest rung

- **WHEN** the tier every member starts on is not first in the ladder
- **THEN** the product fails to start

#### Scenario: grade10-site-loyalty-programme-SC-20 - A higher tier is cheaper than the one below it

- **WHEN** an earned tier asks no more qualifying points than the tier beneath it
- **THEN** the product fails to start, naming both amounts
- **AND** no member can hold a tier they skipped past

#### Scenario: grade10-site-loyalty-programme-SC-21 - Earned tiers measure over different windows

- **WHEN** two earned tiers count qualifying points over different periods
- **THEN** the product fails to start, naming the periods

#### Scenario: grade10-site-loyalty-programme-SC-22 - The programme names a zone that does not exist

- **WHEN** the programme's time zone is not a real IANA zone
- **THEN** the product fails to start, naming it

### Requirement: Grade10's programme

Grade10 SHALL run the programme in HKD on Asia/Hong_Kong time, granting one
point per HKD 10 of qualifying spend, with points expiring twelve months after
the activity that earned them.

Its ladder SHALL be, in ascending rank:

| Tier | Earns | Reached by |
| --- | --- | --- |
| Platinum | 1× | Every member starts here |
| Diamond | 1.2× | 500 qualifying points inside a rolling twelve months |
| Black | 1.7× | Invitation only |

These are the values the product deploys, not a range it may vary within. They
change by deploying a different configuration, never by an operator edit —
an operator who can rewrite what a purchase earns can mint money. The reward
menu is the intended lever and is editable.

Why these numbers, and what is still open about the top tier:
[Grade10 loyalty programme](../../../../../docs/prds/products/grade10-site/loyalty/index.md).

#### Scenario: grade10-site-loyalty-programme-SC-23 - A purchase earns at the member's rate

- **WHEN** a Diamond member completes a HKD 1,000 purchase
- **THEN** they earn 120 points

#### Scenario: grade10-site-loyalty-programme-SC-24 - The second tier is reached by spending

- **WHEN** a member's qualifying points inside the rolling twelve months reach 500
- **THEN** they hold Diamond

#### Scenario: grade10-site-loyalty-programme-SC-25 - The top tier cannot be bought

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

- **WHEN** a grant names a tier the programme does not define
- **THEN** it is refused as not found and nothing is recorded

#### Scenario: grade10-site-loyalty-programme-SC-27 - A grant names the entry tier

- **WHEN** a grant names the tier every member starts on
- **THEN** it is refused as invalid

#### Scenario: grade10-site-loyalty-programme-SC-28 - Live grants can be found

- **WHEN** an operator lists invitations
- **THEN** every live grant is listed with its member, tier, reason and end date

### Requirement: A reward menu priced in points, and a redemption that remembers its price

The programme SHALL hold a menu of rewards, each priced in points, optionally
limited in stock, and optionally live only within a date window. Redeeming SHALL
record what the member paid at that moment, so repricing a reward never changes
what an earlier redemption cost.

A member SHALL be able to list what they have redeemed and the state of each.

#### Scenario: grade10-site-loyalty-programme-SC-29 - Repricing does not rewrite history

- **WHEN** a reward's point cost changes after a member redeemed it
- **THEN** the earlier redemption still records the price the member paid

#### Scenario: grade10-site-loyalty-programme-SC-30 - Stock is not oversold

- **WHEN** two members redeem the last unit of a limited reward at once
- **THEN** exactly one succeeds and the other is refused as out of stock

#### Scenario: grade10-site-loyalty-programme-SC-31 - A reward outside its window cannot be redeemed

- **WHEN** a member redeems a reward that is archived, or outside its live window
- **THEN** the redemption is refused

#### Scenario: grade10-site-loyalty-programme-SC-32 - The public menu shows only what a member can buy

- **WHEN** the reward menu is read without signing in
- **THEN** it lists only live, unarchived rewards
- **AND** it does not disclose stock counts or edit history

### Requirement: Reversing a redemption restores the exact points it consumed

Reversing a redemption SHALL return each consumed credit as its own entry
carrying that credit's original expiry, so a reversal never extends the life of
a point. Stock SHALL be returned only when the redemption actually consumed a
unit.

#### Scenario: grade10-site-loyalty-programme-SC-33 - Restored points keep their original expiry

- **WHEN** a redemption is reversed
- **THEN** each restored credit expires when the credit it came from would have

#### Scenario: grade10-site-loyalty-programme-SC-34 - An unlimited reward returns no stock

- **WHEN** a redemption of a reward that had unlimited stock is reversed
- **THEN** no stock is returned

### Requirement: A refund claws back what that money earned, and no more

When money is returned, the programme SHALL remove the points that money earned,
priced at the rate each credit recorded, and SHALL never remove more than the
member still holds from that money.

Splitting a refund into several parts SHALL claw back exactly what one refund
for the whole sum would have.

#### Scenario: grade10-site-loyalty-programme-SC-35 - A split refund matches a single refund

- **WHEN** a refund is recorded in two parts
- **THEN** the total clawed back equals what one refund of the combined amount removes

#### Scenario: grade10-site-loyalty-programme-SC-36 - A member who already spent the points is not driven negative

- **WHEN** a refund exceeds what the member still holds from that money
- **THEN** the shortfall is recorded and counted by cause
- **AND** the member's balance does not go below zero

#### Scenario: grade10-site-loyalty-programme-SC-37 - A refund before its earning is not lost

- **WHEN** a refund names money that has not yet earned anything
- **THEN** it is refused as not found and nothing is recorded
- **AND** a later retry claws back once the earning lands

#### Scenario: grade10-site-loyalty-programme-SC-38 - A claw-back cancels the tier contribution it removes

- **WHEN** points are clawed back
- **THEN** the tier contribution of the earning they came from is reduced by the same amount
- **AND** it leaves the qualifying window at the same time that earning does

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

- **WHEN** a purchase completes while the programme is unreachable
- **THEN** the purchase still completes for the buyer
- **AND** the points are granted once the programme is reachable again, without anyone re-entering them

#### Scenario: grade10-site-loyalty-programme-SC-40 - A repeated delivery grants nothing twice

- **WHEN** the same money event is delivered to the programme more than once
- **THEN** the points are granted once

#### Scenario: grade10-site-loyalty-programme-SC-41 - One money event, one identity

- **WHEN** a purchase reaches its completed state through any path — a payment
  notification, a scheduled reconciliation, or a read that repairs it
- **THEN** exactly one money event is recorded for it, carrying an identity stable across retries

#### Scenario: grade10-site-loyalty-programme-SC-42 - A partial refund claws back only its own part

- **WHEN** part of a purchase is refunded, and later another part
- **THEN** each refund claws back only the points its own amount earned

#### Scenario: grade10-site-loyalty-programme-SC-43 - A currency mismatch stops the product from starting

- **WHEN** a product sells in a currency the programme does not run in
- **THEN** the product fails to start, naming both currencies

#### Scenario: grade10-site-loyalty-programme-SC-44 - A refused recording is reported, not swallowed

- **WHEN** the programme refuses a recording
- **THEN** the refusal is logged and counted by its reason
- **AND** it is never reported as success

### Requirement: Operators act through named permissions, with a second factor and a tamper-evident record

Every operator action SHALL require a named permission, a session resolved
without cache, and — where the environment enforces it — a second factor
verified for that session. Every operator action that changes something SHALL be
recorded in a hash-chained log whose breakage is detectable.

Operator permissions SHALL separate reading a member's loyalty state, moving
points, granting invitations, and editing the reward menu, so an operator can
hold one without the others.

#### Scenario: grade10-site-loyalty-programme-SC-45 - A permission is required per action

- **WHEN** an operator without the action's permission attempts it
- **THEN** the action is refused

#### Scenario: grade10-site-loyalty-programme-SC-46 - The record survives an attempt to rewrite it

- **WHEN** any recorded operator action is altered or removed
- **THEN** verifying the log reports the position at which it breaks

#### Scenario: grade10-site-loyalty-programme-SC-47 - An action with no place to record it does not run

- **WHEN** an operator action would change something but has nowhere to record it
- **THEN** the action is refused rather than run unrecorded

### Requirement: Operator point grants distinguish correction from reward

An operator SHALL be able both to correct a balance without affecting tier
progress, and to grant points that count toward tier progress. Each SHALL carry
a reason and SHALL be recorded in the operator log.

#### Scenario: grade10-site-loyalty-programme-SC-48 - A correction does not move a member up

- **WHEN** an operator corrects a balance
- **THEN** the points are spendable
- **AND** the member's progress toward the next tier is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-49 - A campaign grant moves a member up

- **WHEN** an operator grants campaign or sign-up points
- **THEN** those points count toward the next tier

### Requirement: An operator runs the programme from one console

An operator SHALL be able, subject to their own permissions, to: find a member
and read their loyalty state and activity; correct a balance and grant campaign
points; grant and revoke an invitation-only tier and list live grants; create,
edit and archive rewards and see archived and scheduled ones; find a redemption
and reverse it; and read the operator log and verify it has not been tampered
with.

The console SHALL show an operator only the sections their permissions allow,
using the same permission the action itself requires, so that what is shown and
what is allowed cannot disagree.

Where a second factor is required and missing, the console SHALL take the
operator to enrol or verify rather than reporting a refusal.

#### Scenario: grade10-site-loyalty-programme-SC-50 - Sections match permissions

- **WHEN** an operator holding only the loyalty read permission opens the console
- **THEN** they can find and read members
- **AND** no section offering point movement, invitations, rewards or the operator log is shown

#### Scenario: grade10-site-loyalty-programme-SC-51 - A missing second factor opens the gate

- **WHEN** an operator attempts an action their role allows but their session has no verified second factor
- **THEN** the console takes them to verify, and the action completes afterwards

#### Scenario: grade10-site-loyalty-programme-SC-52 - A stale console reports what broke

- **WHEN** the console reads a response whose shape it does not recognise
- **THEN** it reports which call failed to decode, rather than showing missing values

#### Scenario: grade10-site-loyalty-programme-SC-53 - A member can be found again later

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

- **WHEN** an operator holding loyalty permissions but not the identity permission finds a member
- **THEN** the member's loyalty state is shown
- **AND** no name or email address is shown

#### Scenario: grade10-site-loyalty-programme-SC-55 - A service connection is not an authorisation

- **WHEN** a service holding a connection to the identity system requests identities without an operator session carrying the identity permission
- **THEN** the request is refused

#### Scenario: grade10-site-loyalty-programme-SC-56 - Identity is never served from a shared cache

- **WHEN** a response carrying identity is returned
- **THEN** it is marked as belonging to that caller alone and is not stored in a shared cache

#### Scenario: grade10-site-loyalty-programme-SC-57 - An identity read is recorded without copying the identities

- **WHEN** an operator reads member identities
- **THEN** the log records who read, which records, and how many
- **AND** it does not record the names or email addresses themselves

#### Scenario: grade10-site-loyalty-programme-SC-58 - A failed identity read does not degrade to blanks

- **WHEN** the identity system cannot be reached
- **THEN** the console reports the failure
- **AND** no member is shown with a blank identity

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, balance, progress
to the next earned tier, and points expiring soon. Their own activity list SHALL
NOT disclose operator reasons, retry keys, or the internal pricing of an entry.

Each activity entry SHALL name what it was for in terms the member can read.

#### Scenario: grade10-site-loyalty-programme-SC-59 - An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: grade10-site-loyalty-programme-SC-60 - Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: grade10-site-loyalty-programme-SC-61 - A retired reward is still readable in history

- **WHEN** a member reads an activity entry for a reward that has since been archived
- **THEN** the entry still names that reward

### Requirement: A member runs their own membership from one surface

A signed-in member SHALL be able to see their tier, balance, progress to the
next earned tier and points expiring soon; join if they have not; read their
activity; browse the reward menu; redeem; and see what they have redeemed.

Redeeming twice by accident SHALL cost nothing, including when the member
reloads between attempts.

#### Scenario: grade10-site-loyalty-programme-SC-62 - A member who never joined is invited to

- **WHEN** a member with recorded activity but no join date opens the surface
- **THEN** they are shown how to join, and their existing points

#### Scenario: grade10-site-loyalty-programme-SC-63 - A double redemption costs one

- **WHEN** a member submits the same redemption twice, with or without a reload in between
- **THEN** exactly one redemption is recorded

#### Scenario: grade10-site-loyalty-programme-SC-64 - Dates read in the programme's time zone

- **WHEN** a member reads a date the programme computed
- **THEN** it reads the same wherever the member is, in the programme's time zone
