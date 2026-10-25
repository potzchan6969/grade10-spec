# grade10-site/vault/loan-and-settlement Test Cases

**Status:** pending-review · 0/25
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Every amount is HKD. The worked loan is HKD100,000.00 at 3% for a 30-day term, advanced 1 September, due 1 October, no grace: HKD3,000.00 of interest for the term, HKD100.00 a day after the due date.
* Money is recorded on the console case page by a treasurer, admin(holds `vault:payout`); the offer's maker is `<staff A>`. The borrower, customer(collector), reads their case on `<g10url>`. A tester moves the clock to reach a date.
* Taking a money record back is `grade10-admin/vault/money-book`'s act; this suite reads what the borrower and the case show after it.

## Walk 1: Advance, part-repay and settle the worked loan

Starting state:

- A financed case vaulted, its packet sealed on 1 September, an accepted offer of HKD100,000.00 by `<staff A>`; a treasurer other than `<staff A>` on its console page.

Shared test data:

| Field | Value |
| --- | --- |
| worked loan | as in the Background |

### Route

1. Record the advance of HKD100,000.00, valued 1 September, with its bank reference.
   - Active, due 1 October; the borrower is told. `g10.vault-loan-and-settlement.US1-TC1`
2. On 11 September, quote and record HKD90,000.00.
   - The case lists it with its day and HKD13,000.00 left. `g10.vault-loan-and-settlement.US6-TC1`
3. On 11 October, quote the balance.
   - HKD13,130.00: the arrears ran on HKD13,000.00 alone. `g10.vault-loan-and-settlement.US2-TC3`
4. Record HKD13,130.00 against that quote.
   - Repaid, owing nothing; a pickup may be booked. `g10.vault-loan-and-settlement.US2-TC2`

## g10.vault-loan-and-settlement.US1: Treasurer records the advance that starts the loan

**As a** treasurer,
**I want** to write down a transfer that has already left the bank, against
the day it left,
**so that** the borrower's term runs from the day they got the money and
nobody can price and pay out one loan alone.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-vou rev=2 covers=g10.vault-loan-and-settlement.SC-3g8,g10.vault-loan-and-settlement.SC-72r,g10.vault-loan-and-settlement.SC-6zm,g10.vault-loan-and-settlement.SC-0as,g10.vault-loan-and-settlement.SC-obp,g10.vault-loan-and-settlement.SC-apt,g10.vault-loan-and-settlement.SC-zk2,g10.vault-loan-and-settlement.SC-3mx -->
### g10.vault-loan-and-settlement.US1-TC1: An advance valued on or after the seal starts the loan, its term running from the value date

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* The case is vaulted, its packet sealed on 1 September, its accepted 30-day offer of HKD100,000.00 by `<staff A>`; a treasurer other than `<staff A>` is on the payout dialog.

**Test data:**

| `<value date>` | `<due>` |
| --- | --- |
| 1 September | the end of 1 October |
| 15 September | the end of 15 October |

**Steps:**

1. Record HKD100,000.00 with a bank reference, valued `<value date>`.
2. As the borrower, read the case and the inbox.

**Expected Results:**

* The case reads active, due `<due>` on the brand's calendar; the case and an advance letter name that day, and what is owed is the principal plus the term's interest.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-nwn rev=1 covers=g10.vault-loan-and-settlement.SC-3g8,g10.vault-loan-and-settlement.SC-72r,g10.vault-loan-and-settlement.SC-6zm,g10.vault-loan-and-settlement.SC-0as,g10.vault-loan-and-settlement.SC-obp,g10.vault-loan-and-settlement.SC-apt,g10.vault-loan-and-settlement.SC-zk2,g10.vault-loan-and-settlement.SC-3mx -->
### g10.vault-loan-and-settlement.US1-TC2: An advance is refused out of its date, by the offer's maker, short of the principal, unreferenced, a second time, or before custody

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-01

**Pre-conditions:**

