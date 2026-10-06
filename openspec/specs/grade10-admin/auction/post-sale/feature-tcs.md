# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

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

### post-sale-US1-TC2-1: Filtering by Payment Verifying lists only those orders

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <count> orders are Payment Verifying; others are Pending Payment.

**Test data:**

| <count> |
| --- |
| 0 |
| 1 |
| 3 |

**Steps:**

1. Filter the queue to Payment Verifying.

**Expected Results:**

* Exactly <count> rows show, all Payment Verifying.

### post-sale-US1-TC3-1: The treatment follows the order after the check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> was Payment Verifying, then an operator <action>.

**Test data:**

| <action> | <outcome> | <flag> |
| --- | --- | --- |
| confirmed it | Processing | shown |
| returned it, deadline not passed | Pending Payment | not shown |

**Steps:**

1. Find the <order_1> row.

**Expected Results:**

* The outcome reads <outcome>.
* Needs action is <flag>.

### post-sale-US1-TC5-1: The queue search finds an order by any of its identifiers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> is on listing `LK7P2Q`; its invoice `INV-202609-LK7P2Q-01` was replaced by `INV-202609-LK7P2Q-02`.

**Test data:**

| <term> |
| --- |
| `LK7P2Q` |
| `INV-202609-LK7P2Q-01` |
| `LK7P2Q01` |
| `INV-202609-LK7P2Q-02` |
| `LK7P2Q02` |

**Steps:**

1. Search the queue by <term>.

**Expected Results:**

* <order_1> is found.
* It shows `INV-202609-LK7P2Q-02` as its current invoice.

---

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

---

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
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

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC9-1: Operator sends an invoice with tax

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose lines before Tax total 312000 minor units in HKD.

**Steps:**

1. Enter Tax of 6000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The invoice is sent with Tax of 6000 minor units in HKD.
* Its Subtotal includes Tax and reads 318000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-dre rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC10-1: Operator sends an invoice without tax

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Leave Tax empty.
2. Complete the other required quote fields and send the invoice.

**Expected Results:**

* The invoice is sent.
* It carries no Tax line.

<!-- trace:case id=g10adm.auction-post-sale.TC-tuk rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC11-1: Tax of zero is refused

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Add Tax of 0 minor units.
2. Submit the quote.

**Expected Results:**

* The send is refused.
* No invoice is issued.

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

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

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

### post-sale-US7-TC5-1: Reissue changes the address with a reason

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`.

**Test data:**

| <deadline choice> | <deadline outcome> |
| --- | --- |
| keep | unchanged from the old invoice |
| restart | 7 days from the reissue |

**Steps:**

1. Open Reissue.
2. Choose <address_2>, enter Shipping & Handling and a reason.
3. Choose <deadline choice> and reissue.

**Expected Results:**

* A new invoice is `pending` for <address_2>.
* The deadline is <deadline outcome>.
* The old invoice reads as replaced, not Cancelled.

### post-sale-US7-TC6-1: Reissue without a reason is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Change Insurance.
3. Leave the reason empty and reissue.

**Expected Results:**

* The reissue is refused, asking for a reason.
* The current invoice is unchanged.

### post-sale-US7-TC7-1: Switching card to bank transfer starts the fee empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`, HKD.

**Steps:**

1. Open Reissue.
2. Choose bank transfer.
3. Read the bank transfer fee field.

**Expected Results:**

* The fee field is empty.
* The card fee is not carried over.

### post-sale-US7-TC8-1: A bank transfer reissue prefills the previous fee

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice with fee <fee_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <fee_1> | An amount above 0 |
| <fee_2> | A different amount above 0 |

**Steps:**

1. Open Reissue.
2. Read the fee field.
3. Change it to <fee_2>, add a reason and reissue.

**Expected Results:**

* Step 2 shows <fee_1>.
* The new invoice carries <fee_2>.

### post-sale-US7-TC9-1: Bank transfer fee values that are refused

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> |
| --- |
| blank |
| -1 |
| a value finer than the currency's smallest unit |
| text |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The reissue is refused at the fee.
* The current invoice is unchanged.

### post-sale-US7-TC10-1: Bank transfer fee values that are accepted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> | <fee reads> |
| --- | --- |
| 0 | Free |
| 1 minor unit | That amount |
| An amount larger than the Subtotal | That amount, not capped |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The new invoice carries Payment Processing Fee <fee reads>.

