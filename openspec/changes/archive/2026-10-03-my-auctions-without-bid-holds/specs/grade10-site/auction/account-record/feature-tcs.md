# grade10-site/auction/account-record Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-account-record-US2: See where I stand across every listing I bid on

**As a** bidder,
**I want** one place that says which of my listings I still lead and which I have lost,
**so that** I can act on the ones that still need me before they close.

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

* customer A(signed in) has bid on <lot>, in the state its row gives.

**Test data:**

| Lot state for customer A | Your Standing |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

**Steps:**

1. Navigate to <my auctions url>.
2. Find <lot>'s row.

**Expected Results:**

* Your Standing reads the row's value.
* Current bid reads <lot>'s current bid.
* For Outbid, the next valid bid equals current bid plus its increment.

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

* customer A(signed in) has bid on <lot_7>, in the state its row gives, and is on <lot_7 url>.

**Test data:**

| Lot state for customer A | Your Standing |
| --- | --- |
| Open, customer A leads | Leading |
| Open, customer B leads | Outbid, with the next valid bid |

| Field | Value |
| --- | --- |
| <lot_7> | An open HKD lot taking bids |
| <low raise> | One minor unit below the next valid bid shown on customer A's bid panel |

**Steps:**

1. Place <low raise>.
2. Note <lot_7>'s current bid on its page.
3. Navigate to <my auctions url>.
4. Find <lot_7>'s row.

**Expected Results:**

* Step 1 shows the refusal on the bid panel.
* Your Standing reads the row's value.
* Current bid reads the bid noted at step 2, never <low raise>.

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

* customer A(signed in, enrolled to bid) has neither watched nor bid on <lot_8>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_8> | An open HKD lot taking bids |
| <low bid> | One minor unit below the next valid bid shown on customer A's bid panel |

**Steps:**

1. Navigate to <my auctions url> and note the title count.
2. Navigate to <lot_8 url> and place <low bid>.
3. Navigate to <my auctions url>.
4. Open the Active, Upcoming and Ended tabs in turn.

**Expected Results:**

* Step 2 shows the refusal on the bid panel.
* No tab holds a row for <lot_8>.
* The title count equals the count noted at step 1.

---

## grade10-site-auction-account-record-US4: Know I was not charged when I lose

**As a** losing bidder,
**I want** to see that my card was not charged,
**so that** I know I owe nothing for a listing I did not win.

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

* customer A(signed in) bid on <lot>, which ended as its row gives.

**Test data:**

| How <lot> ended | Your Standing |
| --- | --- |
| Closed with customer B winning | Didn't win |
| Called off by Grade10 | Didn't win |

**Steps:**

1. Navigate to <my auctions url>.
2. Select the Ended tab and find <lot>'s row.

**Expected Results:**

* Your Standing reads the row's value.
* The row says the card was not charged.
* No amount is shown as charged.

---

## grade10-site-auction-account-record-US8: Winner opens settlement from My Auctions

**As a** winner,
**I want** every Won row to open Winner Order without helper clutter,
**so that** I can continue settlement without reading contact copy on the table.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=2 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
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

* customer A(signed in) bid on <lot_9>, which closed with customer B winning.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_9> | A closed lot won by customer B |

**Steps:**

1. Navigate to <my auctions url>.
2. Read <lot_9>'s row.

**Expected Results:**

* Your Standing reads Didn't win, and the row says the card was not charged.
* No View order is offered.

---

## grade10-site-auction-account-record-US10: Bidder reads each lot's price and result on My Auctions

**As a** bidder,
**I want** each lot I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a lot sold for and whether I lost it without opening the lot.

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

- Didn't win says the card was not charged; no hold copy remains.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Didn't win names a hold being released or released (`grade10-site-auction-account-record-US4-TC1-1`, `grade10-site-auction-account-record-US8-TC2-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US4-TC1-2` and `grade10-site-auction-account-record-US8-TC2-2` (Q1) |
| Bid submitted and Bid not accepted rows (`grade10-site-auction-account-record-US2-TC1-1`) | **Folded in:** rewritten as `grade10-site-auction-account-record-US2-TC1-2`, Leading and Outbid only (Q2) |
| A leader whose raise is refused fits Leading and Bid not accepted | **Folded in:** case `grade10-site-auction-account-record-US2-TC4-1` (Q3) |
| A refused first bid on a lot never watched | **Folded in:** case `grade10-site-auction-account-record-US2-TC5-1` (Q2) |
| Lone first bid confirming after the close (`grade10-site-auction-account-record-US10-TC4-1`) | **Deprecated:** no bid takes a hold to confirm after the close |
| Hold copy retained for Didn’t win | **Superseded:** the row says the card was not charged; no hold copy remains |

**Run:** 2026-10-02, from the delta against the durable suite and the built My Auctions mapping in grade10 (`packages/grade10-auction/backend/src/services/accountRecord.ts`, `apps/frontend/grade10/src/pages/auctions/AccountAuctionRecordPage.tsx`) and its walk (`apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts`). It is a statement, not proof.
