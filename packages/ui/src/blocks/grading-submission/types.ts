/** An amount as its currency's minor units and the ISO 4217 code beside it.
 * Nothing in this set totals, converts or rounds one. */
type GradingMoney = { amountMinor: number; currency: string };

/** The badge tones a grading block draws, as `Badge` names them. */
type GradingTone =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "brand"
  | "outline";

/** What became of one card, as the consumer reports it. The word and the line
 * beside the badge are the consumer's; only the tone is the block's. */
type GradingCardOutcome =
  | "listed"
  | "handed-in"
  | "refused"
  | "withdrawn"
  | "graded"
  | "moved-up"
  | "ungraded"
  | "minimum-not-met"
  | "held"
  | "not-returned"
  | "damaged"
  | "collected"
  | "vaulted";

/** One grader, as the fee sheet and the picker both name it. */
type GradingGrader = { id: string; name: string };

/** One level of a grader's fee sheet, every figure given. */
type GradingFeeLevel = {
  id: string;
  name: string;
  /** The declared value this level takes up to; absent on a level nobody has priced. */
  ceiling?: GradingMoney;
  /** The cards a submission this level allows, in the consumer's words. */
  cardsPerSubmission: string;
  /** Absent on a level nobody has priced. */
  feePerCard?: GradingMoney;
  /** The cover rate in the consumer's words, where the level carries one. */
  coverRate?: string;
  /** The weeks back, in the consumer's words. */
  weeks: string;
};

/** One grader's sheet: the levels, and the line about its figures where the
 * consumer has one. */
type GradingFeeSheetRecord = GradingGrader & {
  levels: readonly GradingFeeLevel[];
  /** Said about the figures themselves, for a grader nobody has priced. */
  figuresLine?: string;
};

/** One reference sale behind a matched card. */
type GradingReferenceSale = { id: string; label: string; price: GradingMoney };

/** A card on the editable planning list. */
type GradingListedCard = {
  id: string;
  name: string;
  /** The set the reference matched, where it matched one. */
  set?: string;
  /** The card's number in that set, where the reference gives one. */
  number?: string;
  /** Matched in the reference, or kept as the collector typed it. */
  matched: boolean;
  declaredValue?: GradingMoney;
  /** The declared value reopened for the collector to change. */
  editing?: boolean;
  referenceSales?: readonly GradingReferenceSale[];
  /** The grade the minimum-grade option names on this card, such as `PSA 9`. */
  minimumGrade?: string;
  /** Whether the collector asked for that minimum grade. */
  minimumGradeWanted?: boolean;
  /** The line naming this card as declared above the level's ceiling. */
  aboveCeilingLine?: string;
};

/** One match the reference offered for what the collector typed. */
type GradingCardMatch = {
  id: string;
  name: string;
  setLine: string;
  suggestedValue?: GradingMoney;
};

/** A photograph the shop took, with the words that name it. */
type GradingPhoto = { src: string; alt: string };

/** The vault case a vaulted card went into, by the reference recorded at the
 * counter; `href` only where that reference matches a case. */
type GradingVaultCase = { reference: string; href?: string };

export type {
  GradingCardMatch,
  GradingCardOutcome,
  GradingFeeLevel,
  GradingFeeSheetRecord,
  GradingGrader,
  GradingListedCard,
  GradingMoney,
  GradingPhoto,
  GradingReferenceSale,
  GradingTone,
  GradingVaultCase,
};
