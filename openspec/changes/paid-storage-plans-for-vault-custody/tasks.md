## 1. Update the vault capability manual page (grade10-spec)

- [ ] 1.1 Add `manual/products/vault/storage-billing.md`: frontmatter
      `spec: vault/storage-billing`, `::spec{id="vault/storage-billing"}`,
      `::journeys{id="vault/storage-billing"}`, `::cases{id="vault/storage-billing"}`,
      and prose narrating the tier/pause/block story for a reader who has
      never seen the vault's other pages.
- [ ] 1.2 Edit `manual/products/vault/index.md`: the `:::callout{kind="note"}`
      stating the vault has no spec is now false for one capability — narrow
      it to name `storage-billing` as the exception, or drop it if no other
      vault page still needs the blanket claim once this page exists. Do not
      touch `case-lifecycle.md`, `documents-and-signing.md`, or
      `operator-console.md` — none of those capabilities gained a spec in
      this change.
- [ ] 1.3 Verify: `pnpm run check:manual`, `pnpm run lint`

## 2. Storage vocabulary and wire contracts (grade10)

Unblocks every group below — claim first, or claim alongside the manual page
group above since neither depends on the other.

- [ ] 2.1 `packages/vault/contracts/src/vocabulary.ts`: add
      `STORAGE_TIERS = ["free", "standard", "premium"]` and
      `STORAGE_CHARGE_STATUSES = ["charged", "failed", "no_payment_method"]`,
      each with its `type`, following the file's existing pattern (a closed
      list, a derived type, a short comment on why each value exists — see
      `CASE_STATUSES` for the shape). This is what makes Requirement
      "Storage plan tiers" (`storage-billing-SC-05` through `-08`) a type
      rather than a string two call sites could spell differently.
- [ ] 2.2 `packages/vault/contracts/src/failures.ts`: no new code — confirm
      `OBLIGATIONS_OUTSTANDING` is what the withdrawal-block requirement
      reuses (design.md Decisions) and leave the list untouched. This task
      is the check, not a change.
- [ ] 2.3 `packages/vault/contracts/src/schemas.ts`: add a
      `storageStatusSchema` (tier, `feeMinor`, `unpaidBalanceMinor`,
      `paymentMethodOnFile: boolean`, `blocked: boolean`) — the one shape
      both the collector screen and the admin billing panel read, so the two
      surfaces can never disagree about what "blocked" means. `obligationSchema`
      needs no change: `kind: "fee"` already exists in its `Literals`.
- [ ] 2.4 `packages/vault/contracts/src/permissions.ts`
      (`ADMIN_PERMISSIONS`): add `"admin.recordStoragePayment": ["vault:payout"]`.
- [ ] 2.5 `packages/vault/backend/src/notify/vocabulary.ts`: add
      `"storage_overdue"` to `NOTIFY_KINDS`, and extend `NotifyMessage` with
      whatever the overdue email's copy needs (balance, currency) — makes
      Requirement "Collector is warned before any withdrawal block"
      (`storage-billing-SC-15`) sendable.
- [ ] 2.6 Verify: `pnpm run typecheck`, `pnpm run lint`

## 3. Storage accounts and charges schema (grade10)

Depends on Group 2's `StorageTier`/`StorageChargeStatus` types.

- [ ] 3.1 `packages/vault/backend/src/db/schema/storageAccounts.ts`: new
      `storage_accounts` table per `design.md`'s Data Model — `user_id`
      primary key, `billing_currency`, `cycle_starts_at`, `cycle_tier`,
      `cycle_fee_minor`, `cycle_item_count`, `cycle_declared_value_minor`,
      timestamps, currency-format check matching `vault_cases`'s.
- [ ] 3.2 `packages/vault/backend/src/db/schema/storageCharges.ts`: new
      `storage_charges` table per `design.md`'s Data Model, including the
      `idempotency_key` column and its partial unique index from the
      Service Interfaces correction — `unique(user_id, cycle_starts_at)`,
      `unique(user_id, idempotency_key) WHERE idempotency_key IS NOT NULL`,
      status check.
- [ ] 3.3 `packages/vault/backend/src/db/schema/index.ts`: export both.
- [ ] 3.4 Generate and commit the migration:
      `pnpm run db:drizzle:generate`.
