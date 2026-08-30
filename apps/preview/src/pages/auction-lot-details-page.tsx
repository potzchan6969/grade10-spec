import { useEffect, useState } from "react";
import { AgeVerificationDialog } from "../prototypes/auction-listing-details/age-verification-dialog";
import { AuctionCardSidebar } from "../prototypes/auction-listing-details/auction-sidebar/auction-card-sidebar";
import { LOT } from "../prototypes/auction-listing-details/fixtures";
import { LotGallery } from "../prototypes/auction-listing-details/lot-gallery";
import { PageShell } from "../prototypes/auction-listing-details/page-shell";
import "../prototypes/auction-listing-details/pdp-layout.css";
import { bidModeForState } from "../prototypes/auction-listing-details/state-utils";
import type { BidMode, BiddingState } from "../prototypes/auction-listing-details/types";

type AuctionLotDetailsPageProps = {
  state: BiddingState;
};

function AuctionLotDetailsPage({ state }: AuctionLotDetailsPageProps) {
  const [bidMode, setBidMode] = useState<BidMode>(() => bidModeForState(state));
  const [watched, setWatched] = useState(false);
  const [ageVerifyOpen, setAgeVerifyOpen] = useState(false);

  useEffect(() => {
    setBidMode(bidModeForState(state));
  }, [state]);

  return (
    <>
      <PageShell>
        <LotGallery lot={LOT} />
        <AuctionCardSidebar
          bidMode={bidMode}
          onBidModeChange={setBidMode}
          onPlaceBid={() => setAgeVerifyOpen(true)}
          onWatchToggle={() => setWatched((value) => !value)}
          state={state}
          watched={watched}
        />
      </PageShell>
      <AgeVerificationDialog
        onConfirm={() => undefined}
        onOpenChange={setAgeVerifyOpen}
        open={ageVerifyOpen}
      />
    </>
  );
}

export { AuctionLotDetailsPage };
