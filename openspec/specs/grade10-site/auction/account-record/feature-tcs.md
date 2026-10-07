# grade10-site/auction/account-record Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-account-record-US1: Mark a listing now and find it again later

**As a** collector,
**I want** to watch listings I am interested in before bidding opens,
**so that** I can find them again when it does without searching the catalogue a second time.

<!-- trace:case id=g10.auction-account-record.TC-3pj rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
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

* customer(signed in) is on `<lot_5 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_5 | A published lot whose bidding has not started, scheduled to open inside the test window |

**Steps:**

1. Click the Watch control.
2. Navigate to `<my auctions url>`.
3. Wait until `<lot_5>`'s bidding starts, then reload `<my auctions url>`.
4. Click `<lot_5>`'s row.

**Expected Results:**

* Step 2: `<lot_5>` shows once, Your Standing `--`.
* Step 3: `<lot_5>` is still listed.
* Step 4: `<lot_5 url>` opens, taking bids.

<!-- trace:case id=g10.auction-account-record.TC-s25 rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
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
| `<lot_a>` | Bid | Open, closes in 3 days |
| `<lot_b>` | Bid | Open, closes in 1 day |
| `<lot_c>` | Watch only | Open, closes in 2 days |
| `<lot_d>` | Watch only | Open, closes in 5 hours |
| `<lot_e>` | Watch only | Closed yesterday |

**Steps:**

1. Navigate to `<my auctions url>`.

**Expected Results:**

* The title count reads 5.
* Rows read, top down: `<lot_b>`, `<lot_a>`, `<lot_d>`, `<lot_c>`, `<lot_e>`.
* Each lot shows once.

<!-- trace:case id=g10.auction-account-record.TC-wtn rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
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

1. Navigate to `<my auctions url>`.
2. Click the catalogue offer.

**Expected Results:**

* Step 1: the page says nothing is bookmarked; no error shows.
* Step 2: the auction catalogue opens.

<!-- trace:case id=g10.auction-account-record.TC-5jj rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
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

* customer(signed in) watches `<lot_1>`.
* The My Auctions read is mocked to fail once, then succeed.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | An open lot taking bids, watched by this collector |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Click retry.

**Expected Results:**

* Step 1: the page says the read failed; it does not read as empty.
* Step 1: no catalogue offer shows.
* Step 2: `<lot_1>` is listed.

<!-- trace:case id=g10.auction-account-record.TC-2c9 rev=1 covers=g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-5we -->
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

1. Navigate to `<my auctions url>`.
2. Complete sign-in from the offer.

**Expected Results:**

* Step 1: sign-in is offered; no bookmarked lot shows.
* Step 2: the collector returns to My Auctions, showing their own lots.

---

## grade10-site-auction-account-record-US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

<!-- trace:case id=g10.auction-account-record.TC-gj0 rev=2 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
### grade10-site-auction-account-record-US2-TC1-2: Your Standing reads each open-lot state

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

* customer A(signed in) has bid on `<lot>`, in the state its row gives.

**Test data:**

| Lot state for customer A | Your Standing |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<lot>`'s row.

**Expected Results:**

* Your Standing reads the row's value.
* Current bid reads `<lot>`'s current bid.
* For Outbid, the next valid bid equals current bid plus its increment.

<!-- trace:case id=g10.auction-account-record.TC-oi7 rev=1 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
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

* customer A(signed in) leads `<lot_6>` and is on `<my auctions url>`.
* customer B(signed in, enrolled to bid) is on `<lot_6 url>` in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| lot_6 | An open lot taking bids, led by customer A with no maximum above the current bid |
| customer B bid | The next valid bid shown on customer B's bid panel |

**Steps:**

1. As customer B, place `<customer B bid>`.
2. As customer A, reload `<my auctions url>`.

**Expected Results:**

* `<lot_6>` reads Outbid, with the next valid bid.
* Current bid reads `<customer B bid>`.

<!-- trace:case id=g10.auction-account-record.TC-nv4 rev=1 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
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

* customer A(signed in) has bid on `<lot_6>` and is on `<my auctions url>`.
* The refresh of `<lot_6>`'s bid and close is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| lot_6 | An open lot taking bids, bid on by customer A |

**Steps:**

1. Wait for the next refresh of `<lot_6>`'s row.

**Expected Results:**

* `<lot_6>`'s current bid and close are shown as not current.

