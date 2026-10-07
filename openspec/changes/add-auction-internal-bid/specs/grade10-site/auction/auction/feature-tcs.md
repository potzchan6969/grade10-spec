# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

### grade10-site-auction-auction-US11-TC12-1: A lot the house leads at the close reads sold like any other

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_1>` is led as the row states at `<final price>`, over customer A's maximum `<customer A maximum>`, its recorded close under a minute away, no further bid coming.
* customer C has never bid on `<listing_1>` and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in extended bidding |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<final price>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

| Row | Leader |
| --- | --- |
| House | The house, under `<listing_1>`'s internal bid of 600000 minor units |
| Collector | customer B, with maximum 600000 minor units and no internal bid on the lot |

**Steps:**

1. Wait through the recorded close without reloading.
2. As customer C, read the lot's state, Highest bid and Recent bids.
3. Read the API response for `<listing_1>`'s public facts.
4. Open <grade10 auction url> and read `<listing_1>`'s card.

**Expected Results:**

* Step 2 reads sold at `<final price>`, the winning row crowned under the leader's listing pseudonym.
* Step 3 reads the lot closed with a winner at `<final price>`, the winner by pseudonym only.
* Step 4's card reads Ended, as any sold lot's card does.
* The House row and the Collector row read alike in every step, save the pseudonym.

### grade10-site-auction-auction-US11-TC13-1: A lot whose only bid is the house's extends and closes sold at the starting price

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_2>` is published and taking bids with no bid, and its internal bid of `<house maximum>` is set at the row's commit time.
* `<listing_2>`'s scheduled close is a few minutes away, and no collector will bid.
* customer C is on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing, starting price `<starting price>`, extension duration `<extension duration>`, no cap |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<extension duration>` | 1800s (30mins) |

| Row | Commit time |
| --- | --- |
| Before the close | 1 minute from now, before the scheduled close |
| At the scheduled close | Exactly the scheduled close |

**Steps:**

1. Wait until the scheduled close passes and read Time left.
2. Wait until the extended close passes.
3. Read the lot's state, Highest bid and Recent bids.

**Expected Results:**

* Step 1 reads extended bidding, the close `<extension duration>` after the scheduled close.
* Step 3 reads sold at `<starting price>`, one bid, under the house's listing pseudonym.

---

## grade10-site-auction-auction-US12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

### grade10-site-auction-auction-US12-TC3-1: A house change restarts the timer only when it moves the price

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* `<listing_3>` is in extended bidding with its recorded close `<time left before change>` away.
* `<listing_3>`'s internal bid of `<house maximum>` is committed, and the bidding is as the row states.
* admin(holds auction:reserve) is on `<listing_3>`'s editor in the admin.
* customer C is on the lot page for `<listing_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before change>` | 5 minutes |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | Bidding | House change | Highest bid after | Time left after |
| --- | --- | --- | --- | --- |
| Raise past the leader | customer A leads at 608000 with maximum 700000 | Raise to 800000 | 708000: customer A's maximum plus its 8000 increment, the house leading | `<extension duration>` from the raise |
| Raise while leading | The house leads at 508000 over customer A's maximum of 500000 | Raise to 800000 | 508000, unchanged | `<time left before change>`, less the time taken |
| Lower while leading | The house leads at 508000 over customer A's maximum of 500000 | Lower to 550000 | 508000, unchanged | `<time left before change>`, less the time taken |

**Steps:**

1. As the admin, make the row's house change and click Save.
2. As customer C, read Highest bid, the leader and Time left.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the row's Highest bid and Time left.
