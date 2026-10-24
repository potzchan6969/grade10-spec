# grade10-site/auction/availability Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7
**Out of suite (api):** grade10-site-auction-availability-SC-11a - a lot read or live channel opened by hand, with no screen that sends it

## Background

* `<restricted region>` is a region where auctions are not offered: CU, IR, KP or SY. `<offered region>` is any other, such as HK. A tester changes region by connecting through that region.
* The restriction page names that auctions are not available in the visitor's region and links to the store.

## Walk 1: Collector in a restricted region meets the site

Starting state:

- customer(signed in) won `<won listing>` and has not paid its order; customer watches `<watched listing>`.
- customer is connected from `<restricted region>`.

Shared test data:

| Field | Value |
| --- | --- |
| won listing | A closed USD listing customer won, order unpaid |
| watched listing | An open USD listing customer watches and has not bid on |

### Route

1. Open the store home and read the primary navigation.
   - No Auction item shows. `g10.auction-availability.US1-TC1`
2. Open the account menu.
   - No My Auctions, watchlist or auction order entry shows; the other entries do. `g10.auction-availability.US1-TC2`
3. Open a product page and add it to the cart.
   - The page and the cart work, with no watch control, bid panel or auction link. `g10.auction-availability.US1-TC3`
4. Open `<g10url>/auction`.
   - The restriction page shows, not the catalogue. `g10.auction-availability.US2-TC1`
5. Open `<watched listing>`'s address.
   - The restriction page shows, with no gallery, status or bid panel. `g10.auction-availability.US2-TC2`
6. Open `<won listing>`'s order.
   - The order shows with its address, payment and proof actions. `g10.auction-availability.US2-TC4`
7. Connect from `<offered region>` and reload the store home.
   - The Auction item is back. `g10.auction-availability.US1-TC4`

## g10.auction-availability.US1: Collector in a restricted region shops the store

**As a** collector in a region where auctions are not offered,
**I want** the store and the rest of the site to work as usual,
**so that** the restriction costs me only what I cannot legally have.

<!-- trace:case id=g10.auction-availability.TC-muj rev=1 -->
### g10.auction-availability.US1-TC1: Navigation shows no Auction item in a restricted region

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* The visitor is connected from `<restricted region>`.

**Test data:**

| `<viewport>` | `<navigation>` |
| --- | --- |
| Wide | The primary navigation |
| Narrow | The menu drawer |

**Steps:**

1. Open the store home at `<viewport>` and open `<navigation>`.

**Expected Results:**

* `<navigation>` shows no Auction item, and every other item.

<!-- trace:case id=g10.auction-availability.TC-7u0 rev=1 -->
### g10.auction-availability.US1-TC2: The account menu shows no auction entry in a restricted region

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* customer(signed in) has bid on, watches and won lots, and is connected from `<restricted region>`.

**Steps:**

1. Open the account menu.

**Expected Results:**

* No My Auctions, watchlist or auction order entry shows; every other entry does.

<!-- trace:case id=g10.auction-availability.TC-q7w rev=1 -->
### g10.auction-availability.US1-TC3: The store works unchanged and shows no auction control

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* customer(signed in) is connected from `<restricted region>`.

**Steps:**

1. Open the store home, a product listing and a product page.
2. Add the product to the cart and open the cart.

**Expected Results:**

* Each page works as it does from `<offered region>`, with no watch control, bid panel or auction link.

<!-- trace:case id=g10.auction-availability.TC-aht rev=1 -->
### g10.auction-availability.US1-TC4: Each visit is judged on its own region

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-01

**Pre-conditions:**

* The visitor opened the store home from `<restricted region>`, in the same browser session.

**Steps:**

1. Connect from `<offered region>` and reload the store home.
2. Connect from `<restricted region>` and reload it again.

**Expected Results:**

* Step 1 shows the Auction item and every auction surface.
* Step 2 hides them again.

---

## g10.auction-availability.US2: Collector in a restricted region opens an auction link

**As a** collector in a restricted region who followed an auction link,
**I want** a page that says auctions are not available to me and points me at
the store,
**so that** a shared link or an email never lands me on a broken page.

<!-- trace:case id=g10.auction-availability.TC-gu2 rev=1 -->
### g10.auction-availability.US2-TC1: The catalogue address answers the restriction page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* The visitor is connected from `<restricted region>`.

**Steps:**

1. Open `<g10url>/auction`.
2. Follow the page's store link.

**Expected Results:**

* Step 1 shows the restriction page, neither the catalogue nor Page not found.
* Step 2 opens the store.

<!-- trace:case id=g10.auction-availability.TC-o6b rev=1 -->
### g10.auction-availability.US2-TC2: A lot link answers the restriction page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* `<listing>` is open; the visitor is connected from `<restricted region>` and holds a link to it, as an email or a chat would carry.