<!-- trace:case id=g10.auction-account-record.TC-w62 rev=1 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
### grade10-site-auction-account-record-US2-TC4-1: A refused raise leaves the row's Standing as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in) has bid on `<lot_7>`, in the state its row gives, and is on `<lot_7 url>`.

**Test data:**

| Lot state for customer A | Your Standing |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

| Field | Value |
| --- | --- |
| lot_7 | An open HKD lot taking bids |
| low raise | One minor unit below the next valid bid shown on customer A's bid panel |

**Steps:**

1. Place `<low raise>`.
2. Note `<lot_7>`'s current bid on its page.
3. Navigate to `<my auctions url>`.
4. Find `<lot_7>`'s row.

**Expected Results:**

* Step 1 shows the refusal on the bid panel.
* Your Standing reads the row's value.
* Current bid reads the bid noted at step 2, never `<low raise>`.

<!-- trace:case id=g10.auction-account-record.TC-na3 rev=1 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
### grade10-site-auction-account-record-US2-TC5-1: A refused first bid adds no row

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
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) has neither watched nor bid on `<lot_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_8 | An open HKD lot taking bids |
| low bid | One minor unit below the next valid bid shown on customer A's bid panel |

**Steps:**

1. Navigate to `<my auctions url>` and note the title count.
2. Navigate to `<lot_8 url>` and place `<low bid>`.
3. Navigate to `<my auctions url>`.
4. Open the Active, Upcoming and Ended tabs in turn.

**Expected Results:**

* Step 2 shows the refusal on the bid panel.
* No tab holds a row for `<lot_8>`.
* The title count equals the count noted at step 1.

<!-- trace:case id=g10.auction-account-record.TC-8mz rev=1 covers=g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
### grade10-site-auction-account-record-US2-TC6-1: An Outbid bidder's refused bid leaves their row Outbid and in place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer A(signed in, enrolled to bid) bid on `<lot_6>` and `<lot_7>`, and customer B has since outbid them on `<lot_6>`.
* customer A is on `<lot_6 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_6 | An open HKD lot led by customer B, closing after `<lot_7>` |
| lot_7 | An open HKD lot customer A bid on, closing before `<lot_6>` |
| current bid | 530000 minor units (HK$5,300) |
| increment | 8000 minor units (HK$80), the HK$4,000 tier |
| next minimum | `<current bid>` plus `<increment>`, 538000 minor units (HK$5,380) |
| refused bid | HK$5,300, equal to `<current bid>`, below `<next minimum>` |

**Steps:**

1. Type `<refused bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Navigate to `<my auctions url>`.
4. Find `<lot_6>`'s row in the Active tab.

**Expected Results:**

* Step 2: the bid form says Minimum bid is `<next minimum>`.
* Step 4: Your Standing reads Outbid, with the next valid bid `<next minimum>`.
* Current bid reads `<current bid>`.
* `<lot_6>` still sits below `<lot_7>`, as before step 1.
* No row reads Bid submitted or Bid not accepted.

---

## grade10-site-auction-account-record-US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the lot shipped.

<!-- trace:case id=g10.auction-account-record.TC-hj7 rev=1 covers=g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb -->
### grade10-site-auction-account-record-US3-TC2-1: A Won row follows the proof check's outcome

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(signed in) won `<lot>`, whose proof was under check.
* An operator then took the row's action.

**Test data:**

| Operator action | Your Standing |
| --- | --- |
| Returned the proof | Won, Pending Payment |
| Confirmed the payment | Won, Processing |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot>`'s row.

**Expected Results:**

* Your Standing reads the row's value.

<!-- trace:case id=g10.auction-account-record.TC-wt4 rev=1 covers=g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb -->
### grade10-site-auction-account-record-US3-TC4-1: Another collector never sees a Payment Verifying row

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
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer A won `<lot_12>`, which reads Payment Verifying.
* customer B(signed in) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| lot_12 | customer A's won lot, proof under check |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.

**Expected Results:**

* No `<lot_12>` row shows.

<!-- trace:case id=g10.auction-account-record.TC-83f rev=1 covers=g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb -->
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

* customer(signed in) won `<lot>`, whose order is in the row's state.

**Test data:**

