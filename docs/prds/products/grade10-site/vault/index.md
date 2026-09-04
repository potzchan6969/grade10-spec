---
title: Vault
---

The vault is physical custody with a loan attached: a collector submits an
item online, books a shop visit, staff value it and sign with them on an
iPad, and the item sits in a locker until whatever it owes is settled. The
item is really in a locker and the money is really a bank transfer somebody
made.

- **Two lanes, one case** — custody is the product and financing is an
  attachment, decided at intake by whether the collector asked for a loan;
  storage is free
- **Where** — `grade10.com/vault` for collectors, `admin.grade10.com/vault`
  for the shop, `grade10.com/vault/sign#<token>` for the iPad
- **Money** — the brand's currency in whole cents, recorded by a person
  after the bank moved it and against the date it moved; a payout takes two
  people, and a correction takes both money grants
- **Paper** — three one-page English documents sealed in-house, anchored in
  a hash chain, naming the shop and the brand's entity
- **Specs** — none: no capability, no change and no test suite in this store
  covers the vault, so nothing on these pages embeds a requirement; the
  architecture and QA documents in the application repository and the code
  are the record, and every page here was audited against that code and
  rewritten after the fixes landed

| Page | What it holds |
| --- | --- |
| [Collector Pages](/p/grade10-site/vault/collector-pages) | The list, the wizard, the case page, booking, what the collector hears |
| [Case Lifecycle](/p/grade10-site/vault/case-lifecycle) | The fourteen statuses, the two lanes, the timers, the exits |
| [Loan and Money](/p/grade10-site/vault/loan-and-money) | The arithmetic, the money records and corrections, the ledger, what remains policy |
| [Documents and Signing](/p/grade10-site/vault/documents-and-signing) | The three documents, the ceremony, consent, copies, verification |
| [Operator Console](/p/grade10-site/vault/operator-console) | The queue and its views, one case's tabs, grants, the physical vault |
| [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness) | Identity, retention, evidence, the checklist before the first production case, questions for counsel |

## Who uses it

- **Collectors** — open a request, photograph the item, book the visit, sign
  on the shop's iPad, watch the case, ask for the item back
- **Shop staff** — work the queue at the counter: value, offer, record or
  reuse the identity check, prepare and hand over documents, vault, move,
  release, cancel, forfeit
- **Treasurers** — record money and nothing else: the payout, each
  repayment, and with an approver's grant a correction
- **Admins** — everything, including both sides of the money split

## Where it stands

One line per area: what holds, and what a shop day, a borrower, an
accountant, a compliance officer and a launch still lack.

| Area | Holds | Lacking |
| --- | --- | --- |
| Case machine | fourteen statuses, one writer, every guard under the row lock, a live loan that books its visit, missed pickups closed in the diary, a packet's expiry that ends nothing, offers bounded to their term | renewal, an offer-first order, counter intake, collector cancel |
| Money | value dates, one due calculation with grace, corrections netted in one place, a payout refused past due and re-recordable after a reversal, required bank references, a period ledger and a position, every case action filed on the chain | a rate band, loan to value and grace with values, partial-payment allocation, an overdue cap, forfeiture accounting, receipts, proof attachments, a fresh factor on payout |
| Documents | in-house seal with the consent wording and untruncated names on the certificate, the shop by name, the entity from one table, platform-formatted dates, hash chain, archive copy, integrity re-hash | the legal name and licence, Chinese, mandatory particulars, countersignature, the recorded call, a walk-in's copy, a brand time zone |
| Identity | adult and unexpired at record, reuse and prepare, masked number, a same-document lookup, the verifier's name on the certificate | a policy on a same-document hit, screening beyond the document, a walk-in's erasure path |
| Console | queue by wait with Today, Overdue and search, the customer's contact, paging, needs-staff badges, timeline figures, move item, held items, ledger and position, reuse of the last check, a shop picker | intake, a locker registry and stock-take, a valuation record for graded collectibles, staff notifications |
| Collector | a case address, several photos per tap, the item on every card, a live loan's visit, an email for every event with retried delivery, Chinese copy corrected upstream | accept online, pay or extend, reminders, the total on the offer card, the catalogue bump that carries the corrections |
| Operations | worker, database, chain walk, archive binding, backups whose gaps file is guarded, entity and lending tables the checks report, second factor in production | age recipients and a restore drill, the archive lock, keys and the font, retention values, the values in the two tables |
| Legal | consent recorded and printed, erasure classified off sealed evidence, hold as a reason | jurisdiction, entity, licence, retention periods, Terms and Privacy pages, a complaints route, forfeiture notice |

