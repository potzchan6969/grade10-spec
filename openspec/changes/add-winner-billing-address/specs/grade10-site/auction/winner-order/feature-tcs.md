# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

### winner-order-US2-TC1-1: A receipt keeps the invoice addresses

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

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> and has paid <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A paid order with different Bill To and Ship To snapshots |

**Steps:**

1. Open the invoice for <lot_1>.
2. Open the receipt for <lot_1>.

**Expected Results:**

* The invoice shows Bill To and Ship To.
* The receipt shows the same two addresses as the invoice it pays.

---

## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

### winner-order-US11-TC1-1: Same as delivery is the default billing choice

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Setup.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed HKD lot with a complete delivery address available |

**Steps:**

1. Choose a saved delivery address.
2. Open the billing address step.

**Expected Results:**

* Same as delivery address is selected by default.
* The delivery address is shown as the billing address.

### winner-order-US11-TC2-1: A different saved address becomes Bill To

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Setup.
* The customer has a saved delivery address and a different saved billing address.

**Steps:**

1. Choose the saved delivery address.
2. Clear Same as delivery address.
3. Choose the different saved address.
4. Choose a payment method.
5. Complete order setup.

**Expected Results:**

* The order reads Preparing Invoice.
* The delivery address remains Ship To.
* The different saved address is recorded as Bill To.

### winner-order-US11-TC3-1: A one-time billing address works at the address-book cap

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in on <grade10 winner order url> for <lot_1>, status Awaiting Setup.
* The customer's address book already has five saved addresses.

**Steps:**

1. Clear Same as delivery address.
2. Add a new billing address without saving it.
3. Choose a payment method.
4. Complete order setup.

**Expected Results:**

* The one-time address is accepted for this order.
* The address book is not given a sixth saved address.
* The order records the one-time address as Bill To.

## Reconciliation

- The settled-lot receipt path was covered as `winner-order-SC-154`.
- Same-as-delivery default was covered as `winner-order-SC-152`.
- Different saved and one-time billing addresses were covered as `winner-order-SC-153` and a new boundary case.
- The invoice and receipt snapshot rule was covered as `winner-order-SC-154`.