| Order state | Your Standing |
| --- | --- |
| Delivery not yet set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<lot>`'s row.

**Expected Results:**

* Your Standing reads the row's value.
* The row offers View order.

<!-- trace:case id=g10.auction-account-record.TC-lvl rev=1 covers=g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb -->
### grade10-site-auction-account-record-US3-TC20-1: Paid undispatched Won row reads Preparing Shipment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner) is on My Auctions with `<won_preparing_shipment>`.

**Test data:**

| Field | Value |
| --- | --- |
| won_preparing_shipment | A won listing with invoice `paid` and fulfilment `unfulfilled` |

**Steps:**

1. Read Status on that row.

**Expected result:**

* Status reads Preparing Shipment.
* Status badge uses `default`.

### grade10-site-auction-account-record-US3-TC23-1: Shipped Won row keeps the default badge

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Pre-conditions:**

* customer(winner) is on My Auctions with `<won_shipped>`.

**Test data:**

| Field | Value |
| --- | --- |
| won_shipped | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |

**Steps:**

1. Read Status on that row.

**Expected result:**

* Status reads Shipped.
* Status badge uses `default`.

---

## grade10-site-auction-account-record-US4: Know I was not charged when I lose

**As a** losing bidder,
**I want** to see that my card was not charged,
**so that** I know I owe nothing for a listing I did not win.

<!-- trace:case id=g10.auction-account-record.TC-rfz rev=2 covers=g10.auction-account-record.SC-n9l,g10.auction-account-record.SC-2e8 -->
### grade10-site-auction-account-record-US4-TC1-2: Didn't win says the card was not charged

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

* customer A(signed in) bid on `<lot>`, which ended as its row gives.

**Test data:**

| How `<lot>` ended | Your Standing |
| --- | --- |
| Closed with customer B winning | Didn't win |
| Called off by Grade10 | Didn't win |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the Ended tab and find `<lot>`'s row.

**Expected Results:**

* Your Standing reads the row's value.
* The row says the card was not charged.
* No amount is shown as charged.

---

## grade10-site-auction-account-record-US5: Watch from the auction with alerts toast

**As a** collector,
**I want** watching a lot from its page to put it on My Auctions and tell me alerts are on,
**so that** I can open My Auctions from the toast when I want to manage it.

<!-- trace:case id=g10.auction-account-record.TC-7pb rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-ewb -->
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

* customer(signed in, not watching `<lot_1>`, no bid on `<lot_1>`) is on `<lot_1 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Click the Watch control.
2. Click View My Auctions in the toast.
3. Find the `<lot_1>` row.

**Expected Results:**

* Step 1: a toast says email alerts are on, with View My Auctions.
* Step 2: My Auctions opens; the title count includes `<lot_1>`.
* Step 3: `<lot_1>` shows once, with key image, title and close.
* Step 3: Your Standing reads `--`.
* Step 3: Email alerts switch is on; Unwatch is offered.

<!-- trace:case id=g10.auction-account-record.TC-tzp rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-ewb -->
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

* customer(signed in, not watching `<lot_1>`, no bid on `<lot_1>`) is on `<grade10 auction catalogue url>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | An open lot taking bids, not watched and not bid on by this collector |

**Steps:**

1. Click the watch control on `<lot_1>`'s card, bottom right of the image.
2. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 1: the card's control reads Watching.
* Step 2: `<lot_1>` shows once, Your Standing `--`, email alerts on.

<!-- trace:case id=g10.auction-account-record.TC-sse rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-ewb -->
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

* customer A(signed in) watches `<lot_1>`.
* customer B(signed in, never watched or bid on `<lot_1>`) uses a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | An open lot taking bids, watched by customer A only |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.
2. As customer B, navigate to `<lot_1 url>`.
3. As customer B, open the page source of `<lot_1 url>`.

**Expected Results:**

* Step 1: `<lot_1>` is not listed.
* Step 2: the control reads Watch; no watch count shows.
* Step 3: no watch count and no watcher's identity appear.

---

## grade10-site-auction-account-record-US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a lot to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

<!-- trace:case id=g10.auction-account-record.TC-l63 rev=1 covers=g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu -->
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

* customer(signed in, enrolled to bid, not watching `<lot_2>`, no bid on `<lot_2>`) is on `<lot_2 url>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_2 | An open lot taking bids, with no bid from this collector and no other bidder |
| first bid | The next valid bid shown on the bid panel |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Reload `<lot_2 url>`.
3. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 1: one toast says email alerts are on.
* Step 2: no alerts toast shows.
* Step 3: `<lot_2>` shows once, Your Standing Leading.
* Step 3: Email alerts switch is on; no Unwatch is offered.

