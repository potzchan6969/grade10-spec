# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-09, tcs-rules r4

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC2-2: Direct bid above the ceiling is refused without effects

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
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer(card linked, account in good standing) can bid on an open listing in the row's currency.
* The listing's minimum is below the ceiling.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Currency | Ceiling | Bid amount |
| --- | --- | --- |
| USD | 1000000000 minor units (USD 10,000,000.00) | 1000000001 minor units |
| HKD | 8000000000 minor units (HKD 80,000,000.00) | 8000000001 minor units |
| JPY | 5000000000 minor units (JPY 5,000,000,000) | 5000000001 minor units |

**Steps:**

1. Read the listing's price, leader, bid count and maximums.
2. Submit the row's bid amount through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals the row's ceiling.
* Step 4: price, leader, bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

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
* The maximum is sent directly to the auction service.

**Test data:**

| `<minimum>` | `<ceiling>` | `<maximum>` |
| --- | ---: | ---: |
| 150000 JPY minor units | 5000000000 | 5000000001 |

**Steps:**

1. As the collector, submit `<maximum>` through the authenticated auction API.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names `<ceiling>` as the ceiling.
* No maximum is recorded for the collector.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=2 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC4-2: Listing at the ceiling refuses a further direct bid

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
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* customer A leads the open listing at the row's ceiling.
* customer B(card linked, account in good standing) can bid on the listing.
* The request is sent directly, bypassing the custom maximum field.

**Test data:**

| Currency | Ceiling | Bid amount |
| --- | --- | --- |
| USD | 1000000000 minor units (USD 10,000,000.00) | 1000000001 minor units |
| HKD | 8000000000 minor units (HKD 80,000,000.00) | 8000000001 minor units |
| JPY | 5000000000 minor units (JPY 5,000,000,000) | 5000000001 minor units |

**Steps:**

1. Read the listing's bid count and maximums.
2. As customer B, submit the amount through the authenticated auction API.
3. Read the API response.
4. Read the listing's price, leader, bid count and maximums.
5. Read the operational refusal entry for this attempt.

**Expected Results:**

* Step 3: the service refuses with `AMOUNT_TOO_HIGH`.
* Step 3: `ceilingMinor` equals the row's ceiling.
* Step 4: price remains the ceiling and customer A leads.
* Step 4: bid count and maximums remain unchanged.
* Step 5: one entry names bidder, listing, code, amount and ceiling.

## Settled

- The custom field stops or corrects oversized entry at the currency ceiling. Service refusal cases send amounts directly; the service ceiling and refusal remain unchanged (Q1, Q4).

- Before any accepted bid the minimum is the opening price: the starting price, or the currency's lowest increment on a 0 start. From the first accepted bid, the current bid plus its tier increment applies.
- A first bid of 0, or of one minor unit, is a non-goal; no case asserts either.
- Where a lone maximum above the opening price stands is the auto-bidding suite's; this suite asserts only the minimum.

## Reconciliation

**Run:** QA1 read only `/private/tmp/issue-1008-01a11f70-1791528937777/qa1-input`: frozen outline and context journey, proposal, decisions, linked PRD and UI states, configuration, continuity cases and the auction domain suite. Requirements, scenario markers and coverage, technical design, tasks, reconciliation and archives were excluded. QA2 reconciled it with independent Dev output and durable continuity markers at checkpoint `7e827ba031b8083adb5d16105a7bae40e689d3e2`, against fetched main `68548f870`.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| US2-TC1-1 | **Retained** - eligible exact-ceiling bid remains accepted through UI | SC-08 |
| US2-TC2-2 | **Folded in** - authenticated API request for each currency replaces blocked oversized UI entry; code, ceiling, unchanged facts and operator log remain asserted | SC-09 |
| US2-TC3-2 | **Retained** - existing API maximum refusal loses only its stale universal-field-cap pre-condition; issued ID and revision remain unchanged | SC-10 |
| US2-TC4-2 | **Folded in** - authenticated API request reaches a listing already at ceiling; price, leader, bid count and maxima remain unchanged | SC-11 |

- **Backend contract** - The ceiling requirement remains byte-for-byte unchanged. Refusal answers still name minor-unit ceilings; removing collector copy does not remove the API answer or operational entry.
- **Execution boundary** - The custom field corrects oversized drafts before submission, so oversized service cases use authenticated API. Exact-ceiling acceptance stays on UI.
- **Task finding resolved** - Task 3.1 originally demanded a failing regression for unchanged backend behavior. The coordinator repaired its wording to retain passing backend evidence and migrate the superseded UI route to authenticated API without artificial backend red. Changed input and presentation keep red-before-green in tasks 1.1 and 2.1. No behavioral anchor changed and no restart is required.
- **Continuity** - Unchanged cases remain in the durable suite with their issued IDs, revisions, covers, classifications and behavior; the acceptance fold retains them without copying them into this narrow active suite. US2-TC2 and US2-TC4 remain draft at revision 2; US2-TC3 keeps its issued revision 2. Current US2 covers follow SC-08 to SC-11 in source order.
- **Tasks** - Group 3 verifies backend evidence and migrates execution; tasks 4.2 to 4.4 run and record API/UI walks. These are planned checks, not execution results.
- **Questions** - None. Q1/Q4 and the unchanged contract settle backend scope; the task repair is mechanical.
