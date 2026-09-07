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
  storage is free. The financed lane is Grade10 Finance
  ([Finance](/p/grade10-site/finance))
- **Two entities** — the custodian holds the item and the lender lends
  against it; each prints on its own paper, and only the lender's carries a
  licence
- **Where** — `grade10.com/vault` for collectors, `admin.grade10.com/vault`
  for the shop, `grade10.com/vault/sign#<token>` for the iPad; one host and
  a path per surface, and a vanity domain redirects to it
- **Money** — the brand's currency in whole cents, recorded by a person
  after the bank moved it and against the date it moved; a payout takes two
  people, and a correction takes a second holder of the money grant
- **Paper** — three one-page English documents sealed in-house, anchored in
  a hash chain, naming the shop and the entity whose paper it is
- **Dates** — an instant is UTC everywhere; a calendar day is the brand's
  own zone, `Asia/Hong_Kong`, so a due date, a dated page and the day's
  queue are the day the shop is standing on ([[shared/dates-and-times]])
- **Specs** — the capability requirements are this store's
  `openspec/specs/grade10-site/vault` and, for the operator's surfaces,
  `openspec/specs/grade10-admin/vault`; each page names the ones it documents

| Page | What it holds |
| --- | --- |
| [Collector Pages](/p/grade10-site/vault/collector-pages) | The list, the wizard, the case page, booking, what the collector hears |
| [Case Lifecycle](/p/grade10-site/vault/case-lifecycle) | The fourteen statuses, the two lanes, the timers, the exits |
| [Loan and Money](/p/grade10-site/vault/loan-and-money) | The arithmetic, the policy the brand lends under, the money records and corrections, the ledger |
| [Documents and Signing](/p/grade10-site/vault/documents-and-signing) | The three documents, the ceremony, consent, copies, verification |
| [Operator Console](/p/grade10-site/vault/operator-console) | The queue and its views, one case's tabs, grants, the physical vault |
| [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness) | Identity, retention, evidence, the checklist before the first production case, what counsel supplies |

## Users

- **Collectors** — open a request, photograph the item, book the visit,
  accept or decline the offer, sign on the shop's iPad, watch the case, ask
  for the item back, cancel before the item is in custody
- **Shop staff** — work the queue at the counter: value, offer, record that
  the terms were explained, record or reuse the identity check, prepare and
  hand over documents, vault, move, release, cancel, send the forfeiture
  notice and forfeit
- **Treasurers** — record money and nothing else: the payout, each
  repayment, and with an approver's grant a correction
- **Admins** — everything, including both sides of the money split

:::detail{title="Design record" for="engineer"}
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

:::detail{title="Product decisions" for="pm"}
The vault turns a collector's graded card into cash without a sale, and gives
the shop a lending product secured on an item it already holds and has
valued. The owner's brief is [Grade10 Finance](/references/grade10-finance).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants cash against a card without selling it | Knows the offer, the total and the cost of lateness before the visit, is told the due date in writing when the money reaches them, and gets the card back on repayment |
| Collector | Wants a card kept safely | One visit, one signature, a record of what is held |
| Shop staff | A customer at the counter | Finds the person, values the item, agrees terms, signs and vaults in one visit |
| Treasurer | Money moved at the bank | Writes it down once, against the right case and the right date, and can take a wrong row back |
| Controller | Month end | Lists every payout, repayment and correction in the period and ties them to the statement |
| Compliance | An inspection or a dispute | Produces the paper, the consent, the identity and the chain for one case by its id |

**Not in scope.** Automated payments in either direction; an external
e-signature vendor; online identity verification; a second custodian; storage
fees; multi-item cases; renewing a live loan.

**Measurement.** Five signals, all answered by the ledger and the position:
financed cases per week, redemption rate, days from submission to payout,
days from a money row's value date to its recording, and loans outstanding at
a date.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Custody is the product, financing an attachment | Decided | One case, two lanes, decided by the financing amount at intake | Product |
| One case is one item | Decided | A unique index; siblings are separate cases booked on the lead case | Product |
| A payout takes two people; a correction takes a second one | Decided | Staff and treasurer share no money grant, and nobody may take back a row they recorded | Product |
| Entity, retention and lending policy are data | Decided | Three per-brand tables on one mechanism, every undecided field null and named by the checks with its owner and its cost. A set bound refuses; a null one allows outside production and, where a loan cannot be written without it, refuses the offer in production; a field marked blocking refuses a production deploy | Engineering |
| Storage is free | Decided | The obligations seam is where a fee schedule lands | Owner |
| Grade10 Finance is the vault's financed lane | Decided | The owner's notes describe the vault's flow step for step, so the loan runs on the case that holds the collateral rather than on a second product | Owner |
| Two legal identities, one table | Decided | The custodian holds and the lender lends; the custodian's name blocks a production deploy and the lender's refuses an offer, so custody opens while the lender is still being registered | Legal |
| Lending policy is seeded from the owner's numbers | Decided | Loan to value, the rate band per 30 days, term presets and offer validity in one per-brand table; in production a null bound refuses the offer, never the deploy | Owner |
| A day is the brand's, an instant is UTC | Decided | `Asia/Hong_Kong` decides every calendar judgement — the due date, a dated page, the day's queue, an age, an expiry — and the wire, the database and every comparison stay UTC | Product |
:::
