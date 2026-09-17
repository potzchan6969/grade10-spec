# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-auction-e2e-US07: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

### grade10-site-auction-e2e-US07-TC01-2: Auto-bid during extended bidding restarts the timer on the live page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* `<listing_8>` is past its scheduled close, in extended bidding, and its recorded close is `<time left before bid>` away.
* customer A leads `<listing_8>` with a committed maximum of `<user A maximum>` and is on it.
* customer B is signed in with a card saved and is on `<listing_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing in extended bidding led by customer A, current bid `<leader price>` |
| `<extension duration>` | 1800 seconds |
| `<time left before bid>` | 5 minutes |
| `<leader price>` | 530000 HKD minor units |
| `<user A maximum>` | 800000 HKD minor units |
| `<user B maximum>` | 555000 HKD minor units, below `<user A maximum>` |

**Steps:**

1. As customer A, read Time left.
2. As customer B, commit a maximum of `<user B maximum>`.
3. As customer A, read Time left again on the open page.
4. Wait one full `<extension duration>` with no further commitment.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf, and Time left reads one `<extension duration>` from that bid.
* Step 4 closes the lot, and no further bid is placed on either maximum before it.
