# grade10-site/auction/account-record Test Cases

**Status:** pending-review · 0/33
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* My Auctions is the signed-in collector's list of every listing they watch or bid on, one row each, with the total in the title. A row's Status reads `--` for watch-only, Leading or Outbid while open, and Won or Didn't win once the close is recorded; a Won row reads its order's status beside Won.
* Every listing is priced in USD. The step is +USD25 from USD200, +USD100 from USD1,000 and +USD500 from USD5,000.

## Walk 1: A collector watches, bids, and reads where they stand

Starting state:

- customer A(signed in, card linked) has never watched or bid on anything.
- customer B(signed in, card linked) is on a separate session.

Shared test data:

| Field | Value |
| --- | --- |
| watched listing | An open USD listing nobody has bid on |
| bid listing | An open USD listing nobody has bid on, closing after `<watched listing>` |

### Route

1. Open My Auctions.
   - It says nothing is bookmarked and offers the catalogue. `g10.auction-account-record.US1-TC3`
2. On `<watched listing>`'s page, click Watch, then View My Auctions in the toast.
   - The toast says email alerts are on; the row shows once, Status `--`, alerts on, with Unwatch. `g10.auction-account-record.US5-TC1`
3. On `<bid listing>`'s page, place the next valid bid; reload the page.
   - One alerts toast, then none on reload. `g10.auction-account-record.US6-TC1`
4. Open My Auctions.
   - `<bid listing>` reads Leading, with no Unwatch, above `<watched listing>`. `g10.auction-account-record.US6-TC2`
5. As customer B, place the next valid bid on `<bid listing>`; as customer A, reload My Auctions.
   - `<bid listing>` reads Outbid with the next valid bid, and Current bid reads customer B's bid. `g10.auction-account-record.US2-TC2`

## Walk 2: A winner follows the Won row to the order

Starting state:

- customer(signed in) won `<won listing>` and lost `<lost listing>` to customer B.

Shared test data:

| Field | Value |
| --- | --- |
| won listing | A closed USD listing customer won, order in Awaiting Setup |
| lost listing | A closed USD listing customer B won over customer |

### Route

1. Open My Auctions.
   - `<won listing>` reads Won, Awaiting Setup, with View order and no helper line. `g10.auction-account-record.US8-TC3`
   - `<lost listing>` reads Didn't win, says the card was not charged, and offers no View order. `g10.auction-account-record.US8-TC2`
2. Click Email alerts on `<lost listing>`.
   - It is disabled. `g10.auction-account-record.US7-TC4`
3. Click View order on `<won listing>`.
   - Its Winner Order opens. `g10.auction-account-record.US7-TC5`

## g10.auction-account-record.US1: Mark a listing now and find it again later

**As a** collector,
**I want** to watch listings I am interested in before bidding opens,
**so that** I can find them again when it does without searching the catalogue a second time.

<!-- trace:case id=g10.auction-account-record.TC-3pj rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
### g10.auction-account-record.US1-TC1: A listing watched before it opens is found when it opens

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) is on `<listing_43>`'s page; its bidding opens inside the test window.

**Steps:**

1. Click Watch and open My Auctions.
2. Wait until `<listing_43>`'s bidding starts, reload My Auctions and click its row.

**Expected Results:**

* Step 1 lists `<listing_43>` once, Status `--`.
* Step 2 still lists it, and the row opens `<listing_43>`, taking bids.

<!-- trace:case id=g10.auction-account-record.TC-s25 rev=2 -->
### g10.auction-account-record.US1-TC2: My Auctions orders bid rows, then watch-only, then closed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer(signed in) bid on `<listing_38>` (closes in 3 days) and `<listing_39>` (1 day), and only watches `<listing_40>` (2 days), `<listing_41>` (5 hours) and `<listing_42>` (closed yesterday), and nothing else.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* The title count reads 5, and the rows read, top down: `<listing_39>`, `<listing_38>`, `<listing_41>`, `<listing_40>`, `<listing_42>`, each once.

