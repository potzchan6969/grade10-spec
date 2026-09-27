# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4

**Out of suite:** none for this change's scenarios. The durable suite keeps the unchanged parts of the journey.

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC30-1: Tax is pending before the invoice is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds an auction order whose invoice has not been sent.

**Steps:**

1. Open Winner Order.
2. Read Tax in Order Summary and open its info tip.

**Expected Results:**

* Tax reads TBD with the other fee rows.
* No calculated Tax amount is shown.
* The tip reads `Set by Grade10 for where your order ships. Some orders have none.`

### winner-order-US1-TC31-1: Sent tax is itemised throughout the order record

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose invoice includes Tax of 6000 minor units in HKD.

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* Each surface shows Tax of 6000 minor units in HKD between Insurance and Subtotal.
* Order Summary offers the Tax info tip with the stated copy.
* The Subtotal includes the 6000 minor units in HKD.

### winner-order-US1-TC32-1: An untaxed invoice leaves Tax out

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order whose operator added no Tax.

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.

**Expected Results:**

* No surface shows a Tax line.
* Order Summary offers no Tax info tip.

### winner-order-US1-TC33-1: Card fee is grossed up on tax

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a card invoice whose lines before Tax total 312000 minor units in HKD.
* The operator adds Tax of 6000 minor units in HKD.

**Steps:**

1. Send the invoice.
2. Read its Subtotal and payment processing fee inputs.

**Expected Results:**

* The Subtotal is 318000 minor units in HKD.
* Grade10 computes the payment processing fee from that Subtotal.

## Reconciliation

**Run:** The blind pass read the Purpose, Feature set, `winner-order-US-01`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Raised:**

- The blind pass separated the pre-send, taxed, untaxed, and card-fee-base partitions. The scenario pass covers each one across `winner-order-SC-212` through `-SC-217`.
- The blind pass required the invoice and receipt to carry the amount. `winner-order-SC-214` and the modified Invoice fields requirement cover their shared itemisation rule; no new product decision was needed.

**Out of suite:** none.