* A financed case `<case>`, its accepted offer of HKD100,000.00 by `<staff A>`; `<recorder>` is on the payout dialog.

**Test data:**

| `<case>` | `<recorder>` | `<advance>` | `<refusal names>` |
| --- | --- | --- | --- |
| vaulted, sealed 10 September | another treasurer | HKD100,000.00, referenced, valued 9 September | the value date before the seal |
| vaulted, sealed 10 September | another treasurer | HKD100,000.00, referenced, valued tomorrow | the value date in the future |
| vaulted | `<staff A>` | HKD100,000.00, referenced, valued today | the same person pricing and paying out |
| vaulted | another treasurer | HKD90,000.00, referenced | the amount not being the principal |
| vaulted | another treasurer | HKD100,000.00, no bank reference | the bank reference |
| active, advanced already | another treasurer | HKD100,000.00, referenced | the advance already recorded |
| signing, its packet not sealed | another treasurer | HKD100,000.00, referenced | the item not yet in custody |

**Steps:**

1. Record `<advance>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; the case has not moved, and any advance already recorded is unchanged.

---

## g10.vault-loan-and-settlement.US2: Borrower repays and takes the item home

**As a** borrower,
**I want** what I owe to be the same figure whenever I ask, and a part payment
to cut what my arrears run on,
**so that** I can pay some now and the rest later without being charged for
money I have already returned.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-c92 rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC2: Repaying early still owes the whole term's interest, and leaving nothing owed settles the loan

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The worked loan is active; it is 11 September; a treasurer is on its repayment dialog.

**Steps:**

1. Quote the balance for 11 September.
2. Record HKD103,000.00 by bank transfer, with its reference, against that quote.
3. Read the case; as the borrower, read it and the inbox.

**Expected Results:**

* Step 1 quotes HKD103,000.00.
* Step 3: the case reads repaid, owing nothing, never below zero; the borrower is told; a pickup visit may be booked.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-swz rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC3: Overdue days cost the term's own daily rate, and a part payment cuts what they run on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The worked loan is active; `<repaid>`.

**Test data:**

| `<repaid>` | `<quote on 11 October>` |
| --- | --- |
| nothing | HKD104,000.00: the principal, the term's interest, and 10 days at HKD100.00, no fee |
| HKD90,000.00 on 11 September, clearing HKD3,000.00 interest then HKD87,000.00 principal | HKD13,130.00: HKD13,000.00 left and 10 days at HKD13.00 on it alone |

**Steps:**

1. On 11 October, quote the balance.

**Expected Results:**

* It quotes `<quote on 11 October>`, with no compounding and no higher rate.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-hrj rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC6: The same repayment sent twice lands once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The worked loan is active; a treasurer is on its repayment dialog on 11 September.

**Steps:**

1. Record HKD30,000.00 against a quote; submit the same recording again from the reopened dialog.
2. Read the case's repayments and balance.

**Expected Results:**

* The second answers with the first; one HKD30,000.00 repayment stands.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-cf1 rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC4: A repayment is refused against a moved quote, above the balance, or outside its dates

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Recording money

**Pre-conditions:**

* The worked loan is active; a treasurer is on its repayment dialog, `<state>`.

**Test data:**

| `<state>` | `<repayment>` | `<refusal names>` |
| --- | --- | --- |
| a quote taken on 30 September, the loan since stepped overdue | the quoted figure, against that quote | the quote having moved |
| a quote taken, another treasurer then recording a repayment | the quoted figure, against that quote | the quote having moved |
| on 11 September, owing HKD103,000.00 | HKD103,000.01 | the amount above the balance |
| on 11 September | HKD10,000.00, valued 31 August | the value date before the advance |
| on 11 September | HKD10,000.00, valued tomorrow | the value date in the future |

**Steps:**

1. Record `<repayment>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; nothing is written, and the balance is unchanged.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-d8j rev=1 -->
### g10.vault-loan-and-settlement.US2-TC9: Money counts from the day it arrived, wherever it is written down

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The worked loan is active; a treasurer is on its console page.

