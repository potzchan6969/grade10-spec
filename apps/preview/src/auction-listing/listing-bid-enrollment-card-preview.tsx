import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  EnrollmentSetupSheet,
  InlineOverlayPreview,
  ListingAuctionBidCard,
  type ListingBidHistoryRow,
  type OverlayPresentation,
  PaymentMethodEmptyState,
  PaymentMethodRow,
  SignInCard,
  SignInEmailForm,
} from "@grade10/ui";
import { useEffect, useMemo, useState } from "react";
import {
  type BiddingState,
  bidHistoryForState,
  buildListingAuctionBidView,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
} from "./listing-auction-bid-fixtures";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";
import type { ListingBidEnrollmentSnapshot } from "./listing-bid-enrollment-snapshots";

type ListingBidEnrollmentCardPreviewProps = {
  snapshot: ListingBidEnrollmentSnapshot;
  overlayPresentation?: OverlayPresentation;
  signInOpen?: boolean;
  onSignInOpenChange?: (open: boolean) => void;
  onSignInComplete?: () => void;
  onBidSubmit?: () => void;
  onSetupContinue?: () => void;
  onPaymentSetupDismissed?: () => void;
  onLinkPayment?: () => void;
  onChangePayment?: () => void;
  history?: readonly ListingBidHistoryRow[];
  historyResetKey?: string;
};

function ListingBidEnrollmentCardPreview({
  snapshot,
  overlayPresentation = "modal",
  signInOpen: signInOpenProp,
  onSignInOpenChange,
  onSignInComplete,
  onBidSubmit,
  onSetupContinue,
  onPaymentSetupDismissed,
  onLinkPayment,
  onChangePayment,
  history: historyProp,
  historyResetKey = "enrollment-demo",
}: ListingBidEnrollmentCardPreviewProps) {
  const [signInEmail, setSignInEmail] = useState("");

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

  const history =
    historyProp ??
    bidHistoryForState(fixtureState).map((row) =>
      snapshot.submitUsesSignInLabel ? { ...row, isViewer: false } : row,
    );

  function handleBidSubmit(_amountMinor?: number) {
    onBidSubmit?.();
  }

  return (
    <VStack className="w-full max-w-md" gap="sm">
      <ListingAuctionBidCard
        bidEnrollment={snapshot.submitUsesSignInLabel ? "signed-out" : "ready"}
        copy={sidebarCopy}
        history={history}
        historyResetKey={historyResetKey}
        locale="en"
        onCommitMaximum={handleBidSubmit}
        onPlaceBid={handleBidSubmit}
        timeZone="Asia/Hong_Kong"
        view={view}
      />

      {snapshot.linkedPaymentMethod ? (
        <div className="mt-1">
          <PaymentMethodRow
            brand={snapshot.linkedPaymentMethod.brand}
            copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
            maskedNumber={snapshot.linkedPaymentMethod.maskedNumber}
            onChange={
              snapshot.linkedPaymentMethod.editable
                ? onChangePayment
                : undefined
            }
          />
        </div>
      ) : null}
      {snapshot.paymentEmptyState ? (
        <div className="mt-1">
          <PaymentMethodEmptyState
            copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
            onLink={onLinkPayment}
          />
        </div>
      ) : null}

      <EnrollmentSetupSheet
        authorizationRefused={snapshot.paymentSetup?.authorizationRefused}
        authorizing={snapshot.paymentSetup?.authorizing}
        copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
        defaultAgeAttested={snapshot.paymentSetup?.defaultAgeAttested}
        iframeLinkedPayment={snapshot.paymentSetup?.iframeLinkedPayment}
        onContinue={onSetupContinue}
        onOpenChange={(open) => {
          if (!open) onPaymentSetupDismissed?.();
        }}
        open={Boolean(snapshot.paymentSetup)}
        presentation={overlayPresentation}
        requiresIframeLink={snapshot.paymentSetup?.requiresIframeLink ?? true}
      />

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
    </VStack>
  );
}

export { ListingBidEnrollmentCardPreview };
