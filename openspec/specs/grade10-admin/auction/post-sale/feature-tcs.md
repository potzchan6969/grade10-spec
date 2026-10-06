# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to reissue, settle, or cancel an unpaid order from the order itself,
**so that** a lot whose winner did not pay stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-6bv rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
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
| `<reissue reason>` | The operator's stated reason for the reissue |

**Steps:**

1. Reissue the invoice on `<order_1>`.
2. Enter `<reissue reason>`.
3. Confirm the reissue.
4. Read the invoice status.
5. Read the payment deadline.
6. Read the order status.

**Expected Results:**

* Steps 4 and 5: invoice still `pending`, new 7-day deadline.
* Step 6 shows the order as Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-rjj rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
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

* `<order_2>` derives as Pending Payment, three days before its deadline (any time before the deadline).
* Its winner has said they will pay by bank transfer.
* The delivery address is confirmed.
* admin(holds payment-processing) is on `<order_2>`.

**Steps:**

1. Settle `<order_2>` manually.
2. Confirm the settlement.
3. Read the order status.

**Expected Results:**

* Step 2: the settlement is accepted.
* Step 3 shows Processing, with the deadline not elapsed.

<!-- trace:case id=g10adm.auction-post-sale.TC-4qr rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
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

* `<order_3>` is unpaid.
* Its delivery address is still the account default shipping address.
* admin(holds payment-processing) is on `<order_3>`.

**Steps:**

1. Select settle manually on `<order_3>`.
2. Confirm the settlement without confirming the delivery address.
3. Read the invoice status.

**Expected Results:**

* Step 2: the settlement is refused.
* Step 3 shows the invoice still `pending`.

<!-- trace:case id=g10adm.auction-post-sale.TC-2mh rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
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

* `<order_4>` derives as Expired.
* Its lot had a second-highest bidder.
* admin(holds payment-processing) is on `<order_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_4>` | An expired auction order whose lot has a runner-up |
| `<cancel reason>` | The operator's stated reason for the cancellation |

**Steps:**

1. Cancel `<order_4>`.
2. Enter `<cancel reason>`.
3. Confirm the cancellation.
4. Read the invoice status.
5. Read the order status.
6. Read the lot's inventory status.
7. Read what the runner-up was offered.

**Expected Results:**

* Steps 4 and 5 show invoice `cancelled` and order Cancelled.
* Step 6 shows the lot available to list again.
* Step 7: no runner-up offer and no right to the lot.

---

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

<!-- trace:case id=g10adm.auction-post-sale.TC-i9j rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
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
2. Open `<order_6>`.
3. Read the invoice log on `<order_6>`.

**Expected Results:**

