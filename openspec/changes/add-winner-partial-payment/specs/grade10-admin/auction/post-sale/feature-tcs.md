# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US12: Operator collects a lot's price across more than one payment

**As an** operator,
**I want** to record each payment as it arrives and see the order until it is settled,
**so that** every partial payment is recorded without tracking the balance outside Grade10.

### post-sale-US12-TC1-1: A partial payment starts collection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<pending invoice>` is unpaid and its balance is 100000 minor units in HKD.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Record a 40000-minor-unit payment with its method, reference and proof.

**Expected Results:**

* The payment is accepted.
* The order outcome is Partially Paid.
* The payment record has its own receipt number and the remaining balance is 60000 minor units.

### post-sale-US12-TC2-1: Repeated payments keep one order history

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has one recorded payment and money remains due.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Record a second payment smaller than the current balance.
2. Read the payment history and the order outcome.

**Expected Results:**

* The second payment is accepted as a new payment.
* Both payments remain in oldest-first order.
* The order remains Partially Paid until its invoice is closed.

### post-sale-US12-TC3-1: The closing prompt does not discard the payment

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has cumulative payments of 90000 minor units against an original total of 100000 minor units.
* admin(holds payment-processing) is recording another payment.

**Steps:**

1. Record a payment of 5000 minor units.
2. Choose to keep the invoice open.
3. Record an exact 5000-minor-unit balance payment.

**Expected Results:**

* Step 1 asks whether to close or keep collecting.
* Step 2 leaves the order Partially Paid with the real balance.
* Step 3 closes the invoice as Paid without a second prompt.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Overpayment and close-or-keep boundary | **Folded in:** `grade10-admin-auction-post-sale-SC-140`–`SC-142` |