<!-- trace:case id=g10.auction-account-record.TC-wtn rev=2 -->
### g10.auction-account-record.US1-TC3: Nothing bookmarked is an empty state that offers the catalogue

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) has never watched or bid on a listing.

**Steps:**

1. Open My Auctions.
2. Click the catalogue offer.

**Expected Results:**

* Step 1 says nothing is bookmarked, with no error.
* Step 2 opens the auction catalogue.

<!-- trace:case id=g10.auction-account-record.TC-5jj rev=2 -->
### g10.auction-account-record.US1-TC4: A failed read says so and retries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_37>`; My Auctions fails to load once, then loads.

**Steps:**

1. Open My Auctions.
2. Click retry.

**Expected Results:**

* Step 1 says the read failed, never reads as empty, and offers no catalogue.
* Step 2 lists `<listing_37>`.

<!-- trace:case id=g10.auction-account-record.TC-2c9 rev=2 -->
### g10.auction-account-record.US1-TC5: A signed-out visitor is asked to sign in and returned

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Pre-conditions:**

* customer is signed out and watches listings.

**Steps:**

1. Open My Auctions.
2. Sign in from the offer.

**Expected Results:**

* Step 1 offers sign-in and shows no listing.
* Step 2 returns to My Auctions with the customer's own listings.

---

## g10.auction-account-record.US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

<!-- trace:case id=g10.auction-account-record.TC-gj0 rev=3 -->
### g10.auction-account-record.US2-TC1: An open listing's row reads Leading or Outbid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) bid on open `<listing_35>`, which `<leader>` leads.

**Test data:**

| `<leader>` | `<status>` |
| --- | --- |
| customer A | Leading |
| customer B | Outbid, with the next valid bid: the current bid plus its step |

**Steps:**

1. Open My Auctions and find `<listing_35>`.

**Expected Results:**

* Status reads `<status>`, and Current bid reads `<listing_35>`'s current bid.

<!-- trace:case id=g10.auction-account-record.TC-oi7 rev=2 -->
### g10.auction-account-record.US2-TC2: Being outbid moves the row from Leading to Outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_34>` with no maximum above the current bid, and is on My Auctions.
* customer B(signed in, card linked) is on `<listing_34>`'s page.

**Steps:**

1. As customer B, place the next valid bid.
2. As customer A, reload My Auctions.

**Expected Results:**

* `<listing_34>` reads Outbid with the next valid bid, and Current bid reads customer B's bid.

<!-- trace:case id=g10.auction-account-record.TC-nv4 rev=2 -->
### g10.auction-account-record.US2-TC3: A value that could not refresh is marked not current

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) bid on open `<listing_33>` and is on My Auctions; the refresh of `<listing_33>`'s row fails.

**Steps:**

1. Wait for the next refresh of `<listing_33>`'s row.

**Expected Results:**

* Its current bid and close show as not current.

<!-- trace:case id=g10.auction-account-record.TC-w62 rev=3 covers=g10.auction-account-record.SC-dsc -->
### g10.auction-account-record.US2-TC4: A refused raise leaves the row's Status and price as they were

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* On `<listing_31>`, at a current bid of USD300 and a next minimum of USD325 (USD300 plus the USD25 step), customer A(signed in, card linked) holds a maximum of `<maximum>` and reads `<status>`; customer A is on its page.

**Test data:**

| `<maximum>` | `<status>` |
| --- | --- |
| USD250, customer B leading | Outbid, with the next valid bid USD325 |
| USD300, customer A leading | Leading |

**Steps:**

1. Enter USD310 in the custom maximum and confirm.
2. Open My Auctions and find `<listing_31>`.

**Expected Results:**

* Step 1 is refused on the bid panel, naming USD325.
* Step 2 reads `<status>`, and Current bid USD300, never USD310.

<!-- trace:case id=g10.auction-account-record.TC-na3 rev=3 -->
### g10.auction-account-record.US2-TC5: A refused first bid adds no row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, card linked) has neither watched nor bid on open `<listing_31>`; My Auctions' title count is noted.

