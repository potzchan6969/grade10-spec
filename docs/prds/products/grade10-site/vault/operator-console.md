---
title: Operator Console
audience: operator
order: 5
---

The Vault section of the admin panel is a queue of cases cut by what each one
waits for, and one case opens into tabs whose buttons follow the case's
status.

- **URL** — `admin.grade10.com/vault` for the queue,
  `admin.grade10.com/vault/cases/<id>` for a case; the diary is its own
  section at `admin.grade10.com/appointments`
- **Who** — staff run the flow, treasurers record money, admins hold every
  grant; nobody is told anything by the system

## The queue

| Filter | Statuses |
| --- | --- |
| Needs staff (default) | `submitted`, `under_valuation`, `offer_made` |
| Agreeing | `accepted`, `signing` |
| In custody | `vaulted`, `active`, `repaid` |
| Closed | `released`, `declined`, `cancelled`, `expired`, `forfeited` |
| Drafts | `draft` |

- **Rows** — case id, status, lane, amount asked, appointment, last updated;
  **50** rows, newest-touched first, no paging, no sort, no search
- **No customer on a row or a case** — the wire carries a phone and nothing
  else about the person; the verified name stays in the identity store by
  design, so "Mrs Chan on the phone" has to know her case id
- **No today, no overdue** — the diary's Day tab lists bookings with an
  unlinked case reference; the overdue-loan worklist is computed by the worker
  and read by no screen

## One case

One line per tab, as `Surface: verb, verb, verb`.

- **Header**: back, photos, six WhatsApp templates as click-to-chat links, set
  or change the number, book, move or cancel the visit while the case is
  `submitted`, `vaulted` or `repaid`
- **Case tab**: start valuation, record valuation, make or counter an offer,
  withdraw the offer, customer accepts, agree custody terms, decline, cancel;
  the timeline
- **Documents tab**: record the identity check, prepare documents, prepare the
  release, hand over as QR code and link, re-check, download the identity
  photograph (`kyc:read`)
- **Custody tab**: confirm vaulted with a locker as free text, release with
  notes, unwind with a reason, forfeit with a reason
- **Payouts tab** (`vault:payout` only): record the payout, record a
  repayment by bank transfer, cash or card against the quoted balance
- **Appointments section**: add or retire a shop, weekly rules, exceptions,
  the day's offered slots and bookings, read only

## Who may do what

| Grant | Roles | Opens |
| --- | --- | --- |
| `vault:read` | staff, treasurer, admin | cases, items, documents, what is owed |
| `vault:operate` | staff, admin | start valuation, accept, record identity, prepare, mint, vault, release, unwind, cancel, the visit |
| `vault:approve` | staff, admin | record valuation, make or withdraw an offer, decline, forfeit |
| `vault:payout` | treasurer, admin | payout, repayment |
| `kyc:read` | staff, admin | the identity photograph, each download on the audit chain |

- **Two people move money** — staff and treasurer share no money grant;
  `admin` holds both sides, so one admin can value, offer, accept, vault and
  pay out alone
- **One grant prices and forfeits** — `vault:approve` covers the valuer, the
  offer-maker and the person who forfeits
- **Second factor** — required in production, optional in staging and
  development; one verification stamps the session for **12 hours**, and no
  action asks for a fresh one
- **Staff hear nothing** — no email or push to staff for a new submission, a
  booking or a release request; the collector's ask is a row in the case's
  timeline

## The physical vault

- **Locker** — optional free text on confirm vaulted; unrecorded is a valid
  state
- **Movements** — `in` at vaulting, `out` at release, unwind and forfeiture;
  `moved` is in the vocabulary and nothing writes it
- **Valuation** — an amount and a note; no grading company, certificate
  number, grade, condition, market reference or second valuer, and no link to
  the inventory catalogue
- **Not modelled** — a locker registry per shop, capacity, transfer between
  shops, a condition report or photograph at intake or release, damage or
  loss, a stock-take of open custody rows against the shelf, a declared value
  per locker for the insurer; a forfeited item is written `out` while it stays
  in the shop

