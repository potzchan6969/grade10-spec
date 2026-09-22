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

* `GradingCardList` carries one card and its `onAdd`, `onEdit` and `onRemove` callbacks.

**Steps:**

1. Open the `GradingCardList` story with that card.
2. Search and add a card, edit the existing card's declared value, then remove it.

**Expected Results:**

* `onAdd` fires with the searched card.
* `onEdit` fires with the changed declared value.
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
