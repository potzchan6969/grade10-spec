# grade10-site/auction/bid-increments Test Cases

**Status:** reopened
**Reviewed:** 2026-09-22, tcs-rules r3.0, lapsed 2026-10-02
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-8e2 rev=2 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC1-2: Minimum before any bid is the opening price

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

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Why this row | Minimum next amount |
| --- | --- | --- | --- |
| USD | 0 | Zero start | 100 minor units (USD 1.00), the lowest USD increment |
| HKD | 0 | Zero start | 1000 minor units (HKD 10.00), the lowest HKD increment |
| JPY | 0 | Zero start | 100 minor units (JPY 100), the lowest JPY increment |
| HKD | 20000 minor units (HKD 200.00) | Positive start inside the HKD 0 tier | 20000 minor units (HKD 200.00), the starting price |
| HKD | 500 minor units (HKD 5.00) | Positive start below the lowest HKD increment | 500 minor units (HKD 5.00), the starting price |
| USD | 10000 minor units (USD 100.00) | Positive start on the USD 100 tier boundary | 10000 minor units (USD 100.00), the starting price |

**Steps:**

1. Open the bid panel on the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is the row's minimum next amount.
* On a positive start it is the starting price, not the starting price plus its increment.
* On a HKD 500 start it is not raised to the lowest increment.
* On a zero start it is the currency's lowest increment, never 0.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC2-1: Boundary price takes the higher tier

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open USD listing has current public price `<current public price>`.
The collector is enrolled and can bid.

**Test data:**

| current public price | increment | minimum next amount |
| --- | ---: | ---: |
| 10000 USD minor units | 500 | 10500 |
| 9999 USD minor units | 100 | 10099 |
| 50000 USD minor units | 1000 | 51000 |

**Steps:**

1. Open the listing bid panel.
2. Place a bid of `<current public price>` plus `<increment>`.

**Expected Results:**

* The new public price is `<minimum next amount>`.

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC3-1: Amount above the minimum is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| 10500 USD minor units | 12000 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC4-1: Amount below the minimum is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| 10500 USD minor units | 10499 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused.
* The refusal names `<minimum>` as the minimum.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC5-1: Listing publishes the next minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**
An open listing is available in `<listing currency>`.

**Test data:**

| listing currency |
| --- |
| USD |
| HKD |
| JPY |

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in `<listing currency>`.

**Out of suite:**

- `grade10-site-auction-bid-increments-SC-06` — API and operator-form currency refusal is covered by the backend and admin verification lanes.
- `grade10-site-auction-bid-increments-SC-07` — Manual-floor calculation is covered by the backend auction test lane.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### grade10-site-auction-bid-increments-US1-TC6-1: First bid at the opening price is accepted, then one increment applies

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

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Opening price, the bid amount | Increment at the opening price | Next minimum after |
| --- | --- | --- | --- | --- |
| USD | 0 | 100 minor units (USD 1.00) | 100 (USD 0 tier) | 200 minor units (USD 2.00) |
| HKD | 0 | 1000 minor units (HKD 10.00) | 1000 (HKD 0 tier) | 2000 minor units (HKD 20.00) |
| JPY | 0 | 100 minor units (JPY 100) | 100 (JPY 0 tier) | 200 minor units (JPY 200) |
| HKD | 500 minor units (HKD 5.00) | 500 minor units (HKD 5.00) | 1000 (HKD 0 tier) | 1500 minor units (HKD 15.00) |
| USD | 10000 minor units (USD 100.00) | 10000 minor units (USD 100.00) | 500 (USD 100 tier) | 10500 minor units (USD 105.00) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the minimum next amount on the bid panel.

**Expected Results:**

* Step 2: the bid is accepted.
* Step 3: the minimum next amount is the opening price plus the increment at the opening price, the row's next minimum after.
* On the USD 10000 row the USD 100 tier applies, not the USD 0 tier.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### grade10-site-auction-bid-increments-US1-TC7-1: First bid below the opening price is refused

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

* An open listing in the row's currency, starting price the row's starting price, with no accepted bid.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Starting price | Opening price | Bid amount |
| --- | --- | --- | --- |
| HKD | 0 | 1000 minor units (HKD 10.00) | 900 minor units (HKD 9.00) |
| JPY | 0 | 100 minor units (JPY 100) | 99 minor units (JPY 99) |
| HKD | 500 minor units (HKD 5.00) | 500 minor units (HKD 5.00) | 400 minor units (HKD 4.00) |
| USD | 10000 minor units (USD 100.00) | 10000 minor units (USD 100.00) | 9900 minor units (USD 99.00) |

