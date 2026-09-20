# grade10-site/auction/watchlist Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## grade10-site-auction-watchlist-US1: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

### grade10-site-auction-watchlist-US1-TC1-1: Watch from the listing page records one watch

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
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* Collector is signed in.
* An open listing is not watched by that collector.

**Steps:**

1. Open the listing page.
2. Watch the listing.
3. Reload the page.

**Expected Results:**

* The listing shows as watched.
* Email alerts for that listing are on.
* The watch is still present after reload.

### grade10-site-auction-watchlist-US1-TC2-1: Watching twice leaves the original Watched At

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* Collector already watches a listing.

**Steps:**

1. Submit a second watch for the same listing.
2. Read the collector's watches ordered by Watched At.

**Expected Results:**

* Exactly one watch exists for that collector and listing.
* Watched At matches the first watch.

### grade10-site-auction-watchlist-US1-TC3-1: Signed-out viewer is offered sign-in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* Viewer is signed out.
* An open listing is shown.

**Steps:**

1. Attempt to watch the listing from the listing page or catalogue.

**Expected Results:**

* Sign-in is offered.
* No watch is stored in the browser.

## grade10-site-auction-watchlist-US2: Collector unwatches a listing they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the listing has closed or been
called off,
**so that** my list only holds listings I still mean to follow, and email
alerts for that listing stop with the watch.

### grade10-site-auction-watchlist-US2-TC1-1: Unwatch from the listing page clears the watch and alerts

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
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches an open listing with email alerts on.

**Steps:**

1. Open the listing page.
2. Unwatch the listing.

**Expected Results:**

* The listing shows as not watched.
* Email alerts for that listing are off.

### grade10-site-auction-watchlist-US2-TC2-1: Unwatch from the watched list without opening the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches at least one listing.

**Steps:**

1. Open My Auctions / Watching.
2. Unwatch a row from the list.

**Expected Results:**

* The row leaves Watching.
* Email alerts for that listing are off.
* The listing page was not opened.

### grade10-site-auction-watchlist-US2-TC3-1: Unwatch remains available on a closed listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches a listing that has since closed.

**Steps:**

1. Open My Auctions / Watching.
2. Unwatch the closed listing.

**Expected Results:**

* The closed listing leaves Watching.

## grade10-site-auction-watchlist-US3: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a listing from one place.

### grade10-site-auction-watchlist-US3-TC1-1: Watches read newest first with bid and close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches two open listings at different times.

**Steps:**

1. Open My Auctions / Watching.
2. Read the Watching rows in order.

**Expected Results:**

* The more recently watched listing appears first.
* Each row shows identity, current bid, and close.

### grade10-site-auction-watchlist-US3-TC2-1: Watching nothing is an explained empty state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches no listings and has no bids.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* An explained empty state is shown, not an error.
* A path to the catalogue is offered.

### grade10-site-auction-watchlist-US3-TC3-1: A closed listing stays and is labelled closed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches a listing that then closes.

**Steps:**

1. Open My Auctions / Watching.

**Expected Results:**

* The listing is still listed.
* It is shown as closed, not as open.

### grade10-site-auction-watchlist-US3-TC4-1: A called-off listing is labelled called off

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches a listing an operator then calls off.

**Steps:**

1. Open My Auctions / Watching.

**Expected Results:**

* The listing is still listed.
* It is shown as called off, not as open.

## grade10-site-auction-watchlist-US4: Operator judges interest from the watch count

**As an** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment
to buy.

### grade10-site-auction-watchlist-US4-TC1-1: Operator count includes both brands and no names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-04

**Pre-conditions:**

* One Grade10 collector and one ZZZ collector each watch the same listing.

**Steps:**

1. As an operator, read the watch count for that listing.

**Expected Results:**

* The count is 2.
* No watcher identity is disclosed.
* Public listing facts still carry no watch count.

## grade10-site-auction-watchlist-US5: Collector mutes email alerts without unwatching

**As a** signed-in collector,
**I want** to turn off email alerts for a listing I still watch,
**so that** it stays on Watching without filling my inbox.

### grade10-site-auction-watchlist-US5-TC1-1: Mute leaves the watch and turns alerts off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-05

**Pre-conditions:**

* Collector watches a listing with email alerts on.

**Steps:**

1. Open My Auctions / Watching.
2. Turn email alerts off for that listing.

**Expected Results:**

* The listing remains watched.
* Email alerts for that listing are off.
* Confirmation says the watch stayed.

## Settled

*None yet — suite pending review.*
