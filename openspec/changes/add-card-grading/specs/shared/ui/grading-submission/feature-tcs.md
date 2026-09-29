# shared/ui/grading-submission Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. Each block sits in its sidebar under Grading Submission, one entry per story.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* A callback a block reports logs in the Actions panel under its own name. A story's own checks run when it opens and show in the Interactions panel; before a step that clicks, return the story to its start there and clear the Actions panel.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## shared-ui-grading-submission-US1: The grading submission blocks

**Walked by:** nobody on their own - a component contract every collector-facing grading page composes; the journeys of `grade10-site/grading/submission-plan`, `grade10-site/grading/dropoff-booking` and `grade10-site/grading/submission-lifecycle` are what reach it.

**As a** consuming grading page,
**I want** the collector-facing blocks and every state through props alone,
**so that** every grading surface composes the same contract instead of redrawing it.

### shared-ui-grading-submission-US1-TC1-1: Every named grading block exports from the package entry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open at its `shared/ui/grading-submission` comment.

**Steps:**

1. List every component exported under the `shared/ui/grading-submission` comment.
2. Match the list against the thirteen named blocks the capability declares.
3. Find each component's prop type and copy type beside it.

**Expected Results:**

* `GradingFeeSheet`, `GradingCardList`, `GradingCardRecord`, `GradingPasteSheet`, `GradingLevelPicker`, `GradingReview`, `GradingStatusRail`, `GradingOwnershipChip`, `GradingPickupCard`, `GradingNamedCollector`, `GradingGradeCards`, `GradingMoneyBlock` and `GradingUncollectedLadder` are all exported.
* No other component is exported under that comment.
* Each export carries its own `<Name>Props` type and a `<Name>Copy` type for its words.

### shared-ui-grading-submission-US1-TC2-1: The booking set is imported unchanged, not redrawn

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open.

**Steps:**

1. Find the `shared/ui/appointment-booking` exports: `BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`, `BookingConfirmation` and `BookingManageCard`.
2. Read every export under the `shared/ui/grading-submission` comment.
3. Look for a grading shop picker, day and time picker, details form, confirmation or manage card, under any name.

**Expected Results:**

* The five booking blocks resolve from the package's public entry.
* No grading export duplicates a booking block.

### shared-ui-grading-submission-US1-TC3-1: No console-shaped component ships from the package

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open at its `shared/ui/grading-submission` comment.

**Steps:**

1. Read every export under that comment.
2. Check each for an operator's view: a queue, a runbook, a batch, receiving or settings.

**Expected Results:**

* No export renders a console view; every export is collector-facing.

### shared-ui-grading-submission-US1-TC70-1: A template missing a value refuses by name, never a literal placeholder

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* `fillGradingCopy` and `GradingLocaleProps` are imported from the store's `packages/ui/src/index.ts`.

**Test data:**

| Field | Value |
| --- | --- |
| <template missing a value> | `Collect at {shop}`, with values `{}` |
| <template answered> | `{set} · {number}`, with values `{ set: "Base Set", number: "4/102" }` |

**Steps:**

1. Call `fillGradingCopy` with <template missing a value>.
2. Call `fillGradingCopy` with <template answered>.

**Expected Results:**

* Step 1 throws an error naming `{shop}` and returns no text.
* Step 2 returns the template with every placeholder replaced.

### shared-ui-grading-submission-US1-TC4-1: The fee sheet lists one grader's levels and figures

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The One Grader story gives `GradingFeeSheet` one grader, PSA, with four levels, each naming a ceiling, the cards a submission, a fee and the weeks back.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / One Grader at <grade10 ui workbench url>.
2. Read each level row.

**Expected Results:**

* Every level row names its ceiling, cards a submission, fee and weeks back.
* No grader control is drawn, since there is one grader.

### shared-ui-grading-submission-US1-TC5-1: Cover rate shows only on the levels that carry one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Cover Column story gives `GradingFeeSheet` a grader whose Express and Super Express levels each carry a cover rate, and whose Value level carries none.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / Cover Column at <grade10 ui workbench url>.
2. Read each level row's cover column.

**Expected Results:**

* Express and Super Express name their cover rate.
* Value, the level carrying none, shows no cover rate.

### shared-ui-grading-submission-US1-TC6-1: A grader per tab keeps three fee sheets apart

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Three Graders story gives `GradingFeeSheet` three graders, PSA, CGC and BGS, with PSA selected.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / Three Graders at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click CGC, the second grader.

**Expected Results:**

* Step 1: the grader control lists all three graders.
* Step 3: `onSelectGrader` logs `cgc`, and CGC's own table replaces PSA's.
* Step 3: CGC reads as selected.

### shared-ui-grading-submission-US1-TC7-1: A closed level names what closes it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The row's story gives `GradingLevelPicker` the row's level, closed for the row's reason.

**Test data:**

| Closed by | Story | Closed level | What it names |
| --- | --- | --- | --- |
| A card declared above the ceiling | Level Closed By A Value | Value | The card declared above its ceiling |
| The count of cards listed | Level Closed By A Count | Bulk | The count it needs and the count listed |

**Steps:**

1. Open Grading Submission / GradingLevelPicker / the row's story at <grade10 ui workbench url>.
2. Read the closed level's card.
3. Return the story to its start and clear the Actions panel.
4. Click the closed level.

**Expected Results:**

* Step 2: the closed level reads Not available, with the reason the row names.
* Step 4: the level is not selected, and nothing logs under `onSelectLevel`.

### shared-ui-grading-submission-US1-TC8-1: The estimate reads cards times fee plus the cover line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Estimate With Cover story gives `GradingLevelPicker` Express picked and an estimate carrying the cards times the fee, a cover line, the total and the weeks.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Estimate With Cover at <grade10 ui workbench url>.
2. Read the estimate under the levels.

**Expected Results:**

* The estimate shows cards × fee, the cover line and the total, each as the estimate gives it.
* The weeks back read as given.
* No figure of the picker's own shows, such as the fee times the cards alone.

### shared-ui-grading-submission-US1-TC9-1: No level picked shows no estimate

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The No Level Picked story gives `GradingLevelPicker` no level picked and no estimate.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / No Level Picked at <grade10 ui workbench url>.

**Expected Results:**

* No estimate shows under the levels.

### shared-ui-grading-submission-US1-TC10-1: A matched card shows its reference sales

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Matched story gives `GradingCardList` one card, Charizard, matched in the reference, with a declared value and three reference sales.

**Steps:**

1. Open Grading Submission / GradingCardList / Matched at <grade10 ui workbench url>.
2. Read Charizard's card.

