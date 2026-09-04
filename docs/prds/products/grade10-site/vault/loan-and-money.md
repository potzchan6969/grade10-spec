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
  term in days, an expiry; no due date, because nothing has been lent yet.
  Principal at most the latest valuation and inside the brand's lending
  policy, and in production an offer is refused outright while a bound of
  that policy or the lender's own name is unset
- **A payout** — one live payout per case, equal to the principal, recorded
  by a treasurer with the bank reference and the date the money left; the
  case is `active` from that instant, the term starts running from that date,
  and the borrower is told the due date in writing
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
- **Forfeiture** — a person's decision, past the due date and never before
  the cure date of a written notice has passed; the item settles the debt,
  and the figure it settled is on the audit chain
- **Release** — refused while anything is outstanding; storage is free, so a
  storage case owes nothing

## The arithmetic

| Rule | Value |
| --- | --- |
| Interest for the term | principal × rate, owed in full from day one; early repayment earns no rebate |
| Due instant | the last millisecond of the brand's day `termDays` after the payout's value date, written on the payout row |
| Allocation | one walk in value-date order; each recording clears the interest accrued to its own value date, then the principal |
| Overdue | one `termDays`th of the term's interest per started day of the brand's calendar after the due date plus the brand's grace days, on the principal still outstanding, simple — no fee, no compounding, no higher rate |
| Ceiling | the term's interest and the overdue interest together never pass the brand's accrual ceiling: **100%** of the principal |
| Rounding | one half-up rounding of the exact figure; the total is principal plus interest exactly |
| Value date | each money row's own date the money moved, or its recording instant for rows written before the field existed |
| Settlement | the recording that leaves nothing owed at its own value date; interest stops there and never restarts |
| Bounds | principal ≤ the valuation and ≤ the brand's loan-to-value cap; the rate inside the brand's band; the term one of the brand's presets; the expiry after now and no further off than the brand's offer-validity window. The outer limits the wire itself takes are rate **0% to 100%** per term and term **1 to 3,650 days** |

Worked at **HKD 100,000**, **3%** for **30 days** — round numbers rather
than Grade10's own band — advanced 1 September and so due 1 October, no
grace.

- **Repay on day 10** — HKD 103,000; the whole term's interest is owed
- **Repay 10 days late** — HKD 104,000; HKD 100 per started day
- **Repay HKD 90,000 on day 10 and the rest 10 days late** — HKD 13,130 still
  owed: the payment clears the HKD 3,000 interest first and HKD 87,000 of the
  principal, so the arrears run on the HKD 13,000 left, at HKD 13 a day
- **Pay HKD 103,000 by FPS at 23:55 on 1 October, recorded the next morning**
  — the treasurer records it against 1 October, the quote for that date is
  HKD 103,000, and the loan settles on time

## What the brand lends under

One per-brand table, read at the offer. Grade10's numbers are the owner's
own; a brand that lends nothing leaves every one of them unset and writes no
offer in production.

| Bound | Grade10 |
| --- | --- |
| Loan to value | **40%** of the recorded valuation |
| Rate band | **1.5% to 2.5% per 30 days**, compared as `rate × 30 / term days` so one band judges every term |
| Term presets | **30, 60, 90, 120 days** |
| Offer validity | **7 days** from the offer |
| Grace | **none** — interest runs from the day after the due date |
| Accrual ceiling | **100%** of the principal, for interest of every kind together |
| Forfeiture notice | **14 days** of cure before the item may be taken |

- **A null bound refuses the offer, never the deploy** — in production
  `makeOffer` refuses while the loan-to-value cap, the rate ceiling, the
  offer validity or the notice period is unset, so a shop opens on custody
  alone; outside production a null bound allows everything, which is how a
  brand rehearses
- **The lender is named or there is no offer** — the same refusal, at the
  same moment, for the lender's registered name
- **The period is the one inference** — the owner's notes name a rate and no
  period, and a month is how Hong Kong lending is quoted

## What a person records

