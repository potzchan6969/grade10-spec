import { useCallback, useMemo, useState } from "react";
import {
  ENROLLMENT_DEMO_SAVED_PAYMENT,
  type LinkedPaymentMethod,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";

type ListingBidEnrollmentSession = {
  signedIn: boolean;
  paymentLinked: boolean;
  hasAccountPayment: boolean;
  hasPlacedBid: boolean;
  bidMode: "manual" | "auto";
  signInOpen: boolean;
  paymentSetup: "none" | "required" | "change-required";
  autoConfirmOpen: boolean;
};

type ListingBidEnrollmentActions = {
  setBidMode: (mode: "manual" | "auto") => void;
  setSignInOpen: (open: boolean) => void;
  dismissPaymentSetup: () => void;
  setAutoConfirmOpen: (open: boolean) => void;
  confirmAutoBidIntro: () => void;
  reset: () => void;
  handleBidSubmit: () => void;
  completeSignIn: () => void;
  handleSetupContinue: () => void;
  openSetup: () => void;
  openChangePayment: () => void;
};

type UseListingBidEnrollmentResult = {
  session: ListingBidEnrollmentSession;
  actions: ListingBidEnrollmentActions;
  needsSetup: boolean;
  ready: boolean;
  snapshot: ListingBidEnrollmentSnapshot;
};

const INITIAL_SESSION: ListingBidEnrollmentSession = {
  signedIn: false,
  paymentLinked: false,
  hasAccountPayment: true,
  hasPlacedBid: false,
  bidMode: "manual",
  signInOpen: false,
  paymentSetup: "none",
  autoConfirmOpen: false,
};

function accountLinkedPayment(editable: boolean): LinkedPaymentMethod {
  return {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable,
  };
}

function useListingBidEnrollment(
  listingId = "demo-lot",
  initialSession: Partial<ListingBidEnrollmentSession> = {},
) {
  const [session, setSession] = useState<ListingBidEnrollmentSession>(() => ({
    ...INITIAL_SESSION,
    ...initialSession,
  }));
  const [
    autoBidIntroAcknowledgedListingIds,
    setAutoBidIntroAcknowledgedListingIds,
  ] = useState<ReadonlySet<string>>(() => new Set());

  const needsSetup = session.signedIn && !session.paymentLinked;
  const ready = session.signedIn && session.paymentLinked;

  const reset = useCallback(() => {
    setSession(INITIAL_SESSION);
    setAutoBidIntroAcknowledgedListingIds(new Set());
  }, []);

  const confirmAutoBidIntro = useCallback(() => {
    setAutoBidIntroAcknowledgedListingIds((current) => {
      const next = new Set(current);
      next.add(listingId);
      return next;
    });
    setSession((current) => ({ ...current, hasPlacedBid: true }));
  }, [listingId]);

  const setBidMode = useCallback((bidMode: "manual" | "auto") => {
    setSession((current) => ({ ...current, bidMode }));
  }, []);

  const setSignInOpen = useCallback((signInOpen: boolean) => {
    setSession((current) => ({ ...current, signInOpen }));
  }, []);

  const dismissPaymentSetup = useCallback(() => {
    setSession((current) => ({
      ...current,
      paymentSetup: "none",
    }));
  }, []);

  const setAutoConfirmOpen = useCallback((autoConfirmOpen: boolean) => {
    setSession((current) => ({ ...current, autoConfirmOpen }));
  }, []);

  const openSetup = useCallback(() => {
    setSession((current) => ({
      ...current,
      paymentSetup: "required",
    }));
  }, []);

  const openChangePayment = useCallback(() => {
    setSession((current) => ({
      ...current,
      paymentSetup: "change-required",
    }));
  }, []);

  const handleBidSubmit = useCallback(() => {
    setSession((current) => {
      if (!current.signedIn) {
        return { ...current, signInOpen: true };
      }
      if (current.signedIn && !current.paymentLinked) {
        return {
          ...current,
          paymentSetup: "required",
        };
      }
      if (
        current.bidMode === "auto" &&
        current.paymentLinked &&
        !autoBidIntroAcknowledgedListingIds.has(listingId)
      ) {
        return { ...current, autoConfirmOpen: true };
      }
      if (current.paymentLinked) {
        return { ...current, hasPlacedBid: true };
      }
      return current;
    });
  }, [autoBidIntroAcknowledgedListingIds, listingId]);

  const completeSignIn = useCallback(() => {
    setSession((current) => ({
      ...current,
      signedIn: true,
      signInOpen: false,
      paymentSetup: "required",
    }));
  }, []);

  const handleSetupContinue = useCallback(() => {
    setSession((current) => ({
      ...current,
      paymentLinked: true,
      paymentSetup: "none",
    }));
  }, []);

  const snapshot = useMemo((): ListingBidEnrollmentSnapshot => {
    return {
      bidMode: session.bidMode,
      submitUsesSignInLabel: !session.signedIn,
      fixtureState: !session.signedIn ? "live-manual" : undefined,
      paymentEmptyState:
        needsSetup && session.paymentSetup === "none" ? true : undefined,
      linkedPaymentMethod: ready
        ? accountLinkedPayment(!session.hasPlacedBid)
        : undefined,
      paymentSetup: session.paymentSetup !== "none"
        ? {
            requiresIframeLink:
              session.paymentSetup === "change-required" ||
              !session.hasAccountPayment,
            iframeLinkedPayment:
              session.paymentSetup === "change-required"
              ? ENROLLMENT_DEMO_SAVED_PAYMENT
              : undefined,
            defaultAgeAttested:
              session.paymentSetup === "change-required" || undefined,
          }
        : undefined,
    };
  }, [needsSetup, ready, session]);

  return {
    session,
    actions: {
      setBidMode,
      setSignInOpen,
      dismissPaymentSetup,
      setAutoConfirmOpen,
      confirmAutoBidIntro,
      reset,
      handleBidSubmit,
      completeSignIn,
      handleSetupContinue,
      openSetup,
      openChangePayment,
    },
    needsSetup,
    ready,
    snapshot,
  };
}

export type {
  ListingBidEnrollmentActions,
  ListingBidEnrollmentSession,
  UseListingBidEnrollmentResult,
};
export { useListingBidEnrollment };
