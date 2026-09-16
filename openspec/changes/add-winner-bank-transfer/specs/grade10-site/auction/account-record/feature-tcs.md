# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** to see what I owe and where my card is,
**so that** I do not have to ask Grade10 what happens next.

### grade10-site-auction-account-record-US3-TC1-1: A won lot under proof check reads Payment Verifying

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* <lot_1> is Payment Verifying.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the <lot_1> row.

**Expected Results:**

* Your Standing reads Won with Payment Verifying.
* View order is offered; no helper lines.

### grade10-site-auction-account-record-US3-TC2-1: The row follows the check outcome

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* An operator <action> on <lot_1>.

**Test data:**

| <action> | <status> |
| --- | --- |
| returned the proof | Pending Payment |
| confirmed the payment | Processing |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the <lot_1> row.

**Expected Results:**

* The row reads <status>.

### grade10-site-auction-account-record-US3-TC3-1: Several won lots each read their own status

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
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner of <lot_1> and <lot_3>) is signed in.
* <lot_1> is Payment Verifying; <lot_3> is Pending Payment.

**Steps:**

1. Navigate to <grade10 my auctions url>.

**Expected Results:**

* <lot_1> reads Payment Verifying.
* <lot_3> reads Pending Payment.

### grade10-site-auction-account-record-US3-TC4-1: Another collector never sees the Payment Verifying row

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer B is signed in.
* <lot_1> is customer A's, Payment Verifying.

**Steps:**

1. Navigate to <grade10 my auctions url>.

**Expected Results:**

* No <lot_1> row is shown.

## Raised

- Does a Payment Verifying row carry anything beyond the badge and View order? Calm Won rows suggest not; assumed so.

## Reconciliation

**Status:** paused — waiting on the author (@jeffffej0909) for a grilling round on
decisions neither reading could settle: proof on an expired invoice, operator
actions while Payment Verifying, the deadline on an expired reissue, the method
choice before send, reminders and the letter after a return, grace after a
return, what the winner sees of their proof, non-card settlement of a card
invoice, operator files on confirm, file rules, and who reads proof files.

**Blind input manifest hash:** `2c7380f5cdff72fd`
