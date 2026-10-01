# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-auction-e2e-US07: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

### grade10-site-auction-e2e-US07-TC03-2: Price-moving auto-bid in extended bidding restarts the timer on the open page

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
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-12, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A leads <listing_8> with maximum <user A maximum> and is on its lot page.
* customer B is signed in with a linked card, on a separate session, on the same lot page.
* <listing_8> is in extended bidding, and the recorded close is <time left before bid> away.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | A listing in extended bidding, led by customer A, current bid <leader price> |
| <extension duration> | 1800 seconds |
| <time left before bid> | 5 minutes |
| <leader price> | 530000 HKD minor units |
| <increment> | 25000 HKD minor units |
| <user A maximum> | 800000 HKD minor units |
| <user B maximum> | 555000 HKD minor units, below <user A maximum> |

**Steps:**

1. As customer A, read Time left on the lot page.
2. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read Highest bid and Time left on the open lot page.
4. Wait <extension duration> with no further bid.

**Expected Results:**

* Step 3 reads Highest bid <user B maximum> plus <increment>, and customer A still leads.
* Step 3 reads Time left <extension duration>, labelled Extended bidding, with no reload.
* The lot closes after step 4, and no further bid is placed.

### grade10-site-auction-e2e-US07-TC04-1: Catalogue card and open lot page agree after an extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-12, grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* <listing_8> is in extended bidding, led by customer A, and the recorded close is <time left before bid> away.
* customer A is on the lot page for <listing_8>.
* customer C is on <grade10 auction url> with <listing_8>'s card in All auctions, on a device whose clock is <device skew>.
* customer B is signed in with a linked card, on a separate session, on the lot page for <listing_8>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | A listing in extended bidding, led by customer A, current bid <leader price> |
| <time left before bid> | 5 minutes |
| <leader price> | 530000 HKD minor units |
| <user A maximum> | 800000 HKD minor units |
| <user B maximum> | 900000 HKD minor units, above <user A maximum> |
| <device skew> | 3 minutes behind |

**Steps:**

1. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm the bid.
2. As customer C, without reloading, read <listing_8>'s card.
3. As customer A, without reloading, read Highest bid and Time left at the same moment.

**Expected Results:**

* The card's current bid and the lot page's Highest bid both read <user A maximum> plus the increment.
* The card's countdown and the lot page's Time left agree to the second.
* Neither reads <device skew> off, and neither page reloaded.

---

## grade10-site-auction-e2e-US12: Bidders follow a lot through its close to their record

**As a** bidder,
**I want** the lot page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

### grade10-site-auction-e2e-US12-TC01-1: Winner and losing bidder read one result on the lot and My Auctions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer A leads <listing_15> at <final price> with maximum <user A maximum>.
* customer B bid <user B bid> on <listing_15> and was outbid.
* customer A and customer B are signed in on separate sessions, both on the lot page for <listing_15>.
* <listing_15>'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_15> | An HKD listing in extended bidding, led by customer A |
| <final price> | 530000 minor units |
| <user A maximum> | 800000 minor units, above <final price> |
| <user B bid> | 505000 minor units, below <final price> |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state.
3. As customer B, read the lot's state.
4. As customer A, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.
5. As customer B, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.

**Expected Results:**

* Once the close passes, both pages read Closed with no result until the close is recorded.
* Step 2 reads Won and step 3 reads Did not win, with Highest bid <final price> on both.
* Step 4's row reads Won, with Current bid <final price>.
* Step 5's row reads Didn't win, with Current bid <final price>, not <user B bid>.
