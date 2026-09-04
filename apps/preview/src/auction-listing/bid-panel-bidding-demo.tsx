import {
  FIXTURE_SHIPPED_LOCALE,
  formatMoney,
  type ListingAuctionBidView,
  type ListingAuctionStanding,
  type ListingBidHistoryRow,
  minNextBidMinor,
} from "@grade10/ui";
import { FIXTURE_LIVE_BID_AT_MS } from "@grade10/ui/lib/datetime-fixtures";
import { FlowContainer } from "../../../../packages/ui/src/blocks/shared/flow-container";
import { BID_FIXTURE_LOT } from "./listing-auction-bid-fixtures";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { useListingBidEnrollment } from "./use-listing-bid-enrollment";

const YOU = "you@example.com";
const STARTING_BID_MINOR = BID_FIXTURE_LOT.startingBidMinor;
const LIVE_INCREMENT_MINOR = BID_FIXTURE_LOT.incrementMinor;
const AUTO_CURRENT_MINOR = BID_FIXTURE_LOT.currentBidMinor;
const AUTO_MAXIMUM_MINOR = BID_FIXTURE_LOT.viewerMaximumMinor;
const AUTO_OVERTAKEN_MINOR =
  BID_FIXTURE_LOT.viewerMaximumMinor + BID_FIXTURE_LOT.incrementMinor;

type ScriptBid = {
  initials: string;
  amountMinor: number;
  acceptedAtMs: number;
  isViewer?: boolean;
};

type BiddingCase = {
  history: readonly ListingBidHistoryRow[];
  view: ListingAuctionBidView;
};

const SCRIPT: readonly ScriptBid[] = [
  {
    initials: "alex@example.com",
    amountMinor: STARTING_BID_MINOR,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[0],
  },
  {
    initials: "mike@example.com",
    amountMinor: STARTING_BID_MINOR + LIVE_INCREMENT_MINOR,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[1],
  },
  {
    initials: YOU,
    amountMinor: STARTING_BID_MINOR + LIVE_INCREMENT_MINOR * 2,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[2],
    isViewer: true,
  },
  {
    initials: "sam@example.com",
    amountMinor: STARTING_BID_MINOR + LIVE_INCREMENT_MINOR * 3,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[3],
  },
  {
    initials: YOU,
    amountMinor: STARTING_BID_MINOR + LIVE_INCREMENT_MINOR * 4,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[4],
    isViewer: true,
  },
  {
    initials: "alex@example.com",
    amountMinor: STARTING_BID_MINOR + LIVE_INCREMENT_MINOR * 5,
    acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[5],
  },
];

const AUTO_YOU_CURRENT: ListingBidHistoryRow = {
  id: "bid-you-current",
  initials: YOU,
  amountMinor: AUTO_CURRENT_MINOR,
  acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[4],
  isViewer: true,
};

const AUTO_MIKE_PRIOR: ListingBidHistoryRow = {
  id: "bid-mike-prior",
  initials: "mike@example.com",
  amountMinor: AUTO_CURRENT_MINOR - LIVE_INCREMENT_MINOR,
  acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[1],
};

const AUTO_ALEX_PRIOR: ListingBidHistoryRow = {
  id: "bid-alex-prior",
  initials: "alex@example.com",
  amountMinor: AUTO_CURRENT_MINOR - LIVE_INCREMENT_MINOR * 2,
  acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[0],
};

const AUTO_HISTORY: ListingBidHistoryRow[] = [
  AUTO_YOU_CURRENT,
  AUTO_MIKE_PRIOR,
  AUTO_ALEX_PRIOR,
];

function money(minor: number) {
  return formatMoney(minor, BID_FIXTURE_LOT.currency, {
    locale: FIXTURE_SHIPPED_LOCALE,
  });
}

function bidCountLabel(count: number) {
  return count === 1 ? `${count} bid` : `${count} bids`;
}

