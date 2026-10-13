import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { type FlowWalkStep, walkFlowCases } from "../flow-walk";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import {
  ENROLLMENT_SNAPSHOT_LINKED_CARD,
  ENROLLMENT_SNAPSHOT_READY,
  type ListingBidEnrollmentSnapshot,
} from "./listing-bid-enrollment-snapshots";

const meta = {
  title: "Auction/Bidding/Flows/Bid With Linked Card",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CASES: ReadonlyArray<readonly [string, ListingBidEnrollmentSnapshot]> = [
  [
    "Collector bids on the card already linked",
    ENROLLMENT_SNAPSHOT_LINKED_CARD,
  ],
  [
    "Collector raises a bid on the same card",
    { ...ENROLLMENT_SNAPSHOT_READY, fixtureState: "live-auto-leading" },
  ],
];

const STEPS: readonly FlowWalkStep[] = [
  [CASES[0][0], "Starting bid"],
  [CASES[1][0], /^Leading( ·|$)/],
];

/** A collector with a card on file bids and raises a bid without linking a card again. */
export const BidOnLinkedCard: Story = {
  parameters: {
    journeys: [
      "grade10-site-auction-bid-payment-method-US-01",
      "grade10-site-auction-bid-payment-method-US-02",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CASES}
      description={
        <p>
          The card already linked to the account is shown under the bid card, so
          the collector bids without linking it again. Once they lead, the same
          card stays linked while they raise their maximum, and no card is asked
          for twice.
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
