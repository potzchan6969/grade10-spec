# grade10-site/auction/watchlist Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector watches a listing to come back to it

**Starting state:**

- Collector is signed in.
- An open listing is not watched by that collector.
- Collector already watches a listing.
- Viewer is signed out.
- An open listing is shown.

### Route

1. Open the listing page.
   - The listing shows as watched. g10.auction-watchlist.US1-TC1
2. Watch the listing.
   - Email alerts for that listing are on. g10.auction-watchlist.US1-TC1
3. Reload the page.
   - The watch is still present after reload. g10.auction-watchlist.US1-TC1
4. Submit a second watch for the same listing.
   - Exactly one watch exists for that collector and listing. g10.auction-watchlist.US1-TC2
5. Read the collector's watches ordered by Watched At.
   - Watched At matches the first watch. g10.auction-watchlist.US1-TC2
6. Attempt to watch the listing from the listing page or catalogue.
   - Sign-in is offered. g10.auction-watchlist.US1-TC3
   - No watch is stored in the browser. g10.auction-watchlist.US1-TC3

## Walk 2: Collector unwatches a listing they no longer follow

**Starting state:**

- Collector watches an open listing with email alerts on.
- Collector watches at least one listing.
- Collector watches a listing that has since closed.

### Route

1. Open the listing page.
   - The listing shows as not watched. g10.auction-watchlist.US2-TC1
2. Unwatch the listing.
   - Email alerts for that listing are off. g10.auction-watchlist.US2-TC1
3. Open My Auctions / Watching.
4. Unwatch a row from the list.
   - The row leaves Watching. g10.auction-watchlist.US2-TC2
   - Email alerts for that listing are off. g10.auction-watchlist.US2-TC2
   - The listing page was not opened. g10.auction-watchlist.US2-TC2
5. Open My Auctions / Watching.
6. Unwatch the closed listing.
   - The closed listing leaves Watching. g10.auction-watchlist.US2-TC3

## Walk 3: Collector reads the listings they watch

**Starting state:**

- Collector watches two open listings at different times.
- Collector watches no listings and has no bids.
- Collector watches a listing that then closes.
- Collector watches a listing an operator then calls off.

### Route

1. Open My Auctions / Watching.
   - The more recently watched listing appears first. g10.auction-watchlist.US3-TC1
2. Read the Watching rows in order.
   - Each row shows identity, current bid, and close. g10.auction-watchlist.US3-TC1
3. Open My Auctions.
   - An explained empty state is shown, not an error. g10.auction-watchlist.US3-TC2
   - A path to the catalogue is offered. g10.auction-watchlist.US3-TC2
4. Open My Auctions / Watching.
   - The listing is still listed. g10.auction-watchlist.US3-TC3
   - It is shown as closed, not as open. g10.auction-watchlist.US3-TC3
5. Open My Auctions / Watching.
   - The listing is still listed. g10.auction-watchlist.US3-TC4
   - It is shown as called off, not as open. g10.auction-watchlist.US3-TC4

## Walk 4: Operator judges interest from the watch count and adjacent checks

**Starting state:**

- One Grade10 collector and one ZZZ collector each watch the same listing.
- Collector watches a listing with email alerts on.

### Route

1. As an operator, read the watch count for that listing.
   - The count is 2. g10.auction-watchlist.US4-TC1
   - No watcher identity is disclosed. g10.auction-watchlist.US4-TC1
   - Public listing facts still carry no watch count. g10.auction-watchlist.US4-TC1
2. Open My Auctions / Watching.
3. Turn email alerts off for that listing.
   - The listing remains watched. g10.auction-watchlist.US5-TC1
   - Email alerts for that listing are off. g10.auction-watchlist.US5-TC1
   - Confirmation says the watch stayed. g10.auction-watchlist.US5-TC1

## g10.auction-watchlist.US1: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

### g10.auction-watchlist.US1-TC1: Watch from the listing page records one watch

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

<!-- trace:case id=g10.auction-watchlist.TC-eyd rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC2: Watching twice leaves the original Watched At

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

<!-- trace:case id=g10.auction-watchlist.TC-jxa rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC3: Signed-out viewer is offered sign-in

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

## g10.auction-watchlist.US2: Collector unwatches a listing they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the listing has closed or been called off,
**so that** my list only holds listings I still mean to follow, and email alerts for that listing stop with the watch.

<!-- trace:case id=g10.auction-watchlist.TC-oxt rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC1: Unwatch from the listing page clears the watch and alerts

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

<!-- trace:case id=g10.auction-watchlist.TC-o95 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC2: Unwatch from the watched list without opening the listing

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

<!-- trace:case id=g10.auction-watchlist.TC-jf6 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC3: Unwatch remains available on a closed listing

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

## g10.auction-watchlist.US3: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with enough to decide whether to act,
**so that** I can return to a listing from one place.

<!-- trace:case id=g10.auction-watchlist.TC-5sc rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC1: Watches read newest first with bid and close

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

<!-- trace:case id=g10.auction-watchlist.TC-ady rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC2: Watching nothing is an explained empty state

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

<!-- trace:case id=g10.auction-watchlist.TC-a43 rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC3: A closed listing stays and is labelled closed

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

<!-- trace:case id=g10.auction-watchlist.TC-cfv rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC4: A called-off listing is labelled called off

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

## g10.auction-watchlist.US4: Operator judges interest from the watch count

**As a** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment to buy.

<!-- trace:case id=g10.auction-watchlist.TC-bma rev=1 covers=g10.auction-watchlist.SC-x1c -->
### g10.auction-watchlist.US4-TC1: Operator count includes both brands and no names

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

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/watches/listingStats.spec.ts`

**Pre-conditions:**

* One Grade10 collector and one ZZZ collector each watch the same listing.

**Steps:**

1. As an operator, read the watch count for that listing.

**Expected Results:**

* The count is 2.
* No watcher identity is disclosed.
* Public listing facts still carry no watch count.

## g10.auction-watchlist.US5: Collector mutes email alerts without unwatching

**As a** signed-in collector,
**I want** to turn off email alerts for a listing I still watch,
**so that** it stays on Watching without filling my inbox.

<!-- trace:case id=g10.auction-watchlist.TC-y61 rev=1 covers=g10.auction-watchlist.SC-ntf -->
### g10.auction-watchlist.US5-TC1: Mute leaves the watch and turns alerts off

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
- **Archived replacement record — 2026-10-12 suite rewrite** — `grade10-site-auction-watchlist-US3-TC4-1` → `g10.auction-watchlist.US3-TC4`; its conflict with `lot-status` remains an author decision, not a silent merge.
