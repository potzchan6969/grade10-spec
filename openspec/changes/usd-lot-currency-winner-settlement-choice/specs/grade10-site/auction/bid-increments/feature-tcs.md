# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-06

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC1: Minimum before any bid is the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Starting price | Why this row | Minimum next amount |
| --- | --- | --- |
| 0 | Zero start | USD1 (fixed tier increment), the lowest USD increment |
| USD280 (range: 10000-49999 minor units) | Positive start inside the USD 100 tier | USD280 (range: 10000-49999 minor units), the starting price |
| USD100 (fixed tier boundary) | Positive start on the USD 100 tier boundary | USD100 (fixed tier boundary), the starting price |

**Steps:**

1. Open the bid panel on the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is the row's minimum next amount.
* On a positive start it is the starting price, not the starting price plus its increment.
* On a zero start it is the lowest USD increment, never 0.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=2 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC5: Every listing publishes the next minimum in USD

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
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open listing is available.

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in USD.
* No other currency is shown.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=2 covers=g10.auction-bid-increments.SC-mn9 -->
### g10.auction-bid-increments.US1-TC6: First bid at the opening price is accepted, then one increment applies

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

* An open USD listing, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Starting price | Opening price, the bid amount | Increment at the opening price | Next minimum after |
| --- | --- | --- | --- |
| 0 | USD1 (range: 100-9999 minor units) | 100 (USD 0 tier) | USD2 (fixed derived value) |
| USD100 (fixed tier boundary) | USD100 (fixed tier boundary) | 500 (USD 100 tier) | USD105 (fixed derived value) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the minimum next amount on the bid panel.

**Expected Results:**

* Step 2: the bid is accepted.
* Step 3: the minimum next amount is the opening price plus the increment at the opening price, the row's next minimum after.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=2 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: First bid below the opening price is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
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

* An open USD listing, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Starting price | Opening price | Bid amount |
| --- | --- | --- |
| 0 | USD1 (fixed boundary: the lowest USD increment) | USD0.99 (fixed boundary or equality) |
| USD100 (fixed tier boundary) | USD100 (fixed tier boundary) | USD99 (fixed boundary or equality) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the bid panel.

**Expected Results:**

* Step 2: the bid is refused, naming the row's opening price as the minimum.
* Step 3: the listing still has no accepted bid.
* Step 3: the minimum next amount is still the row's opening price.

<!-- trace:case id=g10.auction-bid-increments.TC-4ox rev=3 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US1-TC8: Lot starting at the ceiling takes one first bid there

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_1>` is open in USD, starting price `<ceiling>`, with no accepted bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<ceiling>` | USD10,000,000 (fixed configured value) |

**Steps:**

1. As customer A, submit a bid of `<ceiling>` on `<listing_1>`.
2. Read the API response.
3. As customer B, submit a bid of `<ceiling>` plus the increment at it.
4. Read the API response.
5. Read `<listing_1>`'s current bid, leader and bid count.

**Expected Results:**

* Step 2: customer A's bid is accepted at `<ceiling>`.
* Step 4: customer B's bid is refused, naming the ceiling.
* Step 5: current bid `<ceiling>`, customer A leads, bid count 1.

---

## g10.auction-bid-increments.US2: Collector bids up to the ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=3 covers=g10.auction-bid-increments.SC-hm3 -->
### g10.auction-bid-increments.US2-TC2: Direct bid above the ceiling is refused without effects

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer(card linked, account in good standing) can bid on an open USD listing.
* The listing's minimum is below the ceiling.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Field | Value |
| --- | --- |
| `<ceiling>` | USD10,000,000 (fixed configured value) |
| `<bid amount>` | USD10,000,000.01 (fixed boundary or equality) |

**Steps:**

1. Read the listing's price, leader, bid count and maximums.
2. Submit `<bid amount>` through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals `<ceiling>`.
* Step 4: price, leader, bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

