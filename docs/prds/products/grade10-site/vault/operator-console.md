---
title: Operator Console
spec: grade10-admin/vault/operator-queue
audience: operator
order: 5
---

The Vault section of the admin panel is a queue of cases cut by what each one
waits for, and one case opens into tabs whose buttons follow the case's
status.

- **URL** — `admin.grade10.com/vault` for the queue, `admin.grade10.com/vault/cases/<id>`
  for a case; the diary is its own section at `admin.grade10.com/appointments`,
  and each booking on its Day tab links to its case
- **Who** — staff run the flow, treasurers record money, admins hold every
  grant; the queue shows who is waiting on a person, and nobody is emailed

## The queue

| View | What it lists |
| --- | --- |
| Needs staff (default) | `submitted`, `under_valuation`, `offer_made` |
| Agreeing | `accepted`, `signing` |
| In custody | `vaulted`, `active`, `repaid` |
| Closed | `released`, `declined`, `cancelled`, `expired`, `forfeited` |
| Drafts | `draft` |
| Today | every open case whose visit falls on the shop's own day, cut where the rows are read rather than in the browser |
| Overdue | every live loan past its due date: due date, days overdue, outstanding; paged oldest first on a cursor over the payout's due date |

- **Rows** — case id, the item's name, status, lane, amount asked,
  appointment, last updated, and a badge naming why the case waits on a
  person: a release request unanswered, a submission nobody started, a
  valuation nobody has touched for **7 days**, an offer that ran out, a
  message that ran out of attempts, a document already on file under another
  account, a visit today
- **Paging** — **50** rows a page, newest-touched first, a backlog count and
  a load-more control on a keyset cursor; a page with no rows over a backlog
  says so and offers the control anyway
- **Search** — exact on phone or email, prefix on case id; a number is
  matched in its E.164 form however it was typed, and the term travels in the
  request body rather than in an address. Each search writes its own row on
  the audit chain — who searched, when, what kind of term it was and how many
  cases matched — and never the term itself. The answer is one page and says
  when more matched than were handed back
- **Money tab** (`vault:payout` only) — the position at an instant, now or
  the end of a day the operator names (principal and interest owed across
  the loans then on the book, repaid to date, in the currency the position
  itself names) and the ledger over payouts,
  repayments and corrections for a date range on the shop's own calendar,
  filtered by method, paged, with totals per method and currency; a
  correction names the row it took back
- **Held items tab** — everything in a locker, with the shop it is in, oldest
  first, paged

## One case

One line per tab, as `Surface: verb, verb, verb`.

- **Header**: back, the customer's email and phone with the WhatsApp
  click-to-chat link and six templates, set or change the contact, book,
  move or cancel the visit at every live status but a draft, the badges
  saying what this case is waiting on, and **Send again** beside a message
  that ran out of attempts
- **Case tab**: start valuation, record valuation, make or counter an offer,
  withdraw the offer, record the customer's acceptance at the counter, agree
  custody terms, decline, cancel; the timeline with the figures each money
  event carried
- **Documents tab**: record the identity check or reuse the customer's last
  one, record that the terms were explained with an optional recording
  reference, prepare documents (choosing the shop when the case has no
  booking), prepare the release, hand over as QR code and link, re-check,
  download the identity photograph (`kyc:read`)
- **Custody tab**: confirm vaulted with the shop and a locker, move the item
  to another locker, release with notes, unwind with a reason, send the
  forfeiture notice, forfeit with a reason once its cure date has passed
- **Payouts tab** (`vault:payout` only): record the payout with its bank
  reference and the date it left, record a repayment by bank transfer, cash or
  card against the quote for the date it reached us — which has to answer
  before the repayment can be sent — and take a wrong row back with a reason,
  offered only on a row this operator did not record
- **Appointments section**: add or retire a shop, weekly rules, exceptions,
  the day's offered slots and bookings, each booking opening its case

## Who may do what

| Grant | Roles | Opens |
| --- | --- | --- |
| `vault:read` | staff, treasurer, admin | cases, the contact, items, documents, what one case owes, held items, overdue loans, search |
| `vault:operate` | staff, admin | start valuation, accept, record or reuse identity, record terms explained, prepare, mint, vault, move, release, unwind, cancel, the visit, hand a parked message back to the queue |
| `vault:approve` | staff, admin | record valuation, make or withdraw an offer, decline, send the forfeiture notice, forfeit |
| `vault:payout` | treasurer, admin | payout, repayment, taking a row back, and the book: the ledger and the position |
| `kyc:read` | staff, admin | the identity photograph, each download on the audit chain |

- **Two people move money** — staff and treasurer share no money grant, a
  correction takes a second `vault:payout` holder because nobody may reverse
  their own row, and the payout is refused to whoever made the offer. `admin`
  holds both sides, so a shop of three stays operable, and the per-case guard
  is what keeps one person from pricing a loan and sending its money
- **One grant prices and forfeits** — `vault:approve` covers the valuer, the
  offer-maker and the person who forfeits
- **Second factor** — required in production and staging, optional in
  development; one verification stamps the session for **12 hours**, and no
  action asks for a fresh one
- **Every case action is filed under its case** on the audit chain, so an
  auditor pulls one case's trail by its id
- **Staff hear nothing** — no email or push to staff; the queue's badges and
  the Today and Overdue views are the signal

## The physical vault

- **Locker** — the shop is required at vaulting and the locker is optional
  free text; a move between lockers writes a movement, and everything held is
  listable with the shop it is in
