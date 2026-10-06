# shared/ui/grading-submission Specification

## Purpose

Blocks drawn only for grading's collector screens. @tangconst designs those
screens from the backend, and this capability holds the store to exporting
none of those blocks. Grading's drop-off booking views compose
`shared/ui/appointment-booking` and `shared/ui/page-blocks`; its signing page
composes doc-sign's `CeremonyFlow`.

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

## Requirements

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

<!-- trace:scenario id=g10.shared-grading-submission.SC-8at rev=1 -->
#### Scenario: shared-ui-grading-submission-SC-01 - An application imports the grading blocks
**Serves:** The export contract - the store carries no grading collector block until the screens are designed again

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports none of the components and types named above

<!-- trace:scenario id=g10.shared-grading-submission.SC-b0c rev=1 -->
#### Scenario: shared-ui-grading-submission-SC-02 - The drop-off composes the booking blocks
**Serves:** The export contract - the drop-off views compose the booking blocks

- **WHEN** the shared UI package's public entry is read
- **THEN** it exports no grading-named shop picker, day and time picker,
  details form, confirmation or manage card

<!-- trace:scenario id=g10.shared-grading-submission.SC-4dl rev=1 -->
#### Scenario: shared-ui-grading-submission-SC-71 - A line carrying a value is the consumer's to fill
**Serves:** The export contract - no grading block is left whose lines a consumer fills

- **WHEN** the shared UI package's blocks are listed
- **THEN** none of them is a grading collector block