<!-- trace:case id=g10.auction-bid-increments.TC-dfw rev=3 covers=g10.auction-bid-increments.SC-xnb -->
### g10.auction-bid-increments.US2-TC3: Auto-bid maximum above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.
* The maximum is sent directly to the auction service.

**Test data:**

| Field | Value |
| --- | --- |
| `<minimum>` | USD105 (range: 10000-49999 minor units) |
| `<ceiling>` | USD10,000,000 (fixed configured value) |
| `<maximum>` | USD10,000,000.01 (fixed boundary or equality) |

**Steps:**

1. As the collector, submit `<maximum>` through the authenticated auction API.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names `<ceiling>` as the ceiling.
* No maximum is recorded for the collector.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=3 covers=g10.auction-bid-increments.SC-pd0 -->
### g10.auction-bid-increments.US2-TC4: Listing at the ceiling refuses a further direct bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer A leads the open USD listing at the ceiling.
* customer B(card linked, account in good standing) can bid on the listing.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Field | Value |
| --- | --- |
| `<ceiling>` | USD10,000,000 (fixed configured value) |
| `<bid amount>` | USD10,000,000.01 (fixed boundary or equality) |

**Steps:**

1. Read the listing's bid count and maximums.
2. As customer B, submit `<bid amount>` through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals `<ceiling>`.
* Step 4: price remains the ceiling and customer A leads.
* Step 4: bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-y0l rev=1 -->
### g10.auction-bid-increments.US3-TC1: Every open lot prices and bids in USD on one schedule

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
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* `<lot_1>` and `<lot_2>` are open lots with no accepted bid.
* customer is signed in with a card linked.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An open lot, starting price USD50 (range: 5000-9999 minor units) |
| `<lot_2>` | An open lot, starting price USD100 (fixed tier boundary) |

**Steps:**

1. Open `<lot_1>`'s bid panel and read its minimum next amount.
2. Open `<lot_2>`'s bid panel and read its minimum next amount.
3. Place a bid of the minimum next amount on each lot and read its next minimum.

**Expected Results:**

* Both lots show their prices and minimum in USD, with no currency choice.
* Each first minimum is the lot's starting price.
* Each next minimum is the bid plus the increment of the one USD schedule: USD1 on `<lot_1>`, USD5 on `<lot_2>`.

<!-- trace:case id=g10.auction-bid-increments.TC-fdc rev=1 covers=g10.auction-bid-increments.SC-5ea,g10.auction-bid-increments.SC-gq8 -->
### g10.auction-bid-increments.US3-TC2: A currency other than USD cannot price an auction

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_1>` is a draft in USD with every create requirement set.

**Test data:**

| Currency sent | Why this row |
| --- | --- |
| HKD | A retired tier currency |
| JPY | A retired tier currency |

**Steps:**

1. Send create for `<listing_1>` with the row's currency.
2. Read the API response for `<listing_1>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft in USD, not created.

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=1 covers=g10.auction-bid-increments.SC-xjw,g10.auction-bid-increments.SC-tke -->
### g10.auction-bid-increments.US3-TC3: A lot that was priced in HKD before the overwrite bids on the USD schedule

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

* An open USD listing with an accepted bid of 800000 minor units and no other currency.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Listing | Why this row |
| --- | --- |
| A lot created in USD | The schedule as it always read |
| A lot created in HKD and overwritten to USD, amounts unchanged | A lot that existed before this change |

**Steps:**

1. Open the bid panel on the row's listing.
2. Read the current bid and the minimum next amount.

**Expected Results:**

* The current bid reads USD8,000.00 on both rows.
* The minimum next amount reads USD8,050.00.
* No HKD amount shows.

<!-- trace:case id=g10.auction-bid-increments.TC-pn8 rev=1 covers=g10.auction-bid-increments.SC-ws7 -->
### g10.auction-bid-increments.US3-TC4: An open listing publishes its amounts as USD

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* An open listing in USD has a starting price of 20000 minor units and an accepted bid of 800000 minor units.

**Steps:**

1. Read the listing's facts through the public listing API.

**Expected Results:**

