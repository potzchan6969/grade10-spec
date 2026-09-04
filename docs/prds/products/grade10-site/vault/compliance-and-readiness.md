---
title: Compliance and Readiness
order: 6
---

What the vault keeps, who may see it, how long it lives, which controls run,
and the checklist between the code and a first production case. Every legal
requirement here is a question for counsel with the code fact beside it,
never an assertion of law.

## Identity

- **Checked at the counter** — a staff member with the document: legal name
  typed character for character, date of birth, document type (passport,
  national ID, driving licence, residence permit), number, expiry, one
  photograph; the method is in person or from an upload
- **Refused** — under **18**, or a document expired on the day of the check;
  both judged again when the paper is prepared and when a check is reused,
  and never at release
- **Stored** — the name, birth date, expiry, type, a masked number and a keyed
  digest of it, the photograph, who verified by id and name, and when; the
  raw number never lands
- **Reused** — a returning customer's latest check binds to a new case
  without a new photograph
- **The same document elsewhere** — every binding is answered with how many
  other accounts hold the same document. A hit writes a staff-only event
  carrying the count, badges the case in the queue as **Document seen
  before**, and refuses nothing; which accounts they are never leaves the
  identity store
- **Not checked** — liveness, face match, address, nationality, sanctions or
  politically exposed persons, source of funds, occupation, purpose, ongoing
  monitoring, thresholds, suspicious-activity reporting
- **A walk-in** — has no account, so the identity is keyed to the case, never
  to a person, and no erasure request can reach it
- **Who sees the photograph** — every `staff` and `admin`, each download on
  the audit chain; item photos, the owner and any `vault:read`, each read in
  an append-only ledger

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
- **Messages never sent** — a case's queued and parked mail is deleted
  whichever class the case falls in; a held case keeps the agreement, not the
  outbox
- **Process** — the account holder asks on the auth side, a **7-day** window
  runs, then an admin runs each product from the console

## Evidence

| Control | Runs | Still owed |
| --- | --- | --- |
| Seal ladder and certificate | yes, with the consent wording printed in full | counsel's wording; PAdES/PKCS#7 and RFC 3161 unbuilt, so the certificate is printed text |
| Append-only tables | yes, armed always, on money rows, corrections, valuations, movements, history and the chain; proved by a test that an update raises | — |
| Hash-chained audit log | yes, every case mutation filed under its case, walked hourly in **1,000**-row budgets, verified heads exported to the archive | the Datadog key and monitors with named recipients |
| Archive copy of sealed bytes | yes, hourly, digest-checked, through a port that cannot delete | the bucket's lock rule, set by hand and verified by nothing |
| Integrity re-hash | yes, **200** rows per pass | — |
| Database backups | one check grades the gaps file against the registry, run by the build and by the nightly alike, across every environment | two age recipients, one green nightly, a restore drill |
| Second factor | required in production, optional in staging | a decision on staging; a fresh challenge on payout |
| Identity rebind under a sealed case | closed; a case with sealed evidence refuses a re-record, and a displaced unbound check is purged durably | — |

## What is not written down anywhere

- **Jurisdiction** — no jurisdiction or governing law appears in code,
  configuration or documents; the legal identity table exists and every legal
  field is null; all instants are UTC
- **Terms and privacy** — the site's Terms of Service and Privacy Policy pages
  read "Being prepared"
- **Processors and residency** — Cloudflare, Neon with its region unpinned,
  Datadog in the US, Resend; no register, no residency choice
- **Disputes** — no path for a collector to dispute a valuation, an interest
  figure or a forfeiture; no complaint route; no cooling-off after signing;
  the only refusal is declining the packet before the seal
- **The recorded call** — the owner's notes require a recorded call explaining
  key terms before signing; nothing models a call, a recording or a
  precondition for one, and what it must retain is open on
  [Documents and Signing](/p/grade10-site/vault/documents-and-signing)
- **Insurance** — the custody agreement says the valuation is used for
  insurance; no policy, insurer or cover limit appears anywhere

