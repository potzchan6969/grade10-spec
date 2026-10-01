# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

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

---

## Settled

- Before any accepted bid the minimum is the opening price: the starting price, or the currency's lowest increment on a 0 start. From the first accepted bid, the current bid plus its tier increment applies.
- A first bid of 0, or of one minor unit, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.

## Reconciliation

**Run:** blind feature pass, 2026-09-29. Read: the bundle's `outline.md` (Purpose and Feature set), `durable-user-journeys.md`, `change-user-journeys.md`, `proposal.md`, `decisions.md`, `prd-bidding.md`, `existing-feature-tcs.md` (Reconciliation stripped), `domain-tcs.md` (Reconciliation stripped); `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, the `spec-to-tcs` skill, `openspec/config.yaml`; this change's auto-bidding suite for shape only, its Reconciliation ignored. Denied: every `## Requirements` section, every `spec.md`, the rest of `openspec/`, `openspec/changes/archive/` and every other change.

- **Joined:** `grade10-site-auction-bid-increments-US1-TC1-2` decides the revised `grade10-site-auction-bid-increments-SC-01` and `grade10-site-auction-bid-increments-SC-12`.
- **Kept, no new scenario:** `grade10-site-auction-bid-increments-US1-TC6-1` walks `grade10-site-auction-auction-SC-62` and `grade10-site-auction-bid-increments-US1-TC7-1` walks `grade10-site-auction-auction-SC-64` from the minimum's side; the rules sit in `grade10-site/auction/auction`, whose suite walks them too.
- **Raised, decided by the round:** a lot starting at the currency ceiling (Q30). It moves no scenario.
- **Raised, rejected:** none.
- **Uncovered anchors:** none.
