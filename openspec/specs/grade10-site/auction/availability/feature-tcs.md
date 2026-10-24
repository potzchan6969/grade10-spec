# grade10-site/auction/availability Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7
**Out of suite (api):** grade10-site-auction-availability-SC-11a - a lot read or live channel opened by hand, with no screen that sends it

## Background

* `<restricted region>` is a region where auctions are not offered: CU, IR, KP or SY. `<offered region>` is any other, such as HK. A tester changes region by connecting through that region.
* The restriction page names that auctions are not available in the visitor's region and links to the store.

## Walk 1: Collector in a restricted region meets the site

Starting state:

- customer(signed in) won `<won listing>`, its invoice issued and unpaid, and watches `<watched listing>`; customer is connected from `<restricted region>`.

Shared test data:

| Field | Value |
| --- | --- |
| won listing | A closed USD listing customer won |
| watched listing | An open USD listing customer watches and has not bid on |

### Route

1. Open the store home, its menu and the account menu.
   - No Auction item and no auction entry; every other item shows. `g10.auction-availability.US1-TC1`
2. Open a product page and add it to the cart.
   - The store works, with no watch control, bid panel or auction link. `g10.auction-availability.US1-TC3`
3. Open `<g10url>/auction`, then `<watched listing>`'s address.
   - The restriction page each time. `g10.auction-availability.US2-TC1`
4. Open `<won listing>`'s order from its invoice email.
   - The order shows its invoice and its address, payment and proof actions. `g10.auction-availability.US2-TC4`
5. Connect from `<offered region>` and reload the store home.
   - The Auction item is back. `g10.auction-availability.US1-TC4`

## g10.auction-availability.US1: Collector in a restricted region shops the store

**As a** collector in a region where auctions are not offered,
**I want** the store and the rest of the site to work as usual,
**so that** the restriction costs me only what I cannot legally have.

<!-- trace:case id=g10.auction-availability.TC-muj rev=1 -->
### g10.auction-availability.US1-TC1: No auction entry shows in a restricted region's navigation or account menu

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

* customer(signed in) has bid on, watches and won lots, and is connected from `<restricted region>`.

**Test data:**

| `<menu>` |
| --- |
| The primary navigation, on a wide screen |
| The menu drawer, on a narrow screen |
| The account menu |

**Steps:**

1. Open the store home and open `<menu>`.

**Expected Results:**

* No Auction item, My Auctions, watchlist or auction order entry shows; every other item does.

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

* Step 1 shows the Auction item and every auction surface; step 2 hides them again.

---

## g10.auction-availability.US2: Collector in a restricted region opens an auction link

**As a** collector in a restricted region who followed an auction link,
**I want** a page that says auctions are not available to me and points me at
the store,
**so that** a shared link or an email never lands me on a broken page.

<!-- trace:case id=g10.auction-availability.TC-gu2 rev=1 -->
### g10.auction-availability.US2-TC1: Every auction address answers the restriction page in a restricted region

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
* **Trace:** grade10-site-auction-availability-US-02

**Pre-conditions:**

* customer(signed in) has bids, and is connected from `<restricted region>`.

**Test data:**

| `<address>` |
| --- |
| `<g10url>/auction` |
| an open lot's link, as an email or chat carries it |
| My Auctions |
| `<g10url>/bids` |

**Steps:**

1. Open `<address>`, then follow the page's store link.

**Expected Results:**

* The restriction page shows, never the auction, Page not found, a gallery, a bid panel or the customer's lots; the link opens the store.

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

* customer(signed in) won `<listing>`, its invoice issued and unpaid, and is connected from `<restricted region>`.

**Steps:**

1. Open the order from its invoice email, and read its actions.

**Expected Results:**

* The order shows as for any winner, with its invoice and its address, payment and proof actions.

---

## g10.auction-availability.US3: Collector in a restricted region tries to act on an auction

**As a** collector in a restricted region who sends a bid or a watch
anyway,
**I want** the action refused before it reaches the auction,
**so that** no commitment is recorded that cannot be settled.

<!-- trace:case id=g10.auction-availability.TC-nlq rev=1 -->
### g10.auction-availability.US3-TC1: A bid, card link or watch from a page opened before the move is refused

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

* customer(signed in, `<card>`) opened open `<listing>`'s page from `<offered region>`, noting its price, leader and bid count, and is now connected from `<restricted region>` with the page still open.

**Test data:**

| `<card>` | `<action>` | `<not recorded>` |
| --- | --- | --- |
| card linked | Place a bid at the next minimum | no bid |
| no card linked | Link a card from the bid panel | no card |
| card linked | Select Watch | no watch |

**Steps:**

1. `<action>`.
2. Connect from `<offered region>`, reload `<listing>`, and open the watchlist.

**Expected Results:**

* Step 1 shows the restriction page.
* Step 2 matches the note, with `<not recorded>` for the customer.

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
| Select Unwatch on `<listing>`'s page, opened before the move | the watch |
| Follow the alert email's mute link | the lot's alerts |

**Steps:**

1. `<route>`.
2. Connect from `<offered region>` and open the watchlist.

**Expected Results:**

* Step 1 confirms, never the restriction page; step 2 shows `<withdrawn>` withdrawn.

---

## g10.auction-availability.US4: Collector in an unrestricted region uses auctions

**As a** collector in a region where auctions are offered,
**I want** every auction surface to work exactly as it does today,
**so that** a rule meant for other regions never touches me.

<!-- trace:case id=g10.auction-availability.TC-cj0 rev=1 -->
### g10.auction-availability.US4-TC1: A visit from an offered region, or one whose region cannot be judged, sees every auction surface

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-availability-US-04

**Pre-conditions:**

* customer(signed in) is connected `<connection>`.

**Test data:**

| `<connection>` |
| --- |
| from `<offered region>` |
| through a network whose region cannot be judged |

**Steps:**

1. Open the store home, its Auction item, an open lot and the account menu.

**Expected Results:**

* The Auction item, the catalogue, the lot with its bid panel and watch control, and the account menu's auction entries all show; the restriction page never does.

---

## Settled

- A restricted winner keeps the order and invoice with its address, payment and proof actions, and may unwatch and mute alerts; My Auctions, the Bids page, standings and new bids are refused.