**Test data:**

| `<recorded>` | `<reads>` |
| --- | --- |
| a transfer that arrived Friday 13 September, written down Monday 16th | value date Friday, recorded Monday; the balance from Friday |
| a repayment valued 20 September, then one valued 5 September | the same balance as if recorded in date order |
| a full repayment on 30 September, then a quote for 20 September | what stood on 20 September |
| a repayment with a bank reference | the audit trail naming the case, amount and method, never the reference |

**Steps:**

1. Record `<recorded>`, and read the case, its quote and its audit trail.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-yps rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC8: A loan still owing keeps its item

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* The worked loan is active, HKD13,000.00 still owing; the borrower is at the counter.

**Steps:**

1. Try to release the item.

**Expected Results:**

* It is refused, naming the balance; the case stays active.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-ypr rev=1 covers=g10.vault-loan-and-settlement.SC-t4w,g10.vault-loan-and-settlement.SC-3d7,g10.vault-loan-and-settlement.SC-1wl,g10.vault-loan-and-settlement.SC-epv,g10.vault-loan-and-settlement.SC-yni,g10.vault-loan-and-settlement.SC-1f2 -->
### g10.vault-loan-and-settlement.US2-TC10: In production a part payment is refused while nowhere to pay is set

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-02

**Pre-conditions:**

* In production, the lender's FPS id is cleared; the worked loan owes HKD103,000.00; a treasurer is at the counter.

**Steps:**

1. Record a repayment of HKD50,000.00.

**Expected Results:**

* It is refused, naming the FPS id; nothing is written.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-6sa rev=1 -->
### g10.vault-loan-and-settlement.US2-TC11: Interest stops at settlement and never passes the principal

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What is owed

**Pre-conditions:**

* The brand's accrual ceiling is 100% of the principal; the worked loan is `<state>`.

**Test data:**

| `<state>` | `<quote at>` | `<owes>` |
| --- | --- | --- |
| settled in full on its due date | a month later | nothing |
| never repaid | 3 years past its due date | HKD200,000.00 at most: interest no more than the principal |

**Steps:**

1. Quote it at `<quote at>`.

**Expected Results:**

* It owes `<owes>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-uvd rev=1 -->
### g10.vault-loan-and-settlement.US2-TC12: A storage case owes nothing at its release

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Ending the loan

**Pre-conditions:**

* A storage case's item is in the vault; admin(holds `vault:operate`) is on it.

**Steps:**

1. Prepare its release.

**Expected Results:**

* Nothing outstanding refuses it.

---

## g10.vault-loan-and-settlement.US3: Treasurer takes back a record the bank rejected

**As a** treasurer,
**I want** a wrong money record taken back in full by a second pair of hands,
**so that** a transfer that never happened stops counting without anybody
rewriting what was written.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-rs2 rev=1 -->
### g10.vault-loan-and-settlement.US3-TC1: A repayment taken back by a second treasurer leaves the loan as if it never was, on the same due date

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-03

**Pre-conditions:**

* The worked loan carries a repayment of HKD90,000.00 recorded by treasurer A.

**Steps:**

1. As treasurer B, take it back with a reason.
2. Quote the loan; as the borrower, read it.

**Expected Results:**

* The quote is what it would be had the repayment never been recorded, still due 1 October; the borrower's case no longer lists it.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-yml rev=1 -->
### g10.vault-loan-and-settlement.US3-TC2: Nobody takes back their own record, and the advance comes back only after the repayments

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-03

**Pre-conditions:**

* The worked loan carries two repayments, recorded by treasurer A.

**Test data:**

| `<taker>` | `<taking back>` | `<refusal names>` |
| --- | --- | --- |
| treasurer A | a repayment A recorded | the same person recording and taking back |
| treasurer B | the advance | the repayments still standing |

**Steps:**

1. As `<taker>`, take back `<taking back>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; every record stands.

