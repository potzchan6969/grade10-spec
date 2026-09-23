# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## auction-status-US1: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an expired invoice to stay Pending Payment without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US1-TC1-1: Expired keeps Pending Payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** auction-status-US-01

**Pre-conditions:**

* Auction order invoice becomes `expired` at the deadline.

**Steps:**

1. Read derived order status.

**Expected Results:**

* Order status is Pending Payment.
* No Expired order status value is produced.

### auction-status-US1-TC2-1: Winner card pay is refused when expired

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** auction-status-US-01

**Pre-conditions:**

* Invoice status is `expired`.

**Steps:**

1. Submit a winner card payment for the invoice.

**Expected Results:**

* Payment is refused.
* Invoice remains `expired`.
* Order status remains Pending Payment.

### auction-status-US1-TC3-1: Operator manual settle pays an expired invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** auction-status-US-01

**Pre-conditions:**

* Invoice status is `expired`; operator holds payment-processing.

**Steps:**

1. Operator records a manual settlement with method and proof.

**Expected Results:**

* Invoice becomes `paid`.
* Order derives as Processing.

## Raised

- None for this slice.

## auction-status-US2: Refund is terminal after partial collection

**As a** winner or operator,
**I want** a refunded order to remain terminal,
**so that** later payment events cannot reopen it.

### auction-status-US2-TC1-1: A refund is terminal after partial collection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has invoice status `refunded` after partial payment and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Refunded.
* It does not return to Partially Paid or Processing.

### auction-status-US2-TC2-1: An overpayment keeps the existing status

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
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has a payment above its invoice total and the difference has been returned.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order keeps its status from before the overpayment return.
* The status is not Refunded.

## Settled

- Winner card pay after expiry removed (author @tangconst).
- Operator paths on expired remain.
