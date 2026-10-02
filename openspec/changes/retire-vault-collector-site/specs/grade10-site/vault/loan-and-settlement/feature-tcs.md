# grade10-site/vault/loan-and-settlement Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-loan-and-settlement-US1: Treasurer records the advance that starts the loan

**As a** treasurer,
**I want** to write down a transfer that has already left the bank, against
the day it left,
**so that** the borrower's term runs from the day they got the money and
nobody can price and pay out one loan alone.

### grade10-site-vault-loan-and-settlement-US1-TC1-2: Payout within its value-date bounds fixes the due date and tells the borrower

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `vaulted`, its signed set sealed on `<seal date>`, with a single accepted offer of principal 10,000,000 (HKD) for a 30-day term, priced by `<staff A>`.
* admin(holds vault:payout), who is not `<staff A>`, is on the payout dialog for the case.
* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Test data:**

| Field | Value |
| --- | --- |
| Value date | `<seal date>` |
| Value date | a day after `<seal date>`, before today |

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and the row's value date.
2. Submit the payout.
3. As the borrower, ask for their own read of the case.

**Expected Results:**

* The case moves `vaulted` to `active`.
* Step 3 reads the due date 30 days after the row's value date, and the borrower is told it in writing.
* Step 3 reads the amount owed as principal plus interest exactly, half-up rounded, and never below zero.

---

## grade10-site-vault-loan-and-settlement-US2: Borrower repays and takes the item home

**As a** borrower,
**I want** what I owe to be the same figure whenever I ask, and a part
payment to cut what my arrears run on,
**so that** I can pay some now and the rest later without being charged for
money I have already returned.

### grade10-site-vault-loan-and-settlement-US2-TC1-2: The borrower's read gives one figure owed across two reads

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* The clock reads 20 September, and no money is recorded between the two reads.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Ask for the borrower's own read of `<case_1>` again.

**Expected Results:**

* Step 1 reads 10,300,000 HKD minor units outstanding: the principal plus the whole term's interest.
* Step 1 names the due date, 1 October, and the instant it computed the figure at.
* Step 2 reads the same figure owed and the same due date.

### grade10-site-vault-loan-and-settlement-US2-TC9-2: Total interest owed never passes the brand's accrual ceiling of the principal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October, with no repayment made and
  a very large number of days now overdue

**Steps:**

1. Ask for the borrower's own read of the case, long past the point where
   the term's and overdue interest together would otherwise exceed the
   principal.

**Expected Results:**

* The amount owed reads at most 20,000,000 (HKD) — the term's interest and
  the overdue interest together never passing 100% of the principal

---

## grade10-site-vault-loan-and-settlement-US4: Operator takes the collateral only after warning the borrower

**As a** member of shop staff,
**I want** to have to warn the borrower in writing and wait out the date I
gave them,
**so that** nobody's property is taken without notice and a chance to pay.

### grade10-site-vault-loan-and-settlement-US4-TC2-2: A forfeiture notice fixes the cure date and states nothing can be taken before it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, past its due date, with no notice sent yet
* admin(shop staff) is on the Custody tab of the case
* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. Send a forfeiture notice.
2. As the borrower, ask for their own read of the case.

**Expected Results:**

* The notice names the day it was written, a date to pay by at least 14
  days off, and that nothing can be taken before that date
* The borrower's read carries the same day written and the same date to pay
  by

### grade10-site-vault-loan-and-settlement-US4-TC7-2: A brand that shortens its notice period does not move the date the borrower was given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, past its due date, with a forfeiture notice sent on
  1 November naming 15 November as the date to pay by
* The brand's notice period is shortened to 7 days after that notice was
  sent
* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. Ask for the borrower's own read of the case.

**Expected Results:**

* The read carries 15 November as the date to pay by, the date the notice
  itself named
* No date recomputed from the brand's shortened period is carried

---

## grade10-site-vault-loan-and-settlement-US5: Borrower knows where to send the money

**As a** borrower with a loan running,
**I want** the page and every money email to name the FPS id, the bank
account, whose name it is under and the reference to type,
**so that** I can pay at my own bank without asking the shop where.

