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
- **Money** — HKD in whole cents, recorded by a person after the bank moved
  it; a payout takes two people
- **Paper** — three one-page English documents sealed in-house and anchored in
  a hash chain
- **Specs** — none: no capability, no change and no test suite in this store
  covers the vault, so nothing on these pages embeds a requirement; the
  architecture and QA documents in the application repository and the code
  are the record, and every page here was audited against that code

| Page | What it holds |
| --- | --- |
| [Collector Pages](/p/grade10-site/vault/collector-pages) | The list, the wizard, the case screen, booking, what the collector hears |
| [Case Lifecycle](/p/grade10-site/vault/case-lifecycle) | The fourteen statuses, the two lanes, the timers, the exits |
| [Loan and Money](/p/grade10-site/vault/loan-and-money) | The arithmetic, the payout and repayment records, forfeiture, what an accountant is missing |
| [Documents and Signing](/p/grade10-site/vault/documents-and-signing) | The three documents, the ceremony, consent, copies, verification |
| [Operator Console](/p/grade10-site/vault/operator-console) | The queue, one case's tabs, grants, the physical vault |
| [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness) | Identity, retention, evidence, provisioning, questions for counsel |

## Who uses it

- **Collectors** — open a request, photograph the item, book the visit, sign
  on the shop's iPad, watch the case, ask for the item back
- **Shop staff** — work the queue at the counter: value, offer, record the
  identity check, prepare and hand over documents, vault, release, cancel,
  forfeit
- **Treasurers** — record money and nothing else: the payout and each
  repayment
- **Admins** — everything, including both sides of the money split

## Where it stands

The audit's verdict, one line per area: what holds today, and what a shop
day, a borrower, an accountant, a compliance officer and a launch each still
lack.

| Area | Holds | Lacking |
| --- | --- | --- |
| Case machine | fourteen statuses, one writer, every guard under the row lock, sweeps for liveness only | renewal, an offer-first order, a visit on a live loan, counter intake, collector cancel, document preparation ahead of the visit that does not cancel the case |
| Money | one payout, any repayments, one pure due calculation, stale quotes refused, append-only rows | a value date, a correction path, any cross-case report, reminders, a rate band or loan-to-value cap, receipts, forfeiture accounting |
| Documents | in-house seal with certificate, hash chain, archive copy, integrity re-hash, decline on record | Chinese, the lender's legal identity and particulars, countersignature, the recorded call, a walk-in's copy, Hong Kong dates |
| Identity | adult and unexpired at record and at prepare, masked number, photo behind `kyc:read` | reuse for returning customers, a person key for walk-ins, any screening beyond the document |
| Console | queue by wait, tabs by grant, buttons by status | a customer's name, search, paging, today and overdue views, intake, a locker registry, staff notifications |
| Collector | wizard, photos, booking in the shop's clock, offer and balance cards, downloads, Chinese copy | accept online, pay or book while active, reminders, Hong Kong time, a case address |
| Operations | worker, database, chain walk, archive binding, second factor in production, Neon and Hyperdrive provisioned | a nightly backup that runs, a restore drill, retention values, the archive lock, keys and the font set by hand |
| Legal | consent recorded by digest, erasure classified off sealed evidence, hold as a reason | jurisdiction, entity, licence, retention periods, Terms and Privacy pages, a complaints route, forfeiture notice |

:::callout{kind="warning"}
Finance and the vault describe the same loan twice. The owner's notes call
Grade10 Finance a loan against graded cards at **~40%** loan to value and
**1.5% to 2.5%** interest, under a separate entity, launching **Q4 2026**;
that is what the vault's financed lane does today under the shop's name, in
the shop's database, with "Grade10" printed as the lender. The application
repository's finance shell is described as mortgage lending and holds no
product. Which entity lends, and which product carries the loan, is the first
decision every page here waits on.
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
| Treasurer | Money moved at the bank | Writes it down once, against the right case, with proof |
| Controller | Month end | Lists every payout and repayment in the period and ties them to the statement |
| Compliance | An inspection or a dispute | Produces the paper, the consent, the identity and the chain for one case |

**Not in scope.** Automated payments in either direction; an external
e-signature vendor; online identity verification; a second custodian; storage
fees; multi-item cases.

**Measurement.** ❓ None defined. Candidates: financed cases per week,
redemption rate, days from submission to payout, days from bank credit to
recording, loans outstanding at a date.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Custody is the product, financing an attachment | Decided | One case, two lanes, decided by the financing amount at intake | Product |
| One case is one item | Decided | A unique index; siblings are separate cases booked on the lead case | Product |
| Money is recorded, never moved | Decided | Nothing in v1 moves money on its own | Product |
| A payout takes two people | Decided | Staff and treasurer share no money grant | Product |
| Storage is free | Decided | The obligations seam is where a fee schedule lands | Owner |
| Which product is Grade10 Finance | ❓ Open | The vault's financed lane under the lending entity, a second product on vault machinery, or mortgage lending as the application repository says | Owner |
| Which entity lends and which holds | ❓ Open | On a Grade10 Vault case, and on a Tiny case | Owner |
| Order of the flow | ❓ Open | Book-first as built, or offer-first as the notes say | Owner |
| Loan policy | ❓ Open | Loan to value, rate band and period, term presets, offer validity, grace, renewal | Owner |
| Hong Kong time | ❓ Open | A brand zone for every collector surface, email and document; UTC today | Product |
| Recorded call, SMS, WhatsApp automation, reminders | ❓ Open | Each named in the notes; none built | Owner |
:::

:::detail{title="Where the design is written down" for="engineer"}
- [Vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  — the case machine, the lanes, the vocabulary and the decisions; stale on
  the identity rebind and on where the console lives
- [Document-handling compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
  — blocker prose is pre-fix; the checklist is current
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
