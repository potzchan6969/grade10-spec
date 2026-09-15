# Tech design

## Where the date lives today

A credit dies at `greatest(its own expires_at, account_member.activity_expires_at)`
— one rule, written once in `ledgerPredicates.ts` and read everywhere. Every
earn pushes the clock to at least its own floor, so earns collapse to one date
by construction. Two writers do not: `recordBonus` and the credit half of
`adjust` stamp `occurredAt + expiry months` and move no clock, so their points
can outlive the balance.

**The balance's date is not the clock column.** Wherever an operator credit
carries a floor above the clock, the date the member is shown is that floor.
`readLatestLiveExpiry` — the latest effective expiry over live lots — is the
balance's date, and every new read takes it from there. Reading the column
would be wrong for every member written before this change, and dishonest for
a member holding no points, where it names a day nothing expires on.

## The rule, as code

One orchestration helper beside `creditLife`, used by `recordBonus` and by
`adjust`'s credit branch:

```ts
export async function operatorCreditLife(tx, program, userId, occurredAt, at) {
  await settleExpiredLots(tx, userId, at);
  const date = await readLatestLiveExpiry(tx, userId, at);
  if (date) return { expiresAt: date, diesAt: date, dead: false };
  return (await resetActivityClock(tx, program, userId, occurredAt, at)).life;
}
```

Settling first is what makes the empty branch safe. Moving a clock over lots
that are dead but unswept makes them live again, because their effective date
is the later of the two — the sweep is budgeted and always leaves a backlog, so
there are always such lots. The adopt branch touches no clock and needs no
settle for correctness; it settles anyway so both branches read one way and the
expiry rows are dated before the credit.

The empty branch falls through to `resetActivityClock`, which already settles,
already moves forwards only, and already refuses to land on an instant that has
passed. A backdated credit into an empty balance can still be born dead, which
is right: nothing was there to join.

## Forward-only moves into SQL

`setMemberClock` is a bare UPDATE; the forwards-only rule lives in one caller.
With a second writer it becomes `advanceMemberClock`, writing only where the
stored date is null or earlier, and returning what it left. No caller moves a
clock backwards — the tier seeding helper writes the column directly and is
unaffected.

## The operator restart

```ts
extendBalanceExpiry(db, program, { userId, reason, idempotencyKey, writtenBy })
```

Its body is one call to `resetActivityClock` at `now`, under
`withMemberMutation` with `ensure: false`, so a member row that does not exist
refuses through the member lock rather than being invented. No day is taken
from the caller: a picked day would be a second clock writer, a second copy of
the programme's window, and the first expiry instant in the programme not
derived from an event's own instant.

The answer is stored and replayed out of a jsonb column, so the date comes back
as an ISO string. The reason is digested into the fingerprint the way `adjust`
does it, so the same key with different words conflicts and the words
themselves stay in the audit trail. Reference type `balance-extension`.

Behind `loyalty:adjust`, without `user:list` — it writes no member row, so a
member that does not exist already refuses. A permission of its own would be
held by exactly the people who hold that one.

No ledger row: the ledger refuses a zero amount, and the three checks on that
table all assume a movement. The operator's own card reads the last extension
off the mutation result by reference, which is indexed for it.

## Two siblings of the same bug

**A reward handed over outright resets the clock.** `grantCoupon` mints points
and then runs the real `redeem`, which resets the clock unconditionally. Fixed
by stamping the truth on the row rather than adding a flag: `RedeemInput.channel`
widens to the whole channel set, `grantCoupon` passes the internal channel that
matches the credit it spends, and a redemption resets the window only for a
channel that sold something. The same move fixes a counter-share number that
counts operator grants as online sales. `redeemForMember` is untouched — the
member is present and spends their own points.

**A payment reversed into a lapsed balance writes credits that are born dead.**
`restoreConsumedLots` reads the clock once and skips a lot whose effective
expiry has passed, returning what it restored and what it skipped.
`reverseRedemption` keeps its refusal by name; `reversePay` answers zero, which
is what its other final states already do.

## The summary

`expiringSoon` is the whole balance or none of it once one date governs. Its
query goes; the field is derived from the balance and the date, and stays on
the wire as optional until no released version reads it. Removing it outright
would break every browser still holding yesterday's bundle — the decoder fails
the whole summary, not the one field, and the backends flip before the SPAs.

`readLatestLiveExpiry` and the operator list's `min` over the same expression
become one repository function. Today they disagree for a member holding a
grant, which is the same bug seen from two surfaces.

## Moving the dates that already exist

Every member's clock moves up to the latest effective expiry over their live
lots, so no date a member has been shown moves backwards and the invariant
holds for rows written before this change.

It is a repair pass in the nightly sweep, not a migration: per member, under
the member lock, settle to zero, read the balance's date, advance the clock to
it. A whole-table UPDATE in a migration would hold a row lock on every member
until it committed, queueing every checkout behind it, and a migration cannot
settle first. The pass is a state predicate with no cursor, so a run cut short
converges on the next one and running it twice writes nothing.

It runs ahead of the expiry sweep in the same nightly pass, and it must drain
before the member's card starts deriving its line from one date — until then a
member holding a legacy grant would be told a day most of their points do not
reach.

The clock keeps its column name. A rename lands before the code that reads it,
which would break every balance read in the window between, and CI refuses it
for that reason. The column's comment stops calling the date activity's alone.

## What this is reversible by

The pass overwrites the only copy of each member's previous clock, and the
member row carries no history. Rolling the code back is safe at any point — a
clock that moved forward stays valid under the same rule, and those members
simply hold a longer window. Rolling the data back is a restore, so the
database is backed up before the pass first runs.

## Proving it holds

The invariant is: a member holding any live points has exactly one effective
expiry date across them. Three writers keep it — the earn path, the operator
helper, and `restoreConsumedLots`, whose restored floor was at or under the
clock when its lot was written. That third one is an argument, not a
constraint, so the ledger invariants assertion gains the check directly:
over every live lot of a member with a balance, the effective date is one
value.

## Metrics

`loyalty.points.expired` gains the operator paths, which settle now and did
not before. The repair pass reports through the sweep's existing repair
counter, so a backlog that stops draining is visible without a new series.
