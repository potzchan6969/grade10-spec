import type { BiddingState } from "./listing-auction-bid-fixtures";
import type { ListingAuctionBidView } from "./types";

export type EnrollmentPaymentMethod = {
  brand: "visa";
  maskedNumber: string;
};

export type LinkedPaymentMethod = EnrollmentPaymentMethod & {
  /** False after the collector's first bid on this listing. */
  editable: boolean;
};

export const ENROLLMENT_DEMO_SAVED_PAYMENT: EnrollmentPaymentMethod = {
  brand: "visa",
  maskedNumber: "•••• 4242",
};

export type ListingBidEnrollmentSnapshot = {
  bidMode: "manual" | "auto";
  /** Override place/confirm button via sidebar copy */
  submitUsesSignInLabel: boolean;
  /** Fixture lot state for bid card view and recent-bids history. */
  fixtureState?: BiddingState;
  /** No account card on file — show the empty linked-card slot. */
  paymentEmptyState?: boolean;
  linkedPaymentMethod?: LinkedPaymentMethod;
  setupSheet?: {
    requiresIframeLink?: boolean;
    /** Stripe iframe prefilled with an account card (change-card flow). */
    iframeLinkedPayment?: EnrollmentPaymentMethod;
    /** Age attestation already given on a prior lot. */
    defaultAgeAttested?: boolean;
  };
  signInOpen?: boolean;
  autoConfirmOpen?: boolean;
  staleFloor?: boolean;
  viewOverride?: Partial<ListingAuctionBidView>;
};

export const ENROLLMENT_SNAPSHOT_SIGNED_OUT: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: true,
  fixtureState: "live-manual",
};

export const ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  paymentEmptyState: true,
};

export const ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE: ListingBidEnrollmentSnapshot =
  {
    bidMode: "manual",
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
  };

export const ENROLLMENT_SNAPSHOT_LINKED_CARD: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  linkedPaymentMethod: {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable: false,
  },
};

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  setupSheet: { requiresIframeLink: true },
};

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE: ListingBidEnrollmentSnapshot =
  {
    bidMode: "manual",
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: true,
    },
    setupSheet: {
      requiresIframeLink: true,
      iframeLinkedPayment: ENROLLMENT_DEMO_SAVED_PAYMENT,
      defaultAgeAttested: true,
    },
  };

export const ENROLLMENT_SNAPSHOT_READY: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  linkedPaymentMethod: {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable: false,
  },
};

export const ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM: ListingBidEnrollmentSnapshot =
  {
    bidMode: "auto",
    submitUsesSignInLabel: false,
    linkedPaymentMethod: {
      ...ENROLLMENT_DEMO_SAVED_PAYMENT,
      editable: false,
    },
    autoConfirmOpen: true,
  };

export const LISTING_BID_ENROLLMENT_SNAPSHOTS = {
  signedOut: ENROLLMENT_SNAPSHOT_SIGNED_OUT,
  needsPayment: ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  linkedCardEditable: ENROLLMENT_SNAPSHOT_LINKED_CARD_EDITABLE,
  linkedCard: ENROLLMENT_SNAPSHOT_LINKED_CARD,
  setupSheet: ENROLLMENT_SNAPSHOT_SETUP_SHEET,
  setupSheetFromChange: ENROLLMENT_SNAPSHOT_SETUP_SHEET_FROM_CHANGE,
  ready: ENROLLMENT_SNAPSHOT_READY,
  autoBidConfirm: ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
} as const;
