# grade10-site/vault/loan-and-settlement Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-loan-and-settlement-US2: Borrower repays and takes the item home

**As a** borrower,
**I want** what I owe to be the same figure whenever I ask, and a part
payment to cut what my arrears run on,
**so that** I can pay some now and the rest later without being charged for
money I have already returned.

### grade10-site-vault-loan-and-settlement-US2-TC1-1: The amount owed reads the same figure across two successive reads

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October
* customer(the case's own collector) is on the case page before any
  repayment

**Steps:**

1. Read the amount owed on the case page.
2. Reload the case page and read the amount owed again, with no repayment
   made between the two reads.

**Expected Results:**

* Both reads show the same figure: 10,300,000 (HKD) — the whole term's
  interest owed in full from day one
* The figure is principal plus interest exactly, half-up rounded

---

### grade10-site-vault-loan-and-settlement-US2-TC11-1: The borrower's read gives one figure owed across two reads

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

---

### grade10-site-vault-loan-and-settlement-US2-TC9-1: Total interest owed never passes the brand's accrual ceiling of the principal

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

---

### grade10-site-vault-loan-and-settlement-US4-TC7-1: A brand that shortens its notice period does not move the date the borrower was given

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

### grade10-site-vault-loan-and-settlement-US5-TC1-1: The how-to-pay block on a live loan names the FPS id, the account and the case reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its six-character reference issued, the brand's FPS
  id and bank account set
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the how-to-pay block under the amount owed.

**Expected Results:**

* The block names the lender's FPS id
* The block names the lender's bank account, under the lender's registered
  name
* The block names the case's own six-character reference as the transfer
  reference to type

---

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

---

### grade10-site-vault-loan-and-settlement-US5-TC4-1: The how-to-pay block is withheld in production while unset, and bracketed outside it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `How to pay`

**Pre-conditions:**

* The case is `active`, its FPS id and bank account left unset

**Test data:**

| Environment | Outcome |
| --- | --- |
| Production | The case page shows the counter line alone, naming no payee, FPS id, account or reference |
| Outside production | The block shows a marked bracketed placeholder |

**Steps:**

1. Open the case page in the row's environment.

**Expected Results:**

* The case page meets the row's outcome
* No account, FPS id or transfer reference is printed while either is unset

---

### grade10-site-vault-loan-and-settlement-US5-TC5-1: A case with no live loan names no account and no reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is a storage case in the vault, with no loan advanced on it
* customer(the case's own collector) is on the case page

**Steps:**

1. Read the case page from the custody card down.

**Expected Results:**

* No how-to-pay block shows
* No account, FPS id or transfer reference is named anywhere on the page

---

### grade10-site-vault-loan-and-settlement-US5-TC2-1: The same how-to-pay block appears in every money email on the case

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

---

### grade10-site-vault-loan-and-settlement-US5-TC6-1: The borrower's read of a live loan carries the how-to-pay block and how long the figure holds

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

---

### grade10-site-vault-loan-and-settlement-US5-TC7-1: A stored item with no live loan carries no how-to-pay block

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

### grade10-site-vault-loan-and-settlement-US5-TC8-1: An unset FPS id reads as a placeholder off production and as no block on it

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

---

## grade10-site-vault-loan-and-settlement-US6: Borrower follows each repayment and the notice on the page

**As a** borrower who has paid part of the loan or is running late,
**I want** each repayment listed with the day it arrived and the balance
after it, and the final notice with its date to pay by,
**so that** I know what I still owe and how long I have.

### grade10-site-vault-loan-and-settlement-US6-TC1-1: With no repayments, the case page shows the empty repayments state

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
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, with no repayment recorded on it
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the repayments section.

**Expected Results:**

* The section reads empty, naming that each repayment will appear here
  with its day and the balance after it

---

### grade10-site-vault-loan-and-settlement-US6-TC2-1: With one repayment, the case page lists its value date, method and balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) recorded 1
  September, with one repayment of 3,000,000 (HKD) by bank transfer
  recorded against value date 11 September
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the repayments section.

**Expected Results:**

* The section lists one row: 3,000,000 (HKD) by bank transfer, reached us
  11 September, with the balance after it
* The allocation sentence and the never-restarts line show beside it

---

### grade10-site-vault-loan-and-settlement-US6-TC3-1: With several repayments, the case page lists each in value-date order with its own balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) recorded 1
  September, with three repayments recorded against value dates 11
  September, 21 September and 1 October, each of 1,000,000 (HKD)
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the repayments section.

**Expected Results:**

* The three repayments list in value-date order, 11 September first
* Each row carries its own balance after it, none repeating an earlier
  row's balance

---

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

---

### grade10-site-vault-loan-and-settlement-US6-TC5-1: Once a notice is sent, the page names the day it was written, the date to pay by and that nothing can be taken before then

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The case is `active`, past its due date, with a forfeiture notice sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the final-notice card.

**Expected Results:**

* The card names the day the notice was written
* The card names the date to pay by
* The card states that nothing can be taken before that date

---

### grade10-site-vault-loan-and-settlement-US6-TC6-1: Once a notice is sent, no further reminder date shows

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

* The case is `active`, past its due date, with a forfeiture notice sent
  and every reminder already sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the reminders area of the final-notice card.

**Expected Results:**

* The card lists the reminders already sent
* The card states that no further reminder follows

---

### grade10-site-vault-loan-and-settlement-US6-TC7-1: Before a notice is sent, the page names the dates the next reminders go

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
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, before its due date, with no notice sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the reminders card.

**Expected Results:**

* The card names the dates the reminders go: 7 and 1 days before the due
  date, then every 7 days overdue, until a notice would stop them

---

### grade10-site-vault-loan-and-settlement-US6-TC8-1: A repayment taken back leaves the list, and the balances read as if it had never been recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/loan.spec.ts`

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) recorded 1
  September, with two repayments of 1,000,000 (HKD) recorded against value
  dates 11 September and 21 September
* A correction by a second `vault:payout` holder has taken the 11 September
  repayment back
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the repayments section.

**Expected Results:**

* Only the 21 September repayment is listed
* Its balance after reads what would have been owed had the 11 September
  repayment never been recorded
* No row names the correction itself

---

### grade10-site-vault-loan-and-settlement-US6-TC9-1: Past due with no notice sent, the card names the reminders gone, the next one and that a notice may follow

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

* The case is `active`, two weeks past its due date, with two weekly
  reminders sent and no forfeiture notice standing
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the reminders card.

**Expected Results:**

* The card names both reminders sent with the days they went
* The card names the next weekly reminder by its date
* The card says a written notice naming a date to pay by may follow, and
  names no day for it

---

### grade10-site-vault-loan-and-settlement-US6-TC10-1: The borrower's read lists each repayment with its value date, method and balance after

Runs once per row of **Test data**.

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
* The repayments in the row are recorded on `<case_1>`, and the clock reads 25 September.

**Test data:**

| Repayments recorded | The read lists |
| --- | --- |
| None | No repayment; 10,300,000 outstanding |
| 3,000,000 by FPS, value-dated 10 September, recorded 11 September | That repayment: 3,000,000, FPS, value date 10 September, recorded 11 September, balance after 7,300,000 |
| 2,000,000 in cash at the counter, value-dated and recorded 20 September; then 3,000,000 by FPS, value-dated 10 September, recorded 21 September | Both: 3,000,000, FPS, 10 September, recorded 21 September, 7,300,000; then 2,000,000, cash, 20 September, recorded 20 September, 5,300,000 |

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the repayments in the API response.

**Expected Results:**

* Step 2 lists what the row's read lists, in value-date order, whatever order they were recorded in.
* Each balance after equals 10,300,000 less every repayment value-dated on or before it.

---

### grade10-site-vault-loan-and-settlement-US6-TC11-1: A repayment taken back leaves the borrower's read as if never recorded

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

---

### grade10-site-vault-loan-and-settlement-US6-TC12-1: Before a notice, the borrower's read carries the reminder dates

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* customer(borrower) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the borrower's live loan: principal 10,000,000 HKD minor units at 3% for a 30-day term, advanced 1 September, due 1 October, no grace.
* No forfeiture notice has been sent on `<case_1>`, and the clock reads the row's day.

**Test data:**

| Day of the read | The read carries |
| --- | --- |
| 20 September | Reminders to come on 24 September and 30 September |
| 10 October | Reminders sent 24 September, 30 September and 8 October; the next on 15 October; no notice and no date to pay by |

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the reminders in the API response.

**Expected Results:**

* Step 2 carries what the row's read carries.
* Reminders fall 7 days and 1 day before the due date, then every 7 days overdue.

---

### grade10-site-vault-loan-and-settlement-US6-TC13-1: Once a notice is sent, the borrower's read carries its dates and no reminder to come

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
* Staff sent the forfeiture notice on `<case_1>` on 10 October; the brand's notice period is 14 days.
* The clock reads 12 October.

**Steps:**

1. Ask for the borrower's own read of `<case_1>`.
2. Read the notice and the reminders in the API response.

**Expected Results:**

* Step 2 reads the notice written on 10 October.
* Step 2 reads the date to pay by: 24 October, the notice day plus 14 days.
* Step 2 carries no reminder to come.

## Settled

- **How to pay on the borrower's read** - a live loan's read carries the block, the same values the money messages carry; no other case carries it, and in production an unset value carries none (Q19)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`detail`), `cases/wire.ts` and `howToPay`. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - the block on the borrower's read, landed as Q19
- **Raised, rejected** - none
- **Revised** - `grade10-site-vault-loan-and-settlement-US2-TC9-1`, `grade10-site-vault-loan-and-settlement-US4-TC7-1`, `grade10-site-vault-loan-and-settlement-US5-TC2-1` read through the API, keeping `<v>`; `grade10-site-vault-loan-and-settlement-US4-TC2-2` drops the page's nothing-can-be-taken line, the borrower's read carrying the same day and date
- **Joined** - `grade10-site-vault-loan-and-settlement-SC-27` to `-SC-29` into `grade10-site-vault-loan-and-settlement-US6-TC10-1` and `grade10-site-vault-loan-and-settlement-US6-TC11-1`; `grade10-site-vault-loan-and-settlement-SC-30`, `-SC-48`, `-SC-34` into `grade10-site-vault-loan-and-settlement-US6-TC12-1`; `grade10-site-vault-loan-and-settlement-SC-31`, `-SC-32` into `grade10-site-vault-loan-and-settlement-US6-TC13-1`; `grade10-site-vault-loan-and-settlement-SC-33` into `grade10-site-vault-loan-and-settlement-US4-TC7-1`; `grade10-site-vault-loan-and-settlement-SC-36` into `grade10-site-vault-loan-and-settlement-US5-TC2-1`
- **Corrected** - `grade10-site-vault-loan-and-settlement-US6-TC10-1` reads the day each repayment was recorded and orders by value date against the order recorded; `grade10-site-vault-loan-and-settlement-US6-TC12-1` drops the notice that may follow and reads none past due; `grade10-site-vault-loan-and-settlement-US6-TC13-1` drops the nothing-can-be-taken read, which the letter states
- **Added by QA2** - `grade10-site-vault-loan-and-settlement-US5-TC6-1` for `grade10-site-vault-loan-and-settlement-SC-35`; `grade10-site-vault-loan-and-settlement-US5-TC7-1` for `grade10-site-vault-loan-and-settlement-SC-37`; `grade10-site-vault-loan-and-settlement-US5-TC8-1` for `grade10-site-vault-loan-and-settlement-SC-38` and `-SC-47`
- **Out of suite** - `grade10-site-vault-loan-and-settlement-SC-52`, the counter's refusal, walked by the durable `grade10-site-vault-loan-and-settlement-US2-TC10-1`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Still walking a removed screen** - automated `grade10-site-vault-loan-and-settlement-US1-TC1-1`
