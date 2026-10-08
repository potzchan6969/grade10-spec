# grade10-site/auction/order-status Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-09-16, tcs-rules r3.0

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
