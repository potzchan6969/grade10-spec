import { AuctionRecord, type AuctionRecordRowProps } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import { AUCTION_RECORD_COPY } from "./my-auctions-content";
import {
  WATCHED_ALERTS_MUTED,
  WATCHED_LIVE_LOT,
} from "./watchlist-flow-content";

const meta = {
  title: "Auction/Bidding/Flows/Watchlist",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<
  readonly [string, readonly AuctionRecordRowProps[]]
> = [
  ["Collector watches a listing to come back to it", [WATCHED_LIVE_LOT]],
  ["Collector mutes alerts and keeps the watch", [WATCHED_ALERTS_MUTED]],
  ["Collector unwatches, so the listing leaves the list", []],
];

const STEPS: readonly FlowWalkStep[] = [
  [CASES[0][0], WATCHED_LIVE_LOT.title],
  [CASES[1][0], WATCHED_ALERTS_MUTED.title],
  [CASES[2][0], AUCTION_RECORD_COPY.emptyTitle, WATCHED_LIVE_LOT.title],
];

/** The listings a collector watches, with their alerts; an unwatched listing leaves the list. */
export const WatchedListings: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-watchlist-US-01",
      "grade10-site-auction-watchlist-US-02",
      "grade10-site-auction-watchlist-US-03",
      "grade10-site-auction-watchlist-US-05",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A watched listing sits on My Auctions with its status and email alerts
          on. Muting alerts keeps the watch and only changes the alerts.
          Unwatching removes the listing, and the list shows its empty state
          when nothing else is watched.
        </p>
      }
    >
      {(rows) => (
        <AuctionRecord
          biddingItems={[]}
          copy={AUCTION_RECORD_COPY}
          watchingItems={rows}
        />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
