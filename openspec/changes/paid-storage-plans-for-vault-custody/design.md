## Context

The vault (`packages/vault/{contracts,backend,frontend,admin-frontend}`,
deployed as `apps/backend/grade10/vault`, `@grade10/vault-service`) runs one
case machine over `vault_cases` (`packages/vault/backend/src/db/schema/cases.ts`).
There is no account table: a "collector account" is the set of `vault_cases`
rows sharing a `user_id`. Money is case-scoped today — `payouts` and
`repayments` each carry a `case_id` and no currency column, because the case
owns the one currency (`vault_cases.currency`). Storage billing is the first
vault fact that lives at the account grain rather than the case grain, so it
needs its own table rather than a column on `vault_cases`.

The release guard already has the seam this change fills. `outstandingObligations`
(`packages/vault/backend/src/money/obligations.ts`) calls `feeObligations`,
which is an empty stub today with a comment stating exactly this: "storage is
free in v1, so `feeObligations` is empty — and it exists anyway, because that
is the seam a fee schedule lands on... never a new status and never a change
to the state machine." The wire contract already anticipates it too:
`obligationSchema.kind` in `packages/vault/contracts/src/schemas.ts` is
`Schema.Literals(["financing", "fee"])` — `"fee"` has never been reachable
until now. `VAULT_FAILURE_CODES` already carries `OBLIGATIONS_OUTSTANDING`,
the code the release guard throws. None of this is new to build; it is being
turned on.

Locking: `packages/vault/backend/src/lock.ts` documents that this service uses
no Postgres advisory locks — Cloudflare does not support `pg_advisory_*` over
Hyperdrive — and instead locks a row that already exists with
`SELECT … FOR UPDATE`. An account-grain fact needs an account-grain row to
lock the same way; there is nothing to take `FOR UPDATE` on today.

Sweeps run through `runSweepPass` (`packages/vault/backend/src/sweeps/pass.ts`),
a fixed, ordered `WORK_LISTS` array, each entry a `{ key, lane, kind, run }`.
`lane` is `"fast"` (cron `*/15 * * * *`) or `"slow"` (cron `0 * * * *`,
`apps/backend/grade10/vault/wrangler.jsonc`); `kind` is `"routine"` or
`"repair"`. Pagination is cursor-based (`readWorkList`, keyed on
`storage_cursors`), and idempotency is a unique constraint plus a claimed-row
transaction (`claimRow`), never a re-derivable computation.

Notices go through `packages/vault/backend/src/notify/{vocabulary,tell}.ts`:
a closed `NotifyKind` list and an email adapter. There is no SMS/WhatsApp
integration in v1 (`wa.me` links are operator-clicked, not sent by the
service).

Two things this change explicitly does not touch: `@grade10/finance-service`
(`packages/grade10-finance`) is an audit-log worker unrelated to loans or
billing — nothing named "finance" or "loan" exists as a separate package; the
financed-lane loan lives entirely inside `packages/vault/backend/src/money/`.
`@grade10/stripe-backend` (`packages/stripe`) is a generic client/webhook
wrapper with no payment-method or customer storage — irrelevant here, since
capturing a payment method is out of scope (see Non-Goals in `proposal.md`).

## Goals / Non-Goals

Goals and non-goals are the proposal's (`proposal.md`); this section adds
nothing to them.

## Decisions

### An account-grain `storage_accounts` row, one per billing `user_id`

The spec assesses a tier and a fee per account, once per cycle, from a
snapshot of storage-billable items "in effect at that moment" (Requirement:
"Tier is assessed once per billing cycle, never mid-cycle") — a fact that
cannot be recomputed live from the current item set, because a later change
must not move the current cycle's fee. It has to be stored.

`storage_accounts` is keyed on `user_id` directly (no surrogate id — this is
the one place vault holds a 1:1 account fact, so there is nothing a surrogate
id would disambiguate). It carries the billing currency (set once, per
Requirement "An account's billing currency is set once") and the currently
assessed cycle's tier, fee, item count and declared value. The row is created
the first time an item becomes storage-billable for that `user_id` — same
moment the currency is set — which is also what gives the billing sweep and
the release guard a row to `SELECT … FOR UPDATE` on, following `lock.ts`'s
existing rule rather than reaching for an advisory lock.

