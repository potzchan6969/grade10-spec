# grade10-site/auction/watchlist Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<auction url>` is the Grade10 auction catalogue and `<my auctions url>` the signed-in account's My Auctions page, whose Watching tab lists watched listings. `<zzz auction url>` is the ZZZ auction catalogue, selling the same listings. `<admin listings url>` is the Auction listings page of the Grade10 admin console.

## Walk 1: Watch, read, mute and unwatch from My Auctions

Starting state:

- customer(signed in) watches `<earlier listing>` and `<closed listing>`, and does not watch `<new listing>`.
- customer is on `<new listing>`'s page.

Shared test data:

| Field | Value |
| --- | --- |
| earlier listing | An open listing the customer watched yesterday, email alerts on |
| closed listing | A listing the customer watched before it closed |
| new listing | An open listing the customer does not watch |

### Route

1. Select Watch, then reload the page.
   - The listing reads as watched, with email alerts on, and still does after the reload. `g10.auction-watchlist.US1-TC1`
2. Open `<auction url>` and select Watch on `<new listing>`'s card if it is offered.
   - The card already reads as watched. `g10.auction-watchlist.US1-TC2`
3. Open `<my auctions url>` and select Watching.
   - `<new listing>` reads before `<earlier listing>`, each row with its title, current bid and close. `g10.auction-watchlist.US3-TC1`
   - `<new listing>` is listed once. `g10.auction-watchlist.US1-TC2`
   - `<closed listing>` is still listed, shown as closed, not open. `g10.auction-watchlist.US3-TC3`
4. Turn email alerts off for `<new listing>`.
   - It stays in Watching with alerts off, and the confirmation says the watch stayed. `g10.auction-watchlist.US5-TC1`
5. Unwatch `<earlier listing>` and `<closed listing>` from their rows.
   - Each row leaves Watching, without its listing page being opened. `g10.auction-watchlist.US2-TC2`
   - Email alerts for `<earlier listing>` are off. `g10.auction-watchlist.US2-TC2`
   - The closed listing could be unwatched and is gone. `g10.auction-watchlist.US2-TC3`

## g10.auction-watchlist.US1: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

<!-- trace:case id=g10.auction-watchlist.TC-pvl rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC1: Watching from the listing page records one watch with alerts on

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* customer(signed in) is on `<listing_1>`'s page and does not watch it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open listing the customer does not watch |

**Steps:**

1. Select Watch.
2. Reload the page.

**Expected Results:**

* Step 1 shows `<listing_1>` as watched, with email alerts on.
* After step 2 it still shows as watched.

<!-- trace:case id=g10.auction-watchlist.TC-iwb rev=1 -->
### g10.auction-watchlist.US1-TC2: Watching again from another surface leaves one watch in its place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* customer(signed in) watched `<listing_2>` before `<listing_13>`, both open.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An open listing the customer watched first |
| `<listing_13>` | An open listing the customer watched after `<listing_2>` |

**Steps:**

1. Open `<auction url>` and select Watch on `<listing_2>`'s card if it is offered.
2. Open `<my auctions url>` and select Watching.

**Expected Results:**

* Step 1's card already reads as watched.
* Step 2 lists `<listing_2>` once, still after `<listing_13>`.

---

## g10.auction-watchlist.US2: Collector unwatches a listing they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the listing has closed or been
called off,
**so that** my list only holds listings I still mean to follow, and email
alerts for that listing stop with the watch.

<!-- trace:case id=g10.auction-watchlist.TC-o95 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC2: Unwatching from Watching needs no visit to the listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* customer(signed in) watches `<listing_5>`, email alerts on, and is on `<my auctions url>`'s Watching tab.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A listing the customer watches |

**Steps:**

1. Unwatch `<listing_5>` from its row.

**Expected Results:**

* The row leaves Watching.
* Email alerts for `<listing_5>` are off.
* `<listing_5>`'s page was not opened.

<!-- trace:case id=g10.auction-watchlist.TC-jf6 rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC3: A closed listing can still be unwatched

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

* customer(signed in) watched `<listing_6>` before it closed and is on `<my auctions url>`'s Watching tab.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A closed listing the customer watches |

**Steps:**

1. Unwatch `<listing_6>`.

**Expected Results:**

* `<listing_6>` leaves Watching.

---

## g10.auction-watchlist.US3: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a listing from one place.

<!-- trace:case id=g10.auction-watchlist.TC-5sc rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC1: Watches read newest first, each with its bid and close

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

* customer(signed in) watched `<listing_7>`, then `<listing_8>` a day later; both are open.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An open listing watched first |
| `<listing_8>` | An open listing watched one day after `<listing_7>` (range: any later time) |

**Steps:**

1. Open `<my auctions url>`, select Watching and read the rows in order.

**Expected Results:**

* `<listing_8>` reads before `<listing_7>`.
* Each row shows the listing's title and image, its current bid and its close.

<!-- trace:case id=g10.auction-watchlist.TC-a43 rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC3: A closed listing stays in Watching, shown as closed

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* customer(signed in) watched `<listing_9>` before it closed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A closed listing the customer watches |

**Steps:**

1. Open `<my auctions url>` and select Watching.

**Expected Results:**

* `<listing_9>` is still listed.
* It is shown as closed, not open.

---

