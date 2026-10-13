import { AuctionRecord, type AuctionRecordRowProps } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import {
  AUCTION_RECORD_COPY,
  POST_AUCTION_BIDDING,
} from "./my-auctions-content";

const meta = {
  title: "Auction/Bidding/Flows/My Auctions",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The one My Auctions row in a given state; the fixture carries one row per state. */
function rowInState(
  state: AuctionRecordRowProps["state"],
): AuctionRecordRowProps {
  const row = POST_AUCTION_BIDDING.find((item) => item.state === state);
  if (!row) throw new Error(`No My Auctions row in the "${state}" state`);
  return row;
}

const CASES: ReadonlyArray<
  readonly [string, readonly AuctionRecordRowProps[]]
> = [
  ["Collector sees where they stand on a lot", [rowInState("leading")]],
  ["Collector who loses is not charged", [rowInState("ended")]],
  [
    "Winner sees Setup Overdue on a won lot",
    [rowInState("awaiting_address_expired")],
  ],
  ["Winner revisits a partially paid order", [rowInState("partially_paid")]],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, rows]) => [
  title,
  rows[0]?.stateLabel ?? title,
]);

/** My Auctions reads each lot's price and result, and what the winner must do next. */
export const WhereIStand: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-account-record-US-02",
      "grade10-site-auction-account-record-US-04",
      "grade10-site-auction-account-record-US-08",
      "grade10-site-auction-account-record-US-09",
      "grade10-site-auction-account-record-US-10",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          Each row shows the lot, its current bid and its standing. A leading
          bid reads Leading. A lot that was lost reads Didn’t win, and the
          collector is not charged. A won lot shows its order state, so Setup
          Overdue and Partially Paid tell the winner what is owed.
        </p>
      }
    >
      {(rows) => (
        <AuctionRecord biddingItems={rows} copy={AUCTION_RECORD_COPY} />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