### post-sale-US7-TC11-1: Switching to card prices the fee from the provider

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

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the gross-up read at reissue.
* No fee is typed by the operator.

### post-sale-US7-TC12-1: A card reissue is refused when provider fees cannot be read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* The payment provider's fees cannot be read.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused and says why.
* The current invoice is unchanged.

### post-sale-US7-TC13-1: A card invoice paid by transfer is reissued then settled

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.
* The winner transferred exactly the Subtotal.

**Steps:**

1. Reissue as bank transfer with fee 0 and a reason.
2. Record settlement at the new Order Total, with one proof file.

**Expected Results:**

* The new invoice reads fee Free, total equal to Subtotal.
* The invoice is `paid`; the order reads Processing.

### post-sale-US7-TC14-1: Settling a card invoice as a transfer without reissue is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.

**Steps:**

1. Record a settlement at the Subtotal with one proof file, once per method: bank transfer, cash, other.

**Expected Results:**

* Each settlement is refused, pointing to reissue.
* The invoice stays `pending`.

### post-sale-US7-TC15-1: Settlement at an amount other than the Order Total is refused

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, Order Total <total>.

**Test data:**

| <amount> |
| --- |
| <total> minus 1 minor unit |
| <total> plus 1 minor unit |

**Steps:**

1. Record a settlement of <amount> with one proof file.

**Expected Results:**

* The settlement is refused.
* The invoice stays `pending`.

### post-sale-US7-TC16-1: Operator settlement needs proof and goes straight to paid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <proof> | <outcome> |
| --- | --- |
| 1 file | paid, never Payment Verifying |
| 5 files | paid, never Payment Verifying |

**Steps:**

1. Record a settlement at the Order Total with <proof>.

**Expected Results:**

* The outcome is <outcome>.

### post-sale-US7-TC23-1: Operator settlement without proof is refused

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Steps:**

1. Record a settlement at the Order Total with no proof file.

**Expected Results:**

* The settlement is refused, asking for proof.
* The invoice stays `pending`.

### post-sale-US7-TC24-1: One bad proof file refuses the whole settlement

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <bad file> |
| --- |
| A JPEG of 10,485,761 bytes |
| A GIF |

**Steps:**

1. Attach one valid PDF and <bad file>.
2. Commit the settlement with a reference.

**Expected Results:**

* The commit is refused.
* No file is stored; the invoice stays `pending`.

### post-sale-US7-TC25-1: The first bank transfer quote asks for the fee

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with bank transfer chosen by the winner.
* The payment provider's fees cannot be read.

**Test data:**

| <fee> | <outcome> |
| --- | --- |
| blank | The send is refused; no invoice is issued |
| -100 | The send is refused; no invoice is issued |
| 0 | The invoice is sent; its fee reads Free |
| more than the Subtotal | The invoice is sent with that fee, not capped |

**Steps:**

1. Open the quote.
2. Enter Shipping & Handling and <fee>.
3. Send the invoice.

**Expected Results:**

* Step 1 names bank transfer and asks for a bank transfer fee.
* <outcome>

### post-sale-US7-TC17-1: Settlement keeps the Payment Processing Fee line

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice with fee <fee>, `pending`.

**Test data:**

| <fee> |
| --- |
| 0, read as Free |
| an amount above 0 |

**Steps:**

1. Record a settlement at the Order Total with one proof file.
2. Read the paid invoice.

**Expected Results:**

* Payment Processing Fee still reads <fee>.
* The paid amount includes it.

