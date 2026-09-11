# grade10-site/auction/lot-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector reads where a lot stands

**As a** collector,
**I want** every lot described in one of three words,
**so that** I can tell at a glance whether I can still bid on it.

### grade10-site-auction-lot-status-US1-TC1-1: Collector status follows the lot

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

| `<lot>` | Collector status |
| --- | --- |
| Published, scheduled start not arrived | Upcoming |
| Bidding open, a day to its close | Active |
| Bidding open, a minute to its close | Active |
| Past its scheduled close, in extended bidding | Active |
| Won, the winner's order awaiting payment | Ended |
| Won, the winner's order shipped | Ended |
| Won, the winner's order cancelled | Ended |

**Steps:**

1. Read the public listing for `<lot>`.

**Expected Results:**

* The collector status reads as the row states.
* It is one of Upcoming, Active, or Ended.

### grade10-site-auction-lot-status-US1-TC2-1: Winner reads their order apart from the lot

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
| `<lot_1>` | A lot the customer won, its order awaiting payment |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Find the row for `<lot_1>`.

**Expected Results:**

* The lot's collector status is Ended.
* The order status is shown as its own fact beside it.

---

## grade10-site-auction-lot-status-US2: Collector meets only lots that sold or can sell

**As a** collector,
**I want** lots that never opened, did not sell, or were called off kept out of my way,
**so that** I do not spend time on a lot nobody can buy.

### grade10-site-auction-lot-status-US2-TC1-1: Lots that cannot sell are not in the catalogue

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
| A once-published lot that closed with no winner |
| A published lot an operator then called off |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Search the catalogue for `<lot>`'s title.

**Expected Results:**

* `<lot>` is not listed.
* The search returns no result for it.

### grade10-site-auction-lot-status-US2-TC2-1: Hidden lots leave the watched list

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
* `<lot_2>` then closes with no winner, and `<lot_3>` is then called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A watched lot that closed with no winner |
| `<lot_3>` | A watched lot an operator called off |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the watched lots.

**Expected Results:**

* Neither `<lot_2>` nor `<lot_3>` is listed.

### grade10-site-auction-lot-status-US2-TC3-1: Listing read returns no hidden lot

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

* `<lot_2>` closed with no winner and `<lot_3>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A watched lot that closed with no winner |
| `<lot_3>` | A watched lot an operator called off |

**Steps:**

1. Read the public listings.

**Expected Results:**

* Neither `<lot_2>` nor `<lot_3>` is returned.

---

## grade10-site-auction-lot-status-US3: Bidder reads what became of a called-off lot

**As a** bidder,
**I want** a lot I bid on that was called off to stay in my own record,
**so that** I can see my card hold was released.

### grade10-site-auction-lot-status-US3-TC1-1: Only the bidder still reads a called-off lot

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

* customer A bid on `<lot_4>`; customer B watched `<lot_4>` and did not bid.
* An operator then called off `<lot_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot customer A bid on and customer B watched, then called off |

**Steps:**

1. As customer A, navigate to <grade10 my auctions url>.
2. As customer B, navigate to <grade10 my auctions url>.

**Expected Results:**

* Step 1 lists `<lot_4>` with what happened to customer A's card hold.
* Step 2 does not list `<lot_4>`.
