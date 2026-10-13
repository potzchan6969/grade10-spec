/** The manual page these wireframes settle, under grade10-site. */
export const DOCUMENTS_MANUAL_PATH = "grading/documents";

/** The states of the submission agreement a collector signs on the shop iPad. */
export type AgreementState =
  | "signable"
  | "cover-schedule"
  | "postal-address-empty"
  | "pages-not-viewed"
  | "name-mismatch"
  | "declined"
  | "sealed"
  | "link-expired"
  | "already-signed"
  | "placeholders";

/** The states of the hand-back receipt a collector, or someone for them, signs. */
export type ReceiptState =
  | "signable"
  | "named-person"
  | "id-matched"
  | "card-held"
  | "vaulted-slab"
  | "withdrawn-card"
  | "paid-out";

export const AGREEMENT_STORY_IDS = {
  signable: "grading-documents-prototypes-submission-agreement--signable",
  "cover-schedule":
    "grading-documents-prototypes-submission-agreement--cover-schedule",
  "postal-address-empty":
    "grading-documents-prototypes-submission-agreement--postal-address-empty",
  "pages-not-viewed":
    "grading-documents-prototypes-submission-agreement--pages-not-viewed",
  "name-mismatch":
    "grading-documents-prototypes-submission-agreement--name-mismatch",
  declined: "grading-documents-prototypes-submission-agreement--declined",
  sealed: "grading-documents-prototypes-submission-agreement--sealed",
  "link-expired":
    "grading-documents-prototypes-submission-agreement--link-expired",
  "already-signed":
    "grading-documents-prototypes-submission-agreement--already-signed",
  placeholders:
    "grading-documents-prototypes-submission-agreement--placeholders-outside-production",
} as const satisfies Record<AgreementState, string>;

export const RECEIPT_STORY_IDS = {
  signable: "grading-documents-prototypes-hand-back-receipt--signable",
  "named-person":
    "grading-documents-prototypes-hand-back-receipt--named-person",
  "id-matched": "grading-documents-prototypes-hand-back-receipt--id-matched",
  "card-held": "grading-documents-prototypes-hand-back-receipt--card-held",
  "vaulted-slab":
    "grading-documents-prototypes-hand-back-receipt--vaulted-slab",
  "withdrawn-card":
    "grading-documents-prototypes-hand-back-receipt--withdrawn-card",
  "paid-out": "grading-documents-prototypes-hand-back-receipt--paid-out",
} as const satisfies Record<ReceiptState, string>;

/** The collector's submission page, where a sealed copy is kept. */
export const SUBMISSION_HANDED_IN_STORY_ID =
  "grading-submission-prototypes-submission--handed-in";
export const SUBMISSION_BACK_WITH_YOU_STORY_ID =
  "grading-submission-prototypes-submission--back-with-you";

