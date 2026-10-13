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
  title: "Auction/Post Bidding/Flows/Closed Order",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, WinnerOrderContent]> = [
  ["Winner learns the order was cancelled", WINNER_ORDER_CONTENTS.cancelled],
  ["Winner sees the refund returned", WINNER_ORDER_CONTENTS.refunded],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, content]) => [
  title,
  content.statusLabel,
]);

/** A closed order keeps its lot and its outcome, with no progress steps. */
export const CancelledAndRefunded: Story = {
  parameters: {
    journeys: ["winner-order-US-13", "winner-order-US-14"],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A cancelled order reads Cancelled on its date, with Contact Us and no
          Order Progress. A refunded order shows Refunded, with the refund
          amount in the summary. Neither offers a payment action.
        </p>
      }
    >
      {(content) => <AuctionWinnerOrder {...winnerOrderFlowView(content)} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
