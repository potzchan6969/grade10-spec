import { describe, expect, it } from "vitest";
import * as publicEntry from "../../index";
import {
  GradingCardList,
  type GradingCardListCopy,
  type GradingCardListProps,
  GradingCardRecord,
  type GradingCardRecordCopy,
  type GradingCardRecordProps,
  GradingFeeSheet,
  type GradingFeeSheetCopy,
  type GradingFeeSheetProps,
  GradingGradeCards,
  type GradingGradeCardsCopy,
  type GradingGradeCardsProps,
  GradingLevelPicker,
  type GradingLevelPickerCopy,
  type GradingLevelPickerProps,
  GradingMoneyBlock,
  type GradingMoneyBlockCopy,
  type GradingMoneyBlockProps,
  GradingNamedCollector,
  type GradingNamedCollectorCopy,
  type GradingNamedCollectorProps,
  GradingOwnershipChip,
  type GradingOwnershipChipCopy,
  type GradingOwnershipChipProps,
  GradingPasteSheet,
  type GradingPasteSheetCopy,
  type GradingPasteSheetProps,
  GradingPickupCard,
  type GradingPickupCardCopy,
  type GradingPickupCardProps,
  GradingReview,
  type GradingReviewCopy,
  type GradingReviewProps,
  GradingStatusRail,
  type GradingStatusRailCopy,
  type GradingStatusRailProps,
  GradingUncollectedLadder,
  type GradingUncollectedLadderCopy,
  type GradingUncollectedLadderProps,
} from "../../index";

// Each block carries a `<Name>Props` and a `<Name>Copy` beside it; a type the
// entry stopped exporting fails here rather than in a consumer.
type PublicGradingTypes = [
  GradingCardListCopy,
  GradingCardListProps,
  GradingCardRecordCopy,
  GradingCardRecordProps,
  GradingFeeSheetCopy,
  GradingFeeSheetProps,
  GradingGradeCardsCopy,
  GradingGradeCardsProps,
  GradingLevelPickerCopy,
  GradingLevelPickerProps,
  GradingMoneyBlockCopy,
  GradingMoneyBlockProps,
  GradingNamedCollectorCopy,
  GradingNamedCollectorProps,
  GradingOwnershipChipCopy,
  GradingOwnershipChipProps,
  GradingPasteSheetCopy,
  GradingPasteSheetProps,
  GradingPickupCardCopy,
  GradingPickupCardProps,
  GradingReviewCopy,
  GradingReviewProps,
  GradingStatusRailCopy,
  GradingStatusRailProps,
  GradingUncollectedLadderCopy,
  GradingUncollectedLadderProps,
];

const publicGradingTypes: PublicGradingTypes | undefined = undefined;
void publicGradingTypes;

describe("grading submission public entry", () => {
  it("exports the thirteen named grading blocks", () => {
    expect([
      GradingFeeSheet,
      GradingCardList,
      GradingCardRecord,
      GradingPasteSheet,
      GradingLevelPicker,
      GradingReview,
      GradingStatusRail,
      GradingOwnershipChip,
      GradingPickupCard,
      GradingNamedCollector,
      GradingGradeCards,
      GradingMoneyBlock,
      GradingUncollectedLadder,
    ]).toEqual(Array.from({ length: 13 }, () => expect.any(Function)));
  });

  it("redraws no booking block under a grading name", () => {
    const names = Object.keys(publicEntry);
    for (const redrawn of [
      "GradingLocationPicker",
      "GradingSlotPicker",
      "GradingDetailsForm",
      "GradingConfirmation",
      "GradingManageCard",
      "GradingWizardRail",
      "GradingBatchLine",
    ]) {
      expect(names).not.toContain(redrawn);
    }
  });

  it("composes the booking set unchanged", () => {
    expect([
      publicEntry.BookingLocationPicker,
      publicEntry.BookingSlotPicker,
      publicEntry.BookingDetailsForm,
      publicEntry.BookingConfirmation,
      publicEntry.BookingManageCard,
    ]).toEqual(Array.from({ length: 5 }, () => expect.any(Function)));
  });

  it("exports nothing console-shaped for grading", () => {
    const consoleShaped = Object.keys(publicEntry).filter((name) =>
      /^Grading(Queue|Runbook|Batch|Receive|Settings|Console|Panel)/.test(name),
    );
    expect(consoleShaped).toEqual([]);
  });
});