export const DOCUMENTS_COPY = {
  submission: "Submission SUB-2041",
  shop: "Hong Kong Grade10 Store",
  linkTimer: "This link is valid for 30 minutes.",
  documentTitle: "Submission agreement",
  receiptTitle: "Hand-back receipt",
  parties: "Grade10 and Alex Chan, the collector",
  grader: "Grader and level",
  graderValue: "PSA, Regular level",
  coverGraderValue: "PSA, Express level",
  cards: "Your cards",
  cardsHeader: { card: "Card", declared: "Declared value", cover: "Cover" },
  cardRows: [
    {
      id: "charizard",
      name: "1999 Charizard, Base Set",
      declared: "HKD 3,500",
    },
    { id: "blastoise", name: "Blastoise, Base Set", declared: "HKD 2,800" },
    { id: "venusaur", name: "Venusaur, Base Set", declared: "HKD 3,100" },
  ],
  coverRows: [
    {
      id: "charizard",
      name: "1999 Charizard, Base Set",
      declared: "HKD 3,500",
      cover: "HKD 52.50",
    },
    {
      id: "blastoise",
      name: "Blastoise, Base Set",
      declared: "HKD 2,800",
      cover: "HKD 42.00",
    },
    {
      id: "venusaur",
      name: "Venusaur, Base Set",
      declared: "HKD 3,100",
      cover: "HKD 46.50",
    },
  ],
  totals: {
    declared: "Declared value in total",
    declaredValue: "HKD 9,400",
    fee: "Fee paid at the counter once signed",
    feeValue: "HKD 1,800",
    coverValue: "HKD 141.00 cover in total",
    back: "Estimated back",
    backValue:
      "About 5 weeks from the day the batch leaves. An estimate, not a promise.",
    backCover:
      "About 3 weeks from the day the batch leaves. An estimate, not a promise.",
    feeCover: "HKD 3,600 fee at Express",
  },
  clauses: [
    "Grade10 submits the cards to the grader for you under the grader's terms, and hands them back in person to you or a person you name, against the pickup code. Slabs are not shipped.",
    "The declared value sets the level and the insured cover. It does not affect the grade.",
    "The fee is charged whether or not the grader encapsulates a card. A card refused at hand-in, or withdrawn before its batch closes, is not charged.",
    "Where the grader moves a card to a higher level, the difference on the fee sheet is payable at the counter before collection. The grade is the grader's decision.",
    "In transit the cards are covered to their declared value under the courier's cover and the grader's terms. A card not returned, or returned damaged, is paid out at its declared value with its fee refunded.",
    "Cards not collected incur a storage fee of HKD 30 a card a month from day 90 after the ready email. After written notice at 180 days, Grade10 may sell them under the Disposal of Uncollected Goods Ordinance (Cap. 456).",
    "Governing law is Hong Kong SAR. Complaints go to the contact printed on this document.",
  ],
  draftClauses: "Clauses 4 and 6 print as drafted until counsel replaces them.",
  complaintsLine: "Complaints: Grade10 customer care, by email.",
  signing: {
    name: "Your name, as on the booking",
    nameMismatch: "This name does not match your booking.",
    address: "Postal address",
    addressHint: "Used only for a written notice under clause 6.",
    addressEmpty: "Enter a postal address.",
    signature: "Draw or type your signature",
    sign: "Sign",
    decline: "Decline",
    pagesRead: "Read to the end first",
    pagesReadBody:
      "Scroll the document to the end before you sign. Nothing is signed until you have read every page.",
    refusedName: "Sign refused: the name does not match",
    refusedNameBody: "Use the name on your booking, or ask staff.",
    refusedAddress: "Sign refused: the postal address is empty",
    refusedAddressBody: "Type the address once at the counter.",
  },
  declined: {
    title: "You declined",
    description:
      "Nothing is paid and nothing is signed. Ask staff if you have questions.",
  },
  sealed: {
    title: "Signed and sealed",
    body: "Your copies are on your submission page. The fingerprint proves the sealed version.",
    copy: "Submission agreement",
    download: "Download",
    fingerprint: "Fingerprint 9F2C 41A0 7B8E",
    emailed: "Emailed with the signed PDF attached.",
  },
  linkExpired: {
    title: "This link has expired",
    description: "Ask staff for a new link at the counter.",
  },
  alreadySigned: {
    title: "Already signed",
    body: "You signed this document on 13 October. The sealed copy is on your submission page.",
    open: "Open your submission",
  },
  placeholders: {
    title: "Placeholders are shown outside production",
    body: "Text in brackets is not final until Legal and the Owner supply it.",
    registered: "[Custodian registered name]",
    complaints: "[Complaints contact]",
  },
  receipt: {
    intro: "Handed back to you, settled, collected by, where and when.",
    handedTo: "Handed back to",
    collectedBy: "Collected by",
    where: "Where",
    when: "When",
    whenValue: "Tuesday 20 October, 15:00",
    cardsHeader: "What was handed back",
    cards: [
      {
        id: "charizard",
        name: "1999 Charizard, Base Set",
        grade: "PSA 10 GEM MT",
        cert: "cert 12345678",
      },
      {
        id: "blastoise",
        name: "Blastoise, Base Set",
        grade: "PSA 9",
        cert: "cert 23456789",
      },
    ],
    clauses: [
      "The cards listed here are handed back to the person named as collector, against the pickup code.",
      "Balances due at the counter are settled before the cards leave the shop.",
      "Taking the cards confirms the list above, including any card held, vaulted or withdrawn.",
    ],
    footer:
      "The slabs are yours once collected. This receipt records what was handed back.",
    sign: "Sign and collect",
    idMatched: "The ID matched the name",
    nothingKept: "Nothing was kept.",
    collectorNamed: "Chan Siu Ming",
    collector: "Alex Chan",
    namedAs: "Named as the collector on your submission.",
    namedHint: "Printed as drawn until Legal confirms it.",
  },
  receiptStates: {
    cardHeld: {
      title: "One card is still with the grader",
      body: "It comes back on a second hand-back, and this receipt names it.",
    },
    vaulted: {
      title: "One card went to the vault",
      body: "Its vault case is opened on the same visit, and the card is not with you.",
    },
    withdrawn: {
      title: "One card withdrawn",
      body: "Its fee was refunded at the till, against this receipt.",
    },
    paidOut: {
      title: "Paid out for a card not returned",
      body: "HKD 3,500 at its declared value, with its HKD 600 fee refunded the way you paid it.",
    },
  },
} as const;
