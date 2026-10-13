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
  title: "Auction/Post Bidding/Flows/Follow To Delivery",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, WinnerOrderContent]> = [
  ["Grade10 prepares the shipment", WINNER_ORDER_CONTENTS.processing],
  ["Winner tracks the parcel", WINNER_ORDER_CONTENTS.shipped],
  ["Winner sees the lot delivered", WINNER_ORDER_CONTENTS.delivered],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, content]) => [
  title,
  content.statusLabel,
]);

/** A settled lot from preparation to delivery. */
export const ProcessingToDelivered: Story = {
  parameters: {
    journeys: [
      "winner-order-US-02",
      "winner-order-US-19",
      "grade10-site-auction-account-record-US-03",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          A paid lot moves through shipping. Preparing Shipment shows the
          shipping step with no tracking yet. Shipped adds the carrier tracking
          number and its link. Delivered closes the Order Progress with the
          completed date. The lot card and invoice stay on screen throughout.
        </p>
      }
    >
      {(content) => <AuctionWinnerOrder {...winnerOrderFlowView(content)} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
