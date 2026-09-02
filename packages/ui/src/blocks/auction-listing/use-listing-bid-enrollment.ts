import { useCallback, useMemo, useState } from "react";
import {
  ENROLLMENT_DEMO_SAVED_PAYMENT,
  type ListingBidEnrollmentSnapshot,
  type LinkedPaymentMethod,
} from "./listing-bid-enrollment-snapshots";

type ListingBidEnrollmentSession = {
  signedIn: boolean;
  paymentLinked: boolean;
  hasAccountPayment: boolean;
  hasPlacedBid: boolean;
  bidMode: "manual" | "auto";
  signInOpen: boolean;
  setupOpen: boolean;
  setupRequiresIframeLink: boolean;
  setupChangingPayment: boolean;
  autoConfirmOpen: boolean;
};

type ListingBidEnrollmentActions = {
  setBidMode: (mode: "manual" | "auto") => void;
  setSignInOpen: (open: boolean) => void;
  setSetupOpen: (open: boolean) => void;
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
  setupOpen: false,
  setupRequiresIframeLink: true,
  setupChangingPayment: false,
  autoConfirmOpen: false,
};

function accountLinkedPayment(editable: boolean): LinkedPaymentMethod {
  return {
    ...ENROLLMENT_DEMO_SAVED_PAYMENT,
    editable,
  };
}

function useListingBidEnrollment(listingId = "demo-lot") {
  const [session, setSession] = useState<ListingBidEnrollmentSession>(
    INITIAL_SESSION,
  );
  const [autoBidIntroAcknowledgedListingIds, setAutoBidIntroAcknowledgedListingIds] =
    useState<ReadonlySet<string>>(() => new Set());

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

  const setSetupOpen = useCallback((setupOpen: boolean) => {
    setSession((current) => ({
      ...current,
      setupOpen,
      setupChangingPayment: setupOpen ? current.setupChangingPayment : false,
      setupRequiresIframeLink: setupOpen ? current.setupRequiresIframeLink : true,
    }));
  }, []);

  const setAutoConfirmOpen = useCallback((autoConfirmOpen: boolean) => {
    setSession((current) => ({ ...current, autoConfirmOpen }));
  }, []);

  const openSetup = useCallback(() => {
    setSession((current) => ({
      ...current,
      setupOpen: true,
      setupChangingPayment: false,
      setupRequiresIframeLink: !current.hasAccountPayment,
    }));
  }, []);

  const openChangePayment = useCallback(() => {
    setSession((current) => ({
      ...current,
      setupOpen: true,
      setupChangingPayment: true,
      setupRequiresIframeLink: true,
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
          setupOpen: true,
          setupChangingPayment: false,
          setupRequiresIframeLink: !current.hasAccountPayment,
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
      setupOpen: true,
      setupChangingPayment: false,
      setupRequiresIframeLink: !current.hasAccountPayment,
    }));
  }, []);

  const handleSetupContinue = useCallback(() => {
    setSession((current) => ({
      ...current,
      paymentLinked: true,
      setupOpen: false,
      setupChangingPayment: false,
      setupRequiresIframeLink: true,
    }));
  }, []);

  const snapshot = useMemo((): ListingBidEnrollmentSnapshot => {
    return {
      bidMode: session.bidMode,
      submitUsesSignInLabel: !session.signedIn,
      fixtureState: !session.signedIn ? "live-manual" : undefined,
      paymentEmptyState:
        needsSetup && !session.setupOpen ? true : undefined,
      linkedPaymentMethod: ready
        ? accountLinkedPayment(!session.hasPlacedBid)
        : undefined,
      setupSheet: session.setupOpen
        ? {
            requiresIframeLink: session.setupRequiresIframeLink,
            iframeLinkedPayment: session.setupChangingPayment
              ? ENROLLMENT_DEMO_SAVED_PAYMENT
              : undefined,
            defaultAgeAttested: session.setupChangingPayment || undefined,
          }
        : undefined,
    };
  }, [needsSetup, ready, session]);

  return {
    session,
    actions: {
      setBidMode,
      setSignInOpen,
      setSetupOpen,
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
