# shared/ui/grading-submission Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## Background

* Every case opens the block under test from its own story in the design workbench, with no network, application state, routing or browser storage behind it.

## shared-ui-grading-submission-US1: The grading submission blocks

**Walked by:** nobody on their own - a component contract every collector-facing grading page composes; the journeys of `grade10-site/grading/submission-plan`, `grade10-site/grading/dropoff-booking` and `grade10-site/grading/submission-lifecycle` are what reach it.

**As a** consuming grading page,
**I want** the collector-facing blocks and every state through props alone,
**so that** every grading surface composes the same contract instead of redrawing it.

### shared-ui-grading-submission-US1-TC1-1: Every named grading block exports from the package entry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The package entry's `shared/ui/grading-submission` re-exports are read.

**Steps:**

1. List every export re-exported under the `shared/ui/grading-submission` comment.
2. Match the list against the thirteen named blocks the capability declares.

**Expected Results:**

* `GradingFeeSheet`, `GradingCardList`, `GradingCardRecord`, `GradingPasteSheet`, `GradingLevelPicker`, `GradingReview`, `GradingStatusRail`, `GradingOwnershipChip`, `GradingPickupCard`, `GradingNamedCollector`, `GradingGradeCards`, `GradingMoneyBlock` and `GradingUncollectedLadder` are all exported.
* Each export carries its own prop type and a `copy` type for its words.

### shared-ui-grading-submission-US1-TC2-1: The booking set is imported unchanged, not redrawn

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The package entry's `shared/ui/appointment-booking` exports — `BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`, `BookingConfirmation`, `BookingManageCard` — are read.

**Steps:**

1. Search `shared/ui/grading-submission`'s own exports for a component duplicating any booking export's name or role.

**Expected Results:**

* No grading export duplicates a booking block.

### shared-ui-grading-submission-US1-TC3-1: No console-shaped component ships from the package

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The `shared/ui/grading-submission` export list is read in full.

**Steps:**

1. Check each export for an operator-only surface: a queue, a runbook, a panel or a dialog naming an admin action.

**Expected Results:**

* No export renders a console view; every export is collector-facing.

### shared-ui-grading-submission-US1-TC70-1: A template missing a value refuses by name, never a literal placeholder

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* `fillGradingCopy` and `GradingLocaleProps` are read from the package's public entry.

**Steps:**

1. Call `fillGradingCopy` with a template naming `{shop}` and a `values` record with no `shop` key.
2. Call `fillGradingCopy` again with a template naming only placeholders `values` answers.

**Expected Results:**

* The first call throws an error naming `{shop}` and returns no text.
* The second call returns the template with every placeholder replaced.

### shared-ui-grading-submission-US1-TC4-1: The fee sheet lists one grader's levels and figures

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
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingFeeSheet` carries one grader with its levels, each naming a ceiling, the cards a submission, a fee and the weeks back.

**Steps:**

1. Open the `GradingFeeSheet` story with that grader.
2. Read the level rows.

**Expected Results:**

* Every level row names its ceiling, cards a submission, fee and weeks back.
* No `SegmentedControl` renders, since there is one grader.

### shared-ui-grading-submission-US1-TC5-1: Cover rate shows only on the levels that carry one

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
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingFeeSheet` carries a grader whose Express and Super Express levels each carry a cover rate, and whose other levels carry none.

**Steps:**

1. Open the `GradingFeeSheet` story with that grader.
2. Read every level row's cover column.

**Expected Results:**

* Express and Super Express name their cover rate.
* Every other level's cover column is empty.

### shared-ui-grading-submission-US1-TC6-1: A grader per tab keeps three fee sheets apart

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingFeeSheet` carries three graders, `selectedGraderId` naming the first.

**Steps:**

1. Open the `GradingFeeSheet` story with the three graders.
2. Select the second grader's tab.

**Expected Results:**

* A `SegmentedControl` lists all three graders.
* `onSelectGrader` fires with the second grader's id, and its own table replaces the first's.

### shared-ui-grading-submission-US1-TC7-1: A closed level names what closes it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker`'s `levels` carries one level closed with a card reason and one level, Bulk, closed with a count reason.

