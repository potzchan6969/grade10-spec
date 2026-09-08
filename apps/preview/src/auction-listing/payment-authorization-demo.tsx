import { useState } from "react";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "./listing-bid-enrollment-copy";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_DEMO_SAVED_PAYMENT,
  ENROLLMENT_SNAPSHOT_READY,
  type BidAuthorizationSnapshot,
} from "./listing-bid-enrollment-snapshots";

function PaymentAuthorizationPreview() {
  const [authorization, setAuthorization] = useState<
    BidAuthorizationSnapshot | undefined
  >(undefined);

  return (
    <ListingBidEnrollmentCardPreview
      onBidSubmit={() =>
        setAuthorization({
          status: "error",
          message: LISTING_BID_ENROLLMENT_DEMO_COPY.authorizationDeclined,
        })
      }
      onChangePayment={() => undefined}
      onLinkPayment={() => undefined}
      snapshot={{
        ...ENROLLMENT_SNAPSHOT_READY,
        linkedPaymentMethod: {
          ...ENROLLMENT_DEMO_SAVED_PAYMENT,
          editable: true,
        },
        bidAuthorization: authorization,
      }}
    />
  );
}

export { PaymentAuthorizationPreview };
