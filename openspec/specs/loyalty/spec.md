# Loyalty

## Purpose

A points-and-tiers membership programme: members earn points on qualifying
spend, points expire, tiers change what a member earns, and points buy items
from a reward menu. One programme runs per product, configured with its own
currency, earn rate, expiry window and tier ladder.

Product context: [Grade10 loyalty programme](../../../docs/prds/loyalty/programme.md).

## Requirements

### Requirement: One member record per user, created on first activity

The programme SHALL hold exactly one member record per user identity, created
the first time anything is recorded for that user, and SHALL treat joining as a
separate act from having activity recorded.

The member record SHALL hold no personal data beyond the user identity. Names,
email addresses and every other identity attribute stay in the identity system.

#### Scenario: Activity precedes joining

- **WHEN** points are recorded for a user who has never joined
- **THEN** a member record exists and holds those points
- **AND** the member is reported as not joined until they join

#### Scenario: Joining is idempotent

- **WHEN** a member joins more than once
- **THEN** the first join date stands and later attempts change nothing

### Requirement: The ledger is the only source of a balance

Every point movement SHALL be recorded as a dated entry that is never edited or
deleted. A balance SHALL be derived by asking the ledger, never stored as a
running total.

#### Scenario: Balance excludes expired and spent points

- **WHEN** a balance is asked for at a given instant
- **THEN** it counts only credits that are unspent and unexpired at that instant

#### Scenario: A balance never goes negative

- **WHEN** any debit is recorded
- **THEN** it draws only on credits that have points remaining
- **AND** no sequence of recorded activity can drive a member below zero

#### Scenario: Every debit is fully accounted

- **WHEN** a debit is recorded
- **THEN** the credits it drew from, and how much it took from each, are recorded
- **AND** those amounts sum to exactly the debit

### Requirement: Earning is priced once, in the programme's own currency

Points SHALL be granted from a money amount using the programme's earn rate and
the member's tier multiplier, rounded down once at the end of the calculation.

A spend recorded in a currency other than the programme's SHALL be refused as
invalid rather than converted.

#### Scenario: Rounding happens once

- **WHEN** a spend is priced at a tier multiplier
- **THEN** the point total is floored once after applying the rate and the multiplier,
  not at each step

#### Scenario: A foreign currency is refused

- **WHEN** a spend arrives in a currency the programme does not run in
- **THEN** it is refused as invalid, naming both currencies
- **AND** no ledger entry is written

#### Scenario: Backdated activity keeps its own date

- **WHEN** a spend carries a date in the past
- **THEN** its expiry and its tier contribution follow that date
- **AND** the multiplier applied is the tier the member holds when it is processed

#### Scenario: Future-dated activity is refused

- **WHEN** a spend carries a date more than five minutes ahead of now
- **THEN** it is refused as invalid

### Requirement: Every recorded mutation answers the same way when retried

Each mutation a caller can retry SHALL be identified by a caller-supplied key.
A retry under the same key SHALL return the original answer without recording
anything again. The same key carrying different input SHALL be refused as a
conflict.

#### Scenario: A retry is free

- **WHEN** a caller repeats a mutation under a key it already used
- **THEN** the original answer is returned and no new entry is recorded

#### Scenario: A reused key with new input is refused

- **WHEN** a caller repeats a key with input that differs from the first call
- **THEN** the call is refused as a conflict

### Requirement: Points expire on a fixed window and stop counting immediately

Credits SHALL expire after the programme's expiry window, measured from the date
of the activity that earned them. An expired credit SHALL stop counting toward a
balance at the instant it expires, without waiting for any scheduled process.

#### Scenario: Expiry needs no sweep

- **WHEN** a credit's expiry instant passes
- **THEN** it stops counting toward the balance immediately

#### Scenario: A partial sweep converges

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

### Requirement: Tier is derived, ratchets up on earning, and never silently drops

