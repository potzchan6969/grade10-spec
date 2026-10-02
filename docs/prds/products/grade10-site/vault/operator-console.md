---
title: Operator Console
spec: grade10-admin/vault/operator-queue
audience: operator
order: 5
---

The Vault section of the admin panel is a queue of cases cut by what each one
waits for, and one case opens into tabs whose buttons follow the case's status.

- **URL** — `admin.grade10.com/vault` for the queue, `admin.grade10.com/vault/cases/<id>`
  for a case; the diary is its own section at `admin.grade10.com/appointments`
- **Who** — staff run the flow, treasurers record money, admins hold every
  grant; the queue shows who is waiting on a person, and nobody is emailed

## Queue

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
  valuation untouched for **7 days**, an offer that ran out, a parked
  message, a document seen under another account, a visit today
- **Paging** — **50** rows a page, newest-touched first, a backlog count and
  a load-more control on a keyset cursor
- **Search** — exact on phone or email, prefix on case id; a number is
  matched in E.164 however typed; each search writes who, when, what kind of
  term and how many matched on the audit chain, never the term itself
- **Full-width or a bare 852** — a number typed either way is found as the
  one stored
- **Money tab** (`vault:payout` only) — the position at an instant, now or
  the end of a day the operator names, and the ledger over payouts,
  repayments and corrections for a date range on the shop's calendar,
  filtered by method, paged, with totals per method and currency
- **Held items tab** — everything in a locker, with its shop, oldest first, paged
- **Counts and today** — every view carries its count; the landing view
  opens on a Today block that is the Today cut itself, in slot order with its
  count; rows show the lane and read the collector's word for the status
- **Search by reference** — prefix on the six-character case reference,
  so the characters a customer reads out at the counter find the case
- **Overdue, at a glance** — three tiles: the view's count, outstanding
  in arrears, how many carry no notice; rows name the case reference, the
  item, the contact the case holds, the notice and the last reminder sent —
  no name, which stays on the case behind the identity grant
- **Money tab, more** — a filter by kind; the net out of the business —
  payouts less repayments, per currency, a correction netting the row it took
  back once, positive when money is out; a takes-back column naming that row;
  a CSV of the range as filtered, bounded to what the ledger pages and on the
  audit chain like a search — who, when, the filter, how many rows
- **Held items, at a glance** — tiles: in the vault, per shop, with a loan
  running, waiting for a pickup; rows carry held since, days held, status,
  outstanding and whether a pickup is booked
- **Collector by name** — rows name each case's collector for staff and
  admins, never a treasurer
- **Narrow by collector** — a click on the name shows only that
  collector's cases; a link beside it opens their
  [Collector Page](/p/grade10-admin/console/collector-page)
- **Which name reads are recorded** — a page of names and a list narrowed
  to one collector each write an entry on the audit chain, as a search and a
  collector page do; a list that names nobody writes none
- **Walk-ins** — staff open a draft for a customer at the counter under
  the customer's own account; nothing about the case is emailed; the customer
  asks for their own sign-in link on their phone at `grade10.com/vault`,
  finds the draft on their list and sends it with the wizard's third step;
  staff type no name, and an account the walk-in creates reads by its email
  handle until the customer names themselves
- **An address signed in to before** — a walk-in is refused when the
  address belongs to an account someone has signed in to
- **An address that is not an email address** — refused beside the
  address field before anything is sent, so staff check it with the customer
- 🚧 **A loan of zero** — refused beside the loan field before anything is
  sent; a loan asks for more than zero, or the case is storage only
