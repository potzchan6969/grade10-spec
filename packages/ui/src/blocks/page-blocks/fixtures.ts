import type { FactRow } from "./fact-card";
import type { NoteListItem } from "./note-list";
import type { StageRailStage } from "./stage-rail";

/** The financed lane's eight stages, in the order a case walks them. */
export const FINANCED_STAGES: readonly StageRailStage[] = [
  { id: "request", label: "Request" },
  { id: "valued", label: "Valued" },
  { id: "offer", label: "Offer" },
  { id: "agreed", label: "Agreed" },
  { id: "signed", label: "Signed" },
  { id: "vault", label: "Vault" },
  { id: "loan", label: "Loan" },
  { id: "home", label: "Home" },
];

/** The storage lane skips the offer and the loan. */
export const STORAGE_STAGES: readonly StageRailStage[] = FINANCED_STAGES.filter(
  (stage) => stage.id !== "offer" && stage.id !== "loan",
);

/** The request wizard's three steps. */
export const WIZARD_STEPS: readonly StageRailStage[] = [
  { id: "describe", label: "Describe" },
  { id: "photograph", label: "Photograph" },
  { id: "review", label: "Review" },
];

export const ENDED_WORD = "Declined";

export const OFFER_TITLE = "Our offer";
export const OFFER_ROWS_LABEL = "The offer’s figures";
export const OFFER_LEAD = "HK$8,000.00 over 30 days at 6% for the term.";
export const OFFER_ROWS: readonly FactRow[] = [
  { label: "Loan", value: "HK$8,000.00" },
  { label: "Interest for the term", value: "HK$480.00" },
];
export const OFFER_TOTAL = "Total to repay: HK$8,480.00.";
export const OFFER_OPEN_UNTIL = "Open until 12 October, 18:00 HKT.";
export const OFFER_ACCEPT = "Accept This Offer";

export const KEEPS_TITLE = "What we keep";
export const KEEPS_ROWS: readonly FactRow[] = [
  { label: "The agreements", value: "7 years after the case ends" },
  { label: "Identity checks", value: "Being decided" },
];

export const REMINDERS_TITLE = "Reminders";
export const REMINDERS_FREE = "A reminder costs nothing.";

export const LOADING_LABEL = "Loading your cases…";

const BEFORE_VERIFIED: NoteListItem = {
  id: "verified",
  content: "Verified. Nothing to bring but the item.",
};
const BEFORE_BRING: NoteListItem = { id: "bring", content: "Bring the item." };

/** Before you come on the storage lane: three lines. */
export const BEFORE_STORAGE: readonly NoteListItem[] = [
  BEFORE_VERIFIED,
  BEFORE_BRING,
  { id: "sign", content: "Sign the custody agreement." },
];

/** Before you come on the financed lane: four lines. */
export const BEFORE_FINANCED: readonly NoteListItem[] = [
  BEFORE_VERIFIED,
  BEFORE_BRING,
  { id: "sign", content: "Sign the loan and custody agreements." },
  { id: "money", content: "The money follows once you have signed." },
];

export const VERIFY_LABEL = "Verify now";
export const VERIFY_HREF = "/vault/verify";
export const IN_PERSON_LINE = "Or verify in person when you arrive.";