**Expected Results:**

* The card shows its set, number and matched line, the declared value and the three reference sales.
* The minimum grade reads on the card, with the line that the fee applies either way.

### shared-ui-grading-submission-US1-TC11-1: A card kept as typed shows no reference row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Kept As Typed story gives `GradingCardList` one card with no reference match, kept as typed.

**Steps:**

1. Open Grading Submission / GradingCardList / Kept As Typed at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click Add as typed.
4. Read the card.

**Expected Results:**

* Step 3: `onAdd` logs the typed name.
* Step 4: the card shows the name as typed.
* Step 4: the card reads as kept as typed.
* Step 4: no reference sales row renders.

### shared-ui-grading-submission-US1-TC12-1: A card with no declared value is named on the list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The No Value story gives `GradingCardList` three cards, one of them, Pikachu Illustrator, with no declared value.

**Steps:**

1. Open Grading Submission / GradingCardList / No Value at <grade10 ui workbench url>.
2. Read Pikachu Illustrator's card.

**Expected Results:**

* The list names Pikachu Illustrator as still needing a declared value.

### shared-ui-grading-submission-US1-TC13-1: A card above a ceiling is named on the list

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Above Bulks Ceiling story gives `GradingCardList` a card, Lugia first edition, declared above the level's ceiling.

**Steps:**

1. Open Grading Submission / GradingCardList / Above Bulks Ceiling at <grade10 ui workbench url>.
2. Read Lugia first edition's card.

**Expected Results:**

* The list names Lugia first edition as above the ceiling.
* The line naming a second submission on the same drop-off shows.

### shared-ui-grading-submission-US1-TC14-1: An empty card list shows no card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Empty List story gives `GradingCardList` no cards.

**Steps:**

1. Open Grading Submission / GradingCardList / Empty List at <grade10 ui workbench url>.

**Expected Results:**

* No card renders.
* Add a card and Paste a list remain available.

### shared-ui-grading-submission-US1-TC15-1: Editing, removing, the minimum grade and the paste fire their callbacks

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Matched story gives `GradingCardList` one card, Charizard, with its value declared and a minimum grade set.

**Steps:**

1. Open Grading Submission / GradingCardList / Matched at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click the edit button on Charizard's card.
4. Click Remove on Charizard's card.
5. Click the minimum grade tick on Charizard's card.
6. Click Paste a list.

**Expected Results:**

* Step 3: `onEdit` logs Charizard's id, opening it for editing.
* Step 4: `onRemove` logs Charizard's id.
* Step 5: `onMinimumGrade` logs Charizard's id and the tick's new state.
* Step 6: `onPaste` logs once.

### shared-ui-grading-submission-US1-TC16-1: The paste result names each outcome's count and line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Open story gives `GradingPasteSheet` a result of five counts from one pasted list: matched, kept as typed, without a value, above the ceiling, and skipped.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Open at <grade10 ui workbench url>.
2. Read the result rows under the pasted text.

**Expected Results:**

* Each of the five outcomes shows its own count and line.
* The counts read against the 20 lines read.

### shared-ui-grading-submission-US1-TC17-1: The Bulk notice renders once the pasted list carries it

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Bulk Notice story gives `GradingPasteSheet` a pasted list past twenty lines, and the consumer's Bulk line.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Bulk Notice at <grade10 ui workbench url>.
2. Read the sheet under the result rows.

**Expected Results:**

* The Bulk line names the level, its fee, its ceiling, its weeks and the longer drop-off.

### shared-ui-grading-submission-US1-TC18-1: Add stays disabled while the paste is matching

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Matching story gives `GradingPasteSheet` a result still loading.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Matching at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click the add button at the foot of the sheet.

**Expected Results:**

* Step 3: the add button is disabled, and nothing logs under `onApply`.

### shared-ui-grading-submission-US1-TC19-1: The review schedule lists every card handed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The Minimum Grade On The Schedule story gives `GradingReview` four cards, each with a name, set line, declared value and cover, one of them, Charizard, with a minimum grade.

**Steps:**

1. Open Grading Submission / GradingReview / Minimum Grade On The Schedule at <grade10 ui workbench url>.
2. Read each row under the schedule.

**Expected Results:**

* One row per card, each naming its name, set line, declared value and cover; Charizard's minimum grade beside it.
* The declared total and the fee read as given.
* The good-to-know lines read in the order given.

### shared-ui-grading-submission-US1-TC20-1: The upcharge warning names both prices per card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The Upcharge Warning story gives `GradingReview` one card, Charizard, above its level's ceiling, with the level it moves to, the difference due and the higher level's fee now.

**Steps:**

1. Open Grading Submission / GradingReview / Upcharge Warning at <grade10 ui workbench url>.
2. Read the warning above the schedule's totals.

**Expected Results:**

* The warning names the card, the level it moves to, the difference due and the higher level's current fee.

### shared-ui-grading-submission-US1-TC21-1: No card above a ceiling shows no upcharge warning

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The No Warning story gives `GradingReview` no upcharge warning.

**Steps:**

1. Open Grading Submission / GradingReview / No Warning at <grade10 ui workbench url>.
2. Read the review from top to bottom.

**Expected Results:**

* No upcharge warning shows anywhere on the review.

### shared-ui-grading-submission-US1-TC22-1: Book stays disabled until the consent tick is checked

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The Consent Unticked story gives `GradingReview` the collection statement unticked.

**Steps:**

1. Open Grading Submission / GradingReview / Consent Unticked at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click Book the drop-off.
4. Tick the collection statement.
5. In the Controls panel, set `consented` to true, as the consumer does on the tick.
6. Click Book the drop-off.

**Expected Results:**

* Step 3: Book the drop-off is disabled, and nothing logs.
* Step 4: `onConsent` logs true.
* Step 5: Book the drop-off is enabled.
* Step 6: `onBook` logs.

### shared-ui-grading-submission-US1-TC23-1: Booking pending disables both action buttons

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The Booking story gives `GradingReview` the statement ticked and a booking pending.

**Steps:**

1. Open Grading Submission / GradingReview / Booking at <grade10 ui workbench url>.
2. Read the two buttons at the foot of the review.

**Expected Results:**

* Book the drop-off and Save and book later are both disabled.

### shared-ui-grading-submission-US1-TC24-1: A booking error renders in the error tone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* The Plan Expired Meanwhile story gives `GradingReview` a refusal saying the plan expired.

**Steps:**

