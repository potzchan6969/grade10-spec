import type { ListingAuctionBidView } from "@grade10/ui";
import type { BiddingState } from "./listing-auction-bid-fixtures";

export type EnrollmentPaymentMethod = {
  brand: "visa";
  maskedNumber: string;
};

export type LinkedPaymentMethod = EnrollmentPaymentMethod & {
  /** False after the collector's first bid on this listing. */
  editable: boolean;
};

export type BidAuthorizationSnapshot = {
  status: "pending" | "error";
  message?: string;
};

export const ENROLLMENT_DEMO_SAVED_PAYMENT: EnrollmentPaymentMethod = {
  brand: "visa",
  maskedNumber: "•••• 4242",
};

export type ListingBidEnrollmentSnapshot = {
  /** Override place/confirm button via sidebar copy */
  submitUsesSignInLabel: boolean;
  /** No linked card — amount controls disabled; Link a card to bid CTA. */
  needsCard?: boolean;
  /** Fixture lot state for bid card view and recent-bids history. */
  fixtureState?: BiddingState;
  /** No account card on file — show the empty linked-card slot. */
  paymentEmptyState?: boolean;
  linkedPaymentMethod?: LinkedPaymentMethod;
  /** Rendering this state opens the link-card setup dialog. */
  paymentSetup?: {
    requiresIframeLink?: boolean;
    /** Stripe iframe prefilled with an account card (change-card flow). */
    iframeLinkedPayment?: EnrollmentPaymentMethod;
    /** Age attestation already given on a prior lot. */
    defaultAgeAttested?: boolean;
    /** Link/continue error shown under the provider card field. */
    errorMessage?: string;
    /** Provider link in flight — locks the sheet and shows the linking CTA. */
    linking?: boolean;
  };
  /** Silent authorize-on-commit status on the bid CTA. */
  bidAuthorization?: BidAuthorizationSnapshot;
  signInOpen?: boolean;
  viewOverride?: Partial<ListingAuctionBidView>;
};

export const ENROLLMENT_SNAPSHOT_SIGNED_OUT: ListingBidEnrollmentSnapshot = {
  submitUsesSignInLabel: true,
  fixtureState: "live-manual",
};

export const ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT: ListingBidEnrollmentSnapshot = {
  submitUsesSignInLabel: false,
  needsCard: true,
  paymentEmptyState: true,
};

export const ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
  };

export const ENROLLMENT_SNAPSHOT_LINKED_CARD: ListingBidEnrollmentSnapshot = {
  submitUsesSignInLabel: false,
  linkedPaymentMethod: {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable: false,
  },
};

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET: ListingBidEnrollmentSnapshot = {
  submitUsesSignInLabel: false,
  needsCard: true,
  paymentEmptyState: true,
  paymentSetup: { requiresIframeLink: true },
};

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
    paymentSetup: {
      requiresIframeLink: true,
      iframeLinkedPayment: ENROLLMENT_DEMO_SAVED_PAYMENT,
      defaultAgeAttested: true,
    },
  };

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_ERROR: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
    paymentSetup: {
      requiresIframeLink: true,
      iframeLinkedPayment: ENROLLMENT_DEMO_SAVED_PAYMENT,
      defaultAgeAttested: true,
      errorMessage:
        "Could not link that card. Check the details and try again.",
    },
  };

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_LINKING: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    needsCard: true,
    paymentEmptyState: true,
    paymentSetup: {
      requiresIframeLink: true,
      iframeLinkedPayment: ENROLLMENT_DEMO_SAVED_PAYMENT,
      defaultAgeAttested: true,
      linking: true,
    },
  };

export const ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
    bidAuthorization: { status: "pending" },
  };

export const ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED: ListingBidEnrollmentSnapshot =
  {
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
    bidAuthorization: {
      status: "error",
      message: "Your card could not be authorized. Try another card.",
    },
  };

export const ENROLLMENT_SNAPSHOT_READY: ListingBidEnrollmentSnapshot = {
  submitUsesSignInLabel: false,
  linkedPaymentMethod: {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable: false,
  },
};

export const LISTING_BID_ENROLLMENT_SNAPSHOTS = {
  signedOut: ENROLLMENT_SNAPSHOT_SIGNED_OUT,
  needsPayment: ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  linkedCardEditable: ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
  linkedCard: ENROLLMENT_SNAPSHOT_LINKED_CARD,
  setupSheet: ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  setupSheetFromChange: ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  setupSheetError: ENROLLMENT_SNAPSHOT_SETUP_SHEET_ERROR,
  setupSheetLinking: ENROLLMENT_SNAPSHOT_SETUP_SHEET_LINKING,
  paymentAuthorizationPending:
    ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_PENDING,
  paymentAuthorizationRefused:
    ENROLLMENT_SNAPSHOT_PAYMENT_AUTHORIZATION_REFUSED,
  ready: ENROLLMENT_SNAPSHOT_READY,
} as const;