| Record | Who | Fields | Guards |
| --- | --- | --- | --- |
| Payout | treasurer or admin | amount, bank reference, the date it left | one live payout; the amount equals the accepted principal; the value date is on or after the signed set was sealed and is not in the future; the recorder did not make the offer being paid out; the executed packet and the item in custody are re-read under the row lock |
| Repayment | treasurer or admin | amount, method, bank reference (required for a transfer), the date it reached us, the recorder's key, the balance quoted for that date | the same key replays the same recording, and a key naming a row a correction took back is refused by name; a moved balance is refused by name; a payment that leaves the loan over-repaid at its own value date is refused wherever it lands in the order; a date in the future or before the payout is refused |
| Correction | a second `vault:payout` holder | the row taken back, a reason | the whole row, once; never by the row's own recorder; the case is `active` or `repaid` and nothing else; a payout comes back only after its repayments have, and returns the case to `vaulted`, where it may be paid out again; a reversed repayment reopens a repaid loan |
| Forfeiture notice | staff or admin | none — the cure date is computed | past the due date; a disbursed loan exists; the brand has a notice period |
| Forfeiture | staff or admin | reason (optional) | past the due date; a disbursed loan exists; a written notice stands and the cure date it named has passed |

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
  holds both. Per case the split holds whoever the operator is: the person
  who priced the loan may not be the person who pays it out

## Reading the book

- **Per case** — the payout, every repayment and every correction, the due
  breakdown at the read instant, and each repayment's own breakdown in the
  history
- **The book** — every payout, repayment and correction in a period,
  narrowable to one case, paged on a keyset cursor with totals per method and
  currency, each printed in its own unit; a correction names the row it took
  back; the page and its totals read as one answer; `vault:payout`, because a
  ledger across every case is the firm's rather than the case in front of the
  operator
- **The position** — at any instant, principal, interest owed and repaid
  across active and repaid loans, in the brand's own currency; a book holding
  a second currency is refused by name rather than summed
- **The arrears** — every live loan past its due date, longest overdue
  first, judged on the payout's own due date and paged on a keyset cursor
  over it
- **What the collector sees** — the offer's amount, term, rate, total to
  repay and what a late day costs; on a live loan the outstanding of the
  total, repaid, due date, days overdue, the instant computed, and how to pay
  under a balance that holds until the deadline beside it. No annualised rate
  on screen and no payoff quote with a validity: the balance at a date is the
  quote
