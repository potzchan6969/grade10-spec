# grade10-site/auction/order-status Test Cases

**Status:** pending-review · 0/31
**Drafts styled:** 2026-09-30, tcs-rules r3.0
**Out of suite:** none for this change's new scenarios; the scenarios it restates unchanged keep their durable cases.

## auction-status-US1: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

<!-- trace:case id=g10.auction-order-status.TC-87a rev=1 covers=g10.auction-order-status.SC-agq -->
### auction-status-US1-TC1-1: Expired derives Payment Overdue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** auction-status-US-01

**Pre-conditions:**

* Auction order invoice becomes `expired` at the deadline.

**Steps:**

1. Read derived order status.

**Expected Results:**

* Order status is Payment Overdue.

<!-- trace:case id=g10.auction-order-status.TC-7qi rev=1 covers=g10.auction-order-status.SC-0sk -->
### auction-status-US1-TC2-1: Winner card pay is refused when expired

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

* Invoice status is `expired`.

**Steps:**

1. Submit a winner card payment for the invoice.

**Expected Results:**

* Payment is refused.
* Invoice remains `expired`.
* Order status remains Payment Overdue.

<!-- trace:case id=g10.auction-order-status.TC-usq rev=1 covers=g10adm.auction-post-sale.SC-b5v -->
### auction-status-US1-TC3-1: Operator manual settle pays an expired invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** auction-status-US-01

**Pre-conditions:**

* Invoice status is `expired`; operator holds payment-processing.

**Steps:**

1. Operator records a manual settlement with method and proof.

**Expected Results:**

* Invoice becomes `paid`.
* Order derives as Processing.

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

## auction-status-US2: Refund is terminal after partial collection

**As a** winner or operator,
**I want** a refunded order to remain terminal,
**so that** later payment events cannot reopen it.

<!-- trace:case id=g10.auction-order-status.TC-sq7 rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn -->
### auction-status-US2-TC1-1: A refund is terminal after partial collection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has invoice status `refunded` after partial payment and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Refunded.
* It does not return to Partially Paid or Processing.

<!-- trace:case id=g10.auction-order-status.TC-ys1 rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn -->
### auction-status-US2-TC2-1: An overpayment keeps the existing status

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
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has a payment above its invoice total and the difference has been returned.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order keeps its status from before the overpayment return.
* The status is not Refunded.

## auction-status-US3: Payment deadline past reads Payment Overdue

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue,
**so that** the status shows self-service Pay has closed.

<!-- trace:case id=g10.auction-order-status.TC-5y9 rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn -->
### auction-status-US3-TC1-1: An expired invoice derives Payment Overdue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An unpaid invoice has stored status `expired` and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Payment Overdue.
* Winner card Pay is unavailable.

## auction-status-US4: Setup deadline past reads Setup Overdue

**As a** winner or operator,
**I want** incomplete setup past its deadline to read Setup Overdue,
**so that** the status shows self-service Confirm has closed.

<!-- trace:case id=g10.auction-order-status.TC-z6j rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn -->
### auction-status-US4-TC1-1: An incomplete setup derives Setup Overdue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has no confirmed address, no invoice and a passed address deadline.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Setup Overdue.
* Winner address confirmation is unavailable.

## auction-status-US5: Winner misses the address deadline

**As a** winner whose address window has closed,
**I want** to understand that Grade10 must reopen the form,
**so that** I know why I cannot confirm the address myself.

<!-- trace:case id=g10.auction-order-status.TC-4zb rev=1 covers=g10.auction-order-status.SC-w76 -->
### auction-status-US5-TC4-1: No invoice and no address reads Awaiting Setup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* `<awaiting-address order>` was opened by a lot close, its invoice status is `not_issued`, and no delivery address is confirmed.
* Its address window is open.

**Steps:**

1. Read the derived order status.
2. Read the invoice status.

**Expected Results:**

* The order status is Awaiting Setup.
* The invoice status is `not_issued`.
* Both the winner and the operator read the same status.

<!-- trace:case id=g10.auction-order-status.TC-dg1 rev=1 covers=g10.auction-order-status.SC-7zj -->
### auction-status-US5-TC5-1: A confirmed address reads Preparing Invoice before send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* `<preparing-invoice order>`'s invoice status is `not_issued` and its winner confirmed a delivery address.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order status is Preparing Invoice.
* The invoice status is still `not_issued`.

<!-- trace:case id=g10.auction-order-status.TC-d32 rev=1 covers=g10.auction-order-status.SC-cgu,g10.auction-order-status.SC-nin -->
### auction-status-US5-TC6-1: A closed address window without an address reads Setup Overdue

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
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* The order's invoice status is `not_issued` and its 48-hour address window closed two hours ago.

