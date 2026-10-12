# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-09, tcs-rules r4

## g10.shared-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** custom maximum entry to respect the supplied currency ceiling,
**so that** the collector reviews a usable amount before committing.

<!-- trace:case id=g10.shared-auction-listing.TC-fb2 rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC19: Draft at the currency ceiling is accepted

Runs once per row of **Test data**, in both set and raise modes.

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
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The consumer supplies the row's ceiling in minor units.
* The floor and any committed maximum are below the ceiling.
* The custom maximum field is empty.

**Test data:**

| Currency | Ceiling (whole major units) | Committed amount (minor units) |
| --- | --- | --- |
| USD | 10000000 | 1000000000 |
| HKD | 80000000 | 8000000000 |
| JPY | 5000000000 | 5000000000 |

**Steps:**

1. Enter the row's ceiling into the custom maximum field.
2. Read the displayed draft and reviewed amount.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* The displayed draft equals the row's ceiling.
* The reviewed amount agrees with the displayed draft.
* The callback receives the row's committed amount, once.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-ygd rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC20: Typed digit past the ceiling retains the draft

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum draft equals the row's prior draft.

**Test data:**

| Currency | Ceiling | Prior draft |
| --- | --- | --- |
| USD | 10000000 | 10000000 |
| USD | 10000000 | 9000000 |
| HKD | 80000000 | 80000000 |
| HKD | 80000000 | 79000000 |
| JPY | 5000000000 | 5000000000 |
| JPY | 5000000000 | 4900000000 |

**Steps:**

1. Put the caret at the draft's end without selecting it.
2. Type one `1` using the native keyboard operation.
3. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft remains the row's prior draft.
* The reviewed amount agrees with the retained draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-35i rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC21: Oversized paste into empty field becomes the ceiling

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum field is empty.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001 | 10000000 |
| HKD | 80000001 | 80000000 |
| JPY | 5000000001 | 5000000000 |

**Steps:**

1. Paste the row's paste into the custom maximum field.
2. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft equals the row's ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-jr1 rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC22: Oversized replacement of a draft becomes the ceiling

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Replacement | Entry | Ceiling |
| --- | --- | --- | --- |
| USD | 10000001 | Paste | 10000000 |
| USD | 10000001 | Selected multi-character insertText | 10000000 |
| USD | 10000001 | Fill with multi-character insertText | 10000000 |
| HKD | 80000001 | Paste | 80000000 |
| HKD | 80000001 | Selected multi-character insertText | 80000000 |
| HKD | 80000001 | Fill with multi-character insertText | 80000000 |
| JPY | 5000000001 | Paste | 5000000000 |
| JPY | 5000000001 | Selected multi-character insertText | 5000000000 |
| JPY | 5000000001 | Fill with multi-character insertText | 5000000000 |

**Steps:**

1. Select the existing custom maximum draft.
2. Replace it using the row's entry and replacement.
3. Read the displayed draft and reviewed amount.

**Expected Results:**

* The displayed draft equals the row's ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-bfp rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC23: Oversized fractional paste becomes the ceiling after cleaning

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001.99 | 10000000 |
| HKD | 80000001.99 | 80000000 |
| JPY | 5000000001.99 | 5000000000 |
| USD | 999999999999999999999999999999.99 | 10000000 |
| HKD | 999999999999999999999999999999.99 | 80000000 |
| JPY | 999999999999999999999999999999.99 | 5000000000 |

**Steps:**

1. Select the existing custom maximum draft.
2. Paste the row's paste into the custom maximum field.

**Expected Results:**

* The fractional suffix is discarded without rounding.
* The displayed draft equals the row's ceiling.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-hsy rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC24: Raise field retains typed draft and clamps replacement

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency, in raise mode.
* The collector leads with a committed maximum below `500`.
* The raise custom maximum draft equals the row's ceiling.

**Test data:**

| Currency | Ceiling | Replacement
| --- | --- | --- |
| USD | 10000000 | 10000001 |
| HKD | 80000000 | 80000001 |
| JPY | 5000000000 | 5000000001 |

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

* Step 2: the displayed draft remains the row's ceiling.
* Step 4: the displayed draft equals the row's ceiling.
* Steps 7 and 8: paste clamps to the row's ceiling.
* The reviewed amount agrees with every corrected draft.
* No ceiling message appears in either mode.

<!-- trace:case id=g10.shared-auction-listing.TC-ftm rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC25: Ceiling correction shows no maximum or invalid amount message

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum draft is `60500`.
* The listing's next minimum is at or below `60500`.
* No message appears beside the custom maximum field.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000001 | 10000000 |
| HKD | 80000001 | 80000000 |
| JPY | 5000000001 | 5000000000 |

**Steps:**

1. Select the existing draft and paste the row's paste.
2. Read the custom maximum field and surrounding messages.

**Expected Results:**

* The displayed draft equals the row's ceiling.
* No maximum-bid, invalid-amount or below-floor message appears.
* The reviewed amount agrees with the corrected draft.
* No ceiling message appears.

<!-- trace:case id=g10.shared-auction-listing.TC-g02 rev=2 covers=g10.shared-auction-listing.SC-9e0,g10.shared-auction-listing.SC-8ym,g10.shared-auction-listing.SC-wdd,g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-y2e,g10.shared-auction-listing.SC-xxl,g10.shared-auction-listing.SC-6n7,g10.shared-auction-listing.SC-q3n,g10.shared-auction-listing.SC-qdv,g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC26: Fractional paste at the currency ceiling is accepted