**Steps:**

1. Open the `GradingLevelPicker` story with those two closed levels.
2. Read each closed `RadioCard`.

**Expected Results:**

* Each closed level renders the reason its `levels` entry carries.
* Neither closed level can be selected.

### shared-ui-grading-submission-US1-TC8-1: The estimate reads cards times fee plus the cover line

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
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker`'s `estimate` carries the cards, the fee, a cover line and the weeks for the picked level.

**Steps:**

1. Open the `GradingLevelPicker` story with `selectedLevelId` set and that `estimate`.
2. Read the estimate `Card`.

**Expected Results:**

* The estimate shows cards × fee, the cover line and the total, each as `estimate` supplies it.

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

* `GradingLevelPicker` carries no `selectedLevelId`, and `estimate` is none.

**Steps:**

1. Open the `GradingLevelPicker` story with neither set.

**Expected Results:**

* No estimate `Card` renders.

### shared-ui-grading-submission-US1-TC10-1: A matched card shows its reference sales

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

* `GradingCardList` carries one card matched in the reference, with a declared value and three reference sales.

**Steps:**

1. Open the `GradingCardList` story with that card.
2. Read the card's `Card`.

**Expected Results:**

* The card shows the set, number and matched line, the declared value and the three reference sales.

### shared-ui-grading-submission-US1-TC11-1: A card kept as typed shows no reference row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries one card with no reference match, kept as typed.

**Steps:**

1. Open the `GradingCardList` story with that card.

**Expected Results:**

* The card shows the name as typed.
* No reference sales row renders.

### shared-ui-grading-submission-US1-TC12-1: A card with no declared value is named on the list

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries one card whose declared value is none.

**Steps:**

1. Open the `GradingCardList` story with that card.

**Expected Results:**

* The list names the card with no value.

### shared-ui-grading-submission-US1-TC13-1: A card above a ceiling is named on the list

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries one card whose declared value sits above `cap`'s level ceiling.

**Steps:**

1. Open the `GradingCardList` story with that card and `cap`.

**Expected Results:**

* The list names the card above the ceiling.

### shared-ui-grading-submission-US1-TC14-1: An empty card list shows no card

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries no cards.

**Steps:**

1. Open the `GradingCardList` story with an empty `cards` array.

**Expected Results:**

* No card renders.
* Add a card and Paste a list remain available.

### shared-ui-grading-submission-US1-TC15-1: Adding, editing and removing a card fire their callbacks

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries one card and its `onAdd`, `onEdit`, `onDeclare` and `onRemove` callbacks.

**Steps:**

1. Open the `GradingCardList` story with that card.
2. Search and add a card, open the existing card for editing, type a declared value and leave the field, then remove the card.

**Expected Results:**

* `onAdd` fires with the searched card.
* `onEdit` fires with the card's id, opening it for editing.
* `onDeclare` fires once, when the field is left, with the card's id and the value typed.
* `onRemove` fires with the removed card's id.

### shared-ui-grading-submission-US1-TC16-1: The paste result names each outcome's count and line

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

* `GradingPasteSheet`'s `result` carries five counts from one pasted list: matched, kept as typed, without a value, above the ceiling, and a skipped count.

**Steps:**

1. Open the `GradingPasteSheet` story with that result.
2. Read the result `List`.

**Expected Results:**

* Each of the five outcomes shows its own count and line.

### shared-ui-grading-submission-US1-TC17-1: The Bulk notice renders once the pasted list carries it

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingPasteSheet`'s pasted list passes twenty lines, and `bulkNotice` carries the consumer-supplied notice.

**Steps:**

1. Open the `GradingPasteSheet` story with that list and `bulkNotice`.