:::callout{kind="warning"}
A walk-in cannot be served from the console. The admin router has no intake:
staff cannot open a case, add a sibling case for a second item, edit an item,
or attach a counter photograph. Every customer signs up on their own phone and
runs the wizard once per item before staff can start, and the identity of a
customer with no account is keyed to the case rather than to a person.
:::

:::callout{kind="warning"}
Repay-and-collect in one visit is impossible as built. An `active` case cannot
be booked, a cash repayment needs `vault:payout`, which staff do not hold, and
release needs `repaid`; a borrower arriving on the due date with cash waits for
a treasurer. Preparing documents before the visit is worse: the packet expires
after 24 hours and the sweep cancels the case.
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Queue by wait, not by status | Decided | A shop asks what a case is waiting for; every status belongs to exactly one filter | Product |
| Buttons follow the machine | Decided | Each move shows only at the statuses the contract publishes, and the worker refuses independently | Engineering |
| Treasurer split | Decided | Nothing a single staff member can do moves money out of the business | Product |
| The console never moves a visit from the diary | Decided | A case's visit is moved on the case, so the cached booking and the diary have one writer | Engineering |
| Customer on the case | ❓ Open | A staff-audience contact snapshot (name, email, phone) and search by phone, email or case id; nothing today | Product |
| Paging and sort | ❓ Open | A cursor over the queue, sort by appointment or due date; **50** rows today | Engineering |
| Today and overdue | ❓ Open | Two views fed by the appointment cache and the worklist the worker already computes; a diary row that links to its case | Product |
| Counter intake | ❓ Open | Open a case for a walk-in, add a sibling, edit the item, attach a photograph | Product |
| Valuation record | ❓ Open | Grading company and certificate number, grade, condition, market reference and source, second valuer, counter photographs | Product |
| Locker registry and stock-take | ❓ Open | Lockers per shop with capacity, a move procedure, a custody list to reconcile against the shelf, condition and photograph at in and out, damage and loss, a declared value per locker | Owner |
| Forfeited stock | ❓ Open | Whether a forfeited item stays visible as shop-owned stock; today it leaves the custody record | Owner |
| Staff notifications | ❓ Open | Email or push on submission, booking and release request; a "waiting on staff" signal for custody cases | Product |
| Valuer versus approver | ❓ Open | A `vault:value` grant split from `vault:approve`; a guard that the payout recorder is not the offer-maker | Owner |
| Admin records money | ❓ Open | Whether `admin` may hold both sides of the split | Owner |
| Fresh challenge on payout | ❓ Open | A second factor per payout, or the **12-hour** stamp | Owner |
| Staging second factor | ❓ Open | Optional today; the security architecture doc and the compliance checklist say required | Engineering |
| Identity reuse | ❓ Open | Offer the last verified check for a returning customer; the store answers it and the console never asks | Product |
| No-show and late | ❓ Open | A no-show ends the case as expired with the draft's wording; a different item brought cannot be corrected on the case | Product |
:::

:::detail{title="For engineers" for="engineer"}
- **Grants** — `packages/vault/contracts/src/permissions.ts` maps every admin
  procedure to its grant; `packages/grade10-auth/contracts/src/schemas.ts`
  maps roles to grants; the router's meta is pinned to both by tests
- **Slices** —
  `packages/vault/admin-frontend/src/features/custody/{cases,valuation,compliance,settlement}`;
  pages in `apps/admin/grade10/src/pages/vault`; addresses in the panel's
  `surfaces.ts`
- **Worklist** — `admin.retentionReview` returns retention reviews, unset
  classes and overdue loans; its comment says console wiring is a follow-up
- **Custody** — `packages/vault/backend/src/custody/{vaulting,release,forfeit}.ts`
  and `db/schema/custody.ts`; `closeCustody` is the one way an item leaves
- **Two-factor** — `packages/app-env/src/twoFactor.ts`;
  `docs/architecture/security.md` still says staging is required
- **Architecture** —
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  and
  [the elevated-procedure ladder](https://github.com/9gag/grade10/blob/main/docs/architecture/security.md)
:::
