# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/14
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-14

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

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=2 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC4: Amount below the minimum is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| `<minimum>` | `<bid amount>` | Fixture notes |
| --- | ---: | --- |
| USD105 | USD104 | `<minimum>`: (range: 10000–49999 minor units); `<bid amount>`: 10400 USD minor units, one whole dollar below `<minimum>` |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid of `<bid amount>` is refused.
* The refusal names `<minimum>` as the minimum.

---

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=4 covers=g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t -->
### g10.auction-bid-increments.US1-TC6: First bid accepts the opening price then advances one tier

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing has starting price `<starting price>` and no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| `<starting price>` | `<first bid>` | `<increment>` | `<minimum next amount>` | `<higher bid>` | Fixture notes |
| --- | --- | --- | --- | --- | --- |
| USD0 | USD1 | USD1 | USD2 | USD3 | `<first bid>`: (range: 100-9999 minor units); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |
| USD100 | USD100 | USD5 | USD105 | USD120 | `<starting price>`: (fixed tier boundary); `<first bid>`: (fixed tier boundary); `<increment>`: (fixed tier increment); `<minimum next amount>`: (derived); `<higher bid>`: (above the minimum) |

**Steps:**

1. Enter `<first bid>` in the bid field and confirm it.
2. Read the minimum next amount.
3. Enter `<higher bid>` and confirm it.
4. Read the highest bid.

**Expected Results:**

* Step 1: the bid is accepted.
* Step 2: the next minimum reads `<minimum next amount>`, equal to `<first bid>` plus `<increment>`.
* Step 3: the higher bid is accepted.
* Step 4: the highest bid is `<higher bid>`.

---

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=5 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: First bid below opening price is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* An open USD listing has opening price `<opening price>` and no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| `<opening price>` | `<bid amount>` | Fixture notes |
| --- | --- | --- |
| USD100 | USD99 | `<opening price>`: (fixed tier boundary); `<bid amount>`: (fixed boundary) |
| USD105 | USD104 | `<opening price>`: (fixed opening price); `<bid amount>`: (one whole dollar below `<opening price>`) |

**Steps:**

1. Enter `<bid amount>` in the custom maximum field.
2. Read the bid panel.
3. Reload the listing page and read the bid panel.

**Expected Results:**

* Step 2: the custom field says Min: `<opening price>`, and the bid action stays disabled.
* The listing remains without an accepted bid, and the minimum remains `<opening price>`.

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

<!-- trace:case id=g10.auction-bid-increments.TC-0es rev=1 covers=g10.auction-bid-increments.SC-n5d -->
### g10.auction-bid-increments.US1-TC19: A stored starting price with cents opens at the next whole dollar

