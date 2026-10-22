# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/15
**Drafts styled:** 2026-10-22, tcs-rules r6
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-04, grade10-site-auction-bid-increments-SC-14

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=2 covers=g10.auction-bid-increments.SC-vqb -->
### g10.auction-bid-increments.US1-TC1: Opening minimum on a priced start is the starting price

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_1>`.
* `<listing_1>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_1 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | USD120 | (range: above 0 minor units) |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<starting price>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_1>` and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<starting price>`, with no increment added.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<starting price>` and bid count 1.
* Step 4 shows the user's own bid in Recent Bids as You.

---

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=2 covers=g10.auction-bid-increments.SC-mn9 -->
### g10.auction-bid-increments.US1-TC2: Boundary price takes the higher tier

Runs once per row of **Test data**, and once for every configured tier after the first.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_2>`.
* `<listing_2>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_2>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_2 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | `<current bid>` | Tier that sets `<increment>` | `<minimum next bid>` |
| --- | --- | --- | --- |
| 1 | The lower bound of the configured tier under test (fixed boundary) | That tier, which owns its lower bound | `<current bid>` plus `<increment>` |
| 2 | One whole dollar below the lower bound of the tier under test (fixed boundary) | The tier just below it | `<current bid>` plus `<increment>` |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_2>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`, where `<increment>` is the configured increment of the tier named in the row.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` and the bid count one higher.

---

<!-- trace:case id=g10.auction-bid-increments.TC-ujz rev=1 covers=g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC9: Opening minimum on a zero start is the lowest configured increment

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_3>`.
* `<listing_3>` is live, holds no bids, and its starting price is `<zero start>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_3 | A live listing with no bids, in USD; bind its identity only | · |
| zero start | USD0 | (fixed boundary), a start of 0 minor units |
| lowest increment | The configured increment of the lowest tier, the tier that holds 0 | (fixed configured value) |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<lowest increment>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_3>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<lowest increment>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<lowest increment>` and bid count 1.

---

<!-- trace:case id=g10.auction-bid-increments.TC-de8 rev=1 covers=g10.auction-bid-increments.SC-xjw -->
### g10.auction-bid-increments.US1-TC10: Next minimum adds the increment of the tier holding the current bid

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_4>`.
* `<listing_4>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_4>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_4 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | Tier of `<current bid>` | `<current bid>` | `<increment>` | `<minimum next bid>` | `<bid below minimum>` |
| --- | --- | --- | --- | --- | --- |
| 1 | The lowest tier, from 0 | A price inside that tier, above 0 (range: within the tier) | The configured increment of that tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |
| 2 | A configured tier above the lowest and below the last tier | A price inside that tier, away from both bounds (range: within the tier) | The configured increment of that tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |
| 3 | The unbounded last tier | A price inside the last tier, above its lower bound (range: above the lower bound) | The configured increment of the last tier | `<current bid>` plus `<increment>` | One whole dollar below `<minimum next bid>` |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<bid below minimum>` in the bid field.
3. Read the bid form.
4. Enter `<minimum next bid>` in the bid field.
5. Click **Place Bid**.
6. Reload `<listing_4>` and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`.
* Step 3 shows the bid cannot be placed, and nothing is recorded.
* Step 5 accepts the bid.
* Step 6 reads Highest bid `<minimum next bid>`, the bid count one higher, and the user's own bid in Recent Bids as You.

---

