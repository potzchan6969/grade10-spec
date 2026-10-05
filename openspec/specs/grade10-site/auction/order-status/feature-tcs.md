# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## auction-status-US1: Expired invoice reads Payment Overdue without winner card pay

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

## Raised

- None for this slice.

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

## Settled

- Winner card pay after expiry removed (author @tangconst).
- Operator paths on expired remain.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Overdue names are derived from deadline and invoice facts | **Folded in** |

- **Restored** - `auction-status-US1-TC13-1` to `auction-status-US1-TC15-1`, archived with `2026-09-18-add-winner-bank-transfer` and left behind by its fold, are back as draft, unchanged, for `/tcs-review`.
