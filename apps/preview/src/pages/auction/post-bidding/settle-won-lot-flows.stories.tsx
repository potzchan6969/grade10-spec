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
  title: "Auction/Post Bidding/Flows/Settle A Won Lot",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, WinnerOrderContent]> = [
  [
    "Winner sets up delivery and billing",
    WINNER_ORDER_CONTENTS.awaiting_address,
  ],
  ["Grade10 prepares the invoice", WINNER_ORDER_CONTENTS.preparing_invoice],
  ["Winner pays the invoice by card", WINNER_ORDER_CONTENTS.pending_payment],
  ["Grade10 checks a bank transfer", WINNER_ORDER_CONTENTS.payment_verifying],
];

const STEPS: readonly FlowWalkStep[] = CASES.map(([title, content]) => [
  title,
  content.statusLabel,
]);

/** Setup, invoice and payment for a lot the collector won. */
export const SetupToPayment: Story = {
  parameters: {
    journeys: [
      "winner-order-US-01",
      "winner-order-US-04",
      "winner-order-US-09",
      "winner-order-US-22",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The winner settles a won lot in order. Setup asks for delivery and
          billing and nothing is due yet. The invoice follows once setup is
          done. Pay by card opens the Pay with Card action with its deadline. A
          bank transfer shows Payment Verifying while Grade10 checks the proof.
          Each step must show what is due and by when.
        </p>
      }
    >
      {(content) => <AuctionWinnerOrder {...winnerOrderFlowView(content)} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => walkFlowCases(canvasElement, STEPS),
};