## Before the first production case

Every item here is outside the code, with who closes it and how the closure
is seen. `pnpm run check:libs` in the application repository prints the
first three until they are done; the rest live outside any check.

1. *Legal* — **Name the lending entity** — legal name, licence number and
   licence wording per brand in `packages/app-env/src/legalIdentity.ts`;
   until then production refuses every packet, a production deploy of the
   brand is refused before the first worker uploads, and `check:libs` names
   the three unset fields
2. *Owner* — **Set the lending policy** — loan to value, rate band and
   period, term presets, offer validity, grace days, the accrual ceiling in
   `packages/app-env/src/lending.ts`; every one of them is enforced where it
   is read, an unset bound allows everything, and `check:libs` names each
3. *Legal* — **Set retention windows** — days per class in
   `packages/app-env/src/retention.ts`; then decide what deletion on expiry
   does
4. *Operations* — **Backups** — two age public keys into
   `neondb/backup-recipients.txt`, one green nightly, a restore drill with
   the chain verifying on the restored copy
5. *Operations* — **The archive bucket lock** — the R2 lock rule on the
   documents archive per environment; nothing in the repository can assert
   it
6. *Operations* — **Keys and assets** — the Datadog key with monitors and
   named recipients, the mail key, the CJK font asset per environment (a
   missing font fails the seal for any Chinese name)
7. *Owner* — **Staging second factor** — required as the compliance plan
   asked, or optional as the code states; three documents follow the choice
8. *Owner* — **Who records money** — whether `admin` may hold both sides of
   the split, and whether a payout demands a fresh factor; whatever the
   answer, provision **two** people who can move money, because a reversal
   refuses the row's own recorder — with a single recorder a bounced
   transfer strands the case in `active` and forfeiture is its only exit
9. *Legal* — **Counsel's wording** — the e-sign disclosure and per-document
   consent text; the ceremony records whatever is served, so the change is
   evidenced
10. *Legal* — **The particulars on the paper** — annualised rate, fees,
    governing law, complaints, cooling-off, redemption period, and whether a
    countersignature or a recorded call is required
11. *Owner* — **Which product is Grade10 Finance** — the vault's lane under
    the lending entity, a second product, or something else; the shell's
    name follows the answer
12. *Engineering* — **Bump the catalogue** — the spec store carries the
    corrected vault copy and three event names the application's pinned
    submodule does not: the two money corrections and a missed visit. Until
    the pointer moves after the upstream merge, those three stay off a
    collector's timeline, though the email still tells them
13. *Engineering* — **Write the vault's specs** — no capability, change or
    test suite in this store covers the vault, so every page carries the
    planned pip and nothing validates the timers, the arithmetic, the grants
    or the twenty mail kinds
14. *Product* — **A brand time zone** — a delta to the shared
    dates-and-times contract before any surface leaves UTC
15. *Owner* — **Reminders** — days before due, cadence when overdue,
    channel; the highest-value decision left on this list, because every
    other event reaches the borrower and the due date reaches nobody. The
    message map and the sweep pattern are ready for the two kinds, and the
    question is open on
    [Collector Pages](/p/grade10-site/vault/collector-pages)

:::callout{kind="warning"}
`check:libs` lists **46** unset values, twenty of them the entity and policy
fields items 1 and 2 name and none of them a database or a Hyperdrive id the
vault depends on. One blocks a deploy: without the registered legal name a
production run is refused before it uploads anything.
:::

