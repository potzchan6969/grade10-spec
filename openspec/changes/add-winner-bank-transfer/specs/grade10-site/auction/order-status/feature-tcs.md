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

### auction-status-US1-TC11-1: Cancel, settlement and card payment are refused while proof is checked

Runs once per row of **Test data**.

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

* <order_1> is `payment_verifying`.

**Test data:**

| <action> |
| --- |
| An operator cancels the order |
| An operator records a manual settlement |
| A card payment for the invoice |

**Steps:**

1. Attempt <action> on <order_1>.
2. Read the invoice and order status.

**Expected Results:**

* The write is refused.
* The invoice is still `payment_verifying`; the order reads Payment Verifying.

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

### auction-status-US1-TC14-1: Reissuing is refused while proof is checked

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

* <order_1> is `payment_verifying` on <invoice_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice_1> | The invoice under check |
| <invoice_2> | Its replacement |

**Steps:**

1. Reissue <invoice_1> as <invoice_2>.
2. Read the order's current invoice and status.

**Expected Results:**

* The reissue is refused; no <invoice_2> exists.
* <invoice_1> is still current and `payment_verifying`.

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

## Reconciliation

**Status:** complete — reconciled on 2026-09-16 after the author's grilling round.

**Blind input manifest hash:** `2c7380f5cdff72fd`

| Finding | Disposition |
| --- | --- |
| `auction-status-US1-TC4-1`: upload writes `payment_verifying` | Matches `auction-status-SC-45` |
| `auction-status-US1-TC5-1`: the deadline does not run while proof is checked | Matches `auction-status-SC-40`; no expiry, so no non-payment consequence follows |
| `auction-status-US1-TC6-1`: a return resumes the time left | Matches `auction-status-SC-41` |
| `auction-status-US1-TC7-1`: confirming proof writes `paid` | Folded as `auction-status-SC-47` |
| `auction-status-US1-TC8-1`: operator settlement goes straight to `paid` | Reached by the transition table and `grade10-admin-auction-post-sale-SC-60` |
| `auction-status-US1-TC9-1`: other states cannot enter `payment_verifying` | Folded as `auction-status-SC-48`; a second upload is `winner-order-SC-101`'s |
| `auction-status-US1-TC10-1`: dispatch refused while `payment_verifying` | Matches `auction-status-SC-44` |
| `auction-status-US1-TC11-1`: cancel while proof is checked | Settled by decision 2; case now expects a refusal, with manual settlement and card payment as rows; matches `auction-status-SC-46`, which now names manual settlement |
| `auction-status-US1-TC12-1`: Payment Verifying for everyone | Matches `auction-status-SC-43` |
| `auction-status-US1-TC13-1`: order status follows the current invoice | Matches `auction-status-SC-42` |
| `auction-status-US1-TC14-1`: reissue while proof is checked | Settled by decision 2; case now expects a refusal and traces Writable primitives; matches `auction-status-SC-46` |
| `auction-status-US1-TC15-1`: an expired invoice cannot enter `payment_verifying` | Settled by decision 1; matches `auction-status-SC-48` |
| Raised: which states may enter `payment_verifying`, and is `expired` one? | Only `pending`; `auction-status-SC-48` |
| Raised: how can a Payment Verifying invoice be expired? | It cannot; stated in prose under "The deadline stops while proof is checked" |
| Raised: may an operator cancel or reissue a Payment Verifying order? | No; decision 2 |
| Raised: is the stopped deadline kept as a duration, and to what precision? | Kept as a duration (`auction-status-SC-40`); precision is left to the tech design |

**Folded:** `auction-status-SC-47`, `auction-status-SC-48`.

**Rejected:** none.

**Settled by the author** (grilling round, 2026-09-16):

1. **Proof on an expired invoice**: refused. Return stays refused on an expired invoice as a guard; it cannot be reached, because the deadline stops while proof is checked.
2. **Operator actions while Payment Verifying**: Confirm or Return only. Cancel, Reissue and manual settlement are refused.
3. **Deadline on an expired reissue**: always a fresh 7 days from send. Keeping the current deadline is offered only on a `pending` invoice.
4. **Method choice**: nothing preselected. A confirmation without a method is refused. The winner changes the method freely until the invoice is sent; after that only an operator does.
5. **After a return**: reminders resume on the paused clock. A reminder whose time passed during the check is not sent late, and one already sent is not repeated. The proof-not-accepted letter gives the new deadline as a date and time in the winner's zone ("Pay by …") and the external reason.
6. **Grace after a return**: none. The return prompt shows the time left, so the operator can reissue with a fresh 7 days instead.
7. **What the winner sees of proof**: a confirmed-proof receipt reads Bank transfer and is not marked manually settled. No proof file or file name reaches the winner anywhere; only the Payment Verifying state shows that proof was sent.
8. **Non-card settlement of a card invoice**: reissue as bank transfer first (fee usually 0), then record the settlement. Settlement is always at the current invoice's full order total.
9. **Operator files on Confirm**: 0 to 5, PDF, JPEG or PNG, 10 MB each.
10. **File rules**: 10 MB is 10,485,760 bytes. One wrong or oversize file refuses the whole upload and stores nothing. An upload that fails part-way stores nothing and may be retried; the one-upload rule applies once an upload succeeds.
11. **Who reads proof files**: any operator who can open the order; never the winner.

Decisions 1 and 2 changed `auction-status-US1-TC11-1`, `auction-status-US1-TC14-1` and `auction-status-US1-TC15-1`.

**Still blocked:** none.

**Out of suite:** none. `auction-status-SC-01` to `auction-status-SC-25` are unchanged by this change and stay with the durable suite.

**Notes:** the capability is walked by nobody on its own; cases trace the Feature set groups.
