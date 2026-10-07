# grade10-site/auction/auction-orders Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-auction-auction-orders-US1: Winner finds what each won order needs next

**As a** winner
**I want** one list of my auction orders, each with the action it needs
**so that** I complete order setupes and pay invoices without guessing which order is waiting on me.

<!-- trace:case id=g10.auction-auction-orders.TC-ci3 rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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

<!-- trace:case id=g10.auction-auction-orders.TC-rqf rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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
| <order_3> | A Preparing Shipment order whose lot closed yesterday |
| <order_4> | A Preparing Shipment order whose lot closed last week |

**Steps:**

1. Navigate to <grade10 my auction orders url>.

**Expected Results:**

* <order_2> is listed before <order_1>.
* <order_3> is listed before <order_4>.

<!-- trace:case id=g10.auction-auction-orders.TC-d48 rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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
| Awaiting Setup | not_issued | Complete Order Setup |
| Pending Payment | pending | Pay Invoice |
| Pending Payment | expired | View detail; Contact Us in detail |
| Preparing Invoice | not_issued | View detail |
| Preparing Shipment | paid | View detail |
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

<!-- trace:case id=g10.auction-auction-orders.TC-v2e rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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

<!-- trace:case id=g10.auction-auction-orders.TC-s1m rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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

<!-- trace:case id=g10.auction-auction-orders.TC-lp9 rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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

<!-- trace:case id=g10.auction-auction-orders.TC-k0c rev=1 covers=g10.auction-auction-orders.SC-nv4,g10.auction-auction-orders.SC-czj,g10.auction-auction-orders.SC-c1n,g10.auction-auction-orders.SC-lqy,g10.auction-auction-orders.SC-xrg,g10.auction-auction-orders.SC-82x,g10.auction-auction-orders.SC-0y5,g10.auction-auction-orders.SC-oor,g10.auction-auction-orders.SC-wgn,g10.auction-auction-orders.SC-yt5,g10.auction-auction-orders.SC-t2o -->
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

## Settled

* A Won row on My Auctions opening its own order is `grade10-site/auction/account-record`'s to walk; this suite walks the list from its address.
* The account menu does not open the list; `grade10-site/site/page-shell` holds the menu's items.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, for `omit-profile-account-menu`, `grade10-site/auction/auction-orders`. The modified requirement drops one sentence, that the account menu links to My Auction Orders beside My Auctions; its four scenarios are carried word for word. No durable case moves.

**Run:** QA2 reconciliation, second run, 2026-10-06. No disposition moved. The journeys file now restates `grade10-site-auction-auction-orders-US-01` under `## Context user journeys`, the delta form, since the change modifies no journey; the suite carries no section for it because no case here moves.

**Run:** QA2 reconciliation, third run, 2026-10-06. `## Settled` records Q10: the account menu does not open the list. The feature set now says a Won row opens its own order, not the list. No case or scenario moved.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the delta's feature set kept only its Entry points line. No case or scenario moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, in a fresh context. The four carried scenarios and the seven durable cases were joined again; none names the account menu, so no case or scenario moved.

**Run:** QA2 reconciliation, sixth run, 2026-10-07, in a fresh context, on Product's answer to Q13. The four carried scenarios and the seven durable cases were joined again; the link from My Auctions is a later change's, so no case or scenario moved.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-auction-auction-orders-US1-TC8-1` | Rejected, duplicate | A Won row on My Auctions opening its own order is `grade10-site/auction/account-record`'s rule, walked by `grade10-site-auction-account-record-US8-TC1-1`; no scenario here states it. Dropped before it was issued |
| The account-menu link | Dropped, no case | No case asserted it and no scenario stated it. The menu's closed set is `grade10-site/site/page-shell`'s, where the auction-launch menu offers My Auctions and Sign Out and no other item |
| Raised: what opens the list | Landed as Q13, settled | With the menu entry gone and each Won row opening its own order, nothing in the site opens the list. Product decided My Auctions links to it; a later change builds the link with its scenario and case, so no case here moves |
| Contradictions | None | The durable cases walk the list from its address and agree with the carried scenarios |
