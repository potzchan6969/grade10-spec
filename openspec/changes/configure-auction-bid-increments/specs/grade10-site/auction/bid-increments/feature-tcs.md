# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-22, tcs-rules r6

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=1 -->
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
| starting price | USD120 | (range: 100–99999 minor units, above 0) |

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

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=1 -->
### g10.auction-bid-increments.US1-TC2: Opening minimum on a zero start is the lowest configured increment

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

* A user is signed in with `<card>` saved and is on `<listing_2>`.
* `<listing_2>` is live, holds no bids, and its starting price is `<zero start>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_2 | A live listing with no bids, in USD; bind its identity only | · |
| zero start | USD0 | (fixed boundary), a start of 0 minor units |
| lowest increment | USD1 | (fixed configured value), the increment of the $1 floor tier from $0 |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<lowest increment>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_2>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<lowest increment>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<lowest increment>` and bid count 1.

---

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 -->
### g10.auction-bid-increments.US1-TC3: Next minimum adds the increment of the tier holding the current bid

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

Runs once per row of **Test data**.

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_3>`.
* `<listing_3>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_3>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_3 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | Tier of `<current bid>` | `<current bid>` | `<increment>` | `<minimum next bid>` | `<bid below minimum>` |
| --- | --- | --- | --- | --- | --- |
| 1 | The $1 floor tier | USD3 (fixed, inside the floor tier) | USD1 (fixed configured value) | USD4 (fixed derived value), `<current bid>` plus `<increment>` | USD3 (fixed derived value), one major unit below `<minimum next bid>` |
| 2 | A configured tier above the floor and below the last tier | A price inside that tier, away from both bounds (range: within the tier) | The configured increment of that tier | `<current bid>` plus `<increment>` | One major unit below `<minimum next bid>` |
| 3 | The unbounded last tier | A price inside the last tier, above its lower bound (range: above the lower bound) | The configured increment of the last tier | `<current bid>` plus `<increment>` | One major unit below `<minimum next bid>` |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<bid below minimum>` in the bid field.
3. Read the bid form.
4. Enter `<minimum next bid>` in the bid field.
5. Click **Place Bid**.
6. Reload `<listing_3>` and read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`.
* Step 3 shows the bid cannot be placed, and nothing is recorded.
* Step 5 accepts the bid.
* Step 6 reads Highest bid `<minimum next bid>`, the bid count one higher, and the user's own bid in Recent Bids as You.

---

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=1 -->
### g10.auction-bid-increments.US1-TC4: A price on a tier bound takes the higher tier's increment

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

Runs once per row of **Test data**.

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_4>`.
* `<listing_4>` is live, its current bid is `<current bid>` and was placed by another user.
* The user holds no bid on `<listing_4>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_4 | A live listing with bids from other users, in USD; bind its identity only | · |

| Row | `<current bid>` | Tier that sets `<increment>` | `<minimum next bid>` |
| --- | --- | --- | --- |
| 1 | The lower bound of the second configured tier, where the $1 floor tier ends (fixed boundary) | The second tier, which owns its lower bound | `<current bid>` plus the second tier's configured increment |
| 2 | The highest whole major unit below the lower bound of the second tier (fixed boundary) | The $1 floor tier, though `<minimum next bid>` reaches or passes the bound | `<current bid>` plus USD1 |
| 3 | The lower bound of the unbounded last tier (fixed boundary) | The last tier, which owns its lower bound | `<current bid>` plus the last tier's configured increment |
| 4 | The highest whole major unit below the lower bound of the last tier (fixed boundary) | The tier just below the last tier | `<current bid>` plus that tier's configured increment |

**Steps:**

1. Read Min on the bid panel.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_4>` and read Highest bid and the bid count.

**Expected Results:**

* Step 1 reads Min equal to `<minimum next bid>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` and the bid count one higher.

---

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=1 -->
### g10.auction-bid-increments.US1-TC5: A maximum is beaten at the beaten maximum plus its own tier's increment

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

Runs once per row of **Test data**.

**Pre-conditions:**

* User A and user B are signed in on separate sessions with `<card>` saved, both on `<listing_5>`.
* `<listing_5>` is live, holds no bids, and its starting price is `<starting price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_5 | A live listing with no bids, in USD; bind its identity only | · |
| starting price | USD120 | (range: 100–99999 minor units, above 0), below every `<user B maximum>` |
| user A maximum | A price in a configured tier above the tier of `<user B maximum>`, with a different increment | (range: within that tier) |