---

## g10.vault-loan-and-settlement.US4: Operator takes the collateral only after warning the borrower

**As a** member of shop staff,
**I want** to have to warn the borrower in writing and wait out the date I
gave them,
**so that** nobody's property is taken without notice and a chance to pay.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-5t4 rev=2 covers=g10.vault-loan-and-settlement.SC-4xb,g10.vault-loan-and-settlement.SC-6xk,g10.vault-loan-and-settlement.SC-u4f,g10.vault-loan-and-settlement.SC-ii8,g10.vault-loan-and-settlement.SC-57m -->
### g10.vault-loan-and-settlement.US4-TC2: A forfeiture notice fixes a date to pay by, which the borrower reads and a later policy change does not move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The worked loan is past due with no notice; admin(holds `vault:operate`) is on its Custody tab.

**Steps:**

1. Send the forfeiture notice on 1 November.
2. Shorten the brand's notice period to 7 days.
3. As the borrower, read the case.

**Expected Results:**

* Step 1 names 1 November and a date to pay by of 15 November, saying nothing can be taken before it.
* Step 3 reads 1 November and 15 November, unmoved.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-jph rev=1 covers=g10.vault-loan-and-settlement.SC-4xb,g10.vault-loan-and-settlement.SC-6xk,g10.vault-loan-and-settlement.SC-u4f,g10.vault-loan-and-settlement.SC-ii8,g10.vault-loan-and-settlement.SC-57m -->
### g10.vault-loan-and-settlement.US4-TC3: Nothing is taken before its notice, inside the date given, or once the loan has settled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* admin(holds `vault:operate`) is on the Custody tab of the worked loan, `<state>`.

**Test data:**

| `<state>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| not yet due | send a forfeiture notice | the due date not reached |
| a month past due, no notice | forfeit the item | no notice standing |
| a notice sent three days ago, paying by 15 November | forfeit the item | the date to pay by, the earliest day forfeiture is possible |
| a notice paying by 15 November, the notice period since shortened, it being 10 November | forfeit the item | 15 November, the date the borrower was given |
| repaid after its notice's date passed | forfeit the item | no loan standing |

**Steps:**

1. `<attempt>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; the case and the item stay as they were.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-wgu rev=1 covers=g10.vault-loan-and-settlement.SC-4xb,g10.vault-loan-and-settlement.SC-6xk,g10.vault-loan-and-settlement.SC-u4f,g10.vault-loan-and-settlement.SC-ii8,g10.vault-loan-and-settlement.SC-57m -->
### g10.vault-loan-and-settlement.US4-TC5: Forfeiting after the date given settles the debt with the item, and the borrower is told

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-04

**Pre-conditions:**

* The worked loan's notice date to pay by has passed, nothing repaid; admin(holds `vault:operate`) is on its Custody tab.

**Steps:**

1. Forfeit the item, with a reason.
2. Read the audit trail; as the borrower, read the case and the inbox.

**Expected Results:**

* The case reads forfeited, the item out of custody; the trail records the figure it settled, the notice's day and the date to pay by; the borrower is told.

---

## g10.vault-loan-and-settlement.US5: Borrower knows where to send the money

**As a** borrower with a loan running,
**I want** the page and every money email to name the FPS id, the bank
account, whose name it is under and the reference to type,
**so that** I can pay at my own bank without asking the shop where.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-3kn rev=1 -->
### g10.vault-loan-and-settlement.US5-TC1: A live loan names where to pay, the same on the page and every money letter, and a storage case names none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-05

**Pre-conditions:**

* customer(collector) owns `<case>`; the lender's FPS id and bank account are set.

**Test data:**

| `<case>` | `<page reads>` |
| --- | --- |
| a running loan | the lender's registered name as payee, its FPS id, its bank account, and the case reference to type |
| a storage case in the vault | no block, account or reference |

**Steps:**

1. Read the case; read the latest money letter where there is one.

