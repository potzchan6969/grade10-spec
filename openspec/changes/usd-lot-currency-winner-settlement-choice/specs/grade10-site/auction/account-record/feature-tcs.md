# grade10-site/auction/account-record Test Cases

**Status:** pending-review · 0/33
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Reach My Auctions and read bidding rows — phase 1

**Starting state:**

- customer(signed in) is on `<lot_5 url>`.
- customer(signed in) has bookmarked every lot in `<lot_a>`, `<lot_b>`, `<lot_c>`, `<lot_d>`, `<lot_e>`, and nothing else.
- customer(signed in, has never watched or bid on a lot).
- customer(signed in) watches `<lot_1>`.
- The My Auctions read is mocked to fail once, then succeed.
- customer(signed out) has watched lots under their account.
- customer A(signed in) has bid on `<lot>`, in the state its row gives.
- customer A(signed in) leads `<lot_6>` and is on `<my auctions url>`.
- customer B(signed in, enrolled to bid) is on `<lot_6 url>` in a separate session.
- customer A(signed in) has bid on `<lot_6>` and is on `<my auctions url>`.
- The refresh of `<lot_6>`'s bid and close is mocked to fail.
- Open `<lot_6>`'s listing page and wait for it to close.
- customer A(signed in) has bid on `<lot_7>`, in the state its row gives, and is on `<lot_7 url>`.
- customer A(signed in, enrolled to bid) has neither watched nor bid on `<lot_8>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| lot_5 | A published lot whose bidding has not started, scheduled to open inside the test window |
| Item | Lot: `<lot_a>`; Bookmark: Bid; Close: Open, closes in 3 days |
| Item | Lot: `<lot_b>`; Bookmark: Bid; Close: Open, closes in 1 day |
| Item | Lot: `<lot_c>`; Bookmark: Watch only; Close: Open, closes in 2 days |
| Item | Lot: `<lot_d>`; Bookmark: Watch only; Close: Open, closes in 5 hours |
| Item | Lot: `<lot_e>`; Bookmark: Watch only; Close: Closed yesterday |
| lot_1 | An open lot taking bids, watched by this collector |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |
| lot_6 | An open lot taking bids, led by customer A with no maximum above the current bid |
| customer B bid | The next valid bid shown on customer B's bid panel |
| lot_6 | An open lot taking bids, bid on by customer A |
| Field | Value |
| lot_7 | An open USD lot taking bids |
| low raise | One minor unit below the next valid bid shown on customer A's bid panel |
| lot_8 | An open USD lot taking bids |
| low bid | One minor unit below the next valid bid shown on customer A's bid panel |

### Route

1. Click the Watch control.
2. Navigate to `<my auctions url>`.
   - `<lot_5>` shows once, Your Standing `--`. g10.auction-account-record.US1-TC1
3. Wait until `<lot_5>`'s bidding starts, then reload `<my auctions url>`.
   - `<lot_5>` is still listed. g10.auction-account-record.US1-TC1
4. Click `<lot_5>`'s row.
   - `<lot_5 url>` opens, taking bids. g10.auction-account-record.US1-TC1
5. Navigate to `<my auctions url>`.
   - The title count reads 5. g10.auction-account-record.US1-TC2
   - Rows read, top down: `<lot_b>`, `<lot_a>`, `<lot_d>`, `<lot_c>`, `<lot_e>`. g10.auction-account-record.US1-TC2
   - Each lot shows once. g10.auction-account-record.US1-TC2
6. Navigate to `<my auctions url>`.
   - the page says nothing is bookmarked; no error shows. g10.auction-account-record.US1-TC3
7. Click the catalogue offer.
   - the auction catalogue opens. g10.auction-account-record.US1-TC3
8. Navigate to `<my auctions url>`.
   - the page says the read failed; it does not read as empty. g10.auction-account-record.US1-TC4
   - no catalogue offer shows. g10.auction-account-record.US1-TC4
9. Click retry.
   - `<lot_1>` is listed. g10.auction-account-record.US1-TC4
10. Navigate to `<my auctions url>`.
   - sign-in is offered; no bookmarked lot shows. g10.auction-account-record.US1-TC5
11. Complete sign-in from the offer.
   - the collector returns to My Auctions, showing their own lots. g10.auction-account-record.US1-TC5
12. Navigate to `<my auctions url>`.
13. Find `<lot>`'s row.
   - Your Standing reads the row's value. g10.auction-account-record.US2-TC1
   - Current bid reads `<lot>`'s current bid. g10.auction-account-record.US2-TC1
   - For Outbid, the next valid bid equals current bid plus its increment. g10.auction-account-record.US2-TC1
14. As customer B, place `<customer B bid>`.
   - `<lot_6>` reads Outbid, with the next valid bid. g10.auction-account-record.US2-TC2
15. As customer A, reload `<my auctions url>`.
   - Current bid reads `<customer B bid>`. g10.auction-account-record.US2-TC2
16. Wait for the next refresh of `<lot_6>`'s row.
   - `<lot_6>`'s current bid and close are shown as not current. g10.auction-account-record.US2-TC3
17. Place `<low raise>`.
   - shows the refusal on the bid panel. g10.auction-account-record.US2-TC4
18. Note `<lot_7>`'s current bid on its page.
19. Navigate to `<my auctions url>`.
20. Find `<lot_7>`'s row.
   - Your Standing reads the row's value. g10.auction-account-record.US2-TC4
   - Current bid reads the bid noted at step 2, never `<low raise>`. g10.auction-account-record.US2-TC4
21. Navigate to `<my auctions url>` and note the title count.
22. Navigate to `<lot_8 url>` and place `<low bid>`.
   - shows the refusal on the bid panel. g10.auction-account-record.US2-TC5
23. Navigate to `<my auctions url>`.
24. Open the Active, Upcoming and Ended tabs in turn.
   - No tab holds a row for `<lot_8>`. g10.auction-account-record.US2-TC5
   - The title count equals the count noted at step 1. g10.auction-account-record.US2-TC5
25. Type `<refused bid>` into the custom maximum on the bid panel.

## Walk 2: Reach My Auctions and read bidding rows and adjacent checks

**Starting state:**

- customer A(signed in, enrolled to bid) bid on `<lot_6>` and `<lot_7>`, and customer B has since outbid them on `<lot_6>`.
- customer A is on `<lot_6 url>`.
- customer(signed in) won `<lot>`, whose proof was under check.
- An operator then took the row's action.
- customer A won `<lot_12>`, which reads Payment Verifying.
- customer B(signed in) uses a separate session.
- customer(signed in) won `<lot>`, whose order is in the row's state.
- customer(winner) is on My Auctions with both rows from `<won_preparing_shipment>`, `<won_shipped>`.
- customer A(signed in) bid on `<lot>`, which ended as its row gives.

**Shared test data:**

| Item | Value |
| --- | --- |
| lot_6 | An open USD lot led by customer B, closing after `<lot_7>` |
| lot_7 | An open USD lot customer A bid on, closing before `<lot_6>` |
| current bid | US$5,460 (range: 400000–799999 minor units) |
| increment | US$80 (fixed tier increment), the US$4,000 tier |
| next minimum | `<current bid>` plus `<increment>`, US$5,540 (fixed derived value) |
| refused bid | US$5,460, equal to `<current bid>`, below `<next minimum>` |
| Returned the proof | Won, Pending Payment |
| Confirmed the payment | Won, Processing |
| lot_12 | customer A's won lot, proof under check |
| Delivery not yet set up, inside the setup window | Won, Awaiting Setup |
| Set up, invoice not yet issued | Won, Preparing Invoice |
| Invoice issued, unpaid, inside the payment window | Won, Pending Payment |
| Payment proof waiting for an operator | Won, Payment Verifying |
| Collected in parts, balance outstanding | Won, Partially Paid |
| Row | State |
| `<won_preparing_shipment>` | A won listing with invoice `paid` and fulfilment `unfulfilled` |
| `<won_shipped>` | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |
| Closed with customer B winning | Didn't win |
| Called off by Grade10 | Didn't win |

### Route

1. Confirm the bid.
   - the bid form says Minimum bid is `<next minimum>`. g10.auction-account-record.US2-TC6
2. Navigate to `<my auctions url>`.
3. Find `<lot_6>`'s row in the Active tab.
   - Your Standing reads Outbid, with the next valid bid `<next minimum>`. g10.auction-account-record.US2-TC6
   - Current bid reads `<current bid>`. g10.auction-account-record.US2-TC6
   - `<lot_6>` still sits below `<lot_7>`, as before step 1. g10.auction-account-record.US2-TC6
   - No row reads Bid submitted or Bid not accepted. g10.auction-account-record.US2-TC6
4. Navigate to `<my auctions url>`.
5. Read `<lot>`'s row.
   - Your Standing reads the row's value. g10.auction-account-record.US3-TC2
6. As customer B, navigate to `<my auctions url>`.
   - No `<lot_12>` row shows. g10.auction-account-record.US3-TC4
7. Navigate to `<my auctions url>`.
   - Your Standing reads the row's value. g10.auction-account-record.US3-TC5
8. Find `<lot>`'s row.
   - The row offers View order. g10.auction-account-record.US3-TC5
9. Read Status on each row.
   - `<won_preparing_shipment>` reads Preparing Shipment with the `default` status badge. g10.auction-account-record.US3-TC20
   - `<won_shipped>` reads Shipped with the `default` status badge. g10.auction-account-record.US3-TC20
10. Navigate to `<my auctions url>`.
11. Select the Ended tab and find `<lot>`'s row.
   - Your Standing reads the row's value. g10.auction-account-record.US4-TC1
   - The row says the card was not charged. g10.auction-account-record.US4-TC1
   - No amount is shown as charged. g10.auction-account-record.US4-TC1

## Walk 3: Watch and bid from auction surfaces

**Starting state:**

- customer(signed in, not watching `<lot_1>`, no bid on `<lot_1>`) is on `<lot_1 url>`.
- customer(signed in, not watching `<lot_1>`, no bid on `<lot_1>`) is on `<grade10 auction catalogue url>`.
- customer A(signed in) watches `<lot_1>`.
- customer B(signed in, never watched or bid on `<lot_1>`) uses a separate session.
- customer(signed in, enrolled to bid, not watching `<lot_2>`, no bid on `<lot_2>`) is on `<lot_2 url>`.
- customer(signed in, enrolled to bid, watching `<lot_3>`, no bid on `<lot_3>`) is on `<lot_3 url>`.
- The collector also watches `<lot_4>` without bidding.
- customer(signed in, enrolled to bid, not watching `<lot_5>`, no bid on `<lot_5>`) is on `<lot_5 url>`.
- The account is in the row's state.
- The title count on `<my auctions url>` is noted.

**Shared test data:**

| Item | Value |
| --- | --- |
| lot_1 | An open lot taking bids, not watched and not bid on by this collector |
| lot_1 | An open lot taking bids, watched by customer A only |
| lot_2 | An open lot taking bids, with no bid from this collector and no other bidder |
| first bid | The next valid bid shown on the bid panel |
| lot_3 | An open lot taking bids, watched by this collector, closing after `<lot_4>` |
| lot_4 | An open lot taking bids, watch-only for this collector, closing before `<lot_3>` |
| first bid | The next valid bid shown on `<lot_3>`'s bid panel |
| Item | Account state: Bidding allowed; `<typed bid>`: US$140, below `<opening price>`; The bid form says: Minimum bid is `<opening price>` |
| Item | Account state: Bidding suspended by an operator; `<typed bid>`: US$280, `<opening price>`; The bid form says: Bidding is suspended on this account. Contact Us to resolve it. |
| Item | Account state: Field; `<typed bid>`: Value |
| Item | Account state: lot_5; `<typed bid>`: An open USD lot with no bid from anyone |
| Item | Account state: opening price; `<typed bid>`: US$280 (range: 1000–79999 minor units), the starting price |

### Route

1. Click the Watch control.
   - a toast says email alerts are on, with View My Auctions. g10.auction-account-record.US5-TC1
2. Click View My Auctions in the toast.
   - My Auctions opens; the title count includes `<lot_1>`. g10.auction-account-record.US5-TC1
3. Find the `<lot_1>` row.
   - `<lot_1>` shows once, with key image, title and close. g10.auction-account-record.US5-TC1
   - Your Standing reads `--`. g10.auction-account-record.US5-TC1
   - Email alerts switch is on; Unwatch is offered. g10.auction-account-record.US5-TC1
4. Click the watch control on `<lot_1>`'s card, bottom right of the image.
   - the card's control reads Watching. g10.auction-account-record.US5-TC2
5. Navigate to `<my auctions url>`.
   - `<lot_1>` shows once, Your Standing `--`, email alerts on. g10.auction-account-record.US5-TC2
6. As customer B, navigate to `<my auctions url>`.
   - `<lot_1>` is not listed. g10.auction-account-record.US5-TC3
7. As customer B, navigate to `<lot_1 url>`.
   - the control reads Watch; no watch count shows. g10.auction-account-record.US5-TC3
8. As customer B, open the page source of `<lot_1 url>`.
   - no watch count and no watcher's identity appear. g10.auction-account-record.US5-TC3
9. Place `<first bid>` from the bid panel.
   - one toast says email alerts are on. g10.auction-account-record.US6-TC1
10. Reload `<lot_2 url>`.
   - no alerts toast shows. g10.auction-account-record.US6-TC1
11. Navigate to `<my auctions url>`.
   - `<lot_2>` shows once, Your Standing Leading. g10.auction-account-record.US6-TC1
   - Email alerts switch is on; no Unwatch is offered. g10.auction-account-record.US6-TC1
12. Place `<first bid>` from the bid panel.
   - `<lot_3>` shows once, Your Standing Leading, no Unwatch. g10.auction-account-record.US6-TC2
13. Navigate to `<my auctions url>`.
   - `<lot_3>` sits above `<lot_4>`: bid rows before watch-only. g10.auction-account-record.US6-TC2
14. Type `<typed bid>` into the custom maximum on the bid panel.
15. Confirm the bid.
   - the bid form says the row's words, and no alerts toast shows. g10.auction-account-record.US6-TC3
16. Reload `<lot_5 url>`.
   - the watch control offers Watch, not locked to watching. g10.auction-account-record.US6-TC3
17. Navigate to `<my auctions url>`.
   - `<lot_5>` is not listed in any tab. g10.auction-account-record.US6-TC3
   - the title count is the one noted. g10.auction-account-record.US6-TC3

## Walk 4: Filter rows and read close results — phase 1

**Starting state:**

- customer(signed in) watches `<listing_1>`, `<listing_2>` and `<listing_3>`.
- customer(signed in) watches `<listing_1>`, a listing whose bidding has not opened.
- customer(signed in) watches only open listings.
- customer(signed in) watches `<listing_3>`, a published listing that has closed.
- customer(winner) has a Won row whose auction order is available.
- customer owns a Won lot whose order is Partially Paid.
- customer A(signed in) bid on `<lot_9>`, which closed with customer B winning.
- customer(signed in) has both Won rows from `<lot_10>`, `<lot_11>`.
- customer(signed in) won `<lot>`, in the row's state.

**Shared test data:**

| Item | Value |
| --- | --- |
| listing_1 | A published listing whose bidding has not opened |
| listing_2 | A published listing whose bidding is open |
| listing_3 | A published listing that has closed |
| lot_9 | A closed lot won by customer B |
| Row | State |
| `<lot_10>` | A won lot whose order reads Payment Overdue |
| `<lot_11>` | A won lot whose order reads Awaiting Setup inside the setup window |
| Item | Order state: Setup deadline (48 hours from close) passed, setup incomplete; Your Standing: Won, Setup Overdue; Not: Awaiting Setup |
| Item | Order state: Payment deadline (7 days from invoice send) passed, unpaid; Your Standing: Won, Payment Overdue; Not: Pending Payment |

### Route

1. Navigate to `<grade10 my auctions url>`.
   - shows the Active tab, listing only `<listing_2>`. g10.auction-account-record.US7-TC1
2. Open the Upcoming tab.
   - Title badge shows 3. g10.auction-account-record.US7-TC1
   - lists only `<listing_1>`; step 3 lists only `<listing_3>`. g10.auction-account-record.US7-TC1
3. Open the Ended tab.
4. Navigate to `<grade10 my auctions url>`.
5. Wait until `<listing_1>` bidding opens.
6. Reload `<grade10 my auctions url>`.
   - `<listing_1>` is listed in the Active tab. g10.auction-account-record.US7-TC2
   - `<listing_1>` is not listed in the Upcoming tab. g10.auction-account-record.US7-TC2
7. Navigate to `<grade10 my auctions url>`.
8. Open the Upcoming tab.
   - The Upcoming tab shows its no-lots empty state. g10.auction-account-record.US7-TC3
9. Navigate to `<grade10 my auctions url>`.
10. Open the Ended tab.
11. Click the Email alerts control on `<listing_3>`.
   - The Email alerts control is disabled. g10.auction-account-record.US7-TC4
   - The alert setting for `<listing_3>` is unchanged. g10.auction-account-record.US7-TC4
12. Navigate to `<grade10 my auctions url>`.
   - The matching auction order opens. g10.auction-account-record.US7-TC5
13. Select the order entry point on the Won row.
   - My Auctions performs no payment, address, or order-status write. g10.auction-account-record.US7-TC5
14. Open My Auctions and read the Won row.
   - The row status is Partially Paid with its warning treatment. g10.auction-account-record.US8-TC1
15. Select View order.
   - View order opens the Partially Paid Winner Order. g10.auction-account-record.US8-TC1
16. Navigate to `<my auctions url>`.
   - Your Standing reads Didn't win, and the row says the card was not charged. g10.auction-account-record.US8-TC2
17. Read `<lot_9>`'s row.
   - No View order is offered. g10.auction-account-record.US8-TC2
18. Navigate to `<my auctions url>`.
19. Read `<lot_10>` and `<lot_11>`'s rows.
   - `<lot_10>` reads Won, Payment Overdue, and offers View order. g10.auction-account-record.US8-TC3
   - `<lot_10>` has no helper line and no way to reach Grade10 on the row. g10.auction-account-record.US8-TC3
   - `<lot_11>` reads Won, Awaiting Setup, and offers View order. g10.auction-account-record.US8-TC3
   - `<lot_11>` has no confirm-address helper line on the row. g10.auction-account-record.US8-TC3
20. Navigate to `<my auctions url>`.
21. Read `<lot>`'s row.
   - Your Standing reads the row's value, never the Not column. g10.auction-account-record.US9-TC1
   - The row offers View order. g10.auction-account-record.US9-TC1
   - Lot, close and current bid read as on any Won row. g10.auction-account-record.US9-TC1
22. Navigate to `<grade10 my auctions url>`.
23. Find `<lot_2>`'s row and read its tab and Your Standing.
24. Let recording the close resume.
25. Reload `<grade10 my auctions url>`.

## Walk 5: Filter rows and read close results — phase 2

**Starting state:**

- customer A(signed in) leads `<lot_2>`.
- `<lot_2>`'s close has passed, and recording it is held back.
- customer B(signed in) bid `<customer B bid>` on `<lot_3>`.
- customer A has since raised `<lot_3>`'s current bid to `<current bid>`.

**Shared test data:**

| Item | Value |
| --- | --- |
| lot_2 | A USD lot led by customer A, its close passed and not yet recorded |
| lot_3 | An open USD lot, its close more than an hour away |
| customer B bid | 100000 USD minor units |
| current bid | 120000 USD minor units, above `<customer B bid>` |

### Route

1. Find `<lot_2>`'s row and read Your Standing.
   - At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win. g10.auction-account-record.US10-TC2
   - At step 5 the row is in the Ended tab and Your Standing reads Won. g10.auction-account-record.US10-TC2
2. As customer B, navigate to `<grade10 my auctions url>`.
   - Current bid reads `<current bid>`, not `<customer B bid>`. g10.auction-account-record.US10-TC3
3. Find `<lot_3>`'s row in the Active tab.
   - Your Standing reads Outbid, with the next valid bid. g10.auction-account-record.US10-TC3

## g10.auction-account-record.US1: Mark a listing now and find it again later

**As a** collector,
**I want** to watch listings I am interested in before bidding opens,
**so that** I can find them again when it does without searching the catalogue a second time.

### g10.auction-account-record.US1-TC1: A lot watched before it opens is found when it opens

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

<!-- trace:case id=g10.auction-account-record.TC-s25 rev=2 -->
### g10.auction-account-record.US1-TC2: My Auctions orders bid rows, then watch-only, then closed

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

<!-- trace:case id=g10.auction-account-record.TC-wtn rev=2 -->
### g10.auction-account-record.US1-TC3: Nothing bookmarked is an empty state that offers the catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in, has never watched or bid on a lot).

**Steps:**

1. Navigate to `<my auctions url>`.
2. Click the catalogue offer.

**Expected Results:**

* Step 1: the page says nothing is bookmarked; no error shows.
* Step 2: the auction catalogue opens.

<!-- trace:case id=g10.auction-account-record.TC-5jj rev=2 -->
### g10.auction-account-record.US1-TC4: A failed read says so and retries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-2c9 rev=2 -->
### g10.auction-account-record.US1-TC5: Signed-out visitor is asked to sign in and returned

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

## g10.auction-account-record.US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

<!-- trace:case id=g10.auction-account-record.TC-gj0 rev=3 -->
### g10.auction-account-record.US2-TC1: Your Standing reads each open-lot state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-oi7 rev=2 -->
### g10.auction-account-record.US2-TC2: Being outbid moves the row from Leading to Outbid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-nv4 rev=2 -->
### g10.auction-account-record.US2-TC3: A value that could not refresh is marked not current

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

<!-- trace:case id=g10.auction-account-record.TC-w62 rev=3 covers=g10.auction-account-record.SC-dsc -->
### g10.auction-account-record.US2-TC4: A refused raise leaves the row's Standing as it was

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

* customer A(signed in) holds the maximum and standing in the row for `<lot_7>`, and is on `<lot_7 url>`.

**Test data:**

| Lot state for customer A | Customer A maximum | Current bid | Minimum next bid | Refused raise | Your Standing |
| --- | --- | --- | --- | --- | --- |
| Open, customer B leads | 25000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Outbid, with the next valid bid |
| Open, customer A leads at 30000 USD minor units | 30000 USD minor units | 30000 USD minor units | 30500 USD minor units | 30300 USD minor units | Leading |

| Field | Value |
| --- | --- |
| lot_7 | An open USD lot taking bids |

**Steps:**

1. Place `<refused raise>`.
2. Note `<lot_7>`'s current bid on its page.
3. Navigate to `<my auctions url>`.
4. Find `<lot_7>`'s row.

**Expected Results:**

* Step 1 shows the refusal on the bid panel.
* Your Standing reads the row's value.
* Current bid reads the bid noted at step 2, still 30000 USD minor units, never `<refused raise>`.

<!-- trace:case id=g10.auction-account-record.TC-na3 rev=2 -->
### g10.auction-account-record.US2-TC5: A refused first bid adds no row

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
| lot_8 | An open USD lot taking bids |
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

<!-- trace:case id=g10.auction-account-record.TC-8mz rev=2 -->
### g10.auction-account-record.US2-TC6: An Outbid bidder's refused bid leaves their row Outbid and in place

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
| lot_6 | An open USD lot led by customer B, closing after `<lot_7>` |
| lot_7 | An open USD lot customer A bid on, closing before `<lot_6>` |
| current bid | US$5,460 (range: 400000–799999 minor units) |
| increment | US$80 (fixed tier increment), the US$4,000 tier |
| next minimum | `<current bid>` plus `<increment>`, US$5,540 (fixed derived value) |
| refused bid | US$5,460, equal to `<current bid>`, below `<next minimum>` |

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

## g10.auction-account-record.US3: Follow a listing I won through to delivery

**As a** winner,
**I want** a paid, undispatched Won row to read Preparing Shipment,
**so that** My Auctions matches Winner Order without implying the lot shipped.

<!-- trace:case id=g10.auction-account-record.TC-hj7 rev=2 -->
### g10.auction-account-record.US3-TC2: A Won row follows the proof check's outcome

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

<!-- trace:case id=g10.auction-account-record.TC-wt4 rev=2 -->
### g10.auction-account-record.US3-TC4: Another collector never sees a Payment Verifying row

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-83f rev=2 -->
### g10.auction-account-record.US3-TC5: A Won row reads its order's status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-lvl rev=2 -->
### g10.auction-account-record.US3-TC20: Won-row status follows payment and fulfilment state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(winner) is on My Auctions with both rows from **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| Row | State |
| --- | --- |
| `<won_preparing_shipment>` | A won listing with invoice `paid` and fulfilment `unfulfilled` |
| `<won_shipped>` | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |

**Steps:**

1. Read Status on each row.

**Expected Results:**

* `<won_preparing_shipment>` reads Preparing Shipment with the `default` status badge.
* `<won_shipped>` reads Shipped with the `default` status badge.

<!-- trace:case id=g10.auction-account-record.TC-now rev=2 -->
### g10.auction-account-record.US3-TC23: Shipped Won row keeps the default badge

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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
| <won_shipped> | A won listing with invoice `paid`, fulfilment `fulfilled`, and no delivery confirmation |

**Steps:**

1. Read Status on that row.

**Expected Results:**

* Status reads Shipped.
* Status badge uses `default`.

---

## g10.auction-account-record.US4: Know I was not charged when I lose

**As a** losing bidder,
**I want** to see that my card was not charged,
**so that** I know I owe nothing for a listing I did not win.

<!-- trace:case id=g10.auction-account-record.TC-rfz rev=3 -->
### g10.auction-account-record.US4-TC1: Didn't win says the card was not charged

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

## g10.auction-account-record.US5: Watch from the auction with alerts toast

**As a** collector,
**I want** watching a lot from its page to put it on My Auctions and tell me alerts are on,
**so that** I can open My Auctions from the toast when I want to manage it.

<!-- trace:case id=g10.auction-account-record.TC-7pb rev=2 -->
### g10.auction-account-record.US5-TC1: Watched lot lands on My Auctions as watch-only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-tzp rev=2 -->
### g10.auction-account-record.US5-TC2: Watching from the catalogue card lands on My Auctions

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
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-sse rev=2 -->
### g10.auction-account-record.US5-TC3: A watch is seen only by its owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

## g10.auction-account-record.US6: A bid bookmarks and toasts alerts once

**As a** bidder,
**I want** my first bid on a lot to bookmark it and tell me once that alerts are on,
**so that** I do not need a separate Watch and I am not reminded on every visit.

<!-- trace:case id=g10.auction-account-record.TC-l63 rev=2 -->
### g10.auction-account-record.US6-TC1: First bid puts the lot on My Auctions without a Watch

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-9rb rev=2 -->
### g10.auction-account-record.US6-TC2: Bidding on a watched lot keeps one row

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
* **Trace:** grade10-site-auction-account-record-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-43z rev=2 -->
### g10.auction-account-record.US6-TC3: A refused first bid puts nothing on My Auctions

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
| Bidding allowed | US$140, below `<opening price>` | Minimum bid is `<opening price>` |
| Bidding suspended by an operator | US$280, `<opening price>` | Bidding is suspended on this account. Contact Us to resolve it. |

| Field | Value |
| --- | --- |
| lot_5 | An open USD lot with no bid from anyone |
| opening price | US$280 (range: 1000–79999 minor units), the starting price |

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

## g10.auction-account-record.US7: Collector reads My Auctions by bidding window

**As a** collector
**I want** my lots split into Active, Upcoming and Ended tabs
**so that** I see what needs me now without scrolling past closed and unopened lots.

<!-- trace:case id=g10.auction-account-record.TC-91p rev=2 -->
### g10.auction-account-record.US7-TC1: Each listing sits in the tab its bidding window names

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-z0b rev=2 -->
### g10.auction-account-record.US7-TC2: A listing moves to Active when its window opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_1>`, a listing whose bidding has not opened.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Wait until `<listing_1>` bidding opens.
3. Reload `<grade10 my auctions url>`.

