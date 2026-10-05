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

* `<listing_1>` is open in HKD, before its scheduled close, with no bid.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, each on the lot page for `<listing_1>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it.
3. As customer B, read the Recent bids rows at `<maximum>`.
4. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 3: customer A's row and customer B's row both read `<maximum>`, customer A's first.
* Step 3: customer A's row at `<maximum>` carries no Info control.
* Step 4: the tip reads When maximums match, the earlier one leads.

---

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
* customer C is on the lot page for `<listing_2>`, in English.

**Steps:**

1. As customer C, read Recent bids before the close.
2. Wait for the close to be recorded as sold to customer A, without reloading.
3. As customer C, read Recent bids again.

**Expected Results:**

* Step 1: no row shows a crown.
* Step 3: customer A's winning row shows a crown named Winner after the amount.
* Step 3: no other row, customer B's included, shows a crown.

### grade10-site-auction-listing-page-US14-TC8-1: A lot without a winner crowns no bid

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
* **Trace:** grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* `<listing_3>` is past its close with bids from customer A and customer B, its result not yet recorded.
* `<listing_4>` is past its close with no bid, its close recorded with no winner.
* customer C is signed in on a separate session.

**Steps:**

1. As customer C, open the lot page for `<listing_3>` and read Recent bids.
2. As customer C, open the lot page for `<listing_4>` and read Recent bids.

**Expected Results:**

* Step 1: the lot reads Closed and no row shows a crown.
* Step 2: the lot reads Ended and no row shows a crown.

## Reconciliation

**Run:** Accept-review fix round, 2026-10-05, for change `bid-history-winner-priority`. The Bidding page's Recent bids Winner line promised collectors an outcome no consumer requirement delivered, while `grade10` already sets both flags in `listingLotExtras.ts`. Read `proposal.md`, `decisions.md` (Q1 to Q3), this delta `spec.md`, the page line and the consumer's mapper and its tests. Written beside the scenarios, not blind.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Reread both cases against `grade10-site-auction-listing-page-SC-48` and `grade10-site-auction-listing-page-SC-49`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, its test, `listingUi.ts`'s sold panel and `ListingView.tsx`'s copy. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A sold lot crowns its won row and no other; a live lot crowns none | **Folded in:** `grade10-site-auction-listing-page-SC-48` / `grade10-site-auction-listing-page-US14-TC7-1` |
| A tied maximum that came second carries the earlier-leads tip; the leader carries none | **Folded in:** `grade10-site-auction-listing-page-SC-49` / `grade10-site-auction-listing-page-US12-TC7-1` |
| The tip on an older pair of equal amounts, below the current price | **Out of suite:** a requirement clause no scenario carries; verified by the consumer's mapper test in `grade10`, `listingLotExtras.test.ts`, "keeps the same-price priority tip on older equal-price pairs" |
| No crown on a lot Closed without a result or ended without a winner, stated by the requirement; no scenario carries it | **Reported:** to Dev for a scenario; `listingLotExtras.test.ts`, "crowns no row until the lot is closed sold", proves the mapper half. No case is written for behaviour no scenario states |
| US12-TC7: customer A's maximum on a lot with no bid leaves customer A a row at the opening price as well, so "customer A's row" named two rows, and the tip was read by accessible name | **Folded in:** steps and results name the rows at `<maximum>`, and step 4 hovers the Info control, `grade10-site-auction-listing-page-SC-49`'s WHEN |
| US14-TC7: "customer B's row shows no crown" asserted less than `grade10-site-auction-listing-page-SC-48`'s "no other row" | **Folded in:** step 3 asserts no other row, customer B's included |
| US14-TC7 waits for the sold result without a reload; the scenario does not say so | **Kept:** the page's sold panel and the crown read the same won bid (`listingUi.ts`, `ListingView.tsx`), and US-14's durable cases already read the result without a reload |
| Case ids `US12-TC7-1` and `US14-TC7-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only. No collision |
| Facts across the Bidding page line and decision row, Q1 to Q3, `tech-design.md` Decision 4, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; a tied maximum ranked second carries the tip; the page supplies the copy in `en`, `ko`, `zh-Hans` and `zh-Hant` |
| Raised questions | None - Q1 to Q3 settle what this capability turns on |
| Accept-review fix round, 2026-10-05, at the owner's word: no crown on a lot Closed without a result or ended without a winner, a requirement clause with no scenario | **Folded in:** `grade10-site-auction-listing-page-SC-50` / `grade10-site-auction-listing-page-US14-TC8-1` |

**Uncovered anchors:** none. Recent bids outcome's two items - winner after close, equal-max tip - each have a case; both scenarios are asserted.