1. Open Grading Submission / GradingReview / Plan Expired Meanwhile at <grade10 ui workbench url>.
2. Read the review above the two buttons.
3. Clear the Actions panel.
4. Click Book the drop-off.

**Expected Results:**

* Step 2: the refusal the story gives renders in the error tone.
* Step 4: nothing logs under `onBook`.

### shared-ui-grading-submission-US1-TC25-1: The status rail marks the reached stage among seven

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* The Sent story gives `GradingStatusRail` the stage Sent, a middle stage of the seven.

**Steps:**

1. Open Grading Submission / GradingStatusRail / Sent at <grade10 ui workbench url>.
2. Read all seven steps of the rail.

**Expected Results:**

* Planned, Booked and Handed in read as done.
* Sent reads as the stage reached, marked current.
* Graded, Back and Home read as still to come.

### shared-ui-grading-submission-US1-TC26-1: An ended submission's rail stays at its ending stage

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* The Ended story gives `GradingStatusRail` the stage Planned, and an ending that names a cancellation.

**Steps:**

1. Open Grading Submission / GradingStatusRail / Ended at <grade10 ui workbench url>.
2. Read the rail and the line beside it.

**Expected Results:**

* The rail stays at Planned, marked as the stage reached.
* The line names the ending; no later stage reads as reached.

### shared-ui-grading-submission-US1-TC27-1: The status word and the chip read as one pair

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* The row's story gives `GradingOwnershipChip` the row's status word and chip, each with its tone.

**Test data:**

| Submission | Story |
| --- | --- |
| Waiting on the collector | Waiting On You |
| Booked for a drop-off | Drop Off |
| With the shop | With Us |
| With the grader, the chip naming the grader | With The Grader |
| On its way back | On Their Way Back |
| Collected | Collected |

**Steps:**

1. Open Grading Submission / GradingOwnershipChip / the row's story at <grade10 ui workbench url>.
2. Inspect the two badges; each tone is its variant.

**Expected Results:**

* The status word and the chip render together as one pair, each in the tone it was given.

### shared-ui-grading-submission-US1-TC28-1: A closed submission shows the status word with no chip

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* The None story gives `GradingOwnershipChip` the status word Cancelled and no chip.

**Steps:**

1. Open Grading Submission / GradingOwnershipChip / None at <grade10 ui workbench url>.

**Expected Results:**

* Only the status word renders; no chip.

### shared-ui-grading-submission-US1-TC29-1: The record names the intake id and photograph pair

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Handed In story gives `GradingCardRecord` one card, Charizard, with an intake id and a front-and-back photograph pair.
* The Minimum Grade story gives `GradingCardRecord` the same card carrying a minimum grade.

**Steps:**

1. Open Grading Submission / GradingCardRecord / Handed In at <grade10 ui workbench url>.
2. Read Charizard's card.
3. Open the Minimum Grade story.
4. Read the card's set line.

**Expected Results:**

* Step 2: the card shows its intake id and both photographs.
* Step 2: no control that changes the card is drawn.
* Step 4: the minimum grade reads on the set line.

### shared-ui-grading-submission-US1-TC30-1: Every recorded outcome pairs its badge with its line

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The row's story gives `GradingCardRecord` one card in the row's outcome, with its badge words and its line and no tone.

**Test data:**

| Outcome | Story | Badge tone |
| --- | --- | --- |
| Listed | Listed | outline |
| Handed in | Handed In | outline |
| Refused at the counter | Refused At The Counter | error |
| Withdrawn | Withdrawn | default |
| Graded | Graded | success |
| Moved up a level | Moved Up A Level | warning |
| Ungraded | Ungraded | error |
| Minimum grade not met | Minimum Grade Not Met | warning |
| Held by the grader | Held By The Grader | warning |
| Not returned | Not Returned | error |
| Damaged | Damaged | error |
| Collected | Collected | default |
| Vaulted | Vaulted | default |

**Steps:**

1. Open Grading Submission / GradingCardRecord / the row's story at <grade10 ui workbench url>.
2. Read the card's badge and the line beside it.
3. Inspect the badge; its tone is its variant.

**Expected Results:**

* The card renders the badge tone and the line the row's outcome carries.

### shared-ui-grading-submission-US1-TC31-1: A graded card names its grade and cert

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Graded story gives `GradingGradeCards` one card with a grade, the grader's label word and a cert.

**Steps:**

1. Open Grading Submission / GradingGradeCards / Graded at <grade10 ui workbench url>.
2. Read the card.

**Expected Results:**

* The card names the grade in the grader's words, the label word, the grader and the cert.

### shared-ui-grading-submission-US1-TC32-1: An ungraded card names the grader's code and note

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Ungraded story gives `GradingGradeCards` a graded card and one card, Umbreon holo, with no grade, an ungraded code and a note.

**Steps:**

1. Open Grading Submission / GradingGradeCards / Ungraded at <grade10 ui workbench url>.
2. Read Umbreon holo's card.

**Expected Results:**

* The card renders in the `error` tone.
* The card names the code and the note in place of a grade.
* Umbreon holo's card is drawn apart from the graded card.

### shared-ui-grading-submission-US1-TC33-1: A listed card shows no photograph pair before hand-in

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Listed story gives `GradingCardRecord` one card with no intake id and no photograph pair.

**Steps:**

1. Open Grading Submission / GradingCardRecord / Listed at <grade10 ui workbench url>.
2. Read the card.

**Expected Results:**

* No intake id and no photograph pair render.

### shared-ui-grading-submission-US1-TC34-1: The pickup card asks for an ID above the threshold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The Above The Threshold story gives `GradingPickupCard` a figure to settle and an identity line naming the collector.

**Steps:**

1. Open Grading Submission / GradingPickupCard / Above The Threshold at <grade10 ui workbench url>.
2. Read the card from top to bottom.

**Expected Results:**

* The card shows the code, the items, where and when, what is due as one figure, and asks for an ID matching the collector's name.

### shared-ui-grading-submission-US1-TC35-1: The pickup card asks for nothing below the threshold

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The Below The Threshold story gives `GradingPickupCard` no identity line.

**Steps:**

1. Open Grading Submission / GradingPickupCard / Below The Threshold at <grade10 ui workbench url>.
2. Read the card's bring row.

**Expected Results:**

* The card says nothing beyond the code is needed.

### shared-ui-grading-submission-US1-TC36-1: The pickup card names an ID for the named person

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The Someone Named story gives `GradingPickupCard` an identity line naming the person who was named, not the collector.

**Steps:**

1. Open Grading Submission / GradingPickupCard / Someone Named at <grade10 ui workbench url>.
2. Read the card's bring row.

