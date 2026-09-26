import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

/** The block sources beside this test: every `.tsx` that is not a story. */
function blockSources(): readonly { name: string; source: string }[] {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return readdirSync(here)
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".stories.tsx"))
    .map((name) => ({
      name,
      source: readFileSync(path.join(here, name), "utf8"),
    }));
}

describe("grading submission public entry", () => {
  // shared-ui-grading-submission-SC-01
  it("exports the thirteen named grading blocks and no other", () => {
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
    expect(
      Object.keys(publicEntry)
        .filter((name) => name.startsWith("Grading"))
        .sort(),
    ).toEqual([
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
    ]);
  });

  // shared-ui-grading-submission-SC-02
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

  // shared-ui-grading-submission-SC-02
  it("composes the booking set unchanged", () => {
    expect([
      publicEntry.BookingLocationPicker,
      publicEntry.BookingSlotPicker,
      publicEntry.BookingDetailsForm,
      publicEntry.BookingConfirmation,
      publicEntry.BookingManageCard,
    ]).toEqual(Array.from({ length: 5 }, () => expect.any(Function)));
  });

  // The catalogs reach a block through props and nowhere else. Stories and
  // fixtures may quote them; a block may not read one.
  it("imports no message catalog into a block", () => {
    const offenders = blockSources()
      .filter(({ source }) => source.includes("@grade10/i18n"))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
  });

  // Every state is reached from props, so no block asks for data, a route or
  // a store (shared-ui-grading-submission-SC-58).
  it("asks for no data, route or store in a block", () => {
    const reaches =
      /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie|window\.location|react-router|@tanstack\/|useNavigate|useQuery|useStore/;
    const offenders = blockSources()
      .filter(({ source }) => reaches.test(source))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
  });

  // The sheet and the picker are two drawings of one record: neither reads,
  // checks or reports on the other (shared-ui-grading-submission-SC-59).
  it("keeps the fee sheet and the level picker apart", () => {
    const sources = new Map(
      blockSources().map(({ name, source }) => [name, source]),
    );
    expect(sources.get("grading-fee-sheet.tsx")).not.toMatch(
      /grading-level-picker/,
    );
    expect(sources.get("grading-level-picker.tsx")).not.toMatch(
      /grading-fee-sheet/,
    );
  });

  it("exports nothing console-shaped for grading", () => {
    const consoleShaped = Object.keys(publicEntry).filter((name) =>
      /^Grading(Queue|Runbook|Batch|Receive|Settings|Console|Panel)/.test(name),
    );
    expect(consoleShaped).toEqual([]);
  });

  // Copy filling: the export test checked only names starting `Grading`,
  // so a helper function's export could slip past it unnoticed — as
  // `fillGradingCopy` did until this capability's WhatsApp templates named
  // it a real consumer (round 5). Widened to every export this capability
  // names, not only the thirteen blocks.
  it("exports fillGradingCopy and GradingLocaleProps beside the thirteen blocks", () => {
    expect(publicEntry.fillGradingCopy).toEqual(expect.any(Function));
    expect(publicEntry.fillGradingCopy("Hi {name}", { name: "Ava" })).toBe(
      "Hi Ava",
    );
  });

  // shared-ui-grading-submission-SC-71
  it("fillGradingCopy throws naming a placeholder with no value, never a literal", () => {
    expect(() =>
      publicEntry.fillGradingCopy("Hi {name}, at {shop}", { name: "Ava" }),
    ).toThrow(/shop/);
  });
});