function liveView(
  overrides: Partial<ListingAuctionBidView> &
    Pick<ListingAuctionBidView, "currentBidMinor" | "hasBids" | "standing">,
): ListingAuctionBidView {
  const incrementMinor = overrides.incrementMinor ?? LIVE_INCREMENT_MINOR;
  const hasBids = overrides.hasBids;
  const currentBidMinor = overrides.currentBidMinor;
  return {
    currency: BID_FIXTURE_LOT.currency,
    headerLabel: "Auction",
    live: true,
    opens: false,
    closed: false,
    isUnsold: false,
    showBidActions: true,
    priceLabel: hasBids ? "Current Bid" : "Starting bid",
    bidCount: overrides.bidCount ?? 0,
    bidCountLabel: bidCountLabel(overrides.bidCount ?? 0),
    countdown: "6m 9s",
    countdownSeconds: 6 * 60 + 9,
    countdownFormat: "short",
    extended: false,
    viewerMaximumMinor: undefined,
    suggestedMaxMinor: AUTO_MAXIMUM_MINOR,
    minBidMinor: minNextBidMinor(
      currentBidMinor,
      incrementMinor,
      hasBids,
      STARTING_BID_MINOR,
    ),
    incrementMinor,
    ...overrides,
  };
}

function historyOf(bids: readonly ScriptBid[]): ListingBidHistoryRow[] {
  return [...bids]
    .reverse()
    .slice(0, 3)
    .map((bid, index) => ({
      id: `${bid.initials}-${bid.amountMinor}-${index}`,
      initials: bid.initials,
      amountMinor: bid.amountMinor,
      acceptedAtMs: bid.acceptedAtMs,
      isViewer: bid.isViewer,
    }));
}

function liveStanding(bids: readonly ScriptBid[]): ListingAuctionStanding {
  const yours = bids.findLast((bid) => bid.isViewer);
  if (!yours) return "none";
  return bids.at(-1)?.isViewer ? "leading-manual" : "outbid";
}

function liveCaption(bids: readonly ScriptBid[]): string {
  const lead = bids.at(-1);
  if (!lead) return "Starting bid";
  const amount = money(lead.amountMinor);
  if (lead.isViewer) return `Your bid · Highest bid · ${amount}`;
  if (bids.some((bid) => bid.isViewer)) return `Your bid · Outbid · ${amount}`;
  return `Current bid · ${amount}`;
}

function liveCase(bids: readonly ScriptBid[]): BiddingCase {
  const lead = bids.at(-1);
  return {
    history: historyOf(bids),
    view: liveView({
      hasBids: bids.length > 0,
      currentBidMinor: lead?.amountMinor ?? STARTING_BID_MINOR,
      bidCount: bids.length,
      bidCountLabel: bidCountLabel(bids.length),
      standing: liveStanding(bids),
    }),
  };
}

function autoCase({
  currentBidMinor,
  viewerMaximumMinor,
  standing,
  history,
  incrementMinor = BID_FIXTURE_LOT.incrementMinor,
}: {
  currentBidMinor: number;
  viewerMaximumMinor?: number;
  standing: ListingAuctionStanding;
  history: readonly ListingBidHistoryRow[];
  incrementMinor?: number;
}): BiddingCase {
  return {
    history,
    view: liveView({
      hasBids: history.length > 0,
      currentBidMinor,
      bidCount: Math.max(history.length, standing === "none" ? 0 : 3),
      bidCountLabel: bidCountLabel(
        Math.max(history.length, standing === "none" ? 0 : 3),
      ),
      standing,
      viewerMaximumMinor,
      incrementMinor,
      minBidMinor: minNextBidMinor(
        currentBidMinor,
        incrementMinor,
        history.length > 0,
        STARTING_BID_MINOR,
      ),
    }),
  };
}

const LIVE_CASES: ReadonlyArray<readonly [string, BiddingCase]> = [
  [liveCaption([]), liveCase([])],
  ...SCRIPT.map((_, index) => {
    const bids = SCRIPT.slice(0, index + 1);
    return [liveCaption(bids), liveCase(bids)] as const;
  }),
];

