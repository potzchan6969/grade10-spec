# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

## grade10-site-auction-bidding-history-US1: Collector reads their bidding index

**As a** collector,
**I want** every listing I bid on in one private index,
**so that** I can see my standing without hunting through the catalogue.

### grade10-site-auction-bidding-history-US1-TC1-1: Repeated activity is grouped under one listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in collector has submitted manual bids, configured an automatic maximum, and raised that maximum on one listing.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check that listing in the bidding index.

**Expected Results:**

* That listing appears once at the position of its latest activity.
* Its summary carries the collector's current standing rather than one row per action.

### grade10-site-auction-bidding-history-US1-TC2-1: Failed-only listing remains explainable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A collector's server-evaluated bid attempts on a listing all failed. No manual or automatic bid was accepted for that account.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Find that listing.
3. Open its history.

**Expected Results:**

* The listing appears with failed-only standing.
* The collector can open its history to read each safe failure reason.

### grade10-site-auction-bidding-history-US1-TC3-1: Active and completed activity separate cleanly

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in collector has activity on one open listing, one closed listing, and one canceled listing.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select **Active**.
3. Select **Completed**.

**Expected Results:**

* Step 2 shows only the open listing.
* Step 3 shows the closed and canceled listings.

### grade10-site-auction-bidding-history-US1-TC4-1: Paging does not repeat or skip a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in collector has more bidding listings than one page holds. No newer activity is added during the pass.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Follow every returned cursor.

**Expected Results:**

* Every matching listing appears exactly once in latest-activity order.

### grade10-site-auction-bidding-history-US1-TC5-1: Account with no bidding activity has an empty index

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-01

**Pre-conditions:**
A signed-in storefront account with no retained bid attempt or automatic-bid activity.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the bidding index.

**Expected Results:**

* Grade10 returns an empty result rather than another account's or another storefront's activity.

---

## grade10-site-auction-bidding-history-US2: Collector audits every retained bidding action

**As a** collector,
**I want** every bid Grade10 evaluated for me kept as a private event,
**so that** I can see what was accepted, refused, or placed automatically without
exposing my maximum to a rival.

### grade10-site-auction-bidding-history-US2-TC1-1: Accepted manual bid is recorded once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector is on <an open listing url> that accepts a manual bid.

**Steps:**

1. Submit a manual bid that Auction accepts.
2. Replay the same action idempotently.
3. Navigate to <grade10 bids url>.
4. Open that listing's history.

**Expected Results:**

* The collector's history records the submitted amount and accepted outcome at their authoritative times.
* The same action replayed idempotently adds no duplicate event.

### grade10-site-auction-bidding-history-US2-TC2-1: Refused bid records a safe reason privately

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector can submit a bid Auction will refuse after evaluating it.

**Steps:**

1. Submit a bid that Auction refuses.
2. Navigate to <grade10 bids url> and open that listing's history.
3. Check the anonymous auction log and accepted bid count.

**Expected Results:**

* The collector's history records the attempted amount, failure time, and safe reason category.
* The failed attempt does not appear in the anonymous auction log or accepted bid count.

### grade10-site-auction-bidding-history-US2-TC3-1: Browser-only validation creates no Auction event

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector is on <an open listing url>.

**Steps:**

1. Enter a malformed amount that the browser refuses to submit.
2. Navigate to <grade10 bids url>.
3. Open that listing's history.

**Expected Results:**

* That local validation failure is absent from the Auction history.

### grade10-site-auction-bidding-history-US2-TC4-1: Automatic maximum is recorded and stays private

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A signed-in collector can configure and raise an automatic-bid maximum on <an open listing url>. A rival account also has activity on that listing.

**Steps:**

1. Configure an automatic-bid maximum.
2. Raise that maximum.
3. Open the collector's history for that listing.
4. Open the rival's history and an anonymous read of the listing.

**Expected Results:**