<!-- trace:case id=g10.auction-account-record.TC-9rb rev=1 covers=g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu -->
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

* customer(signed in, enrolled to bid, watching `<lot_3>`, no bid on `<lot_3>`) is on `<lot_3 url>`.
* The collector also watches `<lot_4>` without bidding.

**Test data:**

| Field | Value |
| --- | --- |
| lot_3 | An open lot taking bids, watched by this collector, closing after `<lot_4>` |
| lot_4 | An open lot taking bids, watch-only for this collector, closing before `<lot_3>` |
| first bid | The next valid bid shown on `<lot_3>`'s bid panel |

**Steps:**

1. Place `<first bid>` from the bid panel.
2. Navigate to `<my auctions url>`.

**Expected Results:**

* `<lot_3>` shows once, Your Standing Leading, no Unwatch.
* `<lot_3>` sits above `<lot_4>`: bid rows before watch-only.

<!-- trace:case id=g10.auction-account-record.TC-43z rev=1 covers=g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu -->
### grade10-site-auction-account-record-US6-TC3-1: A refused first bid puts nothing on My Auctions

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-06

**Pre-conditions:**

* customer(signed in, enrolled to bid, not watching `<lot_5>`, no bid on `<lot_5>`) is on `<lot_5 url>`.
* The account is in the row's state.
* The title count on `<my auctions url>` is noted.

**Test data:**

| Account state | `<typed bid>` | The bid form says |
| --- | --- | --- |
| Bidding allowed | HK$100, below `<opening price>` | Minimum bid is `<opening price>` |
| Bidding suspended by an operator | HK$200, `<opening price>` | Bidding is suspended on this account. Contact Us to resolve it. |

| Field | Value |
| --- | --- |
| lot_5 | An open HKD lot with no bid from anyone |
| opening price | 20000 minor units (HK$200), the starting price |

**Steps:**

1. Type `<typed bid>` into the custom maximum on the bid panel.
2. Confirm the bid.
3. Reload `<lot_5 url>`.
4. Navigate to `<my auctions url>`.

**Expected Results:**

* Step 2: the bid form says the row's words, and no alerts toast shows.
* Step 3: the watch control offers Watch, not locked to watching.
* Step 4: `<lot_5>` is not listed in any tab.
* Step 4: the title count is the one noted.

---

## grade10-site-auction-account-record-US7: Collector reads My Auctions by bidding window

**As a** collector
**I want** my lots split into Active, Upcoming and Ended tabs
**so that** I see what needs me now without scrolling past closed and unopened lots.

<!-- trace:case id=g10.auction-account-record.TC-91p rev=1 covers=g10.auction-account-record.SC-11c,g10.auction-account-record.SC-slt,g10.auction-account-record.SC-evx,g10.auction-account-record.SC-vlf,g10.auction-account-record.SC-doc,g10.auction-account-record.SC-r26,g10.auction-account-record.SC-we1 -->
### grade10-site-auction-account-record-US7-TC1-1: Each listing sits in the tab its bidding window names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches `<listing_1>`, `<listing_2>` and `<listing_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A published listing whose bidding has not opened |
| listing_2 | A published listing whose bidding is open |
| listing_3 | A published listing that has closed |

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Open the Upcoming tab.
3. Open the Ended tab.

**Expected Results:**

* Step 1 shows the Active tab, listing only `<listing_2>`.
* Title badge shows 3.
* Step 2 lists only `<listing_1>`; step 3 lists only `<listing_3>`.

<!-- trace:case id=g10.auction-account-record.TC-z0b rev=1 covers=g10.auction-account-record.SC-11c,g10.auction-account-record.SC-slt,g10.auction-account-record.SC-evx,g10.auction-account-record.SC-vlf,g10.auction-account-record.SC-doc,g10.auction-account-record.SC-r26,g10.auction-account-record.SC-we1 -->
### grade10-site-auction-account-record-US7-TC2-1: A listing moves to Active when its window opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches `<listing_1>`, a listing whose bidding has not opened.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Wait until `<listing_1>` bidding opens.
3. Reload `<grade10 my auctions url>`.

**Expected Results:**

* `<listing_1>` is listed in the Active tab.
* `<listing_1>` is not listed in the Upcoming tab.

