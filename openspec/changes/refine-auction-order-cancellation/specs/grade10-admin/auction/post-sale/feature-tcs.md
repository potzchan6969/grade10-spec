# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US13: Operator cancels an order knowing what follows

**As an** operator with payment processing,
**I want** to choose a reason and see the consequences before confirming,
**so that** every cancellation is deliberate and countable.

<!-- trace:case id=g10adm.auction-post-sale.TC-atu rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-f0r rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-hmz rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC3-1: A cancelled order links to its returned lot

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

* An unpaid auction order has been cancelled and its lot returned to stock.

**Steps:**

1. Open the cancelled order.
2. Follow its lot link.

**Expected Results:**

* The link opens the same lot, available for manual relisting.

<!-- trace:case id=g10adm.auction-post-sale.TC-2ai rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC4-1: Money that counts toward nothing does not block cancellation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* An unpaid order has a recorded card payment that counts toward nothing.

**Steps:**

1. Cancel the order with a category and note.

**Expected Results:**

* Cancellation succeeds, the order reads Cancelled and the lot returns to stock.
* The recorded payment remains available for Finance to return outside Grade10.

<!-- trace:case id=g10adm.auction-post-sale.TC-0dj rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC5-1: Money that counts toward the balance blocks cancellation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* An unpaid order has a card payment that counts toward the balance committing before cancellation.

**Steps:**

1. Confirm cancellation with a category and note.

**Expected Results:**

* Cancellation is refused with "This order has a recorded payment. Refund it instead of cancelling."
* The order reads Paid and the lot stays with it.

## post-sale-US14: Operator returns money paid after a cancel

**As an** operator,
**I want** a late card payment to remain flagged until Finance returns it,
**so that** no winner pays for a cancelled lot without a follow-up.

<!-- trace:case id=g10adm.auction-post-sale.TC-qn8 rev=1 covers=g10adm.auction-post-sale.SC-23g -->
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

**Expected Results:**

* The payment is kept in the invoice log.
* The order remains Cancelled and shows Paid after cancel.

<!-- trace:case id=g10adm.auction-post-sale.TC-5vf rev=3 covers=g10adm.auction-post-sale.SC-23g,g10adm.auction-post-sale.SC-18a -->
### post-sale-US14-TC2-3: Clearing the late-payment flag keeps the order cancelled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-14

**Pre-conditions:**

* A cancelled order has two late payments, each with its own Paid after cancel flag.
* Finance returned both payments outside Grade10; one has a return reference and one has none (the first none, the second one).

**Steps:**

1. As an operator holding `auction:payment`, clear the first payment's flag with a written reason and no return reference.
2. Check the second payment's flag.
3. Clear the second flag with a written reason and its return reference.

**Expected Results:**

* Each clear action succeeds and records the reason, actor and timestamp.
* The first records no return reference; the second records its supplied one.
* After step 1 the second payment is still flagged.
* The order remains Cancelled and its lot remains in stock.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Cancellation is reasoned, terminal and flags late payment without revival | **Folded in:** `grade10-admin-auction-post-sale-SC-230`–`SC-236` |
