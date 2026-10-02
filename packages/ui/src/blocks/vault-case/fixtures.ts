import { OFFER_ACCEPT, OFFER_TOTAL } from "../page-blocks/fixtures";
import type { VaultAcceptOfferDialogCopy } from "./vault-accept-offer-dialog";
import type { VaultCasesCard, VaultCasesCopy } from "./vault-cases";
import type { VaultCasesEmptyCopy } from "./vault-cases-empty";
export const ACCEPT_COPY: VaultAcceptOfferDialogCopy = {
  title: OFFER_ACCEPT,
  lead: "You accept HK$8,000.00 over 30 days at 6% for the term. We prepare the papers for your visit.",
  total: OFFER_TOTAL,
  lateDay:
    "If you are late, interest keeps running at HK$16.00 a day on what is still outstanding.",
  signs: "Sign the loan and custody agreements.",
  goBack: "Go Back",
  accept: OFFER_ACCEPT,
};

export const REFUSAL =
  "This offer ran out. Read the page again for what stands now.";

export const EMPTY_COPY: VaultCasesEmptyCopy = {
  intro:
    "See every item you have asked us to hold, and start another whenever you like.",
  start: "Start a Request",
  howItWorks: "How it works",
  steps: [
    {
      id: "describe",
      title: "Describe the item",
      body: "A few details and some photographs. No visit needed yet.",
    },
    {
      id: "visit",
      title: "Book a visit and bring it in",
      body: "We value it at the counter and come back with what we can offer.",
    },
    {
      id: "agree",
      title: "Agree what happens next",
      body: "Take the loan or leave it in storage. Either way, you sign once.",
    },
    {
      id: "collect",
      title: "Collect it whenever you are ready",
      body: "Repay in full, or just come back for the item. It is yours until then.",
    },
  ],
  emptyTitle: "Nothing here yet",
  emptyBody: "Start a request and we will take it from there.",
  draftCap: "Up to 3 unsent requests at a time.",
};

export const CASES_COPY: VaultCasesCopy = {
  start: "Start a request",
  yourCases: "Your cases",
  severalItems:
    "Several items? Send one request per item and book one visit on the first; bring them all together.",
};

const OPENED = "Opened 26 Oct 2026";
const WITH_A_LOAN = "With a loan";
const STORAGE_ONLY = "Storage only";