Runs once per row of **Test data**, in both set and raise modes.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` in the row's currency and mode.
* The custom maximum draft is `500`.

**Test data:**

| Currency | Paste | Ceiling |
| --- | --- | --- |
| USD | 10000000.99 | 10000000 |
| HKD | 80000000.99 | 80000000 |
| JPY | 5000000000.99 | 5000000000 |

**Steps:**

1. Select the existing draft and paste the row's paste.
2. Read the displayed draft and reviewed amount.
3. Commit the maximum and read the callback amount.

**Expected Results:**

* The fractional suffix is discarded without rounding.
* The displayed draft equals the row's ceiling.
* The reviewed amount agrees with the displayed draft.
* The callback receives the ceiling in integer minor units.

## Settled

- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the lot card (decisions Q2).
- The linked-card tooltip scenario keeps its title, since retitling needs a new id (decisions Q18).
- The field uses the listing currency's bid ceiling: USD 10,000,000, HKD 80,000,000 and JPY 5,000,000,000 whole major units (Q1).
- An appended typed digit above the ceiling retains the valid draft; oversized paste or replacement becomes the ceiling after whole-major cleaning (Q2, Q5).
- Ceiling correction shows no maximum-bid or invalid-amount message; set and raise share the rule (Q3, Q5).
- Winner is a primary crown after the amount when the consumer sets
  `isWinner` (closed sold), not a Winner badge (`bid-history-winner-priority` Q1, Q3).
- Equal-max non-leaders use the Info tip in the amount tone with
  earlier-leads copy (`bid-history-winner-priority` Q2).
- No new Badge size or footnote under Recent bids (`bid-history-winner-priority` non-goals).
- The tip icon's tone and the crown's place before You are requirement
  clauses the cases walk, with no scenario of their own (`bid-history-winner-priority` Q5).
- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain; no substitute strip under the stage.
- A one-image gallery shows no rail or previous/next. An empty gallery shows
  no item or previous/next.
- `ListingGallery` strip rules are unchanged by this change.
- A catalogue tile's Ends, Opens and Closed lines all name the viewer's zone.
- The lot bid card carries a dated collector deadline line beside its countdown, and its closed block names the viewer's zone after a close time that shows a clock; a close shown as a day alone names none.
- An older bid row's time carries no zone name; each row keeps its accepted instant as data, and a supplied display text replaces only the formatted time.
- Activity time reads relative below seven days and as a local moment from seven days.
- A zone name on a tile or a bid card is English in every language: the zone's short name in US English, HKT for Hong Kong, and an offset where US English has none.
- The tile's Ends, Opens and Closed words stay English in every language, and a Chinese month's wording is not asserted by these cases; a month that reads as a bare number goes to the bug lane.

## Reconciliation

**Run:** QA1 read only the frozen behavioral bundle at `/private/tmp/issue-1008-01a11f70-1791528937777/qa1-input`: outline, journeys, proposal, decisions, UI states, linked PRDs, configuration, continuity cases and the auction domain suite. It was denied Requirements, scenario markers and coverage, technical design, tasks, reconciliation and archives. QA2 read that bundle, independent Dev output and durable continuity markers at checkpoint `7e827ba031b8083adb5d16105a7bae40e689d3e2`, against fetched main `68548f870`.

| Blind case | Disposition | Scenario claims verified |
| --- | --- | --- |
| US1-TC19-2 | **Folded in** - exact ceilings in USD/HKD/JPY; both modes and callback units | SC-38, SC-58 |
| US1-TC20-2 | **Folded in** - native single-digit append retains the prior draft; includes prior drafts below the ceiling to distinguish restoration from clamping | SC-39, typed branch of SC-60 |
| US1-TC21-2 | **Folded in** - native paste into empty field becomes the ceiling in both modes | SC-40 |
| US1-TC22-2 | **Folded in** - selected paste and multi-character replacement become the ceiling; fill using insertText is replacement | SC-41, SC-59 |
| US1-TC23-2 | **Folded in** - fractional paste is cleaned before clamping, including amounts beyond safe Number precision | SC-42 |
| US1-TC24-2 | **Folded in** - raise shares append restoration and replacement correction; appended paste clamps in both modes | SC-43, SC-59, pasted branch of SC-60 |
| US1-TC25-2 | **Folded in** - correction alone shows no ceiling, invalid-amount or below-floor copy | No-copy clauses of SC-38 to SC-43 and SC-53; SC-59, SC-60 |
| US1-TC26-2 | **Folded in** - fractional paste at the cleaned ceiling is accepted without rounding; both modes and committed minor units | SC-53, SC-58 |

- **Native operations** - The browser walk drives keyboard append, selection replacement, multi-character fill and paste. Shared component regressions check actual input DOM, draft/review state and callback units together. Every corrected draft agrees with the reviewed amount. Existing cleaning, clear and ordinary below-ceiling paths remain focused money/component regressions in tasks 1.1 and 1.4.
- **Consumer contract** - The required `view.ceilingMinor` is supplied with currency by the consumer from `bidCeiling(currency)`. Type checks in tasks 1.4 and 2.3 verify required migration; the adapter regression in task 2.1 verifies policy wiring. Shared code does not duplicate currency policy.
- **Superseded reading** - Empty-on-paste and restore-on-paste are rejected by Q1/Q2/Q5. SC-40 to SC-43 keep issued titles for CLI identity; their current result clauses control the cases. No case is dropped.
- **Continuity** - Unchanged cases remain in the durable suite and are retained by the acceptance fold; they are not copied into this narrow active suite. The changed ceiling anchor lists current scenarios in source order. TC19 to TC26 remain draft at revision 2.
- **Tasks** - Group 1 owns shared input, helper/component tests, fixtures and source/type/story verification. Groups 2 and 4 own consumer wiring and native collector walks. This records planned verification, not executed test results.
- **Questions** - None. Frozen Q1 to Q5 settle the ceiling branches. QA2 adds executable detail without changing anchors or product decisions.
