import { ListingAuctionBidCard, ListingLotHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  AUCTION_LOT,
  AUCTION_LOT_DETAILS_COPY,
} from "../../auction-lot-details-content";
import {
  type BiddingState,
  bidHistoryForState,
  buildListingAuctionBidView,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
} from "../../listing-auction-bid-fixtures";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";

const meta = {
  title: "Auction/Display/Flows/Read A Lot",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The lot a collector reads, signed out: its header, its bid card and the public bids. */
function LotReadout({ state }: { state: BiddingState }) {
  return (
    <div className="flex flex-col gap-6">
      <ListingLotHeader
        copy={AUCTION_LOT_DETAILS_COPY.header}
        title={AUCTION_LOT.title}
      />
      <ListingAuctionBidCard
        bidEnrollment="signed-out"
        copy={LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY}
        history={bidHistoryForState(state).map((row) => ({
          ...row,
          isViewer: false,
        }))}
        historyResetKey={state}
        locale="en"
        onCommitMaximum={() => undefined}
        onPlaceBid={() => undefined}
        timeZone="Asia/Hong_Kong"
        view={buildListingAuctionBidView(state)}
      />
    </div>
  );
}

const CASES: ReadonlyArray<readonly [string, BiddingState]> = [
  ["Collector reads a lot at its own address", "live-no-bids"],
  ["Collector sees another bid without reloading", "live-manual"],
  ["Collector reads the sold result on a closed lot", "closed-sold"],
];

const STEPS: readonly FlowWalkStep[] = [
  ["Collector reads a lot at its own address", "Starting bid"],
  ["Collector sees another bid without reloading", "Current Bid"],
  ["Collector reads the sold result on a closed lot", "Winning bid"],
];

/** Opening a lot shows the lot as served; a live bid and the close update without a reload. */
export const ServedToClosed: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-listing-page-US-01",
      "grade10-site-auction-listing-page-US-04",
      "grade10-site-auction-listing-page-US-12",
      "grade10-site-auction-listing-page-US-14",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The lot reads the same way at its own address as it does after a
          script loads, with its starting bid and no bids yet. A new bid moves
          the current bid and appears in Recent Bids without a reload. A closed
          lot shows its winning bid and keeps its bids on screen so the result
          can be read.
        </p>
      }
    >
      {(state) => <LotReadout state={state} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
