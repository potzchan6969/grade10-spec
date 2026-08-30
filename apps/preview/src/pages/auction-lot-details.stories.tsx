import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AuctionLotDetailsPage } from "./auction-lot-details-page";
import {
  BIDDING_STATE_LABELS,
  type BiddingState,
} from "./auction-lot-details-content";

const meta = {
  title: "Pages/Auction Lot Details",
  component: AuctionLotDetailsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Auction lot detail page (Auction Card sidebar) aligned to Figma Product Detail shell and Auction block. Synthetic fixture data; distinct from legacy ListingDetails / Listing Product stories.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: Object.keys(BIDDING_STATE_LABELS) as BiddingState[],
      labels: BIDDING_STATE_LABELS,
    },
  },
} satisfies Meta<typeof AuctionLotDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveAutoLeading: Story = {
  args: { state: "live-auto-leading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: /Charizard/ })).toBeVisible();
    expect(canvas.getByText("Auction")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
  },
};

export const Opens: Story = { args: { state: "opens" } };
export const LiveNoBids: Story = { args: { state: "live-no-bids" } };
export const LiveManual: Story = { args: { state: "live-manual" } };
export const LiveAutoOvertaken: Story = { args: { state: "live-auto-overtaken" } };
export const ClosedSold: Story = { args: { state: "closed-sold" } };
export const ClosedWonPaymentDue: Story = {
  args: { state: "closed-won-payment-due" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeVisible();
  },
};
export const ClosedWonSettled: Story = { args: { state: "closed-won-settled" } };
export const ClosedLost: Story = { args: { state: "closed-lost" } };
export const ClosedUnsold: Story = { args: { state: "closed-unsold" } };
