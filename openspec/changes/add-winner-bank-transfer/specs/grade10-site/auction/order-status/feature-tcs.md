# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## auction-status-US1: Auction order status

**As a** winner or operator reading an auction order,
**I want** the order to name one status for payment proof waiting on a check,
**so that** the deadline, card pay and the queue all follow it.

### auction-status-US1-TC4-1: Proof upload writes payment_verifying on a pending invoice

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

* <order_1> has a bank transfer invoice, status `pending`.

**Steps:**

1. Record a winner proof upload on <order_1>.
2. Read the invoice status.

**Expected Results:**

* The invoice status is `payment_verifying`.

### auction-status-US1-TC5-1: The deadline does not run while proof is checked

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

* <order_1> became `payment_verifying` with <time left> kept.
* The original deadline has since passed.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 1 day 2 hours at upload |

**Steps:**

1. Read the invoice status and the kept time left.
2. Read the winner's bidding restriction.

**Expected Results:**

* The invoice is still `payment_verifying`, never `expired`.
* Time left still reads <time left>.
* No suspension was applied.

### auction-status-US1-TC6-1: A return writes pending and resumes the time left

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

* <order_1> is `payment_verifying` with <time left> kept.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 1 day 2 hours |
| <return time> | When the return is recorded |

**Steps:**

1. Return the invoice at <return time>.
2. Read status and deadline.

**Expected Results:**

* The invoice status is `pending`.
* The deadline is <return time> plus <time left>.

### auction-status-US1-TC7-1: Confirming proof writes paid

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

* <order_1> is `payment_verifying`.

**Steps:**

1. Confirm the payment.
2. Read the invoice status and order status.

**Expected Results:**

* The invoice status is `paid`.
* The order status is Processing.

### auction-status-US1-TC8-1: Operator settlement goes from pending straight to paid

**Classification:**

* **Severity:** major
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

* <order_1> has an invoice, status `pending`.

**Steps:**

1. Record an operator settlement with one proof file.
2. Read the invoice history.

**Expected Results:**

* The invoice is `paid`.
* It never passed through `payment_verifying`.

### auction-status-US1-TC9-1: Moves into payment_verifying from other states are refused

Runs once per row of **Test data**.

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
* **Trace:** Writable primitives

**Pre-conditions:**

* <order_2> has invoice status <from>.

**Test data:**

| <from> |
| --- |
| `not_issued` |
| `payment_verifying` |
| `paid` |
| `cancelled` |

**Steps:**

1. Record a winner proof upload on <order_2>.

**Expected Results:**

* The write is refused.
* The invoice status stays <from>.

### auction-status-US1-TC10-1: Dispatch is refused while payment_verifying

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
* **Trace:** Writable primitives

**Pre-conditions:**

* <order_1> is `payment_verifying`.

**Steps:**

1. Record a dispatch on <order_1>.

**Expected Results:**

* The dispatch is refused.
* Fulfilment status is unchanged.

### auction-status-US1-TC11-1: Cancelling an order while proof is checked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Writable primitives

**Pre-conditions:**

* <order_1> is `payment_verifying`.

**Steps:**

1. Cancel <order_1>.
2. Read the invoice and order status.

**Expected Results:**

* The order reads Cancelled.
* The lot is available again.

**Blocked:** Product - may an operator cancel a Payment Verifying order, or must proof be returned first?

### auction-status-US1-TC12-1: payment_verifying derives Payment Verifying for everyone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Derived order status

**Pre-conditions:**

* <order_1> is `payment_verifying`.
* customer(winner of <order_1>) and admin(holds payment-processing) are signed in.

**Steps:**

1. Read the status on <grade10 winner order url>.
2. Read the status on My Auctions.
3. Read the outcome in the post-sale queue.

**Expected Results:**

* All three read Payment Verifying.

### auction-status-US1-TC13-1: The order status follows the current invoice after a reissue

**Classification:**

* **Severity:** major
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

* <order_1> had <invoice_1> replaced by <invoice_2>, `pending`.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice_1> | The replaced invoice |
| <invoice_2> | The current invoice |

**Steps:**

1. Read the order's invoice status.
2. Read the stored status of <invoice_1>.

**Expected Results:**

* The order's invoice status is <invoice_2>'s, `pending`.
* <invoice_1> holds no status and is not `cancelled`.
* The order reads Pending Payment.

### auction-status-US1-TC14-1: Reissuing while proof is checked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Derived order status

**Pre-conditions:**

* <order_1> is `payment_verifying` on <invoice_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice_1> | The invoice under check |
| <invoice_2> | Its replacement |

**Steps:**

1. Reissue <invoice_1> as <invoice_2>.
2. Read the order status.

**Expected Results:**

* The order reads the status of <invoice_2>.

**Blocked:** Product - is reissue offered while Payment Verifying, and what happens to the uploaded proof and kept time left?

### auction-status-US1-TC15-1: An expired invoice cannot enter payment_verifying

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Writable primitives

**Pre-conditions:**

* <order_1> has an invoice, status `expired`.

**Steps:**

1. Record a winner proof upload.

**Expected Results:**

* The write is refused; the status stays `expired`.

**Blocked:** Product - is expired to payment_verifying permitted? Returning is described as not offered once expired, which implies a checked invoice can be expired.

## Raised

- Which states may move into `payment_verifying`, and is `expired` one of them?
- How can a Payment Verifying invoice be expired, given its deadline is stopped?
- May an operator cancel or reissue a Payment Verifying order?
- Is the stopped deadline kept as a duration, and to what precision?

## Reconciliation

**Status:** paused — waiting on the author (@jeffffej0909) for a grilling round on
decisions neither reading could settle: proof on an expired invoice, operator
actions while Payment Verifying, the deadline on an expired reissue, the method
choice before send, reminders and the letter after a return, grace after a
return, what the winner sees of their proof, non-card settlement of a card
invoice, operator files on confirm, file rules, and who reads proof files.

**Blind input manifest hash:** `2c7380f5cdff72fd`