**Expected Results:**

* The `bulkNotice` text renders in the sheet.

### shared-ui-grading-submission-US1-TC18-1: Add stays disabled while the paste is matching

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
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingPasteSheet`'s `result` is pending.

**Steps:**

1. Open the `GradingPasteSheet` story mid-match.

**Expected Results:**

* The line counter reads matching.
* Add is disabled.

### shared-ui-grading-submission-US1-TC19-1: The review schedule lists every card handed in

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
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `schedule` carries three cards, each with a name, set line, minimum grade, declared value and cover.

**Steps:**

1. Open the `GradingReview` story with that schedule.
2. Read the schedule table.

**Expected Results:**

* Every card's row names its declared value, fee and cover.

### shared-ui-grading-submission-US1-TC20-1: The upcharge warning names both prices per card

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
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `warnings` carries one card above its level's ceiling, with the level it moves to, the difference due and the higher level's fee now.

**Steps:**

1. Open the `GradingReview` story with that warning.
2. Read the warning block.

**Expected Results:**

* The warning names the card, the level it moves to, the difference due and the higher level's current fee.

### shared-ui-grading-submission-US1-TC21-1: No card above a ceiling shows no upcharge warning

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `warnings` is none.

**Steps:**

1. Open the `GradingReview` story with no warnings.

**Expected Results:**

* No upcharge warning block renders.

### shared-ui-grading-submission-US1-TC22-1: Book stays disabled until the consent tick is checked

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `consented` is false.

**Steps:**

1. Open the `GradingReview` story unconsented.
2. Tick the consent statement.

**Expected Results:**

* Book the drop-off is disabled before the tick.
* `onConsent` fires and Book becomes enabled once ticked.

### shared-ui-grading-submission-US1-TC23-1: Booking pending disables both action buttons

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `pending` is true.

**Steps:**

1. Open the `GradingReview` story while pending.

**Expected Results:**

* Book the drop-off and Save and book later are both disabled.

### shared-ui-grading-submission-US1-TC24-1: A booking error renders in the error tone

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
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview`'s `error` carries a booking failure message.

**Steps:**

1. Open the `GradingReview` story with that error.

**Expected Results:**

* The error message renders in the error tone.

### shared-ui-grading-submission-US1-TC25-1: The status rail marks the reached stage among seven

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
* **Trace:** Where the submission stands

**Pre-conditions:**

* `GradingStatusRail`'s `stage` is Sent, a middle stage of the seven.

**Steps:**

1. Open the `GradingStatusRail` story at Sent.
2. Read all seven `Step`s.

**Expected Results:**

* Planned through Handed in read `completed`.
* Sent reads `progress`.
* Graded through Home read `upcoming`.

### shared-ui-grading-submission-US1-TC26-1: An ended submission's rail stays at its ending stage

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* `GradingStatusRail`'s `stage` is Handed in, and `ended` names a cancellation.

**Steps:**

1. Open the `GradingStatusRail` story with `ended` set.

**Expected Results:**

* The rail stays at Handed in as `progress`.
* The word names the ending, not a later stage.

### shared-ui-grading-submission-US1-TC27-1: The status word and the chip read as one pair

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
* **Trace:** Where the submission stands

**Pre-conditions:**

* `GradingOwnershipChip`'s `status` names With the grader, and `chip` names the grader.

**Steps:**

1. Open the `GradingOwnershipChip` story with that pair.

**Expected Results:**

* The status word and the chip render together from the one pair, in the tones the status table names.

### shared-ui-grading-submission-US1-TC28-1: A closed submission shows the status word with no chip

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* `GradingOwnershipChip`'s `chip` is none.

**Steps:**

1. Open the `GradingOwnershipChip` story with `chip` none.

**Expected Results:**

* Only the status word renders; no chip.