Alternative rejected: compute the tier live from `vault_cases` on every read
and never store it. Rejected because SC-09 requires the current cycle's
charge to freeze at the assessed tier regardless of what happens to the item
set afterward — a live computation cannot represent "what was true when the
cycle started" once the item set has moved on.

### `storage_charges` is an append-only ledger, one row per account per cycle

Mirrors `payouts`/`repayments`: a fact of what was attempted or paid, never a
cached verdict. One row per `(user_id, cycle_starts_at)` — enforced by a
unique constraint, which is what makes the monthly sweep idempotent under
`claimRow`'s retry-safe pattern the same way every other sweep is. A row
records the tier and fee charged, whether the charge succeeded, and — if a
treasurer later records payment — when and by whom.

The **overdue-notice** (SC-15) and **withdrawal-block** (SC-16) requirements
are two different reads of this same ledger, never a stored status:

- **Overdue notice**: fires the moment a charge attempt records `status: "failed"`
  or `"no_payment_method"` — a side effect of the sweep inserting that row, not
  a separate stored flag.
- **Withdrawal block**: the release guard reads whether the account has an
  unpaid charge from a cycle strictly before the most recent charge row —
  i.e., a full cycle has already turned over since it went unpaid. A single
  unpaid charge (this cycle's, just attempted) never blocks; a second cycle's
  charge landing while the first is still unpaid does. This is one pure
  function, `storageBlocked(charges): boolean`, read by both the release guard
  and (for display) the collector's own account view — never a boolean column,
  per the proposal's Non-Goals ("No new stored overdue status... computed at
  the point release is attempted, not stored").

Alternative rejected: an `overdue: boolean` / `blocked: boolean` column on
`storage_accounts`, flipped by the sweep. Rejected for the reason the
proposal already states, and because it duplicates what `vault_cases.status`
already teaches this codebase not to do (`case-lifecycle.md`: "there is no
`overdue`, because overdue is a computation against a clock, and a status
would be a cached answer that can be wrong").

### `feeObligations` and `Obligation.kind: "fee"` are the seam; use them, don't route around them

`outstandingObligations` already calls `feeObligations(vaultCase, asOf)` for
every case and folds the result into the same list `financingDue` populates.
Implement `feeObligations` to read the case's account's unpaid
`storage_charges` total (a per-account figure, attached identically to every
case under that account) and return it as `{ kind: "fee", amountMinor, detail }`
when non-zero. `OBLIGATIONS_OUTSTANDING` — already thrown by the release path
whenever `outstandingObligations` is non-empty — becomes the withdrawal
block for free: SC-16, SC-17 and SC-18 need no change to `transitions.ts` or
to the failure vocabulary. This is the "never a new status and never a change
to the state machine" the existing comment promises, delivered.

Alternative rejected: a separate `STORAGE_BALANCE_OUTSTANDING` failure code
and a second guard beside the existing one. Rejected — it would duplicate a
guard that already exists for exactly this shape of refusal, and the proposal
is explicit that this reuses "the same 'nothing outstanding' guard."

### Payment-method presence is an injected port, not a stored capability

Nothing in the vault schema stores a payment method, and this change does
not add one (Non-Goals). But SC-14 needs to distinguish "charge failed" from
"there was nothing to charge," and both need to be visible to the collector.
Model it the way every other external fact the sweep depends on is modeled —
`SweepDeps` already injects `KycServicePort`, `ObjectStorePort`,
`ArchiveStorePort` as ports the service depends on without owning. Add
`PaymentMethodPort: { hasOnFile(userId): Promise<boolean> }` the same way.
The v1 binding returns `false` unconditionally (there is no payment-method
capture anywhere yet, so every account is honestly in this state) — the
follow-up payment-capture change (flagged as future work in the proposal)
swaps the binding, not this service's logic. A charge attempt against an
account with no payment method on file records a `storage_charges` row with
`status: "no_payment_method"` rather than attempting a charge and getting a
processor error — there is no processor to call.

Alternative rejected: leave payment-method presence unmodeled and treat every
charge as "failed." Rejected — SC-14 requires the collector's view to state
*that no payment method is on file*, which a generic "failed" cannot say
truthfully once a real payment method exists later.

### The monthly billing run is a new `WORK_LISTS` entry, slow lane, routine

Reading "accounts whose next cycle boundary has passed" is the same shape as
every existing routine list (`expireDrafts` reads "drafts past their TTL").
Add `storageBilling` to `SweepCounts`/`SweepListKey`, lane `"slow"` (billing
has no sub-hour urgency; the existing hourly cron is the right cadence for a
monthly assessment), kind `"routine"`. Ordering: after the existing money-
adjacent lists (`verifiedChainRows` etc.) and before `retentionReviews`,
since billing writes rows the retention flags-only pass does not depend on
seeing fresh.

One pass over the list does two things per due account, inside one claimed
transaction per account (`claimRow` against the `storage_accounts` row,
following the same claim-before-side-effect shape every other sweep list
uses): (1) if the account has crossed into a new cycle, assess the tier from
current storage-billable items and write the new cycle's snapshot onto
`storage_accounts`; (2) attempt the current cycle's charge (or record
`no_payment_method`) and insert the `storage_charges` row, sending the
overdue notice through `notify` when the row records anything other than a
successful charge.

Alternative rejected: a dedicated Cloudflare Cron Trigger fired once a month.
Rejected — the account population does not all share one billing anchor date
(the cycle starts from each account's own first storage-billable item), so
"once a month" is not one calendar instant; a per-account due check inside
the existing hourly sweep is what actually expresses "once per account per
month."

### Mixed-currency accounts

Not decided here — the proposal's open question (no conversion rule for a
case whose currency differs from the account's billing currency) is real and
unresolved by the spec, and stays unresolved by this design. See Open
Questions below for the default this plan builds against and who it is
addressed to.

### Existing vaulted items at launch: the first sweep opens a cycle, it does not backdate one

The PRD flags this as a risk to confirm before delivery, and the spec itself
specifies no grandfathering — so the ruling is to read Requirement "Tier is
assessed once per billing cycle, never mid-cycle" literally rather than
loosely. There is no cycle to assess mid-way through until one has been
opened: for every `user_id` with no `storage_accounts` row yet at deploy —
which includes every account with an item already `vaulted` before this
ships — `assessCycle`'s first run opens a fresh cycle at `cycle_starts_at =
now`, never backdated to when an item was vaulted or to the deploy date
itself (see the callout under `assessCycle` in Service Interfaces). The
account's first charge attempt lands one month later, exactly like an
account that starts billing today. Nobody is charged on deploy day for a
period nothing was ever assessed against.

This is a reading of an already-decided requirement, not a new product
decision — which is why it lives here rather than in Open Questions.

## Data Model

New tables, both under `vaultSchema` (`packages/vault/backend/src/db/schema/`),
following this schema's conventions: `bigint({ mode: "number" })` for every
minor-unit amount, `msTimestamp()` for instants, a `check` constraint for
every closed vocabulary, an `index` for every predicate a sweep or a guard
reads by.

### `storage_accounts`

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `user_id` | `text` | not null | — | Primary key. One row per billing account. |
| `billing_currency` | `text` | not null (from creation) | — | ISO 4217, `^[A-Z]{3}$` check, matching `vault_cases.currency`'s constraint. Set once at row creation; never updated. |
| `cycle_starts_at` | `msTimestamp` | not null | — | Start of the currently assessed cycle. |
| `cycle_tier` | `text` | not null | — | `$type<StorageTier>()`, check `IN ('free','standard','premium')`. |
| `cycle_fee_minor` | `bigint(number)` | not null | — | The fee assessed for `cycle_starts_at`, frozen per SC-09. |
| `cycle_item_count` | `integer` | not null | — | Snapshot item count at assessment. |
| `cycle_declared_value_minor` | `bigint(number)` | not null | — | Snapshot declared value at assessment, billing-currency items only. |
| `created_at` | `msTimestamp` | not null | `now()` | |
| `updated_at` | `msTimestamp` | not null | `now()` | Written every cycle assessment. |

Indexes: none beyond the primary key — the billing sweep pages by
`cycle_starts_at` against the whole (small, one-row-per-account) table, and
`readWorkList`'s cursor pattern (`(at, id)` ordering) applies directly with
`updated_at` as `at` and `user_id` as `id`.

### `storage_charges`

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | not null | — | Primary key, `sc_<uuid>`. |
| `user_id` | `text` | not null | — | References `storage_accounts.user_id`. |
| `cycle_starts_at` | `msTimestamp` | not null | — | Which cycle this charge is for. |
| `tier` | `text` | not null | — | Same check as `storage_accounts.cycle_tier`. |
| `fee_minor` | `bigint(number)` | not null | — | Amount due for this cycle. |
| `status` | `text` | not null | — | `$type<StorageChargeStatus>()`, check `IN ('charged','failed','no_payment_method')`. |
| `attempted_at` | `msTimestamp` | not null | — | When the sweep attempted this cycle's charge. |
| `paid_at` | `msTimestamp` | nullable | `null` | Set when a treasurer records the balance paid (see below). Null for `status: 'charged'` rows created already-settled, since a successful automated charge needs no separate recording — see Open Question on payment execution below the table. |
| `recorded_by` | `text` | nullable | `null` | Staff id, for a manually recorded payment; `null` for a sweep-attempted row. |

Constraints: `unique(user_id, cycle_starts_at)` — the sweep's idempotency
boundary, same role `uq_payouts_case_id` plays for payouts. `check` on
`status`. `index("idx_storage_charges_user_id_cycle_starts_at")` on
`(user_id, cycle_starts_at)` — what `storageBlocked` and `feeObligations`
both read.

**Open Question — does a successful charge ever actually execute?** The
proposal's Non-Goals rule out capturing or storing a payment method, and
`PaymentMethodPort.hasOnFile` returns `false` in v1 (see Decisions), so in
practice every v1 charge attempt records `status: 'no_payment_method'` — the
`'charged'` status and the automated-success path are modeled for the port's
sake (so the follow-up payment-capture change is a binding swap, not a schema
change) but are unreachable until that change ships. This is expected, not a
gap: SC-14 through SC-19 are about the *unpaid* path, which is every account
in v1. Recording a payment method as present, and any card-network charge
execution, is out of scope here as the proposal states.

### Existing table: no changes

`vault_cases`, `payouts`, `repayments` are unchanged. `feeObligations`
reads `storage_charges` by the case's `user_id`, not by any new column on
`vault_cases`.

## Service Interfaces

### `assessCycle(db, clock, userId): Promise<StorageAccountRow>`

`packages/vault/backend/src/billing/assess.ts` (new module, sibling to
`money/`, not inside it — storage billing is account-grain and `money/` is
entirely case-grain today; keeping them apart keeps that grain distinction
visible in the tree).

Input: the account row, locked `FOR UPDATE` (new `lockStorageAccount`,
mirroring `lock.ts`'s `lockCase`). Reads every `vault_cases` row for that
`user_id` whose status makes it storage-billable per the table in
Requirement "An item is storage-billable only while vaulted and not loan
collateral" — a `CASE_STATUSES`-driven predicate, not a new status. Sums item
count and declared value (billing-currency items only, per the Open
Questions default below), selects the tier from the Requirement "Storage
plan tiers" table, and writes the new `cycle_*` columns plus
`cycle_starts_at` advanced by one calendar month. Idempotent: called only
when `now >= cycle_starts_at + 1 month`, checked before the write, inside the
same locked transaction as the write — concurrent sweep passes lose the race
the same way `withCaseLock` callers do.

**No existing `storage_accounts` row for a `user_id`** — every account on
first assessment, including every account with an item already `vaulted`
before this ships — is not "how much of an already-elapsed period is owed."
Requirement "Tier is assessed once per billing cycle, never mid-cycle" read
literally means there is no cycle to assess mid-way through until one has
been opened: the row is created with `cycle_starts_at = now` (the assessment
instant), never backdated to when an item was vaulted or to a deploy date.
The account's first charge attempt therefore comes due at
`cycle_starts_at + 1 month`, exactly like an account that starts billing
today — nobody is charged on deploy day for time that was never assessed
against an opened cycle.

### `attemptCharge(db, clock, userId): Promise<StorageChargeRow>`

Same module. Runs after `assessCycle` inside the sweep's per-account claim.
Reads `PaymentMethodPort.hasOnFile(userId)`; inserts one `storage_charges`
row for `cycle_starts_at`/`cycle_fee_minor` (a `cycle_fee_minor` of `0`, the
Free tier, still inserts a `status: 'charged'` row — a paid trail of "nothing
was owed," so `storageBlocked` never has to special-case a missing row).
Unique constraint makes a retried sweep pass a no-op read, not a second row.
On any status but `'charged'`, calls `notify` with a new `NotifyKind:
"storage_overdue"` — extending `NOTIFY_KINDS`, not a new channel.

### `storageBlocked(charges: StorageChargeFact[]): boolean`

Pure function, `packages/vault/backend/src/billing/block.ts` — same shape as
`computeDue`/`settlementOf` in `money/`: no I/O, an array in, a verdict out,
so the release guard and any future collector-facing screen call the one
answer. `true` iff the earliest unpaid row's `cycle_starts_at` is before the
latest row's `cycle_starts_at` (a full cycle has turned over since it went
unpaid). Called from `feeObligations`.

### `recordStoragePayment(db, clock, args): Promise<StorageChargeRow[]>`

`packages/vault/backend/src/billing/payment.ts`. Marks every currently
unpaid `storage_charges` row for a `userId` as `paid_at: now, recorded_by:
staffId`, guarded the same way `recordRepayment` is: an `idempotencyKey`
unique per account (new column needed on `storage_charges` for this — see
correction below), and a `quotedOutstandingMinor` checked against the live
sum before writing, refusing `QUOTE_STALE` on a mismatch. Reuses the
`vault:payout` permission (`ADMIN_PERMISSIONS["admin.recordStoragePayment"]:
["vault:payout"]`) — the same two-person-on-money rule that already governs
`recordRepayment`, since this is the same shape of fact: a person recording a
transfer that already happened.

Correction to the `storage_charges` table above: add
`idempotency_key: text` (nullable — only a manually recorded payment carries
one) and `unique(user_id, idempotency_key)` where not null (a partial unique
index, `WHERE idempotency_key IS NOT NULL`), mirroring
`uq_repayments_case_id_idempotency_key`.

This is the answer to "how does a balance ever get paid, if payment capture
is out of scope": the same way a loan repayment is recorded today — a
treasurer typing in a bank transfer they already saw land. Nothing about
automated payment execution is added.

## Risks / Trade-offs

- **Every v1 account starts in `no_payment_method`.** This is spec-correct
  (see the Open Question in Data Model) but means the overdue notice fires
  for every paid-tier account on schedule, not exceptionally. The proposal's
  own risk list already names the launch-transition risk for existing
  vaulted items (see below); this makes it sharper — worth confirming
  rollout sequencing, not an implementation control this design can supply.
- **The billing sweep's per-account claim is a new lock shape.** Every
  existing sweep list claims one row per unit of work; this is the first
  list where "the work" is an account, not a case, and the account row is
  brand new. Reviewed against `lock.ts`'s no-advisory-lock rule above; no
  further mitigation needed, but it is the first of its kind and worth a
  second pair of eyes in review.
- **`feeObligations` becomes non-trivial.** It currently returns `[]`
  unconditionally and every call site tolerates that. Confirm no caller
  assumes emptiness (a quick grep of `feeObligations` call sites beyond
  `outstandingObligations` is part of the shared-types task).

## Migration Plan

Two new tables, no column changes to existing ones — additive, no
expand/contract phase needed (`neondb/README.md`'s destructive-statement
practice does not apply; nothing is dropped or renamed). Both tables start
empty; the first sweep pass after deploy opens a fresh cycle for every
account with at least one storage-billable item, per `assessCycle`'s
first-run behavior above — no account is billed for time that predates
deploy (Open Question 1).

## Open Questions

**Mixed-currency declared value — open, addressed to @priya-pm, not
blocking.** SC-13 requires intake to accept a case in a currency different
from the account's billing currency; the spec is explicit that how that
item's value folds into the account's single bill is unresolved. This design
builds against a default — the item counts toward the account's item count
but is excluded from the declared-value sum, since including it without a
conversion rate would either silently misconvert or crash — but that default
is **not a settled decision**, only the least-surprising placeholder for a
call that belongs to Priya as the requirement's author. It affects only the
account-assessment task in `tasks.md` (currently Group 4, "Storage-billable
eligibility, tier assessment, and the withdrawal-block rule") and does not
block the groups ahead of it: the vocabulary, contracts, and
`storage_accounts`/`storage_charges` schema carry no per-item
currency-inclusion rule at the type level, so none of them encode this
default one way or the other. Confirm with Priya before that group is
claimed; if her answer differs, only `assessCycle`'s implementation changes,
not the schema or the contracts already landed.