<!-- trace:case id=g10.auction-bid-increments.TC-d1v rev=1 -->
### g10.auction-bid-increments.US1-TC11: A maximum is beaten at the beaten maximum plus its own tier's increment

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
* `<listing_5>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_5 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | USD120 | (range: above 0 minor units), below every `<user B maximum>` |
| user A maximum | A price in a configured tier above the tier of `<user B maximum>`, with a different increment | (range: within that tier) |

| Row | `<user B maximum>` | Tier that sets `<increment>` | `<resolved price>` |
| --- | --- | --- | --- |
| 1 | A price inside one configured tier, away from both bounds (range: within the tier) | That tier, the tier of `<user B maximum>` | `<user B maximum>` plus `<increment>` |
| 2 | The lower bound of a configured tier above the lowest (fixed boundary) | That tier, which owns its lower bound | `<user B maximum>` plus `<increment>` |

**Steps:**

1. As user A, set a maximum of `<user A maximum>` and confirm.
2. As user B, set a maximum of `<user B maximum>` and confirm.
3. As user A, reload `<listing_5>` and read Highest bid and Recent Bids.

**Expected Results:**

* After step 1 user A leads at `<starting price>`.
* After step 2 user A still leads.
* Step 3 reads Highest bid `<resolved price>`, equal to `<user B maximum>` plus `<increment>`, not plus the increment at `<user A maximum>`.
* Step 3 shows no bid recorded at an amount between `<user B maximum>` and `<resolved price>`.

---

<!-- trace:case id=g10.auction-bid-increments.TC-fjl rev=1 -->
### g10.auction-bid-increments.US1-TC12: A maximum answers a manual bid at that bid plus its tier's increment

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_6>`.
* `<listing_6>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_6 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | A price inside a configured tier above the lowest tier, away from both bounds | (range: within that tier) |
| user A maximum | A price at least two tiers above `<starting price>` | (range: above the tier of `<starting price>`) |
| increment | The configured increment of the tier holding `<starting price>` | (fixed configured value) |
| resolved price | `<starting price>` plus `<increment>` | (fixed derived value) |

**Steps:**

1. As user A, set a maximum of `<user A maximum>` and confirm.
2. As user B, read Min on the bid panel.
3. As user B, enter `<starting price>` in the bid field and click **Place Bid**.
4. As user A, reload `<listing_6>` and read Highest bid, Your maximum and the bid count.

**Expected Results:**

* Step 2 reads Min equal to `<starting price>`.
* Step 4 reads Highest bid `<resolved price>`, equal to `<starting price>` plus `<increment>`.
* Step 4 shows user A still leads, with Your maximum `<user A maximum>`.

---

<!-- trace:case id=g10.auction-bid-increments.TC-gxd rev=1 covers=g10.auction-bid-increments.SC-a64,g10.auction-bid-increments.SC-bj0 -->
### g10.auction-bid-increments.US1-TC13: A schedule change moves an open listing's minimum and keeps its standing bid

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_7>` is open, in USD, and led by user A at `<standing bid>` with a maximum of `<standing maximum>`.
* Two schedules are available to the minimum calculation: `<schedule A>` and `<schedule B>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | An open USD listing led by user A, with recorded bids; bind its identity only | · |
| standing bid | A price inside a configured tier, away from both bounds | (range: within that tier) |
| standing maximum | A price above `<standing bid>` | (range: any amount above `<standing bid>`) |
| schedule A | The configured schedule | (fixed configured value) |
| old increment | The increment `<schedule A>` gives the tier holding `<standing bid>` | (fixed configured value) |
| schedule B | `<schedule A>` with the increment of the tier holding `<standing bid>` changed to `<new increment>` | (fixed, a second schedule, never the deployed file) |
| new increment | A positive whole-dollar amount different from `<old increment>` | (range: any such amount) |

**Steps:**

1. Read `<listing_7>`'s current bid, leader, maximum, bid count and recorded bids.
2. Read `<listing_7>`'s minimum next amount under `<schedule A>`.
3. Read `<listing_7>`'s minimum next amount under `<schedule B>`, with nothing written to `<listing_7>` between the reads.
4. Read `<listing_7>`'s current bid, leader, maximum, bid count and recorded bids again.

**Expected Results:**

* Step 2 reads `<standing bid>` plus `<old increment>`.
* Step 3 reads `<standing bid>` plus `<new increment>`, though `<listing_7>` was already open and holds no change of its own.
* Step 4 reads the same current bid `<standing bid>`, the same leader, the same maximum `<standing maximum>`, the same bid count and the same recorded bids as step 1.

---

<!-- trace:case id=g10.auction-bid-increments.TC-f10 rev=1 covers=g10.auction-bid-increments.SC-w3o -->
### g10.auction-bid-increments.US1-TC14: A bid at the old minimum is refused after a schedule change

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_8>` is open, in USD, and led by user A at `<standing bid>`.
* User B is signed in with `<card>` saved, and the minimum user B last read on `<listing_8>` is `<old minimum>`.
* `<schedule B>` is in force, and its increment for the tier holding `<standing bid>` is larger than `<schedule A>`'s.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_8 | An open USD listing led by user A; bind its identity only | · |
| standing bid | A price inside a configured tier, away from both bounds | (range: within that tier) |
| schedule A | The configured schedule | (fixed configured value) |
| old minimum | `<standing bid>` plus the increment `<schedule A>` gives that tier | (fixed derived value) |
| schedule B | `<schedule A>` with the increment of that tier raised to `<new increment>` | (fixed, a second schedule, never the deployed file) |
| new increment | A whole-dollar amount larger than the increment in `<schedule A>` | (range: any such amount) |
| new minimum | `<standing bid>` plus `<new increment>` | (fixed derived value) |

