import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../shared/flow-container";
import {
  AutomaticBiddingListingDemo,
  type AutomaticBiddingListingDemoMode,
} from "./automatic-bidding-demo";
import { LiveCountdownDemo } from "./live-countdown-demo";

const meta = {
  title: "Auction Listing/ListingBidPanel/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const AUTOMATIC_MAXIMUM_CASES: ReadonlyArray<
  readonly [string, AutomaticBiddingListingDemoMode]
> = [
  ["Set a first maximum", "first"],
  ["Leading with a maximum", "leading"],
  ["Maximum overtaken", "overtaken"],
  ["Accepted but not leading", "accepted-not-leading"],
];

export const Countdown: Story = {
  render: () => <LiveCountdownDemo />,
};

export const AutomaticMaximum: Story = {
  render: () => (
    <FlowContainer
      cases={AUTOMATIC_MAXIMUM_CASES}
      description={
        <p>
          These cases distinguish an initial maximum, a leading maximum, an
          overtaken maximum, and a bid that was accepted without becoming the
          leader. Each card must make the bidder's current standing and safe
          next action clear, so a private maximum is never mistaken for the
          current bid or a guarantee of winning.
        </p>
      }
    >
      {(mode) => <AutomaticBiddingListingDemo mode={mode} />}
    </FlowContainer>
  ),
};