**Steps:**

1. On `<listing_31>`'s page, enter one dollar below the next valid bid and confirm.
2. Open My Auctions.

**Expected Results:**

* Step 1 is refused on the bid panel.
* Step 2 lists no `<listing_31>`, and the title count matches the note.

<!-- trace:case id=g10.auction-account-record.TC-8mz rev=3 -->
### g10.auction-account-record.US2-TC6: An Outbid bidder's refused bid leaves their row Outbid and in place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, card linked) bid on `<listing_29>` and `<listing_30>`, which closes first; customer B has since outbid customer A on `<listing_29>`; customer A is on `<listing_29>`'s page.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD5,460 (range: 500000–799999 minor units) |
| `<next minimum>` | USD5,960 (fixed derived: `<current bid>` plus the USD500 step) |

**Steps:**

1. Enter `<current bid>` in the custom maximum and confirm.
2. Open My Auctions and find `<listing_29>`.

**Expected Results:**

* Step 1: the bid form says Minimum bid is `<next minimum>`.
* Step 2: Outbid with the next valid bid `<next minimum>`, Current bid `<current bid>`, still below `<listing_30>`; no row reads Bid submitted or Bid not accepted.

---

## g10.auction-account-record.US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the listing shipped.

<!-- trace:case id=g10.auction-account-record.TC-83f rev=2 -->
### g10.auction-account-record.US3-TC5: A Won row reads its order's status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_26>`, whose order is `<order state>`.

**Test data:**

| `<order state>` | `<status>` |
| --- | --- |
| Not set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |

**Steps:**

1. Open My Auctions and find `<listing_26>`.

**Expected Results:**

* Status reads `<status>`, and the row offers View order.

