# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

<!-- trace:case id=g10.auction-listing-page.TC-0yw rev=1 covers=g10.auction-listing-page.SC-o37,g10.auction-listing-page.SC-ohm,g10.auction-listing-page.SC-b9n,g10.auction-listing-page.SC-sux,g10.auction-listing-page.SC-2d0,g10.auction-listing-page.SC-7c2,g10.auction-listing-page.SC-c97,g10.auction-listing-page.SC-s2c -->
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

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer B, read the Recent bids rows at `<maximum>`.
4. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 3: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A leads and set `<maximum>` first, whatever time each row shows.
* Step 3: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 4: the tip reads When maximums match, the earlier one leads.

<!-- trace:case id=g10.auction-listing-page.TC-7nz rev=1 covers=g10.auction-listing-page.SC-o37,g10.auction-listing-page.SC-ohm,g10.auction-listing-page.SC-b9n,g10.auction-listing-page.SC-sux,g10.auction-listing-page.SC-2d0,g10.auction-listing-page.SC-7c2,g10.auction-listing-page.SC-c97,g10.auction-listing-page.SC-s2c -->
### grade10-site-auction-listing-page-US12-TC8-1: An older tie lower down keeps the earlier-leads tip

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

* `<listing_5>` is open in HKD, before its scheduled close, with no bid.
* customer A(card linked), customer B(card linked) and customer C(card linked) are signed in on separate sessions, each on the lot page for `<listing_5>`, in English.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | At least two increments above the opening price |
| `<higher maximum>` | At least two increments above `<maximum>` |

**Steps:**

1. As customer A, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer A sets `<maximum>` first.
2. As customer B, enter `<maximum>` in the custom maximum on the bid panel and confirm it, so customer B sets the same maximum later.
3. As customer C, enter `<higher maximum>` in the custom maximum on the bid panel and confirm it.
4. As customer C, read the current price and the Recent bids rows at `<maximum>`.
5. Hover the Info control on customer B's row at `<maximum>`.

**Expected Results:**

* Step 4: the current price is above `<maximum>`, and customer C's row leads Recent bids.
* Step 4: customer A's row and customer B's row both read `<maximum>`, customer A's first, since customer A set `<maximum>` first, whatever time each row shows.
* Step 4: customer A's row at `<maximum>` carries no Info control; customer B's row, the later maximum, carries one.
* Step 5: the tip reads When maximums match, the earlier one leads.

---

## grade10-site-auction-listing-page-US14: Bidder waits on a closed lot for its result

**As a** bidder,
**I want** a lot past its close to read Closed until its result is recorded, then Won or Did not win,
**so that** I am never shown a result the auction has not decided.

<!-- trace:case id=g10.auction-listing-page.TC-4ba rev=1 covers=g10.auction-listing-page.SC-rgt,g10.auction-listing-page.SC-76f,g10.auction-listing-page.SC-ygz,g10.auction-listing-page.SC-31a,g10.auction-listing-page.SC-45u,g10.auction-listing-page.SC-kwb,g10.auction-listing-page.SC-xz7 -->
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

<!-- trace:case id=g10.auction-listing-page.TC-hqd rev=1 covers=g10.auction-listing-page.SC-rgt,g10.auction-listing-page.SC-76f,g10.auction-listing-page.SC-ygz,g10.auction-listing-page.SC-31a,g10.auction-listing-page.SC-45u,g10.auction-listing-page.SC-kwb,g10.auction-listing-page.SC-xz7 -->
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

* `<listing_3>` is past its close with bids from customer A and customer B, and recording its close is held back until the next sweep.
* `<listing_4>` is past its close with no bid, its close recorded with no winner.
* customer C is signed in on a separate session.

**Steps:**

1. As customer C, open the lot page for `<listing_3>` and read Recent bids.
2. As customer C, open the lot page for `<listing_4>` and read Recent bids.

**Expected Results:**

* Step 1: the lot reads Closed and no row shows a crown.
* Step 2: the lot reads Ended with No bids under it, Recent bids holds no row, and no crown shows.

## Settled

- A row tied on amount with a row above it carries the earlier-leads tip at any older tie lower down Recent bids, not only at the current price; the row above carries none (`bid-history-winner-priority` Q4).
- Rows tied on amount are listed the leading or won row first, then the row of the bidder who set that maximum earlier, and keep that order once both are outbid; the tip goes on the row of the later maximum (`bid-history-winner-priority` Q6).

## Reconciliation

**Run:** Accept-review fix round, 2026-10-05, for change `bid-history-winner-priority`. The Bidding page's Recent bids Winner line promised collectors an outcome no consumer requirement delivered, while `grade10` already sets both flags in `listingLotExtras.ts`. Read `proposal.md`, `decisions.md` (Q1 to Q3), this delta `spec.md`, the page line and the consumer's mapper and its tests. Written beside the scenarios, not blind.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Reread both cases against `grade10-site-auction-listing-page-SC-48` and `grade10-site-auction-listing-page-SC-49`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, its test, `listingUi.ts`'s sold panel and `ListingView.tsx`'s copy. It is a statement, not proof.