**Steps:**

1. As user B, submit a bid of `<old minimum>` on `<listing_8>`.
2. Read the API response.
3. Read `<listing_8>`'s current bid, leader and bid count.

**Expected Results:**

* Step 2 shows the bid is refused and names `<new minimum>` as the minimum.
* Step 3 reads current bid `<standing bid>`, user A leading, and the bid count as before step 1.

---

<!-- trace:case id=g10.auction-bid-increments.TC-epf rev=1 covers=g10.auction-bid-increments.SC-ywg -->
### g10.auction-bid-increments.US1-TC15: A resolved price reads the schedule in force and a later change leaves it

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_9>` is open, in USD, and led by user A with a maximum of `<user A maximum>`.
* User B is signed in with `<card>` saved and holds no bid on `<listing_9>`.
* `<schedule A>` is in force.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_9 | An open USD listing led by user A; bind its identity only | · |
| user A maximum | A price in a configured tier above the tier of `<user B maximum>` | (range: within that tier) |
| user B maximum | A price at least the minimum next amount and below `<user A maximum>`, inside one configured tier | (range: within that tier) |
| schedule A | The configured schedule | (fixed configured value) |
| increment | The increment `<schedule A>` gives the tier holding `<user B maximum>` | (fixed configured value) |
| resolved price | `<user B maximum>` plus `<increment>`, capped at `<user A maximum>` | (fixed derived value) |
| schedule B | `<schedule A>` with the increment of the tier holding `<user B maximum>` changed to another positive whole-dollar amount | (fixed, a second schedule, never the deployed file) |

**Steps:**

1. As user B, commit a maximum of `<user B maximum>` on `<listing_9>`.
2. Read `<listing_9>`'s current bid, leader and the recorded bids.
3. Put `<schedule B>` in force.
4. Read `<listing_9>`'s current bid, leader and the recorded bids again.

**Expected Results:**

* Step 2 reads current bid `<resolved price>`, equal to `<user B maximum>` plus `<increment>`, with user A leading.
* Step 4 reads the same current bid `<resolved price>`, the same leader and the same recorded bids as step 2.

---

<!-- trace:case id=g10.auction-bid-increments.TC-ht2 rev=1 covers=g10.auction-bid-increments.SC-cx4 -->
### g10.auction-bid-increments.US1-TC16: A bid with cents is refused

The bid panel's amount field keeps whole dollars and cannot type cents, so the route is a direct call to the bid API.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_14>` is open, in USD, and led by user A at `<standing bid>`, with a maximum of `<standing maximum>`.
* User B is signed in with `<card>` saved and holds no bid on `<listing_14>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_14 | An open USD listing led by user A; bind its identity only | · |
| standing bid | A whole-dollar price inside a configured tier | (range: within that tier) |
| standing maximum | A whole-dollar amount above `<standing bid>` | (range: any such amount) |
| minimum next bid | `<standing bid>` plus the configured increment of its tier | (fixed derived value), a whole-dollar amount |
| bid with cents | `<minimum next bid>` plus one minor unit | (fixed boundary), the smallest amount above the minimum that is not whole dollars |

**Steps:**

1. As user B, submit a bid of `<bid with cents>` on `<listing_14>` through the bid API.
2. Read the API response.
3. Read `<listing_14>`'s current bid, leader, maximum, bid count and recorded bids.
4. As user B, submit a bid of `<minimum next bid>` on `<listing_14>`.

**Expected Results:**

* Step 2 shows the bid is refused and names the whole-dollar rule.
* Step 3 reads current bid `<standing bid>`, user A leading with maximum `<standing maximum>`, the bid count as before step 1, and no recorded bid at `<bid with cents>`.
* Step 4 accepts the bid, so the refusal was for the cents and not for user B's standing.

---

<!-- trace:case id=g10.auction-bid-increments.TC-jbt rev=1 covers=g10.auction-bid-increments.SC-kc7 -->
### g10.auction-bid-increments.US1-TC17: A starting price with cents is refused

The listing editor's money field takes cents, so the route is the editor itself.

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An operator is signed in to the console and is on the editor of `<listing_15>`.
* `<listing_15>` is a draft in USD with a starting price of `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_15 | A draft listing in USD; bind its identity only | · |
| starting price | USD120 | (range: any whole-dollar amount) |
| starting price with cents | USD120.50 | (fixed boundary), a starting price that is not whole dollars |

