# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r1

## winner-order-US7: Winner pays an invoice with a policy premium

**As a** winner of an auction lot,
**I want** my invoice to calculate the stated buyer premium correctly and meet
the current currency minimum,
**so that** the amount I pay is explainable and collectible.

### winner-order-US7-TC1-1: Invoice applies the fixed premium

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* The winning bid is 250000 HKD minor units and an invoice is being created.

**Steps:**

1. Read the invoice lines and total.

**Expected Results:**

* Buyer premium is 50000 HKD minor units.
* The total includes the premium.

### winner-order-US7-TC2-1: A configured minimum replaces a lower percentage premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* The HKD minimum buyer premium is 20000 minor units.
* The winning bid is 500 HKD minor units.

**Steps:**

1. Create the winner invoice.

**Expected Results:**

* The premium is 20000 HKD minor units, not 1000 HKD minor units.

### winner-order-US7-TC3-1: A zero minimum rounds the percentage premium

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* The JPY minimum buyer premium is 0 minor units.
* The winning bid is 1003 JPY minor units.

**Steps:**

1. Create the winner invoice.

**Expected Results:**

* The premium is 201 JPY minor units.

### winner-order-US7-TC4-1: A sent invoice keeps its premium after the minimum changes

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* An invoice was sent with a 0 HKD minimum and a 500 HKD winning bid.

**Steps:**

1. Change the HKD minimum buyer premium to 20000 minor units.
2. Read the sent invoice.
3. Reissue the invoice.

**Expected Results:**

* The sent invoice still shows a 100 HKD premium.
* The reissued invoice shows a 20000 HKD premium.

## Raised

- The latest product reading confirms that invoice creation remains the point at which the 20% premium amount is calculated; no unresolved product question remains.

## Settled

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
