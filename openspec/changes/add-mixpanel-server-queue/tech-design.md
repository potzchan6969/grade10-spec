# Design: Backend Mixpanel sends as due rows

## Context

Every backend Mixpanel send runs after the commit today, through `waitUntil`
or an awaited call wrapped in try/catch, so a worker that stops between the
commit and the send, or a Mixpanel outage, loses the event. The store's
`order_events` drain is the one due row already on the path. The application
repository's `docs/conventions/backend.md` sets the shape a guaranteed side
effect takes: a due row committed with its fact, claimed by a sweep, backed
off on `@grade10/postgres/ladder`, deduped by the receiver, parked on
refusal.

Five databases take the table: the store (Grade10 and ZZZ, one schema
module), auction, vault and loyalty. Store cron passes run from
`sweeps/cron.ts`; auction, vault and loyalty run `createSweepPass`
registries.

## Goals / Non-Goals

**Goals** - every decision in `decisions.md`; the requirements in
`specs/grade10-site/analytics/analytics/spec.md`.

**Non-goals** - `/api/track` and its Audience write stay best effort; no new
worker, queue or binding; no console for held records.

## Decisions

### `@grade10/mixpanel/outbox` owns the tables, the writer and the send pass

A new subpath, so the browser and catalog paths never load drizzle.

- **`createMixpanelOutboxTables(schema)`** - `mixpanel_events` and
  `mixpanel_profiles` in the product's schema, the `createWalletPassTables`
  precedent
- **`createMixpanelOutbox<C>(env, tables, { product, clock })`** -
  `track(tx, events)` inserts frozen records `ON CONFLICT (insert_id) DO
  NOTHING`; `engage(tx, write)` appends one profile write; a token that is
  not `isSet` (`@grade10/utils/config`) makes both a logged no-op (Q15), and
  the writer and the pass share that one test
- **`sendMixpanelOutbox(db, tables, { env, product, clock, limit })`** - the
  send pass; **`mixpanelWorkList(...)`** registers it in a
  `createSweepPass` registry
- **`eraseMixpanelRecords(tx, tables, userId)`** and
  **`unsentMixpanelRecords`** - erasure and its `remaining` count
- **`shapeEvent`** and **`shapeProfileWrite`** - the pure shaping
  `createTracker` and `engagePerson` already did, exported so the record is
  built once, at write
- **`@grade10/mixpanel/ingest`** - `createTracker`, `engagePerson` and
  `handleTrackRequest` move here, named for `/api/track`, their one caller,
  so no backend send reaches Mixpanel except through the outbox

### The record is frozen at write