<!-- trace:case id=g10.auction-account-record.TC-tbh rev=1 covers=g10.auction-account-record.SC-11c,g10.auction-account-record.SC-slt,g10.auction-account-record.SC-evx,g10.auction-account-record.SC-vlf,g10.auction-account-record.SC-doc,g10.auction-account-record.SC-r26,g10.auction-account-record.SC-we1 -->
### grade10-site-auction-account-record-US7-TC3-1: An empty tab says it has no lots

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches only open listings.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Open the Upcoming tab.

**Expected Results:**

* The Upcoming tab shows its no-lots empty state.

<!-- trace:case id=g10.auction-account-record.TC-tzc rev=1 covers=g10.auction-account-record.SC-11c,g10.auction-account-record.SC-slt,g10.auction-account-record.SC-evx,g10.auction-account-record.SC-vlf,g10.auction-account-record.SC-doc,g10.auction-account-record.SC-r26,g10.auction-account-record.SC-we1 -->
### grade10-site-auction-account-record-US7-TC4-1: Email alerts cannot be changed on an Ended row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(signed in) watches `<listing_3>`, a published listing that has closed.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Open the Ended tab.
3. Click the Email alerts control on `<listing_3>`.

**Expected Results:**

* The Email alerts control is disabled.
* The alert setting for `<listing_3>` is unchanged.

<!-- trace:case id=g10.auction-account-record.TC-6xk rev=1 covers=g10.auction-account-record.SC-11c,g10.auction-account-record.SC-slt,g10.auction-account-record.SC-evx,g10.auction-account-record.SC-vlf,g10.auction-account-record.SC-doc,g10.auction-account-record.SC-r26,g10.auction-account-record.SC-we1 -->
### grade10-site-auction-account-record-US7-TC5-1: A Won row opens its auction order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Pre-conditions:**

* customer(winner) has a Won row whose auction order is available.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Select the order entry point on the Won row.

**Expected Results:**

* The matching auction order opens.
* My Auctions performs no payment, address, or order-status write.

---

## grade10-site-auction-account-record-US8: Winner revisits a partially paid order

**As a** winner with an order being collected in parts,
**I want** My Auctions to keep the Won row linked to the order,
**so that** I can return to the locked payment record.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=1 covers=g10.auction-account-record.SC-chv -->
### grade10-site-auction-account-record-US8-TC1-1: A partially paid Won row opens Winner Order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* customer owns a Won lot whose order is Partially Paid.

**Steps:**

1. Open My Auctions and read the Won row.
2. Select View order.

**Expected Results:**

* The row status is Partially Paid with its warning treatment.
* View order opens the Partially Paid Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=2 covers=g10.auction-account-record.SC-chv -->
### grade10-site-auction-account-record-US8-TC2-2: A Didn't win row offers no View order

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

* customer A(signed in) bid on `<lot_9>`, which closed with customer B winning.

**Test data:**

| Field | Value |
| --- | --- |
| lot_9 | A closed lot won by customer B |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot_9>`'s row.

**Expected Results:**

* Your Standing reads Didn't win, and the row says the card was not charged.
* No View order is offered.

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=1 covers=g10.auction-account-record.SC-chv -->
### grade10-site-auction-account-record-US8-TC3-1: A Payment Overdue row carries no contact helper

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

* customer(signed in) won `<lot_10>`, whose invoice passed its payment deadline unpaid.

**Test data:**

| Field | Value |
| --- | --- |
| lot_10 | A won lot whose order reads Payment Overdue |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot_10>`'s row.

**Expected Results:**

* Your Standing reads Won, Payment Overdue.
* View order is offered.
* No helper line and no way to reach Grade10 shows on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=1 covers=g10.auction-account-record.SC-chv -->
### grade10-site-auction-account-record-US8-TC4-1: An Awaiting Setup row carries no confirm-address helper

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

* customer(signed in) won `<lot_11>`, whose setup is incomplete inside the setup window.

**Test data:**

