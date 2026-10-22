# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-22, tcs-rules r5

## g10.auction-winner-order.US02: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what
is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-b6h rev=1 covers=g10.auction-winner-order.SC-n5y -->
### g10.auction-winner-order.US2-TC57: The receipt link names its ID and issue date

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** ui
* **Automation status:** automated
* **Testability:** automated
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<winner_order_300_1>` is paid, with a receipt whose ID and issue date are recorded.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_300_1 | A paid order whose receipt is `RC-LK7P2Q01P1`, issued on 22 Sep 2026; bind its identity only |

**Steps:**

1. Open Winner Order on `<winner_order_300_1>` and read the receipt link.

**Expected Results:**

* The link reads `Receipt #RC-LK7P2Q01P1 (22 Sep 2026)`.

<!-- trace:case id=g10.auction-winner-order.TC-p2x rev=1 covers=g10.auction-winner-order.SC-d8z -->
### g10.auction-winner-order.US2-TC58: A receipt with no ID reads Receipt

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** ui
* **Automation status:** automated
* **Testability:** automated
* **Trace:** winner-order-US-02

**Pre-conditions:**

* `<winner_order_301_1>` is paid, with a receipt record that carries no receipt ID.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_301_1 | A paid order whose receipt has no recorded ID; bind its identity only |

**Steps:**

1. Open Winner Order on `<winner_order_301_1>` and read the receipt link.

**Expected Results:**

* The link reads `Receipt` — no `#`, no date, no dangling separators.

## Reconciliation

- **Cases** - `TC-b6h` covers `SC-n5y`: the link reads `Receipt #<id>
  (<issued>)`. `TC-p2x` covers `SC-d8z`: no ID, plain `Receipt` — the date
  drops with it, there being no receipt the row could point at by name.
- **Raised, settled** - whether an ID-less record still shows its issue
  date; landed as Q1 — the label falls back to `Receipt` alone.
- **Contradicted** - none: the carried scenarios `SC-67` and `SC-68` keep
  their durable cases, and the two new cases agree with the scenarios they
  cover.
- **Walked** - `SC-n5y` by `TC-b6h`, `SC-d8z` by `TC-p2x`.
- **Uncovered** - none of this delta's scenarios.