**Expected Results:**

* `<listing_1>` is listed in the Active tab.
* `<listing_1>` is not listed in the Upcoming tab.

<!-- trace:case id=g10.auction-account-record.TC-tbh rev=2 -->
### g10.auction-account-record.US7-TC3: An empty tab says it has no lots

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches only open listings.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Open the Upcoming tab.

**Expected Results:**

* The Upcoming tab shows its no-lots empty state.

<!-- trace:case id=g10.auction-account-record.TC-tzc rev=2 -->
### g10.auction-account-record.US7-TC4: Email alerts cannot be changed on an Ended row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) watches `<listing_3>`, a published listing that has closed.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Open the Ended tab.
3. Click the Email alerts control on `<listing_3>`.

**Expected Results:**

* The Email alerts control is disabled.
* The alert setting for `<listing_3>` is unchanged.

<!-- trace:case id=g10.auction-account-record.TC-6xk rev=2 -->
### g10.auction-account-record.US7-TC5: A Won row opens its auction order

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
* **Trace:** grade10-site-auction-account-record-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(winner) has a Won row whose auction order is available.

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Select the order entry point on the Won row.

**Expected Results:**

* The matching auction order opens.
* My Auctions performs no payment, address, or order-status write.

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
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer owns a Won lot whose order is Partially Paid.

