import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, it } from "vitest";
import type { CartDrawerBodyProps, CartDrawerCopy } from "./index";
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

const VISIT_AND_CONSIGNMENT_BLOCKS = [
  "VisitActRow",
  "VisitBody",
  "VisitBookedPass",
  "VisitCancelPanel",
  "VisitFacts",
  "VisitFullDay",
  "VisitLatePanel",
  "VisitLinkOpensNothing",
  "VisitList",
  "VisitMovePanel",
  "VisitPass",
  "VisitPhaseHeader",
  "VisitReconnecting",
  "VisitRefusedBook",
  "VisitTicketBody",
  "VisitWaitBody",
  "ConsignmentSellerLine",
];

const VISIT_AND_CONSIGNMENT_TYPES = [
  "VisitAct",
  "VisitActRowProps",
  "VisitBodyCopy",
  "VisitBodyProps",
  "VisitBookedPassCopy",
  "VisitBookedPassProps",
  "VisitCancelPanelCopy",
  "VisitCancelPanelProps",
  "VisitCancelReason",
  "VisitFact",
  "VisitFactsCopy",
  "VisitFactsProps",
  "VisitFullDayCopy",
  "VisitFullDayProps",
  "VisitFullDayShop",
  "VisitLateChoice",
  "VisitLatePanelCopy",
  "VisitLatePanelProps",
  "VisitLinkOpensNothingCopy",
  "VisitLinkOpensNothingProps",
  "VisitListCopy",
  "VisitListProps",
  "VisitListRow",
  "VisitMovePanelCopy",
  "VisitMovePanelProps",
  "VisitNoticeCopy",
  "VisitPassCopy",
  "VisitPassProps",
  "VisitPhaseHeaderCopy",
  "VisitPhaseHeaderProps",
  "VisitReconnectingCopy",
  "VisitReconnectingProps",
  "VisitRefusal",
  "VisitRefusedBookCopy",
  "VisitRefusedBookProps",
  "VisitTicketBodyCopy",
  "VisitTicketBodyProps",
  "VisitTone",
  "VisitWaitBodyCopy",
  "VisitWaitBodyProps",
  "VisitWaitNoticeCopy",
  "VisitWaitService",
  "VisitWaitShop",
  "ConsignmentSellerLineCopy",
  "ConsignmentSellerLineProps",
];

const STORE_CART_BLOCKS = [
  "CartDrawer",
  "CartDrawerBody",
  "CartDrawerFooter",
  "CartDrawerHeader",
  "CartItem",
  "CartPromoSheet",
  "PromoTicket",
];

const STORE_CART_TYPES = [
  "CartDrawerBodyProps",
  "CartDrawerCopy",
  "CartDrawerFooterCopy",
  "CartDrawerFooterProps",
  "CartDrawerHeaderCopy",
  "CartDrawerHeaderProps",
  "CartDrawerProps",
  "CartItemCopy",
  "CartItemProps",
  "CartItemStatus",
  "CartItemSummary",
  "CartPromoSheetProps",
  "HeldPromoCode",
  "OrderDiscountRow",
  "PointsState",
  "PromoNotice",
  "PromoState",
  "PromoTicketProps",
];

/* Every name the entry re-exports from the store-cart blocks, read off the
 * entry's own text so a type export is seen as well as a value. */
const storeCartNames = () =>
  [
    ...entry.matchAll(
      /export (?:type )?\{([^}]*)\} from "\.\/blocks\/store-cart\/[^"]+";/g,
    ),
  ]
    .flatMap((match) => (match[1] ?? "").split(","))
    .map((name) => name.replace(/^\s*type\s+/, "").trim())
    .filter(Boolean)
    .sort();

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
  it("exports the visit and consignment blocks and their types", () => {
    expect(
      VISIT_AND_CONSIGNMENT_BLOCKS.filter((name) => !(name in publicEntry)),
    ).toEqual([]);
    expect(
      [...VISIT_AND_CONSIGNMENT_BLOCKS, ...VISIT_AND_CONSIGNMENT_TYPES].filter(
        (name) => !exported(name),
      ),
    ).toEqual([]);
  });

  it("exports exactly the store-cart components and types (shared-ui-store-cart-SC-01)", () => {
    expect(storeCartNames()).toEqual(
      [...STORE_CART_BLOCKS, ...STORE_CART_TYPES].sort(),
    );
    expect(STORE_CART_BLOCKS.filter((name) => !(name in publicEntry))).toEqual(
      [],
    );
  });

  it("exports no placeholder cart slot (shared-ui-store-cart-SC-43)", () => {
    expect(entry).not.toMatch(/\bCartItemSlot(Props)?\b/);
    expect("CartItemSlot" in publicEntry).toBe(false);
  });

  it("requires the empty-cart title and takes an optional description (shared-ui-store-cart-SC-22)", () => {
    expectTypeOf<CartDrawerCopy["emptyTitle"]>().toEqualTypeOf<string>();
    expectTypeOf<CartDrawerCopy["emptyDescription"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<CartDrawerBodyProps["emptyTitle"]>().toEqualTypeOf<string>();
    expectTypeOf<CartDrawerBodyProps["emptyDescription"]>().toEqualTypeOf<
      string | undefined
    >();
    // @ts-expect-error emptyTitle is required on the drawer copy
    const copy: Pick<CartDrawerCopy, "emptyTitle"> = {};
    // @ts-expect-error emptyTitle is required on the body props
    const body: Pick<CartDrawerBodyProps, "emptyTitle"> = {};
    const described: Pick<CartDrawerCopy, "emptyTitle" | "emptyDescription"> = {
      emptyTitle: "Your cart is empty",
    };
    expect([copy, body, described]).toHaveLength(3);
  });
});
