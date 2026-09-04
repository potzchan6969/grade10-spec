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
  people, and a correction takes a second holder of the money grant
- **Paper** — three one-page English documents sealed in-house, anchored in
  a hash chain, naming the shop and the brand's entity
- **Dates** — every screen, console and page of paper states UTC, the
  platform's one zone ([[shared/dates-and-times]]); a brand zone is a delta
  to that contract
- **Specs** — none. No capability, no change and no test suite in this store
  covers the vault, so no page here embeds a requirement and every page
  carries the planned pip. The code and the application repository's
  architecture and QA documents are the record; writing the capability specs
  is open (❓ Engineering)

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

:::callout{kind="warning"}
Finance and the vault describe the same loan twice. The owner's notes call
Grade10 Finance a loan against graded cards at **~40%** loan to value and
**1.5% to 2.5%** interest, under a separate entity, launching **Q4 2026**;
that is what the vault's financed lane does today under the shop's trading
name, in the shop's database. The finance shell holds no product. Which
entity lends, and which product carries the loan, is the first decision every
page here waits on, and it is open on [Finance](/p/grade10-site/finance).
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

**Measurement.** ❓ None defined. Candidates the ledger and the position
answer: financed cases per week, redemption rate, days from submission to
payout, days from a money row's value date to its recording, loans
outstanding at a date.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Custody is the product, financing an attachment | Decided | One case, two lanes, decided by the financing amount at intake | Product |
| One case is one item | Decided | A unique index; siblings are separate cases booked on the lead case | Product |
| A payout takes two people; a correction takes a second one | Decided | Staff and treasurer share no money grant, and nobody may take back a row they recorded | Product |
| Entity, retention and lending policy are data | Decided | Three per-brand tables on one mechanism, every undecided field null and named by the checks with its owner and its cost; a null bound allows, a set bound refuses, and a field marked blocking refuses a production deploy | Engineering |
| Storage is free | Decided | The obligations seam is where a fee schedule lands | Owner |
| Which product is Grade10 Finance | ❓ Open | The vault's financed lane under the lending entity, a second product on vault machinery, or something else | Owner |
| Which entity lends and which holds | ❓ Open | On a Grade10 Vault case, and on a Tiny case | Owner |
| Loan policy values | ❓ Open | Loan to value, rate band and period, term presets, offer validity, grace, an accrual ceiling, renewal | Owner |
| Hong Kong time | ❓ Open | Whether any surface leaves UTC, on screen and on the paper; the delta to the platform's dates-and-times contract comes first | Product |
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