**Run:** QA2 reconciliation 2026-10-05, rerun after Q4 and Q5, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q5), `ui-design.md`, `tech-design.md`, `tasks.md`, the Bidding · Auction Panel line and decision row as Q4 left them, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts` and `listingLotExtras.test.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A sold lot crowns its won row and no other; a live lot crowns none | **Folded in:** `grade10-site-auction-listing-page-SC-48` / `grade10-site-auction-listing-page-US14-TC7-1` |
| A tied maximum that came second carries the earlier-leads tip; the leader carries none | **Folded in:** `grade10-site-auction-listing-page-SC-49` / `grade10-site-auction-listing-page-US12-TC7-1` |
| The tip on an older pair of equal amounts, below the current price | **Folded in:** Q4 settled it and `grade10-site-auction-listing-page-SC-51` states it, so the earlier Out of suite no longer holds; `grade10-site-auction-listing-page-US12-TC8-1` walks it. The mapper test in `grade10`, `listingLotExtras.test.ts`, "keeps the same-price priority tip on older equal-price pairs", stays its unit proof |
| US12-TC8: an older tie needs a third bidder to move the price past it; customer A's earlier maximum answers customer B's later one | **Kept:** the case reads the rows at `<maximum>` by bidder, not by time, as `grade10-site-auction-listing-page-SC-51` does; customer A's automatic answer is stamped one ms after customer B's challenge, so customer A's row lists first once both are outbid |
| No crown on a lot Closed without a result or ended without a winner, stated by the requirement; no scenario carried it at the first QA2 | **Folded in:** reported to Dev, then at the owner's word `grade10-site-auction-listing-page-SC-50` / `grade10-site-auction-listing-page-US14-TC8-1`; `listingLotExtras.test.ts`, "crowns no row until the lot is closed sold", proves the mapper half |
| US14-TC8 reread, written without a QA2 read: a sale is absolute and a called-off lot is hidden, so a close with no winner is a lot with no bid, and Recent bids holds no row to crown | **Kept:** the second lot stays, since `grade10-site-auction-listing-page-SC-50` names it; step 2 now asserts Ended with No bids and an empty Recent bids, which the durable `Anyone - No winner` row states, rather than a crown with no row to sit on |
| US14-TC8's first lot was "result not yet recorded" with no way to hold it there | **Folded in:** its pre-condition holds the close back until the next sweep, as the durable US14 delayed-close case does |
| US12-TC7: customer A's maximum on a lot with no bid leaves customer A a row at the opening price as well, so "customer A's row" named two rows, and the tip was read by accessible name | **Folded in:** steps and results name the rows at `<maximum>`, and step 4 hovers the Info control, `grade10-site-auction-listing-page-SC-49`'s WHEN |
| US14-TC7: "customer B's row shows no crown" asserted less than `grade10-site-auction-listing-page-SC-48`'s "no other row" | **Folded in:** step 3 asserts no other row, customer B's included |
| US14-TC7 waits for the sold result without a reload; the scenario does not say so | **Kept:** the page's sold panel and the crown read the same won bid (`listingUi.ts`, `ListingView.tsx`), and US-14's durable cases already read the result without a reload |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named neither the older tie nor `grade10-site-auction-listing-page-US12-TC8-1` | **Resolved:** reported to Dev; 4.2 now names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles, and 4.4 walks `grade10-site-auction-listing-page-US12-TC8-1` |
| Facts across the Bidding page line and decision row, Q1 to Q5, `tech-design.md` Decision 4, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; every row tied on amount with a row above it carries the tip, at the current price and at any older tie; the page supplies the copy in `en`, `ko`, `zh-Hans` and `zh-Hant` |
| Questions for the PM | None - Q1 to Q5 settle what this capability turns on |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q6, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause as Q6 left it, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` `listingLotExtras.ts`, `listingLotExtras.test.ts` and the public ledger read in `repositories/listings.ts`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6: rows tied on amount list leader or won first, then the earlier maximum | **Agree:** `grade10-site-auction-listing-page-SC-49` and `-SC-51` already name the tie by whose maximum came earlier, not by row time; both cases now say who sets `<maximum>` first in steps 1 and 2 and expect the tip on the row of the later maximum |
| US12-TC7: customer A's automatic answer at `<maximum>` is the leading row | **Kept:** the leader lists first under the build and under Q6 alike |
| US12-TC8: once customer C leads, neither row at `<maximum>` leads | **Kept:** the case expects Q6's order, customer A first; the build gives it, since customer A's answer is stamped one ms after customer B's challenge and both the public read and the mapper rank the newer row first. See the rerun after the built tie order below |
| A walker cannot see when a maximum was set, only each row's shown time, the same on both rows of a tie | **Folded in:** both cases expect the order by who set `<maximum>` first, whatever time each row shows |
| `tasks.md` 4.1 cited `grade10-site-auction-listing-page-SC-48` and `-SC-49` only, and the walk named no older tie | **Resolved:** 4.2 names `grade10-site-auction-listing-page-SC-48` to `-SC-51` in the test titles with no build change; 4.4 walks the tip at the current price and at an older tie lower down |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; no other active change holds these ids. No collision |
| Facts across the Bidding page line and decision row, Q1 to Q6, `tech-design.md` Decisions 4 and 5, the delta and the cases | **Agree:** the won row is crowned only once the close is recorded as sold; a tie lists leader or won first, then the earlier maximum; every row with an equal amount listed above it carries the tip, at the current price and at any older tie |
| Questions for the PM | None - Q6 settles the order of a tie, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `grade10-site-auction-listing-page-US14-TC7-1` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them.

**Run:** QA2 reconciliation 2026-10-05, rerun after the built tie order, for change `bid-history-winner-priority`. Reread every case against `grade10-site-auction-listing-page-SC-48` to `grade10-site-auction-listing-page-SC-51`, the requirement's Tied maximum clause, `user-journeys.md`, `proposal.md`, `decisions.md` (Q1 to Q6, as Q6 now names the one-ms answer stamp), `ui-design.md`, `tech-design.md` Decisions 4 and 5, `tasks.md` 4.1 to 4.4, the Bidding · Auction Panel line and decision row, the durable spec and suite, `define-public-auction-identifiers`'s suite on this capability, and in `grade10` the stamp in `resolveStandingMaxima.ts`, the public ledger read in `repositories/listings.ts`, the "recent-bids consecutive same-bidder" test in `autoBidding.spec.ts`, and `listingLotExtras.ts` and its test. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| A tie is not random: `resolveStandingMaxima.ts` stamps the leader's automatic answer one ms after the challenger, the public read orders an amount leader or won first, then newer, and the mapper ranks the same way | **Agree:** the earlier maximum lists first at the current price and after both are outbid; `autoBidding.spec.ts` lists the first bidder to set 180,000 above the second once both are outbid |
| An earlier row said US12-TC8 fails at random until task 4.2 lands | **Corrected:** `grade10-site-auction-listing-page-US12-TC8-1` expects what the build already gives, customer A's row above customer B's at `<maximum>` and the tip on customer B's, and should pass at task 4.4's walk; task 4.2 names scenarios in test titles and changes no build. Each row above now states this outcome |
| US12-TC7 against `grade10-site-auction-listing-page-SC-49` | **Agree:** customer A leads at `<maximum>` and lists first; the tip is on customer B's row only |
| Each of US14-TC7 / `grade10-site-auction-listing-page-SC-48` and US14-TC8 / `-SC-50` | **Agree:** values and outcomes match each GIVEN, THEN and AND; the tie change touches neither |
| Accept-review: the `## Settled` lines cited decisions Q4 and Q6 without the change, and fold beside other changes' Settled lines | **Folded in:** each names `bid-history-winner-priority`; the Q6 line no longer says the order ignores the stamp, since the stamp is what keeps it |
| Accept-review: no `### Manual` table for the four manual cases | **Folded in:** `### Manual` below names what a person drives for each |
| Case ids `US12-TC7-1`, `US12-TC8-1`, `US14-TC7-1` and `US14-TC8-1` | **Checked:** the durable suite ends at `US12-TC6` and `US14-TC6`; `define-public-auction-identifiers` issues `US10` and `US11` only, and no other active change holds a suite on this capability. No collision |
| Questions for the PM | None - Q6 settles the order of a tie and the build keeps it, and Q1 to Q5 the rest |

