# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/14
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-listing-SC-35, shared-ui-auction-listing-SC-36, shared-ui-auction-listing-SC-37, shared-ui-auction-listing-SC-52

## shared.ui-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** the panel to never offer an amount the supplied currency ceiling refuses,
**so that** the collector reads the limit instead of a broken raise form.

<!-- trace:case id=g10.shared-auction-listing.TC-fb2 rev=3 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-q3n -->
### shared.ui-auction-listing.US1-TC19: Draft at the currency ceiling is accepted

Runs once in set mode and once in raise mode.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The consumer supplies the USD ceiling of 10000000 whole major units, in minor units.
* The floor and any committed maximum are below the ceiling.
* The custom maximum field is empty.

**Test data:**

| Currency | Ceiling (whole major units) | Committed amount (minor units) |
| --- | --- | --- |
| USD | 10000000 | 1000000000 |

**Steps:**

1. Enter the USD ceiling into the custom maximum field.
2. Read the displayed draft and reviewed amount.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* The displayed draft equals the USD ceiling.
* The reviewed amount agrees with the displayed draft.
* The callback receives the committed amount, once.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-ygd rev=3 covers=g10.shared-auction-listing.SC-8ym -->
### shared.ui-auction-listing.US1-TC20: Typed digit past the ceiling retains the draft

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft equals the prior draft.

**Test data:**

| Currency | Ceiling | Prior draft |
| --- | --- | --- |
| USD | 10000000 | 10000000 |
| USD | 10000000 | 9000000 |

**Steps:**

1. Put the caret at the draft's end without selecting it.
2. Type one `1` using the native keyboard operation.
3. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft remains the prior draft.
* The reviewed amount agrees with the retained draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-35i rev=3 covers=g10.shared-auction-listing.SC-wdd -->
### shared.ui-auction-listing.US1-TC21: Oversized paste into empty field becomes the ceiling

Runs once in set mode and once in raise mode.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum field is empty.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001 | 10000000 |

**Steps:**

1. Paste the row's paste into the custom maximum field.
2. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft equals the USD ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-jr1 rev=3 covers=g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-qdv -->
### shared.ui-auction-listing.US1-TC22: Oversized replacement of a draft becomes the ceiling

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Replacement | Entry | Ceiling |
| --- | --- | --- | --- |
| USD | 10000001 | Paste | 10000000 |
| USD | 10000001 | Selected multi-character insertText | 10000000 |
| USD | 10000001 | Fill with multi-character insertText | 10000000 |

**Steps:**

1. Select the existing custom maximum draft.
2. Replace it using the row's entry and replacement.
3. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft equals the USD ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-bfp rev=3 covers=g10.shared-auction-listing.SC-y2e -->
### shared.ui-auction-listing.US1-TC23: Oversized fractional paste becomes the ceiling after cleaning

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001.99 | 10000000 |
| USD | 999999999999999999999999999999.99 | 10000000 |

**Steps:**

1. Select the existing custom maximum draft.
2. Paste the row's paste into the custom maximum field.

**Expected Results:**

* The fractional suffix is discarded without rounding.
* The displayed draft equals the USD ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-hsy rev=3 covers=g10.shared-auction-listing.SC-xxl -->
### shared.ui-auction-listing.US1-TC24: Raise field retains typed draft and clamps replacement

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD, in raise mode.
* The collector leads with a committed maximum below `500`.
* The raise custom maximum draft equals the USD ceiling.

**Test data:**

| Currency | Ceiling | Replacement
| --- | --- | --- |
| USD | 10000000 | 10000001 |

**Steps:**

1. Append `1` to the raise custom maximum field.
2. Read the displayed draft.
3. Select the draft and paste the row's replacement.
4. Read the displayed draft.
5. Set the draft to `500`, put the caret at its end.
6. Paste the row's replacement without selecting the draft.
7. Read the displayed draft and reviewed amount.
8. Repeat steps 5 to 7 in set mode.

**Expected Results:**

* Step 2: the displayed draft remains the USD ceiling.
* Step 4: the displayed draft equals the USD ceiling.
* Steps 7 and 8: paste clamps to the USD ceiling.
* The reviewed amount agrees with every corrected draft.
* No ceiling message appears in either mode.

<!-- trace:case id=g10.shared-auction-listing.TC-ftm rev=3 covers=g10.shared-auction-listing.SC-z2x -->
### shared.ui-auction-listing.US1-TC25: Ceiling correction shows no maximum or invalid amount message

Runs once in set mode and once in raise mode.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft is `60500`.
* The listing's next minimum is at or below `60500`.
* No message appears beside the custom maximum field.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001 | 10000000 |

**Steps:**

1. Select the existing draft and paste the row's paste.
2. Read the custom maximum field and surrounding messages.

**Expected Results:**

* The displayed draft equals the USD ceiling.
* No maximum-bid, invalid-amount or below-floor message appears.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-g02 rev=3 covers=g10.shared-auction-listing.SC-6n7 -->
### shared.ui-auction-listing.US1-TC26: Fractional paste at the currency ceiling is accepted