**Expected Results:**

* The case reads `<page reads>`; a money letter carries the same values.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-ajz rev=1 -->
### g10.vault-loan-and-settlement.US5-TC2: An unset account value prints bracketed outside production, and in production the page shows the counter line instead

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** How to pay

**Pre-conditions:**

* The borrower's loan was advanced while the lender's FPS id is unset, `<environment>`.

**Test data:**

| `<environment>` | `<block reads>` |
| --- | --- |
| outside production | a marked placeholder where the FPS id belongs |
| in production | no payee, FPS id, account or reference; only that payment is taken at the counter |

**Steps:**

1. As the borrower, read the case.

**Expected Results:**

* It reads `<block reads>`.

---

## g10.vault-loan-and-settlement.US6: Borrower follows each repayment and the notice on the page

**As a** borrower who has paid part of the loan or is running late,
**I want** each repayment listed with the day it arrived and the balance after
it, and the final notice with its date to pay by,
**so that** I know what I still owe and how long I have.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-ovu rev=1 -->
### g10.vault-loan-and-settlement.US6-TC1: Each repayment lists with the day it arrived and the balance after it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The borrower's worked loan carries `<repayments>`.

**Test data:**

| `<repayments>` | `<page lists>` |
| --- | --- |
| HKD90,000.00 valued 11 September | HKD90,000.00 on 11 September, HKD13,000.00 left |
| none | no repayment |
| two, the earlier taken back | only the later, with the balance after it alone |

**Steps:**

1. Read the case.

**Expected Results:**

* It lists `<page lists>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-dow rev=1 -->
### g10.vault-loan-and-settlement.US6-TC2: The page names the reminders still ahead, the notice and its date, and what comes next when late

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-06

**Pre-conditions:**

* The borrower's worked loan is `<state>`.

**Test data:**

| `<state>` | `<page reads>` |
| --- | --- |
| running, its 7-day reminder sent | that reminder with its day, and the one still ahead |
| past due, two weekly reminders sent, no notice | both with their days, the next reminder, and the day a notice falls due; no notice or date to pay by |
| past due, a notice written 1 November paying by 15 November | 1 November and 15 November, and no reminder still to come |

**Steps:**

1. Read the case.

**Expected Results:**

* It reads `<page reads>`.

---

## g10.vault-loan-and-settlement.US7: Operator reads the rule before the act

**As an** operator about to write an offer, confirm an item into the vault or
record a payout,
**I want** the dialog to state the bounds, the preconditions and what the
recording fixes — the cap, the presets and the figures the offer derives; the
three things a vaulting needs; the two people, the due date and the reminder
days a payout sets — before I send,
**so that** I act knowing the rule rather than learning it from a refusal.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-il5 rev=1 covers=g10.vault-loan-and-settlement.SC-adf,g10.vault-loan-and-settlement.SC-pbl,g10.vault-loan-and-settlement.SC-kf3,g10.vault-loan-and-settlement.SC-znu,g10.vault-loan-and-settlement.SC-xm5 -->
### g10.vault-loan-and-settlement.US7-TC1: The offer dialog states the cap, the presets and the figures it derives, and names a bound the entry fails

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* admin(holds `vault:approve`) opens Make an offer on a case under valuation whose cap puts the principal at HKD40,000.00.

**Test data:**

| `<entered>` | `<dialog reads>` |
| --- | --- |
| HKD100,000.00 at 250 basis points over 30 days, on a case valued at HKD250,000.00 | HKD2,500.00 interest, HKD102,500.00 to repay, the late-day figure, the annualised rate, the cap, the presets and the day the offer stays open until |
| HKD50,000.00 | the cap as unmet and what it requires, Make the offer still there to press |

**Steps:**

1. Enter `<entered>`, without sending.

**Expected Results:**

* The dialog reads `<dialog reads>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-i0m rev=1 covers=g10.vault-loan-and-settlement.SC-adf,g10.vault-loan-and-settlement.SC-pbl,g10.vault-loan-and-settlement.SC-kf3,g10.vault-loan-and-settlement.SC-znu,g10.vault-loan-and-settlement.SC-xm5 -->
### g10.vault-loan-and-settlement.US7-TC2: A bound nobody set reads as not set, refusing in production and passing outside it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The brand's loan-to-value cap is unset, `<environment>`; admin(holds `vault:approve`) opens Make an offer on a case under valuation.