The row is seeded in the database, because no screen saves a starting price with cents.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* A user is signed in with `<card>` saved and is on `<listing_14>`.
* `<listing_14>` is live, holds no bids, and was stored with a starting price of `<stored price>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| card | Visa ending 4242 | · |
| listing_14 | A live listing with no bids, in USD, seeded with a starting price that has cents; bind its identity only | · |
| stored price | USD120.50 | (fixed boundary), between two whole dollars |
| opening minimum | USD121 | (fixed derived value), the next whole dollar at or above `<stored price>` |

**Steps:**

1. Read the starting price and Min on the bid panel.
2. Enter `<opening minimum>` in the bid field.
3. Click **Place Bid**.
4. Reload `<listing_14>` and read the starting price, Highest bid and the bid count.

**Expected Results:**

* Step 1 reads the starting price `<stored price>` and Min `<opening minimum>`.
* Step 3 accepts the bid.
* Step 4 reads Highest bid `<opening minimum>`, bid count 1, and the starting price still `<stored price>`.

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

## Settled

- A first bid is accepted at the opening price: the starting price, or the lowest configured increment on a 0 start. From the first accepted bid, the current bid plus the increment of its tier applies.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid or a maximum below the minimum the server now holds is refused, names that minimum, and records nothing (Q7).
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount and the earlier resolutions stand (Q8).
- A bid, a maximum, every tier bound and every increment are whole-dollar amounts; a bid with cents is refused, naming the rule, and nothing moves. One whole dollar below a bound is in the lower tier, and one whole dollar below the minimum is below it (Q9, the product manager's answer).
- A starting price an operator sets, or a consignment ask sets, is a whole-dollar amount; one with cents is refused, naming the rule, and the listing is unchanged or not made (Q16 and Q19, the product manager's answers). A starting price already stored with cents is left as it is (Q18) and opens at the next whole dollar at or above it, while the page still shows the stored price (Q20); `US1-TC19` drives it. A consignment screen refuses a floor with cents on entry (Q21); `add-consignment` owns that screen, so no case here drives it.
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement (Q10).
- A house maximum and an extended-bidding bid read the same schedule as any bid (Q11); `SC-27` states it and `US1-TC20` drives it.
- A configured schedule is held valid by a test that runs in CI: a tier from 0, ascending tiers with no shared lower bound, whole-dollar tier bounds, positive whole-dollar increments (Q9), a non-empty list and an unbounded last tier. No runtime check refuses a bad file, and no scenario or case drives one (Q12, the product manager's answer).
- The lowest tier is configured like any other: the opening minimum on a 0 start is the lowest configured increment, and no case or scenario fixes it at one value (Q13, the product manager's answer).
- The neighbouring capabilities' worked amounts are examples under another set of configuration values; their suites are not rewritten here (Q14, the product manager's answer).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-22, rerun after the product manager answered Q12 to Q14 and Q15 was raised, for change `configure-auction-bid-increments`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01` and `grade10-site-auction-bid-increments-US-03`. The rerun repaired ids, layers and coverage; it did not regenerate cases from scenarios. QA1's own bundle is its statement and cannot be checked here. The wording patch that took the fixed 100 minor units from the requirement, the scenarios and the feature-set line is a clarification of an anchor, not a new one, so QA1 and Dev did not run again (Q13). The product manager then reversed Q9 to whole dollars only: the patch reworded the boundary text, added `SC-23` and `US1-TC16`, and did not rerun QA1 or Dev. The product manager then answered Q16, a whole-dollar starting price: the patch added `SC-24` and `US1-TC17`, and did not rerun QA1 or Dev. The product manager then answered Q17 to Q19 (an admin delta, stored rows left as they are, a consigned create refused like any other): the patch scoped the rule to a price being set, added `SC-25`, `SC-26` and `US1-TC18`, withdrew the claim that the opening minimum is always biddable, and did not rerun QA1 or Dev. The product manager then answered Q20 and Q21 (a stored price with cents opens at the next whole dollar; the consignment screen refuses a floor with cents): the patch rewrote `SC-26` at rev 2 to assert the opening minimum, added `US1-TC19`, and did not rerun QA1 or Dev. The product manager then asked for the durable cases that carry cents to be restyled to whole dollars in this suite, and for Q11 to be stated: the patch restyled `US1-TC4`, `US1-TC6` and `US1-TC7` added `SC-27` and `US1-TC20`, and did not rerun QA1 or Dev. This line is a statement, not proof.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| `US1-TC1` | **Retained, revises the durable case of the same id** (`TC-2ed`, rev 2): the priced start only; the zero-start row moved to `US1-TC9` | `grade10-site-auction-bid-increments-SC-01` |
| `US1-TC2` | **Retained, revises the durable case of the same id** (`TC-0lh`, rev 2, back to draft): a price on a bound takes the higher tier, for every tier after the first and one whole dollar below each bound (Q9) | `grade10-site-auction-bid-increments-SC-02` |
| `US1-TC9` | **Retained, renumbered** (QA1's zero-start case; its id and number collided with the durable `TC-0lh`): a 0 start opens at the lowest configured increment | `grade10-site-auction-bid-increments-SC-12` |
| `US1-TC10` | **Retained, renumbered** (QA1's next-minimum case, which collided with the durable `TC-qui`): the lowest, a middle and the last tier | `grade10-site-auction-bid-increments-SC-07` |
| `US1-TC11` | **Retained, renumbered** (collided with the durable `TC-kyx`): a maximum is beaten at the beaten maximum plus its own tier's increment | none: `grade10-site-auction-bid-increments-SC-20` also states that a later change leaves the current bid, which no step here changes; `US1-TC15` asserts it |
| `US1-TC12` | **Retained, renumbered** (collided with the durable `TC-n6d`): a typed amount answered by a standing maximum | none: `grade10-site-auction-bid-increments-SC-20` states a maximum answered by a maximum and a later change, and no scenario states the manual-bid input beyond the requirement's prose (see A manual bid answered by a maximum below) |
| `US1-TC13` | **Reshaped from QA1's `US1-TC7`, renumbered, moved to the `api` layer** (the id collided with the durable `TC-9do`): `tech-design.md` says e2e cannot swap the schedule at run time, so a second schedule is passed to the minimum calculation | `grade10-site-auction-bid-increments-SC-17`, `grade10-site-auction-bid-increments-SC-18` |
| `US1-TC14` | **New, api layer:** a bid at the old minimum is refused after a change, naming the new minimum | `grade10-site-auction-bid-increments-SC-19` |
| `US1-TC15` | **New, api layer:** a resolved price reads the schedule in force and a later change leaves it | `grade10-site-auction-bid-increments-SC-20` |
| `US1-TC16` | **New, api layer, added for Q9:** a bid with cents is refused naming the whole-dollar rule, and nothing moves; api because the bid panel's field cannot type cents | `grade10-site-auction-bid-increments-SC-23` |
| `US1-TC17` | **New, e2e layer, added for Q16:** a starting price with cents is refused in the listing editor, naming the whole-dollar rule, and the saved price stays | `grade10-site-auction-bid-increments-SC-24` |
| `US1-TC18` | **New, api layer, added for Q19:** a consignment ask with cents makes no listing and names the whole-dollar rule; a whole-dollar ask makes a draft | `grade10-site-auction-bid-increments-SC-25` |
| `US1-TC19` | **New, e2e layer, added for Q20:** a stored starting price with cents opens at the next whole dollar, the page still shows the stored price, and a first bid at that minimum is accepted | `grade10-site-auction-bid-increments-SC-26` |
| `US1-TC20` | **New, api layer, added for Q11:** a house maximum on a listing in extended bidding steps on the configured schedule, and the next minimum reads it | `grade10-site-auction-bid-increments-SC-27` |
| `US1-TC4` | **Retained, revises the durable case of the same id** (`TC-5ez`, rev 2, back to draft and `manual`): the cents amount `USD104.99` becomes `USD104`, one whole dollar below the minimum; the case now covers only `SC-04`, which it asserts in full | `grade10-site-auction-bid-increments-SC-04` |
| `US1-TC6` | **Retained, revises the durable case of the same id** (`TC-n6d`, rev 4, above the durable 3): the higher bid `USD2.50` becomes `USD3`; the other row keeps its old-tier amounts | none: unchanged from the durable claim |
| `US1-TC7` | **Retained, revises the durable case of the same id** (`TC-9do`, rev 5, above the durable 4): the `USD1` and `USD0.99` row is dropped, because no whole-dollar amount above 0 lies below the lowest increment, and `USD104.99` becomes `USD104` | `grade10-site-auction-bid-increments-SC-04`, as the durable case claims it, for the page's own Min line |
| `US3-TC3` | **Revises the durable case of the same id** (`TC-sze`, rev 2): the minimum reads the current bid plus the configured increment, not a quoted amount; `usd-lot-currency-winner-settlement-choice` carries it at rev 1 with a quoted `USD8,050.00` | `grade10-site-auction-bid-increments-SC-13` |
| `US3-TC5` | **Retained, renumbered** (QA1's `US3-TC1`, which collided with the durable `TC-y0l`): two listings at one price share one increment | `grade10-site-auction-bid-increments-SC-21` |
| `US3-TC6` | **Retained, renumbered** (QA1's `US3-TC2`, which collided with the durable `TC-fdc`): Min and the bid read in USD | `grade10-site-auction-bid-increments-SC-05` |
| `US3-TC7` | **Retained, renumbered, `unit` layer** (QA1's `US3-TC3`, which collided with the durable `TC-sze`): the schedule starts at 0 and its last tier is unbounded | `grade10-site-auction-bid-increments-SC-22` |

- **Covers links** - `TC-2ed` to `SC-vqb`, `TC-0lh` to `SC-mn9`, `TC-5ez` to `SC-b2w`, `TC-sze` to `SC-tke`, and each new case to the scenario named in the table, by the scenario's trace id. A scenario is linked only when the case's route asserts every THEN and AND line of it
- **Uncovered scenarios** - none without a case or a named verifier:
  - The operator-side refusal of `SC-24` is also stated by `grade10-admin-auction-listing-SC-221` and `SC-222` in that capability's delta suite (Q17); `US1-TC17` stays here for the rule's own capability
  - `grade10-site-auction-bid-increments-SC-03` is **Out of suite**: the durable `g10.auction-bid-increments.US1-TC3` (a bid above the minimum is accepted) asserts it, and this change does not alter what that case verifies; the amounts it quotes are examples of a given minimum
  - `grade10-site-auction-bid-increments-SC-04` is in this suite: `g10.auction-bid-increments.US1-TC4`, restyled below at rev 2, asserts it
  - `grade10-site-auction-bid-increments-SC-14` is **Out of suite**: the case that asserts it is `usd-lot-currency-winner-settlement-choice`'s `g10.auction-bid-increments.US3-TC4`, which that change folds first (Q15); this change restates the scenario unchanged
- **Over-claimed cases** - none: no case carries a `covers` link its route does not assert
- **Contradictions** - none open. QA1's `US1-TC2` read the opening minimum on a 0 start as the lowest configured increment while Dev's `SC-12` fixed it at 100 minor units; Q13 settled it for QA1's reading, and the requirement, `SC-12` and the feature-set line no longer state 100
- **Routes that differ, not contradictions** - `US1-TC10` and `US1-TC7` stop at the bid form, below the minimum by one whole dollar, while `SC-04` and `US1-TC4` reach the server; the PRD's Refusals table gives each route its own line. `US1-TC14` reaches the server through a page that still shows the old minimum
- **Id collisions, resolved** - QA2's first report found that nine of QA1's case ids and heading numbers were the durable suite's for other cases, and that `usd-lot-currency-winner-settlement-choice` carries `TC-2ed`, `TC-kyx`, `TC-n6d`, `TC-9do`, `TC-y0l`, `TC-fdc`, `TC-sze` and `TC-pn8` under the durable text. Cases that revise a durable case keep its id and number and bump `rev`: `TC-2ed`, `TC-0lh` and `TC-sze` to 2, each above the sibling's rev 1. Every other case takes a fresh number from `pnpm run spec:issue` (`US1-TC9` to `US1-TC20`, `US3-TC5` to `US3-TC7`) and a fresh trace id. The durable `TC-qui`, `TC-kyx`, `TC-4ox`, `TC-y0l`, `TC-fdc` and `TC-pn8` stay as the durable suite and the sibling hold them. `TC-5ez`, `TC-n6d` and `TC-9do` are revised here at `rev` 2, 4 and 5, above the durable 1, 3 and 4, and the sibling carries no later revision of them
- **Durable cases left to keep their amounts** - `g10.auction-bid-increments.US1-TC3`, the second row of `US1-TC6` and the whole-dollar rows of the walks quote amounts from the old six tiers (USD105, USD126, USD5, USD10), and the domain suite quotes tier amounts too. They state a given minimum or an increment as an example, as Q14 reads the neighbouring specs. A reviewer may restyle them against the configured values after deploy
- **Durable cases that carried cents, restyled** - after Q9, `US1-TC4` (`USD104.99`, the verifier of `SC-04`), `US1-TC6` (a `USD2.50` higher bid) and `US1-TC7` (`USD0.99` and `USD104.99` bids) quoted amounts the product no longer accepts, as did the walk rows. This suite carries them at `rev` 2, 4 and 5, each above the durable revision, back to `draft`, with whole-dollar amounts. `US1-TC4` was `actual` and automated: it is `manual` again and its Decided-by line is dropped until its e2e test is rewritten (task 5.1) and flipped (task 6.2). The durable suite's `## Walk 1` data rows copy the cents amounts of those cases. A delta cannot carry a walk without every case the walk references (`tcs:validate` refuses it), and its walks replace the durable ones whole in the fold, so the rows are restyled in the durable suite after the fold, by task 1.2a. `US2-TC4` and Walk 2 quote `USD10,000,000.01`, the ceiling plus one minor unit. The PM chose to restyle them to `USD10,000,001` in the durable suite after the fold, by task 1.2a, with no new `rev` and no US-02 anchor in this delta; the repair table in `accept-review.md` records it
- **Domain suites** - `No domain impact`: the journeys of `grade10-site-auction-bid-increments` appear on no `**Trace:**` line of `grade10-site/auction/domain-tcs.md`, and the one admin journey a domain case traces, `grade10-admin-auction-listing-US-03` (`g10adm.auction-domain.US2-TC1-4`, a campaign cancellation), does not touch a starting price with cents. The domain suite's tier amounts are examples (Q14)
- **A manual bid answered by a maximum** - `US1-TC12` stays without a `covers` link and `tcs:validate` warns: `SC-20` states that a maximum committed answers at the beaten maximum plus its own tier's increment and that a later change leaves the price, and `US1-TC12` asserts the first part only. A new scenario for a manual bid would restate the requirement's proxy sentence for a second input and state no rule the requirement does not already give, so none is added
- **Layer** - `US1-TC13` to `US1-TC15` and `US1-TC20` are `api` and `US3-TC7` is `unit`, Testability `automation`: a second schedule is a test seam no tester can reach by hand, and the application's DB lane and contracts tests are where `tech-design.md` puts them
- **Case duplication, checked** - `US1-TC15` repeats `US1-TC11`'s route at the `api` layer and adds the later change; it is kept because `US1-TC11` cannot change the schedule. `US3-TC5` and the durable `TC-y0l` both assert one schedule: `TC-y0l` across two price ranges, `US3-TC5` at one price
- **Config validity** - held by a contracts test, not by a scenario or a case (Q12); `US3-TC7` asserts only the shape the requirement states as a rule
- **Blindness** - unchanged from the first reconciliation: QA1 does not look contaminated and Dev looks anchored but shaped; neither reading asserts the other way

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-03`.