Runs once in set mode and once in raise mode.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000000.99 | 10000000 |

**Steps:**

1. Select the existing draft and paste the row's paste.
2. Read the displayed draft and reviewed amount.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* The fractional suffix is discarded without rounding.
* The displayed draft equals the USD ceiling.
* The reviewed amount agrees with the displayed draft.
* The callback receives the ceiling in integer minor units.

<!-- trace:case id=g10.shared-auction-listing.TC-dej rev=2 covers=g10.shared-auction-listing.SC-huw -->
### shared.ui-auction-listing.US1-TC59: A quick bid above the ceiling is offered at the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD.
* The collector leads with the row's committed maximum.
* The row's chips hold at least one amount above the ceiling and at least one below it.

**Test data:**

| Currency | Ceiling (major) | Committed maximum (major) | Increment (major) | Chips offered |
| --- | --- | --- | --- | --- |
| USD | 10000000 | 9999800 | 100 | 9999900, 10000000 (the 2x and 4x amounts both land on the ceiling and merge to one chip) |
| USD | 10000000 | 9999700 | 100 | 9999800, 9999900, 10000000 |

**Steps:**

1. Read each quick-bid chip's caption and amount.
2. Select the chip whose stepped amount exceeds the ceiling.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* Every chip amount is at or below the ceiling.
* A chip whose stepped amount exceeds the ceiling shows the ceiling and is captioned as the auction's limit, not the amount's delta.
* A chip at or below the ceiling keeps its stepped amount and caption.
* Committing a clamped chip passes the ceiling in minor units.

<!-- trace:case id=g10.shared-auction-listing.TC-w4r rev=2 covers=g10.shared-auction-listing.SC-atq -->
### shared.ui-auction-listing.US1-TC60: Chips clamped onto the same amount merge to one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD.
* The collector leads with a committed maximum of `9999900`, and the increment is `100`, so all three stepped amounts land at or above the `10000000` ceiling.

**Steps:**

1. Read the quick-bid chip row.
2. Select the chip and commit.

**Expected Results:**

* The row shows one chip at `10000000`, captioned as the limit; no duplicate amount appears twice.
* The callback receives `1000000000` minor units.

<!-- trace:case id=g10.shared-auction-listing.TC-9rx rev=2 covers=g10.shared-auction-listing.SC-v6g,g10.shared-auction-listing.SC-1mi -->
### shared.ui-auction-listing.US1-TC61: A maximum at the ceiling collapses the entry group

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raise floor

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD with the `10000000` ceiling.
* The collector leads with the row's committed maximum and current bid.

**Test data:**

| Committed maximum (major) | Current bid (major) | Floor driving the collapse |
| --- | --- | --- |
| 10000000 | 1200 | maximum plus the minimum raise |
| 9999950 | 9999950 | minimum next bid 10000050, already above the ceiling |

**Steps:**

1. Read the raise group on the bid panel.
2. Look for quick-bid chips, the custom maximum field and the bid action.
3. Read the status row and the copy under it.

**Expected Results:**

* No quick-bid chip, no custom maximum field and no bid action render.
* A status row leads with `Max: 10000000` in the first row, and with `Max: 9999950` in the second.
* The row carries the private-maximum explanation behind its Info tooltip and one line that the auction accepts no higher amount; the raise mechanism line does not appear.
* The buyer-fee line still renders.

<!-- trace:case id=g10.shared-auction-listing.TC-5dh rev=2 covers=g10.shared-auction-listing.SC-cfl -->
### shared.ui-auction-listing.US1-TC62: A lot priced past the ceiling offers no entry

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raise floor

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD with the `10000000` ceiling.
* The lot's minimum next bid is above the ceiling.
* The collector holds no maximum on the lot.

**Steps:**

1. Read the bid panel's entry group.

**Expected Results:**

* No quick-bid chip, no custom maximum field and no bid action render.
* A status row names the ceiling amount and a line that bidding has reached the highest amount the auction accepts.
* The buyer-fee line still renders.

