# grade10-site/vault/loan-and-settlement Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## Background

Every case in this file uses the brand's currency, HKD, with every amount
stated in minor units (cents) and an ISO 4217 code. The worked figures
(principal 10,000,000 minor units at 3% for a 30-day term, advanced 1
September, due 1 October, no grace) are the PRD's own round-number example
and are used across cases for a checkable, self-consistent arithmetic.

## grade10-site-vault-loan-and-settlement-US1: Treasurer records the advance that starts the loan

**As a** treasurer,
**I want** to write down a transfer that has already left the bank, against
the day it left,
**so that** the borrower's term runs from the day they got the money and
nobody can price and pay out one loan alone.

### grade10-site-vault-loan-and-settlement-US1-TC1-1: Payout within its value-date bounds fixes the due date and tells the borrower

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

* The case is `vaulted`, its signed set sealed on <seal date>, with a single
  accepted offer of principal 10,000,000 (HKD) for a 30-day term, priced by
  <staff A>
* admin(holds vault:payout), who is not <staff A>, is on the payout dialog
  for the case

**Test data:**

| Field | Value |
| --- | --- |
| Value date | <seal date> |
| Value date | a day after <seal date>, before today |

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and the row's
   value date.
2. Submit the payout.
3. Open the case page as the borrower.

**Expected Results:**

* The case moves `vaulted` to `active`
* The due date reads 30 days after the row's value date, and the borrower
  is told it in writing
* The amount owed reads principal plus interest exactly, half-up rounded,
  and never below zero

### grade10-site-vault-loan-and-settlement-US1-TC2-1: Payout is refused when its value date falls outside its bounds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `vaulted`, its signed set sealed on <seal date>, with a
  single accepted offer of principal 10,000,000 (HKD)
* admin(holds vault:payout) is on the payout dialog for the case

**Test data:**

| Field | Value |
| --- | --- |
| Value date | a day before <seal date> |
| Value date | a day after today |

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and the row's
   value date.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name
* The case stays `vaulted`, with no payout recorded

### grade10-site-vault-loan-and-settlement-US1-TC3-1: Payout is refused when its recorder priced the same case's offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of principal
  10,000,000 (HKD) priced by <staff A>
* admin(holds vault:payout), signed in as <staff A>, is on the payout
  dialog for the case

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and a value date
   on or after the day the paper was sealed.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name, naming that the same person priced and
  paid out the loan
* The case stays `vaulted`

### grade10-site-vault-loan-and-settlement-US1-TC4-1: Payout is refused when the amount does not equal the accepted principal

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of principal
  10,000,000 (HKD)
* admin(holds vault:payout), who is not the offer's own maker, is on the
  payout dialog for the case

**Steps:**

1. Enter an amount of 9,000,000 (HKD), a bank reference and a value date
   on or after the day the paper was sealed.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name
* The case stays `vaulted`

### grade10-site-vault-loan-and-settlement-US1-TC5-1: Payout is refused with no bank reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of principal
  10,000,000 (HKD)
* admin(holds vault:payout), who is not the offer's own maker, is on the
  payout dialog for the case, with the bank reference field left blank

**Steps:**

1. Enter an amount of 10,000,000 (HKD) and a value date on or after the
   day the paper was sealed, leaving the bank reference blank.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name
* The case stays `vaulted`

### grade10-site-vault-loan-and-settlement-US1-TC6-1: Payout is refused when a live payout already stands on the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `active`, its one live payout of 10,000,000 (HKD) already
  recorded
* admin(holds vault:payout), who is not the offer's own maker, opens the
  payout dialog for the same case again

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and a value date
   on or after the day the paper was sealed.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name
* The case's one live payout is unchanged

### grade10-site-vault-loan-and-settlement-US1-TC7-1: Payout is refused before the packet is executed and the item is in custody

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is `signing`, its accepted offer of principal 10,000,000 (HKD)
  standing, with no packet yet executed
* admin(holds vault:payout), who is not the offer's own maker, is on the
  payout dialog for the case

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and today's date.
2. Submit the payout.

**Expected Results:**

* The payout is refused by name
* The case stays `signing`

---

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

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

### grade10-site-vault-loan-and-settlement-US2-TC2-1: A repayment on time still owes the whole term's interest, and settles the loan

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
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October
* admin(holds vault:payout), who did not record the payout, is on the
  repayment dialog on 11 September, ten days into the term