**Expected Results:**

* The bring line names the ID as the named person's, not the collector's.

### shared-ui-grading-submission-US1-TC37-1: Naming a person is blocked until a name is entered

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The row's story gives `GradingNamedCollector` nobody named and an empty name field, in the row's state.

**Test data:**

| State | Story |
| --- | --- |
| Name empty | Name Empty |
| Pending | Saving |

**Steps:**

1. Open Grading Submission / GradingNamedCollector / the row's story at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click Save.

**Expected Results:**

* Save is disabled, and step 3 logs nothing.

### shared-ui-grading-submission-US1-TC38-1: Removing a named person clears the card back to nobody

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The Named story gives `GradingNamedCollector` one named person and the day they were named.

**Steps:**

1. Open Grading Submission / GradingNamedCollector / Named at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click Change.
4. Click Remove.

**Expected Results:**

* Step 2: the Named badge, the name and the day render.
* Step 3: `onChange` logs once.
* Step 4: `onRemove` logs once.

### shared-ui-grading-submission-US1-TC39-1: The money block lists its lines in the fixed order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Due story gives `GradingMoneyBlock` a fee line, a moved-up line and a due line.

**Test data:**

| Line | Label | Amount |
| --- | --- | --- |
| cover | Cover | 12000 HKD minor units |
| paid | Paid | 100000 HKD minor units |
| storage | Storage | 3000 HKD minor units |

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Due at <grade10 ui workbench url>.
2. In the Controls panel, add each **Test data** line to `lines`, in the fee line's shape.
3. Read the lines top to bottom.

**Expected Results:**

* The settle lead reads above the lines.
* The lines render in the fixed order: fee as n × fee = total, cover, paid, moved up, storage, due.
* The due line renders in the `warning` tone.

### shared-ui-grading-submission-US1-TC40-1: No lead line shows when nothing is due

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Settled story gives `GradingMoneyBlock` no settle lead and no due line.

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Settled at <grade10 ui workbench url>.
2. Read the block from its title down.

**Expected Results:**

* The waived line and the settled line with its till reference show.
* No settle lead renders above the lines.

### shared-ui-grading-submission-US1-TC41-1: The storage line reads the fee per card per month

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Storage story gives `GradingMoneyBlock` a storage line naming the fee per card and the day it accrues from.

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Storage at <grade10 ui workbench url>.
2. Read the storage line.

**Expected Results:**

* The storage line names the fee per card, per month, and that it is accruing.

### shared-ui-grading-submission-US1-TC42-1: The ladder shows three dated rungs, none reached

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* The None Reached story gives `GradingUncollectedLadder` the reminder, storage and notice rungs, each dated, none passed.

**Steps:**

1. Open Grading Submission / GradingUncollectedLadder / None Reached at <grade10 ui workbench url>.
2. Read each rung.

**Expected Results:**

* The reminder, storage and notice rungs each render with their day.
* The ready day and the count of cards held read as given.
* None is marked passed.

### shared-ui-grading-submission-US1-TC43-1: A passed rung is marked once its day is reached

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* The row's story gives `GradingUncollectedLadder` the row's rungs as reached.

**Test data:**

| Reached | Story | Passed | Not passed |
| --- | --- | --- | --- |
| The first reminder | Reminded | The first reminder | The rungs after it, storage and the notice among them |
| The reminders and storage | Storage | Both reminders and storage | The notice |

**Steps:**

1. Open Grading Submission / GradingUncollectedLadder / the row's story at <grade10 ui workbench url>.
2. Read each rung.

**Expected Results:**

* The rungs the row names as passed are marked passed; the rungs it names as not passed are not.

### shared-ui-grading-submission-US1-TC44-1: The notice rung names the posting date and its window

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* The Notice story gives `GradingUncollectedLadder` a notice rung carrying a posting day and the 30 days it gives.

**Steps:**

1. Open Grading Submission / GradingUncollectedLadder / Notice at <grade10 ui workbench url>.
2. Read the notice rung.

**Expected Results:**

* The notice rung names the posting date and the 30 days.

### shared-ui-grading-submission-US1-TC45-1: A withdrawn, paid out or vaulted card is not counted held

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* The Cards Excluded story gives `GradingUncollectedLadder` a count of cards held that leaves out a card withdrawn, paid out or vaulted.

**Steps:**

1. Open Grading Submission / GradingUncollectedLadder / Cards Excluded at <grade10 ui workbench url>.
2. Read the cards-held line.

**Expected Results:**

* The cards held reads the count given, of the cards still held; the excluded card is not among them.

### shared-ui-grading-submission-US1-TC46-1: Every rendered word comes from the copy prop

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Pre-conditions:**

* The Traditional Chinese story gives `GradingReview` a `copy` naming a distinct label for each of its static words.

**Test data:**

| Field | Value |
| --- | --- |
| Book button label | 預約交卡 |
| Consent statement | 我同意卡牌的領回方式。 |

**Steps:**

1. Open Grading Submission / GradingReview / Traditional Chinese at <grade10 ui workbench url>.
2. Read every static label the block renders.

**Expected Results:**

* Every label matches the text `copy` supplies; no hardcoded string appears instead.

### shared-ui-grading-submission-US1-TC47-1: No block fetches, mutates, routes or reads app state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Pre-conditions:**

* Every block's source under the store's `packages/ui/src/blocks/grading-submission/` is open.

**Steps:**

1. Search each block's source for a fetch call, a router import, a store import or a browser-storage call.

**Expected Results:**

* No block imports a router or an app store, or calls fetch, a mutation, or browser storage.

### shared-ui-grading-submission-US1-TC48-1: An amount renders in its minor units and ISO code

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Pre-conditions:**

* The Estimate story gives `GradingMoneyBlock` a fee line whose amount is minor units with an ISO 4217 code, in the `en` locale.

**Test data:**

| Amount | Currency | Locale | Reads as |
| --- | --- | --- | --- |
| 100000 minor units | HKD | `en` | HK$1,000 (100000 ÷ 100, in `en`) |
| 100000 minor units | JPY | `en` | ¥100,000 (JPY carries no minor digit) |
| 100000 minor units | HKD | `zh-Hant` | HK$1,000 (100000 ÷ 100, in `zh-Hant`) |

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Estimate at <grade10 ui workbench url>.
2. In the Controls panel, set the fee line's amount and currency and the block's `locale` to the row's.
3. Read the fee line's amount.

**Expected Results:**

* The amount reads as the row's reading of it, in the row's currency.
* No other amount shows than the ones the block was given.