**Test data:**

| `<environment>` | `<send>` |
| --- | --- |
| production | refused by name before the act |
| outside production | made |

**Steps:**

1. Enter an offer inside every set bound, read the dialog, and send.

**Expected Results:**

* The dialog reads the cap as not set; the offer is `<send>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-zyo rev=1 covers=g10.vault-loan-and-settlement.SC-adf,g10.vault-loan-and-settlement.SC-pbl,g10.vault-loan-and-settlement.SC-kf3,g10.vault-loan-and-settlement.SC-znu,g10.vault-loan-and-settlement.SC-xm5 -->
### g10.vault-loan-and-settlement.US7-TC3: The vault dialog states what a vaulting needs, naming the one missing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* admin(holds `vault:operate`) opens the vault dialog from the Custody tab of a case signing, `<state>`.

**Test data:**

| `<state>` | `<dialog reads>` |
| --- | --- |
| its packet executed and its identity bound | both met; a shop required and a locker optional; no visit slot asked |
| its packet executed, no identity bound | the identity as missing |

**Steps:**

1. Read the dialog, without confirming.

**Expected Results:**

* It reads `<dialog reads>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-4wk rev=1 covers=g10.vault-loan-and-settlement.SC-adf,g10.vault-loan-and-settlement.SC-pbl,g10.vault-loan-and-settlement.SC-kf3,g10.vault-loan-and-settlement.SC-znu,g10.vault-loan-and-settlement.SC-xm5 -->
### g10.vault-loan-and-settlement.US7-TC4: The payout dialog states its two people, its rules and the dates it will fix, following the value date

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-loan-and-settlement-US-07

**Pre-conditions:**

* The case is vaulted with an accepted 30-day offer by `<staff A>`; `<opener>` opens the payout dialog.

**Test data:**

| `<opener>` | `<value date>` | `<dialog reads>` |
| --- | --- | --- |
| another treasurer | 1 September | the two-people rule met; the amount equal to the principal and the reference required; due 1 October, reminders 7 and 1 days before |
| another treasurer | changed from 1 to 2 September | due 2 October, the reminders a day later |
| `<staff A>` | 1 September | the two-people rule unmet, and what it requires |

**Steps:**

1. Enter an amount, a reference and `<value date>`, without submitting.

**Expected Results:**

* The dialog reads `<dialog reads>`.

<!-- trace:case id=g10.vault-loan-and-settlement.TC-y3s rev=1 covers=g10.vault-loan-and-settlement.SC-9pz -->
### g10.vault-loan-and-settlement.US7-TC6: A recording is refused on its own rule even when the dialog said so first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** The rule before the act

**Pre-conditions:**

* The payout dialog, opened by `<staff A>` on the case they priced, reads the two-people rule unmet.

**Steps:**

1. Fill the payout anyway, and submit.

**Expected Results:**

* It is refused by name, as if the dialog had said nothing; the case stays vaulted.

## Settled

- A repayment's recorder is unconstrained: the two-person split guards the payout alone.
- Taking a money record back is the console's act, walked by `grade10-admin/vault/money-book`; this suite reads what follows.
- What stands between the last reminder and a notice is named on the case: the last reminder with its day, and the day a notice falls due.
- A production borrower reads only the counter line while the FPS id or bank account is unset (Q19).
- Refusing an act whose letter would print an unset value belongs to `grade10-site/vault/collector-notifications`.
- The annualised rate is the term's interest over the principal, read over a year, to one decimal place.