**Steps:**

1. Quote the balance for value date 11 September.
2. Record a repayment of 10,300,000 (HKD), method bank transfer with a
   reference, against the quoted balance.
3. Read the case's amount owed again, after the recording.

**Expected Results:**

* The repayment is recorded, and the case moves `active` to `repaid`
* The amount owed now reads zero, never negative
* The item may then be booked for a pickup visit and taken home

### grade10-site-vault-loan-and-settlement-US2-TC3-1: A part payment clears interest first, and the remaining arrears run on the unreturned principal alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October, with no grace
* admin(holds vault:payout), who did not record the payout, is on the
  repayment dialog

**Steps:**

1. On 11 September, quote the balance and record a repayment of 9,000,000
   (HKD) against it.
2. Read the case's amount owed on 11 October, ten days after the due date,
   with no further repayment made.
3. On 11 October, quote the balance and record a repayment of 1,313,000
   (HKD) against it.

**Expected Results:**

* Step 1's repayment clears the 300,000 (HKD) of interest accrued to 11
  September, then 8,700,000 (HKD) of principal, leaving 1,300,000 (HKD)
  outstanding
* Step 2's read shows 1,313,000 (HKD) owed: the remaining principal plus
  ten started days of overdue interest at 1,300 (HKD) a day on that
  principal alone, no fee, no compounding, no higher rate
* Step 3's repayment leaves the case `repaid`, owing zero

### grade10-site-vault-loan-and-settlement-US2-TC4-1: A repayment is refused when the quoted balance has moved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October
* admin(holds vault:payout), who did not record the payout, has quoted the
  balance for 11 September and the dialog is still open

**Steps:**

1. While the dialog is open, another repayment is recorded against the
   case by a second treasurer, moving the balance.
2. Submit the first repayment against the balance quoted in step 0 (before
   the dialog was opened).

**Expected Results:**

* The repayment is refused by name, naming that the quote moved
* The case's balance reflects only the second treasurer's recording

### grade10-site-vault-loan-and-settlement-US2-TC5-1: A repayment is refused when it would over-repay the loan at its own value date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October
* admin(holds vault:payout), who did not record the payout, is on the
  repayment dialog on 11 September, ten days into the term, with the
  balance quoted at 10,300,000 (HKD)

**Steps:**

1. Enter a repayment amount of 10,300,001 (HKD) against the quoted
   balance.
2. Submit the repayment.

**Expected Results:**

* The repayment is refused by name
* The case's amount owed is unchanged at 10,300,000 (HKD)

### grade10-site-vault-loan-and-settlement-US2-TC6-1: The same recorder's key replays the same recording rather than a duplicate

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October
* admin(holds vault:payout), who did not record the payout, opens the
  repayment dialog on 11 September

**Steps:**

1. Quote the balance, record a repayment of 3,000,000 (HKD), and note the
   dialog's recorder's key.
2. Reopen the same dialog for the same intended repayment, reproducing the
   same recorder's key, and submit it again.

**Expected Results:**

* Step 2 returns the original recording rather than recording a second
  repayment
* The case's balance reflects only one 3,000,000 (HKD) repayment

### grade10-site-vault-loan-and-settlement-US2-TC7-1: A repayment is refused when its value date is outside the payout's bounds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) recorded with value
  date 1 September
* admin(holds vault:payout), who did not record the payout, is on the
  repayment dialog

**Test data:**

| Field | Value |
| --- | --- |
| Value date | a day before 1 September |
| Value date | a day after today |

**Steps:**

1. Quote the balance and enter a repayment of 1,000,000 (HKD) against the
   row's value date.
2. Submit the repayment.

**Expected Results:**

* The repayment is refused by name
* The case's balance is unchanged

### grade10-site-vault-loan-and-settlement-US2-TC8-1: Release is refused while a balance is still outstanding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, with a part repayment leaving 1,300,000 (HKD) outstanding
* staff(shop staff) is at the counter attempting release with the item and
  the borrower present

**Steps:**

1. Attempt to release the item.

**Expected Results:**

* Release is refused by name, naming that a balance is still outstanding
* The case stays `active`

