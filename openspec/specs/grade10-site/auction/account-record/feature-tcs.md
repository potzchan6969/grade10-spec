# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-account-record-US8: Winner opens settlement from My Auctions

**As a** winner,
**I want** every Won row to open Winner Order without helper clutter,
**so that** I can continue settlement without reading contact copy on the table.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC1-1: Won row offers View order

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
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Collector has Won standings across Awaiting Setup, Pending Payment, Payment Overdue, and Refunded.

**Steps:**

1. Open My Auctions.
2. Inspect each Won row.

**Expected Results:**

* Each Won row offers View order into that lot's Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC2-1: Didn’t win has no View order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Collector has a Didn’t win row with hold being released.

**Steps:**

1. Open My Auctions.
2. Inspect the Didn’t win row.

**Expected Results:**

* No View order entry to Winner Order.
* Hold being-released copy remains.

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC3-1: Expired Won row is calm

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Won listing with invoice `expired`.

**Steps:**

1. Open My Auctions.
2. Read the Won row.

**Expected Results:**

* Standing is Payment Overdue.
* View order is present.
* No secondary helper under the standing, including no how-to-reach-Grade10 on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC4-1: Awaiting Setup Won row has no confirm-address helper line

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Won listing in Awaiting Setup.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* Standing badge and View order only under Won presentation — no “confirm address” detail line.

## Raised

- Exact control label (View order vs Open order) is design copy; suite accepts either clear entry.

## grade10-site-auction-account-record-US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won lots to read their overdue state in Status,
**so that** I can tell closed self-service from an open window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=1 covers=g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US9-TC1-1: My Auctions names both overdue states

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Pre-conditions:**

* Customer has one Won order past the setup deadline and one unpaid invoice past the payment deadline.

**Steps:**

1. Open My Auctions and read the Status column.

**Expected Results:**

* The rows read Setup Overdue and Payment Overdue.
* Each row still offers View order.
* Each row retains the same lot and winning-bid facts as the Won row.

---

## grade10-site-auction-account-record-US5: Watch from the lot with alerts toast

**As a** collector,
**I want** watching a lot from its page to put it on My Auctions and tell me alerts are on,
**so that** I can open My Auctions from the toast when I want to manage it.

### grade10-site-auction-account-record-US5-TC1-1: Watched lot lands on My Auctions as watch-only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Pre-conditions:**

* customer(signed in, not watching <lot_1>, no bid on <lot_1>) is on <lot_1 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Click the Watch control.
2. Click View My Auctions in the toast.
3. Find the <lot_1> row.

**Expected Results:**

* Step 1: a toast says email alerts are on, with View My Auctions.
* Step 2: My Auctions opens; the title count includes <lot_1>.
* Step 3: <lot_1> shows once, with key image, title and close.
* Step 3: Your Standing reads `--`.
* Step 3: Email alerts switch is on; Unwatch is offered.

### grade10-site-auction-account-record-US5-TC2-1: Watching from the catalogue card lands on My Auctions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Pre-conditions:**

* customer(signed in, not watching <lot_1>, no bid on <lot_1>) is on <grade10 auction catalogue url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Click the watch control on <lot_1>'s card, bottom right of the image.
2. Navigate to <my auctions url>.

**Expected Results:**

* Step 1: the card's control reads Watching.
* Step 2: <lot_1> shows once, Your Standing `--`, email alerts on.

### grade10-site-auction-account-record-US5-TC3-1: A watch is seen only by its owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Pre-conditions:**

* customer A(signed in) watches <lot_1>.
* customer B(signed in, never watched or bid on <lot_1>) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, watched by customer A only |

**Steps:**

1. As customer B, navigate to <my auctions url>.
2. As customer B, navigate to <lot_1 url>.
3. As customer B, open the page source of <lot_1 url>.

**Expected Results:**

* Step 1: <lot_1> is not listed.
* Step 2: the control reads Watch; no watch count shows.
* Step 3: no watch count and no watcher's identity appear.

---

