# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## post-sale-US1: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

### post-sale-US1-TC1-1: Reissue returns an expired order to Pending Payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* `<order_1>` derives as Expired.
* admin(holds payment-processing) is on `<order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | An auction order whose invoice is `pending` and whose deadline has elapsed |
| `<reason>` | The operator's stated reason for the reissue |

**Steps:**

1. Reissue the invoice on `<order_1>` with `<reason>`.
2. Read the invoice status, its deadline and the derived order status.

**Expected Results:**

* The invoice status is still `pending`, with a new 7-day deadline.
* The derived order status is Pending Payment.

### post-sale-US1-TC2-1: Manual settlement is available before expiry

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* `<order_2>` derives as Pending Payment, three days from its deadline.
* Its winner has said they will pay by bank transfer.
* admin(holds payment-processing) is on `<order_2>`, with the delivery address confirmed.

**Steps:**

1. Settle `<order_2>` manually.
2. Read the derived order status.

**Expected Results:**

* Grade10 accepts the settlement.
* `<order_2>` derives as Processing, without having expired first.

### post-sale-US1-TC3-1: Settlement is refused until the address is confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* `<order_3>` is unpaid and its delivery address is unchanged from the account default shipping address.
* admin(holds payment-processing) is on `<order_3>`.

**Steps:**

1. Select settle manually.
2. Commit without confirming the delivery address.
3. Read the invoice status.

**Expected Results:**

* Grade10 refuses the settlement.
* The invoice status is still `pending`.

### post-sale-US1-TC4-1: Cancelling returns the lot to available and offers no runner-up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* `<order_4>` derives as Expired, and its lot had a second-highest bidder.
* admin(holds payment-processing) is on `<order_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_4>` | An expired auction order whose lot has a runner-up |
| `<reason>` | The operator's stated reason for the cancellation |

**Steps:**

1. Cancel `<order_4>` with `<reason>`.
2. Read the invoice status, the derived order status and the lot's inventory status.
3. Read what the runner-up was offered.

**Expected Results:**

* The invoice status is `cancelled` and the order derives as Cancelled.
* The lot's inventory status is available and it can be listed again.
* The runner-up is made no offer and acquires no right to the lot.

---

## post-sale-US2: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US2-TC1-1: Failed payment attempts distinguish a buyer who tried

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<order_5>`'s winner was declined three times before the deadline elapsed.
* `<order_6>`'s log holds only its issued entry.
* admin(holds payment-processing) is on `<order_5>`.

**Steps:**

1. Read the invoice log on `<order_5>`.
2. Read the invoice log on `<order_6>`.

**Expected Results:**

* `<order_5>` shows three failed payment attempts with their timestamps.
* `<order_6>` is distinguishable from it, holding only the issued log entry.

### post-sale-US2-TC2-1: The address at dispatch survives a later correction

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<order_7>` was dispatched to `<address at dispatch>`, and an operator later corrected it to `<corrected address>`.
* admin(holds payment-processing) is on `<order_7>`.

**Steps:**

1. Read the fulfilment log on `<order_7>`.
2. Read the dispatch event and the correction event.

**Expected Results:**

* The dispatch event still shows `<address at dispatch>` in full, as it stood at dispatch.
* The correction is a separate later event carrying its own snapshot.

### post-sale-US2-TC3-1: The detail names the rule behind a derived status

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<order_8>`'s invoice is `pending` and its deadline elapsed two days ago.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Open `<order_8>`.
2. Read the order status and the explanation beside it.

**Expected Results:**

* The order status shows as Expired.
* The detail names the rule that produced it — a pending invoice with an elapsed deadline — rather than the label alone.

### post-sale-US2-TC4-1: A buyer's reissue history spans all their orders

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<buyer>` has reissues on three different auction orders, `<order_9>` among them.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Open `<order_9>`.
2. Read the reissue history and the reissue count.

**Expected Results:**

* The detail shows `<buyer>`'s reissue history across all three orders.
* It shows the reissue count for `<order_9>` itself.