### grade10-site-vault-loan-and-settlement-US2-TC9-1: Total interest owed never passes the brand's accrual ceiling of the principal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The case is `active`, its payout of 10,000,000 (HKD) at 3% for 30 days
  recorded, advanced 1 September, due 1 October, with no repayment made and
  a very large number of days now overdue

**Steps:**

1. Read the amount owed on the case page, long past the point where the
   term's and overdue interest together would otherwise exceed the
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

### grade10-site-vault-loan-and-settlement-US4-TC1-1: A forfeiture notice is refused before the loan is past its due date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, its due date not yet reached
* admin(shop staff) is on the Custody tab of the case

**Steps:**

1. Attempt to send a forfeiture notice.

**Expected Results:**

* The notice is refused by name
* The case carries no forfeiture notice

### grade10-site-vault-loan-and-settlement-US4-TC2-1: A forfeiture notice fixes the cure date and states nothing can be taken before it

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

**Steps:**

1. Send a forfeiture notice.
2. Open the case page as the borrower.

**Expected Results:**

* The notice names the day it was written, a date to pay by at least 14
  days off, and that nothing can be taken before that date
* The case page shows the same date to pay by and the same line

### grade10-site-vault-loan-and-settlement-US4-TC3-1: Forfeiture is refused while the notice's cure period is still running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, past its due date, with a forfeiture notice sent
  whose 14-day cure date has not yet passed
* admin(shop staff) is on the Custody tab of the case

**Steps:**

1. Attempt to forfeit the item.

**Expected Results:**

* Forfeiture is refused by name, naming the cure date not yet passed
* The case stays `active`, and the item stays in the vault

### grade10-site-vault-loan-and-settlement-US4-TC4-1: Forfeiture is refused with no notice sent, even when the loan is past due

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, past its due date, with no forfeiture notice ever
  sent
* admin(shop staff) is on the Custody tab of the case

**Steps:**

1. Attempt to forfeit the item.

**Expected Results:**

* Forfeiture is refused by name, naming that no notice stands
* The case stays `active`, and the item stays in the vault

### grade10-site-vault-loan-and-settlement-US4-TC5-1: Forfeiture, once the cure period has passed, settles the debt and tells the borrower

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, its forfeiture notice's 14-day cure date passed
  with nothing repaid since
* admin(shop staff) is on the Custody tab of the case

**Steps:**

1. Forfeit the item, entering a reason.
2. Read the case's audit chain.

**Expected Results:**

* The case moves `active` to `forfeited`
* The figure the item settled is recorded on the audit chain, with the
  notice's date and the date to pay by
* The borrower is told the item was forfeited

### grade10-site-vault-loan-and-settlement-US4-TC6-1: Forfeiture is refused once the loan has already settled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `repaid`, a forfeiture notice having been sent and its cure
  date passed before the loan was repaid
* admin(shop staff) is on the Custody tab of the case

**Steps:**

1. Attempt to forfeit the item.

**Expected Results:**

* Forfeiture is refused by name, naming that no disbursed loan stands
* The case stays `repaid`

### grade10-site-vault-loan-and-settlement-US4-TC7-1: A brand that shortens its notice period does not move the date the borrower was given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The case is `active`, past its due date, with a forfeiture notice sent on
  1 November naming 15 November as the date to pay by
* The brand's notice period is shortened to 7 days after that notice was
  sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Read the date to pay by on the final-notice card.

**Expected Results:**

* The card names 15 November, the date the notice itself named
* No date recomputed from the brand's shortened period is shown

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

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

### grade10-site-vault-loan-and-settlement-US5-TC2-1: The same how-to-pay block appears in every money email on the case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

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

1. Send the row's message.
2. Open the message the borrower received.

**Expected Results:**

* The message names the same FPS id, bank account and case reference as
  the case page's how-to-pay block

