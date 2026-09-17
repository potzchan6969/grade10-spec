# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## auction-status-US1: Reading an auction order nobody walks on its own

**As a** winner or operator,
**I want** an expired invoice to stay Pending Payment without winner card pay,
**so that** the deadline ends self-service settlement while operators can still resolve the order.

### auction-status-US1-TC4-1: No invoice and no address reads Awaiting Setup

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

### auction-status-US1-TC5-1: A confirmed address reads Preparing Invoice before send

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

### auction-status-US1-TC6-1: A closed address window keeps the status the order had

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
| `<awaiting-address order>` | none confirmed | Awaiting Setup |
| `<preparing-invoice order>` | confirmed inside the window | Preparing Invoice |

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order status is the one the row names.
* No order status of its own is produced for a closed window.
* The invoice status is still `not_issued`.

### auction-status-US1-TC7-1: A winner's address write is refused on a closed window

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

* `<awaiting-address order>`'s address window closed two hours ago and no address is confirmed.
* customer(winner of `<awaiting-address order>`) is signed in.

**Steps:**

1. Submit a delivery address confirmation as the winner.
2. Read the order's stored delivery address and status.

**Expected Results:**

* The write is refused.
* The order holds no confirmed delivery address.
* The order status is still Awaiting Setup.

### auction-status-US1-TC8-1: An order with no invoice cannot be dispatched

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

### auction-status-US1-TC9-1: An invoice is refused a send with no confirmed address

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

### auction-status-US1-TC10-1: A reopen restores the write and changes no status

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

* `<awaiting-address order>`'s address window closed two hours ago and no address is confirmed.
* An operator holding payment-processing has reopened the address form with a reason.

**Steps:**

1. Read the derived order status.
2. Submit a delivery address confirmation as the winner.
3. Read the derived order status again.

**Expected Results:**

* Step 1 reads Awaiting Setup, unchanged by the reopen.
* The write is accepted.
* Step 3 reads Preparing Invoice.

### auction-status-US1-TC11-1: Expiry is a written invoice status, not a time read

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

* `<expired-invoice order>`'s invoice was sent, is unpaid, and its deadline is one minute away.

**Test data:**

| Field | Value |
| --- | --- |
| Payment deadline | 2026-09-12T09:00:00Z |
| Read before | 2026-09-12T08:59:00Z |
| Read after | 2026-09-12T09:01:00Z |

**Steps:**

1. Read the stored invoice status before the deadline.
2. Read the stored invoice status after the deadline.
3. Read the derived order status.

**Expected Results:**

* Step 1 reads `pending`.
* Step 2 reads `expired` as a stored fact on the invoice.
* Step 3 reads Pending Payment, before and after alike.

### auction-status-US1-TC12-1: An operator's address write is accepted on a closed window

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

* `<closed-window order>` has invoice status `not_issued` and `address_window_open` false.

**Steps:**

1. As an operator holding payment-processing, record a delivery address on the order.
2. Read the order's conditions and derived status.

**Expected Results:**

* The write is accepted.
* `address_confirmed` is true and `address_window_open` is still false.
* The order derives as Preparing Invoice.

## Raised

- **Which fact says the address window is open.** The window is a third condition read from the order's own facts, and the input never names the fact — a stored address deadline, the lot close plus 48 hours, or a reopen count. TC6 and TC10 assume a stored address deadline that a reopen rewrites.
- **Whether `not_issued` survives a cancellation before send.** Cancellation is now available before an invoice exists, and the input gives `not_issued` no exit other than a send. Nothing says whether such an order's invoice status becomes `cancelled` or stays `not_issued` while the order derives Cancelled.
- **What a reissue does to an `expired` invoice's stored status.** Expiry is a written fact; a reissue is said to return the order to Pending Payment with a new deadline, and nothing says whether the same invoice is rewritten to `pending` or a second invoice is issued.
- **Whether the Overdue mark is a derived read or a stored one.** The mark is said to change no status, but the input places it on the operator's queue only, and does not say whether the derivation produces it for the winner's surfaces too.
- **A missing journeys file.** This change's `order-status` delta had no `user-journeys.md` beside its `spec.md`, so the capability's anchors could not be read from the delta at all. The journey in this suite's heading was taken from the input bundle.

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.

| Raised | Disposition |
| --- | --- |
| What fact says the window is open — a stored closing time, close plus 48 hours, or a reopen count | **Left to the engineer.** The requirement says the condition is read from the order's own facts and stored as no enum, which `auction-status-SC-30` proves. Which fact carries it is `tech-design.md` |
| Whether an operator may correct the address on a closed-window order | **Folded in** after a grilling round. They may, without reopening — `auction-status-SC-35` and `auction-status-US1-TC12-1` |
| Whether the Overdue mark is a live read or a historical flag | **Agreed** by both readings, then **handed on.** The mark's requirement belongs to `revise-auction-winner-invoicing`, which this change may not fold, so the rule is an open item on the Post-Sale Queue page rather than a scenario here |
| What `not_issued` becomes on a pre-invoice cancellation | **Dropped.** `revise-auction-winner-invoicing` already permits `not_issued` to `cancelled`. The suite was blind to it |
| What a reissue does to a stored `expired` | **Dropped.** Already settled by `revise-auction-winner-invoicing`, and out of scope here |
| This capability's section heading | **Retitled.** Nobody walks this capability on its own, so its cases trace feature set groups and the heading names the reading rather than a journey |