<!-- trace:case id=g10.auction-account-record.TC-lvl rev=2 -->
### g10.auction-account-record.US3-TC20: A paid Won row reads Preparing Shipment, then Shipped

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_24>`, whose order is paid and `<fulfilment>`.

**Test data:**

| `<fulfilment>` | `<status>` |
| --- | --- |
| Not dispatched | Preparing Shipment |
| Dispatched, delivery not confirmed | Shipped |

**Steps:**

1. Open My Auctions and read `<listing_24>`'s Status.

**Expected Results:**

* Status reads `<status>` with the default badge.

<!-- trace:case id=g10.auction-account-record.TC-hj7 rev=2 -->
### g10.auction-account-record.US3-TC2: A Won row follows the proof check's outcome

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(signed in) won `<listing_28>`, whose payment proof was under check; an operator then `<operator act>`.

**Test data:**

| `<operator act>` | `<status>` |
| --- | --- |
| Returned the proof | Won, Pending Payment |
| Confirmed the payment | Won, Preparing Shipment |

**Steps:**

1. Open My Auctions and read `<listing_28>`'s row.

**Expected Results:**

* Status reads `<status>`.

<!-- trace:case id=g10.auction-account-record.TC-wt4 rev=2 -->
### g10.auction-account-record.US3-TC4: Another collector never sees a Payment Verifying row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A won `<listing_27>`, which reads Payment Verifying; customer B(signed in) never bid on or watched it.

**Steps:**

1. As customer B, open My Auctions.

**Expected Results:**

* No `<listing_27>` row shows.

<!-- trace:case id=g10.auction-account-record.TC-now rev=2 -->
### g10.auction-account-record.US3-TC23: Shipped Won row keeps the default badge

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-account-record-US-03

**Retirement:** The Shipped row of `g10.auction-account-record.US3-TC20`.

**Pre-conditions:**

* customer won a lot whose order is dispatched.

**Steps:**

1. Read its Status on My Auctions.

**Expected Results:**

* Shipped, with the default badge.

---

## g10.auction-account-record.US4: Know I was not charged when I lose

**As a** losing bidder,
**I want** to see that my card was not charged,
**so that** I know I owe nothing for a listing I did not win.

<!-- trace:case id=g10.auction-account-record.TC-rfz rev=4 -->
### g10.auction-account-record.US4-TC1: Didn't win says the card was not charged

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) bid on `<listing_23>`, which `<ending>`.

**Test data:**

| `<ending>` |
| --- |
| Closed with customer B winning |
| Was called off by Grade10 |

**Steps:**

1. Open My Auctions and find `<listing_23>`.

**Expected Results:**

* Status reads Didn't win, the row says the card was not charged, and no amount reads as charged.

---

## g10.auction-account-record.US5: Watch from the auction with alerts toast

**As a** collector,
**I want** watching a listing from its page to put it on My Auctions and tell me alerts are on,
**so that** I can open My Auctions from the toast when I want to manage it.

<!-- trace:case id=g10.auction-account-record.TC-7pb rev=2 -->
### g10.auction-account-record.US5-TC1: Watching from the listing page lands on My Auctions as watch-only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) neither watches nor bid on open `<listing_22>` and is on its page.

**Steps:**

1. Click Watch.
2. Click View My Auctions in the toast and find `<listing_22>`.

**Expected Results:**

* Step 1: a toast says email alerts are on, with View My Auctions.
* Step 2: the title count includes `<listing_22>`, shown once with its image, title and close; Status `--`; Email alerts on; Unwatch offered.

<!-- trace:case id=g10.auction-account-record.TC-tzp rev=2 -->
### g10.auction-account-record.US5-TC2: Watching from the catalogue card lands on My Auctions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) neither watches nor bid on open `<listing_22>` and is on the auction catalogue.

**Steps:**

1. Click the watch control at the bottom right of `<listing_22>`'s card image.
2. Open My Auctions.

**Expected Results:**

* Step 1: the control reads Watching.
* Step 2 lists `<listing_22>` once, Status `--`, email alerts on.

<!-- trace:case id=g10.auction-account-record.TC-sse rev=2 -->
### g10.auction-account-record.US5-TC3: A watch is seen only by its owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A watches open `<listing_21>`; customer B(signed in) never watched or bid on it.

**Steps:**

1. As customer B, open My Auctions.
2. As customer B, open `<listing_21>`'s page.

**Expected Results:**

* Step 1 lists no `<listing_21>`.
* Step 2's control reads Watch, and no watch count or watcher shows.

---

## g10.auction-account-record.US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a listing to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

<!-- trace:case id=g10.auction-account-record.TC-l63 rev=2 -->
### g10.auction-account-record.US6-TC1: A first bid puts the listing on My Auctions without a Watch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) neither watches nor bid on open `<listing_20>`, which has no bidder, and is on its page.

**Steps:**

1. Place the next valid bid.
2. Reload the page.
3. Open My Auctions.

**Expected Results:**

* Step 1 shows one toast saying email alerts are on; step 2 shows none.
* Step 3 lists `<listing_20>` once, Leading, Email alerts on, with no Unwatch.

<!-- trace:case id=g10.auction-account-record.TC-9rb rev=2 -->
### g10.auction-account-record.US6-TC2: Bidding on a watched listing keeps one row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) watches `<listing_18>` and `<listing_19>`, which closes first, without bidding, and is on `<listing_18>`'s page.

**Steps:**

1. Place the next valid bid.
2. Open My Auctions.

**Expected Results:**

* `<listing_18>` shows once, Leading, with no Unwatch, above `<listing_19>`.

<!-- trace:case id=g10.auction-account-record.TC-43z rev=3 -->
### g10.auction-account-record.US6-TC3: A refused first bid puts nothing on My Auctions

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
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, card linked, `<account>`) neither watches nor bid on `<listing_17>`, open at USD280 with no bid, and is on its page; My Auctions' title count is noted.

**Test data:**

| `<account>` | `<typed bid>` | `<refusal>` |
| --- | --- | --- |
| bidding allowed | USD140 (range: below USD280) | Minimum bid is USD280 |
| bidding suspended by an operator | USD280 | Bidding is suspended on this account. Contact Us to resolve it. |

**Steps:**

1. Enter `<typed bid>` in the custom maximum and confirm.
2. Reload the page.
3. Open My Auctions.

**Expected Results:**

* Step 1: the bid form says `<refusal>`, and no alerts toast shows.
* Step 2: the control offers Watch.
* Step 3 lists no `<listing_17>`, and the title count matches the note.

---

## g10.auction-account-record.US7: Collector reads My Auctions as one list

**As a** collector
**I want** every listing I bid on or watch in one list, with the total in the title
**so that** I read my whole record in one place without switching tabs.

<!-- trace:case id=g10.auction-account-record.TC-91p rev=3 -->
### g10.auction-account-record.US7-TC1: Every listing sits in one list under the breadcrumb

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_14>` (not yet open), `<listing_15>` (open) and `<listing_16>` (closed).

