---
title: Loan and Money
order: 3
---

A loan is an accepted offer paid out against an item in the locker, and every
amount on it is a whole number of cents recorded by a person after the bank
moved the money. Nothing here moves money; it writes down that money moved,
and when.

- **Currency** — the brand's (HKD for Grade10), checked at intake, one per
  case, never changed
- **An offer** — principal, interest for the whole term in basis points, a
  term in days, an expiry; principal at most the latest valuation, and within
  the brand's lending policy where one is set
- **A payout** — one live payout per case, equal to the principal, recorded
  by a treasurer with the bank reference and the date the money left; the
  case is `active` from that instant, and a payout is refused once the offer
  is past due
- **A repayment** — any number, by bank transfer (reference required), cash
  or card, each carrying the date the money reached the bank, the recorder's
  key and the balance quoted at that date; partial allowed, and refused when
  the money in value-date order would put the loan over what it owed on any
  of those days
- **A correction** — an append-only row that takes one payout or repayment
  back in full, with a reason, recorded by a second `vault:payout` holder who
  is not the row's own recorder, only while the case is `active` or `repaid`;
  the borrower is emailed
- **What is owed** — computed at every read by one function from the offer,
  the money valued by the instant asked about, and the brand's accrual; never
  stored, never a status, never below zero; a quote at any instant is a query
- **Forfeiture** — a person's decision, any instant after the due date; the
  item settles the debt, and the figure it settled is on the audit chain
- **Release** — refused while anything is outstanding; storage is free, so a
  storage case owes nothing

## The arithmetic

| Rule | Value |
| --- | --- |
| Interest for the term | principal × rate, owed in full from day one; early repayment earns no rebate |
| Due instant | the last millisecond of the UTC day `termDays` after the offer was written; fixed then because the signed agreement prints it |
| Overdue | one `termDays`th of the term's interest per started UTC day after the due date plus the brand's grace days, on the full principal, simple |
| Ceiling | the term's interest and the overdue interest together never pass the brand's accrual ceiling, in basis points of the principal; unset today, so nothing binds |
| Rounding | one half-up rounding of the exact figure; the total is principal plus interest exactly |
| Value date | each money row's own date the money moved, or its recording instant for rows written before the field existed |
| Settlement | the first live recording whose running sum covers the balance at its own value date; interest stops there and never restarts |
| Bounds | rate **0% to 100%** per term, term **1 to 3,650 days**, principal ≤ valuation, an expiry after now and no later than the loan's own due date; the brand's loan-to-value cap, rate band, term presets, offer-validity window and accrual ceiling narrow these only when set, and every one is unset |

Worked at **HKD 100,000**, **3%** for **30 days**, due 1 October, no grace.

- **Repay on day 10** — HKD 103,000; the whole term's interest is owed
- **Repay 10 days late** — HKD 104,000; HKD 100 per started day
- **Repay HKD 90,000 on day 10 and the rest 10 days late** — HKD 14,000 still
  owed: the overdue interest runs on the full HKD 100,000, not on the
  HKD 10,000 outstanding
- **Pay HKD 103,000 by FPS at 23:55 on 1 October, recorded the next morning**
  — the treasurer records it against 1 October, the quote for that date is
  HKD 103,000, and the loan settles on time

## What a person records

| Record | Who | Fields | Guards |
| --- | --- | --- | --- |
| Payout | treasurer or admin | amount, bank reference, the date it left | one live payout; the amount equals the accepted principal; the offer is not past due; the executed packet and the item in custody are re-read under the row lock |
| Repayment | treasurer or admin | amount, method, bank reference (required for a transfer), the date it reached us, the recorder's key, the balance quoted for that date | the same key replays the same recording, and a key naming a row a correction took back is refused by name; a moved balance is refused by name; a payment that leaves the loan over-repaid at its own value date is refused wherever it lands in the order; a date in the future or before the payout is refused |
| Correction | a second `vault:payout` holder | the row taken back, a reason | the whole row, once; never by the row's own recorder; the case is `active` or `repaid` and nothing else; a payout comes back only after its repayments have, and returns the case to `vaulted`, where it may be paid out again; a reversed repayment reopens a repaid loan |
| Forfeiture | staff or admin | reason (optional) | past the due date; a disbursed loan exists |

