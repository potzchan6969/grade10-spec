/** A surface whose whole content is a legal document. */
type LegalSurface = "terms" | "privacy";

type LegalSection = {
  readonly id: string;
  readonly heading: string;
  /** Lead paragraph; omit when the section is only a list. */
  readonly body?: string;
  /** Bullet lines under the heading (and after `body` when both are set). */
  readonly items?: readonly string[];
};

type LegalDocument = {
  readonly title: string;
  readonly lastUpdatedLabel: string;
  readonly lastUpdatedDate: string;
  readonly sections: readonly LegalSection[];
};

/**
 * Auction-launch draft copy for Storybook review only. Live catalogs stay
 * “Being prepared” until wording is confirmed; this fixture is not the
 * `@grade10/i18n` `legal` namespace.
 */
const TERMS_DOCUMENT: LegalDocument = {
  title: "Terms of Service",
  lastUpdatedLabel: "Last updated on",
  lastUpdatedDate: "September 24, 2026",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance",
      body: "These Terms of Service (“Terms”) govern your use of this site and its auction surfaces. By browsing, signing in, watching a lot, placing a bid, or confirming a winner order, you agree to these Terms. If you do not agree, do not use the site.",
    },
    {
      id: "eligibility",
      heading: "Eligibility",
      body: "You must be at least 18 years old, or the age of majority where you live if that is higher, to create an account or bid. By using the site you confirm that you meet this requirement and that you can form a binding contract.",
    },
    {
      id: "accounts",
      heading: "Accounts",
      body: "You sign in with an emailed link or, where the brand enables it, a verified Google address. The first successful sign-in for an email creates the account. You are responsible for activity under your account and for keeping access to that email (and Google account, where used) secure. Tell us promptly if you believe someone else used your account.",
    },
    {
      id: "auctions",
      heading: "Auctions",
      body: "Published lots may be browsed without an account. Bidding, watching with alerts, and winner checkout need a signed-in account. Each lot is an absolute auction: there is no reserve and no buy-now price. The highest accepted bid at the recorded close wins the lot. Listing facts — currency, fee terms, region, and deadlines — are fixed when bidding opens for that lot.",
    },
    {
      id: "bidding",
      heading: "Bidding",
      body: "Bids must follow the lot’s increment schedule and any ceiling stated for its currency. A listing may use extended bidding: after the scheduled close, each accepted bid can restart a timer until no new bid arrives within the extension window, subject to any cap on that listing. Auto-bidding lets you name a maximum; we bid only as far as needed for you to lead, and a leading maximum is never shown to other collectors. You may raise a maximum; you may not lower it. A bid at or above the verified-identity bar needs a verified identity before it is taken.",
    },
    {
      id: "winningAndPayment",
      heading: "Winning and payment",
      body: "If you win, you receive an order for that lot. You must confirm delivery address, payment method, and billing address within the setup window stated on the order (48 hours from the win notice unless the order says otherwise). After the invoice is issued, you must pay within 7 calendar days of that issue, by card or bank transfer as offered on the order. Unpaid or incomplete orders may expire, be reissued, settled, or cancelled under the rules on the order and in our auction notices. Bid-time card holds, when used, are released at close; the winner pays through the invoice, not by capture of a bid-time hold.",
    },
    {
      id: "displayAndIdentity",
      heading: "Public display and identity",
      body: "On public auction surfaces, other collectors see bidder labels such as “Bidder 4”, not your name or email. We may ask for a verified identity for high bids and for fulfilment. Identity checks and how long we keep them are described in the Privacy Policy.",
    },
    {
      id: "conduct",
      heading: "Conduct and suspension",
      body: "Do not manipulate bidding, use automated tools to place or raise bids, interfere with other collectors, or misuse payment or identity flows. We may suspend auction bidding on an account, cancel or refuse bids, or close access where we reasonably believe these Terms or the law have been broken, or to protect the integrity of a sale.",
    },
    {
      id: "descriptions",
      heading: "Lot descriptions",
      body: "We describe lots in good faith from the information available to us. Graded cards are sold as described on the listing. Inspect the listing, grade, and images before you bid. Except where the law requires otherwise, lots are sold as listed once bidding has opened.",
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, or consequential loss arising from your use of the site or from bidding, including loss of chance on a lot, profits, or data. Our total liability for a claim relating to a lot is limited to the amount you paid us for that lot’s order, or zero if you paid nothing.",
    },
    {
      id: "changes",
      heading: "Changes",
      body: "We may update these Terms. The “Last updated on” date at the top of this page is when the current version took effect. Continued use after that date means you accept the updated Terms. Material changes to how auctions run may also be called out on the relevant lot or in account notices.",
    },
    {
      id: "governingLaw",
      heading: "Governing law",
      body: "These Terms are governed by the laws of the Hong Kong Special Administrative Region. Courts in Hong Kong have exclusive jurisdiction over disputes arising from these Terms, subject to any mandatory consumer protections that apply where you live.",
    },
    {
      id: "contact",
      heading: "Contact",
      body: "Questions about these Terms: use the Contact link in the site footer, or the contact option on your auction order where one is shown.",
    },
  ],
};

