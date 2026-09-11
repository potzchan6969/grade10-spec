# grade10-site/auction/lot-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** every lot to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

### grade10-site-auction-lot-status-US1-TC1-1: External lot status matches the lot

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* `<lot>` is in the state the row names.

**Test data:**

| `<lot>` | External lot status |
| --- | --- |
| Published, scheduled start not arrived | Upcoming |
| Open for bidding, closing in a day | Active |
| Open for bidding, closing in a minute | Active |
| Past its scheduled close, in extended bidding | Active |
| Has a winner, order awaiting payment | Ended |
| Has a winner, order shipped | Ended |
| Has a winner, order cancelled | Ended |

**Steps:**

1. Read the public listing data for `<lot>`.

**Expected Results:**

* The external lot status matches the row.

### grade10-site-auction-lot-status-US1-TC2-1: Winner sees their order status separately

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
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* customer(winner of `<lot_1>`) is signed in.
* The winner's order for `<lot_1>` is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot the customer won, with the order awaiting payment |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Find the row for `<lot_1>`.

**Expected Results:**

* The external lot status is Ended.
* The order status is shown separately.

---

## grade10-site-auction-lot-status-US2: Collector sees only lots that can be bought

**As a** collector,
**I want** lots that were never published, did not sell, or were called off to be hidden from me,
**so that** I do not spend time on a lot nobody can buy.

### grade10-site-auction-lot-status-US2-TC1-1: Hidden lots are not in the catalogue

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
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* `<lot>` is in the state the row names.

**Test data:**

| `<lot>` |
| --- |
| A draft lot |
| A published lot whose bidding ended with no winner |
| A published lot that an operator then called off |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Search the catalogue for the title of `<lot>`.

**Expected Results:**

* `<lot>` is not listed.
* The search does not find it.

### grade10-site-auction-lot-status-US2-TC2-1: Hidden lots are removed from the watchlist

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
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* customer is signed in and watches `<lot_2>` and `<lot_3>`.
* `<lot_2>` then ends with no winner, and `<lot_3>` is then called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A watched lot whose bidding ended with no winner |
| `<lot_3>` | A watched lot that an operator called off |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Open the watchlist.

**Expected Results:**

* Neither `<lot_2>` nor `<lot_3>` is listed.

### grade10-site-auction-lot-status-US2-TC3-1: Listing data leaves out hidden lots

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* `<lot_2>` ended with no winner, and `<lot_3>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A watched lot whose bidding ended with no winner |
| `<lot_3>` | A watched lot that an operator called off |

**Steps:**

1. Read the public listing data.

**Expected Results:**

* Neither `<lot_2>` nor `<lot_3>` is included.

---

## grade10-site-auction-lot-status-US3: Bidder sees what happened to a called-off lot

**As a** bidder,
**I want** a called-off lot I bid on to stay in My Auctions,
**so that** I can see my card hold was released.

### grade10-site-auction-lot-status-US3-TC1-1: Only the bidder still sees a called-off lot

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
* **Trace:** grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* customer A bid on `<lot_4>`. customer B watched `<lot_4>` and did not bid.
* An operator then called off `<lot_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot that customer A bid on and customer B watched, then called off |

**Steps:**

1. As customer A, navigate to <grade10 my auctions url>.
2. As customer B, navigate to <grade10 my auctions url>.

**Expected Results:**

* Step 1 lists `<lot_4>`, with the note that customer A's card hold was released.
* Step 2 does not list `<lot_4>`.