- **Provenance and value** — every money row keeps who recorded it and when
  beside when the money moved; the balance follows the second, the ledger
  shows both
- **Immutability** — payouts, repayments, corrections, valuations, movements
  and history cannot be updated or deleted by any database session; the one
  exception is the actor column on the history, which erasure rewrites
- **The chain** — every recording lands on the audit chain filed under its
  case, with case id, amount and method, and forfeiture with the figure it
  settled; the bank reference and staff notes stay out of it, and the
  reference is shown to staff only
- **The key** — the recorder's key is derived from the day, method, amount,
  quoted balance and the case's newest event, so reopening the dialog
  reproduces it and the same transfer cannot land twice, while a recording
  made after a correction is a new one rather than the old one arriving
  again
- **The split** — staff set terms and forfeit; treasurers record money,
  correct it and read the book; the two roles share no grant, and `admin`
  holds both

## Reading the book

- **Per case** — the payout, every repayment and every correction, the due
  breakdown at the read instant, and each repayment's own breakdown in the
  history
- **The book** — every payout, repayment and correction in a period,
  narrowable to one case, paged on a keyset cursor with totals per method,
  the page and its totals read as one answer; `vault:payout`, because a
  ledger across every case is the firm's rather than the case in front of the
  operator
- **The position** — at any instant, principal, interest owed and repaid
  across active and repaid loans, in the brand's own currency; a book holding
  a second currency is refused by name rather than summed
- **The arrears** — every live loan past its due date, longest overdue
  first, judged on the newest accepted offer the case holds
- **What the collector sees** — outstanding of total, repaid, due date, days
  overdue, the instant computed, the rate for the term; no total repayable on
  the offer, no annualised rate, no daily late cost, no payoff quote with a
  validity, no bank details; by email, the payout, each repayment, a
  correction of either, settlement and forfeiture, but no reminder

:::callout{kind="warning"}
The allocation of a partial payment, the ceiling on interest, the grace
before forfeiture, a renewal, and what happens to a forfeited item are all
policy nobody has set. Each bound binds the day a number is written into the
brand's table; until then a borrower who pays part of the loan keeps accruing
on the full principal with nothing capping it, and a forfeited item leaves no
record of its sale, surplus or write-off.
:::

:::detail{title="Product decisions" for="pm"}
The loan exists so a collector can raise cash against a card without selling
it, and so the shop can lend against an item it already holds and has valued.
The owner's numbers are [Grade10 Finance](/references/grade10-finance):
**~40%** loan to value, **1.5% to 2.5%** interest.

