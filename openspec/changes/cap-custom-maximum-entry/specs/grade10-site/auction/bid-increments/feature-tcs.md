# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

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

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

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
The collector is enrolled on an open JPY listing whose minimum bid is <minimum>.
The maximum is sent to the auction service directly, so the refusal read is
the service's own; the bid panel's custom maximum field takes up to
9,999,999,999 and would carry <maximum> as well.

**Test data:**

| minimum | ceiling | maximum |
| --- | ---: | ---: |
| 150000 JPY minor units | 5000000000 | 5000000001 |

**Steps:**

1. As the collector, commit an auto-bid maximum of <maximum> on the listing
   through the auction service's bid procedure.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names <ceiling> as the ceiling.
* No maximum is recorded for the collector.

## Reconciliation

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

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-auction-bid-increments-US1-TC8-2` | A person drives the auction service's bid procedure for each currency row against the deployed service, in task 5.1's walk; `bidIncrements.test.ts` in the application repository pins the ceiling value only |
| `grade10-site-auction-bid-increments-US2-TC3-2` | A person sends the JPY maximum to the deployed service's bid procedure and reads the refusal and the collector's maximums, in task 5.1's walk; `placeBid.spec.ts` in the application repository is to refuse it once task 4.1 lands |
