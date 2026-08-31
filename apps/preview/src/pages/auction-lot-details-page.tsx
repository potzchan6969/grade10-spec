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
  applyBidExtension,
  type AuctionTiming,
  type BiddingState,
  type BidMode,
  bidHistoryForState,
  bidModeForState,
  buildListingAuctionBidView,
  createLiveAuctionTiming,
  initialLiveListingFacts,
  type LiveListingFacts,
  simulateNextLiveBid,
} from "./auction-lot-details-content";
import { AuctionLotDetailsPageShell } from "./auction-lot-details-page-shell";

const LIVE_BID_INTERVAL_MS = 8_000;

type AuctionLotDetailsPageProps = {
  state: BiddingState;
};

/** Age verification is owed only before the collector's first bid on this listing. */
function hasBidOnListing(view: {
  viewerMaximumMinor?: number;
  standing: string;
}): boolean {
  return view.viewerMaximumMinor != null || view.standing !== "none";
}

function AuctionLotDetailsPage({ state }: AuctionLotDetailsPageProps) {
  const [bidMode, setBidMode] = useState<BidMode>(() => bidModeForState(state));
  const [watched, setWatched] = useState(false);
  const [ageVerifyOpen, setAgeVerifyOpen] = useState(false);
  const [liveSnapshot, setLiveSnapshot] = useState<{
    history: ReturnType<typeof bidHistoryForState>;
    facts: LiveListingFacts;
  } | null>(() =>
    state.startsWith("live")
      ? {
          history: bidHistoryForState(state),
          facts: initialLiveListingFacts(state),
        }
      : null,
  );
  const [timing, setTiming] = useState<AuctionTiming>(() =>
    createLiveAuctionTiming(),
  );
  const history = liveSnapshot?.history ?? bidHistoryForState(state);
  const liveFacts = liveSnapshot?.facts;
  const view = buildListingAuctionBidView(
    state,
    state.startsWith("live") ? timing : undefined,
    liveFacts,
  );

  useEffect(() => {
    setBidMode(bidModeForState(state));
    setLiveSnapshot(
      state.startsWith("live")
        ? {
            history: bidHistoryForState(state),
            facts: initialLiveListingFacts(state),
          }
        : null,
    );
    if (state.startsWith("live")) {
      setTiming(createLiveAuctionTiming());
    }
  }, [state]);

  useEffect(() => {
    if (!view.live) return;

    const timer = window.setInterval(() => {
      setLiveSnapshot((snapshot) => {
        if (snapshot == null) return snapshot;
        return simulateNextLiveBid(snapshot.history, snapshot.facts);
      });
      setTiming((current) => applyBidExtension(current));
    }, LIVE_BID_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [view.live]);

  function requestBidAction() {
    if (hasBidOnListing(view)) return;
    setAgeVerifyOpen(true);
  }

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
          onCommitMaximum={requestBidAction}
          onPlaceBid={requestBidAction}
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
