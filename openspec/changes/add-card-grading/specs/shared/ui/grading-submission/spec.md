# shared/ui/grading-submission Specification

## Purpose

The grading collector's own blocks, which the store no longer carries: the
collector's grading screens are designed again by @tangconst from the
backend, and this capability holds the store to exporting none of the blocks
they used. The drop-off booking and signing views are grading's own, and
compose `shared/ui/appointment-booking` and `shared/ui/page-blocks`.

## Feature set

- The export contract
  - Named components: none - the package exports no grading collector block,
    and none of the types the removed blocks carried
  - The booking set is not redrawn: retired with the blocks; the drop-off
    views compose the booking blocks
  - Nothing console-shaped: retired with the blocks
- Reading what it costs
  - One sheet per grader: retired with the blocks
  - Open or closed, with the reason: retired with the blocks
  - The estimate belongs to the pick: retired with the blocks
  - Two drawings of one sheet: retired with the blocks
- Listing the cards
  - The editable list: retired with the blocks
  - The caps on the list: retired with the blocks
  - The paste and what it made: retired with the blocks
- Reviewing before booking
  - The schedule and the totals: retired with the blocks
  - The upcharge warning per card: retired with the blocks
  - Before it can be booked: retired with the blocks
  - A review with no booking: retired with the blocks
  - A refusal by name: retired with the blocks
- Where the submission stands
  - The status word and whose move it is: retired with the blocks
  - The rail: retired with the blocks
- The cards after hand-in
  - The read-only record: retired with the blocks
  - The grades: retired with the blocks
- Collecting the cards
  - The pickup card: retired with the blocks
  - Naming somebody: retired with the blocks
- What is paid and due
  - One place for the lines: retired with the blocks
  - The due line reads as due: retired with the blocks
- If nobody collects
  - The rungs, each dated: retired with the blocks
  - A passed rung is marked: retired with the blocks
- Content through props
  - Consumer-owned words: retired with the blocks
  - No application inside: retired with the blocks
  - Money and time as given: retired with the blocks
  - Every state from props: retired with the blocks

## MODIFIED Requirements

### Requirement: The grading submission exports

The store carries no block for the grading collector's own screens until they
are designed again.

**Components** - the shared UI package's public entry SHALL export none of
`GradingCardList`, `GradingCardRecord`, `GradingFeeSheet`,
`GradingGradeCards`, `GradingLevelPicker`, `GradingMoneyBlock`,
`GradingNamedCollector`, `GradingOwnershipChip`, `GradingPasteSheet`,
`GradingPickupCard`, `GradingReview`, `GradingStatusRail` and
`GradingUncollectedLadder`.

**Types** - the public entry SHALL export none of the types those blocks
carried: `GradingCardAddition`, `GradingCardListCap`, `GradingCardListCopy`,
`GradingCardListProps`, `GradingCardMatch`, `GradingCardOutcome`,
`GradingCardRecordCopy`, `GradingCardRecordProps`, `GradingEstimate`,
`GradingFeeLevel`, `GradingFeeSheetCopy`, `GradingFeeSheetProps`,
`GradingFeeSheetRecord`, `GradingGradeCard`, `GradingGradeCardsCopy`,
`GradingGradeCardsProps`, `GradingGrader`, `GradingLadderRung`,
`GradingLevelPickerCopy`, `GradingLevelPickerProps`, `GradingListedCard`,
`GradingLocaleProps`, `GradingMoney`, `GradingMoneyBlockCopy`,
`GradingMoneyBlockProps`, `GradingMoneyLine`, `GradingMoneyLines`,
`GradingNamedCollectorCopy`, `GradingNamedCollectorProps`,
`GradingOwnershipChipCopy`, `GradingOwnershipChipProps`,
`GradingPasteOutcome`, `GradingPasteResult`, `GradingPasteSheetCopy`,
`GradingPasteSheetProps`, `GradingPasteState`, `GradingPhoto`,
`GradingPickerLevel`, `GradingPickupCardCopy`, `GradingPickupCardProps`,
`GradingRecordCard`, `GradingReferenceSale`, `GradingReviewCard`,
`GradingReviewCopy`, `GradingReviewProps`, `GradingStage`,
`GradingStatusRailCopy`, `GradingStatusRailProps`, `GradingTone`,
`GradingUncollectedLadderCopy`, `GradingUncollectedLadderProps`,
`GradingUpchargeWarning` and `GradingVaultCase`.

