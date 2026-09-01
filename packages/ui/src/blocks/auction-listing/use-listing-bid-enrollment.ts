import { useCallback, useMemo, useState } from "react";
import type { SetupSheetStep } from "./listing-bid-enrollment-prototypes";
import type { ListingBidEnrollmentSnapshot } from "./listing-bid-enrollment-snapshots";

type ListingBidEnrollmentSession = {
  signedIn: boolean;
  ageVerified: boolean;
  paymentLinked: boolean;
  bidMode: "manual" | "auto";
  signInOpen: boolean;
  setupOpen: boolean;
  setupStepIndex: number;
  autoConfirmOpen: boolean;
};

type ListingBidEnrollmentActions = {
  setBidMode: (mode: "manual" | "auto") => void;
  setSignInOpen: (open: boolean) => void;
  setSetupOpen: (open: boolean) => void;
  setSetupStepIndex: (index: number) => void;
  setAutoConfirmOpen: (open: boolean) => void;
  confirmAutoBidIntro: () => void;
  reset: () => void;
  pretendAgeVerifiedElsewhere: () => void;
  handleBidSubmit: () => void;
  completeSignIn: () => void;
  handleSetupContinue: () => void;
  openSetupFromBanner: () => void;
};

type UseListingBidEnrollmentResult = {
  session: ListingBidEnrollmentSession;
  actions: ListingBidEnrollmentActions;
  setupSteps: readonly SetupSheetStep[];
  needsSetup: boolean;
  ready: boolean;
  snapshot: ListingBidEnrollmentSnapshot;
};

const INITIAL_SESSION: ListingBidEnrollmentSession = {
  signedIn: false,
  ageVerified: false,
  paymentLinked: false,
  bidMode: "manual",
  signInOpen: false,
  setupOpen: false,
  setupStepIndex: 0,
  autoConfirmOpen: false,
};

function useListingBidEnrollment(listingId = "demo-lot") {
  const [session, setSession] = useState<ListingBidEnrollmentSession>(
    INITIAL_SESSION,
  );
  const [autoBidIntroAcknowledgedListingIds, setAutoBidIntroAcknowledgedListingIds] =
    useState<ReadonlySet<string>>(() => new Set());

  const setupSteps = session.ageVerified
    ? (["payment"] as const)
    : (["age", "payment"] as const);

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
  }, [listingId]);

  const pretendAgeVerifiedElsewhere = useCallback(() => {
    setSession((current) => ({ ...current, ageVerified: true }));
  }, []);

  const setBidMode = useCallback((bidMode: "manual" | "auto") => {
    setSession((current) => ({ ...current, bidMode }));
  }, []);

  const setSignInOpen = useCallback((signInOpen: boolean) => {
    setSession((current) => ({ ...current, signInOpen }));
  }, []);

  const setSetupOpen = useCallback((setupOpen: boolean) => {
    setSession((current) => ({ ...current, setupOpen }));
  }, []);

  const setSetupStepIndex = useCallback((setupStepIndex: number) => {
    setSession((current) => ({ ...current, setupStepIndex }));
  }, []);

  const setAutoConfirmOpen = useCallback((autoConfirmOpen: boolean) => {
    setSession((current) => ({ ...current, autoConfirmOpen }));
  }, []);

  const openSetupFromBanner = useCallback(() => {
    setSession((current) => ({
      ...current,
      setupStepIndex: 0,
      setupOpen: true,
    }));
  }, []);

  const handleBidSubmit = useCallback(() => {
    setSession((current) => {
      if (!current.signedIn) {
        return { ...current, signInOpen: true };
      }
      if (current.signedIn && !current.paymentLinked) {
        return { ...current, setupStepIndex: 0, setupOpen: true };
      }
      if (
        current.bidMode === "auto" &&
        current.paymentLinked &&
        !autoBidIntroAcknowledgedListingIds.has(listingId)
      ) {
        return { ...current, autoConfirmOpen: true };
      }
      return current;
    });
  }, [autoBidIntroAcknowledgedListingIds, listingId]);

  const completeSignIn = useCallback(() => {
    setSession((current) => ({
      ...current,
      signedIn: true,
      signInOpen: false,
      setupStepIndex: 0,
      setupOpen: true,
    }));
  }, []);

  const handleSetupContinue = useCallback(() => {
    setSession((current) => {
      const step = setupSteps[current.setupStepIndex];
      if (step === "age") {
        return {
          ...current,
          ageVerified: true,
          setupStepIndex: 0,
        };
      }
      return {
        ...current,
        paymentLinked: true,
        setupOpen: false,
        setupStepIndex: 0,
      };
    });
  }, [setupSteps]);

  const snapshot = useMemo((): ListingBidEnrollmentSnapshot => {
    return {
      bidMode: session.bidMode,
      submitUsesSignInLabel: !session.signedIn,
      setupBanner:
        needsSetup && !session.setupOpen && !session.ageVerified
          ? "age"
          : undefined,
      paymentEmptyState:
        needsSetup && !session.setupOpen && session.ageVerified
          ? true
          : undefined,
      paymentMethod: ready
        ? { brand: "visa", maskedNumber: "•••• 4242" }
        : undefined,
      setupSheet: session.setupOpen
        ? {
            steps: setupSteps,
            stepIndex: session.setupStepIndex,
            showIframe: session.ageVerified,
          }
        : undefined,
    };
  }, [needsSetup, ready, session, setupSteps]);

  return {
    session,
    actions: {
      setBidMode,
      setSignInOpen,
      setSetupOpen,
      setSetupStepIndex,
      setAutoConfirmOpen,
      confirmAutoBidIntro,
      reset,
      pretendAgeVerifiedElsewhere,
      handleBidSubmit,
      completeSignIn,
      handleSetupContinue,
      openSetupFromBanner,
    },
    setupSteps,
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
