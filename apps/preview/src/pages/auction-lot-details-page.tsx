import {
  EnrollmentSetupSheet,
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
  ListingAuctionCardSidebar,
  ListingLotGallery,
  ListingLotHeader,
  ListingUserBidHistory,
  PaymentMethodRow,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "../auction-listing/listing-bid-enrollment-copy";
import {
  AUCTION_LOT,
  AUCTION_LOT_BADGES,
  AUCTION_LOT_DETAILS_COPY,
  AUCTION_LOT_LINKED_PAYMENT_METHOD,
  type AuctionTiming,
  applyBidExtension,
  auctionLotShowsLinkedPaymentMethod,
  type BiddingState,
  bidHistoryForState,
  buildListingAuctionBidView,
  createLiveAuctionTiming,
  initialLiveListingFacts,
  type LiveListingFacts,
  liveBidSimulationOptions,
  simulateNextLiveBid,
  userBidHistoryForState,
} from "./auction-lot-details-content";
import { AuctionLotDetailsPageShell } from "./auction-lot-details-page-shell";

const LIVE_BID_INTERVAL_MS = 8_000;

const AUCTION_LOT_MARKET_COMPS = {
  title: "Recent verified PSA 10 sales",
  range: "HK$14,600–HK$16,200",
};

type AuctionLotDetailsPageProps = {
  state: BiddingState;
};

/** Enrollment is owed only before the collector's first bid on this listing. */
function hasBidOnListing(view: {
  viewerMaximumMinor?: number;
  standing: string;
}): boolean {
  return view.viewerMaximumMinor != null || view.standing !== "none";
}

function AuctionLotDetailsPage({ state }: AuctionLotDetailsPageProps) {
  const [watched, setWatched] = useState(false);
  const [paymentLinked, setPaymentLinked] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
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
    setPaymentLinked(false);
    setSetupOpen(false);
  }, [state]);

  useEffect(() => {
    if (!view.live) return;

    const timer = window.setInterval(() => {
      setLiveSnapshot((snapshot) => {
        if (snapshot == null) return snapshot;
        return simulateNextLiveBid(
          snapshot.history,
          snapshot.facts,
          liveBidSimulationOptions(state),
        );
      });
      setTiming((current) => applyBidExtension(current));
    }, LIVE_BID_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [view.live, state]);

  function requestBidAction(_amountMinor?: number) {
    if (hasBidOnListing(view)) return;
    if (!paymentLinked) {
      setSetupOpen(true);
    }
  }

  function completeEnrollment() {
    setPaymentLinked(true);
    setSetupOpen(false);
  }

  return (
    <>
      <AuctionLotDetailsPageShell
        header={
          <ListingLotHeader
            copy={AUCTION_LOT_DETAILS_COPY.header}
            onWatchToggle={() => setWatched(() => !watched)}
            title={AUCTION_LOT.title}
            watched={watched}
          />
        }
      >
        <ListingLotGallery images={AUCTION_LOT.images} />
        <ListingAuctionCardSidebar
          authenticationBody={AUCTION_LOT_DETAILS_COPY.authenticationBody}
          badges={AUCTION_LOT_BADGES}
          bidCardFooter={
            auctionLotShowsLinkedPaymentMethod(state) && paymentLinked ? (
              <PaymentMethodRow
                brand={AUCTION_LOT_LINKED_PAYMENT_METHOD.brand}
                copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
                maskedNumber={AUCTION_LOT_LINKED_PAYMENT_METHOD.maskedNumber}
              />
            ) : undefined
          }
          copy={AUCTION_LOT_DETAILS_COPY.sidebar}
          description={AUCTION_LOT.description}
          history={history}
          historyResetKey={state}
          locale={FIXTURE_SHIPPED_LOCALE}
          marketComps={AUCTION_LOT_MARKET_COMPS}
          onCommitMaximum={requestBidAction}
          onPlaceBid={requestBidAction}
          recentBidsAccessory={
            <ListingUserBidHistory
              activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
              copy={AUCTION_LOT_DETAILS_COPY.userBidHistory}
              locale={FIXTURE_SHIPPED_LOCALE}
              rows={userBidHistoryForState(state)}
              timeZone={FIXTURE_TIME_ZONE}
            />
          }
          timeZone={FIXTURE_TIME_ZONE}
          vaultShippingBody={AUCTION_LOT_DETAILS_COPY.vaultShippingBody}
          view={view}
        />
      </AuctionLotDetailsPageShell>
      <EnrollmentSetupSheet
        copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
        onContinue={completeEnrollment}
        onOpenChange={setSetupOpen}
        open={setupOpen}
      />
    </>
  );
}

export { AuctionLotDetailsPage };
