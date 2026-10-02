# grade10-site/vault/loan-and-settlement Test Cases

**Status:** pending-review

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