**Steps:**

1. Enter the row's bid amount in the custom maximum on the bid panel.
2. Confirm the bid.
3. Read the bid panel.

**Expected Results:**

* Step 2: the bid is refused, naming the row's opening price as the minimum.
* Step 3: the listing still has no accepted bid.
* Step 3: the minimum next amount is still the row's opening price.

<!-- trace:case id=g10.auction-bid-increments.TC-4ox rev=2 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk,g10.auction-bid-increments.SC-w8f -->
### grade10-site-auction-bid-increments-US1-TC8-2: Lot starting at the ceiling takes one first bid there

Runs once per row of **Test data**.

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

* `<listing_1>` is open in the row's currency, starting price the row's `<ceiling>`, with no accepted bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Currency | `<ceiling>` |
| --- | --- |
| USD | 1000000000 minor units (USD 10,000,000.00) |
| HKD | 8000000000 minor units (HKD 80,000,000.00) |
| JPY | 5000000000 minor units (JPY 5,000,000,000) |

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

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-xdy rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC1-1: Bid equal to the ceiling is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is `<minimum>`.

**Test data:**

| minimum | ceiling | bid amount |
| --- | ---: | ---: |
| 999990000 USD minor units | 1000000000 | 1000000000 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC2-1: Bid above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open HKD listing whose minimum bid is <minimum>.

**Test data:**

| minimum | ceiling | bid amount |
| --- | ---: | ---: |
| 820000 HKD minor units | 8000000000 | 8000000001 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names <ceiling> as the ceiling.
* The listing's price and leader are unchanged.

<!-- trace:case id=g10.auction-bid-increments.TC-dfw rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC3-2: Auto-bid maximum above the ceiling is refused

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

* The collector is enrolled on an open JPY listing whose minimum bid is `<minimum>`.
* The maximum is sent to the auction service directly, so the refusal read is
  the service's own; the bid panel's custom maximum field takes up to
  9,999,999,999 and would carry `<maximum>` as well.

**Test data:**

| `<minimum>` | `<ceiling>` | `<maximum>` |
| --- | ---: | ---: |
| 150000 JPY minor units | 5000000000 | 5000000001 |

**Steps:**

1. As the collector, commit an auto-bid maximum of `<maximum>` on the listing
   through the auction service's bid procedure.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names `<ceiling>` as the ceiling.
* No maximum is recorded for the collector.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC4-1: Listing at the ceiling takes no further bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**
The collector is enrolled on an open USD listing whose current bid is `<ceiling>`, held by another collector.

**Test data:**

| ceiling | bid amount |
| --- | ---: |
| 1000000000 USD minor units | 1000000001 |

**Steps:**

1. Open the listing bid panel.
2. Enter `<bid amount>` as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names `<ceiling>` as the ceiling.

## Settled

- Before any accepted bid the minimum is the opening price: the starting price, or the currency's lowest increment on a 0 start. From the first accepted bid, the current bid plus its tier increment applies.
- A first bid of 0, or of one minor unit, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-01, rerun after Q28 and Q35, for change `relay-auction-live-state`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-bid-increments-US-01`. Read the change's `proposal.md`, `decisions.md` (Q16 to Q30), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md` and `domain-tcs.md`. QA1 had read the frozen anchors only.

