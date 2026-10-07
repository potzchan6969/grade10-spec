# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-e2e-US13: Collectors bid against a house maximum through the close

**As a** collector,
**I want** a lot protected by a house maximum to bid, extend, close and mail me as any other lot does,
**so that** what I read, and what I am told, is what the auction decided.

### grade10-site-auction-e2e-US13-TC01-1: The house outbids a collector and the lot closes sold under its pseudonym

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-notifications-US-03, grade10-site-auction-auction-US-11, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Pre-conditions:**

* <listing_17>'s internal bid of <house maximum> was committed at its time, with no other bid, so the house leads at <starting price>.
* <listing_17>'s scheduled close is 10 minutes away.
* customer A(card linked) is signed in on the lot page for <listing_17>, email alerts on.
* customer D watches <listing_17>, email alerts on, and will not bid.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_17> | A published HKD listing, starting price <starting price>, extension duration <extension duration>, no cap |
| <starting price> | 400000 minor units (HK$4,000.00) |
| <house maximum> | 600000 minor units (HK$6,000.00) |
| <user A maximum> | 500000 minor units (HK$5,000.00), below <house maximum> |
| <final price> | 508000 minor units: <user A maximum> plus its 8000 increment |
| <extension duration> | 1800s (30mins) |

**Steps:**

1. As customer A, enter <user A maximum> in the custom maximum on the bid panel and confirm.
2. As customer A, read the standing, Highest bid and Recent bids.
3. Read the mail sent to customer A.
4. Wait through the scheduled close and the extended close, with no further bid.
5. As customer A, read the lot's state.
6. As customer A, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_17>'s row.
7. Read the mail sent to customer A and customer D at the close.

**Expected Results:**

* Step 1 is accepted; step 2 reads Outbid, Highest bid <final price>.
* Step 2: Recent bids lists customer A at <user A maximum>, then the house at <final price> under its listing pseudonym.
* Step 3: one You have been outbid letter, and no New bid letter.
* Step 4: the lot enters extended bidding at the scheduled close and closes <extension duration> after it.
* Step 5 reads Did not win, sold at <final price>, the crowned row the house's pseudonym.
* Step 6's row reads Didn't win, with Current bid <final price> and "Your card was not charged."
* Step 7: customer A gets one You did not win letter with Winning bid <final price>; customer D gets one Lot watched, sold letter with Sold for <final price>.

### grade10-site-auction-e2e-US13-TC02-1: A collector beats the house in extended bidding and wins

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-12, grade10-site-auction-auction-US-11

**Pre-conditions:**

* <listing_18>'s internal bid of <house maximum> is committed, and the house leads at <leader price> over customer A's maximum <user A maximum>.
* <listing_18> is in extended bidding with its recorded close <time left before bid> away.
* customer B(card linked) is signed in on the lot page for <listing_18>, on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_18> | A published HKD listing in extended bidding, extension duration <extension duration>, no cap |
| <house maximum> | 600000 minor units (HK$6,000.00) |
| <user A maximum> | 500000 minor units (HK$5,000.00) |
| <leader price> | 508000 minor units: <user A maximum> plus its 8000 increment |
| <user B maximum> | 700000 minor units, above <house maximum> |
| <final price> | 608000 minor units: <house maximum> plus its 8000 increment |
| <extension duration> | 1800s (30mins) |
| <time left before bid> | 5 minutes |

**Steps:**

1. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm.
2. As customer B, read the standing, Highest bid and Time left.
3. Wait through the recorded close, with no further bid.
4. As customer B, read the lot's state.
5. As customer B, navigate to <grade10 my auctions url>, select the Ended tab and find <listing_18>'s row.

**Expected Results:**

* Step 2 reads Leading, Highest bid <final price>.
* Step 2: Time left reads <extension duration> from customer B's bid.
* Step 4 reads Won, with Highest bid <final price>.
* Step 5's row reads Won with View order, Current bid <final price>.
