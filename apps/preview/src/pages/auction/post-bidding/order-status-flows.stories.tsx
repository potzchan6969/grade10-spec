import { AuctionRecord, type AuctionRecordRowProps } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import {
  ORDER_STATUS_RECORD_COPY,
  ORDER_STATUS_ROWS,
} from "./order-status-flow-content";

const meta = {
  title: "Auction/Post Bidding/Flows/Order Status",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<
  readonly [string, readonly AuctionRecordRowProps[]]
> = [
  ["Winner finds setup is next", ORDER_STATUS_ROWS.awaitingSetup],
  ["Winner finds setup overdue", ORDER_STATUS_ROWS.setupOverdue],
  ["Winner finds payment is next", ORDER_STATUS_ROWS.pendingPayment],
  ["Winner finds payment overdue", ORDER_STATUS_ROWS.paymentOverdue],
  ["Winner finds the order partly paid", ORDER_STATUS_ROWS.partiallyPaid],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, rows]) => [
  title,
  rows[0]?.stateLabel ?? title,
]);

/** The order status each won lot shows on My Auctions, and what it asks next. */
export const WhatIsNext: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-account-record-US-09",
      "auction-status-US-01",
      "auction-status-US-02",
      "auction-status-US-03",
      "auction-status-US-04",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          Each won lot shows one status and its action. Awaiting Setup and
          Pending Payment are the next steps. Setup Overdue and Payment Overdue
          mark a missed deadline. Partially Paid ends self-service payment. The
          row names the state and nothing else needs reading to act.
        </p>
      }
    >
      {(rows) => (
        <AuctionRecord biddingItems={rows} copy={ORDER_STATUS_RECORD_COPY} />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