### grade10-site-vault-loan-and-settlement-US5-TC3-1: The how-to-pay block also offers card or cash at the counter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* The case is `active`, its how-to-pay block set
* customer(the case's own collector) is on the case page

**Steps:**

1. Read the how-to-pay block.

**Expected Results:**

* The block names card or cash at the counter as an alternative to the
  bank transfer

### grade10-site-vault-loan-and-settlement-US5-TC4-1: The how-to-pay block is withheld in production while unset, and bracketed outside it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-loan-and-settlement-US5-TC5-1: A case with no live loan names no account and no reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The case is `active`, with no repayment recorded on it
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the repayments section.

**Expected Results:**

* The section reads empty, naming that each repayment will appear here
  with its day and the balance after it

### grade10-site-vault-loan-and-settlement-US6-TC2-1: With one repayment, the case page lists its value date, method and balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

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

### grade10-site-vault-loan-and-settlement-US6-TC3-1: With several repayments, the case page lists each in value-date order with its own balance after

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

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

### grade10-site-vault-loan-and-settlement-US6-TC4-1: Past due with no notice sent, the page shows no final-notice card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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

### grade10-site-vault-loan-and-settlement-US6-TC5-1: Once a notice is sent, the page names the day it was written, the date to pay by and that nothing can be taken before then

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### grade10-site-vault-loan-and-settlement-US6-TC6-1: Once a notice is sent, no further reminder date shows

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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

### grade10-site-vault-loan-and-settlement-US6-TC7-1: Before a notice is sent, the page names the dates the next reminders go

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The case is `active`, before its due date, with no notice sent
* customer(the case's own collector) is on the case page

**Steps:**

1. Scroll to the reminders card.

**Expected Results:**

* The card names the dates the reminders go: 7 and 1 days before the due
  date, then every 7 days overdue, until a notice would stop them

### grade10-site-vault-loan-and-settlement-US6-TC8-1: A repayment taken back leaves the list, and the balances read as if it had never been recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

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

### grade10-site-vault-loan-and-settlement-US6-TC9-1: Past due with no notice sent, the card names the reminders gone, the next one and that a notice may follow

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
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

## grade10-site-vault-loan-and-settlement-US7: Operator reads the rule before the act

**As an** operator about to write an offer, confirm an item into the vault
or record a payout,
**I want** the dialog to state the bounds, the preconditions and what the
recording fixes — the cap, the presets and the figures the offer derives;
the three things a vaulting needs; the two people, the due date and the
reminder days a payout sets — before I send,
**so that** I act knowing the rule rather than learning it from a refusal.

### grade10-site-vault-loan-and-settlement-US7-TC1-1: The make-offer dialog states the cap, the presets and the derived figures before it is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `under_valuation`, with a recorded valuation
* admin(shop staff) opens the make-offer dialog for the case

**Steps:**

1. Enter a principal, a rate and a term preset, without sending.

**Expected Results:**

* The dialog states the loan-to-value cap against the valuation
* The dialog states the term presets available
* The dialog states the interest, the total to repay, the late-day figure
  and the annualised rate it derives live from the entered values
* The dialog states the date the offer stays open until

### grade10-site-vault-loan-and-settlement-US7-TC2-1: With a bound unset, the make-offer dialog reads the gate as not set, and behaves by environment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `under_valuation`, with a recorded valuation
* The brand's loan-to-value cap is left unset
* admin(shop staff) opens the make-offer dialog for the case

**Test data:**

| Environment | Outcome |
| --- | --- |
| Production | Make the offer is refused by name before the act |
| Outside production | The gate reads not set, and the offer goes through |

**Steps:**

1. Enter a principal, a rate and a term preset.
2. Attempt to send the offer, in the row's environment.

**Expected Results:**

* The dialog and the outcome match the row

### grade10-site-vault-loan-and-settlement-US7-TC3-1: The vault dialog states its two preconditions before the item is confirmed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `signing`, its packet executed and identity bound
* admin(shop staff) opens the vault dialog from the Custody tab

**Steps:**

1. Open the vault dialog, without confirming.

**Expected Results:**

* The dialog states the packet-executed precondition as met
* The dialog states the identity-bound precondition as met
* The dialog asks for no visit slot
* The dialog states the shop is required and the locker optional

### grade10-site-vault-loan-and-settlement-US7-TC4-1: The payout dialog states its preconditions, the two people and the dates it will fix before it is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of principal
  10,000,000 (HKD) priced by <staff A>
* admin(holds vault:payout), who is not <staff A>, opens the payout dialog

**Steps:**

1. Enter an amount, a bank reference and a value date, without submitting.

**Expected Results:**

* The dialog names the two people the recording needs: the offer's own
  maker and the payout's own recorder must differ
* The dialog states the amount must equal the principal and the bank
  reference is required
* The dialog states the due date and the reminder dates the recording will
  fix

### grade10-site-vault-loan-and-settlement-US7-TC5-1: As the value date changes in the payout dialog, the due date and the reminder dates re-derive

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of a 30-day term
* admin(holds vault:payout), who is not the offer's own maker, is on the
  payout dialog with value date 1 September entered

**Steps:**

1. Read the due date and the reminder dates shown for value date 1
   September.
2. Change the value date to 2 September, without submitting.
3. Read the due date and the reminder dates again.

**Expected Results:**

* Step 1 shows a due date of 1 October, with reminder dates 7 and 1 days
  before it
* Step 3 shows a due date of 2 October, with reminder dates shifted by the
  same day

### grade10-site-vault-loan-and-settlement-US7-TC6-1: The worker still refuses the act on its own even after the dialog stated the rule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `The rule before the act`

**Pre-conditions:**

* The case is `vaulted`, with a single accepted offer of principal
  10,000,000 (HKD) priced by <staff A>
* admin(holds vault:payout), signed in as <staff A>, is on the payout
  dialog, which states the two-people rule as unmet

**Steps:**

1. Enter an amount of 10,000,000 (HKD), a bank reference and a valid value
   date, despite the dialog's own stated warning.
2. Submit the payout.

**Expected Results:**

* The worker refuses the payout by name, the same as if the dialog had
  said nothing
* The case stays `vaulted`

### grade10-site-vault-loan-and-settlement-US7-TC7-1: A bound the offer fails is named unmet before the send, and the control stays

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is `under_valuation`, with a valuation whose loan-to-value cap
  puts the principal at 4,000,000 (HKD)
* admin(shop staff) opens the make-offer dialog for the case

**Steps:**

1. Enter a principal of 5,000,000 (HKD), without sending.

**Expected Results:**

* The dialog names the loan-to-value cap as the bound that is unmet, and
  what it requires
* Make the offer is still there to press

---

## Reconciliation

**Run** — the blind pass read this capability's `## Purpose` and `## Feature
set`, its `user-journeys.md`, the change's `decisions.md` with its `## Raised`
table, `ui-design.md` with the state dispositions stripped, the PRD sections
the proposal links, and this file for id continuity. It was denied every
`## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and
`tech-design.md`. Nothing verifies that list: it is the run's word.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1` to `US1-TC4-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-01` to `grade10-site-vault-loan-and-settlement-SC-04` |
| `US1-TC5-1` | Folded | `grade10-site-vault-loan-and-settlement-SC-49`. The advance requirement makes the bank reference required and no scenario drew the refusal; the change now opens that requirement in a MODIFIED block and the scenario lands there |
| `US1-TC6-1` | Folded | `grade10-site-vault-loan-and-settlement-SC-50`. The advance requirement refuses an advance where one already stands, and no scenario drew it; folded in the same MODIFIED block |
| `US1-TC7-1` | Folded | `grade10-site-vault-loan-and-settlement-SC-51`. The advance requirement refuses an advance before the signed set is sealed and the item is in custody, and no scenario drew it; folded in the same MODIFIED block, as the third refusal of the category the first reconciliation left unfolded |
| `US2-TC1-1` to `US2-TC9-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-05`, `grade10-site-vault-loan-and-settlement-SC-08`, `grade10-site-vault-loan-and-settlement-SC-09`, `grade10-site-vault-loan-and-settlement-SC-12`, `grade10-site-vault-loan-and-settlement-SC-13`, `grade10-site-vault-loan-and-settlement-SC-14`, `grade10-site-vault-loan-and-settlement-SC-15`, `grade10-site-vault-loan-and-settlement-SC-23`; the value-date bounds `US2-TC7-1` walks are the repayment requirement's own list |
| `US2-TC2-1` and `US2-TC3-1`, "who did not record the payout" | No rule claimed | A pre-condition, not an assertion: the two-person split guards the payout alone, and a repayment's recorder is unconstrained. Raised in `decisions.md`, landed on `Q13` |
| `US4-TC1-1` to `US4-TC6-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-19` to `grade10-site-vault-loan-and-settlement-SC-22` and the forfeiture requirement's refusals |
| `grade10-site-vault-loan-and-settlement-SC-33` | Scenario no case reached | Case added: `US4-TC7-1`, the borrower's page holding the date the notice named after the brand shortens its period |
| `US5-TC1-1`, `US5-TC2-1`, `US5-TC3-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-35` and `grade10-site-vault-loan-and-settlement-SC-36` |
| `US5-TC4-1`, the production row | Answered, case amended | What a production borrower reads while Finance's values are unset was undecided — the design carried it as ❓. Answered as the counter line alone, with no account fields, and folded as `grade10-site-vault-loan-and-settlement-SC-47`; its bracketed row is `grade10-site-vault-loan-and-settlement-SC-38`. The send's own refusal is `grade10-site/vault/collector-notifications`' rule and its suite walks it, so the case keeps its page rows alone. Raised in `decisions.md`, landed as a ❓ Product line on the loan and money page |
| `grade10-site-vault-loan-and-settlement-SC-37` | Scenario no case reached | Case added: `US5-TC5-1`, a storage case naming no account |
| `US6-TC1-1`, `US6-TC2-1`, `US6-TC3-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-27` and `grade10-site-vault-loan-and-settlement-SC-28`; the value-date order `US6-TC3-1` walks is the requirement's own **Order** rule, and the allocation and never-restarts lines beside a repayment are the design's copy, carrying no rule of their own |
| `US6-TC4-1` to `US6-TC7-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-30`, `grade10-site-vault-loan-and-settlement-SC-31`, `grade10-site-vault-loan-and-settlement-SC-32`, `grade10-site-vault-loan-and-settlement-SC-34`; the rungs of the ladder `US6-TC7-1` names are `grade10-site/vault/collector-notifications`'s to set |
| `grade10-site-vault-loan-and-settlement-SC-29` | Scenario no case reached | Case added: `US6-TC8-1`, the list and the balances after a repayment is taken back |
| Raised: what stands between the last reminder and a notice | Answered, folded | The weekly ladder has no last rung and the notice no day before it: the card names the reminders gone, the next one and that a notice may follow — the requirement's **Past due** rule and `grade10-site-vault-loan-and-settlement-SC-48`; case added: `US6-TC9-1`. Raised in `decisions.md`, landed on `Q6` and `Q64` |
| Raised: the Corrections bullet no journey here walks | Traced, nothing moved | Taking a record back is the console's act and is walked by `grade10-admin/vault/money-book` US-04; this suite keeps only what the borrower reads afterwards, `US6-TC8-1`. Raised in `decisions.md`, landed on `Q26` |
| `US7-TC1-1` to `US7-TC6-1` | Covered | `grade10-site-vault-loan-and-settlement-SC-40`, `grade10-site-vault-loan-and-settlement-SC-42` to `grade10-site-vault-loan-and-settlement-SC-46`; the shop and locker fields `US7-TC3-1` names are `grade10-admin/vault/operator-queue`'s |
| `grade10-site-vault-loan-and-settlement-SC-41` | Scenario no case reached | Case added: `US7-TC7-1`, a set bound the offer fails |

Nothing was dropped as a misreading, and no case is blocked.

### Manual

| Manual | Why |
| --- | --- |
| `US4-TC2-1` | A person reads the notice the borrower was sent; the walk decides the cure date and the line on the page, not the letter in an inbox |
| `US5-TC2-1` | A person opens each of the eight letters; the walk decides that the kind sends and carries the block |
| `US6-TC5-1` | A person reads the notice card beside the letter, to see the two name one date |
| `US7-TC1-1` | A person reads the dialog before pressing; the walk decides the figures, not that an operator can find them |
| `US7-TC3-1` | The two preconditions are read as `Check`s on screen; the walk decides which is met |
| `US7-TC4-1` | The two people, the amount and the dates are read before the send; the walk decides what the recording fixes |

## Settled

- A repayment's recorder is unconstrained: the two-person split guards the payout alone, so no case asserts who may record a repayment.
- Taking a money record back is the console's act, walked by `grade10-admin/vault/money-book`; this suite keeps only what the borrower reads afterwards.
- What stands between the last reminder and a notice is named on the card: the last reminder sent with its day, and the day a notice falls due.
- What a production borrower reads while the FPS id or the bank account is unset is the counter line alone, with no account fields.
- The refusal of an act that would send a message carrying an unset value belongs to `grade10-site/vault/collector-notifications`, and this suite walks the page alone.
- The annualised rate is one derivation in the owed arithmetic — the term's interest over the principal, read over a year, to one decimal place — and the dialog names it rather than deriving one of its own.