### post-sale-US7-TC18-1: Staff without payment processing cannot reissue or check proof

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(without payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is <state>.

**Test data:**

| <state> |
| --- |
| Pending Payment |
| Payment Verifying |

**Steps:**

1. Look for Reissue, settle, confirm and return.
2. Send a reissue from outside the page.

**Expected Results:**

* Each action is visible and disabled.
* Step 2 is refused; the invoice is unchanged.

### post-sale-US7-TC19-1: Only Confirm and Return while proof is checked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <action> |
| --- |
| Reissue |
| Settle manually |
| Cancel order |

**Steps:**

1. Look for <action>.
2. Send <action> for <order_1> from outside the page.

**Expected Results:**

* <action> is not offered; Confirm and Return are.
* Step 2 is refused; the order stays Payment Verifying.

### post-sale-US7-TC20-1: Reissue on an expired invoice offers only a fresh 7 days

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `expired`.

**Steps:**

1. Open Reissue, change Insurance, add a reason.
2. Read the deadline choices.
3. Send a reissue that keeps the deadline from outside the page.

**Expected Results:**

* Only a fresh 7 days from send is offered.
* Step 3 is refused; the invoice stays `expired`.

### post-sale-US7-TC21-1: Reissue with nothing changed

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Keep the current deadline, change nothing else, add a reason and reissue.

**Expected Results:**

* The reissue is refused as changing nothing.
* The current invoice keeps its invoice ID, amount and deadline.

### post-sale-US7-TC22-1: An old invoice ID or bank reference still finds the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> had <invoice_1> replaced by <invoice_2>.

**Steps:**

1. Search the queue by <invoice_1>'s invoice ID.
2. Search the queue by <invoice_1>'s bank reference.

**Expected Results:**

* Both searches find <order_1>.
* It shows <invoice_2> as current.

### post-sale-US7-TC26-1: A fresh deadline alone is enough to reissue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a `pending` invoice with a payment deadline of 2026-09-19T09:00:00Z.

**Steps:**

1. Open Reissue.
2. Change nothing but the deadline, to a fresh 7 days.
3. Add a reason and send at 2026-09-15T10:00:00Z.
4. Read the reissued log entry.

**Expected Results:**

* The new invoice is `pending` with a deadline of 2026-09-22T10:00:00Z.
* It carries a new invoice ID and bank reference.
* The entry names the deadline as the only changed part.

### post-sale-US7-TC27-1: An edit before send changes the address and method and is logged

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is an HKD order that reads Preparing Invoice, with the home address and card confirmed by the winner.

**Steps:**

1. Open the edit on <order_1>.
2. Change the address to the work address and the method to bank transfer.
3. Enter the reason "Winner asked by email" and commit.
4. Read the invoice log.

**Expected Results:**

* <order_1> holds the work address and bank transfer, and still reads Preparing Invoice.
* The log shows an order edited before send entry with the operator, the reason, and the address and method before and after.
* The winner's Winner Order shows the work address and bank transfer.

### post-sale-US7-TC28-1: An edit before send without a reason is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with the home address confirmed.

**Steps:**

1. Open the edit on <order_1>.
2. Change the address to the work address, leave the reason empty, and commit.

**Expected Results:**

* The commit is refused.
* <order_1> still holds the home address, and the log has no new entry.

### post-sale-US7-TC29-1: Staff without payment processing cannot edit before send

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(roles exactly `staff`) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice.

**Steps:**

1. Look at the edit control.
2. Send an address edit with a reason for <order_1> from outside the page.

**Expected Results:**

* Step 1 shows the control visible and disabled.
* Step 2 is refused; <order_1> is unchanged.

### post-sale-US7-TC30-1: A USD order cannot be edited to bank transfer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is a USD order that reads Preparing Invoice with card confirmed.

**Steps:**

1. Open the edit on <order_1>.
2. Choose bank transfer, enter a reason, and commit.

**Expected Results:**

* The commit is refused.
* <order_1> still holds card.

### post-sale-US7-TC31-1: An edit before send does not reset the waiting time

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* The winner confirmed <order_1>'s address at 2026-09-12T09:00:00Z.

**Steps:**

1. Edit the address with a reason at 2026-09-14T09:00:00Z.
2. Open <order_1> at 2026-09-15T09:00:00Z.

**Expected Results:**

* The detail shows 72 hours waited since the winner's confirmation.
* <order_1> carries the Overdue mark.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US7-TC38-1: Reissue changes tax

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

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries no Tax.

**Steps:**

1. Open Reissue.
2. Add Tax of 6000 minor units in HKD and give a reason.
3. Send the new invoice.

**Expected Results:**

* The new invoice carries Tax of 6000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-yjb rev=1 covers=g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC46-1: Reissue removes tax

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

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries Tax of 6000 minor units in HKD.

**Steps:**

1. Open Reissue.
2. Clear the Tax amount, change nothing else, and give a reason.
3. Send the new invoice.

**Expected Results:**

* The reissue is accepted as a change.
* The new invoice has no Tax line.
* Its Subtotal is 6000 minor units lower than the replaced invoice's.

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

### post-sale-US8-TC6-1: The log keeps the proof check with both reasons

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> was uploaded, returned with <external reason> and <internal reason>, re-uploaded and confirmed.

**Steps:**

1. Open the invoice log.

**Expected Results:**

* Each upload is an entry with the time left.
* The return entry shows both reasons.
* The confirm entry lists the proof files.
* Entries are in time order.

### post-sale-US8-TC7-1: A replaced invoice stays readable on the order

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <invoice_1> was replaced by <invoice_2>.

**Steps:**

1. Open <invoice_1> and its PDF.

**Expected Results:**

* <invoice_1> shows no status of its own, never Cancelled.
* Its PDF names <invoice_2>.

### post-sale-US8-TC8-1: Operators read the internal audit numbers

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1>'s first invoice holds `#00010482`, its reissued invoice `#00010490`, and its receipt `#00010495`.

**Steps:**

1. Open the order.
2. Read the invoice log.

**Expected Results:**

* The order shows each number against its invoice or receipt.
* The sent entry shows `#00010482`.
* The reissued entry shows `#00010490`.
* The paid entry shows `#00010495`.

---

## post-sale-US10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.

### post-sale-US10-TC1-1: Confirming proof settles the invoice with the winner's files

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <files> uploaded.

**Test data:**

| Field | Value |
| --- | --- |
| <files> | 5 files: PDF, JPEG and PNG |

**Steps:**

1. Open the proof on the invoice.
2. Confirm the payment.

**Expected Results:**

* Step 1 shows every one of <files>.
* The invoice is `paid`; the order reads Processing.
* <files> are recorded as the payment proof.

### post-sale-US10-TC2-1: The operator adds their own proof when confirming

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with 1 winner file.

**Steps:**

1. Add one bank statement file.
2. Confirm the payment.

**Expected Results:**

* The proof lists the winner file and the operator file.
* The invoice is `paid`.

### post-sale-US10-TC3-1: Returning proof shows time left and resumes the deadline

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <time left> kept.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 2 days 5 hours |

**Steps:**

1. Open Return.
2. Enter an external and an internal reason.
3. Return.

**Expected Results:**

* Step 1 shows <time left>.
* The invoice is `pending`, deadline now plus <time left>.
* The order reads Pending Payment.

### post-sale-US10-TC4-1: Return is refused without both reasons

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <reasons> |
| --- |
| neither |
| external only |
| internal only |

**Steps:**

1. Open Return.
2. Enter <reasons>.
3. Return.

**Expected Results:**

* The return is refused, naming the missing reason.
* The order stays Payment Verifying.

### post-sale-US10-TC5-1: Confirm and Return are not offered on an expired invoice

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `expired`, with no proof.

**Steps:**

1. Look for Return and Confirm.
2. Send a Return for <order_1> from outside the page.

**Expected Results:**

* Neither Return nor Confirm is offered.
* Reissue, settle and cancel are offered.
* Step 2 is refused; the invoice stays `expired`.

### post-sale-US10-TC6-1: Check actions are not offered on a pending order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, no proof.

**Steps:**

1. Look for Confirm and Return.

**Expected Results:**

* Neither is offered.

### post-sale-US10-TC7-1: A second operator acting on the same check is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** post-sale-US-10

**Pre-conditions:**

* Two admin(holds payment-processing) have <order_1> open, Payment Verifying.

**Steps:**

1. Operator A confirms.
2. Operator B returns.

**Expected Results:**

* Step 2 is refused.
* The invoice stays `paid`; no proof-not-accepted letter goes out.

### post-sale-US10-TC8-1: Who can read the winner's proof files

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* <order_1> is Payment Verifying with winner files.

**Test data:**

| <requester> | <outcome> |
| --- | --- |
| admin(without payment-processing), able to open <order_1> | The file is returned |
| customer(winner of <order_1>) | Refused |
| A signed-out request | Refused |

**Steps:**

1. Request a proof file on <order_1> as <requester>.

**Expected Results:**

* The request is <outcome>.

### post-sale-US10-TC9-1: One bad operator file refuses the confirm

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <operator files> |
| --- |
| One PDF and one JPEG of 10,485,761 bytes |
| Six PDFs |

**Steps:**

1. Attach <operator files>.
2. Confirm the payment.

**Expected Results:**

* The confirm is refused.
* No operator file is stored; the order stays Payment Verifying.

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

## Settled

- `post-sale-US1-TC1`, `post-sale-US1-TC2`, `post-sale-US1-TC3` and `post-sale-US1-TC4`, archived with `2026-09-11-add-auction-winner-journey`, are `post-sale-US7-TC1` to `post-sale-US7-TC4`: the journeys were renumbered at its fold.
- `post-sale-US2-TC1`, `post-sale-US2-TC2`, `post-sale-US2-TC3` and `post-sale-US2-TC4`, archived with `2026-09-11-add-auction-winner-journey`, are `post-sale-US8-TC1` to `post-sale-US8-TC4`: the journeys were renumbered at its fold.
- `post-sale-US08-TC1` and `post-sale-US01-TC1`, archived with `2026-09-23-add-winner-refund`, are `post-sale-US8-TC5` and `post-sale-US1-TC1`: renamed to the compact id form at its fold.
- Removing Tax on a reissue is a change from an amount to none, like changing its amount; it has its own scenario and case.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Queue labels preserve the operator action context | **Folded in** |

- **Covered at domain** — recording payment collected on an Awaiting payment listing reaches Paid via Manual, then Shipped, then Delivered, walked by `grade10-admin-auction-e2e-US3-TC1-1`
- **Covered at domain** — a wire request on an Awaiting payment listing reaches Awaiting wire and releases the card hold, walked by `grade10-admin-auction-e2e-US3-TC2-1`
- **Restored** - the cases archived with `2026-09-18-add-winner-bank-transfer` and `2026-09-18-add-winner-billing-address` that their folds left behind are back as draft, unchanged, for `/tcs-review`: `post-sale-US1-TC2-1`, `-TC3-1` and `-TC5-1`, `post-sale-US7-TC5-1` to `-TC31-1`, `post-sale-US8-TC6-1` to `-TC8-1`, `post-sale-US10-TC1-1` to `-TC9-1`, `post-sale-US5-TC1-1`, and `post-sale-US11-TC1-1` and `-TC2-1`.

**Run:** The blind pass read the Purpose, Feature set, `post-sale-US-05`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Run:** 2026-10-06, QA2 rerun after accept-review, not blind: the delta's requirements and scenarios, the durable suite and the cases above. It moved the reissue case to `post-sale-US-07`, the journey its scenario serves. The reissue log rule for Tax moved to `complete-auction-post-sale`'s `Invoice log history`, so this change modifies no log requirement.

### Folded

- `post-sale-US5-TC9-1`, an invoice sent with Tax whose Subtotal includes it -> `post-sale-SC-155`
- `post-sale-US5-TC10-1`, an invoice sent with Tax left empty carries no Tax line -> `post-sale-SC-156`
- `post-sale-US5-TC11-1`, Tax of zero refused -> `post-sale-SC-157`
- `post-sale-US7-TC38-1`, a reissue adding Tax whose new invoice carries it -> `post-sale-SC-158`
- `post-sale-US7-TC46-1`, a reissue removing Tax whose new invoice has none -> `post-sale-SC-210`

### Rejected

- No blind case was dropped.

### Escalated

- Is removing Tax on a reissue a change of its own, distinct from changing its amount? -> decisions Q8; answered under `## Settled`, and walked by `post-sale-US7-TC46-1` -> `post-sale-SC-210`

### Carried Unchanged

- **Quote and send** - `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-49`, `grade10-admin-auction-post-sale-SC-50`, `grade10-admin-auction-post-sale-SC-63`, `grade10-admin-auction-post-sale-SC-68`, `grade10-admin-auction-post-sale-SC-69`, `grade10-admin-auction-post-sale-SC-70`, `grade10-admin-auction-post-sale-SC-117`, `grade10-admin-auction-post-sale-SC-118`, `grade10-admin-auction-post-sale-SC-119` keep their meaning and their durable coverage
- **Reissue** - `grade10-admin-auction-post-sale-SC-107` to `-SC-115`, `grade10-admin-auction-post-sale-SC-125`, `grade10-admin-auction-post-sale-SC-126`, `grade10-admin-auction-post-sale-SC-133`, `grade10-admin-auction-post-sale-SC-134` keep their meaning and their durable coverage

**Out of suite:** none of this change's scenarios.
