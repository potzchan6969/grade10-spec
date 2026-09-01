import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { useListingBidEnrollment } from "./use-listing-bid-enrollment";

/** Click-through sign-in → setup → bid orchestration (demo chrome only). */
function ListingBidEnrollmentInteractiveDemo() {
  const { session, actions, setupSteps, ready, snapshot } =
    useListingBidEnrollment();

  return (
    <VStack className="w-full" gap="lg">
      <VStack gap="sm">
        <Text as="h2" size="lg" weight="bold">
          Interactive enrollment walkthrough
        </Text>
        <Text size="sm" tone="secondary">
          Tap <strong>Sign In to Bid US$1,200</strong> on the card, then use{" "}
          <strong>Continue (Demo)</strong> in the sign-in dialog. After sign-in
          you get the full bid form, setup sheet, and optional auto-bid
          confirmation.
        </Text>
      </VStack>

      <VStack className="rounded-lg border border-border bg-background p-6" gap="sm">
        <Text size="sm" tone="secondary">
          {session.signedIn ? "Signed in" : "Signed out"}
          {session.signedIn && !session.paymentLinked ? " · setup needed" : ""}
          {ready ? " · ready to bid" : ""}
          {session.ageVerified ? " · age verified" : ""}
        </Text>
        <div className="flex flex-wrap gap-2">
          <Button onClick={actions.reset} size="sm" variant="outline">
            Reset
          </Button>
          <Button
            onClick={actions.pretendAgeVerifiedElsewhere}
            size="sm"
            variant="ghost"
          >
            Pretend age verified elsewhere
          </Button>
        </div>
      </VStack>

      <ListingBidEnrollmentCardPreview
        autoConfirmOpen={session.autoConfirmOpen}
        bidMode={session.bidMode}
        onAutoBidConfirm={actions.confirmAutoBidIntro}
        onAutoConfirmOpenChange={actions.setAutoConfirmOpen}
        onBannerComplete={actions.openSetupFromBanner}
        onBidModeChange={actions.setBidMode}
        onBidSubmit={actions.handleBidSubmit}
        onSetupContinue={actions.handleSetupContinue}
        onSetupOpenChange={actions.setSetupOpen}
        onSignInComplete={actions.completeSignIn}
        onSignInOpenChange={actions.setSignInOpen}
        setupOpen={session.setupOpen}
        setupStepIndex={session.setupStepIndex}
        setupSteps={setupSteps}
        signInOpen={session.signInOpen}
        snapshot={snapshot}
      />
    </VStack>
  );
}

export { ListingBidEnrollmentInteractiveDemo };