### shared-ui-grading-submission-US1-TC29-1: The record names the intake id and photograph pair

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingCardRecord` carries one card with an intake id and a front-and-back photograph pair.

**Steps:**

1. Open the `GradingCardRecord` story with that card.

**Expected Results:**

* The card shows its intake id and both photographs.

### shared-ui-grading-submission-US1-TC30-1: Every recorded outcome pairs its badge with its line

Runs once per row of **Test data**.

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingCardRecord` carries one card whose outcome badge and line, for the row's outcome, are supplied through `cards`.

**Test data:**

| Outcome | Badge tone |
| --- | --- |
| Refused at the counter | error |
| Withdrawn | default |
| Graded | success |
| Moved up a level | warning |
| Ungraded | error |
| Minimum grade not met | error |
| Held by the grader | warning |
| Not returned | error |
| Damaged | error |
| Collected | default |
| Vaulted | default |

**Steps:**

1. Open the `GradingCardRecord` story with that card.
2. Read the card's badge and line.

**Expected Results:**

* The card renders the badge tone and the line the row's outcome carries.

### shared-ui-grading-submission-US1-TC31-1: A graded card names its grade and cert

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingGradeCards` carries one card with a grade, the grader's label word and a cert.

**Steps:**

1. Open the `GradingGradeCards` story with that card.

**Expected Results:**

* The card names the grade in the grader's words, the label word and the cert.

### shared-ui-grading-submission-US1-TC32-1: An ungraded card names the grader's code and note

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingGradeCards` carries one card with no grade, an ungraded code and a note.

**Steps:**

1. Open the `GradingGradeCards` story with that card.

**Expected Results:**

* The card renders in the `error` tone.
* The card names the code and the note in place of a grade.

### shared-ui-grading-submission-US1-TC33-1: A listed card shows no photograph pair before hand-in

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingCardRecord` carries one card with no intake id and no photograph pair.

**Steps:**

1. Open the `GradingCardRecord` story with that card.

**Expected Results:**

* No intake id and no photograph pair render.

### shared-ui-grading-submission-US1-TC34-1: The pickup card asks for an ID above the threshold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingPickupCard`'s `bring` names an ID matching the collector's name.

**Steps:**

1. Open the `GradingPickupCard` story with that `bring` value.

**Expected Results:**

* The card shows the code, the items, where and when, what is due as one figure, and asks for an ID matching the name.

### shared-ui-grading-submission-US1-TC35-1: The pickup card asks for nothing below the threshold

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingPickupCard`'s `bring` is none.

**Steps:**

1. Open the `GradingPickupCard` story with `bring` none.

**Expected Results:**

* No bring-an-ID line renders.

### shared-ui-grading-submission-US1-TC36-1: The pickup card names an ID for the named person

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingPickupCard`'s `bring` names the person who was named, not the collector.

**Steps:**

1. Open the `GradingPickupCard` story with that `bring` value.

**Expected Results:**

* The bring line names the ID as the named person's, not the collector's.

### shared-ui-grading-submission-US1-TC37-1: Naming a person is blocked until a name is entered

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
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingNamedCollector`'s `named` is none, and the name field is empty.

**Steps:**

1. Open the `GradingNamedCollector` story with `named` none and an empty field.

**Expected Results:**

* Save is disabled while the field is empty.

### shared-ui-grading-submission-US1-TC38-1: Removing a named person clears the card back to nobody

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingNamedCollector`'s `named` carries a name and the day they were named.

**Steps:**

1. Open the `GradingNamedCollector` story with that `named` value.
2. Click Remove.

**Expected Results:**

* The Named badge, the name and the day render before Remove.
* `onRemove` fires and the card returns to nobody named.

### shared-ui-grading-submission-US1-TC39-1: The money block lists its lines in the fixed order

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
* **Trace:** What is paid and due

**Pre-conditions:**

* `GradingMoneyBlock`'s `lines` carries a fee, a cover, a paid line, a moved-up line, a storage line and a due line, in that order.

**Steps:**

