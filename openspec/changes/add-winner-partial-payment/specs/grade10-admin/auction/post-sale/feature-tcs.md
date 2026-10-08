# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/6
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

<!-- trace:case id=g10adm.auction-post-sale.TC-mrv rev=1 covers=g10adm.auction-post-sale.SC-9nm,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC5-1: Paid is refused below the closing tolerance

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has cumulative payments of 80000 minor units against an original total of 100000 minor units.
* admin(holds payment-processing) is recording another payment.

**Steps:**

1. Record a payment of 5000 minor units and try to update the invoice to Paid.
2. Record a further payment of 5000 minor units.

**Expected Results:**

* Step 1 is refused because 85000 minor units is below 90% of the original total; the payment is recorded and the order reads Partially Paid with the real 15000-minor-unit balance.
* Step 2 brings the total to 90000 minor units and offers the choice to close as Paid or keep collecting.

<!-- trace:case id=g10adm.auction-post-sale.TC-pfj rev=1 covers=g10adm.auction-post-sale.SC-pxo -->
### post-sale-US12-TC6-1: A recorded payment fixes the invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has one recorded payment of 40000 minor units.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Try to reissue the invoice.
2. Try to cancel the order.
3. Open Record payment.

**Expected Results:**

* Steps 1 and 2 are refused and the invoice's address, method and total are unchanged.
* Step 3 offers Record payment and the order remains Partially Paid.

<!-- trace:case id=g10adm.auction-post-sale.TC-dwh rev=1 covers=g10adm.auction-post-sale.SC-mhe -->
### post-sale-US12-TC7-1: Money that counts toward nothing leaves Reissue and Cancel open

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

* `<first order>` and `<second order>` are in Pending Payment, and each one's only recorded payment counts toward nothing.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Reissue `<first order>`'s invoice with a reason.
2. Cancel `<second order>` with a reason.

**Expected Results:**

* Step 1 is accepted and `<first order>` reads Pending Payment on a new invoice.
* Step 2 is accepted and `<second order>` reads Cancelled.
* Each payment is still recorded on its order.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Overpayment, close-or-keep boundary and the refusal below the tolerance | **Folded in:** `grade10-admin-auction-post-sale-SC-140`–`SC-144` |
| Reissue and Cancel refused once a payment is recorded | **Folded in:** `grade10-admin-auction-post-sale-SC-217` |
| Money that counts toward nothing blocks neither Reissue nor Cancel | **Folded in:** `grade10-admin-auction-post-sale-SC-242`; carried here for `complete-auction-post-sale`, since one in-flight change edits a requirement at a time |
| Partially Paid sits in Waiting on winner, not Needs action | **Deferred:** `complete-auction-post-sale` modifies "The queue shows one outcome per lot" and carries it; one in-flight change may edit a requirement at a time |