:::callout{kind="warning"}
Finance and the vault describe the same loan twice. The owner's notes call
Grade10 Finance a loan against graded cards at **~40%** loan to value and
**1.5% to 2.5%** interest, under a separate entity, launching **Q4 2026**;
that is what the vault's financed lane does today under the shop's trading
name, in the shop's database. The application repository's finance shell
holds no product and no longer claims one. Which entity lends, and which
product carries the loan, is the first decision every page here waits on.
:::

:::detail{title="Product decisions" for="pm"}
The vault turns a collector's graded card into cash without a sale, and gives
the shop a lending product secured on an item it already holds, has valued and
insures. The owner's brief is [Grade10 Finance](/references/grade10-finance).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants cash against a card without selling it | Knows the offer, the total, the due date and the cost of lateness, and gets the card back on repayment |
| Collector | Wants a card kept safely | One visit, one signature, a record of what is held |
| Shop staff | A customer at the counter | Finds the person, values the item, agrees terms, signs and vaults in one visit |
| Treasurer | Money moved at the bank | Writes it down once, against the right case and the right date, and can take a wrong row back |
| Controller | Month end | Lists every payout, repayment and correction in the period and ties them to the statement |
| Compliance | An inspection or a dispute | Produces the paper, the consent, the identity and the chain for one case by its id |

**Not in scope.** Automated payments in either direction; an external
e-signature vendor; online identity verification; a second custodian; storage
fees; multi-item cases.

**Measurement.** ❓ None defined. Candidates the ledger and position now
answer: financed cases per week, redemption rate, days from submission to
payout, days from a money row's value date to its recording, loans
outstanding at a date.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Custody is the product, financing an attachment | Decided | One case, two lanes, decided by the financing amount at intake | Product |
| One case is one item | Decided | A unique index; siblings are separate cases booked on the lead case | Product |
| Money is recorded, never moved | Decided | Nothing in v1 moves money on its own; the value date is recorded beside the recording | Product |
| A payout takes two people; a correction takes two hats | Decided | Staff and treasurer share no money grant; a reversal needs both money grants and never the row's own recorder | Product |
| Entity and lending policy are data | Decided | Two per-brand tables, every undecided field null and reported by the checks; a null bound allows, a set bound refuses | Engineering |
| Storage is free | Decided | The obligations seam is where a fee schedule lands | Owner |
| Which product is Grade10 Finance | ❓ Open | The vault's financed lane under the lending entity, a second product on vault machinery, or something else | Owner |
| Which entity lends and which holds | ❓ Open | On a Grade10 Vault case, and on a Tiny case | Owner |
| Order of the flow | ❓ Open | Book-first as built, or offer-first as the notes say | Owner |
| Loan policy values | ❓ Open | Loan to value, rate band and period, term presets, offer validity, grace, an accrued cap, renewal | Owner |
| Hong Kong time | ❓ Open | A delta to the platform's dates-and-times contract before any surface leaves UTC | Product |
| Recorded call, SMS, WhatsApp automation, reminders | ❓ Open | Each named in the notes; none built | Owner |
:::

:::detail{title="Where the design is written down" for="engineer"}
- [Vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  — the case machine, the lanes, the vocabulary and the decisions
- [Document-handling compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
  — read as of its date; the checklist is current
- [Production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
  — vault, doc-sign and auth together
- [Account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
  — who owns the verified identity the case only references
- **Code** — `packages/vault/{contracts,backend,frontend,admin-frontend}` with
  `packages/appointment`, `packages/doc-sign` and `packages/e-kyc` beside it;
  the collector's pages in the grade10 SPA, the console pages in the grade10
  admin panel; deployed as `grade10-vault-service`
- **Platform pages** — [Vault Custody](/platform/vault-custody),
  [Admin Access Control](/platform/admin-access),
  [Account Data](/platform/account-data)
:::
