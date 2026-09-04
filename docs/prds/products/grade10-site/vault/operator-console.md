---
title: Operator Console
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
| Today | every open case whose visit falls on the worker's own day, cut where the rows are read rather than in the browser |
| Overdue | every live loan past its due date: due date, days overdue, outstanding |

- **Rows** — case id, the item's name, status, lane, amount asked,
  appointment, last updated, and a badge naming why the case waits on a
  person: a release request unanswered, a submission nobody started, an offer
  that ran out, a message that ran out of attempts, a document already on
  file under another account, a visit today
- **Paging** — **50** rows a page, newest-touched first, a backlog count and
  a load-more control on a keyset cursor; a page with no rows over a backlog
  says so and offers the control anyway
- **Search** — exact on phone or email, prefix on case id; a number is
  matched in its E.164 form however it was typed, the term travels in the
  request body rather than in an address, and it stays out of the audit
  chain. The answer is one page and says when more matched than were handed
  back
- **Money tab** (`vault:payout` only) — the position at this instant
  (principal and interest owed across live loans, repaid to date, in the
  currency the position itself names) and the ledger over payouts,
  repayments and corrections for a UTC date range, filtered by method,
  paged, with totals
- **Held items tab** — everything in a locker, oldest first, paged

## One case

One line per tab, as `Surface: verb, verb, verb`.

- **Header**: back, the customer's email and phone with the WhatsApp
  click-to-chat link and six templates, set or change the contact, book,
  move or cancel the visit while the case is `submitted`, `vaulted`, `active`
  or `repaid`, the badges saying what this case is waiting on, and **Send
  again** beside a message that ran out of attempts
- **Case tab**: start valuation, record valuation, make or counter an offer,
  withdraw the offer, customer accepts, agree custody terms, decline, cancel;
  the timeline with the figures each money event carried
- **Documents tab**: record the identity check or reuse the customer's last
  one, prepare documents (choosing the shop when the case has no booking),
  prepare the release, hand over as QR code and link, re-check, download the
  identity photograph (`kyc:read`)
- **Custody tab**: confirm vaulted with a locker, move the item to another
  locker, release with notes, unwind with a reason, forfeit with a reason
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
| `vault:operate` | staff, admin | start valuation, accept, record or reuse identity, prepare, mint, vault, move, release, unwind, cancel, the visit, hand a parked message back to the queue |
| `vault:approve` | staff, admin | record valuation, make or withdraw an offer, decline, forfeit |
| `vault:payout` | treasurer, admin | payout, repayment, taking a row back, and the book: the ledger and the position |
| `kyc:read` | staff, admin | the identity photograph, each download on the audit chain |

- **Two people move money** — staff and treasurer share no money grant, and a
  correction takes a second `vault:payout` holder because nobody may reverse
  their own row; `admin` holds both sides, so one admin can value, offer,
  accept, vault and pay out alone (whether that stands, and whether a payout
  takes a fresh factor, are open on
  [Loan and Money](/p/grade10-site/vault/loan-and-money))
- **One grant prices and forfeits** — `vault:approve` covers the valuer, the
  offer-maker and the person who forfeits
- **Second factor** — required in production, optional in staging and
  development; one verification stamps the session for **12 hours**, and no
  action asks for a fresh one
- **Every case action is filed under its case** on the audit chain, so an
  auditor pulls one case's trail by its id
- **Staff hear nothing** — no email or push to staff; the queue's badges and
  the Today and Overdue views are the signal

## The physical vault

- **Locker** — optional free text on confirm vaulted; a move between lockers
  writes a movement, and everything held is listable
- **Movements** — `in` at vaulting, `moved` on a move, `out` at release,
  unwind and forfeiture
- **Valuation** — an amount and a note; no grading company, certificate
  number, grade, condition, market reference or second valuer, and no link to
  the inventory catalogue
- **Not modelled** — a locker registry per shop, capacity, transfer between
  shops, a condition report or photograph at intake or release, damage or
  loss, a stock-take against the shelf, a declared value per locker for the
  insurer; a forfeited item is written `out` while it stays in the shop

:::callout{kind="warning"}
A walk-in cannot be served from the console. The admin router has no intake:
staff cannot open a case, add a sibling case for a second item, edit an item,
or attach a counter photograph. Every customer signs up on their own phone and
runs the wizard once per item before staff can start, and the identity of a
customer with no account is keyed to the case rather than to a person.
:::

:::callout{kind="warning"}
A borrower who arrives with cash on the due date still waits for a treasurer:
recording money needs `vault:payout`, which staff do not hold. The visit
itself is bookable on a live loan.
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait, not by status | Decided | A shop asks what a case is waiting for; every status belongs to exactly one status view, and Today and Overdue are queries | Product |
| Buttons follow the machine | Decided | Each move shows only at the statuses the contract publishes, and the worker refuses independently | Engineering |
| Treasurer split | Decided | Nothing a single staff member can do moves money out of the business | Product |
| A correction takes a second money holder | Decided | `vault:payout` and never the row's own recorder; asking for the approve grant as well would have made corrections admin-only, because staff and treasurer are disjoint on money | Product |
| The book sits behind the money grant | Decided | A ledger and a position across every case are the firm's accounts; `vault:read` still sees what one case owes | Product |
| "Today" is cut where the rows are read | Decided | The worker's clock decides the day, so the queue and the badges beside it cannot disagree across UTC midnight | Engineering |
| The console never moves a visit from the diary | Decided | A case's visit is moved on the case, so the cached booking and the diary have one writer | Engineering |
| Staff see the contact; the verified name stays in the identity store | Decided | The console shows what staff set and never the legal name | Product |
| Counter intake | ❓ Open | Open a case for a walk-in, add a sibling, edit the item, attach a photograph; the draft cap keys on the account | Product |
| Valuation record | ❓ Open | Grading company and certificate number, grade, condition, market reference and source, second valuer, counter photographs | Product |
| Locker registry and stock-take | ❓ Open | Lockers per shop with capacity, a stock-take against the shelf, condition and photograph at in and out, damage and loss, a declared value per locker. The custody row names a locker and no shop, and a packet can be prepared without one, so nothing can be asked which vault holds what | Owner |
| Forfeited stock | ❓ Open | Whether a forfeited item stays visible as shop-owned stock; today it leaves the custody record | Owner |
| Staff notifications | ❓ Open | Email or push on submission, booking and release request beyond the queue's badges | Product |
| Valuer versus approver | ❓ Open | A separate valuing grant; a guard that the payout recorder is not the offer-maker | Owner |
| A case nobody is valuing | ❓ Open | A submission badges the moment it lands, and a case left in `under_valuation` badges nothing however long it sits; how many days is too many | Product |
| Paging the arrears and stepping back | ❓ Open | The arrears list answers one page and offers no cursor, and the ledger's pager steps older and back to newest with nothing in between | Engineering |
| Staging second factor | ❓ Open | Optional today against the compliance plan; the decision changes three documents | Owner |
| No-show and late | ❓ Open | A different item brought cannot be corrected on the case | Product |
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
  `admin.reverseMoney`, and `admin.retryNotifications` for a parked message
- **Custody** — `packages/vault/backend/src/custody/{vaulting,move,release,forfeit}.ts`;
  `closeCustody` is the one way an item leaves
- **Two-factor** — `packages/app-env/src/twoFactor.ts`
- **Architecture** —
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  and
  [the elevated-procedure ladder](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
:::