A member's tier SHALL be derived from the points they earned inside the
programme's qualifying window, the highest tier their own earning ever reached,
and any live invitation. A tier reached by earning SHALL NOT be lost when those
points later expire.

#### Scenario: Earned tier holds after points expire

- **WHEN** the points that qualified a member for a tier expire
- **THEN** the member keeps that tier

#### Scenario: An invitation lapse is observed, not scheduled

- **WHEN** a dated invitation passes its end
- **THEN** the member stops holding that tier from that instant
- **AND** the drop is recorded the next time that member is evaluated

#### Scenario: Tier history records each move

- **WHEN** a member's effective tier changes
- **THEN** one entry records the move and what caused it

### Requirement: An invitation-only tier is granted and revoked by an operator

A tier the programme marks as invitation-only SHALL be held only through an
explicit grant, which names who granted it and why, may carry an end date, and
may be revoked. A member SHALL hold at most one live invitation per tier.

#### Scenario: A grant names an unknown tier

- **WHEN** a grant names a tier the programme does not define
- **THEN** it is refused as not found and nothing is recorded

#### Scenario: A grant names the entry tier

- **WHEN** a grant names the tier every member starts on
- **THEN** it is refused as invalid

### Requirement: A reward menu priced in points, and a redemption that remembers its price

The programme SHALL hold a menu of rewards, each priced in points, optionally
limited in stock, and optionally live only within a date window. Redeeming SHALL
record what the member paid at that moment, so repricing a reward never changes
what an earlier redemption cost.

#### Scenario: Repricing does not rewrite history

- **WHEN** a reward's point cost changes after a member redeemed it
- **THEN** the earlier redemption still records the price the member paid

#### Scenario: Stock is not oversold

- **WHEN** two members redeem the last unit of a limited reward at once
- **THEN** exactly one succeeds and the other is refused as out of stock

#### Scenario: A reward outside its window cannot be redeemed

- **WHEN** a member redeems a reward that is archived, or outside its live window
- **THEN** the redemption is refused

#### Scenario: The public menu lists only live rewards

- **WHEN** the reward menu is read without signing in
- **THEN** it lists only live, unarchived rewards

### Requirement: Reversing a redemption restores the exact points it consumed

Reversing a redemption SHALL return each consumed credit as its own entry
carrying that credit's original expiry, so a reversal never extends the life of
a point. Stock SHALL be returned only when the redemption actually consumed a
unit.

#### Scenario: Restored points keep their original expiry

- **WHEN** a redemption is reversed
- **THEN** each restored credit expires when the credit it came from would have

#### Scenario: An unlimited reward returns no stock

- **WHEN** a redemption of a reward that had unlimited stock is reversed
- **THEN** no stock is returned

### Requirement: A refund claws back what that money earned, and no more

When money is returned, the programme SHALL remove the points that money earned,
priced at the rate each credit recorded, and SHALL never remove more than the
member still holds from that money.

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

### Requirement: Operators act through named permissions, with a second factor and a tamper-evident record

Every operator action SHALL require a named permission, a session resolved
without cache, and — where the environment enforces it — a second factor
verified for that session. Every operator action that changes something SHALL be
recorded in a hash-chained log whose breakage is detectable.

Operator permissions SHALL separate reading a member's loyalty state, moving
points, granting invitations, and editing the reward menu, so an operator can
hold one without the others.

#### Scenario: A permission is required per action

- **WHEN** an operator without the action's permission attempts it
- **THEN** the action is refused

#### Scenario: The record survives an attempt to rewrite it

- **WHEN** any recorded operator action is altered or removed
- **THEN** verifying the log reports the position at which it breaks

#### Scenario: An action with no place to record it does not run

- **WHEN** an operator action would change something but has nowhere to record it
- **THEN** the action is refused rather than run unrecorded

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, balance, progress
to the next earned tier, and points expiring soon. Their own activity list SHALL
NOT disclose operator reasons, retry keys, or the internal pricing of an entry.

#### Scenario: An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from
