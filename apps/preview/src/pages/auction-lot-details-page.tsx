import {
  ListingAgeVerificationDialog,
  ListingAuctionCardSidebar,
  ListingLotGallery,
  ListingLotHeader,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import {
  AUCTION_LOT,
  AUCTION_LOT_BADGES,
  AUCTION_LOT_DETAILS_COPY,
  appendSimulatedBid,
  type BiddingState,
  type BidMode,
  bidHistoryForState,
  bidModeForState,
  buildListingAuctionBidView,
} from "./auction-lot-details-content";
import { AuctionLotDetailsPageShell } from "./auction-lot-details-page-shell";

const LIVE_BID_INTERVAL_MS = 8_000;

type AuctionLotDetailsPageProps = {
  state: BiddingState;
};

function AuctionLotDetailsPage({ state }: AuctionLotDetailsPageProps) {
  const [bidMode, setBidMode] = useState<BidMode>(() => bidModeForState(state));
  const [watched, setWatched] = useState(false);
  const [ageVerifyOpen, setAgeVerifyOpen] = useState(false);
  const [history, setHistory] = useState(() => bidHistoryForState(state));
  const view = buildListingAuctionBidView(state);

  useEffect(() => {
    setBidMode(bidModeForState(state));
    setHistory(bidHistoryForState(state));
  }, [state]);

  useEffect(() => {
    if (!view.live) return;

    const timer = window.setInterval(() => {
      setHistory((rows) => appendSimulatedBid(rows));
    }, LIVE_BID_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [view.live]);

  return (
    <>
      <AuctionLotDetailsPageShell
        header={
          <ListingLotHeader
            copy={AUCTION_LOT_DETAILS_COPY.header}
            onWatchToggle={() => setWatched((value) => !value)}
            title={AUCTION_LOT.title}
            watched={watched}
          />
        }
      >
        <ListingLotGallery images={AUCTION_LOT.images} />
        <ListingAuctionCardSidebar
          authenticationBody={AUCTION_LOT_DETAILS_COPY.authenticationBody}
          badges={AUCTION_LOT_BADGES}
          bidMode={bidMode}
          copy={AUCTION_LOT_DETAILS_COPY.sidebar}
          description={AUCTION_LOT.description}
          history={history}
          historyResetKey={state}
          onBidModeChange={setBidMode}
          onPlaceBid={() => setAgeVerifyOpen(true)}
          vaultShippingBody={AUCTION_LOT_DETAILS_COPY.vaultShippingBody}
          view={view}
        />
      </AuctionLotDetailsPageShell>
      <ListingAgeVerificationDialog
        copy={AUCTION_LOT_DETAILS_COPY.ageVerification}
        onConfirm={() => undefined}
        onOpenChange={setAgeVerifyOpen}
        open={ageVerifyOpen}
      />
    </>
  );
}

export { AuctionLotDetailsPage };