**Steps:**

1. Enter `<starting price with cents>` in the starting price field and save the draft.
2. Read the starting price field and the message beside it.
3. Reload the editor and read the starting price.
4. Enter `<starting price>` and save the draft.

**Expected Results:**

* Step 2 shows the save is refused and the message names the whole-dollar rule.
* Step 3 reads `<starting price>`, the value before step 1.
* Step 4 saves the draft, so the refusal was for the cents.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=2 covers=g10.auction-bid-increments.SC-tke -->
### g10.auction-bid-increments.US3-TC3: A listing that was priced in HKD before the overwrite bids on the USD schedule

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_10>`.
* `<listing_10>` is open in USD, has an accepted bid of `<current bid>` and carries no other currency.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| current bid | USD8,000 | (range: above 0 minor units) |
| increment | The configured increment of the tier holding `<current bid>` | (fixed configured value) |

| Row | `<listing_10>` | Why this row |
| --- | --- | --- |
| 1 | A listing created in USD | The schedule as it always read |
| 2 | A listing created in HKD and overwritten to USD, amounts unchanged | A listing that existed before this change |

**Steps:**

1. Open the bid panel on `<listing_10>`.
2. Read Highest bid and Min.

**Expected Results:**

* Step 2 reads Highest bid `<current bid>` in USD on both rows.
* Step 2 reads Min equal to `<current bid>` plus `<increment>`, in USD.
* No HKD amount shows.

---

<!-- trace:case id=g10.auction-bid-increments.TC-hod rev=1 covers=g10.auction-bid-increments.SC-p50 -->
### g10.auction-bid-increments.US3-TC5: Two listings at one price share one increment

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved.
* `<listing_11>` and `<listing_12>` are live, in different categories, with different starting prices.
* Each of them has the current bid `<current bid>`, placed by another user.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_11 | A live listing in USD, in its own category, with bids from other users; bind its identity only | · |
| listing_12 | A live listing in USD, in another category, with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the lowest tier, away from both bounds | (range: within that tier) |
| increment | The configured increment of the tier holding `<current bid>` | (fixed configured value) |
| minimum next bid | `<current bid>` plus `<increment>` | (fixed derived value) |

**Steps:**

1. Navigate to `<listing_11>` and read Highest bid and Min.
2. Navigate to `<listing_12>` and read Highest bid and Min.

**Expected Results:**

* Step 1 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Step 2 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Both listings use the same increment, though their starting prices and categories differ.

---

<!-- trace:case id=g10.auction-bid-increments.TC-zdo rev=1 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US3-TC6: Bid surfaces read in USD from the field to the record

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_13>`.
* `<listing_13>` is live, in USD, and its current bid is `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_13 | A live listing in USD with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the lowest tier | (range: within that tier) |
| minimum next bid | `<current bid>` plus the configured increment of its tier | (fixed derived value) |

**Steps:**

1. Read Highest bid, Min and the currency of the bid field.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_13>` and read Highest bid and Recent Bids.

