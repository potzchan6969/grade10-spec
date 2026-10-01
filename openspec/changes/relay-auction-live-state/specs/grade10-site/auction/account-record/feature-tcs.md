# grade10-site/auction/account-record Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-auction-account-record-US10: Bidder reads each lot's price and result on My Auctions

**As a** bidder,
**I want** each lot I bid on to show the auction's current or final price and, once it closes, whether I won,
**so that** I know what a lot sold for and whether I lost it without opening the lot.

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

### grade10-site-auction-account-record-US10-TC2-1: Row shows no result before the close is recorded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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
| `<lot_2>` | An HKD lot led by customer A, its close passed and not yet recorded |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Find `<lot_2>`'s row in the Active or Ended tab and read Your Standing.
3. Let recording the close resume.
4. Reload `<my auctions url>`.
5. Find `<lot_2>`'s row and read Your Standing.

**Expected Results:**

* At step 2 Your Standing reads neither Won nor Didn't win.
* At step 5 the row is in the Ended tab and Your Standing reads Won.

### grade10-site-auction-account-record-US10-TC3-1: Open row shows the auction's current price, not the collector's bid

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
* **Trace:** grade10-site-auction-account-record-US-10

**Pre-conditions:**

* customer B(signed in) bid `<customer B bid>` on `<lot_3>`.
* customer A has since raised `<lot_3>`'s current bid to `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_3>` | An open HKD lot, its close more than an hour away |
| `<customer B bid>` | 100000 minor units |
| `<current bid>` | 120000 minor units, above `<customer B bid>` |

**Steps:**

1. As customer B, navigate to `<my auctions url>`.
2. Find `<lot_3>`'s row in the Active tab.

**Expected Results:**

* Current bid reads `<current bid>`, not `<customer B bid>`.
* Your Standing reads Outbid, with the next valid bid.
