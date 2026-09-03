import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { useListingBidEnrollment } from "./use-listing-bid-enrollment";

/** Click-through sign-in → setup → bid orchestration (demo chrome only). */
function ListingBidEnrollmentInteractiveDemo() {
  const { session, actions, ready, snapshot } = useListingBidEnrollment();

  return (
    <VStack className="w-full" gap="lg">
      <Text as="h2" size="lg" weight="bold">
        Interactive enrollment walkthrough
      </Text>

      <VStack
        className="rounded-lg border border-border bg-background p-6"
        gap="sm"
      >
        <Text size="sm" tone="secondary">
          {session.signedIn ? "Signed in" : "Signed out"}
          {session.signedIn && !session.paymentLinked ? " · setup needed" : ""}
          {ready ? " · ready to bid" : ""}
        </Text>
        <div className="flex flex-wrap gap-2">
          <Button onClick={actions.reset} size="sm" variant="outline">
            Reset
          </Button>
        </div>
      </VStack>

      <ListingBidEnrollmentCardPreview
        autoConfirmOpen={session.autoConfirmOpen}
        onAutoBidConfirm={actions.confirmAutoBidIntro}
        onAutoConfirmOpenChange={actions.setAutoConfirmOpen}
        onChangePayment={actions.openChangePayment}
        onLinkPayment={actions.openSetup}
        onBidSubmit={actions.handleBidSubmit}
        onSetupContinue={actions.handleSetupContinue}
        onPaymentSetupDismissed={actions.dismissPaymentSetup}
        onSignInComplete={actions.completeSignIn}
        onSignInOpenChange={actions.setSignInOpen}
        signInOpen={session.signInOpen}
        snapshot={snapshot}
      />
    </VStack>
  );
}

export { ListingBidEnrollmentInteractiveDemo };
