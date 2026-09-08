---
title: Compliance and Readiness
spec: grade10-site/vault/identity-verification
order: 6
---

What the vault keeps, who may see it, how long it lives, which controls run,
and the checklist between the code and a first production case. Where the law
might bind, the page states the posture the code holds and names who confirms
it; no statute here is asserted.

## Identity

- **Checked at the counter** — a staff member with the document: legal name
  typed character for character, date of birth, document type (passport,
  national ID, driving licence, residence permit), number, expiry, one
  photograph; the method is in person or from an upload
- **Refused** — under **18**, or a document expired on the day of the check,
  each judged on the shop's own day; both judged again when the paper is
  prepared and when a check is reused, and never at release
- **Stored** — the name, birth date, expiry, type, a masked number and a keyed
  digest of it, the photograph, who verified by id and name, and when; the
  raw number never lands
- **Reused** — a returning customer's latest check binds to a new case
  without a new photograph
- **The same document elsewhere** — every binding is answered with how many
  other accounts hold the same document. A hit writes a staff-only event
  carrying the count, badges the case in the queue as **Document seen
  before**, and refuses nothing; which accounts they are never leaves the
  KYC service
- **Not checked** — liveness, face match, address, nationality, sanctions or
  politically exposed persons, source of funds, occupation, purpose, ongoing
  monitoring, thresholds, suspicious-activity reporting
- **Whose it is** — every case belongs to an account, so every identity is
  keyed to a person and every erasure request reaches it
- **Who sees the photograph** — every `staff` and `admin`, each download on
  the audit chain; item photos, the owner and any `vault:read`, each read in
  an append-only ledger

## Retention and erasure

- **Retention windows** — days after a case ends, per class: agreements
  **2,555**, photos **2,555**, identity **1,825**. Seven years is the
  business-record window recalled for Hong Kong, and the photograph is the
  collateral the agreement describes; five years is the AML window recalled.
  Legal confirms them
- **The review is a review** — the sweep flags a case past its window,
  gauges each class, writes nothing and deletes nothing; deletion on expiry
  is a second decision, and a class nobody has set a window for is flagged as
  unset rather than treated as zero
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
| Second factor | required in production and staging, optional in development | — |
| A read that names a person | yes — a search records who searched, when, the kind of term and how many cases matched, never the term | — |
| Identity rebind under a sealed case | closed; a case with sealed evidence refuses a re-record, and a displaced unbound check is purged durably | — |

## Outside the code

- **The regime** — the loan agreement states Hong Kong SAR governing law, the
  annualised rate, `Fees: None` and the complaints contact; which regime
  governs the loan, and any particular it prescribes, is Legal's to name, and
  no licence line prints until Legal writes one
- **Terms and privacy** — the site's Terms of Service and Privacy Policy pages
  read "Being prepared", and the personal information collection statement
  with them
- **Processors and residency** — Cloudflare, Neon in `ap-southeast-1`, Datadog
  in the US carrying no personal data, Resend; no processor register
- **Disputes** — beyond the complaints contact the paper prints, no path for a
  collector to dispute a valuation, an interest figure or a forfeiture; the
  only refusal in the flow is declining the packet before the seal
- **Insurance** — no policy, no insurer and no cover limit; the paper claims
  none and states the custodian's duty of reasonable care instead

## Before the first production case

Every item here is a value or an act outside the code, with who closes it and
how the closure is seen. `pnpm run check:libs` in the application repository
prints the first until it is done; the rest live outside any check.

1. *Legal* — **Name the two entities and their licence** — the custodian's
   registered name, the lender's, the lender's licence number and the exact
   wording beside it, the complaints contact and the repayment instructions,
   in `packages/app-env/src/legalIdentity.ts`. Until then a production deploy
   of the brand is refused before the first worker uploads, no offer may be
   written in production, and a live loan's balance prints nowhere to pay
2. *Legal* — **Confirm the postures** — the regime and any particular it
   prescribes, the e-sign ceremony's adequacy, a document upload as a
   verification method, whether an AML duty applies, the retention windows,
   and whether the hash chain with a witnessed head is evidence enough. Each
   has a posture the code holds meanwhile, stated in the decisions below
3. *Legal* — **Counsel's wording** — the e-sign disclosure, the per-document
   consent text, the personal information collection statement, and the
   Chinese versions of each; the ceremony records whatever is served, so the
   change is evidenced
4. *Operations* — **Backups** — two age public keys into
   `neondb/backup-recipients.txt`, one green nightly, a restore drill with
   the chain verifying on the restored copy
5. *Operations* — **The archive bucket lock** — the R2 lock rule on the
   documents archive per environment; nothing in the repository can assert
   it
6. *Operations* — **Keys and assets** — the Datadog key with monitors and
   named recipients, the mail key, the CJK font asset per environment (a
   missing font fails the seal for any Chinese name)
7. *Operations* — **The region** — every Neon project in `ap-southeast-1`,
   the one home residency answers with; a project created elsewhere is
   replaced, never moved