**Steps:**

1. Open the link.

**Expected Results:**

* The restriction page shows, with no gallery, status or bid panel.

<!-- trace:case id=g10.auction-availability.TC-e9z rev=1 -->
### g10.auction-availability.US2-TC3: My Auctions and the Bids page answer the restriction page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* customer(signed in) has bids and is connected from `<restricted region>`.

**Test data:**

| `<page>` |
| --- |
| My Auctions |
| `<g10url>/bids` |

**Steps:**

1. Open `<page>`'s address.

**Expected Results:**

* The restriction page shows, and none of the customer's lots or standings.

<!-- trace:case id=g10.auction-availability.TC-xgz rev=1 -->
### g10.auction-availability.US2-TC4: A winner settles their order from a restricted region

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* customer(signed in) won `<listing>`, its invoice is issued and unpaid, and customer is connected from `<restricted region>`.

**Steps:**

1. Open the order from its invoice email.
2. Read the order's actions.

**Expected Results:**

* The order shows as it does for any winner, with its invoice and its address, payment and proof actions.

---

## g10.auction-availability.US3: Collector in a restricted region tries to act on an auction

**As a** collector in a restricted region who sends a bid or a watch
anyway,
**I want** the action refused before it reaches the auction,
**so that** no commitment is recorded that cannot be settled.

<!-- trace:case id=g10.auction-availability.TC-nlq rev=1 -->
### g10.auction-availability.US3-TC1: A bid from a page opened before the move is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* customer(signed in, `<card>`) opened open `<listing>`'s page from `<offered region>`; its price, leader and bid count are noted.
* customer is now connected from `<restricted region>`, with the page still open.

**Test data:**

| `<card>` | `<action>` |
| --- | --- |
| card linked | Place a bid at the next minimum |
| no card linked | Link a card from the bid panel |

**Steps:**

1. `<action>`.
2. Connect from `<offered region>` and reload `<listing>`.

**Expected Results:**

* Step 1 shows the restriction page.
* Step 2 matches the note; no bid or card is recorded for the customer.

<!-- trace:case id=g10.auction-availability.TC-7q4 rev=1 -->
### g10.auction-availability.US3-TC2: A watch from a page opened before the move is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* customer(signed in) opened unwatched `<listing>`'s page from `<offered region>` and is now connected from `<restricted region>`, with the page still open.

**Steps:**

1. Select Watch.
2. Connect from `<offered region>` and open the watchlist.

**Expected Results:**

* Step 1 shows the restriction page.
* Step 2 does not list `<listing>`.

<!-- trace:case id=g10.auction-availability.TC-awy rev=1 -->
### g10.auction-availability.US3-TC3: Unwatching and muting alerts still work from a restricted region

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-03

**Pre-conditions:**

* customer(signed in) watches `<listing>` and has an alert email for it; customer is connected from `<restricted region>`.

**Test data:**

| `<route>` | `<withdrawn>` |
| --- | --- |
| Select Unwatch on `<listing>`'s page, opened before the move | The watch |
| Follow the alert email's mute link | The lot's alerts |

**Steps:**

1. `<route>`.
2. Connect from `<offered region>` and open the watchlist.

**Expected Results:**

* Step 1 confirms, never the restriction page.
* Step 2 shows `<withdrawn>` withdrawn.

---

## g10.auction-availability.US4: Collector in an unrestricted region uses auctions

**As a** collector in a region where auctions are offered,
**I want** every auction surface to work exactly as it does today,
**so that** a rule meant for other regions never touches me.

<!-- trace:case id=g10.auction-availability.TC-cj0 rev=1 -->
### g10.auction-availability.US4-TC1: An offered region sees every auction surface

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-availability-US-04

**Pre-conditions:**

* customer(signed in) is connected from `<offered region>`.

**Steps:**

1. Open the store home, its Auction item, an open lot and the account menu.

**Expected Results:**

* The Auction item, catalogue, lot with its bid panel and watch control, and the account menu's auction entries all show; the restriction page never does.

<!-- trace:case id=g10.auction-availability.TC-mjk rev=1 -->
### g10.auction-availability.US4-TC2: A visit whose region cannot be judged sees auctions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-04

**Pre-conditions:**

* The visitor is connected through a network whose region cannot be judged.

**Steps:**

1. Open `<g10url>/auction`.

**Expected Results:**

* The catalogue shows, never the restriction page.

---

## Settled

- A restricted winner keeps the order and invoice with its address, payment and proof actions, and may unwatch and mute alerts; My Auctions, the Bids page, standings and new bids are refused.