* The collector's private history records both resulting maximums in order.
* Neither maximum appears in any rival's history or anonymous read.

### grade10-site-auction-bidding-history-US2-TC5-1: Engine bid is labeled automatic

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-02

**Pre-conditions:**
A collector has an active automatic-bid maximum.

**Steps:**

1. Cause the automatic-bidding engine to place a bid for that account.
2. Navigate to <grade10 bids url>.
3. Open that listing's history.
4. Check the accepted public price movement.

**Expected Results:**

* The collector's private history labels the action as automatic.
* The accepted public price movement remains subject to the auction's existing pseudonym rules.

---

## grade10-site-auction-bidding-history-US3: Collector reads one listing's combined history

**As a** collector,
**I want** one chronology of public price movement and my private standing,
**so that** I can see how I was outbid without seeing anyone's maximum.

### grade10-site-auction-bidding-history-US3-TC1-1: Competing bid shows You were outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
The collector is leading a listing.

**Steps:**

1. Let a rival's accepted price movement displace the collector.
2. Navigate to <grade10 bids url>.
3. Expand that listing's combined history.

**Expected Results:**

* The combined history shows that rival under its listing pseudonym.
* The same step marks **You were outbid** at the resulting public price.
* It reveals neither account's private maximum.

### grade10-site-auction-bidding-history-US3-TC2-1: Automatic response is attributed to You

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
A rival bid causes the collector's automatic maximum to advance the public price.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.

**Expected Results:**

* The resulting accepted movement is attributed to **You** and marked as automatic.
* The private automatic event is not rendered as a contradictory second accepted bid.

### grade10-site-auction-bidding-history-US3-TC3-1: Failed attempt sits beside unchanged auction state

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
A collector's attempt fails while another bidder remains leading.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Open that listing's combined history.
3. Check the accepted price and leading pseudonym.

**Expected Results:**

* The failed private event appears at its authoritative time with its safe reason.
* The auction's accepted price and leading pseudonym remain unchanged.

### grade10-site-auction-bidding-history-US3-TC4-1: Full retained history remains pageable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-03

**Pre-conditions:**
One listing has more public and private events than one page holds. No new event is added during the pass.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand that listing's combined history.
3. Follow every returned cursor.

**Expected Results:**

* Every retained event visible to that collector appears exactly once in stable order.

---

## grade10-site-auction-bidding-history-US4: Collector's bidding history stays on their storefront account

**As a** collector,
**I want** only my Grade10 account's history,
**so that** another storefront or an unsigned visitor cannot read my maxima or
failed attempts.

### grade10-site-auction-bidding-history-US4-TC1-1: Storefront account reads its own history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
A Grade10 storefront session for account A.

**Steps:**

1. Navigate to <grade10 bids url> as account A.
2. Check the bidding index and combined histories.

**Expected Results:**

* Auction returns only A's Grade10 activity and the public movements that belong in its combined histories.

### grade10-site-auction-bidding-history-US4-TC2-1: Same account id on another storefront is unrelated

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
Grade10 and ZZZ each have an account with the same account id. Grade10 holds private bidding events for that id.

**Steps:**

1. Sign in to ZZZ as that account.
2. Read its bidding history.

**Expected Results:**

* It receives only activity created through the ZZZ-pinned entrypoint.
* No Grade10 private event or maximum is returned.

### grade10-site-auction-bidding-history-US4-TC3-1: Anonymous reader cannot read private history

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
No storefront session.

**Steps:**

1. Request an account index or combined history without a storefront session.
2. Fetch an anonymous public auction response.

**Expected Results:**

* Grade10 refuses the request.
* The anonymous public auction response gains no private field.

### grade10-site-auction-bidding-history-US4-TC4-1: Reading history is inert

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bidding-history-US-04

**Pre-conditions:**
Any retained bidding history. Note the bid, maximum, hold, listing standing, and auction close first.

**Steps:**

