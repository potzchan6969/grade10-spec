import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as publicEntry from "./index";

const entry = readFileSync(new URL("./index.ts", import.meta.url), "utf8");
const exported = (name: string) => new RegExp(`\\b${name}\\b`).test(entry);

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

/* The collector's vault screens left the site for a new design, and the
 * store's blocks for them went with them. */
const RETIRED_VAULT_NAMES = [
  "VaultAcceptOfferDialog",
  "VaultAcceptOfferDialogCopy",
  "VaultAcceptOfferDialogProps",
  "VaultCases",
  "VaultCasesCard",
  "VaultCasesChip",
  "VaultCasesCopy",
  "VaultCasesIcon",
  "VaultCasesProps",
  "VaultCasesTone",
  "VaultCasesEmpty",
  "VaultCasesEmptyCopy",
  "VaultCasesEmptyProps",
  "VaultCasesEmptyStep",
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

  it("exports nothing grading-named, booking blocks included (shared-ui-grading-submission-SC-02)", () => {
    expect(entry.match(/\bGrading[A-Z]\w*/g) ?? []).toEqual([]);
  });

  it("lists no grading collector block (shared-ui-grading-submission-SC-71)", () => {
    const blocks = readdirSync(new URL("./blocks", import.meta.url));
    expect(blocks.filter((name) => name.startsWith("grading"))).toEqual([]);
    expect(entry).not.toMatch(/blocks\/grading/);
  });

  it("exports none of the vault collector blocks (shared-ui-vault-case-SC-01)", () => {
    expect(RETIRED_VAULT_NAMES.filter(exported)).toEqual([]);
    expect(
      Object.keys(publicEntry).filter((key) => /^Vault/.test(key)),
    ).toEqual([]);
  });

  it("exports no vault-named confirmation or visit card (shared-ui-vault-case-SC-02)", () => {
    expect(
      Object.keys(publicEntry).filter((key) =>
        /^Vault\w*(Confirm|Visit)/.test(key),
      ),
    ).toEqual([]);
  });

  it("lists no vault collector block (shared-ui-vault-case-SC-03)", () => {
    const blocks = readdirSync(new URL("./blocks", import.meta.url));

    expect(blocks).not.toContain("vault-case");
  });
});
