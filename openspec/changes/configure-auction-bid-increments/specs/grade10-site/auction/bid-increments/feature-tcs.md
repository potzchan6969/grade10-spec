# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-22, tcs-rules r6

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=1 covers=g10.auction-bid-increments.SC-vqb -->
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

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=1 covers=g10.auction-bid-increments.SC-w8f -->
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

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-xjw -->
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

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=1 covers=g10.auction-bid-increments.SC-a64 -->
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

<!-- trace:case id=g10.auction-bid-increments.TC-fdc rev=1 covers=g10.auction-bid-increments.SC-ijk -->
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

## Settled

- A first bid is accepted at the opening price: the starting price, or the lowest configured increment on a 0 start. From the first accepted bid, the current bid plus the increment of its tier applies.
- An open page's Min refreshes on its next read or bid attempt, not live; a bid or a maximum below the minimum the server now holds is refused, names that minimum, and records nothing (Q7).
- A standing maximum reads the schedule in force each time it answers a bid; it keeps its amount and the earlier resolutions stand (Q8).
- A bid amount is a whole count of USD minor units, so cents are allowed; a tier includes its lower bound at the exact minor unit (Q9).
- Every bid surface reads USD only; a USD fact becomes HKD only at settlement (Q10).
- A house maximum and an extended-bidding bid read the same schedule as any bid (Q11).

## Reconciliation

**Run:** QA2 reconciliation 2026-10-22 for change `configure-auction-bid-increments`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01` and `grade10-site-auction-bid-increments-US-03`. QA2 read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md`, the PRD Bidding page and the durable suite. QA1's own bundle is its statement and cannot be checked here: it saw the `decisions.md` rows Q1 to Q6 while locating the Raised table and drew no case from them. Dev saw the Raised rows before finishing. This line is a statement, not proof.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| US1-TC1 | **Retained** - opening minimum on a priced start is the starting price and the bid is accepted | `grade10-site-auction-bid-increments-SC-01` |
| US1-TC2 | **Retained** - a 0 start opens at the lowest configured increment | `grade10-site-auction-bid-increments-SC-12` |
| US1-TC3 | **Retained** - the next minimum is the current bid plus its tier's increment, for the floor tier, a middle tier and the last tier | `grade10-site-auction-bid-increments-SC-07` |
| US1-TC4 | **Retained, partly linked** - rows 1 and 3 assert that a price on a bound takes the higher tier; rows 2 and 4 take the highest whole dollar below a bound, not one minor unit below | none: `grade10-site-auction-bid-increments-SC-02` also states the one-minor-unit-below price and every tier, which no row reaches |
| US1-TC5 | **Retained, partly linked** - a maximum is beaten at the beaten maximum plus its own tier's increment, with a higher-tier leader | none: `grade10-site-auction-bid-increments-SC-20` also states that a later change leaves the current bid standing, which no step changes |
| US1-TC6 | **Retained, partly linked** - a typed amount answered by a standing maximum prices at that amount plus its tier's increment | none, for the same reason as US1-TC5 |
| US1-TC7 | **Retained** - an open lot takes the new minimum on the next read and keeps its standing bid | `grade10-site-auction-bid-increments-SC-17` |
| US3-TC1 | **Folded in, owed to Dev** - two lots at one price share one increment. The requirement's prose states it ("One schedule governs every auction") and no scenario does | none |
| US3-TC2 | **Retained** - Min reads in USD and the bid is placed in USD | `grade10-site-auction-bid-increments-SC-05` |
| US3-TC3 | **Folded in, owed to Dev** - the schedule has a floor tier from USD0 and an unbounded last tier in strictly rising order. The requirement's prose states it and no scenario does | none |

- **Covers links** - `TC-2ed` to `SC-vqb`, `TC-0lh` to `SC-w8f`, `TC-qui` to `SC-xjw`, `TC-9do` to `SC-a64` and `TC-fdc` to `SC-ijk`, each by the scenario's trace id. A scenario is linked only when the case's route asserts every THEN and AND line of it
- **Uncovered scenarios** - no blind case asserts them, and QA2 adds none after reading the scenarios:
  - `grade10-site-auction-bid-increments-SC-02` - the tail: a price one minor unit below a bound takes the lower tier, and each tier after the first. US1-TC4 rows 2 and 4 use the whole dollar below
  - `grade10-site-auction-bid-increments-SC-03` - a bid above the minimum is accepted. No case enters an amount above Min
  - `grade10-site-auction-bid-increments-SC-04` - the server refuses M minus 1 and names M. US1-TC3 and US1-TC7 stop at the bid form, which disables the action and shows Min, as the PRD's Refusals table says; the server's answer is only for a minimum that moved after the page showed it
  - `grade10-site-auction-bid-increments-SC-18` - the leader keeps a maximum through a change, and the bid count is unchanged. US1-TC7's leader holds no maximum and its steps do not read the bid count
  - `grade10-site-auction-bid-increments-SC-19` - a stale page's bid at the old minimum is refused with the new minimum named. US1-TC7 reloads before it enters the old minimum, so the form disables the action and nothing is sent
  - `grade10-site-auction-bid-increments-SC-20` - the tail: a later change leaves the current bid
  - `grade10-site-auction-bid-increments-SC-13` - a listing overwritten from HKD to USD reads the USD schedule. QA1 had no anchor for it; the durable suite's `g10.auction-bid-increments.US3-TC3` walks it today, and that case is replaced by the id collision below
  - `grade10-site-auction-bid-increments-SC-14` - the starting price and the ceiling publish as USD. US3-TC2 reads Highest bid and Min only
  - Each owes a case or an `**Out of suite:**` line naming its verifier before acceptance. `tech-design.md` names the contracts test and the backend DB lane for the change scenarios, but a store case, not the application tests, is the verifier this suite credits