| Field | Value |
| --- | --- |
| lot_11 | A won lot whose order reads Awaiting Setup |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot_11>`'s row.

**Expected Results:**

* Your Standing reads Won, Awaiting Setup, with View order.
* No confirm-address helper line shows on the row.

---

## grade10-site-auction-account-record-US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won lots to read Setup Overdue or Payment Overdue in Status,
**so that** I can tell closed self-service from lots still inside their window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=1 covers=g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US9-TC1-1: Overdue won lots read Setup Overdue or Payment Overdue

Runs once per row of **Test data**.

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

* customer(signed in) won `<lot>`, in the row's state.

**Test data:**

| Order state | Your Standing | Not |
| --- | --- | --- |
| Setup deadline (48 hours from close) passed, setup incomplete | Won, Setup Overdue | Awaiting Setup |
| Payment deadline (7 days from invoice send) passed, unpaid | Won, Payment Overdue | Pending Payment |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot>`'s row.

**Expected Results:**

* Your Standing reads the row's value, never the Not column.
* The row offers View order.
* Lot, close and current bid read as on any Won row.

---

## grade10-site-auction-account-record-US10: Bidder reads each lot's price and result on My Auctions

**As a** bidder,
**I want** each lot I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a lot sold for and whether I lost it without opening the lot.

<!-- trace:case id=g10.auction-account-record.TC-j99 rev=1 covers=g10.auction-account-record.SC-b5w,g10.auction-account-record.SC-fkr,g10.auction-account-record.SC-fao,g10.auction-account-record.SC-abi -->
### grade10-site-auction-account-record-US10-TC1-1: Ended row shows the final price and the recorded result

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* `<lot_1>` closed, its close recorded, customer A winning at `<final price>`.
* customer B's last bid on `<lot_1>` was `<customer B bid>`.
* `<viewer>` is signed in.

**Test data:**

| `<viewer>` | `<own last bid>` | `<standing>` |
| --- | --- | --- |
| customer A | `<customer A maximum>` | Won |
| customer B | `<customer B bid>` | Didn't win |

| Field | Value |
| --- | --- |
| `<lot_1>` | A closed HKD lot both customers bid on |
| `<final price>` | 513000 minor units, `<customer B bid>` plus its 8000 increment |
| `<customer A maximum>` | 800000 minor units, above `<final price>` |
| `<customer B bid>` | 505000 minor units, customer B's maximum, below `<final price>` |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Select the Ended tab.
3. Find `<lot_1>`'s row.

**Expected Results:**

* Current bid reads `<final price>`, not `<own last bid>`.
* Your Standing reads `<standing>`.

<!-- trace:case id=g10.auction-account-record.TC-p3p rev=1 covers=g10.auction-account-record.SC-b5w,g10.auction-account-record.SC-fkr,g10.auction-account-record.SC-fao,g10.auction-account-record.SC-abi -->
### grade10-site-auction-account-record-US10-TC2-1: Row shows no result before the close is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer A(signed in) leads `<lot_2>`.
* `<lot_2>`'s close has passed, and recording it is held back.

**Test data:**

| Field | Value |
| --- | --- |
| lot_2 | An HKD lot led by customer A, its close passed and not yet recorded |

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Find `<lot_2>`'s row and read its tab and Your Standing.
3. Let recording the close resume.
4. Reload `<grade10 my auctions url>`.
5. Find `<lot_2>`'s row and read Your Standing.

**Expected Results:**

* At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win.
* At step 5 the row is in the Ended tab and Your Standing reads Won.

<!-- trace:case id=g10.auction-account-record.TC-y6p rev=1 covers=g10.auction-account-record.SC-b5w,g10.auction-account-record.SC-fkr,g10.auction-account-record.SC-fao,g10.auction-account-record.SC-abi -->
### grade10-site-auction-account-record-US10-TC3-1: Open row shows the auction's current price, not the collector's bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer B(signed in) bid `<customer B bid>` on `<lot_3>`.
* customer A has since raised `<lot_3>`'s current bid to `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_3 | An open HKD lot, its close more than an hour away |
| customer B bid | 100000 minor units |
| current bid | 120000 minor units, above `<customer B bid>` |

**Steps:**

1. As customer B, navigate to `<grade10 my auctions url>`.
2. Find `<lot_3>`'s row in the Active tab.

**Expected Results:**

* Current bid reads `<current bid>`, not `<customer B bid>`.
* Your Standing reads Outbid, with the next valid bid.

