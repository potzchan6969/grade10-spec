# grade10-site/auction/watchlist Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector watches a listing to come back to it

**Starting state:**

**Steps 1–3 setup:**

- Collector is signed in.
- The open listing `<listing_1>` is not watched by that collector.

**Steps 4–5 setup:**

- Collector already watches `<listing_2>`.
- The original watch has Watched At `<first watched at>`.

**Steps 6–6 setup:**

- Viewer is signed out.
- The open listing `<listing_3>` is shown.

**Shared test data:**

**Steps 1–3 data:**

| Field | Value |
| --- | --- |
| listing_1 | An open listing not watched by this collector; bind its identity only |
| listing_1 url | The URL of `<listing_1>`; bind its URL only |

**Steps 4–5 data:**

| Field | Value |
| --- | --- |
| listing_2 | A listing already watched by this collector at `<first watched at>`; bind its identity only |
| first watched at | The original seeded watch timestamp for `<listing_2>`; bind its datetime only |

**Steps 6–6 data:**

| Field | Value |
| --- | --- |
| listing_3 | An open listing visible to a signed-out viewer; bind its identity only |
| listing_3 url | The URL of `<listing_3>`; bind its URL only |

### Route

1. Open `<listing_1 url>`.
2. Watch `<listing_1>`.
3. Reload the page.
   - The listing `<listing_1>` shows as watched. `g10.auction-watchlist.US1-TC1`
   - Email alerts for `<listing_1>` are on. `g10.auction-watchlist.US1-TC1`
   - The watch is still present after reload. `g10.auction-watchlist.US1-TC1`
4. Submit a second watch for `<listing_2>`.
5. Read the collector's watches ordered by Watched At.
6. Attempt to watch the listing from `<listing_3 url>` or catalogue.
   - Sign-in is offered. `g10.auction-watchlist.US1-TC3`
   - No watch is stored in the browser. `g10.auction-watchlist.US1-TC3`

## Walk 2: Collector unwatches a listing they no longer follow

**Starting state:**

**Steps 1–2 setup:**

- Collector watches `<listing_4>` with email alerts on.

**Steps 3–4 setup:**

- Collector watches at least one listing, including `<listing_5>`.

**Steps 5–6 setup:**

- Collector watches `<listing_6>`, which has since closed.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_4 | An open listing watched by this collector, with email alerts on; bind its identity only |
| listing_4 url | The URL of `<listing_4>`; bind its URL only |

**Steps 3–4 data:**

| Field | Value |
| --- | --- |
| listing_5 | A listing watched by this collector and present in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps 5–6 data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing watched by this collector before it closed, present in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

### Route

1. Open `<listing_4 url>`.
2. Unwatch `<listing_4>`.
   - The listing `<listing_4>` shows as not watched. `g10.auction-watchlist.US2-TC1`
   - Email alerts for `<listing_4>` are off. `g10.auction-watchlist.US2-TC1`
3. Navigate to `<my auctions url>` and open Watching.
4. Unwatch `<listing_5>`'s row from the list.
   - The row leaves Watching. `g10.auction-watchlist.US2-TC2`
   - Email alerts for `<listing_5>` are off. `g10.auction-watchlist.US2-TC2`
   - The page for `<listing_5>` was not opened. `g10.auction-watchlist.US2-TC2`
5. Navigate to `<my auctions url>` and open Watching.
6. Unwatch `<listing_6>`.
   - The closed listing `<listing_6>` leaves Watching. `g10.auction-watchlist.US2-TC3`

## Walk 3: Collector reads the listings they watch

**Starting state:**

**Steps 1–2 setup:**

- Collector watches `<listing_7>` at `<earlier watched at>` and `<listing_8>` at `<later watched at>`.

**Steps 3–3 setup:**

- Collector watches no listings and has no bids.

**Steps 4–4 setup:**

- Collector watches `<listing_9>`, which then closes.

**Steps 5–5 setup:**

- Collector watches `<listing_10>`, which an operator then calls off.

**Shared test data:**

**Steps 1–2 data:**

| Field | Value |
| --- | --- |
| listing_7 | An open listing watched by this collector at `<earlier watched at>`; bind its identity only |
| listing_8 | An open listing watched by this collector at `<later watched at>`; bind its identity only |
| earlier watched at | The earlier seeded watch timestamp; bind its datetime only |
| later watched at | The later seeded watch timestamp, after `<earlier watched at>`; bind its datetime only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps 3–3 data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps 4–4 data:**

| Field | Value |
| --- | --- |
| listing_9 | A listing watched by this collector before it closed, retained in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps 5–5 data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing watched by this collector before an operator called it off; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

### Route

1. Navigate to `<my auctions url>` and open Watching.
2. Read the Watching rows in order.
   - The listing `<listing_8>` appears before `<listing_7>`. `g10.auction-watchlist.US3-TC1`
   - Each row shows identity, current bid, and close. `g10.auction-watchlist.US3-TC1`
3. Navigate to `<my auctions url>`.
   - An explained empty state is shown, not an error. `g10.auction-watchlist.US3-TC2`
   - A path to the catalogue is offered. `g10.auction-watchlist.US3-TC2`
4. Navigate to `<my auctions url>` and open Watching.
   - The listing `<listing_9>` is still listed. `g10.auction-watchlist.US3-TC3`
   - It is shown as closed, not as open. `g10.auction-watchlist.US3-TC3`
