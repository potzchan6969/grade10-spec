# grade10-site/auction/notifications Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-notifications-US6: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

### grade10-site-auction-notifications-US6-TC4-1: A house win mails every losing bidder and nobody as the winner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-06

**Pre-conditions:**

* customer A and customer B bid on `<lot_1>`, email alerts on, and the house leads it at `<winning bid>` under its internal bid.
* `<lot_1>`'s close is a few minutes away, and no further bid is coming.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A published HKD lot protected by a committed internal bid of 700000 minor units |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<customer B maximum>` | 600000 minor units (HK$6,000.00) |
| `<winning bid>` | 608000 minor units: `<customer B maximum>` plus its 8000 increment |

**Steps:**

1. Let `<lot_1>` close with the house leading.
2. Read the mail sent to customer A and customer B for the close.
3. Filter the send log by `<lot_1>` and read the rows from the close.

**Expected Results:**

* Step 2: each gets one You did not win letter, Winning bid `<winning bid>` and their own bid.
* Step 2: neither letter names the house or a reserve.
* Step 3 holds no auction-won letter and no row addressed to the house.

---

## grade10-site-auction-notifications-US7: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

### grade10-site-auction-notifications-US7-TC3-1: A lot only the house bid on mails watchers sold, not ended

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer D watches `<lot_2>`, email alerts on, and never bid on it.
* No collector bid on `<lot_2>`, and its internal bid is in the row's state.
* `<lot_2>`'s close is a few minutes away.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A published HKD lot, starting price `<starting price>`, extension duration 1800s (30mins) |
| `<starting price>` | 400000 minor units (HK$4,000.00) |

| Row | Internal bid | Letter to customer D |
| --- | --- | --- |
| Placed | 600000 minor units, committed, the house leading at `<starting price>` | One Lot watched, sold, Sold for `<starting price>` |
| Not placed | 399900 minor units, short of `<starting price>` at its time | One Lot watched, ended, Ended only |

**Steps:**

1. Let `<lot_2>` close.
2. Read the mail sent to customer D for the close.

**Expected Results:**

* Step 2 reads the row's letter, and only that letter.
* Step 2: no letter names the house or a reserve.