- **Over-claimed cases** - none: no case carries a `covers` link its route does not assert
- **Contradictions** - one, held as Q13: QA1's US1-TC2 reads the opening minimum on a 0 start as the lowest configured increment, so a retune of the floor moves it, while Dev's requirement, `grade10-site-auction-bid-increments-SC-12` and the validator in `tech-design.md` fix the floor tier at 100 minor units, against the goal that a retune needs no change to the spec. The values the two readings state today are equal; they differ on what a retune does
- **Routes that differ, not contradictions** - US1-TC3 and US1-TC7 stop at the bid form while `grade10-site-auction-bid-increments-SC-04` and `grade10-site-auction-bid-increments-SC-19` reach the server; the PRD's Refusals table gives each route its own line. US1-TC4 uses the whole dollar below a bound while `grade10-site-auction-bid-increments-SC-02` uses one minor unit below, which Q9 allows
- **Id collision, owed to QA1** - this draft reuses the durable suite's heading numbers and trace ids for other cases: US1-TC2 to US1-TC7 and US3-TC1 to US3-TC3 here are not the cases of the same ids in the durable suite, and US1-TC1 here narrows the durable one. Folding at acceptance would replace the durable US1-TC3 (a bid above the minimum), US1-TC4 (a bid below it refused), US1-TC5 (the minimum published in USD) and US3-TC3 (the HKD overwrite), and would drop the credit they hold for `grade10-site-auction-bid-increments-SC-03`, `-SC-04`, `-SC-05` and `-SC-13`. `usd-lot-currency-winner-settlement-choice` also carries `TC-kyx`, `TC-n6d`, `TC-9do`, `TC-y0l`, `TC-fdc` and `TC-sze` under the durable text. The fix is a new heading number and a trace id from `pnpm run trace -- init case` for each case that is not a revision of its durable namesake; QA2 left the ids, which are immutable here
- **Classification, for the review** - US1-TC7 is `Layer: e2e` with `Testability: automation`, but `tech-design.md` says e2e cannot swap the values at run time and puts the change cases in the unit and DB lanes; a manual walk needs a deploy between its steps. QA2 left the property
- **Blindness** - QA1 does not look contaminated: no case mirrors a Raised row without an anchor. The nearest is US1-TC7's step 4, a bid at the old minimum that cannot be placed, which the PRD's Refusals table anchors, and its reload step, which the PRD's 🚧 line on the next bid anchors. Dev looks anchored but shaped: `grade10-site-auction-bid-increments-SC-19` reads as Raised row 2 option (a) word for word, and `-SC-18` and `-SC-20` echo rows 1 and 3, though each has its PRD or `tech-design.md` source. No scenario or case asserts the other way, so no finding follows
- **Dev scenario anchors** - `grade10-site-auction-bid-increments-SC-07` serves a feature-set line, not a journey id, and `grade10-site-auction-bid-increments-SC-12` serves a journey title that `user-journeys.md` does not hold ("Collector enters the opening bid on a lot that starts at nothing"; US-01 is "Collector places a bid across a price tier"). `pnpm plan:review-preflight` accepts both; the title is Dev's to correct
- **Raised rows** - nine from QA1 and one from Dev, all landed in `decisions.md`: Q7 (open page, old minimum, maximum below the minimum), Q8 (a standing maximum), Q9 (fractions and the bound), Q10 (display currency) and Q11 (the house and extended bidding) closed on the PRD and durable text, their answers under Settled above; Q12 (an invalid schedule), Q13 (the $1 floor) and Q14 (deltas for five neighbouring capabilities) held for the product manager
- **Across levels** - the durable `domain-tcs.md` quotes old-tier amounts (USD 25 and USD 50 increments); `tech-design.md` leaves its fixtures to the walk, and this run left the domain suite untouched

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-03`; scenarios without an asserting case are listed above.