<!-- trace:case id=g10.auction-account-record.TC-hgl rev=1 covers=g10.auction-account-record.SC-b5w,g10.auction-account-record.SC-fkr,g10.auction-account-record.SC-fao,g10.auction-account-record.SC-abi -->
### grade10-site-auction-account-record-US10-TC4-1: Lone first bid confirming after the close reads Didn't win on an unsold lot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* Bid-time card holds are on.
* `<lot_4>` has no bid, and its scheduled close is under a minute away.
* customer B(signed in) placed `<first bid>` on `<lot_4>`, and its payment confirmation is held back.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | An HKD lot with a starting price of 20000 minor units and no bid |
| `<first bid>` | 20000 minor units, the opening price |

**Steps:**

1. Wait until `<lot_4>`'s scheduled close has passed and its close is recorded.
2. Let the payment confirmation resume.
3. Navigate to `<my auctions url>`.
4. Select the Ended tab and find `<lot_4>`'s row.

**Expected Results:**

* The row is in the Ended tab, and Your Standing reads Didn't win.
* The row says the card hold is releasing or released, never charged.
* Current bid reads as on any unsold lot's row, not `<first bid>`.

---

## Settled

- `grade10-site-auction-account-record-US3-TC1` and `grade10-site-auction-account-record-US3-TC3` are held by `grade10-site-auction-account-record-US3-TC5`, whose rows read each won status.
- The Won-row control label (View order or Open order) is design copy; either reads as the entry to Winner Order.
- My Auctions carries the mixed standing and order-state values in Status, including Setup Overdue and Payment Overdue.
- Contact for expired payment is Winner Order only (author @tangconst).
- Didn't win says the card was not charged; no hold copy remains.
- Your Standing on an open lot is Leading or Outbid; Bid submitted and Bid not accepted are gone, and a refused bid changes no row.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The Won row remains linked while collection is partial | **Folded in:** `grade10-site-auction-account-record-SC-62` |

**Run:** QA2 rerun, 2026-10-01. QA1's blind pass read the frozen Purpose and Feature set, the change's journeys, `proposal.md`, `decisions.md` with its `## Raised`, the linked pages under `docs/prds/`, `openspec/config.yaml`'s context, the durable suite and the change's domain draft with their `## Reconciliation` stripped; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both readings, the delta, `tech-design.md`, `tasks.md`, and the built My Auctions row mapping in grade10 for reference. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Ended row shows the final price, not the viewer's own bid, with Won or Didn't win (`grade10-site-auction-account-record-US10-TC1-1`, deprecated by QA1 for the domain walk) | **Rejected:** a second walk of the domain case below |
| Before the close is recorded the row reads no result; after it, Won (`grade10-site-auction-account-record-US10-TC2-1`) | **Folded in:** `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-67` |
| QA1 raised: which tab holds the row between the effective and the recorded close, and what Your Standing reads | **Settled by the artifacts:** the open-standing requirement and `grade10-site-auction-account-record-SC-65` - Active tab, the open Status kept, no minimum next valid bid, never Ending soon. TC2-1 patched to assert it; `<v>` kept, the case still draft |
| Open row shows the auction's current price, not the collector's bid (`grade10-site-auction-account-record-US10-TC3-1`) | **Folded in:** `grade10-site-auction-account-record-SC-64` |
| QA1 raised: a lone first bid confirming after the scheduled close - the row's standing | **Settled by the artifacts:** after the close the row reads exactly Won or Didn't win from the recorded result; nobody won, so Didn't win. New case `grade10-site-auction-account-record-US10-TC4-1`, since deprecated: no bid takes a hold to confirm after the close |
| QA1 raised: the same row's Current bid on a lot that closed unsold | **Settled:** Q32 - the row reads as any unsold lot's row, with no new copy; `grade10-site-auction-account-record-US10-TC4-1` asserted it and is deprecated |
| Outbid row past the effective close, before the close is recorded | **Rejected as a scenario:** the requirement already states it (open Status kept, no minimum next valid bid); no blind case asserts it apart from Leading |
| Open-window statuses Leading and Outbid, and Won or Didn't win after the close | **Out of suite:** they serve the context journey `grade10-site-auction-account-record-US-02`; the durable suite's `grade10-site-auction-account-record-US2-TC1-2`, `grade10-site-auction-account-record-US2-TC2-1` and `grade10-site-auction-account-record-US4-TC1-2` assert them |

- **Covered at domain** - `grade10-site-auction-e2e-US12-TC01-1` walks `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-18` and `grade10-site-auction-account-record-SC-19`: winner and losing bidder read one final price, Won and Didn't win, on My Auctions