1. Open the `GradingMoneyBlock` story with those lines.
2. Read the lines top to bottom.

**Expected Results:**

* The lines render in the order given: fee as n × fee = total, cover, paid, moved up, storage, due.
* The due line renders in the `warning` tone.

### shared-ui-grading-submission-US1-TC40-1: No lead line shows when nothing is due

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* `GradingMoneyBlock`'s `lead` is none.

**Steps:**

1. Open the `GradingMoneyBlock` story with `lead` none.

**Expected Results:**

* No settle-lead line renders.

### shared-ui-grading-submission-US1-TC41-1: The storage line reads the fee per card per month

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What is paid and due

**Pre-conditions:**

* `GradingMoneyBlock`'s `lines` carries a storage line naming the fee per card and the accruing months.

**Steps:**

1. Open the `GradingMoneyBlock` story with that storage line.

**Expected Results:**

* The storage line names the fee per card, per month, and that it is accruing.

### shared-ui-grading-submission-US1-TC42-1: The ladder shows three dated rungs, none reached

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* `GradingUncollectedLadder`'s `rungs` carries the reminder, storage and notice rungs, each dated, none passed.

**Steps:**

1. Open the `GradingUncollectedLadder` story with those rungs.

**Expected Results:**

* All three rungs render with their dates.
* None is marked passed.

### shared-ui-grading-submission-US1-TC43-1: A passed rung is marked once its day is reached

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* `GradingUncollectedLadder`'s reminder rung's day has passed.

**Steps:**

1. Open the `GradingUncollectedLadder` story with the reminder rung passed.

**Expected Results:**

* The reminder rung is marked passed; the storage and notice rungs are not.

### shared-ui-grading-submission-US1-TC44-1: The notice rung names the posting date and its window

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* `GradingUncollectedLadder`'s notice rung carries a posting date and the 30 days it gives.

**Steps:**

1. Open the `GradingUncollectedLadder` story with that notice rung.

**Expected Results:**

* The notice rung names the posting date and the 30 days.

### shared-ui-grading-submission-US1-TC45-1: A withdrawn, paid out or vaulted card is not counted held

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** If nobody collects

**Pre-conditions:**

* `GradingUncollectedLadder`'s `cardsHeld` excludes a card that was withdrawn, paid out or vaulted.

**Steps:**

1. Open the `GradingUncollectedLadder` story with `cardsHeld` excluding that card.

**Expected Results:**

* `cardsHeld` counts only the cards still held; the excluded card is not among them.

### shared-ui-grading-submission-US1-TC46-1: Every rendered word comes from the copy prop

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
* **Trace:** Content through props

**Pre-conditions:**

* `GradingReview` is rendered with a `copy` prop naming a distinct label for its static words.

**Test data:**

| Field | Value |
| --- | --- |
| Book button label | "Book the drop-off" |
| Consent statement | "I agree to the grading terms" |

**Steps:**

1. Open the `GradingReview` story with that `copy` prop.
2. Read every static label the block renders.

**Expected Results:**

* Every label matches the text `copy` supplies; no hardcoded string appears instead.

### shared-ui-grading-submission-US1-TC47-1: No block fetches, mutates, routes or reads app state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Content through props

**Pre-conditions:**

* Every block's source under `packages/ui/src/blocks/grading-submission/` is read.

**Steps:**

1. Search each block's source for a fetch call, a router import, a store import or a browser-storage call.

**Expected Results:**

* No block imports a router or an app store, or calls fetch, a mutation, or browser storage.

### shared-ui-grading-submission-US1-TC48-1: An amount renders in its minor units and ISO code

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
* **Trace:** Content through props

**Pre-conditions:**

* `GradingMoneyBlock`'s fee line carries an amount in minor units with an ISO 4217 code.

**Test data:**

| Field | Value |
| --- | --- |
| Amount | 150000 minor units, HKD |

**Steps:**

1. Open the `GradingMoneyBlock` story with that amount.