## grade10-site-auction-account-record-US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a lot to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

### grade10-site-auction-account-record-US6-TC1-1: First bid puts the lot on My Auctions without a Watch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching <lot_2>, no bid on <lot_2>) is on <lot_2 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | An open lot taking bids, with no bid from this collector and no other bidder |
| <first bid> | The next valid bid shown on the bid panel |

**Steps:**

1. Place <first bid> from the bid panel.
2. Reload <lot_2 url>.
3. Navigate to <my auctions url>.

**Expected Results:**

* Step 1: one toast says email alerts are on.
* Step 2: no alerts toast shows.
* Step 3: <lot_2> shows once, Your Standing Leading.
* Step 3: Email alerts switch is on; no Unwatch is offered.

### grade10-site-auction-account-record-US6-TC2-1: Bidding on a watched lot keeps one row

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
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, enrolled to bid, watching <lot_3>, no bid on <lot_3>) is on <lot_3 url>.
* The collector also watches <lot_4> without bidding.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_3> | An open lot taking bids, watched by this collector, closing after <lot_4> |
| <lot_4> | An open lot taking bids, watch-only for this collector, closing before <lot_3> |
| <first bid> | The next valid bid shown on <lot_3>'s bid panel |

**Steps:**

1. Place <first bid> from the bid panel.
2. Navigate to <my auctions url>.

**Expected Results:**

* <lot_3> shows once, Your Standing Leading, no Unwatch.
* <lot_3> sits above <lot_4>: bid rows before watch-only.

---

## grade10-site-auction-account-record-US1: Mark a listing now and find it again later

**As a** collector,
**I want** to watch listings I am interested in before bidding opens,
**so that** I can find them again when it does without searching the catalogue a second time.

### grade10-site-auction-account-record-US1-TC1-1: A lot watched before it opens is found when it opens

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
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) is on <lot_5 url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_5> | A published lot whose bidding has not started, scheduled to open inside the test window |

**Steps:**

1. Click the Watch control.
2. Navigate to <my auctions url>.
3. Wait until <lot_5>'s bidding starts, then reload <my auctions url>.
4. Click <lot_5>'s row.

**Expected Results:**

* Step 2: <lot_5> shows once, Your Standing `--`.
* Step 3: <lot_5> is still listed.
* Step 4: <lot_5 url> opens, taking bids.

### grade10-site-auction-account-record-US1-TC2-1: My Auctions orders bid rows, then watch-only, then closed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) has bookmarked every lot in **Test data**, and nothing else.

**Test data:**

| Lot | Bookmark | Close |
| --- | --- | --- |
| <lot_a> | Bid | Open, closes in 3 days |
| <lot_b> | Bid | Open, closes in 1 day |
| <lot_c> | Watch only | Open, closes in 2 days |
| <lot_d> | Watch only | Open, closes in 5 hours |
| <lot_e> | Watch only | Closed yesterday |

**Steps:**

1. Navigate to <my auctions url>.

**Expected Results:**

* The title count reads 5.
* Rows read, top down: <lot_b>, <lot_a>, <lot_d>, <lot_c>, <lot_e>.
* Each lot shows once.

### grade10-site-auction-account-record-US1-TC3-1: Nothing bookmarked is an empty state that offers the catalogue

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
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in, has never watched or bid on a lot).

**Steps:**

1. Navigate to <my auctions url>.
2. Click the catalogue offer.

**Expected Results:**

* Step 1: the page says nothing is bookmarked; no error shows.
* Step 2: the auction catalogue opens.

### grade10-site-auction-account-record-US1-TC4-1: A failed read says so and retries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) watches <lot_1>.
* The My Auctions read is mocked to fail once, then succeed.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An open lot taking bids, watched by this collector |

**Steps:**

1. Navigate to <my auctions url>.
2. Click retry.

**Expected Results:**

* Step 1: the page says the read failed; it does not read as empty.
* Step 1: no catalogue offer shows.
* Step 2: <lot_1> is listed.