- **The statement first** — the counter shows the collection statement
  before staff type the address, and the open keeps the version shown; in
  production the open is refused while the statement is unwritten, so the
  walk-in is dark in production until Legal's statement lands —
  [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness#before-the-first-production-case)
- 🚧 **A slab the register knows** - at a walk-in, staff type the grader and
  cert and the case takes the item the register knows, its facts filled in -
  [Items](/p/grade10-admin/inventory/items#facts)

## One case

- **Header**: back, the customer's email and phone with the WhatsApp
  click-to-chat link and six templates, set or change the contact, book, move
  or cancel the visit at every live status but a draft, the badges saying
  what this case is waiting on, and **Send again** beside a parked message
- **Case tab**: start valuation, record valuation, make or counter an offer,
  withdraw the offer, record the customer's acceptance at the counter, agree
  custody terms, decline, cancel; the timeline with each money event's figures
- **Documents tab**: record the identity check or reuse the customer's last
  one, record that the terms were explained, prepare documents (choosing the
  shop when the case has no booking), prepare the release, hand over as QR
  code and link, re-check, download the identity photograph (`kyc:read`)
- **Custody tab**: confirm vaulted with the shop and a locker, move the item
  to another locker, release with notes, unwind with a reason, send the
  forfeiture notice, forfeit with a reason once its cure date has passed
- **Payouts tab** (`vault:payout` only): record the payout with its bank
  reference and the date it left, record a repayment against the quote for
  the date it reached us, and take a wrong row back with a reason, offered
  only on a row this operator did not record
- **Appointments section**: add or retire a shop, weekly rules, exceptions,
  the day's offered slots and bookings, each booking opening its case
- **The collector's cases** — a link in the header opens the case's
  [Collector Page](/p/grade10-admin/console/collector-page), for any
  `vault:read` holder
- **Today's visit, in order** — the Case tab opens on the counter's steps
  for this visit as an ordered checklist, each ticked as its act lands, and
  says why an act is not offered yet
- **Key terms** — the Documents tab ticks the loan agreement's own terms —
  [Documents and Signing](/p/grade10-site/vault/documents-and-signing#document-terms)
- **The identity panel** — six states, Verified, Out, Stalled, Refused,
  Lapsed and None — [Identity Check](/p/grade10-site/vault/identity-check#identity-states)
- **Forfeit, withheld in words** — the Custody tab says why Forfeit is
  not offered yet — not before the cure date, the notice sent on which day —
  beside what the collector was told
- **Before the act** — the make-offer, vault and payout dialogs state the
  rule before the operator sends — [Loan and Money](/p/grade10-site/vault/loan-and-money#records)
- 🚧 **The item's facts** — the Case tab shows and edits the register's
  category, title, description, grader, grade and cert once it has the item,
  which it gets when the valuation starts, and says registration is pending
  until then; the collector's request stays as they sent it; editing needs
  `inventory:write` —
  [Items](/p/grade10-admin/inventory/items#facts)

## Permissions

| Grant | Roles | Opens |
| --- | --- | --- |
| `vault:read` | staff, treasurer, admin | cases, the contact, items, documents, what one case owes, held items, overdue loans, search |
| `vault:operate` | staff, admin | start valuation, accept, record or reuse identity, record terms explained, prepare, mint, vault, move, release, unwind, cancel, the visit, hand a parked message back to the queue |
| `vault:approve` | staff, admin | record valuation, make or withdraw an offer, decline, send the forfeiture notice, forfeit |
| `vault:payout` | treasurer, admin | payout, repayment, taking a row back, and the book: the ledger and the position |
| `kyc:read` | staff, admin | the identity photograph, each download on the audit chain |

- **Walk-ins and names** — `vault:operate` also opens a walk-in;
  `kyc:read` also opens collector names on the queue, held items and
  collector page; a treasurer sees none

- **Two people move money** — staff and treasurer share no money grant, a
  correction takes a second `vault:payout` holder, and the payout is refused
  to whoever made the offer; `admin` holds both sides so a shop of three
  stays operable
- **Cash at the counter** — a borrower with cash on the due date still waits
  for a treasurer, because recording money needs `vault:payout`
- **One grant prices and forfeits** — `vault:approve` covers the valuer, the
  offer-maker and the person who forfeits
- **Second factor** — required in production only, for every brand;
  optional in staging and development; one verification stamps the session
  for **12 hours**
- **Every case action is filed under its case** on the audit chain
- **Staff hear nothing** — no email or push to staff; the queue's badges and
  the Today and Overdue views are the signal

## Physical vault

- **Locker** — the shop is required at vaulting and the locker is optional
  free text; a move between lockers writes a movement
- **Movements** — `in` at vaulting, `moved` on a move, `out` at release,
  unwind and forfeiture
- 🚧 **Valuation** — an amount and a note, read beside the item's grader,
  grade and cert; no condition, market reference or second valuer
- **Not modelled** — a locker registry per shop, capacity, transfer between
  shops, a condition report, damage or loss, a stock-take against the shelf;
  a forfeited item is written `out` because it has become the shop's stock

## Specs and journeys

::spec{id="grade10-admin/vault/operator-queue"}

::spec{id="grade10-admin/vault/money-book"}

:::detail{title="Code map" for="engineer"}
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

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait, not by status | Decided | A shop asks what a case is waiting for; every status belongs to exactly one status view, and Today and Overdue are queries | Product |
| Buttons follow the machine | Decided | Each move shows only at the statuses the contract publishes, and the worker refuses independently | Engineering |
| The rule is shown before the refusal | Decided | The make-offer, vault and payout dialogs state the bound, the precondition and what the recording fixes before the operator sends; the worker's refusal stands unchanged behind them | Product |
| The counter works a checklist | Decided | The Case tab opens on the visit's steps in order, and Forfeit is withheld with its reason in words rather than drawn as a stepper, because a shop of three learns the flow from the screen rather than from a manual | Product |
| Treasurer split | Decided | Nothing a single staff member can do moves money out of the business | Product |
| A correction takes a second money holder | Decided | `vault:payout` and never the row's own recorder; asking for the approve grant as well would have made corrections admin-only, because staff and treasurer are disjoint on money | Product |
| The book sits behind the money grant | Decided | A ledger and a position across every case are the firm's accounts; `vault:read` still sees what one case owes | Product |
| The book exports | Decided | A CSV of the ledger as filtered, bounded to what the ledger pages and on the audit chain like a search, with a net-out figure and a takes-back column, so the controller ties the range to the statement in a spreadsheet; double entry stays the firm's accounting system's | Finance |
| "Today" is cut where the rows are read | Decided | The shop's own day decides it, in the query rather than in the browser, so the queue and the badges beside it cannot disagree across a midnight | Engineering |
| The console never moves a visit from the diary | Decided | A case's visit is moved on the case, so the cached booking and the diary have one writer | Engineering |
| Staff see the contact; the verified name stays in the KYC service | Decided | The console shows what staff set and never the legal name | Product |
| Collector by name | Decided | Queue and held-item rows show the collector's account name to staff and admins under the identity grant; a treasurer and the arrears row keep what they read today | Owner |
| No search by name | Decided | A collector is found by an exact contact, the case reference or a click on their name; a name search would let staff walk the customer list | Owner |
| The identity panel reads the record's six states | Decided | Verified, Out, Stalled, Refused, Lapsed and None, as [Identity Check](/p/grade10-site/vault/identity-check#identity-states) defines them; the provider's finer states fold into them, because an operator arranging a visit needs the difference between out and none, not the provider's stage | Product |
| Counter intake | Decided | Staff open a draft for a customer at the counter, under the customer's own account, with staff's photos, and no email is sent; the customer sends it from their own phone with the wizard's third step, ticking the collection statement, before it is valued or any email is sent. A mistyped address is cancelled and opened again. No identity is keyed to a case | Owner |
| Signed-in customers at the counter | Decided | Refused: a typed address does not prove the account is theirs, so that customer sends the request from their own phone with staff beside them | Owner |
| Walk-ins open under `vault:operate`, names read under `kyc:read` | Decided | Opening a case at the counter is an operate act; collector names sit behind the identity grant, and every read that names a person — the names on a page, one collector's cases, a collector's page — is on the audit chain | Product |
| When a walk-in reads the collection statement | Decided | The counter shows the collection statement before staff type the address, and the open keeps the version shown; the tick on the customer's phone is their record. In production the open refuses while the statement is unwritten | Legal |
| Stock-take sheet and Send notice from arrears | Decided | Neither; the notice stays an act on the case, and a shelf count reads the held-items list until the stock-take | Product |
| The shop is on the custody row | Decided | Vaulting names the shop the item is kept at, so the held-items list answers which vault holds what | Owner |
| Grader, grade and cert on a valuation | Decided | Read from the item register beside the amount and the note — [Items](/p/grade10-admin/inventory/items#facts) | Owner |
| Valuation record | Deferred | A second valuer, a condition report and counter photographs | Product |
| Locker registry and stock-take | Deferred | Lockers per shop with capacity, a stock-take against the shelf, damage and loss. Reopens when a shop outgrows free-text lockers | Owner |
| Forfeited stock | Decided | A forfeited item leaves custody, written `out`, and is held as the shop's stock; the chain keeps the figure it settled and the rest is inventory's. It is not sold before Legal names the lending regime — [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness) | Owner |
| Staff notifications | Decided | The queue is the inbox: badges, counts, Today and Overdue, and nothing emailed to staff. Revisited when a shop asks | Product |
| A case nobody is valuing | Decided | `under_valuation` badges after **7 days** untouched, derived where every other badge is | Product |
| Valuer versus approver | Decided | One grant prices, offers and forfeits; the split that matters is per case — the payout's recorder is not the offer's maker — and a separate valuing grant would over-split a shop of three | Owner |
| Paging the arrears | Decided | A keyset cursor over the payout's due date and the case id, the same idiom the ledger pages on; the ledger's own pager stays as it is | Engineering |
| Who recorded a ledger row | Decided | The ledger prints the recorder's name, read by its own query from the account the row names under the money grant, on the audit chain with the read; never the auth directory, which asks for `user:list` and a live second factor a treasurer does not hold. Not the first eight characters of the account id: a controller ties a row to a person, and a handle names nobody | Owner |
| The page a list pages on | Decided | **50** rows a page, at most **200** a call | Product |
| Second factor | Decided | Required in production only, for every brand — a platform-wide rule, not a per-brand one; staging and development stay optional so a rehearsal or a local stack never locks an operator out | Owner |
| No-show and late | Decided | The case is the item, so a different item is a new case and this one is declined or cancelled | Product |
:::
