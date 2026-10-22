# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US13: Winner learns their order was cancelled

**As a** winner whose order an operator cancelled,
**I want** Winner Order to say it was cancelled and when,
**so that** I know the order is closed and how to contact Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-3x8 rev=2 covers=g10.auction-winner-order.SC-1fb -->
### winner-order-US13-TC1-2: Cancelled keeps the lot and winning bid visible

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-13

**Pre-conditions:**

* customer(winner of `<cancelled order>`) is on Winner Order.

**Steps:**

1. Read the status, lot, winning bid and actions.

**Expected Results:**

* The page says Cancelled on the cancellation day, as a day-only date in the winner's local zone.
* The lot and winning bid remain visible.
* Contact Us is the only action.
* No cancellation reason is shown.

## winner-order-US16: Winner emails Grade10 from a locked order

**As a** winner whose payment access has closed,
**I want** a ready email with this order's details that I can copy into any mail app,
**so that** I can reach Grade10 without a system mail client, and support can find the order.

<!-- trace:case id=g10.auction-winner-order.TC-v40 rev=1 covers=g10.auction-winner-order.SC-e1w -->
### winner-order-US16-TC14-1: Contact Us on a cancelled order reads order cancelled

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
* **Trace:** winner-order-US-16

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_cancelled>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_cancelled> | An order an operator cancelled, with a category and note |
| <lot_title> | That order's lot title |
| <invoice_id> | That order's invoice id |

**Steps:**

1. Click Contact Us.
2. Read Subject and Message.

**Expected Results:**

* Subject reads `Auction lot <lot_title>: order cancelled`.
* Message names <lot_title>, <invoice_id> and status Cancelled.
* Neither names the operator's category or note.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The winner sees retained facts without the internal reason | **Folded in:** `winner-order-SC-143` |
| Contact Us on a cancelled order reads `order cancelled` | **Folded in:** `winner-order-SC-275` |