- [ ] 3.5 Verify: `pnpm run check:migrations`, `pnpm run typecheck`

## 4. Storage-billable eligibility, tier assessment, and the withdrawal-block rule (grade10)

Depends on Group 3's tables. Pure domain rules: no sweep wiring, no money
movement — those are Groups 5 and 6.

- [ ] 4.1 `packages/vault/backend/src/billing/eligibility.ts`: the
      storage-billable predicate from Requirement "An item is storage-billable
      only while vaulted and not loan collateral" — makes
      `storage-billing-SC-01` through `-04` pass (a vaulted storage-lane item
      counts; a pre-`vaulted` item doesn't; an `active`-loan collateral item
      is excluded; it resumes once the loan leaves `active`). Read directly
      off `CaseStatus` and `caseLane` — no new case status.
- [ ] 4.2 `packages/vault/backend/src/billing/assess.ts`:
      `lockStorageAccount` (mirrors `lock.ts`'s `lockCase` — a `SELECT …
      FOR UPDATE` on `storage_accounts`, no advisory lock, per `design.md`)
      and `assessCycle`, implementing Requirement "Storage plan tiers" and
      "Tier is assessed once per billing cycle, never mid-cycle" —
      `storage-billing-SC-05` through `-09`. Creates the account row (and
      sets `billing_currency`) the first time a `user_id` has no row and
      gains a storage-billable item — Requirement "An account's billing
      currency is set once", `storage-billing-SC-12`.
      **On first assessment for any account with no `storage_accounts` row —
      including every account with an item already `vaulted` before this
      ships — open a fresh cycle at `cycle_starts_at = now`. Do not backdate
      it to when an item was vaulted or to the deploy date, and do not bill
      immediately: the first charge attempt comes due one month later, the
      same as an account that starts billing today.** (`design.md`'s
      Decisions, "Existing vaulted items at launch.")
      A later case in a different currency is accepted at intake per `-SC-13`
      and, per `design.md`'s Open Questions, counts toward item count but not
      declared value **as an unconfirmed default addressed to @priya-pm** —
      confirm with her before writing this task's test for a mixed-currency
      account; nothing else in this group or in Groups 1 through 3 depends on
      that answer.
- [ ] 4.3 `packages/vault/backend/src/billing/block.ts`: pure
      `storageBlocked(charges)` per `design.md`'s Service Interfaces —
      implements the "full cycle turned over unpaid" rule behind Requirement
      "Unpaid storage blocks withdrawal after one full missed cycle"
      (`storage-billing-SC-16`).
- [ ] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 5. Storage payments and the release guard (grade10)

Depends on Group 4. Money movement and the obligations wiring — the release
guard itself does not change, only what feeds it.

- [ ] 5.1 `packages/vault/backend/src/billing/charge.ts`: `attemptCharge`
      and the `PaymentMethodPort` type (`hasOnFile(userId): Promise<boolean>`,
      injected the way `KycServicePort` is), with a v1 binding that always
      returns `false`. Implements Requirement "Monthly billing with no
      proration" and "A missing payment method is a visible account state" —
      `storage-billing-SC-10`, `-11`, `-14`.
- [ ] 5.2 `packages/vault/backend/src/money/obligations.ts`: implement
      `feeObligations` (currently an empty stub) to read the case's
      account's unpaid `storage_charges`, call `storageBlocked`, and return
      `{ kind: "fee", ... }` when blocked — wires `-SC-16` through `-18`
      into the release guard's existing `OBLIGATIONS_OUTSTANDING` refusal
      with no change to `transitions.ts` or the failure vocabulary, per
      `design.md`'s Decisions. Confirm no other caller of `feeObligations`
      assumed it always returns `[]` (design.md Risks).
- [ ] 5.3 `packages/vault/backend/src/billing/payment.ts`:
      `recordStoragePayment`, guarded like `recordRepayment`
      (idempotency key, `QUOTE_STALE` on a mismatched quoted balance) —
      implements Requirement "Unpaid storage blocks withdrawal after one
      full missed cycle" (the requirement `storage-billing-SC-17`,
      "Paying the balance in full clears the block", is a scenario under —
      it is not a requirement of its own).
- [ ] 5.4 Confirm forfeiture (`packages/vault/backend/src/cases/transitions.ts`'s
      `forfeit` guard) reads nothing from `feeObligations` or
      `outstandingObligations` — Requirement "Unpaid storage never leads to
      forfeiture", `storage-billing-SC-19`. This is a read-only check; only
      touch `transitions.ts` if it turns out forfeiture does read one of
      these, which would itself be the bug this change must not inherit.
- [ ] 5.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 6. Monthly billing sweep (grade10)

Depends on Groups 4 and 5 — this composes `assessCycle` and `attemptCharge`
into the shared cron runtime every other sweep list also rides on. Kept as
its own group deliberately: registering a new `WORK_LISTS` entry and
extending `SweepCounts`/`emptyCounts` in `sweeps/pass.ts` touches code every
existing sweep depends on, so it is the highest-blast-radius task in this
plan and should be claimable, reviewable, and revertable on its own, apart
from the domain rules and the money-recording code it wires together.

- [ ] 6.1 `packages/vault/backend/src/sweeps/billing.ts`: the monthly billing
      work list (`assessCycle` + `attemptCharge` per due account, one claim
      per account via `claimRow`), registered in `sweeps/pass.ts`'s
      `WORK_LISTS` as `storageBilling` / lane `"slow"` / kind `"routine"`,
      and in `SweepCounts`/`emptyCounts`. This is what actually runs the
      monthly cycle; `-SC-09` through `-11` and `-15` only fire once this is
      wired to the cron.
- [ ] 6.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 7. Collector storage status (grade10)

Depends on Group 2's `storageStatusSchema`. Build and verify against that
contract and fixtures — never against a running backend.

- [ ] 7.1 `packages/vault/frontend/src/features/custody/billing/`: new
      feature slice (domain/data/presentation, DI module and tokens,
      following the `booking`/`cases`/`request` slices already in this
      directory) exposing a `useStorageStatus()` hook reading
      `storageStatusSchema`.
- [ ] 7.2 `apps/frontend/grade10/src/pages/vault/CaseList.tsx`: the account
      storage status card from `ui.md` — good-standing, no-payment-method
      (`Badge` variant `default`), overdue (`warning`), and blocked
      (`error`) states — all four Badge tones already exist in
      `packages/design-system/src/components/display/badge.tsx`, verified
      in `ui.md`; no grade10-spec dependency for this task. Implements
      `storage-billing-US-01`'s and `-US-02`'s collector-visible half
      (`-SC-01`, `-05` through `-09`, `-14`, `-15`).
- [ ] 7.3 `apps/frontend/grade10/src/pages/vault/CaseDetailView.tsx`: confirm
      (or add, if missing) that an `OBLIGATIONS_OUTSTANDING` refusal on a
      release request renders words naming a storage balance, not a generic
      failure — `storage-billing-SC-16` as the collector experiences it.
- [ ] 7.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 8. Operator storage billing panel (grade10)

Depends on Group 2's `storageStatusSchema` and permission entry, and Group
5's `recordStoragePayment` service function.

- [ ] 8.1 `packages/vault/backend/src/trpc/routers/admin.ts`:
      `recordStoragePayment` procedure, `elevatedProcedure("vault:payout")`,
      calling Group 5's `recordStoragePayment`. Lives with the operator work
      here, not with Group 5's service code, since this procedure's only
      consumer is this group's panel.
- [ ] 8.2 `packages/vault/admin-frontend/src/features/custody/billing/`: new
      feature slice (mirrors Group 7's frontend slice: domain/data/presentation,
      DI module, tokens), alongside the existing `settlement`/`compliance`/
      `valuation` slices.
- [ ] 8.3 `apps/admin/grade10/src/pages/vault/BillingPanel.tsx`: new tab
      beside the existing case-detail tabs (`CaseDetailPanel.tsx`), showing
      the account's tier, fee, and unpaid `storage_charges` rows.
- [ ] 8.4 A record-payment dialog on that panel, gated on `vault:payout` and
      reusing `MoneyDialog`'s quoted-balance-and-method pattern, calling
      Group 8.1's procedure — implements Requirement "Unpaid storage blocks
      withdrawal after one full missed cycle" (`storage-billing-SC-17`) from
      the operator's side.
- [ ] 8.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
