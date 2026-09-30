# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** none for this change's new scenarios; the scenarios it restates unchanged keep their durable cases.

## auction-status-US1: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US1-TC16-1: A card payment landing on an expired invoice pays it, flagged Paid late

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
* **Trace:** Writable primitives

**Pre-conditions:**

* An auction order's card invoice of 323225 minor units in HKD is `expired`.

**Steps:**

1. Complete a card payment of 323225 minor units in HKD for the invoice.
2. Read the invoice status, the payment and the derived order status.

**Expected Results:**

* The invoice status is `paid`.
* The payment is recorded and flagged Paid late.
* The order derives as Preparing Shipment.

### auction-status-US1-TC17-1: A card payment landing on a checked invoice moves nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Guards

**Pre-conditions:**

* An auction order's invoice is `payment_verifying`.

**Steps:**

1. Report a completed card payment for the order total against the invoice, as the payment provider would.
2. Read the invoice status, the payment and the derived order status.

**Expected Results:**

* The payment is recorded and flagged Unexpected status, and counts toward nothing.
* The invoice status is still `payment_verifying`.
* The order still derives as Payment Verifying.

### auction-status-US1-TC18-1: A card payment on a cancelled invoice moves no status

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Guards

**Pre-conditions:**

* The winner started a card payment for an auction order's total, and an operator then cancelled the order.

**Steps:**

1. Complete that card payment.
2. Read the invoice status, the payment and the derived order status.

**Expected Results:**

* The payment is recorded and flagged Paid after cancel, and counts toward nothing.
* The invoice status is still `cancelled`.
* The order still derives as Cancelled.

### auction-status-US1-TC19-1: No card payment starts on an expired or checked invoice

Runs once per row of **Test data**.

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

* An auction order's invoice is in the row's invoice status.

**Test data:**

| Invoice status | The order derives as |
| --- | --- |
| `expired` | Payment Overdue |
| `payment_verifying` | Payment Verifying |

**Steps:**

1. As the winner, try to start a card payment for the invoice.
2. Read the invoice status and the derived order status.

**Expected Results:**

* No card payment starts, and no card is charged.
* The invoice status is unchanged.
* The order derives as the row's **The order derives as**.

## Settled

- A card payment that completes is never turned away: at the order total it pays a pending invoice, and an expired one flagged Paid late; anywhere else it is recorded, flagged, and moves nothing.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the journey and the post-sale requirement on money that lands, then joined to the scenarios on their anchors.

- **Covered:** `auction-status-SC-55` ← `US1-TC16-1`; `-SC-56` ← `US1-TC17-1`; `-SC-57` ← `US1-TC18-1`; `-SC-25` and `-SC-46` ← `US1-TC19-1`.
- **Kept with the durable suite:** the restated scenarios whose lines did not move.
- **Out of suite:** none.
