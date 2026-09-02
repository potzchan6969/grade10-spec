import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useEffect, useMemo, useState } from "react";
import { SignInCard } from "../auth-sign-in/sign-in-card";
import { SignInEmailForm } from "../auth-sign-in/sign-in-email-form";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
  bidHistoryForState,
  buildListingAuctionBidView,
  type BiddingState,
} from "./listing-auction-bid-fixtures";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";
import {
  AutoBidConfirmationDialog,
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  type OverlayPresentation,
  PaymentMethodEmptyState,
  PaymentMethodRow,
  type OverlayPresentation,
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
  onSetupContinue?: () => void;
  onLinkPayment?: () => void;
  onChangePayment?: () => void;
  setupRequiresIframeLink?: boolean;
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
  onSetupContinue,
  onLinkPayment,
  onChangePayment,
  setupRequiresIframeLink,
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

  const fixtureState: BiddingState = snapshot.fixtureState ?? "live-no-bids";
  const baseView = buildListingAuctionBidView(fixtureState);
  const view = {
    ...baseView,
    ...snapshot.viewOverride,
  };

  const sidebarCopy = useMemo(() => {
    const copy = { ...LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY };
    if (snapshot.submitUsesSignInLabel) {
      copy.signInToBid = LISTING_BID_ENROLLMENT_DEMO_COPY.signInToBid;
    }
    return copy;
  }, [snapshot.submitUsesSignInLabel]);

  const history = bidHistoryForState(fixtureState).map((row) =>
    snapshot.submitUsesSignInLabel ? { ...row, isViewer: false } : row,
  );
  const maximumLabel = "US$5,000";

  const setupOpen = setupOpenProp ?? snapshot.setupSheet != null;
  const autoConfirmOpen =
    autoConfirmOpenProp ?? snapshot.autoConfirmOpen ?? false;

  function handleBidSubmit() {
    onBidSubmit?.();
  }

  return (
    <VStack className="w-full max-w-md" gap="sm">
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

      {snapshot.linkedPaymentMethod ? (
        <div className="mt-1">
          <PaymentMethodRow
            brand={snapshot.linkedPaymentMethod.brand}
            maskedNumber={snapshot.linkedPaymentMethod.maskedNumber}
            onChange={
              snapshot.linkedPaymentMethod.editable ? onChangePayment : undefined
            }
          />
        </div>
      ) : null}
      {snapshot.paymentEmptyState ? (
        <div className="mt-1">
          <PaymentMethodEmptyState onLink={onLinkPayment} />
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
          defaultAgeAttested={snapshot.setupSheet?.defaultAgeAttested}
          iframeLinkedPayment={snapshot.setupSheet?.iframeLinkedPayment}
          onContinue={onSetupContinue}
          onOpenChange={onSetupOpenChange}
          open
          presentation={overlayPresentation}
          requiresIframeLink={
            setupRequiresIframeLink ??
            snapshot.setupSheet?.requiresIframeLink ??
            true
          }
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
