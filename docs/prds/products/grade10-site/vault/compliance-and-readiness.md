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
  photograph; in person or from an upload
- **Refused** — under **18** or an expired document, judged on the shop's own
  day at the check, when the paper is prepared and on reuse, never at release
- **Stored** — the name, birth date, expiry, type, a masked number and a keyed
  digest of it, the photograph, who verified by id and name, and when; the
  raw number never lands
- **Reused** — a returning customer's latest check binds to a new case
  without a new photograph
- **The same document elsewhere** — every binding answers with how many other
  accounts hold the same document; a hit writes a staff-only event, badges
  the case **Document seen before**, and refuses nothing
- **Not checked** — liveness, face match, address, nationality, sanctions,
  politically exposed persons, source of funds, purpose, ongoing monitoring
- **Whose it is** — every case belongs to an account, so every identity is
  keyed to a person and every erasure request reaches it
- **Who sees the photograph** — every `staff` and `admin`, each download on
  the audit chain; item photos, the owner and any `vault:read`, each read in
  an append-only ledger

## Retention and erasure

- **Retention windows** — days after a case ends, per class: agreements
  **2,555**, photos **2,555**, identity **1,825**; seven years is the
  business-record window recalled for Hong Kong, five the AML window
- 🚧 **The submission record** — its own class, case records, **2,555** days
  from the day it ended — [The Submission](/p/grade10-site/grading/submission#the-record-after-collection)
- **The review is a review** — the sweep flags a case past its window and
  deletes nothing; deletion on expiry is a second decision, and a class with
  no window is flagged as unset rather than treated as zero
- **Legal hold** — the reason written on a case, not the guard; the guard is
  whether sealed evidence exists, read under the row lock
- **Erasure, in flight** — a signed case that is not yet `released` or
  `forfeited` refuses; nothing is erased until the loan settles
- 🚧 **Erasure, a live submission** — refused by name while a grading
  submission is between booked and ready, an upcharge is unsettled or ready
  cards are uncollected — [The Submission](/p/grade10-site/grading/submission#the-record-after-collection)
- **Erasure, closed and signed** — contact, decline reason, staff notes and
  actor ids go; the sealed PDFs, the identity record and photograph, the item
  photos and text stay under the hold, no clock
- **Erasure, never signed** — everything is purged and the identity released
- **Messages never sent** — queued and parked mail goes whichever class the case falls in
- 🚧 **Process** — the collector files the ask from Your data and can cancel
  it inside the **7-day** window; then an admin runs each product from the
  console — [Account Data](/platform/account-data#erasure)
- 🚧 **Your data** — a page under the collector's account: what the vault keeps
  and for how long, per class; the identity standing — verified until when,
  checked how, never the name or document; every signed document in one download;
  and the ask to be forgotten, refused in words while a case is in flight

## Evidence

| Control | Runs | Still owed |
| --- | --- | --- |
| Seal ladder and certificate | yes, with the consent wording printed in full | counsel's wording; PAdES/PKCS#7 and RFC 3161 unbuilt, so the certificate is printed text |
| Append-only tables | yes, armed always, on money rows, corrections, valuations, movements, history and the chain; proved by a test that an update raises | — |
| Hash-chained audit log | yes, every case mutation filed under its case, walked hourly in **1,000**-row budgets, verified heads exported to the archive | the Datadog key and monitors with named recipients |
| Archive copy of sealed bytes | yes, hourly, digest-checked, through a port that cannot delete | the bucket's lock rule, set by hand and verified by nothing |
| Integrity re-hash | yes, **200** rows per pass | — |
| Database backups | one check grades the gaps file against the registry, run by the build and by the nightly alike, across every environment | two age recipients, one green nightly, a restore drill |
| 🚧 Second factor | required in production only, for every brand; optional in staging and development | — |
| A read that names a person | yes — a search records who searched, when, the kind of term and how many cases matched, never the term | — |
| Identity rebind under a sealed case | closed; a case with sealed evidence refuses a re-record, and a displaced unbound check is purged durably | — |

## Outside the code

- **The regime** — Legal's to name; the loan agreement states Hong Kong SAR
  governing law, the annualised rate, `Fees: None` and the complaints
  contact; no licence line prints until Legal writes one
- **Terms and privacy** — the site's Terms of Service and Privacy Policy pages
  still read “Being prepared” on the live site. An auction-launch draft for
  review lives in Storybook under Pages/Legal, not in the message catalogs
- **Counsel's wording on those pages** — the Terms, the Privacy Policy and
  the collection statement are counsel's, readiness item 3; production refuses
  the statement's send while it is unwritten
- **Processors and residency** — Cloudflare, Neon in `ap-southeast-1`, Datadog
  in the US carrying no personal data, Resend; no processor register
- **Disputes** — beyond the complaints contact the paper prints, no path to
  dispute a valuation, an interest figure or a forfeiture
- **Insurance** — no policy, no insurer and no cover limit; the paper claims
  none and states the custodian's duty of reasonable care instead

## Before the first production case

Every item is a value or an act outside the code, with who closes it;
`check:libs` in the application repository prints items 1, 11 and 12 until they are done.

1. *Legal* — **Name the two entities and their licence** — each refuses its
   own act while unset in production: the custodian's name a deploy, the
   lender's an offer, the licence the loan agreement and every money email
2. *Legal* — **Confirm the postures** — the regime and any particular it
   prescribes, the e-sign ceremony's adequacy, an upload as a verification
   method, whether an AML duty applies, the retention windows, and whether
   the hash chain with a witnessed head is evidence enough
3. *Legal* — **Counsel's wording** — the e-sign disclosure, the per-document
   consent text, the collection statement, the forfeiture notice's operative
   text, a notices clause making email to the case's address good service, any
   summary or warning the regime prescribes beside the loan agreement, the
   complaints escalation line, and the Chinese versions of each; a drafted
   wording prints until counsel replaces it; only a text with no draft refuses
   its act in production — today the collection statement's send alone — and
   brackets print outside production only
4. *Operations* — **Backups** — two age public keys into
   `neondb/backup-recipients.txt`, one green nightly, a restore drill with
   the chain verifying on the restored copy
5. *Operations* — **The archive bucket lock** — the R2 lock rule on the
   documents archive per environment; nothing in the repository can assert it
6. *Operations* — **Keys and assets** — the Datadog key with monitors and
   named recipients, the mail key, the CJK font asset per environment (a
   missing font fails the seal for any Chinese name)
7. *Operations* — **The region** — every Neon project in `ap-southeast-1`; a
   project created elsewhere is replaced, never moved
8. *Owner* — **Two people who can move money** — a reversal refuses the row's
   own recorder and a payout refuses the offer's own maker, so with a single
   money holder a bounced transfer strands the case in `active`
9. *Engineering* — **Bump the catalogue** — the collector's words live in this
   store and reach the application only when the submodule pointer moves
10. *Engineering* — **Write the vault's specs** — the capabilities behind
    these pages, so the timers, the arithmetic, the grants and the mail kinds
    are validated rather than described
11. *Finance* — **Where a borrower pays** — the lender's FPS id and bank account
    beside its legal identity; unset, they refuse every offer in production, so
    no loan goes live without them, and print a marked placeholder outside it
12. *Owner* — **The complaints contact** — a monitored mailbox, a phone and the
    shop's address; every vault email and paper refuses in production while
    unset

## Specs and journeys

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
never asserted; a row marked `TBC` names who supplies the fact and the posture
the code holds until they do.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Regime and licence | TBC Legal | Which regime governs a loan secured on a collectible in a shop locker in Hong Kong. Posture: the seeded band, presets no longer than **120 days**, the term's own daily rate after the due date, no fee and no compounding — which satisfies both the pawnbroking and the money-lending reading | Legal |
| The two registered names and the licence line | TBC Legal | The custodian, the lender, the licence number and its wording. Until they are given, production refuses the paper and the offer; `check:libs` lists them among its unset values, six of them Grade10's own | Legal |
| The complaints contact | TBC Owner | A monitored mailbox on the brand's domain, a phone and the shop's address, in every email's footer and on the paper; counsel adds the escalation line. Until it is given, production refuses every act that sends a vault email or mints a paper, and brackets print outside production only | Owner; the escalation line Legal |
| The notice's operative text | TBC Legal | The forfeiture notice names the clause it acts under, the date to pay by, the lapse condition and that a person decides; its structure and drafted sentences are built and print until counsel replaces them; in production the send refuses while the licence line or where to pay is unset | Legal |
| E-sign adequacy | TBC Legal | Posture: in person on the shop's iPad, staff present, identity verified, the disclosure and each consent printed in full on the certificate above their digests | Legal |
| Upload as a verification method | TBC Legal | Posture: in person and from an upload both stand, and the certificate says which was used | Legal |
| AML and customer due diligence | TBC Legal | Posture: name, birth date, document, photograph and a count of the other accounts holding the same document; as recalled, money lenders sit under licence conditions rather than the AMLO schedule, and screening is added the day a duty is named | Legal |
| Retention windows | TBC Legal | Posture: the seeded review windows, flagging only, with no deletion act to build until the numbers are confirmed; the collector reads the seeded windows on Your data meanwhile | Legal |
| Integrity artefacts | TBC Legal | Posture: the hash chain and the witnessed head export; RFC 3161 over the head is the first upgrade if counsel asks | Legal |
| The collection statement | TBC Legal | One personal information collection statement per brand, for every product, versioned; each send keeps the version it showed. In production the send is refused while it is unwritten; outside production it reads “Being prepared”. A draft for counsel is written; changed at landing, superseding the round's answer | Legal |
| One rule for the complaints contact | Decided | The paper refuses an unset contact in production too, so the field keeps one rule | Product |
| Bilingual paper | TBC Legal | Templates and consent copy in Chinese, and which language governs; English governs meanwhile | Legal |
| Your data is one page for every product | Decided | The collector reads what each product keeps, for how long, and their identity standing on one page under their account, and files the ask to be forgotten from there themselves, cancellable inside the window; the vault answers for its own classes and its own refusal | Product |
| Forfeiture | TBC Legal | Past due, a written notice naming a cure date at least **14 days** off, and only then a person's decision to take the item. What follows turns on the regime: under the pawnbroking reading the item is the lender's and nothing further is owed; under the money-lending reading, as recalled, the lender sells it and returns what is left after the debt and the sale's costs. Posture until Legal names it: the forfeit settles the debt with no shortfall claimed, and no forfeited item is sold before the regime is named; handing it back to the borrower stays open. Changed at landing, superseding the round's answer | Legal |
| A document held under another account | Decided | Flag, never refuse: a refusal needs an override the vault has nowhere and would strand a customer with two accounts | Owner |
| Residency | Decided | Every Neon project in `ap-southeast-1`, the nearest region to Hong Kong and one stated home; Datadog stays in the US on the standing rule that logs carry no personal data | Legal |
| Dates | Decided | A calendar day — a contract's date, a due date, an age, an expiry — is judged on `Asia/Hong_Kong`; instants stay UTC on the wire and in the database | Legal |
| Custody duties | Decided | The bailee's duty of reasonable care, stated on the paper; storage is free, no cover is claimed because none is held, and a fee later would be a new agreement rather than a unilateral variation | Legal |
| Acceptance | Decided | Acceptance moves the case and the signature binds, so either the collector or the counter may record it | Legal |
| Capacity | Decided | Eighteen is the age of majority; nothing beyond it is asked | Legal |
| Reads that carry personal data | Decided | The elevated ladder records any call that declares audit details, not only a mutation; a search leaves who searched, when, the kind of term and the hit count, and never the term | Engineering |
:::
