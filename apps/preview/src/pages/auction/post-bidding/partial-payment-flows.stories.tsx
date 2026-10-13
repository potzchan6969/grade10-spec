import { AuctionWinnerOrder } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import {
  WINNER_ORDER_CONTENTS,
  type WinnerOrderContent,
} from "./winner-order-content";
import { winnerOrderFlowView } from "./winner-order-flow-view";

const meta = {
  title: "Auction/Post Bidding/Flows/Partial Payment",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, WinnerOrderContent]> = [
  ["Winner pays the invoice by card", WINNER_ORDER_CONTENTS.pending_payment],
  [
    "Grade10 collects the rest of the invoice",
    WINNER_ORDER_CONTENTS.partially_paid,
  ],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, content]) => [
  title,
  content.statusLabel,
]);

/** Once part of the invoice is paid, the winner waits and no longer pays here. */
export const WaitForRemainder: Story = {
  parameters: {
    journeys: [
      "winner-order-US-20",
      "auction-status-US-02",
      "grade10-site-auction-account-record-US-08",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A part payment moves the order to Partially Paid. Pay with Card ends
          for good, and an alert says only part of the invoice is settled, with
          Contact Us and no balance figure. Each payment adds a receipt. The
          winner waits while Grade10 collects the rest.
        </p>
      }
    >
      {(content) => <AuctionWinnerOrder {...winnerOrderFlowView(content)} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