`mixpanel_events`: `insert_id text` primary key, `user_id text` (erasure),
`event text`, `record jsonb` (the whole wire `MixpanelEvent`), `state`
(`waiting` or `held`), `attempts`, `next_attempt_at`, `last_error`,
`held_at`, `created_at`; a due index on `next_attempt_at` where waiting, and
one on `user_id`. The `event` column and a partial index on held rows are
there for an engineer reading held records. The token is never stored; it is stamped at send. `time`
comes from the domain fact where there is one (Order Paid takes the order
event's `occurred_at`), else the clock at write - never at send (Q5b).

### Profile writes append, and the send folds per user

`mixpanel_profiles`: `seq` identity primary key, `user_id`, `set`,
`set_once`, `unset`, `ip`, and the same state columns. Every write is an
insert, so a fact transaction never waits on a row a send has locked. The
send takes every waiting row of a due user in `seq` order and folds them:
`$set k` sets k and clears its unset, `$unset k` the reverse, `$set_once`
keeps the first. Held rows are never folded in, so a held write is never
sent over a later one, and a later write is a new waiting row that is never
held up (Q12). When Mixpanel refuses a fold of several writes, the pass
splits it by `seq` and folds each half again, so only a write refused alone
is held and a later good write still lands. The profile claim takes `FOR UPDATE SKIP LOCKED` and skips a
user whose earliest waiting row it could not lock, so an overlapping pass
never sends an older fold; advisory locks do not reach Postgres over
Hyperdrive.

### One worker owns each profile property

Loyalty owns `Member` and `Tier`: it holds enrolment and tier changes, and
the store only echoed its answers. The store's writes of those properties
go; loyalty writes them in `enrollMember`, in `recordEffectiveTier` on every
change, and `Member: false` with `Tier` unset in `endMembership`. The store
keeps `Wallet Pass` and `Created`; the vault keeps `Identity Standing`. Each
path that records a guaranteed send takes the outbox as a required argument;
a brand with no token passes the disabled outbox `createMixpanelOutbox`
returns. The one production caller of `disabledMixpanelOutbox` is the
auction's operator test bid, which records nothing by design.

### Where each send is recorded

- **In the fact's transaction** - Reward Redeemed, Member/Tier, vault
  transitions and Identity Standing, Auction Won, Invoice Paid, Card Linked,
  Lot Watched, Bid Placed and Bidder Outbid, Wallet Pass, Account Created
  with the order owner it settles, Checkout Started with the payment refs
  `createCheckout` records
- **In the drain's commit** - Order Paid: the `order_events` sink answers a
  `commit(tx)` that runs in the transaction settling the event, and stamps
  `orders.order_paid_recorded_at` in it; the till-sale report takes the same
  path. The mark sits on the order, since a claim mints a new order event. A withheld, ownerless
  order records it under the order, and a later claim finds the mark and
  records nothing, so the order counts once under one identity
  (`grade10-site-analytics-SC-05`, `grade10-site-analytics-SC-06`). An
  unmarked order the old direct path already sent - a till sale, which
  reported at ingestion, or one with a delivered paid event - is marked
  and not recorded again when a claim mints a new paid event
- **In its own transaction** - Member Identified, Pass Added, and the
  vault's expired standing on a throw path: no stored fact

### The send pass

One transaction per batch: claim waiting rows due now
`FOR UPDATE SKIP LOCKED`, send one packed batch, settle, commit, and claim
again. A crash rolls the claim back and the batch goes again; Mixpanel
dedupes the identical record. The pass claims a batch rather than one row
through `claimRow`, which takes one row at a time, and its gauges stand in
for `sweep.backlog`.

| Answer | Settles as |
| --- | --- |
| 200, `code: 200` | Accepted - rows deleted |
| 400 on `/import?strict=1` naming records in `failed_records` | The named rows held; the rest deleted |
| 400 naming none of the batch, or 413 | Batch split in half and sent again; one record refused alone is held |
| `/engage` 400, 413, or 200 with `status: 0` | Batch split in half and sent again; one user's fold of several writes split by `seq`; one write refused alone is held |
| 401, 403, 429, 5xx, timeout, other body | Sent again: `attempts + 1`, `next_attempt_at` on `MIXPANEL_LADDER` (60 s to 1 h), no cap; 401, 403 and 429 stop the pass |
| No token | Nothing sent; rows keep waiting (Q18); gauges still reported, and a log line only while rows wait |

Batches hold at most 2000 records and under 10 MB. A pass sends up to its
budget of events and, separately, of profile users, and the next resumes
(Q16). Every pass reports
`mixpanel.outbox.waiting`, `mixpanel.outbox.oldest_age_seconds` and
`mixpanel.outbox.held`, tagged `product` and `kind`, so a lost gauge is
corrected by the next. The application repository's `docs/operations.md`
names three monitors per product and kind, with who they page:
`mixpanel.outbox.held` above zero, `mixpanel.outbox.oldest_age_seconds` past
an hour, and no data.

### Erasure

Each product's erasure deletes the account's waiting and held rows and adds
their count to `erasureStatus`'s `remaining`, so the console re-runs until
nothing is left (Q14). Loyalty stamps `account_member.erased_at` in the same
transaction; only the call that stamps it deletes the rows and records
`Member: false` with `Tier` unset, so a repeated erasure records nothing.
Once the stamp is set, `remaining` no longer counts Mixpanel rows: the only
one left is the erasure's own write, which is sent however long it waits.

## Risks / Trade-offs

- **Partial acceptance** - the pass assumes a strict 400 imports the valid
  records and names the rest; sending the unnamed ones again is safe either
  way, since they dedupe
- **Minutes, not seconds** - an event arrives on the next sweep; a
  best-effort wake after commit can be added later (Q11)
- **Signature threading** - every path recording a guaranteed send takes the
  outbox as a required argument, so an omitted call site fails to compile
  rather than silently not recording
- **Overlapping passes** - the skip-locked profile claim is proven on real
  Postgres in the store's `test/pg` lane; pglite runs one connection
- **Account Created after a failed commit** - auth creates the account
  before the store's transaction; if that transaction fails, the retry finds
  the account existing and records no Account Created. Accepted for now; an
  auth-side `created` keyed on the order is the follow-up
- **Rollback** - profile writes left waiting by a rolled-back release are
  sent after the next forward deploy and may land over a newer value the
  old code wrote directly; the next write of that property corrects it
- **Held rows grow** until an engineer acts; they alarm and are never
  deleted by the pass

## Migration Plan

One additive migration per database for the outbox tables: store Grade10
and ZZZ, auction, vault, loyalty. Two more are additive columns: loyalty's
nullable `account_member.erased_at`, and the store's
`orders.order_paid_recorded_at` (`0047`, Grade10 and ZZZ), both with no
default, so code rolled back ignores them. `0047` also marks the orders
whose paid event the old drain withheld after sending Order Paid anonymously
(no owner, at least one attempt); the other two proofs the old path sent - a
till sale, a delivered paid event - are read by the drain itself, so orders
paid between the migration and the deploy stay covered. A withheld send in
that window still counts twice: accepted. No lock
or contract line. Migrations apply before the code ships (`force-deploy`,
the pending-migrations check). Loyalty deploys no later than the store, so
`Member` and `Tier` always have a writer: `scripts/deploy/components.mjs`
ranks loyalty first, and production rolls every flipped app back when one
flip fails. Staging's `report` mode can leave the store flipped over an old
loyalty until the next dispatch; an enrolment in that gap misses `Member`
and `Tier` until its next write. A rollback leaves the tables and
their rows for the next forward deploy; a table is never dropped while it
holds rows.

## Open Questions

None open; the five the blind suite raised are Q16 to Q20 in
`decisions.md`.