| Signal | Definition | Owner |
| --- | --- | --- |
| Loans outstanding | the position at a date: principal and interest owed across `active` cases | Finance |
| Redemption rate | share of financed cases reaching `repaid` rather than `forfeited` | Product |
| Days to record | gap between a money row's value date and its recording | Finance |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Money is recorded, never moved | Decided | A person made the transfer; the console writes it down | Engineering |
| One due calculation | Decided | Screens, guards, sweeps, the ledger and the paper call the same function | Engineering |
| Whole-term interest | Decided | Redeeming early buys the item back, not the interest; stated on the paper | Product |
| Interest stops at settlement | Decided | The instant is replayed from the live rows at their value dates | Engineering |
| Term anchored at the offer | Decided | The date on the signed page is the date that binds; a payout past that date is refused instead | Product |
| When the term starts running | ❓ Open | That date is fixed when the offer is written, so a customer who accepts three days later borrows for three days less than the term says; acceptance and the payout are the alternatives | Product |
| Value date | Decided | The date the money moved is recorded beside the recording instant and the arithmetic follows it | Finance |
| Corrections | Decided | An append-only reversal of a whole row by a second `vault:payout` holder, never its own recorder; the borrower is told | Finance |
| The book is the treasurer's | Decided | The ledger and the position are the firm's accounts, so `vault:payout`; what one case owes stays on `vault:read` | Product |
| Bank reference | Decided | Required on every payout and every transfer, shown to staff only | Finance |
| Lending policy lives in one table | Decided | Loan to value, rate band, term presets, offer validity, grace and an accrual ceiling per brand; every one of them enforced, unset allows and set refuses | Engineering |
| Loan to value, rate band, term presets | ❓ Open | The values: **~40%** and **1.5% to 2.5%** from the notes, and their period | Owner |
| Grace and the accrual ceiling | ❓ Open | Days before overdue accrues and the ceiling on everything interest may add; both unset | Legal |
| Partial repayment | ❓ Open | Whether overdue interest runs on the remaining principal, and the allocation order | Legal |
| Renewal | ❓ Open | An interest-only roll into a new term, its limits and fee; waits on the allocation rule. A case whose payout was taken back holds only the offer it already accepted, so new terms mean unwinding the custody first | Owner |
| Accrual after a correction | ❓ Open | A reversed repayment reopens the loan and interest runs on from the printed due date as though the money never came; whether a corrected record re-dates the accrual is undecided | Finance |
| What a correction says in the book | ❓ Open | A ledger movement does not name the row it took back, and the totals do not split corrections from payments | Finance |
| A book in two currencies | ❓ Open | The position takes the brand's currency and refuses a second; the ledger's totals carry none, so a page mixing currencies prints no total at all | Finance |
| Overpayment | ❓ Open | A refund-due obligation for transfers; change for cash | Finance |
| Forfeiture accounting | ❓ Open | Sale proceeds, surplus owed back, deficit, write-off; a collateral register | Finance |
| Receipts and cash | ❓ Open | Whether cash is taken at all; a receipt per repayment; a till | Owner |
| Proof of transfer | ❓ Open | A reference format and an attachment beside the row | Finance |
| Fresh challenge on payout | ❓ Open | A second factor per payout; today one verification stamps the session for **12 hours** | Owner |
| Admin records money | ❓ Open | Whether `admin` may hold both sides of the split | Owner |
| Storage fee | ❓ Open | Free today; the obligations seam is where a schedule lands | Owner |
| Interest policy | ❓ Open | How income is recognised; the position derives it, nothing posts it | Finance |
| A reader of the books and the chain | ❓ Open | No role reads both; an auditor with `vault:read`, or a report grant | Owner |
:::

:::detail{title="For engineers" for="engineer"}
- **The one function** — `packages/vault/backend/src/money/computeDue.ts`,
  taking the brand's `Accrual`; `loanFacts.ts` loads a page of cases' offers
  and money in four set queries and folds the due purely, so a case screen,
  the position and the arrears list cannot answer differently;
  `obligations.ts` replays settlement at `valueDateOf` and holds both the
  over-repayment walk and the empty fee seam; `payout.ts`, `repayment.ts` and
  `reverse.ts` hold the guards; `adjustments.ts` is the one place a corrected
  row stops counting; `ledger.ts` pages the register and `position.ts` sums
  the book
- **Offers** — `packages/vault/backend/src/valuation/offers.ts`; the due
  instant is fixed at `makeOffer`, and `refuseOutsidePolicy` is the one gate
  every bound is applied in
- **Policy** — `packages/app-env/src/lending.ts`, every bound null;
  `accrualOf` is the only accessor allowed to read a null as a decision, and
  `check:libs` names each unset field with its owner
- **Immutability** —
  `apps/backend/grade10/vault/src/db/migrations/0001_append_only.sql`,
  `0015_guards_always_on.sql`, and `0019` for the adjustments; a real-Postgres
  test proves the triggers refuse
- **Audit** — every case mutation declares `auditSubject` on the elevated
  ladder; a walker test fails the next one that forgets
- **Console** — `PayoutsPanel.tsx` and `MoneyDialog.tsx` carry the value
  date, the quote for it and the correction; a repayment cannot be sent until
  the quote for its date has answered, and no row offers a correction to the
  operator who recorded it
:::
