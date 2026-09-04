---
title: Loan and Money
order: 3
---

A loan is an accepted offer paid out against an item in the locker, and every
amount on it is a whole number of cents recorded by a person after the bank
moved the money. Nothing here moves money; it writes down that money moved.

- **Currency** — HKD or USD, the brand's at intake, one per case, never
  changed
- **An offer** — principal, interest for the whole term in basis points, a
  term in days, an expiry; principal at most the latest valuation
- **A payout** — one per case, equal to the principal, recorded by a treasurer
  with an optional bank reference; the case is `active` from that instant
- **A repayment** — any number, by bank transfer, cash or card, each carrying
  the recorder's own key and the balance they were quoting; partial allowed,
  overpayment refused
- **What is owed** — computed at every read by one function from the offer
  and the repayment rows; never stored, never a status
- **Forfeiture** — a person's decision, any instant after the due date; the
  item settles the debt and the case owes nothing
- **Release** — refused while anything is outstanding; storage is free, so a
  storage case owes nothing

## The arithmetic

| Rule | Value |
| --- | --- |
| Interest for the term | principal × rate, owed in full from day one; early repayment earns no rebate |
| Due instant | the last millisecond of the UTC day `termDays` after the offer was written, not after the money was paid out |
| Overdue | one `termDays`th of the term's interest per started UTC day, on the full principal, simple, uncapped |
| Rounding | one half-up rounding of the exact figure; the total is principal plus interest exactly |
| Settlement | the first recording whose running sum covers the balance at that recording's own clock; interest stops there and never restarts |
| Bounds | rate **0% to 100%** per term, term **1 to 3,650 days**, principal ≤ valuation; no rate band, no loan-to-value cap |

Worked at **HKD 100,000**, **3%** for **30 days**, due 1 October.

- **Repay on day 10** — HKD 103,000; the whole term's interest is owed
- **Repay 10 days late** — HKD 104,000; HKD 100 per started day
- **Repay HKD 90,000 on day 10 and the rest 10 days late** — HKD 14,000 still
  owed: the overdue interest runs on the full HKD 100,000, not on the
  HKD 10,000 outstanding
- **Pay HKD 103,000 by FPS at 23:55 on 1 October, recorded at 10:00 the next
  morning** — the balance stepped to HKD 103,100 at 08:00 Hong Kong time; the
  quote is refused as stale, the payment lands as partial, HKD 100 remains
  and grows daily, and the item cannot be released

## What a person records

| Record | Who | Fields | Guards |
| --- | --- | --- | --- |
| Payout | treasurer or admin | amount, bank reference (optional) | one per case; the amount equals the accepted principal; the executed packet and the item in custody are re-read under the row lock |
| Repayment | treasurer or admin | amount, method, bank reference (optional), the recorder's key, the balance quoted | the same key replays the same recording; a moved balance is refused by name; more than the balance is refused |
| Forfeiture | staff or admin | reason (optional) | past the due date; a disbursed loan exists |

- **The clock** — the recording instant is the value date; there is no field
  for when the money actually landed
- **Immutability** — payouts, repayments, valuations, movements and history
  cannot be updated or deleted by any database session; a wrong row has no
  correction path
- **The chain** — every recording lands on the audit chain with case id,
  amount and method; the bank reference, staff notes and the forfeiture figure
  stay out of it
- **The split** — staff set terms and forfeit; treasurers record money; the
  two roles share no grant, and `admin` holds both

## What the collector sees

- **On the case** — outstanding of total, repaid, due date, days overdue, the
  instant computed, the rate for the term; no total repayable on the offer,
  no annualised rate, no daily late cost, no payoff quote with a validity, no
  bank details
- **On the loan agreement** — principal, rate for the term, repayable by,
  repayable amount, and four terms: interest owed for the whole term, daily
  accrual after the due date, release on full repayment, forfeiture by a
  person
- **By email** — nothing about money: no payout, repayment, due-soon, overdue
  or forfeiture notice

:::callout{kind="warning"}
Three moves an accountant expects do not exist. A wrong payout or repayment
cannot be reversed, adjusted or annotated; a live loan cannot be renewed or
extended, so a borrower who can pay the interest but not the principal stays
overdue on the full amount; and an overpayment by transfer has no row, so the
bank statement will not reconcile to the case.
:::

:::callout{kind="warning"}
No report crosses cases. Money is read one case at a time; the only list
returns at most 200 cases by status with no dates, no money fields and no
paging. Month-end totals, a collateral schedule, accrued interest at a date, a
register of loans made and redeemed, and a bank reconciliation are all SQL
nobody has written. Forfeiture writes the debt it settled only into the case
history's JSON, and nothing records what the item later sold for.
:::

