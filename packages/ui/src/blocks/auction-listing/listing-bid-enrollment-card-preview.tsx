import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useEffect, useMemo, useState } from "react";
import { SignInCard } from "../auth-sign-in/sign-in-card";
import { SignInEmailForm } from "../auth-sign-in/sign-in-email-form";
import {
  LISTING_AUCTION_BID_AGE_VERIFICATION_COPY,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
  bidHistoryForState,
  buildListingAuctionBidView,
} from "./listing-auction-bid-fixtures";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";
import {
  AutoBidConfirmationDialog,
  EnrollmentBanner,
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  PaymentMethodEmptyState,
  PaymentMethodRow,
  type OverlayPresentation,
  type SetupSheetStep,
} from "./listing-bid-enrollment-prototypes";
import type { ListingBidEnrollmentSnapshot } from "./listing-bid-enrollment-snapshots";

type ListingBidEnrollmentCardPreviewProps = {
  snapshot: ListingBidEnrollmentSnapshot;
  overlayPresentation?: OverlayPresentation;
  bidMode?: "manual" | "auto";
  onBidModeChange?: (mode: "manual" | "auto") => void;
  signInOpen?: boolean;
  onSignInOpenChange?: (open: boolean) => void;
  onSignInComplete?: () => void;
  onBidSubmit?: () => void;
  setupOpen?: boolean;
  onSetupOpenChange?: (open: boolean) => void;
  setupSteps?: readonly SetupSheetStep[];
  setupStepIndex?: number;
  onSetupContinue?: () => void;
  onBannerComplete?: () => void;
  autoConfirmOpen?: boolean;
  onAutoConfirmOpenChange?: (open: boolean) => void;
  onAutoBidConfirm?: () => void;
};

function ListingBidEnrollmentCardPreview({
  snapshot,
  overlayPresentation = "modal",
  bidMode: bidModeProp,
  onBidModeChange,
  signInOpen: signInOpenProp,
  onSignInOpenChange,
  onSignInComplete,
  onBidSubmit,
  setupOpen: setupOpenProp,
  onSetupOpenChange,
  setupSteps: setupStepsProp,
  setupStepIndex: setupStepIndexProp,
  onSetupContinue,
  onBannerComplete,
  autoConfirmOpen: autoConfirmOpenProp,
  onAutoConfirmOpenChange,
  onAutoBidConfirm,
}: ListingBidEnrollmentCardPreviewProps) {
  const [bidModeInternal, setBidModeInternal] = useState(snapshot.bidMode);
  const [signInEmail, setSignInEmail] = useState("");
  const bidMode = bidModeProp ?? bidModeInternal;
  const setBidMode = onBidModeChange ?? setBidModeInternal;

  const signInOpen = signInOpenProp ?? snapshot.signInOpen ?? false;

  useEffect(() => {
    if (!signInOpen) {
      setSignInEmail("");
    }
  }, [signInOpen]);

  const baseView = buildListingAuctionBidView("live-no-bids");
  const view = {
    ...baseView,
    ...snapshot.viewOverride,
  };

  const sidebarCopy = useMemo(() => {
    const copy = { ...LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY };
    if (snapshot.submitUsesSignInLabel) {
      copy.signInToBidAt = LISTING_BID_ENROLLMENT_DEMO_COPY.signInToBidAt;
    }
    return copy;
  }, [snapshot.submitUsesSignInLabel]);

  const history = bidHistoryForState("live-no-bids");
  const maximumLabel = "US$5,000";

  const setupOpen = setupOpenProp ?? snapshot.setupSheet != null;
  const setupSteps =
    setupStepsProp ?? snapshot.setupSheet?.steps ?? (["payment"] as const);
  const setupStepIndex =
    setupStepIndexProp ?? snapshot.setupSheet?.stepIndex ?? 0;
  const autoConfirmOpen =
    autoConfirmOpenProp ?? snapshot.autoConfirmOpen ?? false;

  function handleBidSubmit() {
    onBidSubmit?.();
  }

  return (
    <VStack className="w-full max-w-md" gap="sm">
      {snapshot.setupBanner === "age" ? (
        <EnrollmentBanner
          actionLabel={LISTING_BID_ENROLLMENT_DEMO_COPY.verifyAge}
          message={LISTING_BID_ENROLLMENT_DEMO_COPY.setupBannerAge}
          onAction={onBannerComplete}
        />
      ) : null}

      <ListingAuctionBidCard
        bidEnrollment={snapshot.submitUsesSignInLabel ? "signed-out" : "ready"}
        bidMode={bidMode}
        copy={sidebarCopy}
        history={history}
        historyResetKey="enrollment-demo"
        locale="en"
        onBidModeChange={setBidMode}
        onCommitMaximum={handleBidSubmit}
        onPlaceBid={handleBidSubmit}
        timeZone="Asia/Hong_Kong"
        view={view}
      />

      {snapshot.paymentMethod ? (
        <div className="mt-1">
          <PaymentMethodRow
            brand={snapshot.paymentMethod.brand}
            maskedNumber={snapshot.paymentMethod.maskedNumber}
          />
        </div>
      ) : null}
      {snapshot.paymentEmptyState ? (
        <div className="mt-1">
          <PaymentMethodEmptyState onLink={onBannerComplete} />
        </div>
      ) : null}

      {snapshot.staleFloor ? (
        <Text className="px-4" size="sm" tone="secondary">
          {LISTING_BID_ENROLLMENT_DEMO_COPY.staleFloorNotice.replace(
            "{amount}",
            "US$5,050",
          )}
        </Text>
      ) : null}

      {setupOpen ? (
        <EnrollmentSetupSheet
          ageCopy={LISTING_AUCTION_BID_AGE_VERIFICATION_COPY}
          onContinue={onSetupContinue}
          onOpenChange={onSetupOpenChange}
          open
          presentation={overlayPresentation}
          showIframe={snapshot.setupSheet?.showIframe}
          stepIndex={setupStepIndex}
          steps={setupSteps}
        />
      ) : null}

      {signInOpen ? (
        overlayPresentation === "inline" ? (
          <InlineOverlayPreview label="Sign in to Grade10">
            <SignInEmailForm
              copy={{
                email: "Email",
                submit: LISTING_BID_ENROLLMENT_DEMO_COPY.signInDemoSubmit,
              }}
              email={signInEmail}
              onEmailChange={setSignInEmail}
              onSubmit={() => {
                onSignInComplete?.();
              }}
            />
          </InlineOverlayPreview>
        ) : (
          <SignInCard
            copy={{
              title: "Sign in to Grade10",
              description: "Continue to bid on this lot.",
            }}
            onOpenChange={(open) => {
              onSignInOpenChange?.(open);
            }}
            open
          >
            <SignInEmailForm
              copy={{
                email: "Email",
                submit: LISTING_BID_ENROLLMENT_DEMO_COPY.signInDemoSubmit,
              }}
              email={signInEmail}
              onEmailChange={setSignInEmail}
              onSubmit={() => {
                onSignInComplete?.();
              }}
            />
          </SignInCard>
        )
      ) : null}

      {autoConfirmOpen ? (
        <AutoBidConfirmationDialog
          maximumLabel={maximumLabel}
          onConfirm={onAutoBidConfirm}
          onOpenChange={onAutoConfirmOpenChange}
          open
          presentation={overlayPresentation}
        />
      ) : null}
    </VStack>
  );
}

export { ListingBidEnrollmentCardPreview };
