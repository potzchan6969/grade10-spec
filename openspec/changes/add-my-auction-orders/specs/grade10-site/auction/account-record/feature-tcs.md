# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-auction-account-record-US7: Collector reads My Auctions by bidding window

**As a** collector
**I want** my lots split into Active, Upcoming and Ended tabs
**so that** I see what needs me now without scrolling past closed and unopened lots.

### grade10-site-auction-account-record-US7-TC1-1: Each listing sits in the tab its bidding window names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches <listing_1>, <listing_2> and <listing_3>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_1> | A published listing whose bidding has not opened |
| <listing_2> | A published listing whose bidding is open |
| <listing_3> | A published listing that has closed |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Open the Upcoming tab.
3. Open the Ended tab.

**Expected Results:**

* Step 1 shows the Active tab, listing only <listing_2>.
* Title badge shows 3.
* Step 2 lists only <listing_1>; step 3 lists only <listing_3>.

### grade10-site-auction-account-record-US7-TC2-1: A listing moves to Active when its window opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches <listing_1>, a listing whose bidding has not opened.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Wait until <listing_1> bidding opens.
3. Reload <grade10 my auctions url>.

**Expected Results:**

* <listing_1> is listed in the Active tab.
* <listing_1> is not listed in the Upcoming tab.

### grade10-site-auction-account-record-US7-TC3-1: An empty tab says it has no lots

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches only open listings.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Open the Upcoming tab.

**Expected Results:**

* The tab says it has no lots.
* No error is reported.

### grade10-site-auction-account-record-US7-TC4-1: Email alerts cannot be changed on an Ended row

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
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches <listing_3>, a published listing that has closed.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Open the Ended tab.
3. Click the Email alerts control on <listing_3>.

**Expected Results:**

* The Email alerts control is disabled.
* The alert setting for <listing_3> is unchanged.

### grade10-site-auction-account-record-US7-TC5-1: A Won row opens its auction order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(winner) has a Won row whose auction order is available.

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Select the order entry point on the Won row.

**Expected Results:**

* The matching auction order opens.
* My Auctions performs no payment, address, or order-status write.
