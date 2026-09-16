# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r1

## winner-order-US3: Winner checks the buyer's premium on an invoice

**As a** winner,
**I want** the buyer's premium on my invoice to follow one published rule,
**so that** I can check what I am charged on top of my winning bid.

### winner-order-US3-TC1-1: Premium is 20% of the winning bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-03

**Pre-conditions:**
The HKD minimum charge is 20000 minor units. An auction order in Preparing Invoice with a winning bid of HKD 2,500.00.

**Steps:**

1. As an operator, open the order and send its invoice.
2. As the winner, open the invoice.

**Expected Results:**

* Step 1 offers no buyer's premium input.
* Step 2 shows a buyer's premium of HKD 500.00.

### winner-order-US3-TC2-1: Minimum charge replaces a lower 20%

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
* **Trace:** winner-order-US-03

**Pre-conditions:**
The HKD minimum charge is 20000 minor units. An auction order in Preparing Invoice with a winning bid of HKD 500.00.

**Steps:**

1. As an operator, send the invoice.
2. As the winner, open the invoice.

**Expected Results:**

* The buyer's premium is HKD 200.00, not HKD 100.00.

### winner-order-US3-TC3-1: Zero minimum rounds 20% half up

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-03

**Pre-conditions:**
The JPY minimum charge is 0. An auction order in Preparing Invoice with a winning bid of ¥1,003.

**Steps:**

1. As an operator, send the invoice.

**Expected Results:**

* The buyer's premium is ¥201.

### winner-order-US3-TC4-1: Sent invoice keeps its premium after the minimum changes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-03

**Pre-conditions:**
An invoice sent with a winning bid of HKD 500.00 and a buyer's premium of HKD 100.00 while the HKD minimum was 0.

**Steps:**

1. Change the HKD minimum charge to 20000 minor units.
2. As the winner, open the sent invoice.
3. As an operator, reissue the invoice for that order.

**Expected Results:**

* Step 2 still shows HKD 100.00.
* Step 3's invoice shows HKD 200.00.
