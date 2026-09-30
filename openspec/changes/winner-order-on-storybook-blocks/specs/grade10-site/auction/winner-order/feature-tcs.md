# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r4

**Out of suite:** winner-order-SC-243 keeps its durable case, `winner-order-US19-TC2-1`, which the new page does not move.

## winner-order-US4: Winner pays an invoice by card

**As a** winner
**I want** to see the full invoice and pay it by card, even if a first attempt does not finish
**so that** the lot moves to Preparing Shipment without contacting Grade10.

### winner-order-US4-TC1-2: An unpaid order shows invoice, Pay with Card, address and lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order in Pending Payment, with invoice status
  `pending` or `expired`.

**Steps:**

1. Navigate to <grade10 auction order url>.

**Expected Results:**

* Every invoice line and Pay with Card are shown in the order summary.
* The confirmed delivery address and the lot are shown.
* An expired invoice still reads Pending Payment and offers Contact Us instead
  of Pay with Card.

### winner-order-US4-TC2-1: Order Information reads Invoice Status, not Paid Status

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) holds an order whose invoice status is paid.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Scroll to Order Information.

**Expected Results:**

* Invoice Status reads Paid.
* No Paid Status label appears.

<!-- trace:case id=g10.auction-winner-order.TC-td7 rev=1 covers=g10.auction-winner-order.SC-1yn -->
### winner-order-US4-TC7-1: A suspended winner reads the suspension under the lot

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
* **Trace:** winner-order-US-04

**Pre-conditions:**

* customer(winner) is suspended from bidding and holds an order whose invoice
  is `pending`.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Read the alerts under the lot.
3. Choose Pay what is owed.

**Expected Results:**

* An alert under the lot says bidding is suspended and payment does not lift it.
* Choosing Pay what is owed brings the order summary's pay control into view.

## winner-order-US19: Winner confirms where a won lot ships

**As a** winner
**I want** to fill in and confirm a delivery address on the order
**so that** Grade10 can quote shipping to the right place.

<!-- trace:case id=g10.auction-winner-order.TC-clp rev=2 covers=g10.auction-winner-order.SC-cu4 -->
### winner-order-US19-TC1-2: The page shows the lot once and none of the old sections

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
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order in Awaiting Setup.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Read the page from the header to the sidebar.

**Expected Results:**

* The header shows Winner Order and the status badge.
* Order Progress shows Address current, then Invoice, Payment, Shipping and
  Completed.
* The lot's title shows in the lot card only.
* No Order Information, Collection Method, Order Status list or Lots section
  shows.

### winner-order-US19-TC5-1: Timeline uses the auction-order read model timestamps

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-19

**Pre-conditions:**

* customer(winner) holds an order whose auction-order read model returns a
  recorded timestamp for each reached status.

**Steps:**

1. Navigate to <grade10 auction order url>.
2. Read the Order Status section.

**Expected Results:**

* Each status shows the timestamp returned for that status.
* No timestamp is replaced with the page-load time.

## Reconciliation

| Scenario | Case | Finding |
| --- | --- | --- |
| winner-order-SC-241 | winner-order-US19-TC1-2 | The case adds the five progress steps, which "Winner Order shows five progress steps" already requires |
| winner-order-SC-240 | winner-order-US4-TC7-1 | The case adds that Pay what is owed brings the pay control into view, which the scenario leaves to the page |
| winner-order-SC-242 | winner-order-US4-TC1-2 | Agree |