5. Navigate to `<my auctions url>` and open Watching.
   - The listing `<listing_10>` is still listed. `g10.auction-watchlist.US3-TC4`
   - It is shown as called off, not as open. `g10.auction-watchlist.US3-TC4`

## Walk 4: Operator judges interest from the watch count and adjacent checks

**Starting state:**

**Steps 1–1 setup:**

- One Grade10 collector and one ZZZ collector each watch `<listing_11>`.

**Steps 2–3 setup:**

- Collector watches `<listing_12>` with email alerts on.

**Shared test data:**

**Steps 1–1 data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_11 | A listing watched by one Grade10 collector and one ZZZ collector; bind its identity only | · |
| watch count | 2 | Fixed derived value: one Grade10 watch plus one ZZZ watch |

**Steps 2–3 data:**

| Field | Value |
| --- | --- |
| listing_12 | A listing watched by this collector, with email alerts on; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

### Route

1. As an operator, read the watch count for `<listing_11>`.
2. Navigate to `<my auctions url>` and open Watching.
3. Turn email alerts off for `<listing_12>`.
   - The listing `<listing_12>` remains watched. `g10.auction-watchlist.US5-TC1`
   - Email alerts for `<listing_12>` are off. `g10.auction-watchlist.US5-TC1`
   - Confirmation says the watch stayed. `g10.auction-watchlist.US5-TC1`

## g10.auction-watchlist.US1: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

<!-- trace:case id=g10.auction-watchlist.TC-pvl rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC1: Watch from the listing page records one watch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* Collector is signed in.
* The open listing `<listing_1>` is not watched by that collector.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | An open listing not watched by this collector; bind its identity only |
| listing_1 url | The URL of `<listing_1>`; bind its URL only |

**Steps:**

1. Open `<listing_1 url>`.
2. Watch `<listing_1>`.
3. Reload the page.

**Expected Results:**

* The listing `<listing_1>` shows as watched.
* Email alerts for `<listing_1>` are on.
* The watch is still present after reload.

<!-- trace:case id=g10.auction-watchlist.TC-jxa rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC3: Signed-out viewer is offered sign-in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* Viewer is signed out.
* The open listing `<listing_3>` is shown.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | An open listing visible to a signed-out viewer; bind its identity only |
| listing_3 url | The URL of `<listing_3>`; bind its URL only |

**Steps:**

1. Attempt to watch the listing from `<listing_3 url>` or catalogue.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches `<listing_4>` with email alerts on.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | An open listing watched by this collector, with email alerts on; bind its identity only |
| listing_4 url | The URL of `<listing_4>`; bind its URL only |

**Steps:**

1. Open `<listing_4 url>`.
2. Unwatch `<listing_4>`.

**Expected Results:**

* The listing `<listing_4>` shows as not watched.
* Email alerts for `<listing_4>` are off.

<!-- trace:case id=g10.auction-watchlist.TC-o95 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC2: Unwatch from the watched list without opening the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches at least one listing, including `<listing_5>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A listing watched by this collector and present in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.
2. Unwatch `<listing_5>`'s row from the list.

**Expected Results:**

* The row leaves Watching.
* Email alerts for `<listing_5>` are off.
* The page for `<listing_5>` was not opened.

<!-- trace:case id=g10.auction-watchlist.TC-jf6 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC3: Unwatch remains available on a closed listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* Collector watches `<listing_6>`, which has since closed.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing watched by this collector before it closed, present in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.
2. Unwatch `<listing_6>`.

**Expected Results:**

* The closed listing `<listing_6>` leaves Watching.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches `<listing_7>` at `<earlier watched at>` and `<listing_8>` at `<later watched at>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | An open listing watched by this collector at `<earlier watched at>`; bind its identity only |
| listing_8 | An open listing watched by this collector at `<later watched at>`; bind its identity only |
| earlier watched at | The earlier seeded watch timestamp; bind its datetime only |
| later watched at | The later seeded watch timestamp, after `<earlier watched at>`; bind its datetime only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.
2. Read the Watching rows in order.

**Expected Results:**

* The listing `<listing_8>` appears before `<listing_7>`.
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches no listings and has no bids.

**Test data:**

| Field | Value |
| --- | --- |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>`.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches `<listing_9>`, which then closes.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | A listing watched by this collector before it closed, retained in Watching; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.

**Expected Results:**

* The listing `<listing_9>` is still listed.
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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches `<listing_10>`, which an operator then calls off.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing watched by this collector before an operator called it off; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.

**Expected Results:**

* The listing `<listing_10>` is still listed.
* It is shown as called off, not as open.

## g10.auction-watchlist.US4: Operator judges interest from the watch count

**As a** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment to buy.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-05

**Pre-conditions:**

* Collector watches `<listing_12>` with email alerts on.

**Test data:**

| Field | Value |
| --- | --- |
| listing_12 | A listing watched by this collector, with email alerts on; bind its identity only |
| my auctions url | The My Auctions URL; bind its URL only |

**Steps:**

1. Navigate to `<my auctions url>` and open Watching.
2. Turn email alerts off for `<listing_12>`.

**Expected Results:**

* The listing `<listing_12>` remains watched.
* Email alerts for `<listing_12>` are off.
* Confirmation says the watch stayed.

## Settled

*None yet — suite pending review.*
- **Archived replacement record — 2026-10-12 suite rewrite** — `grade10-site-auction-watchlist-US3-TC4-1` → `g10.auction-watchlist.US3-TC4`; its conflict with `lot-status` remains an author decision, not a silent merge.