**Steps:**

1. Open My Auctions.

**Expected Results:**

* No Active, Upcoming or Ended tab; the breadcrumb sits above the container; the title badge shows 3; one list holds all three.

<!-- trace:case id=g10.auction-account-record.TC-z0b rev=3 -->
### g10.auction-account-record.US7-TC2: A listing stays in the list when its window opens

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_13>`, whose bidding opens inside the test window.

**Steps:**

1. Open My Auctions.
2. Wait until `<listing_13>` opens and reload.

**Expected Results:**

* `<listing_13>` is listed once, and no tab is offered.

<!-- trace:case id=g10.auction-account-record.TC-tbh rev=3 -->
### g10.auction-account-record.US7-TC3: A record with lots shows no empty state

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches open listings.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* No empty state and no error show.

<!-- trace:case id=g10.auction-account-record.TC-tzc rev=3 -->
### g10.auction-account-record.US7-TC4: Email alerts cannot be changed on a closed row

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_12>`, which has closed.

**Steps:**

1. Open My Auctions and click Email alerts on `<listing_12>`.

**Expected Results:**

* The control is disabled, and the setting is unchanged.

<!-- trace:case id=g10.auction-account-record.TC-6xk rev=2 -->
### g10.auction-account-record.US7-TC5: A Won row opens its auction order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_11>`.

**Steps:**

1. Open My Auctions and click View order on `<listing_11>`'s row.

**Expected Results:**

* `<listing_11>`'s Winner Order opens.

---

## g10.auction-account-record.US8: Winner revisits a partially paid order

**As a** winner with an order being collected in parts,
**I want** My Auctions to keep the Won row linked to the order,
**so that** I can return to the locked payment record.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=2 -->
### g10.auction-account-record.US8-TC1: A partially paid Won row opens Winner Order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_10>`, whose order is Partially Paid.

**Steps:**

1. Open My Auctions and read `<listing_10>`'s row.
2. Click View order.

**Expected Results:**

* Step 1 reads Partially Paid, with its warning treatment.
* Step 2 opens the Partially Paid Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=3 -->
### g10.auction-account-record.US8-TC2: A Didn't win row offers no View order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) bid on `<listing_9>`, which closed with customer B winning.

**Steps:**

1. Open My Auctions and read `<listing_9>`'s row.

**Expected Results:**