### shared-ui-grading-submission-US1-TC49-1: A day renders in the locale and zone supplied

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Blocked:** The spec's author - SC-56 speaks of an instant's time of day in the zone given, and no grading block renders a time; only days are rendered, so the case reads a day until the scenario or a block settles which.

**Pre-conditions:**

* The None Reached story gives `GradingUncollectedLadder` a storage rung with a day, the `en` locale and the zone `Asia/Hong_Kong`.

**Steps:**

1. Open Grading Submission / GradingUncollectedLadder / None Reached at <grade10 ui workbench url>.
2. Read the storage rung's day.

**Expected Results:**

* The day reads in the locale and the zone the story supplies, not the browser's own.

### shared-ui-grading-submission-US1-TC50-1: Every design-record state has its own story

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Content through props

**Pre-conditions:**

* The change's `ui-design.md` is open at its `@grade10/ui` blocks and their state tables.
* <grade10 ui workbench url> is open at Grading Submission.

**Steps:**

1. For each state the design record names for a grading block, find the story under that block that draws it.
2. Open that story.

**Expected Results:**

* Every state names a story, and the story renders the state from props alone, with no application behind it.

### shared-ui-grading-submission-US1-TC51-1: Every level closed sends the collector to the counter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Every Level Closed story gives `GradingLevelPicker` every level closed, and the counter line.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Every Level Closed at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click each closed level.

**Expected Results:**

* Step 1: the counter line renders as it was given.
* Step 3: no estimate renders, and nothing logs under `onSelectLevel`.

### shared-ui-grading-submission-US1-TC52-1: The upcharge notice reads on the picker

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Upcharge Notice story gives `GradingLevelPicker` the consumer's upcharge notice.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Upcharge Notice at <grade10 ui workbench url>.
2. Read the notice under the levels.

**Expected Results:**

* The notice reads that a card moved up a level is charged the difference before collection.

### shared-ui-grading-submission-US1-TC53-1: A grader priced with example figures still lists its levels

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Grader With Example Figures story gives `GradingLevelPicker` a grader, CGC, whose levels hold example figures, with the line saying so.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Grader With Example Figures at <grade10 ui workbench url>.
2. Read the levels and the line above them.

**Expected Results:**

* Every level of that grader is listed.
* The line about the figures renders.

### shared-ui-grading-submission-US1-TC54-1: The picker names the graders and the highest declared value

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Grader story gives `GradingLevelPicker` three graders, PSA, CGC and BGS, with the second, CGC, selected, and the highest declared value of the list.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Grader at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click BGS, the third grader.

**Expected Results:**

* Step 2: all three graders render, CGC marked, and its levels below.
* Step 2: the highest declared value renders as it was given.
* Step 3: `onSelectGrader` logs `bgs`.

### shared-ui-grading-submission-US1-TC55-1: The cap refuses the card past it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Over The Cap story gives `GradingCardList` a list at <cap>, with a name typed in the search.

**Test data:**

| Field | Value |
| --- | --- |
| <cap> | 2 cards, the story's; it stands for the cap the list is given |

**Steps:**

1. Open Grading Submission / GradingCardList / Over The Cap at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click Add as typed.

**Expected Results:**

* The line naming a second submission on another day shows.
* Step 3: `onAdd` logs nothing.

### shared-ui-grading-submission-US1-TC56-1: The reference out of reach keeps the list working

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Reference Unavailable story gives `GradingCardList` two cards with no declared value, its matches reading as an error, and the catalogue-unavailable line.

**Steps:**

1. Open Grading Submission / GradingCardList / Reference Unavailable at <grade10 ui workbench url>.
2. Read each card.

**Expected Results:**

* Every card carries the catalogue-unavailable line, not the kept-as-typed one.
* The declared value is still asked for on each card.

### shared-ui-grading-submission-US1-TC57-1: A pasted line above the ceiling names the card and its value

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Above The Ceiling story gives `GradingPasteSheet` a result with one line above the level's ceiling, and the second-submission line.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Above The Ceiling at <grade10 ui workbench url>.
2. Read the above-the-ceiling row and the sheet under it.

**Expected Results:**

* The above-the-ceiling row names the card and its declared value.
* The second-submission line renders.

### shared-ui-grading-submission-US1-TC58-1: The paste reports its cards through onApply

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Matched story gives `GradingPasteSheet` a result of matched, kept-as-typed and valueless cards.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Matched at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click Add these cards to the list, at the foot of the sheet.

**Expected Results:**

* `onApply` logs every card the paste made, in the outcomes it made them.
* The sheet writes to no list of its own: its result rows read as before.

### shared-ui-grading-submission-US1-TC59-1: A paste error reads as an error, not an empty list

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Pre-conditions:**

* The Reference Unavailable story gives `GradingPasteSheet` a result reading as an error, with the consumer's message.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Reference Unavailable at <grade10 ui workbench url>.
2. Read the sheet under the pasted text.

**Expected Results:**

* The consumer's message renders in the error tone.
* Nothing reads as a list that matched nothing.

### shared-ui-grading-submission-US1-TC60-1: A running-late chip reads the words and the tone it was given

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* The Running Late story gives `GradingOwnershipChip` a chip carrying the running-late words and their tone, and the status word.

**Steps:**

1. Open Grading Submission / GradingOwnershipChip / Running Late at <grade10 ui workbench url>.
2. Inspect the chip; its tone is its variant.

**Expected Results:**

* The chip reads those words in that tone.
* The block reads no date and derives no lateness of its own.

### shared-ui-grading-submission-US1-TC61-1: A certificate reads against the lookup address it was given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Graded story gives `GradingCardRecord` one graded card with a certificate and the grader's lookup address.

**Steps:**

1. Open Grading Submission / GradingCardRecord / Graded at <grade10 ui workbench url>.
2. Hover the certificate's lookup link and read the address it points at.

**Expected Results:**

* The certificate renders against the address supplied.
* No address is built inside the block.

### shared-ui-grading-submission-US1-TC62-1: A card with no grade shows its badge and no grade

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The row's story gives `GradingGradeCards` one card for the row's outcome, with its badge.

**Test data:**

| Outcome | Story |
| --- | --- |
| Moved up a level | Moved Up |
| Held by the grader | Held |
| Minimum grade not met | Minimum Not Met |
| Not returned | Not Returned |
| Damaged | Damaged |

**Steps:**

1. Open Grading Submission / GradingGradeCards / the row's story at <grade10 ui workbench url>.
2. Where the story's card carries a grade, remove `grade` and `gradeLabel` from it in the Controls panel.
3. Read the card.