8. *Owner* — **Two people who can move money** — a reversal refuses the row's
   own recorder and a payout refuses the offer's own maker, so with a single
   money holder a bounced transfer strands the case in `active` and
   forfeiture is its only exit
9. *Engineering* — **Bump the catalogue** — the collector's own words live in
   this store and not in the submodule the application pins: the offer's
   total and what a late day costs, accepting, declining and cancelling,
   where to pay, the ceremony's chrome in Chinese, and the timeline entries
   for a reminder, a forfeiture notice, a missed visit and the two money
   corrections. Until the pointer moves after the upstream merge, the worker
   answers all of it and the collector's page does not show it: the acts are
   not on the page, the signing screen serves English to a Chinese reader,
   and those entries stay off the timeline — the email tells them either way
10. *Engineering* — **Write the vault's specs** — the capabilities behind
    these pages, so the timers, the arithmetic, the grants and the
    twenty-three mail kinds are validated rather than described

:::callout{kind="warning"}
`check:libs` lists **43** unset values. Six are Grade10's own and every one is
item 1's: the two registered names, the licence number and its wording, the
complaints contact and the repayment instructions. One of the six blocks a
deploy — without the custodian's registered name a production run is refused
before it uploads anything — and a second stops the lane, because no offer is
written without the lender's. The rest belong to zzz, which lends nothing.
:::

## Specs and journeys

**Specs** — this page documents `grade10-site/vault/identity-verification`
and `grade10-site/vault/retention-and-erasure`. The requirements are theirs;
this page holds the decision behind them.

::spec{id="grade10-site/vault/identity-verification"}

::spec{id="grade10-site/vault/retention-and-erasure"}

:::detail{title="Code map" for="engineer"}
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
  `packages/grade10-auth/backend/src/stepUp.ts`
- **Audits** —
  [document-handling audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md),
  [production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md),
  and the decision record `docs/temp/vault-compliance-decision.md`
:::

:::detail{title="Product decisions" for="pm"}
Where the law might bind, the borrower-favourable rule is the one taken — and
"more" never means a charge. Every statute below is as engineering recalls it,
never asserted; a TBC row names who supplies the fact and the posture the code
holds until they do.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Regime and licence | TBC Legal | Which regime governs a loan secured on a collectible in a shop locker in Hong Kong. Posture: the seeded band, presets no longer than **120 days**, the term's own daily rate after the due date, no fee and no compounding — which satisfies both the pawnbroking and the money-lending reading | Legal |
| The two registered names and the licence line | TBC Legal | The custodian, the lender, the licence number and its wording. Until they are given, production refuses the paper and the offer | Legal |
| E-sign adequacy | TBC Legal | Posture: in person on the shop's iPad, staff present, identity verified, the disclosure and each consent printed in full on the certificate above their digests | Legal |
| Upload as a verification method | TBC Legal | Posture: in person and from an upload both stand, and the certificate says which was used | Legal |
| AML and customer due diligence | TBC Legal | Posture: name, birth date, document, photograph and a count of the other accounts holding the same document; as recalled, money lenders sit under licence conditions rather than the AMLO schedule, and screening is added the day a duty is named | Legal |
| Retention windows | TBC Legal | Posture: the seeded review windows, flagging only, with no deletion act to build until the numbers are confirmed | Legal |
| Integrity artefacts | TBC Legal | Posture: the hash chain and the witnessed head export; RFC 3161 over the head is the first upgrade if counsel asks | Legal |
| The collection statement | TBC Legal | The personal information collection statement the wizard links; the privacy page reads "Being prepared" until it exists | Legal |
| Bilingual paper | TBC Legal | Templates and consent copy in Chinese, and which language governs; English governs meanwhile | Legal |
| Forfeiture | Decided | Past due, a written notice naming a cure date at least **14 days** off, and only then a person's decision to take the item; the surplus and the accounting after it are the firm's books | Legal |
| A document held under another account | Decided | Flag, never refuse: a refusal needs an override the vault has nowhere and would strand a customer with two accounts | Owner |
| Residency | Decided | Every Neon project in `ap-southeast-1`, the nearest region to Hong Kong and one stated home; Datadog stays in the US on the standing rule that logs carry no personal data | Legal |
| Dates | Decided | A calendar day — a contract's date, a due date, an age, an expiry — is judged on `Asia/Hong_Kong`; instants stay UTC on the wire and in the database | Legal |
| Custody duties | Decided | The bailee's duty of reasonable care, stated on the paper; storage is free, no cover is claimed because none is held, and a fee later would be a new agreement rather than a unilateral variation | Legal |
| Acceptance | Decided | Acceptance moves the case and the signature binds, so either the collector or the counter may record it | Legal |
| Capacity | Decided | Eighteen is the age of majority; nothing beyond it is asked | Legal |
| Reads that carry personal data | Decided | The elevated ladder records any call that declares audit details, not only a mutation; a search leaves who searched, when, the kind of term and the hit count, and never the term | Engineering |
:::
