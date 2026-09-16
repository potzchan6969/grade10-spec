# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-auction-auto-bidding-US5: Collector's auto-bid counts as a bid

**As a** collector,
**I want** the hold to cover my maximum and every bid Grade10 places for me to
count as a bid,
**so that** I am authorized once, and my auto-bids keep a lot open during
extended bidding as a manual bid would.

### grade10-site-auction-auto-bidding-US5-TC4-2: Auto bid during extended bidding restarts the timer once

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
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* `<listing_1>` is in extended bidding.
* customer A leads `<listing_1>` with a committed maximum of `<user A maximum>`.
* customer B is signed in with a card saved and is on `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800 seconds |
| `<user A maximum>` | 800000 HKD minor units |
| `<user B maximum>` | 555000 HKD minor units, below `<user A maximum>` |
| `<bid time>` | The moment customer B confirms |

**Steps:**

1. As customer B, commit a maximum of `<user B maximum>` at `<bid time>`.
2. Read the current bid and Time left.
3. Wait until the new close passes with no further commitment.

**Expected Results:**

* Grade10 raises customer A's bid on their behalf, and the close moves to `<bid time>` plus `<extension duration>`.
* No further bid is placed on either maximum before the close.

### grade10-site-auction-auto-bidding-US5-TC7-1: Maximum committed before the close starts extended bidding

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
* **Trace:** grade10-site-auction-auto-bidding-US-05

**Pre-conditions:**

* `<listing_2>` is open, and its only bidder, customer A, committed a maximum before the scheduled close and leads at the starting price.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open listing, scheduled close 20:00 UTC, extension duration 1800 seconds |

**Steps:**

1. Wait for 20:00 UTC.
2. Read the listing's state and recorded close.

**Expected Results:**

* The listing is in extended bidding.
* The recorded close reads 20:30 UTC.
