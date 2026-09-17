# grade10-site/auction/auction-orders Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-auction-auction-orders-US1: Winner finds what each won order needs next

**As a** winner
**I want** one list of my auction orders, each with the action it needs
**so that** I confirm addresses and pay invoices without guessing which order is waiting on me.

### grade10-site-auction-auction-orders-US1-TC1-1: Every won order is listed once with its details

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
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(winner) has won three lots.

**Steps:**

1. Navigate to <grade10 my auction orders url>.

**Expected Results:**

* Three rows are listed, one per order.
* Each row shows lot image, title, auction, winning bid, order status.

### grade10-site-auction-auction-orders-US1-TC2-1: Orders waiting on the winner are listed first

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
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(winner) holds <order_1>, <order_2>, <order_3> and <order_4>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_1> | A Delivered order whose lot closed yesterday |
| <order_2> | A Pending Payment order whose lot closed last week |
| <order_3> | A Processing order whose lot closed yesterday |
| <order_4> | A Processing order whose lot closed last week |

**Steps:**

1. Navigate to <grade10 my auction orders url>.

**Expected Results:**

* <order_2> is listed before <order_1>.
* <order_3> is listed before <order_4>.

### grade10-site-auction-auction-orders-US1-TC3-1: Each order status offers its own action

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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(winner) holds an order in <order status>, invoice status <invoice status>.

**Test data:**

| Order status | Invoice status | Action |
| --- | --- | --- |
| Awaiting Address | not_issued | Confirm address |
| Pending Payment | pending | Pay Invoice |
| Pending Payment | expired | Pay Invoice |
| Preparing Invoice | not_issued | View detail |
| Processing | paid | View detail |
| Shipped | paid | View detail |
| Delivered | paid | View detail |
| Cancelled | cancelled | View detail |
| Refunded | refunded | View detail |

**Steps:**

1. Navigate to <grade10 my auction orders url>.
2. Click the row action on that order.

**Expected Results:**

* The row action reads <action>.
* Step 2 opens that order.

### grade10-site-auction-auction-orders-US1-TC4-1: View lot opens the lot's listing page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(winner) holds one order on <grade10 my auction orders url>.

**Steps:**

1. Navigate to <grade10 my auction orders url>.
2. Click View lot on the order.

**Expected Results:**

* The lot's listing page opens.

### grade10-site-auction-auction-orders-US1-TC5-1: Another collector's orders are never listed

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
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer A and customer B have each won one lot.
* customer A is signed in.

**Steps:**

1. Navigate to <grade10 my auction orders url>.

**Expected Results:**

* Only customer A's order is listed.
* customer B's order does not appear.

### grade10-site-auction-auction-orders-US1-TC6-1: An empty list points to My Auctions

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(signed in, has won no lots).

**Steps:**

1. Navigate to <grade10 my auction orders url>.
2. Click the way to My Auctions.

**Expected Results:**

* No error is reported.
* Step 2 opens <grade10 my auctions url>.

### grade10-site-auction-auction-orders-US1-TC7-1: A failed read offers retry, not an empty list

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-orders-US-01

**Pre-conditions:**

* customer(winner) is signed in.
* The auction orders read is made to fail.

**Steps:**

1. Navigate to <grade10 my auction orders url>.

**Expected Results:**

* The page says the read failed and offers retry.
* No empty list is shown.
