# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

### grade10-site-auction-listing-page-US12-TC7-1: A tied maximum that came second carries the earlier-leads tip

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
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* `<listing_1>` is live in HKD with no bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |

**Steps:**

1. As customer A, set a maximum of `<maximum>` on `<listing_1>`.
2. As customer B, set a maximum of `<maximum>` on `<listing_1>`.
3. As customer B, read Recent bids and activate the Info control on their own row.

**Expected Results:**

* Customer A's row and customer B's row show the same amount, customer A's first.
* Customer B's row carries an Info control whose tip says that when maximums match, the earlier one leads.
* Customer A's row carries no Info control.

## grade10-site-auction-listing-page-US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

### grade10-site-auction-listing-page-US14-TC7-1: A sold lot crowns its winning bid and no other

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_2>` is live in HKD, led by customer A, with a bid from customer B below it, its recorded close a minute away.
* customer C is on the lot page for `<listing_2>`.

**Steps:**

1. As customer C, read Recent bids before the close.
2. Wait for the close to be recorded as sold to customer A, without reloading.
3. As customer C, read Recent bids again.

**Expected Results:**

* At step 1 no row shows a crown.
* At step 3 customer A's row shows a crown named Winner after the amount.
* At step 3 customer B's row shows no crown.

## Reconciliation

**Run:** Accept-review fix round, 2026-10-05, for change `bid-history-winner-priority`. The Bidding page's Recent bids Winner line promised collectors an outcome no consumer requirement delivered, while `grade10` already sets both flags in `listingLotExtras.ts`. Read `proposal.md`, `decisions.md` (Q1 to Q3), this delta `spec.md`, the page line and the consumer's mapper and its tests. Not a blind reading; QA2 rereads it.

| Finding | Disposition |
| --- | --- |
| A sold lot crowns its won row and no other; a live lot crowns none | **Folded in:** `grade10-site-auction-listing-page-SC-48` / `grade10-site-auction-listing-page-US14-TC7-1` |
| A tied maximum that came second carries the earlier-leads tip; the leader carries none | **Folded in:** `grade10-site-auction-listing-page-SC-49` / `grade10-site-auction-listing-page-US12-TC7-1` |
| The tip on an older pair of equal amounts, below the current price | **Out of suite:** the consumer's mapper test in `grade10`, `listingLotExtras.test.ts` |

**Uncovered anchors:** none for the Recent bids outcome.