const AUTO_CASES: ReadonlyArray<readonly [string, BiddingCase]> = [
  [
    "Set a first maximum",
    autoCase({
      currentBidMinor: STARTING_BID_MINOR,
      standing: "none",
      history: [],
    }),
  ],
  [
    "Leading with a maximum",
    autoCase({
      currentBidMinor: AUTO_CURRENT_MINOR,
      viewerMaximumMinor: AUTO_MAXIMUM_MINOR,
      standing: "leading-max",
      history: AUTO_HISTORY,
    }),
  ],
  [
    "Maximum overtaken",
    autoCase({
      currentBidMinor: AUTO_OVERTAKEN_MINOR,
      viewerMaximumMinor: AUTO_MAXIMUM_MINOR,
      standing: "outbid",
      history: [
        {
          id: "bid-mike-825",
          initials: "mike@example.com",
          amountMinor: AUTO_OVERTAKEN_MINOR,
          acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[5],
        },
        ...AUTO_HISTORY,
      ],
    }),
  ],
  [
    "Maximum accepted · not leading",
    autoCase({
      currentBidMinor: AUTO_CURRENT_MINOR,
      viewerMaximumMinor: AUTO_CURRENT_MINOR,
      standing: "outbid",
      history: [
        {
          id: "bid-mike-480",
          initials: "mike@example.com",
          amountMinor: AUTO_CURRENT_MINOR,
          acceptedAtMs: FIXTURE_LIVE_BID_AT_MS[5],
        },
        AUTO_MIKE_PRIOR,
        AUTO_ALEX_PRIOR,
      ],
    }),
  ],
];

const BIDDING_CASES: ReadonlyArray<readonly [string, BiddingCase]> = [
  ...LIVE_CASES,
  ...AUTO_CASES,
];

function BiddingPreview({
  history,
  view,
  title,
}: BiddingCase & { title: string }) {
  const hasPlacedBid =
    view.viewerMaximumMinor != null || history.some((row) => row.isViewer);
  const { session, actions, snapshot } = useListingBidEnrollment(
    `bidding:${title}`,
    {
      hasAccountPayment: true,
      hasPlacedBid,
      paymentLinked: true,
      signedIn: true,
    },
  );

  return (
    <ListingBidEnrollmentCardPreview
      history={history}
      historyResetKey={`${title}:${view.standing}:${view.currentBidMinor}`}
      onBidSubmit={actions.handleBidSubmit}
      onChangePayment={actions.openChangePayment}
      onLinkPayment={actions.openSetup}
      onSetupContinue={actions.handleSetupContinue}
      onPaymentSetupDismissed={actions.dismissPaymentSetup}
      onSignInComplete={actions.completeSignIn}
      onSignInOpenChange={actions.setSignInOpen}
      signInOpen={session.signInOpen}
      snapshot={{
        ...snapshot,
        viewOverride: view,
      }}
    />
  );
}

/** Live bids, then auto-bidding standings, on the signed-in bid panel. */
function BidPanelBiddingDemo() {
  return (
    <FlowContainer
      cases={BIDDING_CASES}
      description={
        <p>
          The live sequence covers a bidder moving from no participation to
          leading, then being outbid, then leading again. The auto-bidding cases
          that follow distinguish an initial maximum, a leading maximum, an
          overtaken maximum, and a maximum that was accepted without taking the
          lead. Each card must replace price, history, standing, and the safe
          next action together so a private maximum is never mistaken for the
          current bid or a guarantee of winning. Quick-maximum presets and
          Place Bid are live: they use the same enrollment session as Bid
          Panel Interactive. Mechanism copy stays as always-on subtext under
          the section heading.
        </p>
      }
    >
      {(value, title) => (
        <BiddingPreview key={title} title={title} {...value} />
      )}
    </FlowContainer>
  );
}

export { BIDDING_CASES, BidPanelBiddingDemo };
