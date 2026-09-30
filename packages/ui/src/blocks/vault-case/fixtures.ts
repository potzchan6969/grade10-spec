import { OFFER_ACCEPT, OFFER_TOTAL } from "../page-blocks/fixtures";
import type { VaultAcceptOfferDialogCopy } from "./vault-accept-offer-dialog";
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