:::detail{title="Product decisions" for="pm"}
The loan exists so a collector can raise cash against a card without selling
it, and so the shop can lend against an item it already holds and has valued.
The owner's numbers are [Grade10 Finance](/references/grade10-finance):
**~40%** loan to value, **1.5% to 2.5%** interest.

| Signal | Definition | Owner |
| --- | --- | --- |
| Loans outstanding | principal and interest owed across `active` cases at a date | Finance |
| Redemption rate | share of financed cases reaching `repaid` rather than `forfeited` | Product |
| Days to record | gap between a bank credit and its recording | Finance |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Money is recorded, never moved | Decided | A person made the transfer; the console writes it down | Engineering |
| One due calculation | Decided | Screens, guards, sweeps and the paper call the same function | Engineering |
| Whole-term interest | Decided | Redeeming early buys the item back, not the interest; stated on the paper | Product |
| Interest stops at settlement | Decided | The instant is replayed from the rows, not from the status | Engineering |
| Value date | ❓ Open | A received-at instant on each recording as the accrual instant; today the recording clock is the value date | Finance |
| Term anchor | ❓ Open | Term from disbursement or from acceptance; today from the moment the offer was written, so a customer who accepts five days later holds the money 25 days for 30 days' interest, and an expiry may fall after the due date | Owner |
| Partial repayment | ❓ Open | Whether overdue interest runs on the remaining principal, and the allocation order | Legal |
| Overdue cap and grace | ❓ Open | Maximum overdue interest or days, notice and grace before forfeiture; none today | Legal |
| Rate band and loan to value | ❓ Open | Enforce **1.5% to 2.5%** and **~40%** in the offer, or leave as guidance; today **0% to 100%** and **100%** | Owner |
| Rate period | ❓ Open | The owner's range per month, per term or per year; the dialog says per term | Owner |
| Renewal | ❓ Open | An interest-only roll into a new term, its limits and fee | Owner |
| Corrections | ❓ Open | An append-only reversal row with reason and second approver, netted by the settlement walk | Finance |
| Overpayment | ❓ Open | A refund-due row for transfers; change for cash | Finance |
| Forfeiture accounting | ❓ Open | Sale proceeds, surplus owed back, deficit, write-off; a collateral register | Finance |
| Reports | ❓ Open | A period query over payouts and repayments with paging and export; a position at a date | Finance |
| Receipts and cash | ❓ Open | Whether cash is taken at all; a receipt per repayment; a till | Owner |
| Bank reference | ❓ Open | Required for bank transfers and every payout; a proof attachment | Finance |
| Fresh challenge on payout | ❓ Open | A second factor per payout; today one verification stamps the session for **12 hours** | Owner |
| Admin records money | ❓ Open | Whether `admin` may hold both sides of the split | Owner |
| USD | ❓ Open | A real lane or removed; FPS is HKD only | Owner |
| Storage fee | ❓ Open | Free today; the obligations seam is where a schedule lands | Owner |
| Interest policy | ❓ Open | How income is recognised; nothing posts interest | Finance |
:::

:::detail{title="For engineers" for="engineer"}
- **The one function** — `packages/vault/backend/src/money/computeDue.ts`;
  `obligations.ts` replays settlement from the repayment rows and adds the
  empty fee seam; `payout.ts` and `repayment.ts` hold the guards
- **Offers** — `packages/vault/backend/src/valuation/offers.ts`; the due
  instant is fixed at `makeOffer` by `termEndsAt(now, termDays)` in UTC
- **Wire** — `dueSchema` and `obligationSchema` in
  `packages/vault/contracts/src/schemas.ts`; amounts are integers, currencies
  `VAULT_CURRENCIES`
- **Immutability** —
  `apps/backend/grade10/vault/src/db/migrations/0001_append_only.sql` and
  `0015_guards_always_on.sql`
- **Console** — `PayoutsPanel.tsx` mints the idempotency key and captures the
  quoted balance when the dialog opens; `MoneyDialog.tsx` takes the amount
- **Worklist** — `admin.retentionReview` returns the overdue loans; no screen
  reads it
- **Tests** — `packages/vault/backend/test/money/*` and
  `apps/backend/grade10/vault/test/db/money.spec.ts`; not covered: one-day
  terms, zero interest, long terms, USD end to end, partial then late,
  recording lag, an expiry after the due date
:::