:::detail{title="Product decisions" for="pm"}
Questions for counsel, each with the fact the code holds today.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Regime and licence | ❓ Open | Which regime governs a loan secured on a collectible held in a shop locker in Hong Kong, and whether it prescribes particulars, a licence number on the paper, a rate ceiling or a redemption period; the code permits **0% to 100%** per term until a band is set | Legal |
| Lender entity | ❓ Open | The legal name and licence for the identity table | Legal |
| E-sign adequacy | ❓ Open | Whether the ceremony and its interim wording bind a consumer loan and a custody contract | Legal |
| Countersignature | ❓ Open | Company signature or witness; one signer today | Legal |
| Cooling-off and complaints | ❓ Open | None today | Legal |
| Forfeiture | ❓ Open | Notice, grace, surplus return | Legal |
| AML and customer due diligence | ❓ Open | Whether duties apply and how deep identification must go; today name, birth date, document, photograph, and a count of the other accounts holding the same document | Legal |
| A document held under another account | ❓ Open | Today the counter is told and nothing is refused. A refusal needs an override the vault has nowhere, and the accounts behind the count are ones an operator may not look up — so a refusal would strand a legitimate customer with no path | Owner |
| Upload as a method | ❓ Open | Whether a document upload is an acceptable verification | Legal |
| Retention per class | ❓ Open | Days for agreements, identity and photos, and a lawful basis for indefinite identity retention on held cases | Legal |
| Walk-in erasure | ❓ Open | A case-scoped erasure path, since a walk-in's case has no account to erase by | Engineering |
| Collection statement | ❓ Open | Whether a personal information collection statement must be published before the first capture; the privacy page is a placeholder | Legal |
| Residency | ❓ Open | Where the data may live; Neon region unpinned, Datadog in the US | Legal |
| Language | ❓ Open | Whether a Chinese-speaking consumer may be bound by English-only paper, and a Chinese version | Legal |
| Dates | ❓ Open | Whether UTC on a Hong Kong contract, and an expiry or birthday judged on the UTC day, is acceptable | Legal |
| Custody duties | ❓ Open | Bailment, warehousing or insurance disclosure for free storage of a third party's goods | Legal |
| Staff-recorded acceptance | ❓ Open | Whether a staff click evidences the collector's agreement before the signed paper | Legal |
| Step-up on money | ❓ Open | A fresh factor per payout, or the **12-hour** stamp | Owner |
| Integrity artefacts | ❓ Open | A hash chain plus an unsigned head export, or a qualified signature and timestamp | Legal |
| Capacity | ❓ Open | Any duty beyond age 18 | Legal |
| Reads that carry personal data | ❓ Open | The elevated ladder audits mutations only, so a search by phone or email leaves no trail of who was looked for; the term itself travels in the request body and never in an address | Engineering |
:::

:::detail{title="For engineers" for="engineer"}
- **Identity** — `packages/e-kyc` (contracts `identity.ts`, `vocabulary.ts`,
  `masking.ts`; `otherUserIdsByIdNumberHash` behind every bind, so the count
  rides the answer and no caller can forget to ask) and
  `packages/vault/backend/src/kyc/{record,reuse}.ts`
- **Retention and erasure** — `packages/app-env/src/retention.ts`,
  `packages/vault/backend/src/sweeps/retention.ts`, `erasure/eraseUser.ts`
  (held statuses are `released` and `forfeited`; the entrypoint keys on the
  account id)
- **Entity and policy** — `packages/app-env/src/{legalIdentity,lending}.ts`;
  findings in `scripts/config/audit.mjs`, printed by `check:libs`
- **Evidence** — `sweeps/{archive,integrity,auditChain}.ts`,
  `packages/postgres/src/auditChain.ts`, the archive binding in
  `apps/backend/grade10/vault/wrangler.jsonc`
- **Backups** — `neondb/scripts/backup.sh`, `neondb/backup-expected-gaps.txt`
  guarded by `scripts/checks/check-backup-gaps.mjs`, `neondb/registry.sh`
- **Two-factor** — `packages/app-env/src/twoFactor.ts`; the step-up stamp is
  read on `packages/grade10-auth/contracts/src/elevation.ts` and its
  **12-hour** life is `STEP_UP_TTL_SECONDS` in
  `packages/grade10-auth/backend/src/core/stepUp.ts`
- **Audits** —
  [document-handling audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md),
  [production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md),
  and the decision record `docs/temp/vault-compliance-decision.md`
:::