/** One card per state the list reads, worded as the site words them. */
export const CASE_CARDS = {
  offerWaiting: {
    id: "case-offer",
    title: "Charizard Holo, Base Set 4/102, PSA 10",
    status: { label: "Offer waiting for you", tone: "brand" },
    owner: { label: "Waiting on you", tone: "brand", icon: "person" },
    facts: [OPENED, WITH_A_LOAN, "Asked for HK$40,000.00"],
    reference: "FQ4T6N",
    next: { label: "Answer by 3 Nov 2026, 23:59", tone: "primary" },
    visit: "Visit booked for 30 Oct 2026, 14:30",
    note: null,
  },
  visitBooked: {
    id: "case-visit",
    title: "Pikachu Illustrator, PSA 7",
    status: { label: "Request sent", tone: "info" },
    owner: { label: "With us", tone: "info", icon: "vault" },
    facts: [OPENED, STORAGE_ONLY],
    reference: "K7M2QD",
    next: null,
    visit: "Visit booked for 30 Oct 2026, 11:00",
    note: null,
  },
  termsAgreed: {
    id: "case-terms",
    title: "Mewtwo Holo, Base Set 10/102, PSA 9",
    status: { label: "Terms agreed", tone: "success" },
    owner: { label: "Visit 30 Oct 2026", tone: "brand", icon: "calendar" },
    facts: [OPENED, WITH_A_LOAN, "Asked for HK$12,000.00"],
    reference: "T3RW8B",
    next: null,
    visit: null,
    note: null,
  },
  inTheVault: {
    id: "case-vault",
    title: "Blastoise Holo, Base Set 2/102, PSA 9",
    status: { label: "In the vault", tone: "success" },
    owner: { label: "With us since 24 Oct 2026", tone: "info", icon: "vault" },
    facts: ["Opened 20 Oct 2026", STORAGE_ONLY],
    reference: "CYPEWK",
    next: null,
    visit: null,
    note: null,
  },
  loanRunning: {
    id: "case-loan",
    title: "Lugia Holo, Neo Genesis 9/111, PSA 10",
    status: { label: "Loan running", tone: "info" },
    owner: { label: "Due 24 Dec 2026", tone: "warning", icon: "clock" },
    facts: ["Opened 2 Oct 2026", WITH_A_LOAN, "Asked for HK$20,000.00"],
    reference: "H8NV4X",
    next: null,
    visit: "In the vault since 24 Oct 2026",
    note: null,
  },
  pastDue: {
    id: "case-late",
    title: "Ho-Oh Holo, Neo Revelation 7/64, PSA 9",
    status: { label: "Loan running", tone: "info" },
    owner: { label: "3 days past due", tone: "error", icon: "warning" },
    facts: ["Opened 2 Sept 2026", WITH_A_LOAN, "Asked for HK$9,000.00"],
    reference: "P2DX9R",
    next: null,
    visit: "In the vault since 10 Sept 2026",
    note: null,
  },
  repaid: {
    id: "case-repaid",
    title: "Gengar Holo, Fossil 5/62, PSA 10",
    status: { label: "Repaid", tone: "success" },
    owner: { label: "Settled 20 Oct 2026", tone: "success", icon: "check" },
    facts: ["Opened 1 Aug 2026", WITH_A_LOAN, "Asked for HK$6,000.00"],
    reference: "R6SJ3A",
    next: null,
    visit: "In the vault since 8 Aug 2026",
    note: null,
  },
  backWithYou: {
    id: "case-home",
    title: "Snorlax, Jungle 11/64, PSA 8",
    status: { label: "Back with you", tone: "default" },
    owner: { label: "Collected 22 Oct 2026", tone: "success", icon: "check" },
    facts: ["Opened 3 Jul 2026", STORAGE_ONLY],
    reference: "W9BQ5E",
    next: null,
    visit: null,
    note: null,
  },
  draft: {
    id: "case-draft",
    title: "Venusaur Holo, Base Set 15/102, PSA 9",
    status: { label: "Not sent yet", tone: "default" },
    owner: { label: "With you", tone: "brand", icon: "person" },
    facts: ["Opened 2 Oct 2026", STORAGE_ONLY],
    reference: "V4GH7N",
    next: { label: "Add photographs to finish this request.", tone: "neutral" },
    visit: null,
    note: null,
  },
  walkInDraft: {
    id: "case-walk-in",
    title: "1952 Topps Mantle, PSA 5",
    status: { label: "Not sent yet", tone: "default" },
    owner: { label: "With you", tone: "brand", icon: "person" },
    facts: ["Opened 2 Oct 2026", STORAGE_ONLY],
    reference: "A9EW9U",
    next: {
      label:
        "Opened for you at the counter — check it and send it when you are ready.",
      tone: "neutral",
    },
    visit: null,
    note: null,
  },
  ended: {
    id: "case-declined",
    title: "Dragonite Holo, Fossil 4/62, PSA 6",
    status: { label: "Declined", tone: "default" },
    owner: { label: "Closed 21 Oct 2026", tone: "default" },
    facts: ["Opened 12 Oct 2026", WITH_A_LOAN, "Asked for HK$3,000.00"],
    reference: "D5LK2M",
    next: null,
    visit: null,
    note: "The grade on the slab does not match its certificate.",
  },
  untitled: {
    id: "case-untitled",
    title: "Your item",
    status: { label: "Not sent yet", tone: "default" },
    owner: { label: "With you", tone: "brand", icon: "person" },
    facts: ["Opened 2 Oct 2026", STORAGE_ONLY],
    reference: "U3ZC8F",
    next: { label: "Add photographs to finish this request.", tone: "neutral" },
    visit: null,
    note: null,
  },
} as const satisfies Record<string, VaultCasesCard>;

/** The board's home: an offer waiting, an item in the vault, a draft. */
export const BOARD_CASES: readonly VaultCasesCard[] = [
  CASE_CARDS.offerWaiting,
  CASE_CARDS.inTheVault,
  CASE_CARDS.draft,
];
