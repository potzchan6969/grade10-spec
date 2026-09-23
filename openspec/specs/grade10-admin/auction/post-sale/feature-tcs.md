# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

### post-sale-US7-TC1-1: Reissue returns an expired order to Pending Payment

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
* **Trace:** post-sale-US-07

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

### post-sale-US7-TC2-1: Manual settlement is available before expiry

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
* **Trace:** post-sale-US-07

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

### post-sale-US7-TC3-1: Settlement is refused until the address is confirmed

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
* **Trace:** post-sale-US-07

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

### post-sale-US7-TC4-1: Cancelling returns the lot to available and offers no runner-up

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
* **Trace:** post-sale-US-07

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

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US8-TC1-1: Failed payment attempts distinguish a buyer who tried

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
* **Trace:** post-sale-US-08

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

### post-sale-US8-TC2-1: The address at dispatch survives a later correction

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<order_7>` was dispatched to `<address at dispatch>`, and an operator later corrected it to `<corrected address>`.
* admin(holds payment-processing) is on `<order_7>`.

**Steps:**

1. Read the fulfilment log on `<order_7>`.
2. Read the dispatch event and the correction event.

**Expected Results:**

* The dispatch event still shows `<address at dispatch>` in full, as it stood at dispatch.
* The correction is a separate later event carrying its own snapshot.

### post-sale-US8-TC3-1: The detail names the rule behind a derived status

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<order_8>`'s invoice is `pending` and its deadline elapsed two days ago.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Open `<order_8>`.
2. Read the order status and the explanation beside it.

**Expected Results:**

* The order status shows as Expired.
* The detail names the rule that produced it — a pending invoice with an elapsed deadline — rather than the label alone.

### post-sale-US8-TC4-1: A buyer's reissue history spans all their orders

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<buyer>` has reissues on three different auction orders, `<order_9>` among them.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Open `<order_9>`.
2. Read the reissue history and the reissue count.

**Expected Results:**

* The detail shows `<buyer>`'s reissue history across all three orders.
* It shows the reissue count for `<order_9>` itself.

## post-sale-US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the queue to label a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

### post-sale-US6-TC1-1: Queue labels only the lot in extended bidding

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(holds the auction queue grant) is on <grade10 auction admin queue url>.
* `<listing_1>`, `<listing_2>` and `<listing_3>` are in the queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A lot past its scheduled close, in extended bidding |
| `<listing_2>` | A lot open for bidding whose scheduled close has not arrived |
| `<listing_3>` | A lot that closed after its extended bidding ended |

**Steps:**

1. Find the rows for `<listing_1>`, `<listing_2>` and `<listing_3>`.
2. Read each row's outcome and labels.

**Expected Results:**

* `<listing_1>` shows "Extended bidding: ON" beside its outcome, not in place of it.
* `<listing_2>` and `<listing_3>` show no Extended bidding label.

### post-sale-US6-TC2-1: Extended bidding is not an outcome filter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(holds the auction queue grant) is on <grade10 auction admin queue url>.
* `<listing_1>` is in the queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A lot past its scheduled close, in extended bidding |

**Steps:**

1. Open the outcome filter.
2. Read the outcomes offered.
3. Read `<listing_1>`'s row.

**Expected Results:**

* No outcome named Extended bidding is offered.
* `<listing_1>`'s row has no needs-action highlight from the label.

## post-sale-US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record money sent back in Stripe or by bank transfer,
**so that** the order and the lot agree with the refund.

### post-sale-US16-TC1-1: A refund records the financial facts and closes the order

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* `<paid order>` has 100000 minor units paid.
* admin(holds refund-processing) is on the order detail.

**Steps:**

1. Record a 60000-minor-unit bank refund with a reason, note, reference, one proof file and return-to-stock selected.

**Expected Results:**

* The refund is accepted and gets the next audit number.
* The order outcome is Refunded and cannot be refunded again.
* The lot returns to stock.
* The refund record names the operator and time.

### post-sale-US16-TC2-1: A refund cannot return more than was paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-16

**Pre-conditions:**

* `<partially-paid order>` has 40000 minor units paid.
* admin(holds refund-processing) is on the order detail.

**Steps:**

1. Submit a refund of 40001 minor units.

**Expected Results:**

* The refund is refused and no audit number is consumed.
* The order stays Partially Paid.

## post-sale-US17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

### post-sale-US17-TC1-1: The queue and order detail expose one refund record

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
* **Trace:** post-sale-US-17

**Pre-conditions:**

* A Refunded order has a recorded amount, method, reference, reason, proof and audit number.
* admin(holds refund-processing) is on the post-sale queue.

**Steps:**

1. Filter the queue to Refunded.
2. Open the order and invoice log.

**Expected Results:**

* The order appears in the filter.
* The order detail and invoice log show the same complete refund record.

## post-sale-US08: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** the existing history to remain available beside refunds,
**so that** the refund record adds to rather than replaces the order history.

### post-sale-US08-TC1-1: Refunds add to the order history

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(holds refund-processing) is viewing an order with existing invoice and fulfilment history.

**Steps:**

1. Open the order history after a refund is recorded.

**Expected Results:**

* Existing invoice and fulfilment entries remain available beside the refund record.

## post-sale-US01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** the existing outcome queue to remain available with Refunded added,
**so that** the new filter does not change other outcomes.

### post-sale-US01-TC1-1: Other queue outcomes remain available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(holds refund-processing) is on the post-sale queue with orders in existing outcomes and a Refunded order.

**Steps:**

1. Read the queue outcomes and filter options.

**Expected Results:**

* Existing outcomes remain available and Refunded is an additional outcome.