- **What the collector is mailed** — the payout with its due date, each
  repayment, a correction of either, settlement, a reminder a week and a day
  before the due date and every seventh day it stays overdue, the forfeiture
  notice with its cure date, and the forfeiture itself

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
| Days to payout | gap between a case's submission and the payout's value date | Finance |
| Financed cases a week | offers accepted and paid out in the week | Product |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Money is recorded, never moved | Decided | A person made the transfer; the console writes it down | Engineering |
| One due calculation | Decided | Screens, guards, sweeps, the ledger and the paper call the same function | Engineering |
| Whole-term interest | Decided | Redeeming early buys the item back, not the interest; stated on the paper | Product |
| Interest stops at settlement | Decided | The instant is replayed from the live rows at their value dates | Engineering |
| The term runs from the advance | Decided | Every day between the offer, the acceptance and the signature was the customer's to spend and none of it was borrowed, so the due date is fixed at the payout from the value date a treasurer recorded, and the agreement prints a term rather than a date | Product |
| No late fee, no stepped rate, no compounding | Decided | Past the due date the term's own daily rate keeps running and nothing else is added; as recalled the Money Lenders Ordinance forbids each, so the fair rule and the lawful one are the same rule | Legal |
| Value date | Decided | The date the money moved is recorded beside the recording instant and the arithmetic follows it | Finance |
| Corrections | Decided | An append-only reversal of a whole row by a second `vault:payout` holder, never its own recorder; the borrower is told | Finance |
| The book is the treasurer's | Decided | The ledger and the position are the firm's accounts, so `vault:payout`; what one case owes stays on `vault:read` | Product |
| Bank reference | Decided | Required on every payout and every transfer, shown to staff only | Finance |
| Lending policy lives in one table | Decided | Loan to value, rate band, term presets, offer validity, grace, an accrual ceiling and the forfeiture notice period per brand; every one of them enforced where it is read, and in production an unset bound refuses the offer | Engineering |
| The brand's numbers are the owner's | Decided | **40%** loan to value and **1.5% to 2.5%** interest come from the notes; the period is read as per 30 days, which is how Hong Kong lending is quoted, and 2.5% over 30 days is 30% a year — under the thresholds recalled for an illegal or presumed-extortionate rate | Owner |
| Grace is none, the ceiling is the principal | Decided | The paper accrues daily from the due date, so grace would contradict it; interest of every kind stops at **100%** of the principal, which never binds at the seeded band before a forfeiture notice | Product |
| Interest first, on the principal left | Decided | One walk in value-date order; charging a late day on money already returned is indefensible, and a borrower who pays most of it back owes arrears on the rest | Product |
| Renewal | Deferred | A new offer on the outstanding principal, a new agreement, the prior loan settled by rollover with no money moving. Reopens the day a borrower asks to extend | Owner |
| Accrual after a correction | Decided | A reversal restores the arithmetic to what it would have been had the row never been written; nothing re-dates | Finance |
| A correction names its row in the book | Decided | The movement carries the kind and id it takes back, and the totals split by kind, so a reader nets without a second query | Finance |
| A book in two currencies | Decided | Each ledger total carries its currency and prints in its own unit; the position states one unit and refuses a book holding two, because a bare integer sum has none | Finance |
| Overpayment | Decided | The book records what the loan owed: a transfer above the balance is recorded at the balance under the incoming reference, and the surplus is refunded at the bank | Finance |
| Forfeiture accounting | Deferred | Proceeds, surplus and write-off are the firm's books once the item is stock. Reopens at the first forfeiture, or when counsel names a duty to return a surplus | Finance |
| Receipts and cash | Decided | Cash is a method, the repayment mail is the receipt, and a till is not the vault's | Owner |
| Proof of transfer | Decided | The bank reference is the proof; no attachment and no format | Finance |
| Step-up on money | Decided | One verification stamps the session for **12 hours**; a record is money, so the guard is the split, the chain and the stamp rather than a prompt on a shared shop iPad | Owner |
| Admin records money | Decided | `admin` keeps both grants so a shop of three stays operable, and the split is enforced per case: the payout's recorder may not be the offer's maker | Owner |
| Storage fee | Decided | Storage is free; the obligations seam is where a schedule would land | Owner |
| Interest policy | Decided | The book answers both bases — the ledger is cash, the position derives accrued interest — and recognition is the firm's accountant's choice | Finance |
| A reader of the books and the chain | Deferred | A `vault:book` read grant for treasurer, admin and an auditor. Reopens at the first external audit | Owner |
| Double entry | Decided | Single entry with derived balances is the product's book; double entry is the general ledger, kept in the firm's accounting system from a ledger export | Finance |
:::

:::detail{title="For engineers" for="engineer"}
- **The one function** — `packages/vault/backend/src/money/computeDue.ts`,
  taking the brand's `Accrual`; `loanFacts.ts` loads a page of cases' offers
  and money in four set queries and folds the due purely, so a case screen,
  the position and the arrears list cannot answer differently;
  one fold answers what is owed, when it settled and whether a recording
  over-repaid it; `obligations.ts` holds the fee seam; `payout.ts`,
  `repayment.ts` and `reverse.ts` hold the guards; `adjustments.ts` is the one place a corrected
  row stops counting; `ledger.ts` pages the register and `position.ts` sums
  the book
- **Offers** — `packages/vault/backend/src/valuation/offers.ts`;
  `refuseUnsetPolicy` is the production refusal and `refuseOutsidePolicy` the
  one gate every bound is applied in. The due instant is fixed in
  `money/payout.ts` and stored on `payouts.due_at`
- **Policy** — `packages/app-env/src/lending.ts`, seeded for grade10 and null
  for zzz; `accrualOf` is the only accessor allowed to read a null as a
  decision, and `check:libs` names each unset field with its owner
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
