# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US13: Operator cancels an order knowing what follows

**As an** operator with payment processing,
**I want** to choose a reason and see the consequences before confirming,
**so that** every cancellation is deliberate and countable.

### post-sale-US13-TC1-1: The cancellation dialog requires the reason and consequences

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* `<unpaid order>` is cancellable.
* admin(holds payment-processing) is on its detail.

**Steps:**

1. Open Cancel and inspect the dialog.
2. Submit without a category or note.
3. Choose Missed setup, enter a note and confirm.

**Expected Results:**

* The dialog names stock return, no runner-up, winner email, suspension retention and irreversibility.
* The incomplete form is refused.
* The cancel is accepted with the selected category and note.
* The lot is back in stock and the order links to it for manual relisting.

### post-sale-US13-TC2-1: Cancellation categories filter the queue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* The queue contains cancelled orders with different reason categories.

**Steps:**

1. Filter cancelled orders to Lot issue.

**Expected Results:**

* Only orders cancelled for Lot issue are returned.

## post-sale-US14: Operator returns money paid after a cancel

**As an** operator,
**I want** a late card payment to remain flagged until finance returns it,
**so that** no winner pays for a cancelled lot without a follow-up.

### post-sale-US14-TC1-1: A late payment is flagged without reviving the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-14

**Pre-conditions:**

* `<cancelled order>` is terminal and its lot is available.

**Steps:**

1. Record a card payment received after cancellation.
2. Record that finance returned the money and clear the flag with a reason.

**Expected Results:**

* The payment is kept in the invoice log.
* The order remains Cancelled and shows Paid after cancel.
* Clearing records the operator and reason and removes the flag.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Cancellation is reasoned, terminal and flags late payment without revival | **Folded in:** `grade10-admin-auction-post-sale-SC-150`–`SC-152` |