const PRIVACY_DOCUMENT: LegalDocument = {
  title: "Privacy Policy",
  lastUpdatedLabel: "Last updated on",
  lastUpdatedDate: "September 24, 2026",
  sections: [
    {
      id: "scope",
      heading: "Scope",
      body: "This Privacy Policy explains what we collect when you use this site’s account, auction, and related surfaces available at launch, why we use it, and what you can ask us to do with it. Other products (for example the store or vault) may collect more when they open; we will update this page when they do.",
    },
    {
      id: "collection",
      heading: "What we collect",
      items: [
        "Account — email address; Google account identifiers and basic profile fields when you sign in with Google",
        "Auction — bids and maxima, watchlist choices, notification preferences, lot activity, and winner-order details (delivery and billing addresses, payment method choice, payment status, and bank-transfer proof metadata when you upload proof)",
        "Identity — when a high bid or fulfilment needs verification, the identity fields and documents described in that flow",
        "Technical — device and browser type, approximate location from IP, and logs needed to run and secure the service",
      ],
      body: "We do not ask for a password; sign-in uses an emailed link or Google.",
    },
    {
      id: "use",
      heading: "How we use it",
      body: "We use this information to run auctions and accounts, accept and rank bids, send auction and order email, issue invoices and confirm payment, deliver won lots, verify identity where required, prevent fraud and abuse, measure site reliability, and meet legal and accounting duties.",
    },
    {
      id: "sharing",
      heading: "Sharing",
      body: "We do not sell your personal information. We share it only as needed to operate the service: payment processors for card charges and refunds; email delivery for sign-in and auction notices; hosting, database, and security providers; shipping or fulfilment partners when a won lot ships; and authorities when the law requires it. Other collectors do not see your name or email on public bid displays.",
    },
    {
      id: "processors",
      heading: "Where it is processed",
      body: "Application and database hosting for this service is run in the Asia-Pacific region (ap-southeast-1). Some vendors (for example analytics or monitoring) may process limited operational data in other regions under contracts that restrict how they use it. Payment data is handled by the payment provider under its own terms.",
    },
    {
      id: "retention",
      heading: "Retention",
      body: "We keep account and auction records while your account is active and for as long afterward as we need for disputes, accounting, tax, and legal holds. Identity documents follow the retention windows stated in that verification flow. You may ask us to erase personal data that is no longer required; some records must stay for legal reasons even after an erasure request.",
    },
    {
      id: "security",
      heading: "Security",
      body: "We use industry-standard safeguards such as encrypted transport, access controls, and monitoring. No method of transmission or storage is perfectly secure. Contact us if you suspect unauthorized use of your account.",
    },
    {
      id: "children",
      heading: "Children",
      body: "The site is not directed at anyone under 18. We do not knowingly collect personal information from minors. If you believe we have, contact us and we will delete it.",
    },
    {
      id: "rights",
      heading: "Your rights",
      body: "Depending on where you live, you may have rights to access, correct, or delete personal data, or to object to certain processing. To exercise these rights, use the Contact link in the site footer. We may need to verify it is you before we act.",
    },
    {
      id: "changes",
      heading: "Changes",
      body: "We may update this Privacy Policy. The “Last updated on” date at the top of this page is when the current version took effect. We will post the new version here; for material changes we may also email the address on your account.",
    },
    {
      id: "contact",
      heading: "Contact",
      body: "Questions about privacy: use the Contact link in the site footer.",
    },
  ],
};

export type { LegalDocument, LegalSection, LegalSurface };
export { PRIVACY_DOCUMENT, TERMS_DOCUMENT };