**Expected Results:**

* The card renders the badge it was given.
* No grade renders on a card the grader issued none for.

### shared-ui-grading-submission-US1-TC63-1: The pickup card says nothing is due

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The Nothing Due story gives `GradingPickupCard` nothing to settle.

**Steps:**

1. Open Grading Submission / GradingPickupCard / Nothing Due at <grade10 ui workbench url>.
2. Read the card's settle row.

**Expected Results:**

* The card says nothing is due.
* No figure to settle renders.

### shared-ui-grading-submission-US1-TC64-1: A refused naming reads the refusal under the field

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Blocked:** Engineering - a product defect: Save stays enabled beside a refusal with a name typed, and a click reports a save; the case is walked again once the block reports nothing under a refusal.

**Pre-conditions:**

* The Refused story gives `GradingNamedCollector` a name typed and the refusal that the cards were already collected.

**Steps:**

1. Open Grading Submission / GradingNamedCollector / Refused at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click Save.

**Expected Results:**

* Step 1: the refusal renders under the name field.
* Step 3: `onSave` logs nothing.

### shared-ui-grading-submission-US1-TC65-1: The money block reads an estimate as unpaid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Estimate With Cover story gives `GradingMoneyBlock` the fee line, the cover line and the paid-at-the-counter line, with no paid line.

**Test data:**

| Field | Value |
| --- | --- |
| Fee line | 4 cards × 25000 HKD minor units, total 100000 |
| Cover line | 12000 HKD minor units |

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Estimate With Cover at <grade10 ui workbench url>.
2. Read the lines top to bottom.

**Expected Results:**

* The fee line and the paid-at-the-counter line render.
* The cover line renders under the fee.
* No paid line renders.

### shared-ui-grading-submission-US1-TC66-1: A payout names its route beside the refunded fee

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Paid Out story gives `GradingMoneyBlock` the payout line with its route and the refunded fee line.

**Test data:**

| Field | Value |
| --- | --- |
| Payout | 600000 HKD minor units, by bank transfer |
| Refunded fee | 25000 HKD minor units |

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Paid Out at <grade10 ui workbench url>.
2. Read the refunded and paid-out lines.

**Expected Results:**

* Both lines render, the payout naming its route.

### shared-ui-grading-submission-US1-TC67-1: The paid line names its method, instant and till reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* The Paid story gives `GradingMoneyBlock` a paid line with its amount, method, instant and till reference.

**Test data:**

| Field | Value |
| --- | --- |
| Paid | 100000 HKD minor units |
| Method | card |
| Instant | 15 Jun 2026, 17:00 |
| Till reference | POS 4471-0098 |

**Steps:**

1. Open Grading Submission / GradingMoneyBlock / Paid at <grade10 ui workbench url>.
2. Read the paid line.

**Expected Results:**

* The amount, the method, the instant and the till reference all read as they were given.

### shared-ui-grading-submission-US1-TC68-1: A matched card with no set or number reads from its name alone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Matched No Detail story gives `GradingCardList` one card, Mewtwo, matched in the reference, carrying no set and no number.

**Steps:**

1. Open Grading Submission / GradingCardList / Matched No Detail at <grade10 ui workbench url>.
2. Read Mewtwo's card.

**Expected Results:**

* The card reads as matched, from its name alone.
* Rendering the card raises no error: the story draws, and the Interactions panel shows no failure.

### shared-ui-grading-submission-US1-TC69-1: A collected slab carries its hand-back photograph

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Collected story gives `GradingGradeCards` one graded card given the photograph taken at hand-back.
* The Graded story gives `GradingGradeCards` one graded card given none.

**Steps:**

1. Open Grading Submission / GradingGradeCards / Collected at <grade10 ui workbench url>.
2. Read the card.
3. Open the Graded story.
4. Read the card.

**Expected Results:**

* Step 2: the card given a photograph shows it beside its grade, grader and
  certificate.
* Step 4: the card given none shows none.

### shared-ui-grading-submission-US1-TC71-1: A shop naming no hours shows no Open row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* The No Opening Hours story gives `GradingPickupCard` no `open`.

**Steps:**

1. Open Grading Submission / GradingPickupCard / No Opening Hours at <grade10 ui workbench url>.
2. Read the card's where-and-when rows.

**Expected Results:**

* The shop and its address are shown.
* No Open row renders.

### shared-ui-grading-submission-US1-TC72-1: A card's payout line shows once made, and its reversal once reversed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* The Not Returned story gives `GradingGradeCards` one card given a payout line.
* The Payout Reversed story gives `GradingGradeCards` one card given a reversal line.
* The Graded story gives `GradingGradeCards` one card given neither.

**Steps:**

1. Open Grading Submission / GradingGradeCards / Not Returned at <grade10 ui workbench url>.
2. Read the card.
3. Open the Payout Reversed story and read the card.
4. Open the Graded story and read the card.

**Expected Results:**

* Step 2: the card given a payout line shows it.
* Step 3: the card given a reversal line shows it in place of a payout line.
* Step 4: the card given neither shows no such line.

### shared-ui-grading-submission-US1-TC73-1: A review given no booking offers neither the booking nor the statement

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Reviewing before booking

**Decided by:** `packages/ui/src/blocks/grading-submission/grading-review.stories.tsx`

**Pre-conditions:**

* `GradingReview` carries two cards, one of them with an upcharge warning, no `onBook`, no `onConsent` and no `consented`, and a save act whose words read Save changes.

**Steps:**

1. Open the `GradingReview` story with that review.
2. Activate the save act.

**Expected Results:**

* Step 1: no booking and no collection statement shows; the schedule, the totals and the warning read as given.
* Step 1: the save act reads Save changes.
* Step 2: the save reports through its own callback.

### shared-ui-grading-submission-US1-TC74-1: An open level carrying cover is picked by id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Level Open Cover story gives `GradingLevelPicker` an open level, Express, carrying a cover line, with no level picked and no estimate.

**Steps:**

1. Open Grading Submission / GradingLevelPicker / Level Open Cover at <grade10 ui workbench url>.
2. Read Express's level card and the space under the levels.
3. Clear the Actions panel.
4. Click Express.
5. In the Controls panel, set `selectedLevelId` to `express`, as the consumer does on the pick.

**Expected Results:**

* Step 2: Express shows its cover line, and no estimate shows.
* Step 4: `onSelectLevel` logs `express`.
* Step 5: Express reads as selected.