* The starting price, the current bid, the minimum next amount and the ceiling are each an integer count of minor units.
* Each is paired with `USD`.
* No other currency code is carried.

## Settled

- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-13 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-03` and the restated `grade10-site-auction-bid-increments-US-01` and `grade10-site-auction-bid-increments-US-02`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q14 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| Before any bid the minimum is the opening price: a positive start, and the lowest increment on a 0 start | **Folded in:** `grade10-site-auction-bid-increments-SC-01` and `grade10-site-auction-bid-increments-SC-12`, asserted by `g10.auction-bid-increments.US1-TC1`; the USD rows replace the HKD and JPY rows |
| A boundary price takes the higher tier, and a first bid at the opening price leaves one increment | **Folded in:** `grade10-site-auction-bid-increments-SC-02`, asserted by `g10.auction-bid-increments.US1-TC6` |
| A bid below the minimum is refused, naming it | **Folded in:** `grade10-site-auction-bid-increments-SC-04`, asserted by `g10.auction-bid-increments.US1-TC7` |
| An open listing publishes its next minimum in USD | **Folded in:** `grade10-site-auction-bid-increments-SC-05`, asserted by `g10.auction-bid-increments.US1-TC5`. The page read shows the minimum only; the integer-and-code shape of every published amount is read by `g10.auction-bid-increments.US3-TC4` |
| A listing publishes its starting price, current bid, minimum and ceiling each as minor units paired with USD | **Added:** QA1 read the minimum only. `g10.auction-bid-increments.US3-TC4` asserts `grade10-site-auction-bid-increments-SC-14` |
| The manual floor uses the current public price, including a lot that was HKD before the overwrite | **Added:** `g10.auction-bid-increments.US3-TC3` asserts `grade10-site-auction-bid-increments-SC-07` and `grade10-site-auction-bid-increments-SC-13` on the one route, one row each |
| A bid above the minimum is accepted | **Out of suite:** `grade10-site-auction-bid-increments-SC-03` - the durable `g10.auction-bid-increments.TC-qui` holds it, and USD values do not move it |
| HKD and JPY cannot be scheduled | **Folded in:** `grade10-site-auction-bid-increments-SC-15` and `grade10-site-auction-bid-increments-SC-16`, asserted by `g10.auction-bid-increments.US3-TC2`. The case sends a create, and the scenarios say "sets its currency and schedules it": create is the act that sets the start and the close, so the route is read as the same; Dev should say it |
| An unsupported currency such as EUR cannot be scheduled | **Out of suite:** `grade10-site-auction-bid-increments-SC-06` - the EUR rows of `g10adm.auction-listing.US74-TC2` and `g10adm.auction-listing.US74-TC3` exercise the same write, and this suite has no admin surface of its own |
| A bid at the ceiling is accepted; above it a bid or an auto-bid maximum is refused, naming the ceiling; a listing at the ceiling takes no further bid | **Folded in:** `grade10-site-auction-bid-increments-SC-08`, `grade10-site-auction-bid-increments-SC-09`, `grade10-site-auction-bid-increments-SC-10` and `grade10-site-auction-bid-increments-SC-11`, asserted by `g10.auction-bid-increments.US1-TC8`, `US2-TC2`, `US2-TC3` and `US2-TC4`, and by the durable `g10.auction-bid-increments.TC-xdy`. The HKD and JPY rows are gone from all four cases |
| `g10.auction-bid-increments.US3-TC1` bids on two lots on one schedule | **Kept, unlinked:** the case reads the requirement's first paragraph (every lot in USD, no currency choice), which no scenario states on its own beyond `grade10-site-auction-bid-increments-SC-13` and `grade10-site-auction-bid-increments-SC-14`. Pending a scenario or a link at review |
| The durable suite's Manual row for `g10.auction-bid-increments.US2-TC3` still names a JPY maximum | **Not folded:** a row of the durable suite, outside this delta; it reads stale once the JPY ceiling retires and needs rewording at archive |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01`, `grade10-site-auction-bid-increments-US-02` or `grade10-site-auction-bid-increments-US-03`.