## g10.auction-watchlist.US5: Collector mutes email alerts without unwatching

**As a** signed-in collector,
**I want** to turn off email alerts for a listing I still watch,
**so that** it stays on Watching without filling my inbox.

<!-- trace:case id=g10.auction-watchlist.TC-y61 rev=1 covers=g10.auction-watchlist.SC-ntf -->
### g10.auction-watchlist.US5-TC1: Muting alerts keeps the watch

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-05

**Pre-conditions:**

* customer(signed in) watches `<listing_12>` with email alerts on, and is on `<my auctions url>`'s Watching tab.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A listing the customer watches, email alerts on |

**Steps:**

1. Turn email alerts off for `<listing_12>`.

**Expected Results:**

* `<listing_12>` stays in Watching.
* Its email alerts read off.
* The confirmation says the watch stayed.

---

## g10.auction-watchlist.US4: Operator judges interest from the watch count

**As an** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment
to buy.

<!-- trace:case id=g10.auction-watchlist.TC-nnb rev=1 -->
### g10.auction-watchlist.US4-TC1: The operator's watch count adds both brands' watchers

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-04

**Pre-conditions:**

* `<listing_11>` is open and watched by `<grade10 watchers>` customers on `<auction url>` and `<zzz watchers>` on `<zzz auction url>`, none of whom bid.
* admin(holds auction:operate) is on `<admin listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An open listing sold on both brands, with no bids |
| `<grade10 watchers>` | 2 (range: 1–5) |
| `<zzz watchers>` | 1 (range: 1–5) |
| `<watch count>` | 3 (fixed derived): `<grade10 watchers>` plus `<zzz watchers>` |

**Steps:**

1. Open `<listing_11>` and read its watch count and bids.

**Expected Results:**

* The watch count reads `<watch count>`.
* The listing still reads no bids.

## Ungrouped

### g10.auction-watchlist.US1: Collector watches a listing to come back to it

<!-- trace:case id=g10.auction-watchlist.TC-jxa rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
#### g10.auction-watchlist.US1-TC3: A signed-out viewer is offered sign-in instead of a watch

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* customer is signed out and on `<surface>`.

**Test data:**

| `<surface>` |
| --- |
| `<listing_3>`'s page |
| `<listing_3>`'s card on `<auction url>` |

| Field | Value |
| --- | --- |
| `<listing_3>` | An open listing |

**Steps:**

1. Select Watch for `<listing_3>`.
2. Reload `<surface>`.

**Expected Results:**

* Step 1 offers sign-in.
* Step 2 shows `<listing_3>` as not watched.

<!-- trace:case id=g10.auction-watchlist.TC-0gx rev=1 -->
#### g10.auction-watchlist.US1-TC4: A watch is the watcher's alone and places no bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* customer A(signed in) watches `<listing_14>`; customer B(signed in, on a separate session) does not.
* `<listing_14>` is open with `<bid count>` bids.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | An open listing with bids |
| `<bid count>` | 3 (range: 0–20) |

**Steps:**

1. As customer B, open `<listing_14>`'s page and `<my auctions url>`.
2. As customer A, open `<listing_14>`'s page and read the bid panel.

**Expected Results:**

* Step 1 shows `<listing_14>` as not watched and lists nothing of customer A's.
* Step 2 still reads `<bid count>` bids, and customer A holds no standing on `<listing_14>`.

### g10.auction-watchlist.US2: Collector unwatches a listing they no longer follow

<!-- trace:case id=g10.auction-watchlist.TC-oxt rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
#### g10.auction-watchlist.US2-TC1: Unwatching from the listing page or its card clears the watch and alerts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-02

**Pre-conditions:**

* customer(signed in) watches `<listing_4>` with email alerts on, and is on `<surface>`.

**Test data:**

| `<surface>` |
| --- |
| `<listing_4>`'s page |
| `<listing_4>`'s card on `<auction url>` |

| Field | Value |
| --- | --- |
| `<listing_4>` | An open listing the customer watches |

**Steps:**

1. Unwatch `<listing_4>` on `<surface>`.
2. Open `<my auctions url>` and select Watching.

**Expected Results:**

* Step 1 shows `<listing_4>` as not watched, with its email alerts off.
* Step 2 does not list `<listing_4>`.

### g10.auction-watchlist.US3: Collector reads the listings they watch

<!-- trace:case id=g10.auction-watchlist.TC-ady rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
#### g10.auction-watchlist.US3-TC2: Watching nothing shows an explained empty state

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* customer(signed in) watches no listing and holds no bid.

**Steps:**

1. Open `<my auctions url>`.

**Expected Results:**

* An explained empty state shows, not an error.
* It offers a way to the catalogue.

<!-- trace:case id=g10.auction-watchlist.TC-cfv rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
#### g10.auction-watchlist.US3-TC4: A called-off listing stays in Watching, shown as called off

**Blocked:** watchlist keeps a called-off listing in Watching until it is unwatched, while lot-status keeps a called-off listing out of the watchlist; the auction product manager settles which holds.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* customer(signed in) watched `<listing_10>` before an operator called it off.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A called-off listing the customer watches |

**Steps:**

1. Open `<my auctions url>` and select Watching.

**Expected Results:**

* `<listing_10>` is still listed.
* It is shown as called off, not open.