* Step 1 shows three failed payment attempts with timestamps.
* Step 3 shows only the issued entry, unlike `<order_5>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-uap rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
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

* `<order_7>` was dispatched to `<address at dispatch>`.
* An operator later corrected that address to `<corrected address>`.
* admin(holds payment-processing) is on `<order_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<address at dispatch>` | The delivery address recorded on the dispatch event |
| `<corrected address>` | A later address, different from `<address at dispatch>` |

**Steps:**

1. Read the dispatch event in the fulfilment log.
2. Read the correction event in the fulfilment log.

**Expected Results:**

* Step 1 still shows `<address at dispatch>` in full, as at dispatch.
* Step 2 is a later event carrying its own snapshot.

<!-- trace:case id=g10adm.auction-post-sale.TC-uy0 rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
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

* `<order_8>`'s invoice is `pending`.
* Its deadline elapsed two days ago (any time after the deadline).
* admin(holds payment-processing) is on Orders under `/auction`.

**Steps:**

1. Open `<order_8>`.
2. Read the order status.
3. Read the explanation beside the status.

**Expected Results:**

* Step 2 shows the order status Expired.
* Step 3 names pending invoice, elapsed deadline, not only Expired.

<!-- trace:case id=g10adm.auction-post-sale.TC-fph rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
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
* admin(holds payment-processing) is on Orders under `/auction`.

**Steps:**

1. Open `<order_9>`.
2. Read `<buyer>`'s reissue history.
3. Read the reissue count for `<order_9>`.

**Expected Results:**

* Step 2 shows `<buyer>`'s reissue history across all three orders.
* Step 3 shows the reissue count for `<order_9>` itself.

<!-- trace:case id=g10adm.auction-post-sale.TC-r9c rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC5-1: Refunds add to the order history

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

* The order already has invoice entries and fulfilment entries.
* A refund record is already on that order.
* admin(holds refund-processing) is on that order.

**Steps:**

1. Read the order history.

**Expected Results:**

* Step 1: invoice and fulfilment entries remain beside the refund record.

---

## post-sale-US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the queue to label a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

<!-- trace:case id=g10adm.auction-post-sale.TC-vsq rev=1 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
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

1. Read the row for `<listing_1>`.
2. Read the row for `<listing_2>`.
3. Read the row for `<listing_3>`.

**Expected Results:**

* Step 1 shows "Extended bidding: ON" beside the outcome, not replacing it.
* Steps 2 and 3 show no Extended bidding label.

<!-- trace:case id=g10adm.auction-post-sale.TC-v7u rev=1 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
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

* Step 2 offers no outcome named Extended bidding.
* Step 3 shows no needs-action highlight from that label.

---

## post-sale-US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record money sent back in Stripe or by bank transfer,
**so that** the order and the lot agree with the refund.

<!-- trace:case id=g10adm.auction-post-sale.TC-c92 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
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

* `<paid order>` has `<paid amount>` paid.
* admin(holds refund-processing) is on `<paid order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<paid order>` | An order with `<paid amount>` already paid |
| `<paid amount>` | 100000 minor units |
| `<refund amount>` | 60000 minor units (any amount below `<paid amount>`) |
| `<refund reason>` | The operator's reason for the refund |
| `<note>` | The note of what the winner asked |
| `<reference>` | The bank reference for the refund |
| `<proof>` | One proof file |

**Steps:**

1. Start the refund on `<paid order>`.
2. Enter `<refund amount>`.
3. Choose bank transfer.
4. Enter `<refund reason>`.
5. Enter `<note>`.
6. Enter `<reference>`.
7. Attach `<proof>`.
8. Select return to stock.
9. Confirm the refund.
10. Read the refund's audit number.
11. Read the order status and whether Refund is offered again.
12. Read the lot's stock.
13. Read who recorded the refund, and when.

**Expected Results:**

* Step 9 accepts the refund; step 10 shows the next audit number.
* Step 11 shows Refunded, and Refund cannot be used again.
* Step 12 shows the lot back in stock.
* Step 13 names this operator and the time.

<!-- trace:case id=g10adm.auction-post-sale.TC-h64 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
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

* `<partially-paid order>` has `<partial amount>` paid.
* admin(holds refund-processing) is on `<partially-paid order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<partial amount>` | 40000 minor units |
| `<over refund>` | 40001 minor units (one minor unit over `<partial amount>`) |

**Steps:**

1. Start the refund on `<partially-paid order>`.
2. Enter `<over refund>`.
3. Submit the refund.
4. Read the order status.

**Expected Results:**

* Step 3 refuses the refund and consumes no audit number.
* Step 4 still shows Partially Paid.

---

## post-sale-US17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

<!-- trace:case id=g10adm.auction-post-sale.TC-8st rev=1 covers=g10adm.auction-post-sale.SC-9zs -->
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
* admin(holds refund-processing) is on Orders under `/auction`.

**Steps:**

1. Filter Orders to Refunded.
2. Open the Refunded order.
3. Open its invoice log.

**Expected Results:**

* Step 1 shows that order in the Refunded filter.
* Steps 2 and 3 show the same complete refund record.

---

## post-sale-US1: Operator works the listing queue by outcome

**As an** auction operator,
**I want** the existing outcome queue to remain available with Refunded added,
**so that** the new filter does not change other outcomes.

<!-- trace:case id=g10adm.auction-post-sale.TC-tb3 rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq -->
### post-sale-US1-TC1-1: Other queue outcomes remain available

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

* Orders holds orders in the existing outcomes, and one Refunded order.
* admin(holds refund-processing) is on Orders under `/auction`.

**Steps:**

1. Read the outcome list.
2. Read the outcome filters.

**Expected Results:**

* Steps 1 and 2 keep existing outcomes and add Refunded.

---

## post-sale-US15: Operator filters Setup Overdue and Payment Overdue

**As an** operator,
**I want** Setup Overdue and Payment Overdue as queue outcomes,
**so that** I find deadline-missed orders using the same names as the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-gap rev=1 covers=g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### post-sale-US15-TC1-1: The queue uses the two overdue outcomes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-15

**Pre-conditions:**

* Orders has one order past an incomplete setup deadline (any time after that deadline).
* Orders has one unpaid invoice past its payment deadline (any time after that deadline).
* admin is on Orders under `/auction`.

**Steps:**

1. Read the row past its setup deadline.
2. Read the row past its payment deadline.
3. Filter Orders to Setup Overdue.
4. Filter Orders to Payment Overdue.

**Expected Results:**

* Steps 1 and 2 read Setup Overdue and Payment Overdue.
* Steps 3 and 4 each return only the matching order.

<!-- trace:case id=g10adm.auction-post-sale.TC-n26 rev=1 covers=g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### post-sale-US15-TC2-1: Overdue outcomes do not erase the action context

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
* **Trace:** post-sale-US-15

**Pre-conditions:**

* Orders contains one Setup Overdue order and one Payment Overdue order.
* admin is on Orders under `/auction`.

**Steps:**

1. Read the Setup Overdue row's needs-action treatment.
2. Open the Setup Overdue order.
3. Read the Payment Overdue row's needs-action treatment.
4. Open the Payment Overdue order.

**Expected Results:**

* Steps 1 and 3 show one outcome each.
* Steps 2 and 4 name the missed deadline and offer the winner Contact Us, not self-service.

## post-sale-US3: Operator collects payment

**As a** payment operator,
**I want** a wire to release the card hold, a capture to mark Paid via Stripe, and a manual record to mark Paid via Manual,
**so that** a second paid attempt is refused and staff without the grant cannot collect.

<!-- trace:case id=g10adm.auction-post-sale.TC-05y rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC1-1: A verified card capture marks the listing Paid via Stripe

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
* **Trace:** post-sale-US-03

**Pre-conditions:**

* `<listing_7>` is Awaiting payment, with an open card authorization for the winner.
* admin(holds payment-processing) is on `<listing_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A closed listing with a winner, outcome Awaiting payment, card authorization still open |