**Steps:**

1. Open My Auctions and read the Won row.
2. Select View order.

**Expected Results:**

* The row status is Partially Paid with its warning treatment.
* View order opens the Partially Paid Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=3 -->
### g10.auction-account-record.US8-TC2: A Didn't win row offers no View order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=2 -->
### g10.auction-account-record.US8-TC3: A Won row carries no status-specific contact helper

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer(signed in) has both Won rows from **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| Row | State |
| --- | --- |
| `<lot_10>` | A won lot whose order reads Payment Overdue |
| `<lot_11>` | A won lot whose order reads Awaiting Setup inside the setup window |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read `<lot_10>` and `<lot_11>`'s rows.

**Expected Results:**

* `<lot_10>` reads Won, Payment Overdue, and offers View order.
* `<lot_10>` has no helper line and no way to reach Grade10 on the row.
* `<lot_11>` reads Won, Awaiting Setup, and offers View order.
* `<lot_11>` has no confirm-address helper line on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=2 -->
### g10.auction-account-record.US8-TC4: An Awaiting Setup row carries no confirm-address helper

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
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

## g10.auction-account-record.US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won lots to read Setup Overdue or Payment Overdue in Status,
**so that** I can tell closed self-service from lots still inside their window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=2 -->
### g10.auction-account-record.US9-TC1: Overdue won lots read Setup Overdue or Payment Overdue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

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