### shared-ui-grading-submission-US1-TC75-1: The fee sheet and the picker each draw the one record they are given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The One Record Two Drawings story gives `GradingFeeSheet` and `GradingLevelPicker` one fee sheet record, PSA's four levels.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / One Record Two Drawings at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Read each level's fee in the fee sheet.
4. Read each level's fee in the level picker below it.

**Expected Results:**

* Step 3 and step 4 read the same four fees, the record's, and no other figure.
* Nothing logs in the Actions panel: neither block reports on the other.

### shared-ui-grading-submission-US1-TC76-1: A level with no figures reads the no-figure word, not nought

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Unpriced Grader story gives `GradingFeeSheet` a grader, BGS, whose levels carry no ceiling and no fee, and the no-figure word.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / Unpriced Grader at <grade10 ui workbench url>.
2. Read each level row's ceiling and fee columns.

**Expected Results:**

* Each level's ceiling and fee columns read the no-figure word the story gives.
* No column reads as HK$0.

### shared-ui-grading-submission-US1-TC77-1: The fee sheet's title takes the heading rung it is given

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* The Title Under A Section story gives `GradingFeeSheet` a third-rung heading.
* The One Grader story gives `GradingFeeSheet` no heading rung.

**Steps:**

1. Open Grading Submission / GradingFeeSheet / Title Under A Section at <grade10 ui workbench url>.
2. Inspect the sheet's title in the browser's inspector.
3. Open the One Grader story.
4. Inspect the sheet's title.

**Expected Results:**

* Step 2: the title is a third-rung heading.
* Step 4: the title is a second-rung heading.

### shared-ui-grading-submission-US1-TC78-1: A list given no cap refuses no add

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The No Cap story gives `GradingCardList` two cards, no cap, and a name typed in the search that matched nothing.

**Steps:**

1. Open Grading Submission / GradingCardList / No Cap at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click Add as typed.

**Expected Results:**

* Step 3: `onAdd` logs the typed name.
* No line saying the submission is full renders.

### shared-ui-grading-submission-US1-TC79-1: A paste sheet with nothing read adds nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Nothing Read story gives `GradingPasteSheet` an empty text and no result.

**Steps:**

1. Open Grading Submission / GradingPasteSheet / Nothing Read at <grade10 ui workbench url>.
2. Read the line counter.
3. Clear the Actions panel.
4. Click Add these cards to the list, at the foot of the sheet.

**Expected Results:**

* Step 2: the lines-read count reads none.
* Step 4: the add button is disabled, and nothing logs under `onApply`.

### shared-ui-grading-submission-US1-TC80-1: Adding a card from the search reports the match

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Card Search story gives `GradingCardList` a search for `Blast` whose matches read as ready.

**Steps:**

1. Open Grading Submission / GradingCardList / Card Search at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Click the Add a card search field.
4. Click the Blastoise match.

**Expected Results:**

* Step 4: `onAdd` logs the Blastoise match.

### shared-ui-grading-submission-US1-TC81-1: The value field reports once, on leaving it or Enter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The No Value story gives `GradingCardList` a card, Pikachu Illustrator, with an empty value field.
* The Editing Value story gives `GradingCardList` a card, Charizard, reopened for editing.

**Test data:**

| Field | Value |
| --- | --- |
| <declared value typed> | 8500 |
| <reopened value typed> | 4200 |

**Steps:**

1. Open Grading Submission / GradingCardList / No Value at <grade10 ui workbench url>.
2. Return the story to its start and clear the Actions panel.
3. Type <declared value typed> in Pikachu Illustrator's value field.
4. Press Tab to leave the field.
5. Open the Editing Value story, return it to its start and clear the Actions panel.
6. Click Charizard's value field.
7. Press Tab to leave it untouched.
8. Click Charizard's value field again.
9. Type <reopened value typed>.
10. Press Enter.

**Expected Results:**

* Step 3: the field holds <declared value typed>, and nothing logs.
* Step 4: `onDeclare` logs once, with Pikachu Illustrator's id and <declared value typed>.
* Step 7: nothing logs.
* Step 10: `onDeclare` logs once, with Charizard's id and <reopened value typed>.

### shared-ui-grading-submission-US1-TC82-1: The cap reads with the level the count closes

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* The Cap Notice story gives `GradingCardList` a cap and the level the count closes.

**Steps:**

1. Open Grading Submission / GradingCardList / Cap Notice at <grade10 ui workbench url>.
2. Read the cap line above the cards.

**Expected Results:**

* The cap and the level the count closes read as they were given.

## Reconciliation

