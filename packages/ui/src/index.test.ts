import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const entry = readFileSync(new URL("./index.ts", import.meta.url), "utf8");
const exported = (name: string) =>
  new RegExp(`\\b(?:type\\s+)?${name}\\b`).test(entry);

const GRADING_BLOCKS = [
  "GradingCardList",
  "GradingCardRecord",
  "GradingFeeSheet",
  "GradingGradeCards",
  "GradingLevelPicker",
  "GradingMoneyBlock",
  "GradingNamedCollector",
  "GradingOwnershipChip",
  "GradingPasteSheet",
  "GradingPickupCard",
  "GradingReview",
  "GradingStatusRail",
  "GradingUncollectedLadder",
];

const GRADING_TYPES = [
  "GradingCardAddition",
  "GradingCardListCap",
  "GradingCardListCopy",
  "GradingCardListProps",
  "GradingCardMatch",
  "GradingCardOutcome",
  "GradingCardRecordCopy",
  "GradingCardRecordProps",
  "GradingEstimate",
  "GradingFeeLevel",
  "GradingFeeSheetCopy",
  "GradingFeeSheetProps",
  "GradingFeeSheetRecord",
  "GradingGradeCard",
  "GradingGradeCardsCopy",
  "GradingGradeCardsProps",
  "GradingGrader",
  "GradingLadderRung",
  "GradingLevelPickerCopy",
  "GradingLevelPickerProps",
  "GradingListedCard",
  "GradingLocaleProps",
  "GradingMoney",
  "GradingMoneyBlockCopy",
  "GradingMoneyBlockProps",
  "GradingMoneyLine",
  "GradingMoneyLines",
  "GradingNamedCollectorCopy",
  "GradingNamedCollectorProps",
  "GradingOwnershipChipCopy",
  "GradingOwnershipChipProps",
  "GradingPasteOutcome",
  "GradingPasteResult",
  "GradingPasteSheetCopy",
  "GradingPasteSheetProps",
  "GradingPasteState",
  "GradingPhoto",
  "GradingPickerLevel",
  "GradingPickupCardCopy",
  "GradingPickupCardProps",
  "GradingRecordCard",
  "GradingReferenceSale",
  "GradingReviewCard",
  "GradingReviewCopy",
  "GradingReviewProps",
  "GradingStage",
  "GradingStatusRailCopy",
  "GradingStatusRailProps",
  "GradingTone",
  "GradingUncollectedLadderCopy",
  "GradingUncollectedLadderProps",
  "GradingUpchargeWarning",
  "GradingVaultCase",
];

describe("the package entry", () => {
  /* A fixture on the entry reaches every application, where it can stand in
   * for brand copy on a live page; stories and tests import it by path. */
  it("ships no story fixture", () => {
    expect(entry.match(/FIXTURE_\w+|fixtures"/g) ?? []).toEqual([]);
  });

  it("exports none of the grading blocks or their types (shared-ui-grading-submission-SC-01)", () => {
    expect([...GRADING_BLOCKS, ...GRADING_TYPES].filter(exported)).toEqual([]);
  });

  it("exports no grading-named booking block (shared-ui-grading-submission-SC-02)", () => {
    expect(
      entry.match(/\bGrading\w*(?:Picker|Booking|Slot|Visit)\w*/g) ?? [],
    ).toEqual([]);
  });

  it("lists no grading collector block (shared-ui-grading-submission-SC-71)", () => {
    expect(
      existsSync(new URL("./blocks/grading-submission", import.meta.url)),
    ).toBe(false);
    expect(entry).not.toContain("blocks/grading-submission");
  });
});