## g10.auction-account-record.US10: Bidder reads each lot's price and result on My Auctions

**As a** bidder,
**I want** each lot I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a lot sold for and whether I lost it without opening the lot.

<!-- trace:case id=g10.auction-account-record.TC-p3p rev=2 -->
### g10.auction-account-record.US10-TC2: Row shows no result before the close is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer A(signed in) leads `<lot_2>`.
* `<lot_2>`'s close has passed, and recording it is held back.

**Test data:**

| Field | Value |
| --- | --- |
| lot_2 | A USD lot led by customer A, its close passed and not yet recorded |

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Find `<lot_2>`'s row and read its tab and Your Standing.
3. Let recording the close resume.
4. Reload `<grade10 my auctions url>`.
5. Find `<lot_2>`'s row and read Your Standing.

**Expected Results:**

* At step 2 the row is in the Active tab, and Your Standing reads Leading with no next valid bid, neither Won nor Didn't win.
* At step 5 the row is in the Ended tab and Your Standing reads Won.

<!-- trace:case id=g10.auction-account-record.TC-y6p rev=3 covers=g10.auction-account-record.SC-fao -->
### g10.auction-account-record.US10-TC3: Open row shows the auction's current price, not the collector's bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/account-record/account-record.spec.ts`

**Pre-conditions:**