| Row | `<user B maximum>` | Tier that sets `<increment>` | `<resolved price>` |
| --- | --- | --- | --- |
| 1 | A price inside one configured tier, away from both bounds (range: within the tier) | That tier, the tier of `<user B maximum>` | `<user B maximum>` plus `<increment>` |
| 2 | The lower bound of a configured tier above the floor (fixed boundary) | That tier, which owns its lower bound | `<user B maximum>` plus `<increment>` |

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

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=1 -->
### g10.auction-bid-increments.US1-TC6: A maximum answers a manual bid at that bid plus its tier's increment

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
| starting price | A price inside a configured tier above the $1 floor tier, away from both bounds | (range: within that tier) |
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

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=1 -->
### g10.auction-bid-increments.US1-TC7: A schedule change reaches an open listing on the next bid and leaves the standing bid alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* User A is signed in with `<card>` saved and leads `<listing_7>` at `<standing bid>`, with no maximum.
* User B is signed in with `<card>` saved and is on `<listing_7>`.
* `<listing_7>` is live, and the configured schedule gives the tier holding `<standing bid>` the increment `<old increment>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_7 | A live listing led by user A at `<standing bid>`, in USD; bind its identity only | · |
| standing bid | A price inside a configured tier above the $1 floor tier, away from both bounds | (range: within that tier) |
| old increment | The configured increment of that tier before the change | (fixed configured value) |
| new increment | A configured increment for that tier above `<old increment>`, still inside the tier's width | (fixed configured value) |
| old minimum | `<standing bid>` plus `<old increment>` | (fixed derived value) |
| new minimum | `<standing bid>` plus `<new increment>` | (fixed derived value) |

**Steps:**

1. As user B, read Min on the bid panel.
2. Change the configured schedule so that tier's increment is `<new increment>`, and deploy it.
3. As user B, reload `<listing_7>` and read Min, Highest bid and Recent Bids.
4. As user B, enter `<old minimum>` in the bid field and read the bid form.
5. Enter `<new minimum>` in the bid field and click **Place Bid**.
6. Reload `<listing_7>` and read Highest bid and Recent Bids.

**Expected Results:**

* Step 1 reads Min equal to `<old minimum>`.
* Step 3 reads Min equal to `<new minimum>`, though `<listing_7>` was already open.
* Step 3 still reads Highest bid `<standing bid>` with user A leading, and Recent Bids shows the amounts already recorded unchanged.
* Step 4 shows the bid cannot be placed, and nothing is recorded.
* Step 6 reads Highest bid `<new minimum>` and user B leading.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-y0l rev=1 -->
### g10.auction-bid-increments.US3-TC1: Two listings at one price share one increment

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
* `<listing_8>` and `<listing_9>` are live, in different categories, with different starting prices.
* Each of them has the current bid `<current bid>`, placed by another user.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_8 | A live listing in USD, in its own category, with bids from other users; bind its identity only | · |
| listing_9 | A live listing in USD, in another category, with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the $1 floor tier, away from both bounds | (range: within that tier) |
| increment | The configured increment of the tier holding `<current bid>` | (fixed configured value) |
| minimum next bid | `<current bid>` plus `<increment>` | (fixed derived value) |

**Steps:**

1. Navigate to `<listing_8>` and read Highest bid and Min.
2. Navigate to `<listing_9>` and read Highest bid and Min.

**Expected Results:**

* Step 1 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Step 2 reads Highest bid `<current bid>` and Min `<minimum next bid>`.
* Both listings use the same increment, though their starting prices and categories differ.

---

<!-- trace:case id=g10.auction-bid-increments.TC-fdc rev=1 -->
### g10.auction-bid-increments.US3-TC2: Bid surfaces read in USD from the field to the record

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

* A user is signed in with `<card>` saved and is on `<listing_10>`.
* `<listing_10>` is live, in USD, and its current bid is `<current bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_10 | A live listing in USD with bids from other users; bind its identity only | · |
| current bid | A price inside a configured tier above the $1 floor tier | (range: within that tier) |
| minimum next bid | `<current bid>` plus the configured increment of its tier | (fixed derived value) |

**Steps:**

1. Read Highest bid, Min and the currency of the bid field.
2. Enter `<minimum next bid>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_10>` and read Highest bid and Recent Bids.

**Expected Results:**

* Step 1 reads Highest bid and Min in USD, and the bid field takes USD.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<minimum next bid>` in USD, and the user's own bid in Recent Bids in USD.

---

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=1 -->
### g10.auction-bid-increments.US3-TC3: The configured schedule has a floor tier and an unbounded last tier

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

**Steps:**

1. Read the configured USD schedule.
2. Read the tier that holds a price of USD0.
3. Read the tier with the highest lower bound.
4. Compare each tier's lower bound with the one before it.

**Expected Results:**

* Step 1 reads one schedule for USD, with no per-listing schedule beside it.
* Step 2 reads a floor tier whose lower bound is USD0 and whose increment is USD1.
* Step 3 reads a last tier with no upper bound.
* Step 4 reads lower bounds in strictly rising order, each tier owning its lower bound, so every price from USD0 up falls in exactly one tier.