#### Scenario: shared-ui-grading-submission-SC-01 - An application imports the grading blocks
**Serves:** The export contract - the store carries no grading collector block until the screens are designed again

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports none of the components and types named above

#### Scenario: shared-ui-grading-submission-SC-02 - The drop-off composes the booking blocks
**Serves:** The export contract - the drop-off views compose the booking blocks

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports no grading-named shop picker, day and time picker,
  details form, confirmation or manage card

#### Scenario: shared-ui-grading-submission-SC-71 - A line carrying a value is the consumer's to fill
**Serves:** The export contract - no grading block is left whose lines a consumer fills

- **WHEN** the shared UI package's blocks are listed
- **THEN** none of them is a grading collector block

## REMOVED Requirements

### Requirement: The fee sheet draws every grader's levels

**Reason:** The collector's grading screens are designed again, and the store
carries no `GradingFeeSheet`.

**Migration:** None. The fee sheet's figures are
`grade10-site/grading/submission-plan`'s. Its scenarios retire with it.

### Requirement: The level picker opens a level or names what closed it

**Reason:** The store carries no `GradingLevelPicker`.

**Migration:** None. Which level is open and what closes it is
`grade10-site/grading/submission-plan`'s. Its scenarios retire with it.

### Requirement: The editable card list carries a card and what is missing on it

**Reason:** The store carries no `GradingCardList`.

**Migration:** None. What a planned card carries is
`grade10-site/grading/submission-plan`'s. Its scenarios retire with it.

### Requirement: The paste sheet accounts for every line

**Reason:** The store carries no `GradingPasteSheet`.

**Migration:** None. What a pasted line becomes is
`grade10-site/grading/submission-plan`'s. Its scenarios retire with it.

### Requirement: The review shows the schedule, the totals and what a card could cost

**Reason:** The store carries no `GradingReview`.

**Migration:** None. What the review states before booking is
`grade10-site/grading/submission-plan`'s. Its scenarios retire with it.

### Requirement: The status word and whose move it is are one pair

**Reason:** The store carries no `GradingOwnershipChip`.

**Migration:** None. The status word and whose move it is are
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: The rail marks the stage a submission reached

**Reason:** The store carries no `GradingStatusRail`.

**Migration:** None. The stage a status reaches is
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: The record after hand-in reads as the cards were handed in

**Reason:** The store carries no `GradingCardRecord`.

**Migration:** None. A card's outcome is
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: The grade cards read the grader's words

**Reason:** The store carries no `GradingGradeCards`.

**Migration:** None. The grade in the grader's words is
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: The pickup card says what to bring

**Reason:** The store carries no `GradingPickupCard`.

**Migration:** None. The pickup code, what is due and whether to bring an ID
are `grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with
it.

### Requirement: One person can be named to collect

**Reason:** The store carries no `GradingNamedCollector`.

**Migration:** None. Naming one person to collect is
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: One place for the money lines

**Reason:** The store carries no `GradingMoneyBlock`.

**Migration:** None. The fee, the cover and what is due are
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: The uncollected ladder dates every rung

**Reason:** The store carries no `GradingUncollectedLadder`.

**Migration:** None. The reminders, the storage day and the notice are
`grade10-site/grading/submission-lifecycle`'s. Its scenarios retire with it.

### Requirement: Every word, figure and act arrives through props

**Reason:** No grading collector block is left to take its words through
props.

**Migration:** None. Its scenarios retire with it.