**Test data:**

| Order | Delivery address | Order status |
| --- | --- | --- |
| `<awaiting-address order>` | none confirmed | Setup Overdue |
| `<preparing-invoice order>` | confirmed inside the window | Preparing Invoice |

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order status is the one the row names.
* A closed window without an address derives Setup Overdue.
* The invoice status is still `not_issued`.

<!-- trace:case id=g10.auction-order-status.TC-la5 rev=1 covers=g10.auction-order-status.SC-9bm -->
### auction-status-US5-TC7-1: A winner's address write is refused on a closed window

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

* `<awaiting-address order>`'s address window closed two hours ago, no address
  is confirmed, its invoice status is `not_issued`, and it derives Setup Overdue.
* customer(winner of `<awaiting-address order>`) is signed in.

**Steps:**

1. Submit a delivery address confirmation as the winner.
2. Read the order's stored delivery address and status.

**Expected Results:**

* The write is refused.
* The order holds no confirmed delivery address.
* The order status is still Setup Overdue.

## auction-status-US6: Operator resolves a missed address deadline

**As an** operator,
**I want** to reopen the address form or record the address the winner gave by phone,
**so that** the order can continue from Setup Overdue without reopening winner self-service unnecessarily.

<!-- trace:case id=g10.auction-order-status.TC-43a rev=1 covers=g10.auction-order-status.SC-sx5 -->
### auction-status-US6-TC8-1: An order with no invoice cannot be dispatched

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

* `<preparing-invoice order>`'s invoice status is `not_issued` and its delivery address is confirmed.
* admin(holds fulfilment) is on `<preparing-invoice order>`.

**Steps:**

1. Attempt to dispatch `<preparing-invoice order>`.
2. Read the derived order status.

**Expected Results:**

* The dispatch is refused.
* No tracking facts are recorded.
* The order status is still Preparing Invoice.

<!-- trace:case id=g10.auction-order-status.TC-36u rev=1 covers=g10.auction-order-status.SC-j9x -->
### auction-status-US6-TC9-1: An invoice is refused a send with no confirmed address

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

* `<awaiting-address order>`'s invoice status is `not_issued` and no delivery address is confirmed.
* admin(holds payment-processing) is on `<awaiting-address order>`.

**Steps:**

1. Attempt to send the invoice.
2. Read the invoice status.

**Expected Results:**

* The send is refused.
* The invoice status is still `not_issued`.
* No payment deadline is started.

<!-- trace:case id=g10.auction-order-status.TC-uot rev=1 covers=g10.auction-order-status.SC-g4b,g10.auction-order-status.SC-soi -->
### auction-status-US6-TC10-1: A reopen restores the write through derived status

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
* **Trace:** Supplementary conditions

**Pre-conditions:**

* `<awaiting-address order>` derived as Setup Overdue because its address
  window closed two hours ago, it has no confirmed address, and its invoice
  status is `not_issued`.
* An operator holding payment-processing has reopened the address form with a reason.

**Steps:**

1. Read the derived order status.
2. Submit a delivery address confirmation as the winner.
3. Read the derived order status again.

**Expected Results:**

* Step 1 reads Awaiting Setup, derived from the reopened window.
* The write is accepted.
* Step 3 reads Preparing Invoice.

<!-- trace:case id=g10.auction-order-status.TC-3lv rev=1 covers=g10.auction-order-status.SC-kki -->
### auction-status-US6-TC12-1: An operator's address write is accepted on a closed window

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Guards

**Pre-conditions:**

* `<closed-window order>` is unconfirmed Setup Overdue with invoice status `not_issued` and `address_window_open` false.

**Steps:**

1. As an operator holding payment-processing, record a delivery address on the order.
2. Read the order's conditions and derived status.

**Expected Results:**

* The write is accepted.
* `address_confirmed` is true and `address_window_open` is still false.
* The order derives as Preparing Invoice.

## auction-status-US7: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with a recorded payment to read Partially Paid,
**so that** the status says who settles the remaining money.

<!-- trace:case id=g10.auction-order-status.TC-jzx rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn,g10.auction-order-status.SC-cgu,g10.auction-order-status.SC-nin,g10.auction-order-status.SC-4ke -->
### auction-status-US7-TC3-1: A recorded payment derives Partially Paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has invoice status `partially_paid`, a positive remaining balance, and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The derived status is Partially Paid.
* The remaining balance is not used to derive a different status.