**Uncovered anchors:** none. `grade10-site-auction-account-record-US-10` has TC2-1, TC3-1 and TC4-1, and the domain case for the final price on both rows.

| Finding | Disposition |
| --- | --- |
| Didn't win names a hold being released or released (`grade10-site-auction-account-record-US4-TC1-1`, `grade10-site-auction-account-record-US8-TC2-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US4-TC1-2` and `grade10-site-auction-account-record-US8-TC2-2` (Q1) |
| Bid submitted and Bid not accepted rows (`grade10-site-auction-account-record-US2-TC1-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US2-TC1-2`, Leading and Outbid only (Q2) |
| A leader whose raise is refused fits Leading and Bid not accepted | **Folded in:** case `grade10-site-auction-account-record-US2-TC4-1` (Q3) |
| A refused first bid on a lot never watched | **Folded in:** case `grade10-site-auction-account-record-US2-TC5-1` (Q2) |
| Lone first bid confirming after the close (`grade10-site-auction-account-record-US10-TC4-1`) | **Deprecated:** no bid takes a hold to confirm after the close |
| Hold copy retained for Didn’t win | **Superseded:** the row says the card was not charged; no hold copy remains |

**Run:** 2026-10-02, from the delta against the durable suite and the built My Auctions mapping in grade10 (`packages/grade10-auction/backend/src/services/accountRecord.ts`, `apps/frontend/grade10/src/pages/auctions/AccountAuctionRecordPage.tsx`) and its walk (`apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`). It is a statement, not proof.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded into main** - QA1 wrote against the durable suite before `my-auctions-without-bid-holds` was accepted, and main now holds those rewrites: `grade10-site-auction-account-record-US2-TC1-1` is main's `grade10-site-auction-account-record-US2-TC1-2`, `grade10-site-auction-account-record-US4-TC1-1` is main's `grade10-site-auction-account-record-US4-TC1-2`, `grade10-site-auction-account-record-US8-TC2-1` is main's `grade10-site-auction-account-record-US8-TC2-2`, and `grade10-site-auction-account-record-US10-TC4-1` is already deprecated on main. All four are dropped from this suite
- **Joined** - QA1's leader case, a raise equal to the leader's own maximum, was written as `grade10-site-auction-account-record-US2-TC5-1`, an id main issued for a refused first bid. It joins main's `grade10-site-auction-account-record-US2-TC4-1`, whose Leading row reads the same Standing and price; the bid form's words for a maximum not raised are the domain case `grade10-site-auction-e2e-US04-TC03-2`'s
- **Renumbered** - QA1's Outbid case was written as `grade10-site-auction-account-record-US2-TC4-1`, an id main issued for a refused raise. It is `grade10-site-auction-account-record-US2-TC6-1`: main's case reads the Outbid row's Standing and price, and this one adds that the row keeps its place
- **Folded in** - `grade10-site-auction-account-record-SC-71` by `grade10-site-auction-account-record-US2-TC6-1` and main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-auction-SC-90`, the row in the same place, by `grade10-site-auction-account-record-US2-TC6-1`, recorded in the auction suite too; `grade10-site-auction-account-record-SC-70` and `grade10-site-auction-auction-SC-89` by `grade10-site-auction-account-record-US6-TC3-1`, which adds that a refused first bid sets no watch and shows no alerts toast
- **Corrected** - the cases traced the Feature set group The Bidding page; they trace their sections' journeys, `grade10-site-auction-account-record-US-02` and `grade10-site-auction-account-record-US-06`
- **Raised** - none from this suite; Q15, a lost answer on a first bid showing no alerts toast, reaches `grade10-site-auction-account-record-US-06` and is recorded in the auction suite
- **Contradicted** - none
- **Uncovered anchors** - none. `grade10-site-auction-account-record-SC-14`, `grade10-site-auction-account-record-SC-15`, `grade10-site-auction-account-record-SC-64` and `grade10-site-auction-account-record-SC-65` stand by main's cases; `grade10-site-auction-account-record-SC-69` by main's `grade10-site-auction-account-record-US2-TC4-1`; `grade10-site-auction-account-record-SC-70` by main's `grade10-site-auction-account-record-US2-TC5-1` and `grade10-site-auction-account-record-US6-TC3-1`; the Feature set's card-not-charged leaf by main's `grade10-site-auction-account-record-US4-TC1-2`
