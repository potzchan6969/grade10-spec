# grade10-site/auction/watchlist Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A signed-in collector watches a listing from its page or its catalogue card; watching turns email alerts on for it, and unwatching turns them off. Watching is the collector's own: it bids, reserves and changes nothing.
* The watched listings list on My Auctions' Watching view reads newest watch first; an operator reads the watch count on the listing's Stats in the admin console.

## Walk 1: Watch, mute and unwatch

Starting state:

- customer(signed in) watches nothing; `<listing A>` and `<listing B>` are open, and `<listing C>` has closed unsold.

Shared test data:

| Field | Value |
| --- | --- |
| listing A | An open USD listing |
| listing B | An open USD listing closing after `<listing A>` |
| listing C | A closed listing with no bid |

### Route

1. Open the Watching view.
   - It explains that nothing is watched yet. `g10.auction-watchlist.US3-TC2`
2. Watch `<listing C>`, then `<listing A>` from its card, then `<listing B>` from its page.
   - One watch each, alerts on. `g10.auction-watchlist.US1-TC1`
3. Open the Watching view.
   - B, A, C: each with its image, title, current bid and close, C shown as closed. `g10.auction-watchlist.US3-TC1`
4. Turn email alerts off for `<listing A>`.
   - A stays watched, alerts off. `g10.auction-watchlist.US5-TC1`
5. Unwatch `<listing C>` from the list.
   - C leaves the list. `g10.auction-watchlist.US2-TC1`

## g10.auction-watchlist.US1: Collector watches a listing to come back to it

**As a** signed-in collector,
**I want** to mark a listing to come back to without bidding on it,
**so that** I can leave the page and find it again without searching.

<!-- trace:case id=g10.auction-watchlist.TC-pvl rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC1: Watching records one watch with alerts on, however often it is asked

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

* customer(signed in) does not watch open `<listing>`, and has its page open in one tab and the catalogue in another.

**Steps:**

1. On the page, select Watch, and note the time.
2. In the catalogue tab, without reloading, select Watch on `<listing>`'s card.
3. Open the Watching view.

**Expected Results:**

* Step 1 reads Watching, with a toast that email alerts are on.
* Step 3 lists `<listing>` once, alerts on, watched at the time noted at step 1.

<!-- trace:case id=g10.auction-watchlist.TC-jxa rev=1 covers=g10.auction-watchlist.SC-jux,g10.auction-watchlist.SC-qjq,g10.auction-watchlist.SC-n7n,g10.auction-watchlist.SC-g1p,g10.auction-watchlist.SC-ao4,g10.auction-watchlist.SC-7nx,g10.auction-watchlist.SC-zi2,g10.auction-watchlist.SC-qq2 -->
### g10.auction-watchlist.US1-TC3: A signed-out visitor is offered sign-in, not a watch

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

* A signed-out visitor with an account is on open `<listing>`'s page.

**Steps:**

1. Select Watch.
2. Sign in from the offer.

**Expected Results:**

* Step 1 offers sign-in and records nothing in this browser.
* Step 2 returns to `<listing>`, its control reading Watch until selected.

<!-- trace:case id=g10.auction-watchlist.TC-0gx rev=1 -->
### g10.auction-watchlist.US1-TC4: A watch is the watcher's alone and changes nothing about the sale

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-01

**Pre-conditions:**

* customer A watches open `<listing>`; its price, leader and bid count are noted; customer B(signed in) never watched it.

**Steps:**

1. As customer B, open `<listing>`'s page and the Watching view.

**Expected Results:**

* The control reads Watch, no watch count or watcher shows, the Watching view does not list it, and the price, leader and bid count match the note.

---

## g10.auction-watchlist.US2: Collector unwatches a listing they no longer follow

**As a** signed-in collector,
**I want** to remove a watch, including after the listing has closed or been
called off,
**so that** my list only holds listings I still mean to follow, and email
alerts for that listing stop with the watch.

<!-- trace:case id=g10.auction-watchlist.TC-oxt rev=1 covers=g10.auction-watchlist.SC-uiz,g10.auction-watchlist.SC-ozh,g10.auction-watchlist.SC-lfd -->
### g10.auction-watchlist.US2-TC1: Unwatching from any surface clears the watch and its alerts, open or closed

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

* customer(signed in) watches `<listing>`, which is `<state>`, without bidding.

**Test data:**

| `<surface>` | `<state>` |
| --- | --- |
| Its page | open |
| Its catalogue card | open |
| The Watching view | open |
| The Watching view | closed unsold |

**Steps:**

1. Unwatch `<listing>` from `<surface>`.
2. Open the Watching view.

**Expected Results:**

* `<listing>` is no longer listed; an open listing's control reads Watch, and no alert for it reaches the inbox afterwards.

---

## g10.auction-watchlist.US3: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a listing from one place.

<!-- trace:case id=g10.auction-watchlist.TC-5sc rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC1: The Watching view lists newest watch first, each with enough to act on

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

* customer(signed in) watched closed-unsold `<listing C>`, then open `<listing A>`, then open `<listing B>`.

**Steps:**

1. Open the Watching view.

**Expected Results:**

* It lists B, A, C; each shows its image, title, current bid and close, and C reads closed.

<!-- trace:case id=g10.auction-watchlist.TC-ady rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC2: Watching nothing shows an explained empty view

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

* customer(signed in) has never watched a listing.

**Steps:**

1. Open the Watching view.

**Expected Results:**

* It says nothing is watched yet and how to watch, with no error.

<!-- trace:case id=g10.auction-watchlist.TC-cfv rev=1 covers=g10.auction-watchlist.SC-li4,g10.auction-watchlist.SC-m4a,g10.auction-watchlist.SC-qb7,g10.auction-watchlist.SC-n7p,g10.auction-watchlist.SC-01q,g10.auction-watchlist.SC-31g -->
### g10.auction-watchlist.US3-TC4: A called-off listing stays in the Watching view, shown as called off

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-watchlist-US-03

**Blocked:** watchlist keeps a called-off listing in Watching until it is unwatched, while lot-status keeps a called-off listing out of the watchlist; the auction product manager settles which holds.

**Pre-conditions:**

* customer(signed in) watched `<listing>`, which an operator then called off.

**Steps:**

1. Open the Watching view.

**Expected Results:**

* `<listing>` is listed, reading called off, until customer unwatches it.

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

* customer(signed in) watches open `<listing>`, alerts on.

**Steps:**

1. In the Watching view, turn email alerts off for `<listing>`.
2. Reload, and let `<listing>` reach 24 hours before its close.

**Expected Results:**

* Step 2 still lists `<listing>`, alerts off, and no closing letter for it reaches the inbox.

---

## g10.auction-watchlist.US4: Operator judges interest from the watch count

**As an** auction operator,
**I want** to see how many collectors watch a listing, across both brands,
**so that** I can judge interest without treating a watch as a commitment
to buy.

<!-- trace:case id=g10.auction-watchlist.TC-nnb rev=1 -->
### g10.auction-watchlist.US4-TC1: The operator's watch count adds both brands' watchers

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-watchlist-US-04

**Pre-conditions:**

* 2 Grade10 collectors and 1 ZZZ collector watch `<listing>`, and nobody bid; admin(holds auction:read) is on Listings.

**Steps:**

1. Open Stats on `<listing>`'s row.

**Expected Results:**

* The watch count reads 3, and the bid count 0.
