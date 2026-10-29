export const DOCUMENTS_AND_SIGNING_MANUAL_PATH = "vault/documents-and-signing";

/** Draft words for the signing ceremony on the shop's iPad, staff present. The documents are named as the PRD names them. */
export const SIGNING_COPY = {
  title: "Your papers",
  packetTitle: "Documents to sign",
  packetRowsLabel: "The documents in this packet",
  packetLead:
    "Read every page first. Each one names your case and its reference.",
  consent: "I have read these documents and agree to sign them electronically.",
  name: "Type your full name, as it is on your ID",
  sign: "Sign the documents",
  decline: "I would rather not sign on screen",
  refuseTitle: "Nothing signed",
  refuseLead:
    "You declined to sign on screen. Nothing at all is signed in your name, and the member of staff with you will take it from there.",
  signedTitle: "Signed",
  signedLead: "Signed on 13 October 2026 at 14:05 HKT.",
  downloadTitle: "Your signed documents",
  downloadLead:
    "Every signed document from your cases, each with its fingerprint.",
  downloadAll: "Download all 3 documents",
  downloadNote: "One file, with every case you hold.",
};

export const SIGNED_DOCUMENTS = [
  {
    name: "Custody agreement",
    case: "1999 Charizard · K7HQ4R",
    fingerprint: "9c41 0e7a 5b2d 77f0",
  },
  {
    name: "Loan agreement",
    case: "1999 Charizard · K7HQ4R",
    fingerprint: "a2d8 6f13 c90e 4b5a",
  },
  {
    name: "Custody agreement",
    case: "Blastoise, Base Set · M3WP9T",
    fingerprint: "7e0b 3c91 f2a6 d418",
  },
] as const;
