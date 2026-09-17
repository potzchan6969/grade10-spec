# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## post-sale-US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the queue to label a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

### post-sale-US6-TC1-1: Queue labels only the lot in extended bidding

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
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(holds the auction queue grant) is on <grade10 auction admin queue url>.
* `<listing_1>`, `<listing_2>` and `<listing_3>` are in the queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A lot past its scheduled close, in extended bidding |
| `<listing_2>` | A lot open for bidding whose scheduled close has not arrived |
| `<listing_3>` | A lot that closed after its extended bidding ended |

**Steps:**

1. Find the rows for `<listing_1>`, `<listing_2>` and `<listing_3>`.
2. Read each row's outcome and labels.

**Expected Results:**

* `<listing_1>` shows "Extended bidding: ON" beside its outcome, not in place of it.
* `<listing_2>` and `<listing_3>` show no Extended bidding label.

### post-sale-US6-TC2-1: Extended bidding is not an outcome filter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(holds the auction queue grant) is on <grade10 auction admin queue url>.
* `<listing_1>` is in the queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A lot past its scheduled close, in extended bidding |

**Steps:**

1. Open the outcome filter.
2. Read the outcomes offered.
3. Read `<listing_1>`'s row.

**Expected Results:**

* No outcome named Extended bidding is offered.
* `<listing_1>`'s row has no needs-action highlight from the label.
