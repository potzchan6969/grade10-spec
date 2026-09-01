import type { ListingAuctionBidView } from "./types";
import type { SetupSheetStep } from "./listing-bid-enrollment-prototypes";

export type ListingBidEnrollmentSnapshot = {
  bidMode: "manual" | "auto";
  /** Override place/confirm button via sidebar copy */
  submitUsesSignInLabel: boolean;
  setupBanner?: "age";
  paymentEmptyState?: boolean;
  paymentMethod?: { brand: "visa"; maskedNumber: string };
  setupSheet?: {
    steps: readonly SetupSheetStep[];
    stepIndex: number;
    showIframe?: boolean;
  };
  signInOpen?: boolean;
  autoConfirmOpen?: boolean;
  staleFloor?: boolean;
  viewOverride?: Partial<ListingAuctionBidView>;
};

export const ENROLLMENT_SNAPSHOT_SIGNED_OUT: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: true,
};

export const ENROLLMENT_SNAPSHOT_NEEDS_AGE: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  setupBanner: "age",
};

export const ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  paymentEmptyState: true,
};

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_AGE: ListingBidEnrollmentSnapshot =
  {
    bidMode: "manual",
    submitUsesSignInLabel: false,
    setupSheet: { steps: ["age", "payment"], stepIndex: 0 },
  };

export const ENROLLMENT_SNAPSHOT_SETUP_SHEET_PAYMENT: ListingBidEnrollmentSnapshot =
  {
    bidMode: "manual",
    submitUsesSignInLabel: false,
    setupSheet: { steps: ["payment"], stepIndex: 0, showIframe: true },
  };

export const ENROLLMENT_SNAPSHOT_READY: ListingBidEnrollmentSnapshot = {
  bidMode: "manual",
  submitUsesSignInLabel: false,
  paymentMethod: { brand: "visa", maskedNumber: "•••• 4242" },
};

export const ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM: ListingBidEnrollmentSnapshot =
  {
    bidMode: "auto",
    submitUsesSignInLabel: false,
    paymentMethod: { brand: "visa", maskedNumber: "•••• 4242" },
    autoConfirmOpen: true,
  };

export const LISTING_BID_ENROLLMENT_SNAPSHOTS = {
  signedOut: ENROLLMENT_SNAPSHOT_SIGNED_OUT,
  needsAge: ENROLLMENT_SNAPSHOT_NEEDS_AGE,
  needsPayment: ENROLLMENT_SNAPSHOT_NEEDS_PAYMENT,
  setupSheetAge: ENROLLMENT_SNAPSHOT_SETUP_SHEET_AGE,
  setupSheetPayment: ENROLLMENT_SNAPSHOT_SETUP_SHEET_PAYMENT,
  ready: ENROLLMENT_SNAPSHOT_READY,
  autoBidConfirm: ENROLLMENT_SNAPSHOT_AUTO_BID_CONFIRM,
} as const;
