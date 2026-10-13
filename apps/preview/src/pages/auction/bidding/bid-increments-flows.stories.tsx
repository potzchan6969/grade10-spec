import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  BID_FIXTURE_LOT,
  buildListingAuctionBidView,
} from "../../listing-auction-bid-fixtures";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_READY,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";

const meta = {
  title: "Auction/Bidding/Flows/Bid Increments",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LIVE_VIEW = buildListingAuctionBidView("live-manual");

const CASES: ReadonlyArray<readonly [string, ListingBidEnrollmentSnapshot]> = [
  [
    "Collector bids at the lot’s current price",
    {
      ...ENROLLMENT_SNAPSHOT_READY,
      fixtureState: "live-manual",
      viewOverride: LIVE_VIEW,
    },
  ],
  [
    "Collector bids up to the currency ceiling",
    {
      ...ENROLLMENT_SNAPSHOT_READY,
      fixtureState: "live-manual",
      viewOverride: {
        ...LIVE_VIEW,
        ceilingMinor:
          LIVE_VIEW.currentBidMinor + BID_FIXTURE_LOT.incrementMinor,
      },
    },
  ],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title]) => [
  title,
  "Current Bid",
]);

/** The bid card offers the next bid for the lot’s price and no bid above the ceiling. */
export const NextBid: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-bid-increments-US-01",
      "grade10-site-auction-bid-increments-US-02",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The bid card offers a next bid one increment above the lot’s current
          price. With the currency ceiling one increment away, the next bid is
          the ceiling itself, and a custom maximum typed above the ceiling is
          refused as it is typed, so no bid above the ceiling can be submitted.
        </p>
      }
    >
      {(snapshot) => (
        <ListingBidEnrollmentCardPreview
          onChangePayment={() => undefined}
          onLinkPayment={() => undefined}
          snapshot={snapshot}
        />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
