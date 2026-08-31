# Paid storage plans for vault custody

## Summary

Vault storage has been free since launch, and it costs Grade10 real money on
every storage-lane case: lockers, insurance, floor space. This introduces
tiered storage plans — a free tier that never grows a value ceiling, two paid
tiers above it — that pause while an item is loan collateral and block
withdrawal, but never confiscation, when a bill goes unpaid.

## Context

- Problem or opportunity: leadership wants storage to earn its keep. Every
  storage-lane case (the no-loan half of vault custody) currently carries
  cost with no revenue, and there is no lever to change that.
- Evidence and links: `manual/products/vault/index.md` states plainly
  "Storage is free today." No architecture doc, spec, or PRD records a
  storage fee ever having existed.
- Related PRDs, OpenSpec changes, and designs: none — the vault has no prior
  spec or PRD of any kind. This is its first capability record.

## Goals

- Make storage-lane custody self-funding without pricing out the collector
  who brings one or two cards.
- Never let storage billing double-charge an item that is already earning
  Grade10 interest as loan collateral.
- Give unpaid storage a real consequence (blocked withdrawal) without ever
  letting it become a forfeiture.

## Non-goals

- Proration for a partial month, in either direction.
- Annual plans.
- ZZZ rollout.
- Capturing or storing a payment method — assumed present or absent, not
  built here.
- A conversion rule for a mixed-currency account.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector with a small collection | Has vaulted 1-3 items | Never pays to store them, regardless of what they're worth |
| Collector with a larger or higher-value collection | Has vaulted 4+ items | Pays a predictable flat monthly fee that reflects the collection's value band |
| Collector with an active loan | An item is vaulted as loan collateral | Is not charged storage on top of loan interest for the same item |
| Collector who falls behind on storage | Misses a payment | Is warned before losing access, and can always still get the item back once paid — never loses it to the bill |

## Experience

### Primary flow

1. Collector's items sit in the vault; each month, the account's
   storage-billable items are assessed and the tier and fee are set for that
   cycle.
2. If a charge succeeds, nothing changes for the collector.
3. If a charge fails or cannot be attempted (no payment method), the
   collector is notified immediately that the balance is overdue and that
   continued non-payment will block withdrawal.
4. If the balance is still unpaid a full cycle later, withdrawal is blocked
   account-wide until it is paid — never confiscated.

## Requirements

`openspec/specs/vault/storage-billing/spec.md` (created when this change is
archived; the checkable requirements live in this change's delta at
`openspec/changes/paid-storage-plans-for-vault-custody/specs/vault/storage-billing/spec.md`
until then).

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| grade10 (`packages/vault/*`) | Implements tier assessment, the monthly billing run, collector notices, and the extended release guard | Storage-lane cases that predate this change start on whatever tier their current item count and value produce — no separate migration or grandfathering decision was made; see open questions |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Monthly recognized storage revenue | Sum of storage charges successfully collected per month | Vault PM |
| Paid-tier share | Accounts on Standard or Premium ÷ all accounts with at least one vaulted item | Vault PM |
| Overdue-to-blocked conversion | Share of accounts that receive an overdue notice and are still unpaid a cycle later | Vault PM |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Free tier boundary | Decided | Item count only (≤3), no declared-value ceiling. A value cap would bill the collector who brings a single grail card on day one — precisely the collector most worth keeping. Value bands apply only inside the paid tiers. | Priya |
| Paid tier value band | Decided | $10,000 (10,000 major units), not the initially proposed $2,000. The median vaulted card is well above $2,000; a $2,000 band would put effectively every paid-tier collector in Premium and the tier would stop meaning anything. | Priya |
| Tier count | Decided | Two paid tiers (Standard, Premium) for v1. A third tier was considered and rejected as unnecessary complexity for launch. | Priya |
| Collateral handling | Decided | Pause, not stack. An item securing an active loan is invisible to storage billing — no count, no fee — rather than continuing to bill it alongside loan interest. The alternative (keep billing, keep counting) produces a support conversation ("why did my bill go up when you took my card as collateral?") with no acceptable answer, since the honest answer is "it didn't, you just changed tier," which nobody accepts. | Priya |
| Unpaid-storage consequence | Decided | Blocks withdrawal after one full missed cycle; never confiscation. Forfeiture stays financed-lane, manual, and triggered only by loan default — a storage balance must never reach it. | Priya |
| Overdue notice timing | Decided | Fires on the first missed or failed charge, before any block. The alternative — a collector learning at the counter that they cannot take their own card home — was named as the single worst moment this feature could create, and is treated as an unacceptable outcome to design against, not an edge case to handle later. | Priya |
| Missing payment method | Decided | First-class, not an edge case. Vault has never stored a payment method — every dollar in the vault's existing story is a bank transfer a treasurer records by hand — so "no payment method on file" is the normal state on day one. It is billed identically to a failed charge: the balance accrues visibly, never silently. | Priya |
| Payment-method capture | Decided | Out of scope for this change. Capturing and storing a payment method is a separate, likely broader-than-vault capability; this change only specifies the billing behavior around a payment method's presence or absence. | Priya |
| Billing unit | Decided | Per collector account, not per case. One plan, one monthly bill, tier set from the account's total storage-billable item count and declared value. | Priya |
| Mixed-currency account | Open | An account bills in one currency, set from its first storage-billable item. A later case in a different currency is still accepted at intake — Grade10 will not turn a collector away at the counter over billing plumbing staff cannot explain. How that case's declared value and fee fold into the account's single bill is unresolved: no conversion rule is defined for v1, and this may need its own decision before a mixed-currency account is common enough to matter. | Priya |
| Existing vaulted items at launch | Open | No migration or grandfathering rule was decided for storage-lane cases already vaulted when this ships. They will be assessed under the new tiers like any other account unless a decision is made otherwise before delivery. | Priya |

## Rollout and risks

- Risk: a collector already vaulting items under the assumption storage is
  free sees a new charge at launch with no transition period, since no
  grandfathering rule was decided (see open questions above). Flag for the
  engineer promoting this change to confirm before delivery.
- Risk: the mixed-currency open question, if left unresolved through
  delivery, means a mixed-currency account's bill is implementation-defined
  rather than specified — track it as a follow-up decision, not something to
  solve unilaterally during implementation.
- Risk: the overdue-notice and withdrawal-block requirements are the
  feature's reputational edge — get the collector-facing wording and timing
  right, since the PRD explicitly names a mishandled block as the worst
  moment this feature can create.
