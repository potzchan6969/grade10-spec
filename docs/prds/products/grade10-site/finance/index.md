---
title: Finance
icon: bank
---

Grade10 Finance is a loan against a graded card: a collector submits the card
online, books a shop visit, staff value it and sign with them on an iPad, and
the card sits in the shop's vault until the loan is repaid. The card is really
in a locker and the money is really a bank transfer somebody made.

- **The product** — a loan against graded cards at **~40%** loan to value and
  **1.5% to 2.5%** interest per **30 days**, announced for **Q4 2026**; the
  owner's notes are [Grade10 Finance](/references/grade10-finance)
- **One case, one card** — the loan runs on a vault case that holds the
  collateral, decided at intake by the financing amount the collector asks for
  - 🚧 **Keeping a Card Without a Loan** — a free deposit, no longer a case's
    storage lane - [Vault](/p/grade10-site/vault)
- **Two entities** — the custodian holds the card and the lender lends against
  it; each prints on its own paper, and only the lender's carries a licence
- **Where** — `admin.grade10.com/vault` for the shop and
  `grade10.com/vault/sign#<token>` for the iPad; one host and a path per
  surface, and a vanity domain redirects to it
- **The collector's address** — mailed links keep `grade10.com/vault/cases/<id>`,
  which lands on the not-found surface until the collector's screens ship —
  [Collector Pages](/p/grade10-site/finance/collector-pages#messages)
- **Money** — the brand's currency in whole cents, recorded by a person after
  the bank moved it and against the date it moved; a payout takes two people,
  and a correction takes a second holder of the money grant
- **Paper** — three one-page English documents sealed in-house, anchored in a
  hash chain, naming the shop and the entity whose paper it is
- **Dates** — an instant is UTC everywhere; a calendar day is the brand's own
  zone, `Asia/Hong_Kong`, so a due date, a dated page and the day's queue are
  the day the shop is standing on ([[shared/dates-and-times]])
- **Specs** — `openspec/specs/grade10-site/vault` and, for the operator's
  surfaces, `openspec/specs/grade10-admin/vault`; each page names the ones it
  documents

| Page | What it holds |
| --- | --- |
| [Collector Pages](/p/grade10-site/finance/collector-pages) | What a collector does on their own case, and what they hear |
| [Case Lifecycle](/p/grade10-site/finance/case-lifecycle) | The fourteen statuses, the timers, the exits |
| [Loan and Money](/p/grade10-site/finance/loan-and-money) | The arithmetic, the policy the brand lends under, the money records and corrections, the ledger |
| [Documents and Signing](/p/grade10-site/finance/documents-and-signing) | The three documents, the ceremony, consent, copies, verification |
| [Identity Check](/p/grade10-site/finance/identity-check) | The identity a case is signed under, checked at the counter |
| [Operator Console](/p/grade10-site/finance/operator-console) | The queue and its views, one case's tabs, grants, the physical vault |
| [Compliance and Readiness](/p/grade10-site/finance/compliance-and-readiness) | Identity, retention, evidence, the checklist before the first production case, what counsel supplies |

## Where It Is Open

- **Not open to the public yet** — the case's one site page, the signing
  ceremony, is carried in development and staging, and on no lane the public
  reaches — [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Users

- **Collectors** — open a request, photograph the card, book the visit,
  accept or decline the offer, sign on the shop's iPad, watch the case, ask
  for the card back, cancel before the card is in custody
- **Shop staff** — work the queue at the counter: value, offer, record that
  the terms were explained, record or reuse the identity check, prepare and
  hand over documents, vault, move, release, cancel, send the forfeiture
  notice and forfeit
- **Treasurers** — record money and nothing else: the payout, each
  repayment, and with an approver's grant a correction
- **Admins** — everything, including both sides of the money split

## Owner's flow and gaps

| Step | Built | Gap |
| --- | --- | --- |
| Sign in with Google or a magic link | yes | — |
| Verify the phone by SMS | no; the number is stored in E.164 and confirmed by nothing | an SMS provider and a verified-phone fact |
| Submit photos, amount, items | the vault wizard, one item per case | a multi-card request is several requests, with one visit booked on the first |
| Preliminary authentication and valuation | staff valuation on the case, capped at the brand's **40%** of it | — |
| e-KYC at the request step | no; identity is checked at the counter by staff | online capture, a hosted provider, screening |
| The offer and contact on WhatsApp | an offer email the collector answers from their own case page, and a click-to-chat link staff press | no WhatsApp Business API, no inbound channel |
| Choose the custodian, Grade10 Vault or Tiny | no; the item is held at the shop the case names | a second custodian entity, its own agreement and its own staff |
| Book a time slot | the diary, at every live status but a draft | — |
| Visit, e-KYC, inspection | yes | — |
| Recorded call explaining key terms | the counter records that the terms were explained, with a recording reference where there is one, before the loan packet may be prepared | telephony and the storage of the recording itself |
| Both sign, staff from the admin and the user on the iPad or their own account | the borrower signs; the agreement states the lender executes it on the advance | a staff signer role and its ceremony leg |
| Manual FPS payout with proof recorded | a payout record with a required bank reference and the date the money left, correctable by a second money holder | — |
| Repayment recorded manually | yes | — |
| Automated reminders | **7** and **1** days before the due date, then every **7** days overdue, by email | a channel beyond email |

:::detail{title="Design record" for="engineer"}
- [Vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  — the case machine, the lanes, the vocabulary and the decisions
- [Document-handling compliance audit](https://github.com/9gag/grade10/blob/main/docs/qa/vault.md)
  — read as of its date; the checklist is current
- [Production-readiness review](https://github.com/9gag/grade10/blob/main/docs/qa/vault-production-review.md)
  — vault, doc-sign and auth together
- **Platform pages** — [Vault Custody](/platform/vault-custody),
  [Admin Access Control](/platform/admin-access),
  [Account Data](/platform/account-data)
:::

:::detail{title="Code map" for="engineer"}
- **The lane** — `packages/vault/{contracts,backend,frontend,admin-frontend}`;
  the financing amount at intake is the lane, and every guard reads it off the
  case
- **The entity** — `packages/app-env/src/legalIdentity.ts` carries both
  parties; `documents/legalEntity.ts` answers which one a document prints
- **The policy** — `packages/app-env/src/lending.ts`, seeded for grade10
- **Background** —
  [vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  for the case machine and the two lanes, and
  [account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
  for the isolation and ledger policy
:::

:::detail{title="Product decisions" for="pm"}
The loan turns a collector's graded card into cash without a sale, and gives
the shop a lending product secured on a card it already holds and has valued.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Wants cash against a card without selling it | Knows the offer, the total and the cost of lateness before the visit, is told the due date in writing when the money reaches them, and gets the card back on repayment |
| Shop staff | A customer at the counter | Finds the person, values the card, agrees terms, signs and vaults in one visit |
| Treasurer | Money moved at the bank | Writes it down once, against the right case and the right date, and can take a wrong row back |
| Controller | Month end | Lists every payout, repayment and correction in the period and ties them to the statement |
| Compliance | An inspection or a dispute | Produces the paper, the consent, the identity and the chain for one case by its id |

**Not in scope.** Automated payments in either direction; an external
e-signature vendor; online identity verification; a second custodian;
multi-card cases; renewing a live loan.

**Measurement.** On [Analytics](/p/grade10-site/analytics#vault).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One case is one card | Decided | Siblings are separate cases booked on the lead case | Product |
| A payout takes two people; a correction takes a second one | Decided | Staff and treasurer share no money grant, and nobody may take back a row they recorded | Product |
| Entity, retention and lending policy are data | Decided | Three per-brand tables on one mechanism, every undecided field named by the checks with its owner and its cost; a field marked blocking refuses a production deploy | Engineering |
| Lending policy is seeded from the owner's numbers | Decided | Loan to value, the rate band per 30 days, term presets and offer validity in one per-brand table; in production a null bound refuses the offer, never the deploy | Owner |
| Keeping without a loan moves to the vault | Decided | A card kept without a loan is a free vault deposit that can earn and be consigned, rather than a case's storage lane - [Vault](/p/grade10-site/vault) | Owner |
| Finance is the vault's financed lane | Decided | The owner's notes describe the vault's flow step for step, and the collateral is the item the vault itself holds; a second service would be a second copy of one product | Owner |
| Two entities, one table | Decided | The custodian holds and the lender lends, each printing on its own paper; the lender's name refuses an offer in production, so custody opens while the lender is still being registered | Legal |
| Host | Decided | One host and a path, `grade10.com/vault`; a vanity domain redirects, because a second host would not share the session cookie | Owner |
| A second custodian | Deferred | Tiny holding items under its own name, agreement and staff. Reopens with a signed custody contract | Owner |
| Online e-KYC at the request step | Deferred | The counter check stands. Reopens when Legal names a duty that the counter cannot meet | Legal |
| The recorded call | Decided | The counter records that the key terms were explained and the borrower signs a line saying so; the telephony and the recording's storage are a vendor's, and no packet is prepared without the record | Owner |
| The book | Decided | Single entry with derived balances is the product's book; double entry is the general ledger, kept in the firm's accounting system from a ledger export | Finance |
:::