**Expected Results:**

* Step 1 reads Highest bid and Min in USD, and the bid field takes USD.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` in USD, and the user's own bid in Recent Bids in USD.

---

<!-- trace:case id=g10.auction-bid-increments.TC-c9i rev=1 covers=g10.auction-bid-increments.SC-bs0 -->
### g10.auction-bid-increments.US3-TC7: The configured schedule starts at 0 and its last tier is unbounded

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* The USD schedule in force for every auction is configured.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| zero amount | USD0 | (fixed boundary), 0 minor units |
| large amount | USD10,000,000 | (fixed boundary), the ceiling, above the lower bound of every tier |

**Steps:**

1. Read the configured USD schedule.
2. Select the tier for `<zero amount>`.
3. Select the tier for `<large amount>`.
4. Compare each tier's lower bound with the one before it.
5. Select the tier for each tier's lower bound, and for the amount one whole dollar below it.

**Expected Results:**

* Step 1 reads one schedule for USD, with no per-listing schedule beside it.
* Step 2 selects the first tier, whose lower bound is 0, so no amount lies below it.
* Step 3 selects the last tier, which has no upper bound.
* Step 4 reads lower bounds in strictly rising order.
* Step 5 selects the tier that owns the lower bound, and the tier before it for the amount one whole dollar below, so every amount from 0 upward falls in exactly one tier.

## Settled

- A first bid is accepted at the opening price: the starting price, or the lowest configured increment on a 0 start. From the first accepted bid, the current bid plus the increment of its tier applies.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid or a maximum below the minimum the server now holds is refused, names that minimum, and records nothing (Q7).
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount and the earlier resolutions stand (Q8).
- A bid, a maximum, every tier bound and every increment are whole-dollar amounts; a bid with cents is refused, naming the rule, and nothing moves. One whole dollar below a bound is in the lower tier, and one whole dollar below the minimum is below it (Q9, the product manager's answer).
- A listing's starting price is a whole-dollar amount too, so the opening minimum is one a collector can bid; a starting price with cents is refused, naming the rule (Q16, the product manager's answer).
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement (Q10).
- A house maximum and an extended-bidding bid read the same schedule as any bid (Q11).
- A configured schedule is held valid by a test that runs in CI: a tier from 0, ascending tiers with no shared lower bound, whole-dollar tier bounds, positive whole-dollar increments (Q9), a non-empty list and an unbounded last tier. No runtime check refuses a bad file, and no scenario or case drives one (Q12, the product manager's answer).
- The lowest tier is configured like any other: the opening minimum on a 0 start is the lowest configured increment, and no case or scenario fixes it at one value (Q13, the product manager's answer).
- The neighbouring capabilities' worked amounts are examples under another set of configuration values; their suites are not rewritten here (Q14, the product manager's answer).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-22, rerun after the product manager answered Q12 to Q14 and Q15 was raised, for change `configure-auction-bid-increments`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01` and `grade10-site-auction-bid-increments-US-03`. The rerun repaired ids, layers and coverage; it did not regenerate cases from scenarios. QA1's own bundle is its statement and cannot be checked here. The wording patch that took the fixed 100 minor units from the requirement, the scenarios and the feature-set line is a clarification of an anchor, not a new one, so QA1 and Dev did not run again (Q13). The product manager then reversed Q9 to whole dollars only: the patch reworded the boundary text, added `SC-23` and `US1-TC16`, and did not rerun QA1 or Dev. The product manager then answered Q16, a whole-dollar starting price: the patch added `SC-24` and `US1-TC17`, and did not rerun QA1 or Dev. This line is a statement, not proof.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| `US1-TC1` | **Retained, revises the durable case of the same id** (`TC-2ed`, rev 2): the priced start only; the zero-start row moved to `US1-TC9` | `grade10-site-auction-bid-increments-SC-01` |
| `US1-TC2` | **Retained, revises the durable case of the same id** (`TC-0lh`, rev 2, back to draft): a price on a bound takes the higher tier, for every tier after the first and one whole dollar below each bound (Q9) | `grade10-site-auction-bid-increments-SC-02` |
| `US1-TC9` | **Retained, renumbered** (QA1's zero-start case; its id and number collided with the durable `TC-0lh`): a 0 start opens at the lowest configured increment | `grade10-site-auction-bid-increments-SC-12` |
| `US1-TC10` | **Retained, renumbered** (QA1's next-minimum case, which collided with the durable `TC-qui`): the lowest, a middle and the last tier | `grade10-site-auction-bid-increments-SC-07` |
| `US1-TC11` | **Retained, renumbered** (collided with the durable `TC-kyx`): a maximum is beaten at the beaten maximum plus its own tier's increment | none: `grade10-site-auction-bid-increments-SC-20` also states that a later change leaves the current bid, which no step here changes; `US1-TC15` asserts it |
| `US1-TC12` | **Retained, renumbered** (collided with the durable `TC-n6d`): a typed amount answered by a standing maximum | none: no scenario states a manual bid answered by a maximum beyond the requirement's prose |
| `US1-TC13` | **Reshaped from QA1's `US1-TC7`, renumbered, moved to the `api` layer** (the id collided with the durable `TC-9do`): `tech-design.md` says e2e cannot swap the schedule at run time, so a second schedule is passed to the minimum calculation | `grade10-site-auction-bid-increments-SC-17`, `grade10-site-auction-bid-increments-SC-18` |
| `US1-TC14` | **New, api layer:** a bid at the old minimum is refused after a change, naming the new minimum | `grade10-site-auction-bid-increments-SC-19` |
| `US1-TC15` | **New, api layer:** a resolved price reads the schedule in force and a later change leaves it | `grade10-site-auction-bid-increments-SC-20` |
| `US1-TC16` | **New, api layer, added for Q9:** a bid with cents is refused naming the whole-dollar rule, and nothing moves; api because the bid panel's field cannot type cents | `grade10-site-auction-bid-increments-SC-23` |
| `US1-TC17` | **New, e2e layer, added for Q16:** a starting price with cents is refused in the listing editor, naming the whole-dollar rule, and the saved price stays | `grade10-site-auction-bid-increments-SC-24` |
| `US3-TC3` | **Revises the durable case of the same id** (`TC-sze`, rev 2): the minimum reads the current bid plus the configured increment, not a quoted amount; `usd-lot-currency-winner-settlement-choice` carries it at rev 1 with a quoted `USD8,050.00` | `grade10-site-auction-bid-increments-SC-13` |
| `US3-TC5` | **Retained, renumbered** (QA1's `US3-TC1`, which collided with the durable `TC-y0l`): two listings at one price share one increment | `grade10-site-auction-bid-increments-SC-21` |
| `US3-TC6` | **Retained, renumbered** (QA1's `US3-TC2`, which collided with the durable `TC-fdc`): Min and the bid read in USD | `grade10-site-auction-bid-increments-SC-05` |
| `US3-TC7` | **Retained, renumbered, `unit` layer** (QA1's `US3-TC3`, which collided with the durable `TC-sze`): the schedule starts at 0 and its last tier is unbounded | `grade10-site-auction-bid-increments-SC-22` |

- **Covers links** - `TC-2ed` to `SC-vqb`, `TC-0lh` to `SC-mn9`, `TC-sze` to `SC-tke`, and each new case to the scenario named in the table, by the scenario's trace id. A scenario is linked only when the case's route asserts every THEN and AND line of it
- **Uncovered scenarios** - none without a case or a named verifier:
  - `grade10-site-auction-bid-increments-SC-03` and `grade10-site-auction-bid-increments-SC-04` are **Out of suite**: the durable `g10.auction-bid-increments.US1-TC3` (a bid above the minimum is accepted) and `g10.auction-bid-increments.US1-TC4` (a bid below it is refused and names it) assert them, and this change does not alter what those cases verify, with one exception held under Durable cases below; the amounts they quote are examples of a given minimum
  - `grade10-site-auction-bid-increments-SC-14` is **Out of suite**: the case that asserts it is `usd-lot-currency-winner-settlement-choice`'s `g10.auction-bid-increments.US3-TC4`, which that change folds first (Q15); this change restates the scenario unchanged
- **Over-claimed cases** - none: no case carries a `covers` link its route does not assert
- **Contradictions** - none open, apart from the held durable cases above. QA1's `US1-TC2` read the opening minimum on a 0 start as the lowest configured increment while Dev's `SC-12` fixed it at 100 minor units; Q13 settled it for QA1's reading, and the requirement, `SC-12` and the feature-set line no longer state 100
- **Routes that differ, not contradictions** - `US1-TC10` stops at the bid form, below the minimum by one whole dollar, while `SC-04` reaches the server; the PRD's Refusals table gives each route its own line. `US1-TC14` reaches the server through a page that still shows the old minimum
- **Id collisions, resolved** - QA2's first report found that nine of QA1's case ids and heading numbers were the durable suite's for other cases, and that `usd-lot-currency-winner-settlement-choice` carries `TC-2ed`, `TC-kyx`, `TC-n6d`, `TC-9do`, `TC-y0l`, `TC-fdc`, `TC-sze` and `TC-pn8` under the durable text. Cases that revise a durable case keep its id and number and bump `rev`: `TC-2ed`, `TC-0lh` and `TC-sze` to 2, each above the sibling's rev 1. Every other case takes a fresh number from `pnpm run spec:issue` (`US1-TC9` to `US1-TC17`, `US3-TC5` to `US3-TC7`) and a fresh trace id. The durable `TC-qui`, `TC-5ez`, `TC-kyx`, `TC-n6d`, `TC-9do`, `TC-4ox`, `TC-y0l`, `TC-fdc` and `TC-pn8` stay as the durable suite and the sibling hold them
- **Durable cases left to keep their amounts** - `g10.auction-bid-increments.US1-TC3` and the domain suite quote amounts from the old six tiers (USD105, USD126, USD5, USD10). They state a given minimum or an increment as an example, as Q14 reads the neighbouring specs. A reviewer may restyle them against the configured values after deploy
- **Durable cases that carry cents, held** - after Q9, `US1-TC4` (USD104.99, the verifier of `SC-04`), `US1-TC6` (a USD2.50 higher bid) and `US1-TC7` (USD0.99 and USD104.99 bids) quote amounts the product no longer accepts, and the main suite's walk rows quote USD99.99 and USD100.99. Each needs a whole-dollar restyle and a `rev` bump, and `US1-TC4` is `actual` and automated, so it returns to draft. They are not rewritten here: `TC-n6d` and `TC-9do` are also carried, at other revisions, by `usd-lot-currency-winner-settlement-choice` (Q15), so the product manager or the cluster sheet owns the order of those bumps
- **Layer** - `US1-TC13` to `US1-TC15` are `api` and `US3-TC7` is `unit`, Testability `automation`: a second schedule is a test seam no tester can reach by hand, and the application's DB lane and contracts tests are where `tech-design.md` puts them
- **Case duplication, checked** - `US1-TC15` repeats `US1-TC11`'s route at the `api` layer and adds the later change; it is kept because `US1-TC11` cannot change the schedule. `US3-TC5` and the durable `TC-y0l` both assert one schedule: `TC-y0l` across two price ranges, `US3-TC5` at one price
- **Config validity** - held by a contracts test, not by a scenario or a case (Q12); `US3-TC7` asserts only the shape the requirement states as a rule
- **Blindness** - unchanged from the first reconciliation: QA1 does not look contaminated and Dev looks anchored but shaped; neither reading asserts the other way

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-03`.