| Finding | Disposition |
| --- | --- |
| Before any bid the minimum is the opening price: the starting price on a positive start, below the lowest increment included, and the lowest increment on a 0 start | **Folded in:** `grade10-site-auction-bid-increments-SC-01`, `grade10-site-auction-bid-increments-SC-12` (Q19, Q27) |
| TC1-2: chip 1x before any bid reads the opening price plus one increment | **Rejected:** Q28 - chip 1x before any bid is the opening price itself; the chips are `shared/ui/auction-listing`'s, written by this change as `shared-ui-auction-listing-SC-52` (Q35) and asserted by `shared-ui-auction-listing-US1-TC5-2`. QA2 dropped the chip column and step; the case stays draft |
| A first bid at the opening price is accepted, then the opening price plus its tier increment is the minimum | **Folded in:** `grade10-site-auction-auction-SC-62`, `grade10-site-auction-bid-increments-SC-02` and the requirement's after-an-accepted-bid rule |
| A first bid below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-63`, `grade10-site-auction-auction-SC-64`, `grade10-site-auction-bid-increments-SC-04` |
| A lot starting at the ceiling takes one first bid there and refuses the next | **Folded in:** durable `grade10-site-auction-bid-increments-SC-08` and `grade10-site-auction-bid-increments-SC-11`, unchanged by this change (Q30) |
| Unchanged scenarios restated by the modified blocks - `SC-03`, `SC-05`, `SC-07` | **Out of suite:** the durable suite's existing cases; this change does not alter what they verify |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01`.

**Run:** QA2 reconciliation 2026-10-05 for change `cap-custom-maximum-entry`, rereading the two cases the accept-review fix round restated after Q6 lowered the JPY bid ceiling. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Refusals and Bid ceiling lines. No blind pass ran on this capability: the fix round wrote both cases with the scenarios in view, and this run checks them against those scenarios.

