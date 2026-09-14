import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  type BidEnrollment,
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

function resolveBidEnrollment(
  snapshot: ListingBidEnrollmentSnapshot,
): BidEnrollment {
  if (snapshot.submitUsesSignInLabel) return "signed-out";
  if (snapshot.needsCard || snapshot.paymentEmptyState) return "needs-card";
  return "ready";
}

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
  const bidEnrollment = resolveBidEnrollment(snapshot);

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
    const copy = {
      ...LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
      linkACardToBid: LISTING_BID_ENROLLMENT_DEMO_COPY.linkACardToBid,
    };
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

  function handlePlaceBid() {
    if (bidEnrollment === "needs-card") {
      onLinkPayment?.();
      return;
    }
    onBidSubmit?.();
  }

  const authorizationStatus =
    snapshot.bidAuthorization?.status === "pending"
      ? "pending"
      : snapshot.bidAuthorization?.status === "error"
        ? "error"
        : undefined;
  const authorizationMessage = snapshot.bidAuthorization?.message;

  return (
    <VStack className="w-full max-w-md" gap="sm">
      <ListingAuctionBidCard
        authorizationMessage={authorizationMessage}
        authorizationStatus={authorizationStatus}
        bidEnrollment={bidEnrollment}
        copy={sidebarCopy}
        history={history}
        historyResetKey={historyResetKey}
        locale="en"
        onCommitMaximum={handleBidSubmit}
        onPlaceBid={handlePlaceBid}
        timeZone="Asia/Hong_Kong"
        view={view}
      />

      {snapshot.linkedPaymentMethod ? (
        <div className="mt-1" data-slot="listing-linked-card">
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
        <div className="mt-1" data-slot="listing-linked-card">
          <PaymentMethodEmptyState
            copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
            onLink={onLinkPayment}
          />
        </div>
      ) : null}

      <EnrollmentSetupSheet
        cardReady={snapshot.paymentSetup?.iframeLinkedPayment != null}
        copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
        defaultAgeAttested={snapshot.paymentSetup?.defaultAgeAttested}
        errorMessage={snapshot.paymentSetup?.errorMessage}
        iframeLinkedPayment={snapshot.paymentSetup?.iframeLinkedPayment}
        linking={snapshot.paymentSetup?.linking}
        paymentField={
          <div className="flex h-12 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-secondary-foreground">
            {snapshot.paymentSetup?.iframeLinkedPayment
              ? LISTING_BID_ENROLLMENT_DEMO_COPY.iframeLinkedCardPlaceholder
              : LISTING_BID_ENROLLMENT_DEMO_COPY.iframePlaceholder}
          </div>
        }
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