<!-- trace:case id=g10.auction-order-status.TC-p49 rev=1 covers=g10.auction-order-status.SC-ztl,g10.auction-order-status.SC-wjo,g10.auction-order-status.SC-4yo,g10.auction-order-status.SC-9bm,g10.auction-order-status.SC-soi,g10.auction-order-status.SC-kki,g10.auction-order-status.SC-e1r -->
### auction-status-US7-TC4-1: Partially Paid has no self-service deadline

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

* An auction order is Partially Paid and still has money due.

**Steps:**

1. Attempt winner card Pay, invoice reissue and operator cancellation.

**Expected Results:**

* Winner Pay, reissue and cancellation are refused.
* The order remains Partially Paid.

<!-- trace:case id=g10.auction-order-status.TC-zxi rev=1 covers=g10.auction-order-status.SC-3ko -->
### auction-status-US7-TC5-1: Money that counts toward nothing moves no status

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
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order is in Pending Payment, and its only recorded payment counts toward nothing.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The derived status is Pending Payment.
* The derived status is not Partially Paid.

## auction-status-US8: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** a paid, undispatched order to read Preparing Shipment,
**so that** Status alone shows packing without implying the lot already shipped.

<!-- trace:case id=g10.auction-order-status.TC-sik rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn,g10.auction-order-status.SC-cgu,g10.auction-order-status.SC-nin,g10.auction-order-status.SC-4ke -->
### auction-status-US8-TC7-1: Paid and undispatched derives Preparing Shipment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order exists with invoice `paid` and fulfilment `unfulfilled`.

**Steps:**

1. Read derived order status.

**Expected result:**

* Order derives as Preparing Shipment.

## Raised

- None for this slice.

## Settled

- Winner card pay after expiry removed (author @tangconst).
- Operator paths on expired remain.
- A card payment that completes is never turned away: at the order total it pays a pending invoice, and an expired one flagged Paid late; anywhere else it is recorded, flagged, and moves nothing.

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.

| Raised | Disposition |
| --- | --- |
| What fact says the window is open — a stored closing time, close plus 48 hours, or a reopen count | **Left to the engineer.** The requirement says the condition is read from the order's own facts and stored as no enum, which `auction-status-SC-30` proves. Which fact carries it is `tech-design.md` |
| Whether an operator may correct the address on a closed-window order | **Folded in** after a grilling round. They may, without reopening — `auction-status-SC-35` and `auction-status-US6-TC12-1` |
| Whether recording refuses an ineligible order | **Moved.** The refusals belong to `complete-auction-post-sale`'s "An operator reopens the address form". The refusal scenario and its case are retired with their ids, and this suite keeps only the condition, in `auction-status-SC-35` |
| How a passed address deadline reads | **Folded in:** an unconfirmed order past its address deadline derives Setup Overdue, read through `address_deadline_passed`; a reopened deadline derives Awaiting Setup; Preparing Invoice does not derive Setup Overdue. `address_window_open` gates writes only. Its payment Overdue timer starts only after invoice send and winner visibility |
| What `not_issued` becomes on a pre-invoice cancellation | **Dropped.** the durable Winner Order rules already permits `not_issued` to `cancelled`. The suite was blind to it |
| What a reissue does to a stored `expired` | **Dropped.** Already settled by the durable Winner Order rules, and out of scope here |
| How the suite groups status checks | **Settled.** The status readings and the refused winner write sit under `auction-status-US-05`, the winner's missed-deadline journey. The send and dispatch guards, the reopen and the operator's write sit under `auction-status-US-06`, the operator's resolution journey |
| Where the expiry-write case sat | **Dropped.** `auction-status-US6-TC11-1` read the stored `expired` status under the operator's address journey, which it does not walk. Writing `expired` is the expired-invoice journey's, and the hold while a card payment started in time is proved in `grade10-admin/auction/post-sale` |

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** `auction-status-SC-07` ← `US1-TC7-1`.
- **Raised:** none.

| Finding | Disposition |
| --- | --- |
| Partially Paid is derived and removes self-service | **Folded in:** `auction-status-SC-49` and `auction-status-SC-50` |
| Money that counts toward nothing moves no status | **Folded in:** `auction-status-SC-49` and `auction-status-SC-58`; carried here for `complete-auction-post-sale`, since one in-flight change edits a requirement at a time |

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

**Run:** 2026-10-08, amendment for the address lock, not blind: the closing paragraph of the address-window conditions, the durable suite and the cases above. The address locks on confirm, not at send, so the paragraph says an invoice is sent only on a confirmed address.

- **Carried unchanged** - every scenario keeps its meaning and its case; `address_window_open` is still read only while the invoice is `not_issued`