### grade10-site-vault-loan-and-settlement-US5-TC1-2: The borrower's read of a live loan carries the how-to-pay block and how long the figure holds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan, reference `<case reference>`, on a brand whose FPS id and bank account are set; due at `<due instant>`.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.

**Expected Results:**

* Step 1 carries the lender's registered name as payee, its FPS id, its bank account and `<case reference>` as the transfer reference.
* Step 1 carries `<due instant>`, the instant the read was made at, and what each further started day adds.

### grade10-site-vault-loan-and-settlement-US5-TC2-2: The same how-to-pay block appears in every money email on the case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The case is `active`, its six-character reference issued, the brand's FPS
  id and bank account set
* An event of the row's kind fires on the case

**Test data:**

| Kind |
| --- |
| payout_recorded |
| repayment_due_soon |
| repayment_overdue |
| repayment_recorded |
| payout_reversed |
| repayment_reversed |
| loan_repaid |
| forfeited |

**Steps:**

1. Ask for the borrower's own read of the case.
2. Send the row's message.
3. Open the message the borrower received.

**Expected Results:**

* The message names the same FPS id, bank account and case reference as
  step 1's how-to-pay block

### grade10-site-vault-loan-and-settlement-US5-TC3-1: The how-to-pay block also offers card or cash at the counter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its how-to-pay block set
* customer(the case's own collector) is on the case page

**Steps:**

1. Read the how-to-pay block.

**Expected Results:**

* The block names card or cash at the counter as an alternative to the
  bank transfer

### grade10-site-vault-loan-and-settlement-US5-TC4-2: An unset FPS id reads as a placeholder off production and as no block on it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan, advanced while the FPS id and bank account were set; the FPS id is since cleared on the row's environment.

**Test data:**

| Environment | Step 1 carries |
| --- | --- |
| Staging | The block, a marked placeholder in place of the FPS id |
| Production | No block: no payee, no FPS id, no bank account and no transfer reference |

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.

**Expected Results:**

* Step 1 carries what the row says.

### grade10-site-vault-loan-and-settlement-US5-TC5-2: A stored item with no live loan carries no how-to-pay block

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_2>` is the collector's storage case, its item in the vault, with no loan.

**Steps:**

1. Ask for the collector's own read of `<case_2>`.

**Expected Results:**

* Step 1 carries no block naming a payee, an account or a reference.

---

## grade10-site-vault-loan-and-settlement-US6: Borrower follows each repayment and the notice on the page

**As a** borrower who has paid part of the loan or is running late,
**I want** each repayment listed with the day it arrived and the balance
after it, and the final notice with its date to pay by,
**so that** I know what I still owe and how long I have.

### grade10-site-vault-loan-and-settlement-US6-TC1-2: With no repayments, the borrower's read lists none and the whole figure owed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* No repayment is recorded on `<case_1>`, and the clock reads 25 September.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the repayments in the API response.

**Expected Results:**

* Step 2 lists no repayment.
* Outstanding reads 10,300,000.

### grade10-site-vault-loan-and-settlement-US6-TC2-2: With one repayment, the borrower's read lists its value date, method and balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* 3,000,000 by FPS, value-dated 10 September, was recorded on 11 September, and the clock reads 25 September.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the repayments in the API response.

**Expected Results:**

* Step 2 lists one repayment: 3,000,000, FPS, value date 10 September, recorded 11 September.
* Its balance after reads 7,300,000: 10,300,000 less 3,000,000.

### grade10-site-vault-loan-and-settlement-US6-TC3-2: With several repayments, the borrower's read lists each in value-date order with its own balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* 2,000,000 in cash at the counter, value-dated and recorded 20 September, then 3,000,000 by FPS, value-dated 10 September, recorded 21 September; the clock reads 25 September.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the repayments in the API response.

**Expected Results:**

* Step 2 lists the 10 September repayment first, then the 20 September one, whatever order they were recorded in.
* The 10 September repayment's balance after reads 7,300,000; the 20 September one's reads 5,300,000.
* Each balance after equals 10,300,000 less every repayment value-dated on or before it.

### grade10-site-vault-loan-and-settlement-US6-TC4-1: Past due with no notice sent, the page shows no final-notice card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The case is `active`, past its due date, with no forfeiture notice sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll past the amount owed to the notice area.

**Expected Results:**

* The past-due figure and the reminders card show
* No final-notice card shows

### grade10-site-vault-loan-and-settlement-US6-TC5-2: Once a notice is sent, the borrower's read carries the day it was written and the date to pay by

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* Staff sent the forfeiture notice on `<case_1>` on 10 October; the brand's notice period is 14 days.
* The clock reads 12 October.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the notice in the API response.

**Expected Results:**

* Step 2 reads the notice written on 10 October.
* Step 2 reads the date to pay by: 24 October, the notice day plus 14 days.

### grade10-site-vault-loan-and-settlement-US6-TC6-2: Once a notice is sent, the borrower's read carries no reminder to come

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* Staff sent the forfeiture notice on `<case_1>` on 10 October, after the reminders of 24 September, 30 September and 8 October.
* The clock reads 20 October.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the reminders in the API response.

**Expected Results:**

* Step 2 lists the three reminders sent, with their days.
* Step 2 carries no reminder to come.

### grade10-site-vault-loan-and-settlement-US6-TC7-2: Before its due date, the borrower's read carries the reminder dates to come

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* No forfeiture notice has been sent on `<case_1>`, and the clock reads 20 September.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the reminders in the API response.

**Expected Results:**

* Step 2 carries reminders to come on 24 September and 30 September: 7 days and 1 day before the due date.

### grade10-site-vault-loan-and-settlement-US6-TC8-2: A repayment taken back leaves the borrower's read as if never recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* 3,000,000 by FPS value-dated 10 September and 2,000,000 in cash value-dated 20 September are recorded on `<case_1>`.
* A second money holder, not its recorder, took the 10 September repayment back.
* The clock reads 25 September.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the repayments in the API response.

**Expected Results:**

* Step 2 lists the 20 September repayment alone.
* Its balance after reads 8,300,000: 10,300,000 less 2,000,000.
* Outstanding reads 8,300,000.

### grade10-site-vault-loan-and-settlement-US6-TC9-2: Past due with no notice, the borrower's read carries the reminders sent and the next one

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* No forfeiture notice has been sent on `<case_1>`, and the clock reads 10 October.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the reminders and the notice in the API response.

**Expected Results:**

* Step 2 lists the reminders sent on 24 September, 30 September and 8 October.
* Step 2 carries the next reminder on 15 October, every 7 days overdue.
* Step 2 carries no notice and no date to pay by.

## Settled

- **How to pay on the borrower's read** - a live loan's read carries the block, the same values the money messages carry; no other case carries it, and in production an unset value carries none (Q19)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`detail`), `cases/wire.ts` and `howToPay`. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - the block on the borrower's read, landed as Q19
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run read the case page: `grade10-site-vault-loan-and-settlement-US1-TC1-2`, `grade10-site-vault-loan-and-settlement-US2-TC1-2`, `grade10-site-vault-loan-and-settlement-US2-TC9-2`, `grade10-site-vault-loan-and-settlement-US4-TC2-2`, `grade10-site-vault-loan-and-settlement-US4-TC7-2`, `grade10-site-vault-loan-and-settlement-US5-TC1-2`, `grade10-site-vault-loan-and-settlement-US5-TC2-2`, `grade10-site-vault-loan-and-settlement-US5-TC4-2`, `grade10-site-vault-loan-and-settlement-US5-TC5-2`, `grade10-site-vault-loan-and-settlement-US6-TC1-2`, `grade10-site-vault-loan-and-settlement-US6-TC2-2`, `grade10-site-vault-loan-and-settlement-US6-TC3-2`, `grade10-site-vault-loan-and-settlement-US6-TC5-2`, `grade10-site-vault-loan-and-settlement-US6-TC6-2`, `grade10-site-vault-loan-and-settlement-US6-TC7-2`, `grade10-site-vault-loan-and-settlement-US6-TC8-2`, `grade10-site-vault-loan-and-settlement-US6-TC9-2`; `grade10-site-vault-loan-and-settlement-US1-TC1-2` still records the payout at the console, and `grade10-site-vault-loan-and-settlement-US4-TC2-2` drops the page's nothing-can-be-taken line, which the letter states
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-loan-and-settlement-US5-TC3-1`, the page's counter line, which the read does not carry; `grade10-site-vault-loan-and-settlement-US6-TC4-1`, the page's missing final-notice card, whose read `grade10-site-vault-loan-and-settlement-US6-TC9-2` holds
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US2-TC11-1` into `grade10-site-vault-loan-and-settlement-US2-TC1-2`; `US5-TC6-1` into `grade10-site-vault-loan-and-settlement-US5-TC1-2`; `US5-TC7-1` into `grade10-site-vault-loan-and-settlement-US5-TC5-2`; `US5-TC8-1` into `grade10-site-vault-loan-and-settlement-US5-TC4-2`; `US6-TC10-1` into `grade10-site-vault-loan-and-settlement-US6-TC1-2`, `grade10-site-vault-loan-and-settlement-US6-TC2-2` and `grade10-site-vault-loan-and-settlement-US6-TC3-2`; `US6-TC11-1` into `grade10-site-vault-loan-and-settlement-US6-TC8-2`; `US6-TC12-1` into `grade10-site-vault-loan-and-settlement-US6-TC7-2` and `grade10-site-vault-loan-and-settlement-US6-TC9-2`; `US6-TC13-1` into `grade10-site-vault-loan-and-settlement-US6-TC5-2` and `grade10-site-vault-loan-and-settlement-US6-TC6-2`
- **Joined** - `grade10-site-vault-loan-and-settlement-SC-27` to `-SC-29` into `grade10-site-vault-loan-and-settlement-US6-TC1-2` to `grade10-site-vault-loan-and-settlement-US6-TC3-2` and `grade10-site-vault-loan-and-settlement-US6-TC8-2`; `-SC-30`, `-SC-48`, `-SC-34` into `grade10-site-vault-loan-and-settlement-US6-TC7-2` and `grade10-site-vault-loan-and-settlement-US6-TC9-2`; `-SC-31`, `-SC-32` into `grade10-site-vault-loan-and-settlement-US6-TC5-2` and `grade10-site-vault-loan-and-settlement-US6-TC6-2`; `-SC-33` into `grade10-site-vault-loan-and-settlement-US4-TC7-2`; `-SC-35` into `grade10-site-vault-loan-and-settlement-US5-TC1-2`; `-SC-36` into `grade10-site-vault-loan-and-settlement-US5-TC2-2`; `-SC-37` into `grade10-site-vault-loan-and-settlement-US5-TC5-2`; `-SC-38`, `-SC-47` into `grade10-site-vault-loan-and-settlement-US5-TC4-2`
- **Out of suite** - `grade10-site-vault-loan-and-settlement-SC-52`, the counter's refusal, walked by the durable `grade10-site-vault-loan-and-settlement-US2-TC10-1`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Automated cases re-versioned** - `grade10-site-vault-loan-and-settlement-US1-TC1-2`, `grade10-site-vault-loan-and-settlement-US2-TC1-2`, `grade10-site-vault-loan-and-settlement-US5-TC1-2`, `grade10-site-vault-loan-and-settlement-US5-TC4-2`, `grade10-site-vault-loan-and-settlement-US5-TC5-2`, `grade10-site-vault-loan-and-settlement-US6-TC1-2`, `grade10-site-vault-loan-and-settlement-US6-TC2-2`, `grade10-site-vault-loan-and-settlement-US6-TC3-2`, `grade10-site-vault-loan-and-settlement-US6-TC7-2`, `grade10-site-vault-loan-and-settlement-US6-TC8-2` were decided by `loan.spec.ts` at `-1`, and `loan.spec.ts` titles `grade10-site-vault-loan-and-settlement-US5-TC2-1`; each is `manual` until task 4.4 retitles its API walk and flips it