- **Movements** — `in` at vaulting, `moved` on a move, `out` at release,
  unwind and forfeiture
- **Valuation** — an amount and a note; no grading company, certificate
  number, grade, condition, market reference or second valuer, and no link to
  the inventory catalogue
- **Not modelled** — a locker registry per shop, capacity, transfer between
  shops, a condition report or photograph at intake or release, damage or
  loss, a stock-take against the shelf; a forfeited item is written `out`
  because it has left custody and become the shop's own stock

:::callout{kind="note"}
Every case is the collector's own, opened from their account — in the shop on
their phone if they walked in without one. The console has no intake of its
own, so staff cannot open a case, add a sibling for a second item, edit an
item or attach a counter photograph, and every identity is keyed to a person
rather than to a case.
:::

:::callout{kind="warning"}
A borrower who arrives with cash on the due date still waits for a treasurer:
recording money needs `vault:payout`, which staff do not hold. The visit
itself is bookable on a live loan.
:::

## Specs and journeys

**Specs** — this page documents `grade10-admin/vault/operator-queue` and
`grade10-admin/vault/money-book`. The requirements are theirs; this page holds
the decision behind them.

::spec{id="grade10-admin/vault/operator-queue"}

::spec{id="grade10-admin/vault/money-book"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait, not by status | Decided | A shop asks what a case is waiting for; every status belongs to exactly one status view, and Today and Overdue are queries | Product |
| Buttons follow the machine | Decided | Each move shows only at the statuses the contract publishes, and the worker refuses independently | Engineering |
| Treasurer split | Decided | Nothing a single staff member can do moves money out of the business | Product |
| A correction takes a second money holder | Decided | `vault:payout` and never the row's own recorder; asking for the approve grant as well would have made corrections admin-only, because staff and treasurer are disjoint on money | Product |
| The book sits behind the money grant | Decided | A ledger and a position across every case are the firm's accounts; `vault:read` still sees what one case owes | Product |
| "Today" is cut where the rows are read | Decided | The shop's own day decides it, in the query rather than in the browser, so the queue and the badges beside it cannot disagree across a midnight | Engineering |
| The console never moves a visit from the diary | Decided | A case's visit is moved on the case, so the cached booking and the diary have one writer | Engineering |
| Staff see the contact; the verified name stays in the identity store | Decided | The console shows what staff set and never the legal name | Product |
| Counter intake | Decided | Every case is the collector's own account, opened in the shop if need be; the console has no intake, and no identity is keyed to a case | Product |
| The shop is on the custody row | Decided | Vaulting names the shop the item is kept at, so the held-items list answers which vault holds what | Owner |
| Valuation record | Deferred | Grading company, certificate number and grade ride the note until the inventory catalogue links; a second valuer, a condition report and counter photographs with it | Product |
| Locker registry and stock-take | Deferred | Lockers per shop with capacity, a stock-take against the shelf, damage and loss. Reopens when a shop outgrows free-text lockers | Owner |
| Forfeited stock | Decided | A forfeited item leaves custody and becomes the shop's stock; the chain keeps the figure it settled and the rest is inventory's | Owner |
| Staff notifications | Decided | The queue is the inbox: badges, Today and Overdue, and nothing emailed to staff. Revisited when a shop asks | Product |
| A case nobody is valuing | Decided | `under_valuation` badges after **7 days** untouched, derived where every other badge is | Product |
| Valuer versus approver | Decided | One grant prices, offers and forfeits; the split that matters is per case — the payout's recorder is not the offer's maker — and a separate valuing grant would over-split a shop of three | Owner |
| Paging the arrears | Decided | A keyset cursor over the payout's due date and the case id, the same idiom the ledger pages on; the ledger's own pager stays as it is | Engineering |
| Staging second factor | Decided | Required, because staging rehearses production; development stays optional so a local stack never locks an operator out | Owner |
| No-show and late | Decided | The case is the item, so a different item is a new case and this one is declined or cancelled | Product |
:::

:::detail{title="For engineers" for="engineer"}
- **Grants** — `packages/vault/contracts/src/permissions.ts` maps every admin
  procedure to its grant; `packages/grade10-auth/contracts/src/schemas.ts`
  maps roles to grants; the router's meta is pinned to both by tests, and a
  walker test pins the audit subject on every case mutation
- **Slices** —
  `packages/vault/admin-frontend/src/features/custody/{cases,valuation,compliance,settlement}`;
  pages in `apps/admin/grade10/src/pages/vault`; addresses in the panel's
  `surfaces.ts`; every wire shape, the arrears row included, is declared in
  `packages/vault/contracts`, and the console's fixture folds the contracts'
  own `needsStaffReasonsOf` rather than a copy
- **Reads** — `admin.list` pages on `(updatedAt, id)` and takes the
  `visitToday` cut; `admin.search`, `admin.overdueLoans`,
  `admin.custodyList`, `admin.moneyLedger` (with its optional `caseId`),
  `admin.financePosition`, `admin.quote`
- **Money moves** — `admin.recordPayout`, `admin.recordRepayment`,
  `admin.reverseMoney`, `admin.sendForfeitureNotice`, and
  `admin.retryNotifications` for a parked message
- **Custody** — `packages/vault/backend/src/custody/{vaulting,move,release,forfeit}.ts`;
  `closeCustody` is the one way an item leaves
- **Two-factor** — `packages/app-env/src/twoFactor.ts`
- **Architecture** —
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  and
  [the elevated-procedure ladder](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
:::