<!-- trace:case id=g10.shared-auction-listing.TC-swf rev=2 covers=g10.shared-auction-listing.SC-rnz -->
### shared.ui-auction-listing.US1-TC63: The collapse outranks the card setup lock

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid enrollment

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` under the needs-card enrollment signal.
* The collector leads with a committed maximum at the USD ceiling.

**Steps:**

1. Read the bid panel's entry group.

**Expected Results:**

* The collapsed status row renders; the disabled chips, custom field and link-card action do not.

<!-- trace:case id=g10.shared-auction-listing.TC-oem rev=1 covers=g10.shared-auction-listing.SC-2wv -->
### shared.ui-auction-listing.US1-TC64: A digit appended at the ceiling is kept by paste and dropped by typing
Runs once in set mode and once in raise mode.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in USD and the mode the run names.
* The custom maximum draft equals the USD ceiling of `10000000` and the caret is at its end.

**Steps:**

1. Append `1` by paste and read the displayed draft.
2. Set the draft to `10000000` again, append `1` by typing and read the displayed draft.

**Expected Results:**

* Step 1: the displayed draft reads `10000000`, the USD ceiling.
* Step 2: the displayed draft reads `10000000`, the previous draft.
* No ceiling message appears in either step.


## Settled

- None this run. The blind reading raised the question whether the HKD and JPY ceilings stay as dead branches; it went to `decisions.md` `## Raised` and landed as Q26.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-14 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's refreshed cases with Dev's delta scenarios on the `Custom maximum ceiling`, `Quick bids`, `Raise floor` and `Bid enrollment` anchors of `shared-ui-auction-listing`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q27 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| A draft at the ceiling is accepted, and the callback receives the ceiling in minor units, in set and raise | **Folded in:** `shared-ui-auction-listing-SC-38` and `shared-ui-auction-listing-SC-58`, asserted by `g10.shared-auction-listing.US1-TC19`. The HKD and JPY rows are gone from the case |
| A typed digit past the ceiling keeps the previous draft, in set and raise | **Folded in:** `shared-ui-auction-listing-SC-39` by `g10.shared-auction-listing.US1-TC20`, `shared-ui-auction-listing-SC-43` by `US1-TC24` (the raise path) |
| An oversized paste or replacement, a fractional paste and a paste at the ceiling read the USD ceiling with no ceiling message | **Folded in:** `shared-ui-auction-listing-SC-40` by `g10.shared-auction-listing.US1-TC21`, `shared-ui-auction-listing-SC-41` and `shared-ui-auction-listing-SC-59` by `US1-TC22`, `shared-ui-auction-listing-SC-42` by `US1-TC23`, `shared-ui-auction-listing-SC-53` by `US1-TC26`. `US1-TC25` reads the no-message clause on a paste over a valid draft and shares `shared-ui-auction-listing-SC-41` with `US1-TC22` |
| A paste appended to a draft that equals the ceiling leaves the ceiling shown, and a typed digit leaves the previous draft | **Added:** `g10.shared-auction-listing.US1-TC64` asserts `shared-ui-auction-listing-SC-60`. `US1-TC20` reads the typed half only and `US1-TC24` pastes onto a draft of `500`, so neither starts from a draft at the ceiling |
| A chip above the ceiling is offered at the ceiling and captioned as the limit; chips that land on the ceiling merge to one | **Folded in:** `shared-ui-auction-listing-SC-61` by `g10.shared-auction-listing.US1-TC59`, `shared-ui-auction-listing-SC-62` by `US1-TC60` |
| The raise floor above the ceiling and a maximum at the ceiling collapse the entry group; a lot priced past the ceiling offers no entry; the collapse outranks the card setup lock | **Folded in:** `shared-ui-auction-listing-SC-63` and `shared-ui-auction-listing-SC-64` by the two rows of `g10.shared-auction-listing.US1-TC61`, `shared-ui-auction-listing-SC-65` by `US1-TC62`, `shared-ui-auction-listing-SC-66` by `US1-TC63` |
| `g10.shared-auction-listing.US1-TC59` listed three chips for a leader at 9999800 with the 2x and 4x amounts both at the ceiling | **Corrected:** the requirement merges chips that show one amount, so the row now reads two chips; QA2 reworded the row, which the durable HKD row carried the same way |
| A leader's chips, a non-leader's chips, the opening price chip and the typed raise floor, restated with USD fixtures and no other change | **Out of suite:** `shared-ui-auction-listing-SC-35`, `shared-ui-auction-listing-SC-36`, `shared-ui-auction-listing-SC-52` and `shared-ui-auction-listing-SC-37` - the durable `g10.shared-auction-listing.TC-tcx`, `TC-lwb`, `TC-7vc` and `TC-gk7` hold them. Their rows still list HKD and JPY schedules beside USD; the USD rows read the same rule, and the HKD and JPY rows need removing at archive |
| The durable suite's ceiling and quick-bid cases carry HKD and JPY rows | **Not folded:** this suite's USD cases carry the same ids and replace them when the change is published; the HKD and JPY rows of `g10.shared-auction-listing.US1-TC3` to `US1-TC6` need removing then |

**Uncovered anchors:** none for `Custom maximum ceiling`, `Quick bids`, `Raise floor` or `Bid enrollment`.

**Over-claimed cases:** none. `g10.shared-auction-listing.US1-TC19` to `US1-TC26` are `automated` and name a `grade10` end-to-end test as their decider; that test still reads the HKD and JPY rows until task 10.2 and the walk of group 11 update it, so the `Decided by` claim is pending there.

**Contradictions:** none between a case and a scenario. `shared-ui-auction-listing-SC-38` to `shared-ui-auction-listing-SC-43`, `shared-ui-auction-listing-SC-53`, `shared-ui-auction-listing-SC-35`, `shared-ui-auction-listing-SC-36`, `shared-ui-auction-listing-SC-37` and `shared-ui-auction-listing-SC-52` changed their fixtures from HKD to USD with no `rev` bump on the marker; Dev owns that repair.
