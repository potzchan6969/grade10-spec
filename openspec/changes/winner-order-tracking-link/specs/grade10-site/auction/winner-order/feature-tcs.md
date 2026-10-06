# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what
is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC2-1: A dispatched lot shows the carrier and tracking link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_shipped>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped> | A paid order dispatched with <carrier> and <tracking number> |

**Steps:**

1. Read the shipment section.
2. Click <tracking number>.

**Expected Results:**

* Step 1: <carrier> and <tracking number> show.
* Step 2: the carrier's tracking page opens.

<!-- trace:case id=g10.auction-winner-order.TC-uox rev=1 covers=g10.auction-winner-order.SC-h7d -->
### winner-order-US2-TC13-1: Shipped Order Progress opens the carrier tracker

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <shipped order>.

**Test data:**

| Field | Value |
| --- | --- |
| <shipped order> | A paid order with fulfilment fulfilled, a tracking number and delivery not confirmed |
| <tracking number> | The tracking number recorded for <shipped order> |
| <carrier tracking URL> | The carrier's tracking page for <shipped order> |

**Steps:**

1. Read Order Progress.
2. Open <tracking number>.

**Expected Results:**

* Order Progress shows <tracking number> as an external link with an arrow icon.
* Order Progress shows no Track shipment button or carrier name.
* Step 2 opens <carrier tracking URL> in a new tab.

<!-- trace:case id=g10.auction-winner-order.TC-7zy rev=1 covers=g10.auction-winner-order.SC-k4r -->
### winner-order-US2-TC12-1: Delivered order keeps the carrier tracker

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <delivered order>.

**Test data:**

| Field | Value |
| --- | --- |
| <delivered order> | A paid order with fulfilment fulfilled, delivery confirmed and a tracking number |
| <tracking number> | The tracking number recorded for <delivered order> |
| <carrier tracking URL> | The carrier's tracking page for <delivered order> |

**Steps:**

1. Read Order Progress.
2. Open <tracking number>.

**Expected Results:**

* Order Progress still shows <tracking number> as an external link with an arrow icon.
* Order Progress shows no Track shipment button or carrier name.
* Step 2 opens <carrier tracking URL> in a new tab.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, for change `winner-order-tracking-link`. Reconciled both blind cases against the frozen `Order-progress tracking` feature-set group and `winner-order-US-02` journey, then read the delta scenarios, proposal, decisions, UI design, technical design, tasks, durable Winner Order spec and journeys, auction domain suite, and Post-Bidding · Order Status. This is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `US2-TC2-1` is the durable retained-record case with carrier identity | **Preserved:** it keeps the carrier and tracking link for `winner-order-SC-20`; the new chrome case does not rewrite it |
| `winner-order-SC-251` - fulfilled order shows and opens the tracking-number link | **Covered:** `winner-order-SC-251` ← `US2-TC13-1` |
| `winner-order-SC-252` - link remains after delivery is confirmed | **Covered:** `winner-order-SC-252` ← `US2-TC12-1` |
| The Raised questions about the Track shipment control and Delivered state | **Settled:** decisions Q1 and Q3; the shipped case checks no separate control, and the delivered case checks the link remains |
| Root group and journey coverage | **Covered:** both cases trace `winner-order-US-02`; neither case adds behavior outside `Order-progress tracking` |
| Uncovered scenarios | **None.** Both delta scenarios have a case; the durable suite and auction domain suite add no other scenario for this change's frozen anchors |