### grade10-site-auction-account-record-US1-TC5-1: Signed-out visitor is asked to sign in and returned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed out) has watched lots under their account.

**Steps:**

1. Navigate to <my auctions url>.
2. Complete sign-in from the offer.

**Expected Results:**

* Step 1: sign-in is offered; no bookmarked lot shows.
* Step 2: the collector returns to My Auctions, showing their own lots.

---

## grade10-site-auction-account-record-US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

### grade10-site-auction-account-record-US2-TC1-1: Your Standing reads each open-lot state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) has bid on <lot>, in the state its row gives.

**Test data:**

| Lot state for customer A | Your Standing |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |
| Open, customer A's bid awaits its result | Bid submitted |
| Open, customer A's last bid was refused | Bid not accepted, and why |

**Steps:**

1. Navigate to <my auctions url>.
2. Find <lot>'s row.

**Expected Results:**

* Your Standing reads the row's value.
* Current bid reads <lot>'s current bid.
* For Outbid, the next valid bid equals current bid plus its increment.

### grade10-site-auction-account-record-US2-TC2-1: Being outbid moves the row from Leading to Outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) leads <lot_6> and is on <my auctions url>.
* customer B(signed in, enrolled to bid) is on <lot_6 url> in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | An open lot taking bids, led by customer A with no maximum above the current bid |
| <customer B bid> | The next valid bid shown on customer B's bid panel |

**Steps:**

1. As customer B, place <customer B bid>.
2. As customer A, reload <my auctions url>.

**Expected Results:**

* <lot_6> reads Outbid, with the next valid bid.
* Current bid reads <customer B bid>.

### grade10-site-auction-account-record-US2-TC3-1: A value that could not refresh is marked not current

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) has bid on <lot_6> and is on <my auctions url>.
* The refresh of <lot_6>'s bid and close is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_6> | An open lot taking bids, bid on by customer A |

**Steps:**

1. Wait for the next refresh of <lot_6>'s row.

**Expected Results:**

* <lot_6>'s current bid and close are shown as not current.

---

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** to see what I owe and where my card is,
**so that** I do not have to ask Grade10 what happens next.

### grade10-site-auction-account-record-US3-TC5-1: A Won row reads its order's status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(signed in) won <lot>, whose order is in the row's state.

**Test data:**

| Order state | Your Standing |
| --- | --- |
| Delivery not yet set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |

**Steps:**

1. Navigate to <my auctions url>.
2. Find <lot>'s row.

**Expected Results:**

* Your Standing reads the row's value.
* The row offers View order.

---

## grade10-site-auction-account-record-US4: Know my money is coming back when I lose

**As a** losing bidder,
**I want** to see that my card hold is released,
**so that** a pending authorization on my statement does not read as a charge for a listing I did not win.

### grade10-site-auction-account-record-US4-TC1-1: Didn't win names where the card hold is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-04

**Pre-conditions:**

* customer A(signed in) bid on <lot>, which closed with customer B winning.
* customer A's card hold is in the row's state.

**Test data:**

| Card hold | Your Standing |
| --- | --- |
| Release requested, not yet confirmed | Didn't win, hold being released |
| Release confirmed | Didn't win, hold released |

**Steps:**

1. Navigate to <my auctions url>.
2. Find <lot>'s row.

**Expected Results:**

* Your Standing reads the row's value.
* No amount is shown as charged.
* The row sits after the open lots.


## Settled

- My Auctions carries the mixed standing and order-state values in Status, including Setup Overdue and Payment Overdue.

- Contact for expired payment is Winner Order only (author @tangconst).
- Didn’t win hold copy stays.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suite required View order on every Won | Folded as SC-56 |
| Suite required no View order on Didn’t win | Folded as SC-57 |
| Suite required no row contact / no Won helpers | Folded as SC-22 amend + SC-58 |
| Hold copy retained for Didn’t win | Covered by redesign/durable hold scenarios; not removed here |
| My Auctions uses Status for both overdue outcomes | Folded as SC-63 |