**Steps:**

1. Record a verified card capture for `<listing_7>`.
2. Read the outcome.
3. Read the trail.

**Expected Results:**

* Step 2 shows Paid via Stripe.
* Step 3 shows that change from Stripe.
* Step 3 names no operator on that change.

<!-- trace:case id=g10adm.auction-post-sale.TC-lvf rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC2-1: A second payment record is refused

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
* **Trace:** post-sale-US-03

**Pre-conditions:**

* `<listing_8>` is Paid via Stripe.
* admin(holds payment-processing) is on `<listing_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A closed listing with a winner, outcome Paid via Stripe |

**Steps:**

1. Record payment collected on `<listing_8>`.
2. Read the outcome.
3. Read the winner.

**Expected Results:**

* Step 1 is refused.
* Step 2 still shows Paid via Stripe.
* Step 3 shows the winner unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-1cx rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC3-1: Staff cannot record payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* admin(role is exactly staff) is on Orders under `/auction`.
* `<listing_9>` is Awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A closed listing with a winner, outcome Awaiting payment |

**Steps:**

1. Open `<listing_9>`.
2. Read the payment control.
3. Submit a payment-collected record.
4. Read the outcome.

**Expected Results:**

* Step 2 shows the payment control, and it is disabled.
* Step 3 is refused.
* Step 4 does not show Paid via Manual.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Queue labels preserve the operator action context | **Folded in** |

- **Covered at domain** — recording payment collected on an Awaiting payment listing reaches Paid via Manual, then Shipped, then Delivered, walked by `grade10-admin-auction-e2e-US3-TC1-1`
- **Covered at domain** — a wire request on an Awaiting payment listing reaches Awaiting wire and releases the card hold, walked by `grade10-admin-auction-e2e-US3-TC2-1`