**Expected Results:**

* The amount renders formatted by `formatMoney`, in HKD.

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

**Pre-conditions:**

* `GradingUncollectedLadder`'s storage rung carries a day, with `locale` and the brand's zone supplied through props.

**Steps:**

1. Open the `GradingUncollectedLadder` story with that day, locale and zone.

**Expected Results:**

* The day renders formatted by `formatLocalTime`, in the zone supplied, not the browser's own.

### shared-ui-grading-submission-US1-TC50-1: Every design-record state has its own story

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Content through props

**Pre-conditions:**

* The design record's state tables for `shared/ui/grading-submission` are read against the package's stories.

**Steps:**

1. Match every state the design record names to a story under the block's own file.

**Expected Results:**

* Every state names a story, and the story renders the state from props alone, with no application behind it.

### shared-ui-grading-submission-US1-TC51-1: Every level closed sends the collector to the counter

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
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker`'s `levels` are every one closed, and the counter line is supplied.

**Steps:**

1. Open the `GradingLevelPicker` story with every level closed.

**Expected Results:**

* The counter line renders as it was given.
* No estimate renders, and no level reports a pick.

### shared-ui-grading-submission-US1-TC52-1: The upcharge notice reads on the picker

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker`'s upcharge notice carries the consumer's words.

**Steps:**

1. Open the `GradingLevelPicker` story with that notice.

**Expected Results:**

* The notice reads that a card moved up a level is charged the difference before collection.

### shared-ui-grading-submission-US1-TC53-1: A grader priced with example figures still lists its levels

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker` carries a grader whose levels hold example figures, with the line saying so.

**Steps:**

1. Open the `GradingLevelPicker` story with that grader selected.

**Expected Results:**

* Every level of that grader is listed.
* The line about the figures renders.

### shared-ui-grading-submission-US1-TC54-1: The picker names the graders and the highest declared value

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading what it costs

**Pre-conditions:**

* `GradingLevelPicker` carries three graders with the second selected, and the highest declared value of the list.

**Steps:**

1. Open the `GradingLevelPicker` story with those three graders.
2. Select the third grader.

**Expected Results:**

* All three graders render, the second marked, and its levels below.
* The highest declared value renders as it was given.
* `onSelectGrader` fires with the third grader's id.

### shared-ui-grading-submission-US1-TC55-1: The cap refuses the card past it and names the level the count closes

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList` carries 100 cards, its `cap` at 100, and the level the count closes.

**Steps:**

1. Open the `GradingCardList` story at the cap.
2. Add one more card.

**Expected Results:**

* `onAdd` does not fire.
* The second-submission-another-day line renders.
* The cap and the level the count closes read as they were given.

### shared-ui-grading-submission-US1-TC56-1: The reference out of reach keeps the list working

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingCardList`'s matches read as an error, with the catalogue-unavailable line supplied.

**Steps:**

1. Open the `GradingCardList` story with the matches in error.

**Expected Results:**

* Every card carries the catalogue-unavailable line, not the kept-as-typed one.
* The declared value is still asked for on each card.

### shared-ui-grading-submission-US1-TC57-1: A pasted line above the ceiling names the card and its value

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
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingPasteSheet`'s `result` carries one line above the level's ceiling, with the second-submission line supplied.

**Steps:**

1. Open the `GradingPasteSheet` story with that result.

**Expected Results:**

* The above-the-ceiling row names the card and its declared value.
* The second-submission line renders.

### shared-ui-grading-submission-US1-TC58-1: The paste reports its cards through onApply

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing the cards

**Pre-conditions:**

* `GradingPasteSheet`'s `result` carries matched, kept-as-typed and valueless cards, with `onApply` supplied.

**Steps:**

1. Open the `GradingPasteSheet` story with that result.
2. Activate Add n cards.

**Expected Results:**

* `onApply` fires with every card the paste made, in the outcomes it made them.
* The sheet writes to no list of its own.