| Finding | Disposition |
| --- | --- |
| The JPY ceiling moves down from 150000000000 minor units | **Folded in:** the requirement's table and `grade10-site-auction-bid-increments-SC-10` / the JPY row of `grade10-site-auction-bid-increments-US1-TC8-2` and `grade10-site-auction-bid-increments-US2-TC3-2`. The interim 10000000000 gave way to 5000000000 (Q6); the rerun after it reread both cases at 5000000000 |
| The bid panel's custom maximum field refuses any draft above 9,999,999,999, so a JPY maximum above the ceiling cannot be entered there | **Folded in:** `grade10-site-auction-bid-increments-US2-TC3-2` sends the maximum to the auction service directly. With the ceiling at 5000000000 (Q6) the field takes 5000000001 too, so the case keeps the direct send to read the service's own refusal, as task 5.1 walks it |
| Accept-review fix round: the earlier row credited `grade10-site-auction-bid-increments-SC-08` to this change | **Rejected:** `grade10-site-auction-bid-increments-SC-08` is the USD at-ceiling bid, unchanged here; only the table and `grade10-site-auction-bid-increments-SC-10` move |
| Unchanged scenarios restated by the modified block - `SC-08`, `SC-09`, `SC-11` | **Out of suite:** the durable suite's `grade10-site-auction-bid-increments-US2-TC1-1`, `grade10-site-auction-bid-increments-US2-TC2-1` and `grade10-site-auction-bid-increments-US2-TC4-1`; their USD and HKD values do not move |
| Q6: the JPY ceiling itself is still reachable from a quick bid chip | **Rejected:** no scenario states it, and `tech-design.md` no longer claims it - the lot page's chips come from `@grade10/ui` and carry no ceiling, and grade10's `quickBidAmounts.ts` runs only in its own test, whose amounts task 4.1 moves under the new ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`.

**Run:** QA2 reconciliation 2026-10-05, rerun after the accept-review fixes, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after the decisions rows named their carriers - Q4 and Q6 on this capability's ceiling requirement - and task groups 4 and 5 lost their owner. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 with their carriers, and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Custom maximum and Bid ceiling lines. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `grade10-site-auction-bid-increments-US2-TC3-2` against `grade10-site-auction-bid-increments-SC-10` | **Joined:** JPY listing, minimum 150000 minor units, and no maximum recorded, match the scenario; the maximum and ceiling, first read as 10000000001 and 10000000000, are 5000000001 and 5000000000 since Q6 |
| `grade10-site-auction-bid-increments-US1-TC8-2` against the requirement's table and its refusal once the next minimum passes the ceiling | **Joined:** the USD, HKD and JPY rows read 1000000000, 8000000000 and 5000000000 minor units since Q6, as the table does; the second bidder's refusal names the ceiling |
| Q4 and Q6 name this capability's ceiling requirement as their carrier | **Joined:** both cases sit on it, and `grade10-site-auction-bid-increments-US2-TC3-2` sends the maximum to the service directly to read the service's own refusal |
| Task groups 4 and 5 carry no owner | **Joined:** suite-neutral; task 5.1 still walks both cases by id |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** a version bump on the same case number, so the fold replaces the earlier version; no other active change issues ids here |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable cases named above as their verifiers.

**Run:** QA2 reconciliation 2026-10-05, rerun after the 5,000,000,000 JPY ceiling, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after Q6 moved the JPY ceiling to 5000000000 minor units and `tech-design.md` dropped the quick-chip claim. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, the bidding page's Ceiling, Custom maximum and Bid ceiling lines, and the bid card's custom maximum handler in `listing-quick-maximum-bid-actions.tsx`. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `grade10-site-auction-bid-increments-US2-TC3-2` against `grade10-site-auction-bid-increments-SC-10` | **Joined:** JPY listing, minimum 150000 minor units, maximum 5000000001 refused naming 5000000000, and no maximum recorded, match the scenario |
| `grade10-site-auction-bid-increments-US1-TC8-2` against the requirement's table | **Joined:** the JPY row reads 5000000000 minor units (JPY 5,000,000,000), as the table and the bidding page's Ceiling row do; USD and HKD do not move |
| `TC3-2`'s pre-condition said the field cannot carry the maximum, but 5000000001 sits under the field's 9,999,999,999 | **Folded in:** `grade10-site-auction-bid-increments-US2-TC3-2` keeps the direct send to read the service's own refusal, and now says the field would carry the maximum too |
| Earlier rows that stated 10000000000, the field keeping the maximum out of the panel, or the quick-chip claim as current | **Folded in:** each row now states its outcome - 5000000000 (Q6), the field takes the maximum, and the chip claim is gone from `tech-design.md` |
| Unchanged scenarios restated by the modified block - `SC-08`, `SC-09`, `SC-11` | **Out of suite:** walked by the durable suite's `grade10-site-auction-bid-increments-US2-TC1-1`, `grade10-site-auction-bid-increments-US2-TC2-1` and `grade10-site-auction-bid-increments-US2-TC4-1`, whose USD and HKD values match those scenarios |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** a version bump on the same case number; no other active change issues ids here |
| Questions for the PM | None - Q4 and Q6 settle the service's refusal and the JPY ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable cases named above as their verifiers, and both cases stay draft.

**Run:** QA2 reconciliation 2026-10-05, rerun after the final accept-review fixes, for change `cap-custom-maximum-entry`. Reread both cases against the delta's ceiling requirement and `grade10-site-auction-bid-increments-SC-08` to `-SC-11`, after task 4.1's e2e note named only the shared-UI cases it drives. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the bidding page's Ceiling, Custom maximum and Bid ceiling lines. No other active change touches this capability. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| `grade10-site-auction-bid-increments-US2-TC3-2` against `grade10-site-auction-bid-increments-SC-10`, and `grade10-site-auction-bid-increments-US1-TC8-2` against the requirement's table | **Joined:** JPY minimum 150000, maximum 5000000001 refused naming 5000000000, no maximum recorded; the table's USD, HKD and JPY rows match `TC8-2`'s |
| `TC3-2`'s pre-conditions ran as a paragraph and its placeholders were bare | **Folded in:** restyled to one bullet per condition with placeholders in backticks; values and outcomes unchanged |
| Both cases are manual | **Joined:** no automated case here, so no Decided-by line is owed; task 5.1 walks both |
| Case ids against the durable suite - `TC8-2` and `TC3-2` bump `TC8-1` and `TC3-1` | **Joined:** no other active change issues ids here |
| Questions for the PM | None - Q4 and Q6 settle the service's refusal and the JPY ceiling |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-01` or `grade10-site-auction-bid-increments-US-02`; `SC-08`, `SC-09` and `SC-11` stay out of suite with the durable `grade10-site-auction-bid-increments-US2-TC1-1`, `grade10-site-auction-bid-increments-US2-TC2-1` and `grade10-site-auction-bid-increments-US2-TC4-1` as their verifiers, and both cases stay draft.

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-auction-bid-increments-US1-TC8-2` | A person drives the auction service's bid procedure for each currency row against the deployed service, in task 5.1's walk; `bidIncrements.test.ts` in the application repository pins the ceiling value only |
| `grade10-site-auction-bid-increments-US2-TC3-2` | A person sends the JPY maximum to the deployed service's bid procedure and reads the refusal and the collector's maximums, in task 5.1's walk; `placeBid.spec.ts` in the application repository is to refuse it once task 4.1 lands |
