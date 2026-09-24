# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt that says what was billed, paid before it, paid now and
what is still owed,
**so that** I can account for a high-value purchase without asking Grade10 for
records.

### winner-order-US2-TC4-1: A full payment receipt shows zero previous and remaining

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* An auction order has an invoice total of 100000 minor units in HKD and one
  confirmed payment of 100000 minor units.

**Steps:**

1. Open the payment receipt.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 0.
* Current Payment Received is 100000 minor units in HKD.
* Remaining Balance Due is 0.

### winner-order-US2-TC5-1: Ordered partial receipts preserve the payment history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* An auction order has an invoice total of 100000 minor units in HKD.
* Its first payment is 40000 minor units and its second payment is 30000
  minor units, recorded in that order.

**Steps:**

1. Open the receipt for the first payment.
2. Open the receipt for the second payment.

**Expected Results:**

* The first receipt shows Original Invoice Total 100000, Previous Payments 0,
  Current Payment Received 40000 and Remaining Balance Due 60000, all in minor
  units of HKD.
* The second receipt shows Original Invoice Total 100000, Previous Payments
  40000, Current Payment Received 30000 and Remaining Balance Due 30000, all in
  minor units of HKD.

### winner-order-US2-TC6-1: A tolerance-close receipt floors the remaining balance at zero

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* An auction order has an invoice total of 100000 minor units in HKD.
* 90000 minor units have already been paid.
* The operator records a 5000-minor-unit payment and closes the invoice as
  Paid within the agreed closing tolerance.

**Steps:**

1. Open the receipt for the closing payment.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 90000 minor units in HKD.
* Current Payment Received is 5000 minor units in HKD.
* Remaining Balance Due is 0.
* The receipt contains no shortfall or write-off line.

### winner-order-US2-TC7-1: A confirmed overpayment receipt records the full payment

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* An auction order has an invoice total of 100000 minor units in HKD.
* The operator confirms a payment of 110000 minor units.

**Steps:**

1. Open the payment receipt.

**Expected Results:**

* Original Invoice Total is 100000 minor units in HKD.
* Previous Payments is 0.
* Current Payment Received is 110000 minor units in HKD.
* Remaining Balance Due is 0.
* The receipt contains no negative balance or credit line.

### winner-order-US2-TC8-1: A refund or reversal does not rewrite issued receipts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* An auction order has an invoice total of 100000 minor units in HKD.
* Payments of 20000, 30000 and 10000 minor units were recorded in that order,
  with one receipt issued for each.
* The second payment is later refunded or reversed.

**Steps:**

1. Open the first receipt.
2. Open the second receipt.
3. Open the third receipt.

**Expected Results:**

* The first receipt still shows Previous Payments 0, Current Payment Received
  20000 and Remaining Balance Due 80000.
* The second receipt still shows Previous Payments 20000, Current Payment
  Received 30000 and Remaining Balance Due 50000.
* The third receipt still shows Previous Payments 50000, Current Payment
  Received 10000 and Remaining Balance Due 40000.
* No issued receipt is reissued.

## Settled

- Receipt and invoice identifier formats remain out of scope.
- Winner Order's live balance remains out of scope; only receipt values are
  covered here.
- Receipt contents after a tolerance-close or confirmed overpayment use
  `Remaining Balance Due = 0`.
- Refunds and reversals preserve issued receipts; this suite does not define
  what a later payment may do.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The full-payment receipt's fixed zero values did not describe ordered partial payments | **Folded in:** `winner-order-SC-205` / `winner-order-US2-TC5-1` |
| Tolerance-close behavior was settled by the partial-payment change but was absent from the receipt requirement and suite | **Folded in:** `winner-order-SC-206` / `winner-order-US2-TC6-1` |
| Overpayment behavior was settled as recording the full payment with no credit; it was absent from the receipt requirement and suite | **Folded in:** `winner-order-SC-207` / `winner-order-US2-TC7-1` |
| Refund/reversal immutability was required by the decisions but had no receipt case | **Folded in:** `winner-order-SC-208` / `winner-order-US2-TC8-1` |
| Receipt and invoice identifier formats conflict across existing material | **Kept unresolved:** no identifier assertion is added; it is addressed by `define-public-auction-identifiers` |
| Winner Order must not show the receipt's balance as a live order balance | **Kept out of scope:** already settled by `add-winner-partial-payment` |
| Future payments after a refund or reversal | **Kept out of scope:** no behavior is asserted after the immutability check |
