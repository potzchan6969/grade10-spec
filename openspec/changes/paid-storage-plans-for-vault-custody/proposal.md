**Author:** @priya-pm - 2026-08-31

## Why

Vault storage is free today: Grade10 pays for lockers, insurance and floor
space on every storage-lane case and recovers none of it. The vault has no
spec at all, so there is nothing on record to change — this proposal is the
vault's first OpenSpec capability. It introduces tiered storage plans with a
free tier that stays genuinely free for a small collection, paid tiers above
it, storage fees that pause rather than stack while an item secures a loan,
and a withdrawal block for unpaid storage that never becomes a forfeiture.

**Metric:** monthly recognized storage revenue, and the share of storage-lane
accounts on a paid tier (Standard + Premium as a percentage of all accounts
with at least one vaulted item).

## What Changes

- Three storage plan tiers per collector account, assessed once per monthly
  billing cycle:
  - **Free** — up to 3 storage-billable items, no declared-value ceiling, $0.
  - **Standard** — 4 or more storage-billable items, total declared value up
    to 10,000 major units of the account's billing currency, a flat monthly
    fee of 5 major units.
  - **Premium** — 4 or more storage-billable items, total declared value
    above 10,000 major units, a flat monthly fee of 20 major units.
- An item counts and bills only while its case is `vaulted` and it is not
  currently securing an active loan. An item held as collateral for an
  `active` financed-lane case is excluded from both the item count and the
  fee for as long as it stays collateral, so a collector is never charged
  storage and loan interest on the same item at once.
- Billing is monthly, one charge per account, against the payment method on
  file. A missing payment method is a visible account state — the collector
  sees it and the balance it is accruing — never a silent gap. Capturing or
  storing a payment method is not built by this change (see Non-Goals).
- The first missed or failed monthly charge produces an immediate notice to
  the collector: the balance is overdue and continued non-payment will block
  withdrawal. Withdrawal itself is not blocked yet at this point.
- If the balance is still unpaid when the next monthly charge comes due (one
  full missed cycle), release is refused, account-wide, until the balance is
  paid in full — the same "nothing outstanding" guard the case lifecycle
  already applies to release, extended to include an overdue storage
  balance. Nothing about this reaches forfeiture: forfeiture stays
  financed-lane, manual, and triggered only by loan default, never by a
  storage balance.
- A new case's currency never blocks intake, even when it differs from the
  account's existing storage billing currency.
- New `vault` product and `vault/storage-billing` capability under
  `openspec/specs/`.

## Non-Goals

- No proration, in either direction, for a partial month of custody. A
  billing cycle with any storage-billable time in it is charged the full
  monthly fee.
- No annual plans.
- No ZZZ rollout — Grade10 vault only.
- No payment-method capture, storage, or update flow. This change specifies
  only the billing behavior around a payment method's presence or absence;
  capturing one is a separate change.
- No currency-conversion rule for a mixed-currency account. An account bills
  in one currency; how a case in a different currency folds into that single
  bill is an open question this change does not resolve (see the linked
  PRD).
- No new stored "overdue" status. Consistent with the case lifecycle's
  existing decision not to cache a computed fact, whether an account is
  overdue or blocked is computed at the point release is attempted, not
  stored on the case or the account.

See [`docs/prds/vault/paid-storage-plans.md`](../../../docs/prds/vault/paid-storage-plans.md)
for the rationale behind the free-tier boundary, the pause-not-stack rule,
the block-not-confiscate rule, and the mixed-currency open question.

## Capabilities

### New Capabilities

- `vault/storage-billing`: tiered storage plans, the collateral pause,
  monthly billing cadence, missing-payment-method visibility, the overdue
  notice, and the withdrawal block. The vault's first OpenSpec capability.

### Modified Capabilities

None — the vault has no existing capability to modify.

## Impact

- `openspec/specs/vault/storage-billing/spec.md` is created at archive; add
  a `vault` bullet to `openspec/specs/README.md` at the same time.
- Application repo (`grade10`): `packages/vault/{contracts,backend,frontend,admin-frontend}`
  gain billing/tier assessment, a monthly billing run, collector-facing
  notices, and an extended release guard. This is delivery scope for the
  engineer who promotes this change to `full-planning`, not this proposal.
- No design-system or shared-ui impact — the vault has no shared UI block
  today (collector pages and the operator console are both app-owned).
- A follow-up change is needed to actually capture and store a payment
  method; this change assumes only that one may or may not be present.