### shared-ui-grading-submission-US1-TC59-1: A paste error reads as an error, not an empty list

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
* **Trace:** Content through props

**Pre-conditions:**

* `GradingPasteSheet`'s `result` reads as an error, with the consumer's message.

**Steps:**

1. Open the `GradingPasteSheet` story with the result in error.

**Expected Results:**

* The consumer's message renders in the error tone.
* Nothing reads as a list that matched nothing.

### shared-ui-grading-submission-US1-TC60-1: A running-late chip reads the words and the tone it was given

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where the submission stands

**Pre-conditions:**

* `GradingOwnershipChip`'s `chip` carries the running-late words and their tone, and `status` its word.

**Steps:**

1. Open the `GradingOwnershipChip` story with that pair.

**Expected Results:**

* The chip reads those words in that tone.
* The block reads no date and derives no lateness of its own.

### shared-ui-grading-submission-US1-TC61-1: A certificate reads against the lookup address it was given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingCardRecord` carries one graded card with a certificate and the grader's lookup address.

**Steps:**

1. Open the `GradingCardRecord` story with that card.

**Expected Results:**

* The certificate renders against the address supplied.
* No address is built inside the block.

### shared-ui-grading-submission-US1-TC62-1: A card with no grade shows its badge and no grade

Runs once per row of **Test data**.

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingGradeCards` carries one card for the row's outcome, with its badge and no grade.

**Test data:**

| Outcome |
| --- |
| Moved up a level |
| Held by the grader |
| Minimum grade not met |
| Not returned |
| Damaged |

**Steps:**

1. Open the `GradingGradeCards` story with that card.

**Expected Results:**

* The card renders the badge it was given.
* No grade renders on a card the grader issued none for.

### shared-ui-grading-submission-US1-TC63-1: The pickup card says nothing is due

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingPickupCard` is given nothing to settle.

**Steps:**

1. Open the `GradingPickupCard` story with nothing to settle.

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

**Pre-conditions:**

* `GradingNamedCollector` carries the refusal that the cards were already collected.

**Steps:**

1. Open the `GradingNamedCollector` story with that refusal.
2. Activate Save.

**Expected Results:**

* The refusal renders under the name field.
* `onSave` does not fire.

### shared-ui-grading-submission-US1-TC65-1: The money block reads an estimate as unpaid

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
* **Trace:** What is paid and due

**Test data:**

| Field | Value |
| --- | --- |
| Fee line | 4 cards × 25000 HKD minor units, total 100000 |
| Cover line | 12000 HKD minor units |

**Pre-conditions:**

* `GradingMoneyBlock` carries the fee line, the cover line and the paid-at-the-counter line, with no paid line.

**Steps:**

1. Open the `GradingMoneyBlock` story with those lines.

**Expected Results:**

* The fee line and the paid-at-the-counter line render.
* The cover line renders under the fee.
* No paid line renders.

### shared-ui-grading-submission-US1-TC66-1: A payout names its route beside the refunded fee

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
* **Trace:** What is paid and due

**Test data:**

| Field | Value |
| --- | --- |
| Payout | 600000 HKD minor units, by bank transfer |
| Refunded fee | 25000 HKD minor units |

**Pre-conditions:**

* `GradingMoneyBlock` carries the payout line with its route and the refunded fee line.

**Steps:**

1. Open the `GradingMoneyBlock` story with those two lines.

**Expected Results:**

* Both lines render, the payout naming its route.

### shared-ui-grading-submission-US1-TC67-1: The paid line names its method, instant and till reference

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
* **Trace:** What is paid and due

**Test data:**

| Field | Value |
| --- | --- |
| Paid | 100000 HKD minor units |
| Method | card |
| Till reference | the POS reference supplied |

**Pre-conditions:**

* `GradingMoneyBlock` carries a paid line with its amount, method, instant and till reference.

**Steps:**

