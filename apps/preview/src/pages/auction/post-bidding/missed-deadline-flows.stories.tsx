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
  title: "Auction/Post Bidding/Flows/Missed Deadline",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, WinnerOrderContent]> = [
  [
    "Winner misses the setup deadline",
    WINNER_ORDER_CONTENTS.awaiting_address_expired,
  ],
  [
    "Winner misses the payment deadline",
    WINNER_ORDER_CONTENTS.pending_payment_expired,
  ],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, content]) => [
  title,
  content.statusLabel,
]);

/** Past each deadline the order keeps its status and drops self-service actions. */
export const OverdueSetupAndPayment: Story = {
  parameters: {
    journeys: [
      "winner-order-US-05",
      "winner-order-US-07",
      "auction-status-US-01",
      "auction-status-US-03",
      "auction-status-US-04",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A missed address deadline reads Setup Overdue and the setup alert
          gives the date that passed. A missed payment deadline keeps Pending
          Payment with the expired invoice, and the summary alert gives the date
          that passed. Neither offers Pay with Card. The winner contacts Grade10
          to resolve it.
        </p>
      }
    >
      {(content) => <AuctionWinnerOrder {...winnerOrderFlowView(content)} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
