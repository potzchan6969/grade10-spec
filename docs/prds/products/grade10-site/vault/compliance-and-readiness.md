---
title: Compliance and Readiness
order: 6
---

What the vault keeps, who may see it, how long it lives, which controls run,
and what stands between the code and a first production case. Every legal
requirement here is a question for counsel with the code fact beside it, never
an assertion of law.

## Identity

- **Checked at the counter** — a staff member with the document: legal name
  typed character for character, date of birth, document type (passport,
  national ID, driving licence, residence permit), number, expiry, one
  photograph; the method is in person or from an upload
- **Refused** — under **18**, or a document expired on the day of the check;
  both judged again when the paper is prepared, and never at release
- **Stored** — the name, birth date, expiry, type, a masked number and a keyed
  digest of it, the photograph, who verified and when; the raw number never
  lands
- **Not checked** — liveness, face match, address, nationality, sanctions or
  politically exposed persons, source of funds, occupation, purpose, ongoing
  monitoring, thresholds, suspicious-activity reporting
- **Reuse** — the identity store answers the latest check for a person across
  products; the vault never asks, so a returning customer shows the passport
  again
- **A walk-in** — has no account, so the identity is keyed to the case, never
  to a person
- **Who sees the photograph** — every `staff` and `admin`, each download on the
  audit chain; item photos, the owner and any `vault:read`, each read in an
  append-only ledger

## Retention and erasure

- **Retention windows** — none set for any class (agreements, identity,
  photos), for either brand; nothing is ever deleted on a clock, and the
  review sweep flags nothing because nothing is set
- **Legal hold** — the reason written on a case, not the guard; the guard is
  whether sealed evidence exists, read under the row lock
- **Erasure, in flight** — a signed case that is not yet `released` or
  `forfeited` refuses; nothing is erased until the loan settles
- **Erasure, closed and signed** — contact, decline reason, staff notes and
  the customer's actor ids go; the sealed PDFs, the identity record and
  photograph, the item photos and the item text stay under the hold, with no
  clock
- **Erasure, never signed** — everything is purged and the identity released
- **Process** — the account holder asks on the auth side, a **7-day** window
  runs, then an admin runs each product from the console

## Evidence

| Control | Runs | Still owed |
| --- | --- | --- |
| Seal ladder and certificate | yes | counsel's consent wording; PAdES/PKCS#7 and RFC 3161 unbuilt, so the certificate is printed text |
| Append-only tables | yes, armed always | — |
| Hash-chained audit log | yes, walked hourly in **1,000**-row budgets, verified heads exported to the archive | the Datadog key and monitors with named recipients |
| Archive copy of sealed bytes | yes, hourly, digest-checked, through a port that cannot delete | the bucket's lock rule, set by hand and verified by nothing |
| Integrity re-hash | yes, **200** rows per pass | — |
| Database backups | no: the nightly exits before dumping anything | four stale lines in the gaps file, two age recipients, one green run, a restore drill |
| Second factor | required in production, optional in staging | a fresh challenge on payout; two documents still say staging is required |
| Identity rebind under a sealed case | closed; non-destructive, with an outbox | the architecture doc still describes the old behaviour |

## What is not written down anywhere

- **Jurisdiction** — no jurisdiction, governing law, legal entity or licence
  appears in code, configuration or documents; all instants are UTC
- **Terms and privacy** — the site's Terms of Service and Privacy Policy pages
  read "Being prepared"
- **Processors and residency** — Cloudflare, Neon with its region unpinned,
  Datadog in the US, Resend; no register, no residency choice
- **Disputes** — no path for a collector to dispute a valuation, an interest
  figure or a forfeiture; no complaint route; no cooling-off after signing;
  the only refusal is declining the packet before the seal
- **The recorded call** — the owner's notes require a recorded call explaining
  key terms before signing; nothing models a call, a recording or a
  precondition for one
- **Insurance** — the custody agreement says the valuation is used for
  insurance; no policy, insurer or cover limit appears anywhere

## Provisioning

| Item | State |
| --- | --- |
| Neon projects (vault, identity, finance, auth, brand) | provisioned; only ZZZ's four are placeholders |
| Hyperdrive ids, staging and production | filled on every worker the vault depends on; development ids are placeholders |
| Archive bucket binding | declared in every environment |
| Backup recipients | still the placeholder, so no encrypted dump can land |
| Backup gaps file | lists the vault and identity databases as unprovisioned while the registry holds their ids, so the run exits before dumping |
| Restore drill | never run |
| Retention windows | six nulls |
| Datadog key, Resend key, the CJK font asset, the archive lock | set by hand outside the repository and unverifiable from it; a missing font fails the seal for any Chinese name |
| Product policy | none: no loan-to-value cap, rate band, term presets, offer validity, grace days, fee schedule, custodian or entity table; currencies hard-coded to HKD and USD |
| Analytics | no vault events anywhere; the funnel is SQL over case history |
| Tests | **42** backend test files across two lanes; no end-to-end spec, no stories, and no spec or test cases in this store |

