# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US12: Operator collects a lot's price across more than one payment

**As an** operator,
**I want** to record each payment as it arrives and see the order until it is settled,
**so that** every partial payment is recorded without tracking the balance outside Grade10.

<!-- trace:case id=g10adm.auction-post-sale.TC-yws rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-3z7 rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-uz7 rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC3-1: An incomplete payment stays Partially Paid

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
2. Record an exact 5000-minor-unit balance payment.

**Expected Results:**

* Step 1 leaves the order Partially Paid with the real 5000-minor-unit balance.
* Step 2 closes the invoice as Paid without a prompt.

<!-- trace:case id=g10adm.auction-post-sale.TC-qpm rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC4-1: An overpayment needs confirmation before Paid

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

1. Enter a payment of 15000 minor units.
2. Confirm the overpayment dialog.

**Expected Results:**

* The dialog appears before the payment is recorded and the invoice is marked Paid.
* The full 15000-minor-unit payment is recorded.
* The invoice is Paid and the excess is not a separate adjustment line.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Exact-total closure and confirmed overpayment | **Folded in:** `grade10-admin-auction-post-sale-SC-140` through `SC-143` |