**Uncovered anchors:** none. Recent bids outcome's two items each have cases - winner after close by `grade10-site-auction-listing-page-US14-TC7-1` and `-US14-TC8-1`, equal-max tip by `-US12-TC7-1` and `-US12-TC8-1` - and each of `grade10-site-auction-listing-page-SC-48` to `-SC-51` is asserted by one of them; every case stays `draft`.

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-auction-listing-page-US12-TC7-1` | To be walked in task 4.4 on the isolated stack: two signed-in bidders each confirm the same custom maximum in turn, and a person reads the rows at that amount and hovers the Info control; the mapper's test flags a tied row it is handed, and the case walks the order the server writes and the tip the page draws |
| `grade10-site-auction-listing-page-US12-TC8-1` | To be walked in task 4.4 on the isolated stack: three signed-in bidders, the third confirming a higher maximum, and a person reads the older tie and hovers its Info control; the backend test proves the read's order and the mapper's test the flag, and the case walks both through the page |
| `grade10-site-auction-listing-page-US14-TC7-1` | To be walked in task 4.4 on the isolated stack: a person watches a live lot's close be recorded as sold without reloading, and reads Recent bids before and after; the mapper's test proves the crown from a sold flag it is handed |
| `grade10-site-auction-listing-page-US14-TC8-1` | To be walked in task 4.4 on the isolated stack: a person opens a lot whose close is held back until the next sweep and a lot ended with no bid, and reads each one's Recent bids; the mapper's test proves no crown before the lot is closed sold |
