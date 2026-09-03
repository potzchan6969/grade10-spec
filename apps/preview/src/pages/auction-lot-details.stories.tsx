import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BIDDING_STATE_LABELS,
  type BiddingState,
} from "./auction-lot-details-content";
import { AuctionLotDetailsPage } from "./auction-lot-details-page";

const meta = {
  title: "Pages/Auction Lot Details",
  component: AuctionLotDetailsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Auction lot detail page (Auction Card sidebar) aligned to Figma Product Detail shell and Auction block. Synthetic fixture data; distinct from legacy ListingDetails / Listing Product stories. For bid-card-only enrollment (sign-in, age, payment), see Auction Listing → Bid Panel.",
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
    expect(canvas.getByText("Set maximum (current: HK$8,000)")).toBeVisible();
    expect(
      canvas.getByText("At least HK$8,001 (your maximum + HK$1)"),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Your bid history" }),
    ).toBeVisible();
    expect(canvas.getByText("You")).toBeVisible();
    expect(
      canvas.queryByRole("dialog", { name: "Bid History" }),
    ).not.toBeInTheDocument();
  },
};

export const Opens: Story = { args: { state: "opens" } };
export const LiveNoBids: Story = {
  args: { state: "live-no-bids" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeVisible();
    expect(canvas.getAllByText("No bids yet").length).toBeGreaterThan(0);
    expect(canvas.getByText("Linked Card")).toBeVisible();
    expect(canvas.getByText("•••• 4242")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Your bid history" }),
    ).not.toBeInTheDocument();
  },
};
export const LiveManual: Story = { args: { state: "live-manual" } };
export const LiveAutoOutbid: Story = {
  args: { state: "live-auto-outbid" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("At least HK$8,500 (current bid + HK$250)"),
    ).toBeVisible();
  },
};
export const ClosedSold: Story = { args: { state: "closed-sold" } };
export const ClosedWonPaymentDue: Story = {
  args: { state: "closed-won-payment-due" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeVisible();
  },
};
export const ClosedWonSettled: Story = {
  args: { state: "closed-won-settled" },
};
export const ClosedLost: Story = { args: { state: "closed-lost" } };
export const ClosedUnsold: Story = { args: { state: "closed-unsold" } };
