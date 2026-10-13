import {
  AuctionRecord,
  ListingBidHistoryList,
  ListingUserBidHistory,
} from "@grade10/ui";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "@grade10/ui/lib/datetime-fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { AUCTION_LOT_DETAILS_COPY } from "../../auction-lot-details-content";
import {
  BID_FIXTURE_LOT,
  bidHistoryForState,
  userBidHistoryForState,
} from "../../listing-auction-bid-fixtures";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import {
  AUCTION_RECORD_COPY,
  POST_AUCTION_BIDDING,
} from "./my-auctions-content";

const meta = {
  title: "Auction/Bidding/Flows/Bidding History",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type HistoryStep =
  | { view: "index" }
  | { view: "listing" }
  | { view: "maximums" };

/** One of the three places a collector reads their bidding: the index, one lot's bids, their maximums. */
function HistoryView({ step }: { step: HistoryStep }) {
  if (step.view === "index") {
    return (
      <AuctionRecord
        biddingItems={POST_AUCTION_BIDDING.slice(0, 3)}
        copy={AUCTION_RECORD_COPY}
      />
    );
  }
  if (step.view === "listing") {
    return (
      <ListingBidHistoryList
        activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
        currency={BID_FIXTURE_LOT.currency}
        locale={FIXTURE_SHIPPED_LOCALE}
        rows={bidHistoryForState("live-manual")}
        timeZone={FIXTURE_TIME_ZONE}
      />
    );
  }
  const { bidRows, maximumRows } = userBidHistoryForState("live-manual");
  return (
    <ListingUserBidHistory
      activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
      bidRows={bidRows}
      copy={AUCTION_LOT_DETAILS_COPY.userBidHistory}
      locale={FIXTURE_SHIPPED_LOCALE}
      maximumRows={maximumRows}
      timeZone={FIXTURE_TIME_ZONE}
    />
  );
}

const CASES: ReadonlyArray<readonly [string, HistoryStep]> = [
  ["Collector reads their bidding index", { view: "index" }],
  ["Collector reads one lot’s combined history", { view: "listing" }],
  ["Collector reviews each maximum on the lot", { view: "maximums" }],
];

const STEPS: readonly FlowWalkStep[] = [
  [CASES[0][0], AUCTION_RECORD_COPY.title],
  [CASES[1][0], "You"],
  [CASES[2][0], AUCTION_LOT_DETAILS_COPY.userBidHistory.link],
];

/** A collector reads their bids from the index, from one lot, and as the maximums Grade10 accepted. */
export const ReadEveryBid: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-bidding-history-US-01",
      "grade10-site-auction-bidding-history-US-02",
      "grade10-site-auction-bidding-history-US-03",
      "grade10-site-auction-bidding-history-US-06",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The bidding index lists each lot with its standing. One lot’s history
          combines the public bids with the collector’s own. The maximums tab
          lists every private maximum Grade10 accepted, and the bids tab lists
          the bids Grade10 placed up to it. Each entry names its amount and the
          time it was accepted.
        </p>
      }
    >
      {(step) => <HistoryView step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