1. Navigate to <grade10 bids url> as an authorized collector.
2. Read and page the index and a combined history.
3. Check the bid, maximum, hold, listing standing, and auction close.

**Expected Results:**

* No bid, maximum, hold, listing standing, or auction close changes.

---

## grade10-site-auction-bidding-history-US5: Collector opens their bids at /bids

**As a** collector,
**I want** `/bids` to show my active and completed summaries and expand each
listing's history,
**so that** I can audit standing without leaving the page.

### grade10-site-auction-bidding-history-US5-TC1-1: Signed-in collector opens active bids

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in Grade10 collector with active and completed bidding activity.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page and the site chrome.
3. Switch to **Completed**.

**Expected Results:**

* The page shows the Active summaries inside the existing site chrome.
* The collector can switch to Completed without a document reload.

### grade10-site-auction-bidding-history-US5-TC2-1: Outbid summary leads to its explanation and listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
An open listing on which the collector is outbid.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Expand that summary.

**Expected Results:**

* The combined history identifies the public movement that outbid **You**.
* The page offers a route to the still-open listing.

### grade10-site-auction-bidding-history-US5-TC3-1: Signed-out visitor preserves the destination

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
The visitor is signed out.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Complete the existing sign-in flow.

**Expected Results:**

* The Grade10 site starts its existing sign-in flow.
* Successful sign-in returns the collector to `/bids`.

### grade10-site-auction-bidding-history-US5-TC4-1: Empty filter is explicit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in collector with no entries in the selected filter.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Select that filter.
3. Wait until the filter finishes loading.

**Expected Results:**

* The page names that the selected bidding history is empty.
* It does not show a loading placeholder or failure message.

### grade10-site-auction-bidding-history-US5-TC5-1: Initial loading reserves the bidding list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in collector. <the bidding index endpoint> delayed so the selected index page has not answered yet.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page during the delay.

**Expected Results:**

* The page shows a labeled bidding-history loading state inside the site chrome.
* It does not claim that the selected filter is empty or failed.

### grade10-site-auction-bidding-history-US5-TC6-1: Index failure is retryable

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A signed-in collector. <the bidding index endpoint> mocked to fail for the selected index page.

**Steps:**

1. Navigate to <grade10 bids url>.
2. Check the page.

**Expected Results:**

* The page shows a retryable bidding-history error.
* It does not claim that the selected filter is empty.

### grade10-site-auction-bidding-history-US5-TC7-1: Expanding history preserves its summary while loading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A visible bidding summary. <the combined history endpoint> delayed so it has not answered yet.

**Steps:**

1. Expand that summary.
2. Check the summary and the history area during the delay.

**Expected Results:**

* That summary stays visible with a labeled history-loading state.
* The page does not show an empty history or failure message.

### grade10-site-auction-bidding-history-US5-TC8-1: Loading more preserves entries already shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
A visible index or combined history page with a further cursor.

**Steps:**

1. Request the next page.
2. Check the entries already shown and the next-page control.

**Expected Results:**

* The entries already shown remain visible while the next page loads.
* The control cannot submit the same next-page request twice.

### grade10-site-auction-bidding-history-US5-TC9-1: History failure preserves the listing summary

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
The bidding index is visible. <the combined history endpoint> for one expanded listing is mocked to fail.

**Steps:**

1. Expand that listing.
2. Check that summary and the other summaries.

**Expected Results:**

* That summary remains visible with a retryable history error.
* Other summaries and their histories remain usable.

### grade10-site-auction-bidding-history-US5-TC10-1: ZZZ receives no bidding-history page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05

**Pre-conditions:**
None.

**Steps:**

1. Sign in to <zzz store url>.
2. Look for a bidding-history route or screen.
3. Use ZZZ's authenticated backend against the shared history contract.

**Expected Results:**

* The ZZZ storefront has no new bidding-history route or screen.
* Its authenticated backend remains compatible with the shared history contract.

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
