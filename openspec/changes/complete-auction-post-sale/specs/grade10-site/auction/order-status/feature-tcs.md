# grade10-site/auction/order-status Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** none for this change's new scenarios; the scenarios it restates unchanged keep their durable cases.

## auction-status-US1: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

<!-- trace:case id=g10.auction-order-status.TC-hwr rev=1 covers=g10.auction-order-status.SC-tc9,g10.auction-order-status.SC-i18,g10.auction-order-status.SC-wlf,g10.auction-order-status.SC-y48,g10.auction-order-status.SC-mej,g10.auction-order-status.SC-sx5,g10.auction-order-status.SC-fmg,g10.auction-order-status.SC-r6z,g10.auction-order-status.SC-d22,g10.auction-order-status.SC-j9x,g10.auction-order-status.SC-wt0,g10.auction-order-status.SC-er6,g10.auction-order-status.SC-e4v,g10.auction-order-status.SC-q1w,g10.auction-order-status.SC-dq1,g10.auction-order-status.SC-x14,g10.auction-order-status.SC-1xq -->
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

<!-- trace:case id=g10.auction-order-status.TC-64l rev=1 covers=g10.auction-order-status.SC-ztl,g10.auction-order-status.SC-wjo,g10.auction-order-status.SC-4yo,g10.auction-order-status.SC-9bm,g10.auction-order-status.SC-soi,g10.auction-order-status.SC-kki,g10.auction-order-status.SC-e1r -->
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

<!-- trace:case id=g10.auction-order-status.TC-tvc rev=1 covers=g10.auction-order-status.SC-ztl,g10.auction-order-status.SC-wjo,g10.auction-order-status.SC-4yo,g10.auction-order-status.SC-9bm,g10.auction-order-status.SC-soi,g10.auction-order-status.SC-kki,g10.auction-order-status.SC-e1r -->
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

<!-- trace:case id=g10.auction-order-status.TC-bur rev=1 covers=g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-er6 -->
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

### auction-status-US1-TC20-1: Proof upload is refused on an invoice that is not pending

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
* **Trace:** auction-status-US-01

**Pre-conditions:**

* An auction order whose invoice status is `<status>`.

**Test data:**

| `<status>` |
| --- |
| `not_issued` |
| `paid` |
| `cancelled` |

**Steps:**

1. Record a winner proof upload against the invoice.
2. Read the invoice status.

**Expected Results:**

* The upload is refused.
* The invoice status is still `<status>`.

### auction-status-US1-TC21-1: A new order starts not issued and unfulfilled, and expiry writes only the invoice status

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
* **Trace:** auction-status-US-01

**Pre-conditions:**

* A published lot with a winning bid, whose close is due.

**Steps:**

1. Let the lot close, and read the new auction order's invoice and fulfilment statuses.
2. Send its invoice with a payment deadline of 2026-09-19T09:00:00Z, then let that deadline pass with no payment.
3. Read both statuses again.

**Expected Results:**

* Step 1 reads `not_issued` and `unfulfilled`.
* Step 3 reads `expired` and `unfulfilled`.

### auction-status-US1-TC22-1: Reissuing an expired invoice makes it pending with the new deadline

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
* **Trace:** auction-status-US-01

**Pre-conditions:**

* An auction order whose invoice status is `expired`.
* admin(operator with payment processing).

**Steps:**

1. Reissue the invoice with a fresh deadline and a reason.
2. Read the invoice status and the payment deadline.

**Expected Results:**

* The invoice status is `pending`.
* The payment deadline is the one the reissue set.

### auction-status-US1-TC23-1: A write the transitions do not allow leaves the invoice status unchanged

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
* **Trace:** auction-status-US-01

**Pre-conditions:**

* An auction order in the row's starting state.
* admin(operator with payment processing).

**Test data:**

| Starting state | Write |
| --- | --- |
| `paid` | Set the invoice status to `pending` |
| `cancelled` | Record a payment against the invoice |
| `not_issued`, with no delivery address confirmed | Send the invoice |

**Steps:**

1. Attempt the row's write.
2. Read the invoice status.

**Expected Results:**

* The write is refused.
* The invoice status is still the row's starting status.

### auction-status-US1-TC24-1: Proof moves a pending invoice to payment_verifying, and an operator moves it on

Runs once per row of **Test data**.

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
* **Trace:** auction-status-US-01

**Pre-conditions:**

* An auction order whose bank transfer invoice is `pending` and whose fulfilment status is `unfulfilled`.
* admin(operator with payment processing).

**Test data:**

| `<check>` | `<invoice status>` | `<order status>` |
| --- | --- | --- |
| return | `pending` | Pending Payment |
| confirm | `paid` | Preparing Shipment |

**Steps:**

1. Record a winner proof upload, and read the invoice status.
2. As the operator, <check> the proof.
3. Read the invoice status and the derived order status.

**Expected Results:**

* Step 1 reads `payment_verifying`.
* Step 3 reads <invoice status> and <order status>.

## Settled

- A card payment that completes is never turned away: at the order total it pays a pending invoice, and an expired one flagged Paid late; anywhere else it is recorded, flagged, and moves nothing.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the journey and the post-sale requirement on money that lands, then joined to the scenarios on their anchors.

**Run:** 2026-10-06, QA2. A fresh reader joined every scenario and every case in this suite on their anchors. "Kept with the durable suite" did not hold: the durable suite asserts few of the restated scenarios, so each is named below.

| Spec scenario | Disposition |
| --- | --- |
| `auction-status-SC-01`, `SC-02` | Were uncovered; added `US1-TC21-1` |
| `auction-status-SC-03` | Was uncovered; added `US1-TC22-1` |
| `auction-status-SC-42` | Covered by the durable `auction-status-US1-TC13-1`, restored from its archive |
| `auction-status-SC-13`, `SC-14`, `SC-22` | Were uncovered; added `US1-TC23-1` |
| `auction-status-SC-25` | Covered by `US1-TC19-1`, and by the durable `auction-status-US1-TC2-1` |
| `auction-status-SC-45`, `SC-47` | Were uncovered once their archived cases were lost; added `US1-TC24-1` |
| `auction-status-SC-46` | Covered by `US1-TC19-1` for the card payment, by the durable `auction-status-US1-TC14-1` for the reissue, and for cancel and manual settlement by `post-sale-US7-TC19-1`, which states them on the operator's side |
| `auction-status-SC-48` | Covered by the durable `auction-status-US1-TC15-1` for `expired`, and by `US1-TC20-1` for the other three |
| `auction-status-SC-55` | Covered by `US1-TC16-1` |
| `auction-status-SC-56` | Covered by `US1-TC17-1` |
| `auction-status-SC-57` | Covered by `US1-TC18-1` |
| Contradicted readings | None |

- **Covered** - each blind case reaches the scenario named for it; none carries behaviour no scenario states.
- **Restored** - the durable `auction-status-US1-TC13-1` to `-TC15-1`, archived with `2026-09-18-add-winner-bank-transfer` and left behind by its fold, are back in the durable suite as drafts.
- **Raised for the human** - the same archive's `auction-status-US1-TC4-1` to `-TC12-1` were lost too, but `close-overdue-address-confirmation` has since issued those ids with other meanings, so the validator reads them as live. Their scenarios are covered above; the ids need a decision in that change.
- **Out of suite:** none.
