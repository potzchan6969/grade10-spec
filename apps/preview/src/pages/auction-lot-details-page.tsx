import { Toast } from "@grade10/design-system/components/overlays/toast";
import {
  EnrollmentSetupSheet,
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
  ListingAuctionCardSidebar,
  ListingLotGallery,
  ListingLotHeader,
  ListingUserBidHistory,
  PaymentMethodEmptyState,
  PaymentMethodRow,
} from "@grade10/ui";
import { useEffect, useState } from "react";
import { LISTING_BID_ENROLLMENT_DEMO_COPY } from "../auction-listing/listing-bid-enrollment-copy";
import {
  AUCTION_LISTING_HREF,
  AUCTION_LOT,
  AUCTION_LOT_BADGES,
  AUCTION_LOT_DETAILS_COPY,
  AUCTION_LOT_FACTS,
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
import { navigateToStory, ORDER_DETAILS_STORY_ID } from "./workbench-story-nav";

const LIVE_BID_INTERVAL_MS = 8_000;

const AUCTION_LOT_MARKET_COMPS = {
  title: "Market price",
  range: "HK$46,800–HK$171,600",
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
  const watchLocked = hasBidOnListing(view);

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
      <Toast position="bottom-right" />
      <AuctionLotDetailsPageShell
        header={
          <ListingLotHeader
            auctionHref={AUCTION_LISTING_HREF}
            copy={AUCTION_LOT_DETAILS_COPY.header}
            onUnwatchedToastAction={
              view.closed ? undefined : () => setWatched(true)
            }
            onWatchToggle={
              view.closed
                ? undefined
                : () => {
                    if (watchLocked) return;
                    setWatched((current) => !current);
                  }
            }
            onWatchedToastAction={
              view.closed
                ? undefined
                : () => {
                    /* Preview stand-in: production opens My Auctions. */
                  }
            }
            title={AUCTION_LOT.title}
            watched={view.closed ? false : watched || watchLocked}
            watchLocked={view.closed ? false : watchLocked}
          />
        }
      >
        <ListingLotGallery images={AUCTION_LOT.images} />
        <ListingAuctionCardSidebar
          badges={AUCTION_LOT_BADGES}
          bidCardFooter={
            auctionLotShowsLinkedPaymentMethod(state) ? (
              paymentLinked ? (
                <PaymentMethodRow
                  brand={AUCTION_LOT_LINKED_PAYMENT_METHOD.brand}
                  copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
                  maskedNumber={AUCTION_LOT_LINKED_PAYMENT_METHOD.maskedNumber}
                />
              ) : (
                <PaymentMethodEmptyState
                  copy={LISTING_BID_ENROLLMENT_DEMO_COPY}
                  onLink={() => setSetupOpen(true)}
                />
              )
            ) : undefined
          }
          copy={AUCTION_LOT_DETAILS_COPY.sidebar}
          description={AUCTION_LOT.description}
          facts={AUCTION_LOT_FACTS}
          history={history}
          historyResetKey={state}
          locale={FIXTURE_SHIPPED_LOCALE}
          marketComps={view.closed ? undefined : AUCTION_LOT_MARKET_COMPS}
          onCommitMaximum={requestBidAction}
          onPlaceBid={requestBidAction}
          onViewOrderDetails={() => navigateToStory(ORDER_DETAILS_STORY_ID)}
          recentBidsAccessory={
            <ListingUserBidHistory
              activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
              copy={AUCTION_LOT_DETAILS_COPY.userBidHistory}
              locale={FIXTURE_SHIPPED_LOCALE}
              {...userBidHistoryForState(state)}
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
