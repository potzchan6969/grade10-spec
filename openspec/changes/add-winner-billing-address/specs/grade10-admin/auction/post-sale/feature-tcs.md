# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance when the card needs it, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

### post-sale-US5-TC1-1: The quote shows Bill To and Ship To

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order ready for a quote.

**Test data:**

| Field | Value |
| --- | --- |
| <order_1> | An order with different billing and delivery snapshots |

**Steps:**

1. Open the quote for <order_1>.

**Expected Results:**

* The quote shows Bill To and Ship To separately.
* Both addresses match the order snapshots.

---

## post-sale-US11: Operator adds a missing billing address before sending

**As an** operator,
**I want** to add the billing address to an order that has none before I send its invoice,
**so that** no invoice goes out without a billing address the winner gave.

### post-sale-US11-TC1-1: Send is refused when billing is missing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-11

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order with a delivery address and no billing address.

**Steps:**

1. Submit the invoice for sending.

**Expected Results:**

* Sending is refused.
* The refusal names the missing billing address.
* No invoice is sent.

### post-sale-US11-TC2-1: The operator records billing and then sends

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
* **Trace:** post-sale-US-11

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order with a delivery address and no billing address.

**Steps:**

1. Open the address edit.
2. Leave Same as delivery address selected.
3. Record the billing address with a reason.
4. Submit the invoice for sending.

**Expected Results:**

* The phone record captures billing as the delivery address.
* The quote shows Bill To and Ship To.
* The invoice is sent.

## Reconciliation

- The quote address path was covered as `post-sale-SC-11`.
- Missing-send refusal and operator completion were covered as `post-sale-SC-11` and `post-sale-SC-12`.