* customer B(signed in) bid `<customer B bid>` on `<lot_3>`.
* customer A has since raised `<lot_3>`'s current bid to `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| lot_3 | An open USD lot, its close more than an hour away |
| customer B bid | 100000 USD minor units |
| current bid | 120000 USD minor units, above `<customer B bid>` |

**Steps:**

1. As customer B, navigate to `<grade10 my auctions url>`.
2. Find `<lot_3>`'s row in the Active tab.

**Expected Results:**

* Current bid reads 120000 USD minor units, not `<customer B bid>`.
* Your Standing reads Outbid, with the next valid bid.

<!-- trace:case id=g10.auction-account-record.TC-j99 rev=2 -->
### g10.auction-account-record.US10-TC1: Ended row shows the final price and the recorded result

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
| `<lot_1>` | A closed USD lot both customers bid on |
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

<!-- trace:case id=g10.auction-account-record.TC-hgl rev=2 -->
### g10.auction-account-record.US10-TC4: Lone first bid confirming after the close reads Didn't win on an unsold lot

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
| `<lot_4>` | A USD lot with a starting price of 20000 minor units and no bid |
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
- Archived cases from `2026-09-16-revise-auction-winner-invoicing` (`grade10-site-auction-account-record-US8-TC3-1`, `grade10-site-auction-account-record-US8-TC4-1`) are represented by survivor `g10.auction-account-record.US8-TC3`; the duplicate `US8-TC4` is deprecated.
- Archived cases from `2026-09-18-add-winner-bank-transfer` (`grade10-site-auction-account-record-US3-TC2-1`, `grade10-site-auction-account-record-US3-TC4-1`) are represented by `g10.auction-account-record.US3-TC2` and `g10.auction-account-record.US3-TC4`.
- Archived case `grade10-site-auction-account-record-US9-TC1-1` from `2026-09-24-add-auction-overdue-order-status` is represented by `g10.auction-account-record.US9-TC1`.
- Archived cases from `2026-09-30-add-my-auction-orders` (`grade10-site-auction-account-record-US7-TC1-1`, `grade10-site-auction-account-record-US7-TC2-1`, `grade10-site-auction-account-record-US7-TC3-1`, `grade10-site-auction-account-record-US7-TC4-1`, `grade10-site-auction-account-record-US7-TC5-1`) are represented by `g10.auction-account-record.US7-TC1` through `g10.auction-account-record.US7-TC5`.
- Draft `US3-TC20` absorbs `US3-TC23` as a two-row payment and fulfilment matrix; both rows retain their status assertions and `US3-TC23` is deprecated.
- Draft `US8-TC3` absorbs `US8-TC4` as a two-row status-helper matrix; both rows retain their status assertions and `US8-TC4` is deprecated.

## Reconciliation

**Run:** Independent QA2, 2026-10-14. Inputs: frozen QA1 packet digest `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`; current PRDs, decisions, frozen journeys, delta scenarios, feature roots, task list, durable baseline, and existing suite. The QA1 case review remained blind to Dev scenarios. Dispositions below use only existing journey anchors.

- `TC-w62` rev3 covers SC-dsc: both Outbid and Leading rows keep the live current price at 30000 USD minor after the refused 30300 raise; floor is 30500 USD minor.
- `TC-y6p` rev3 covers SC-fao: the Active row shows the live current price 120000 USD minor, above customer B's 100000 USD minor bid.
- SC-b5w has no active case: durable `TC-j99` is deprecated and remains unchanged. **Out of suite:** exact site regression is planned in `tasks.md` 7.7. No case was reactivated.
- The delta preserves the existing account-record journeys and the product rule that rows show current/final auction price. No PRD, journey, feature-root, or durable-baseline contradiction was found. The changed account-record scenarios do not assert the 20% premium; that behavior stays with its owning bid and post-bid suites.
- All edited cases remain draft. No implementation execution or human approval is claimed.
