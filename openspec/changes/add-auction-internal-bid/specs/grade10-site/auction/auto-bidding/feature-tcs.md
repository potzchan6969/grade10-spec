# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-auto-bidding-US3: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

### grade10-site-auction-auto-bidding-US3-TC7-1: A collector's maximum resolves against the house maximum like any other

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_1>`'s internal bid of `<house maximum>` was committed at its time, and the house leads at `<starting price>` with no other bid.
* customer A(card linked) is signed in on the lot page for `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing taking bids, starting price `<starting price>`, scheduled close a day away |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |

| Row | customer A's maximum | Leader | Highest bid |
| --- | --- | --- | --- |
| Below the house | 500000 | The house | 508000: customer A's maximum plus its 8000 increment |
| One increment short of the house | 592000 | The house | 600000: customer A's maximum plus 8000, capped at `<house maximum>` |
| Above the house | 700000 | customer A | 608000: `<house maximum>` plus its 8000 increment |

**Steps:**

1. As customer A, enter the row's maximum in the custom maximum on the bid panel and confirm.
2. Read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 1 is accepted.
* Step 2: the leader and Highest bid read the row's values; customer A reads Outbid or Leading to match.
* Step 2: Recent bids lists customer A's bid and the house's bid that answers it, the house under its listing pseudonym.

### grade10-site-auction-auto-bidding-US3-TC8-1: A tie with the house stays with whoever committed first

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_2>` is published and taking bids, with an internal bid of `<equal maximum>`.
* The order of commitments is as the row states.
* customer A(card linked) is signed in on the lot page for `<listing_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published HKD listing taking bids, starting price 400000 minor units, scheduled close a day away |
| `<equal maximum>` | 600000 minor units (HK$6,000.00), the house's and customer A's maximum |

| Row | First committed | Then committed | Leader | Highest bid |
| --- | --- | --- | --- | --- |
| Collector earlier | customer A, `<equal maximum>`, before the internal bid's time | The house, at its time | customer A | `<equal maximum>` |
| House earlier | The house, at its time | customer A, `<equal maximum>`, after the internal bid's time | The house | `<equal maximum>` |

**Steps:**

1. Let the row's two commitments happen in its order.
2. As customer A, read the standing, Highest bid and Recent bids.

**Expected Results:**

* Step 2: the leader is the row's leader, the earlier maximum.
* Step 2: Highest bid reads `<equal maximum>`.
* Step 2: Recent bids lists both bids at `<equal maximum>`, the earlier maximum's row first.

### grade10-site-auction-auto-bidding-US3-TC9-1: A collector learns nothing of the house beyond a bidder's pseudonym

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
* **Trace:** grade10-site-auction-auto-bidding-US-03

**Pre-conditions:**

* `<listing_3>`'s internal bid of `<house maximum>` is committed, and the house leads at `<current bid>` over customer A's maximum `<customer A maximum>`.
* `<listing_4>` is published and taking bids with no internal bid, led by customer B at `<current bid>` with maximum `<house maximum>`, over customer A's maximum `<customer A maximum>`.
* customer C is signed in, has never bid on either lot, and is on the lot page for `<listing_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A published HKD listing taking bids, protected by an internal bid |
| `<listing_4>` | A published HKD listing taking bids, with no internal bid |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<customer A maximum>` | 500000 minor units (HK$5,000.00) |
| `<current bid>` | 508000 minor units: `<customer A maximum>` plus its 8000 increment |

**Steps:**

1. As customer C, read the bid panel, Highest bid and Recent bids on `<listing_3>`.
2. Read the API response for `<listing_3>`'s public facts.
3. Open the lot page for `<listing_4>` and read the same.
4. Read the API response for `<listing_4>`'s public facts.

**Expected Results:**

* Step 1 reads like step 3: the leader's row carries a listing pseudonym, with no house, reserve or floor wording.
* Step 2 reads like step 4, save the pseudonyms and times: no field names the house or holds `<house maximum>`.
* Neither lot shows the leader's maximum.

---

## grade10-site-auction-auto-bidding-US4: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

### grade10-site-auction-auto-bidding-US4-TC2-1: The house's commitments are traced with when they were accepted

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-04

**Pre-conditions:**

* customer A committed `<customer A maximum>` on `<listing_5>`.
* `<listing_5>`'s internal bid of `<house maximum>` was committed at `<commit time>`, then raised to `<raised maximum>` at `<raise time>`.
* admin(holds auction:reserve and auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published HKD listing taking bids |
| `<customer A maximum>` | 700000 minor units (HK$7,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | The internal bid's set time |
| `<raised maximum>` | 750000 minor units (HK$7,500.00) |
| `<raise time>` | When the admin saved the raise |

**Steps:**

1. Open `<listing_5>`'s bid history.
2. Read each committed maximum.

**Expected Results:**

* Step 2 lists customer A's commitment, with its Accepted At.
* Step 2 lists the house's `<house maximum>` accepted at `<commit time>`, not at when it was set.
* Step 2 lists the house's `<raised maximum>` accepted at `<raise time>`, as a new commitment.