1. Open the `GradingMoneyBlock` story with that paid line.

**Expected Results:**

* The amount, the method, the instant and the till reference all read as they were given.

### shared-ui-grading-submission-US1-TC68-1: A matched card with no set or number reads from its name alone

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

* `GradingCardList` carries one card matched in the reference, carrying no set and no number.

**Steps:**

1. Open the `GradingCardList` story with that card.

**Expected Results:**

* The card reads as matched, from its name alone.
* Rendering the card raises no error.

### shared-ui-grading-submission-US1-TC69-1: A collected slab carries its hand-back photograph

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingGradeCards` carries one graded card given the photograph taken at
  hand-back, and one graded card given none.

**Steps:**

1. Open the `GradingGradeCards` story with both cards.

**Expected Results:**

* The card given a photograph shows it beside its grade, grader and
  certificate.
* The card given none shows none.

### shared-ui-grading-submission-US1-TC71-1: A shop naming no hours shows no Open row

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
* **Trace:** Collecting the cards

**Pre-conditions:**

* `GradingPickupCard` is given no `open`.

**Steps:**

1. Open the `GradingPickupCard` story with `open` left out.

**Expected Results:**

* The shop and its address are shown.
* No Open row renders.

### shared-ui-grading-submission-US1-TC72-1: A card's payout line shows once made, and its reversal once reversed

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
* **Trace:** The cards after hand-in

**Pre-conditions:**

* `GradingGradeCards` carries one card given a payout line, one given a reversal line, and one given neither.

**Steps:**

1. Open the `GradingGradeCards` story with the three cards.

**Expected Results:**

* The card given a payout line shows it.
* The card given a reversal line shows it in place of a payout line.
* The card given neither shows no such line.

### shared-ui-grading-submission-US1-TC73-1: A review given no booking offers neither the booking nor the statement

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
* **Trace:** Reviewing before booking

**Pre-conditions:**

* `GradingReview` carries two cards, one of them with an upcharge warning, no `onBook`, no `onConsent` and no `consented`, and a save act whose words read Save changes.

**Steps:**

1. Open the `GradingReview` story with that review.
2. Activate the save act.

**Expected Results:**

* Step 1: no booking and no collection statement shows; the schedule, the totals and the warning read as given.
* Step 1: the save act reads Save changes.
* Step 2: the save reports through its own callback.

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
| A cap given as none refuses no add | Folded | The block change's rule named no scenario; the `NoCap` story already proved it. Folded as `shared-ui-grading-submission-SC-67` |
| A level with no figures reads the no-figure word, not nought | Folded | Named no scenario; the `UnpricedGrader` story already proved it. Folded as `shared-ui-grading-submission-SC-68` |
| The title's rung | Folded | Named no scenario; the `TitleUnderASection` story already proved it. Folded as `shared-ui-grading-submission-SC-69` |
| The tone on `shared-ui-grading-submission-US1-TC32-1` and `-TC39-1` | Kept | A tone that dresses an outcome is the design record's and the suite's, not a requirement's; the scenarios state the substance the tone dresses |
| `shared-ui-grading-submission-SC-74` | Case added, added after the run | `shared-ui-grading-submission-US1-TC73-1`: decided outside the blind pass; the editor keeps the review for its totals and warning, so the booking and the tick are left out together and the save reads the consumer's words |
| The other 45 cases | Joined, unchanged | Each reaches a scenario that states it; no case was dropped, and nothing in the two readings stated opposite things |

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-grading-submission-US1-TC2-1` | A person reads the package's exports and judges whether any grading block duplicates a booking block's role; a name check alone would pass a redrawn slot picker under another name |
| `shared-ui-grading-submission-US1-TC3-1` | A person judges whether an export draws an operator's surface; no check reads a component's audience |
| `shared-ui-grading-submission-US1-TC50-1` | A person reads the design record's state tables against the stories; nothing joins a row of `ui-design.md` to a story id |