**Run:** the blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, the PRD pages the proposal links, and this file for id continuity with `## Reconciliation` stripped. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. The suite's ids were written short and were renamed to the capability's full prefix before the join; none had been issued anywhere else.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-grading-submission-US1-TC30-1` — a badge tone per outcome | Raised, settled | The block reads the tone from the outcome through one map of its own and takes none from the consumer. Decisions `Q69`; folded as `shared-ui-grading-submission-SC-64`, and the record requirement's outcome rule rewritten to say so |
| `shared-ui-grading-submission-US1-TC30-1` — the outcome set | Raised, settled | "Minimum grade not met" is the thirteenth outcome of the record's table, which already carries it. Decisions `Q70`; the word added to the `GradingCardRecord` bullet on `docs/prds/products/shared/ui/grading-submission.md`, and the row added to the case's test data, dressed as Ungraded is — the card comes back raw and the fee stands. Reached by `shared-ui-grading-submission-SC-35` |
| `shared-ui-grading-submission-US1-TC8-1` — the estimate matching the fee sheet | Raised, settled | Neither block checks the other: each renders the `feeSheet` it is given. Decisions `Q71`; folded as `shared-ui-grading-submission-SC-59`, and the case's cross-sheet clause dropped from its pre-condition and its expected result |
| The two blocks agreeing on one record | **Out of suite:** the page's colocated test in `packages/grading/frontend` | Passing one record to both is the composing page's, so no block-level case can reach it |
| `shared-ui-grading-submission-US1-TC58-1` — the paste result reaching the list | Raised, settled | `onApply(cards)` carries the cards the paste made, and the page feeds them to `GradingCardList`'s `cards`. Decisions `Q72`; the paste sheet's `Acts` rule names the callback, folded as `shared-ui-grading-submission-SC-63`, and the case added |
| `shared-ui-grading-submission-US1-TC15-1` | Folded | Editing, removing, declaring a value and setting a minimum grade each report through a callback of their own, which no scenario stated: `shared-ui-grading-submission-SC-61` |
| `shared-ui-grading-submission-US1-TC55-1` — the cap notice | Folded | The cap and the level the count closes read on the list, which no scenario stated: `shared-ui-grading-submission-SC-62`. The case covers it with `shared-ui-grading-submission-SC-16` |
| `shared-ui-grading-submission-US1-TC54-1` — the picker's graders | Folded | The picker renders the graders, reports a pick and shows the highest declared value, which no scenario stated: `shared-ui-grading-submission-SC-60` |
| `shared-ui-grading-submission-SC-09` | Case added | `shared-ui-grading-submission-US1-TC51-1` — every level closed shows the counter line |
| `shared-ui-grading-submission-SC-11` | Case added | `shared-ui-grading-submission-US1-TC52-1` — the upcharge notice on the picker |
| `shared-ui-grading-submission-SC-12` | Case added | `shared-ui-grading-submission-US1-TC53-1` — a grader priced with example figures |
| `shared-ui-grading-submission-SC-16` | Case added | `shared-ui-grading-submission-US1-TC55-1` — the card past the cap refused |
| `shared-ui-grading-submission-SC-17` | Case added | `shared-ui-grading-submission-US1-TC56-1` — the reference out of reach |
| `shared-ui-grading-submission-SC-23` | Case added | `shared-ui-grading-submission-US1-TC57-1` — a pasted line above the ceiling |
| `shared-ui-grading-submission-SC-31` | Case added | `shared-ui-grading-submission-US1-TC60-1` — the running-late chip |
| `shared-ui-grading-submission-SC-36` | Case added | `shared-ui-grading-submission-US1-TC61-1` — the certificate against its lookup address |
| `shared-ui-grading-submission-SC-39` | Case added | `shared-ui-grading-submission-US1-TC62-1` — a card the grader issued no grade for, one run per outcome |
| `shared-ui-grading-submission-SC-42` | Case added | `shared-ui-grading-submission-US1-TC63-1` — nothing due on the pickup card; the figure itself stays on `shared-ui-grading-submission-US1-TC34-1` |
| `shared-ui-grading-submission-SC-45` | Case added | `shared-ui-grading-submission-US1-TC64-1` — a refused naming |
| `shared-ui-grading-submission-SC-46` | Case added | `shared-ui-grading-submission-US1-TC65-1` — the estimate reading as unpaid |
| `shared-ui-grading-submission-SC-48` | Case added | `shared-ui-grading-submission-US1-TC66-1` — the payout and the refunded fee |
| `shared-ui-grading-submission-SC-50` | Case added | `shared-ui-grading-submission-US1-TC67-1` — the paid line's method, instant and till reference |
| `shared-ui-grading-submission-SC-57` | Case added | `shared-ui-grading-submission-US1-TC59-1` — a paste error that is not an empty list |
| `shared-ui-grading-submission-SC-65` | Case added | `shared-ui-grading-submission-US1-TC68-1` — a matched card with no set or number |
| `shared-ui-grading-submission-SC-70` | Case added | `shared-ui-grading-submission-US1-TC69-1` — the hand-back photograph beside a collected slab |
| `shared-ui-grading-submission-SC-72` | Case added | `shared-ui-grading-submission-US1-TC71-1` — no Open row where the shop names no hours |
| `shared-ui-grading-submission-SC-73` | Case added | `shared-ui-grading-submission-US1-TC72-1` — a card's payout or reversal line on the collected page |
| `shared-ui-grading-submission-US1-TC15-1` — the edit step | Fixed | The case's step and expected result named `onEdit` for the value it now carries; the value field's blur-or-Enter commit and its own reopen-with-the-kept-figure rule (added by the block change that split editing from declaring) named no scenario. Folded as `shared-ui-grading-submission-SC-66`; the case's step, pre-condition and expected result rewritten to name `onEdit` and `onDeclare` separately |
| A cap given as none refuses no add | Folded | The block change's rule named no scenario; the `NoCap` story already proved it. Folded as `shared-ui-grading-submission-SC-67`; case added at review, `shared-ui-grading-submission-US1-TC78-1` |
| A level with no figures reads the no-figure word, not nought | Folded | Named no scenario; the `UnpricedGrader` story already proved it. Folded as `shared-ui-grading-submission-SC-68`; case added at review, `shared-ui-grading-submission-US1-TC76-1` |
| The title's rung | Folded | Named no scenario; the `TitleUnderASection` story already proved it. Folded as `shared-ui-grading-submission-SC-69`; case added at review, `shared-ui-grading-submission-US1-TC77-1` |
| `shared-ui-grading-submission-SC-06` | Case added at review | `shared-ui-grading-submission-US1-TC74-1` — an open level carrying cover, picked by id; no case had asserted the pick |
| `shared-ui-grading-submission-SC-20` | Case added at review | `shared-ui-grading-submission-US1-TC79-1` — nothing read, nothing added; `shared-ui-grading-submission-US1-TC18-1` holds only the loading clause |
| `shared-ui-grading-submission-SC-59` | Case added at review | `shared-ui-grading-submission-US1-TC75-1` — each block draws the one record it was given; the page passing one record to both stays out of suite, above |
| `shared-ui-grading-submission-US1-TC15-1` — one case over three stories | Split at review | Adding a card is `shared-ui-grading-submission-US1-TC80-1`; the value field, with its commit-once clauses, is `shared-ui-grading-submission-US1-TC81-1` |
| `shared-ui-grading-submission-US1-TC55-1` — two starting states | Split at review | The cap and the level the count closes are `shared-ui-grading-submission-US1-TC82-1`; the story's cap stands for the cap the list is given |
| The tone on `shared-ui-grading-submission-US1-TC32-1` and `-TC39-1` | Kept | A tone that dresses an outcome is the design record's and the suite's, not a requirement's; the scenarios state the substance the tone dresses |
| `shared-ui-grading-submission-SC-74` | Case added, added after the run | `shared-ui-grading-submission-US1-TC73-1`: decided outside the blind pass; the editor keeps the review for its totals and warning, so the booking and the tick are left out together and the save reads the consumer's words |
| The other 45 cases | Joined, unchanged | Each reaches a scenario that states it; no case was dropped, and nothing in the two readings stated opposite things |

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-grading-submission-US1-TC2-1` | A person reads the package's exports and judges whether any grading block duplicates a booking block's role; a name check alone would pass a redrawn slot picker under another name |
| `shared-ui-grading-submission-US1-TC3-1` | A person judges whether an export draws an operator's surface; no check reads a component's audience |
| `shared-ui-grading-submission-US1-TC50-1` | A person reads the design record's state tables against the stories; nothing joins a row of `ui-design.md` to a story id |