:::callout{kind="warning"}
The two audits in the application repository read as current and in places
are not. The document-handling audit's nine blockers describe a pre-fix state
and its checklist marks the code side delivered; the "eight Hyperdrive
placeholders", "thirty-six unprovisioned values" and "all registry ids TODO"
sentences are stale; the security architecture doc still says staging requires
a second factor; and the vault architecture doc still describes the
destructive identity rebind.
:::

:::detail{title="Product decisions" for="pm"}
Questions for counsel, each with the fact the code holds today.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Regime and licence | ❓ Open | Which regime governs a loan secured on a collectible held in a shop locker in Hong Kong, and whether it prescribes particulars, a licence number on the paper, a rate ceiling or a redemption period; code permits **0% to 100%** per term and prints term rate, due date and repayable amount | Legal |
| Lender entity | ❓ Open | Whose name is on the paper; "Grade10" today while the notes say Finance is a separate entity | Legal |
| Recorded call | ❓ Open | A precondition to signing, and what it must retain | Owner |
| E-sign adequacy | ❓ Open | Whether the ceremony and its interim wording bind a consumer loan and a custody contract | Legal |
| Countersignature | ❓ Open | Company signature or witness; one signer today | Legal |
| Cooling-off and complaints | ❓ Open | None today | Legal |
| Forfeiture | ❓ Open | Notice, grace, surplus return | Legal |
| AML and customer due diligence | ❓ Open | Whether duties apply and how deep identification must go; today name, birth date, document, photograph | Legal |
| Upload as a method | ❓ Open | Whether a document upload is an acceptable verification | Legal |
| Retention per class | ❓ Open | Days for agreements, identity and photos, and a lawful basis for indefinite identity retention on held cases | Legal |
| Collection statement | ❓ Open | Whether a personal information collection statement must be published before the first capture; the privacy page is a placeholder | Legal |
| Residency | ❓ Open | Where the data may live; Neon region unpinned, Datadog in the US | Legal |
| Language | ❓ Open | Whether a Chinese-speaking consumer may be bound by English-only paper, and a Chinese version | Legal |
| Dates | ❓ Open | Whether "(UTC)" on a Hong Kong contract, and an expiry or birthday judged on the UTC day, is acceptable | Legal |
| Custody duties | ❓ Open | Bailment, warehousing or insurance disclosure for free storage of a third party's goods | Legal |
| Staff-recorded acceptance | ❓ Open | Whether a staff click evidences the collector's agreement before the signed paper | Legal |
| Step-up on money | ❓ Open | A fresh factor per payout, or the **12-hour** stamp | Owner |
| Integrity artefacts | ❓ Open | A hash chain plus an unsigned head export, or a qualified signature and timestamp | Legal |
| Capacity | ❓ Open | Any duty beyond age 18 | Legal |
| Backups and drill | ❓ Open | Who owns the recipients, the gaps file and the first restore | Engineering |
:::

:::detail{title="For engineers" for="engineer"}
- **Identity** — `packages/e-kyc` (contracts `identity.ts`, `vocabulary.ts`,
  `masking.ts`) and `packages/vault/backend/src/kyc/record.ts`;
  `latestForUser` and `bind` are exposed in `kyc/binding.ts` and called by
  nothing
- **Retention and erasure** — `packages/app-env/src/retention.ts`,
  `packages/vault/backend/src/sweeps/retention.ts`, `erasure/eraseUser.ts`
  (held statuses are `released` and `forfeited`)
- **Evidence** — `sweeps/{archive,integrity,auditChain}.ts`,
  `packages/postgres/src/auditChain.ts`, the archive binding in
  `apps/backend/grade10/vault/wrangler.jsonc`
- **Backups** — `neondb/scripts/backup.sh` (`audit_gaps`,
  `require_recipients`), `neondb/backup-expected-gaps.txt`,
  `neondb/backup-recipients.txt`, `neondb/registry.sh`
- **Two-factor** — `packages/app-env/src/twoFactor.ts`; the step-up stamp in
  `packages/grade10-auth/contracts/src/elevation.ts`
- **Ledger of what is unset** — `pnpm run check:libs` and
  `scripts/checks/check-config.mjs`
- **Audits** —
  [document-handling audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md),
  [production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md),
  and the decision record `docs/temp/vault-compliance-decision.md`
:::