* Didn't win, saying the card was not charged, with no View order.

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=2 -->
### g10.auction-account-record.US8-TC3: A Won row carries no status-specific helper

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_7>`, whose order reads `<order status>`.

**Test data:**

| `<order status>` |
| --- |
| Payment Overdue |
| Awaiting Setup, inside the setup window |

**Steps:**

1. Open My Auctions and read `<listing_7>`'s row.

**Expected Results:**

* Won, `<order status>`, with View order, and no helper line or way to reach Grade10 on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=2 -->
### g10.auction-account-record.US8-TC4: An Awaiting Setup row carries no confirm-address helper

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-account-record-US-08

**Retirement:** The Awaiting Setup row of `g10.auction-account-record.US8-TC3`.

**Pre-conditions:**

* customer won a lot whose order reads Awaiting Setup.

**Steps:**

1. Read its row on My Auctions.

**Expected Results:**

* No confirm-address helper shows.

---

## g10.auction-account-record.US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won listings to read Setup Overdue or Payment Overdue in Status,
**so that** I can tell closed self-service from listings still inside their window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=2 -->
### g10.auction-account-record.US9-TC1: Overdue won listings read Setup Overdue or Payment Overdue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) won `<listing_6>`, whose `<deadline>` has passed.

**Test data:**

| `<deadline>` | `<status>` | `<never>` |
| --- | --- | --- |
| Setup deadline, 48 hours from close, setup incomplete | Won, Setup Overdue | Awaiting Setup |
| Payment deadline, 7 days from invoice send, unpaid | Won, Payment Overdue | Pending Payment |

**Steps:**

1. Open My Auctions and read `<listing_6>`'s row.

**Expected Results:**

* Status reads `<status>`, never `<never>`, with View order; listing, close and current bid read as on any Won row.

---

## g10.auction-account-record.US10: Bidder reads each listing's price and result on My Auctions

**As a** bidder,
**I want** each listing I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a listing sold for and whether I lost it without opening the listing.

<!-- trace:case id=g10.auction-account-record.TC-y6p rev=4 covers=g10.auction-account-record.SC-fao -->
### g10.auction-account-record.US10-TC3: An open row shows the auction's current price, not the collector's bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer B(signed in) bid USD1,000 on open `<listing_4>`; customer A has since raised its current bid to USD1,200.

**Steps:**

1. As customer B, open My Auctions and find `<listing_4>`.

**Expected Results:**

* Current bid reads USD1,200, not USD1,000; Status reads Outbid with the next valid bid.

<!-- trace:case id=g10.auction-account-record.TC-p3p rev=3 -->
### g10.auction-account-record.US10-TC2: A row shows no result before the close is recorded

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<listing_5>`, whose close has passed and is held back from being recorded.

**Steps:**

1. Open My Auctions and read `<listing_5>`'s Status.
2. Let the close be recorded and reload.

**Expected Results:**

* Step 1 reads Leading with no next valid bid, neither Won nor Didn't win.
* Step 2 reads Won.

<!-- trace:case id=g10.auction-account-record.TC-j99 rev=3 -->
### g10.auction-account-record.US10-TC1: Ended row shows the final price and the recorded result

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-account-record-US-10

**Retirement:** `g10.auction-dmn.US12-TC1` walks the final price with Won and Didn't win.

**Pre-conditions:**

* A lot both customers bid on has closed.

**Steps:**

1. Read its row on My Auctions as each customer.

**Expected Results:**

* Both read the final price, with Won or Didn't win.

<!-- trace:case id=g10.auction-account-record.TC-hgl rev=3 -->
### g10.auction-account-record.US10-TC4: Lone first bid confirming after the close reads Didn't win on an unsold lot

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-account-record-US-10

**Retirement:** No bid takes a card hold that could confirm after the close.

**Pre-conditions:**

* A first bid's confirmation is held past the close.

**Steps:**

1. Read the row on My Auctions.

**Expected Results:**

* Didn't win, on an unsold lot.

---

## Settled

- The Won-row control label, View order or Open order, is design copy; either opens Winner Order.
- My Auctions carries the mixed standing and order-state values in Status, Setup Overdue and Payment Overdue included.
- Contact for an expired payment is on Winner Order only.
- Didn't win says the card was not charged; no hold copy remains.
- Status on an open lot is Leading or Outbid; Bid submitted and Bid not accepted are gone, and a refused bid changes no row.

## Reconciliation

- **Covered at domain** - `g10.auction-dmn.US12-TC1` walks `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-18` and `grade10-site-auction-account-record-SC-19`: winner and losing bidder read one final price, Won and Didn't win, on My Auctions
