# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-12, tcs-rules r3.0

## grade10-site-auction-bidding-history-US6: Collector reviews maximum history on the lot

**As a** signed-in collector,
**I want** to open **Your bidding** on a lot and read every accepted maximum I
set or raised there,
**so that** I can see when I raised the ceiling without leaving the lot or
opening the full account chronology.

### grade10-site-auction-bidding-history-US6-TC1-1: Maximum-only lot opens on Bid placed with empty bids

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**
customer(signed-in bidder with one accepted automatic maximum and no automatic
bid placed for them yet on `<listing_max_only>`) is on that lot's page. **Your
bidding** is visible beside public recent bids.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the dialog title, description, tab order, and the active tab.
3. Activate **Your maximums**.
4. Inspect the maximum rows and whether a sticky current-maximum summary is
   shown.

**Expected Results:**

* The dialog title is **Your bidding**.
* Tabs appear in order **Bid placed**, then **Your maximums**.
* **Bid placed** is active and shows that no bids have been placed for them
  yet.
* **Your maximums** lists the accepted maximum amount and time only — no Set
  or Raised status word.
* No sticky current-maximum summary appears in the dialog.

### grade10-site-auction-bidding-history-US6-TC2-1: Raised maximums list without refusals on the lot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**
customer(signed-in bidder who configured a maximum, later raised it, and also
has a retained refused maximum attempt on `<listing_raised_max>`) is on that
lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Activate **Your maximums**.
3. Inspect every maximum row.
4. Navigate to `/bids`, expand that listing, and find the refused attempt.

**Expected Results:**

* **Your maximums** lists only the accepted configure and raise amounts with
  times, newest first.
* No Set or Raised status word appears on those rows.
* The refused attempt is absent from both lot tabs.
* The refused attempt remains readable in that listing's account chronology.

### grade10-site-auction-bidding-history-US6-TC3-1: Lot personal bidding stays private and inert

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-06

**Pre-conditions:**
customer A (signed-in bidder with personal bidding activity) and customer B
(rival with a private maximum) both have activity on `<listing_private>`.
customer A is on that lot's page. Note the public recent-bids list and
customer A's live maximum on the bid panel before opening the dialog.

**Steps:**

1. Activate **Your bidding**.
2. Inspect **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check public recent bids, live maximum, and listing standing.

**Expected Results:**

* Neither tab shows customer B's maximum, identity, or payment facts.
* Public recent bids are unchanged.
* No bid, maximum, hold, listing standing, or auction close changes from
  reading the dialog.

---

## grade10-site-auction-bidding-history-US7: Collector reviews bids Grade10 placed on the lot

**As a** signed-in collector,
**I want** the lot dialog to separate the bids Grade10 placed for me from my
maximums, open on **Bid placed** by default, and list that tab first,
**so that** I do not read an auto-bid step as my authorized cap.

### grade10-site-auction-bidding-history-US7-TC1-1: Bid placed stays default when both lists have rows

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with at least one automatic bid Grade10 placed for
them and at least one accepted maximum on `<listing_both_lists>`) is on that
lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab and **Bid placed** rows.
3. Activate **Your maximums**.
4. Inspect maximum rows.

**Expected Results:**

* **Bid placed** is the initial active tab.
* Tab order is **Bid placed**, then **Your maximums**.
* **Bid placed** lists the owner's automatic bid amounts and times only — no
  bid-type column.
* **Your maximums** lists every accepted configure or raise for that owner on
  that listing, newest first, amount and time only.
* No sticky current-maximum summary appears.

### grade10-site-auction-bidding-history-US7-TC2-1: Empty Bid placed remains the default before any auto-bid

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with one accepted automatic maximum and no automatic
bid placed for them yet on `<listing_max_only>`) is on that lot's page.

**Steps:**

1. Activate **Your bidding**.
2. Inspect the active tab copy.
3. Activate **Your maximums** and return to **Bid placed**.

**Expected Results:**

* **Bid placed** is active on open and shows the empty-bids message.
* Switching away and back keeps **Bid placed** available as its own tab —
  maximum rows never appear under **Bid placed**.

### grade10-site-auction-bidding-history-US7-TC3-1: Reading separated lists does not change auction facts

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
* **Trace:** grade10-site-auction-bidding-history-US-07

**Pre-conditions:**
customer(signed-in bidder with both bid-sequence and maximum rows on
`<listing_both_lists>`) is on that lot's page. Note standing, live maximum, and
public recent bids before opening the dialog.

**Steps:**

1. Activate **Your bidding**.
2. Switch between **Bid placed** and **Your maximums**.
3. Dismiss the dialog.
4. Re-check standing, live maximum, and public recent bids.

**Expected Results:**

* Standing, live maximum, and public recent bids are unchanged.
* No bid or maximum is placed by reading either tab.

---

## grade10-site-auction-bidding-history-US8: Collector reads clearer maximum labels on /bids

**As a** signed-in collector,
**I want** configure, raise, and refusal events on `/bids` named as maximum
set, raised, or refused,
**so that** the account chronology matches the lot wording without a new
account tab.

### grade10-site-auction-bidding-history-US8-TC1-1: Account chronology names maximum set, raise, and refusal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-08

**Pre-conditions:**
customer(signed-in bidder whose listing chronology on `<listing_account_labels>`
includes an accepted automatic maximum configuration, a later accepted raise,
and a retained refused maximum attempt) is signed in.

**Steps:**

1. Navigate to `/bids`.
2. Expand `<listing_account_labels>`.
3. Inspect the configure, raise, and refusal events.
4. Inspect account navigation for a new maximums-only tab or route.

**Expected Results:**

* Those events read as a maximum set, a maximum raised, and a maximum refused.
* No new account tab or maximums-only route is offered.
