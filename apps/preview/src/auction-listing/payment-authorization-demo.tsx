import { useState } from "react";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_DEMO_SAVED_PAYMENT,
  ENROLLMENT_SNAPSHOT_READY,
} from "./listing-bid-enrollment-snapshots";

function PaymentAuthorizationPreview() {
  const [dialogState, setDialogState] = useState<
    "closed" | "method" | "pending"
  >("closed");

  return (
    <ListingBidEnrollmentCardPreview
      onBidSubmit={() => setDialogState("method")}
      onChangePayment={() => undefined}
      onLinkPayment={() => undefined}
      onPaymentSetupDismissed={() => setDialogState("closed")}
      onSetupContinue={() => setDialogState("pending")}
      snapshot={{
        ...ENROLLMENT_SNAPSHOT_READY,
        linkedPaymentMethod: {
          ...ENROLLMENT_DEMO_SAVED_PAYMENT,
          editable: true,
        },
        paymentSetup:
          dialogState === "closed"
            ? undefined
            : {
                requiresIframeLink: true,
                iframeLinkedPayment: ENROLLMENT_DEMO_SAVED_PAYMENT,
                defaultAgeAttested: true,
                authorizing: dialogState === "pending",
              },
      }}
    />
  );
}

export { PaymentAuthorizationPreview };
