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
          "Auction lot detail page (Auction Card sidebar) aligned to Figma Product Detail shell and Auction block. Synthetic fixture data. Block-only composition: Auction Listing → Listing Product; About-this-lot alone: Auction Listing → ListingLotMeta. For bid-card-only enrollment (sign-in, age, payment), see Auction Listing → Bid Panel.",
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
    expect(canvas.getByRole("heading", { name: /Carddass/ })).toBeVisible();
    expect(canvas.getByText("Raise your private maximum")).toBeVisible();
    expect(canvas.getByText(/Max: HK\$95,000/)).toBeVisible();
    expect(canvas.getByText(/Leading · HK\$58,000/)).toBeVisible();
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(canvas.getAllByText(/vs max/)).toHaveLength(3);
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Your bidding" }),
    ).toBeVisible();
    expect(canvas.getByText("You")).toBeVisible();
    expect(canvas.queryByText("Enable auto-bidding")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("dialog", { name: "Your bidding" }),
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
    expect(canvas.getByText("Set your private maximum")).toBeVisible();
    expect(canvas.getByText("Min. bid")).toBeVisible();
    expect(canvas.getByRole("button", { name: /^Set maximum/ })).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Your bidding" }),
    ).not.toBeInTheDocument();
  },
};
export const LiveManual: Story = { args: { state: "live-manual" } };
export const LiveAutoOutbid: Story = {
  args: { state: "live-auto-outbid" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText(/vs current/)).toHaveLength(2);
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    ).toBeVisible();
  },
};
export const ClosedSold: Story = {
  args: { state: "closed-sold" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeVisible();
    expect(canvas.getByText("Closed")).toBeVisible();
    expect(canvas.getByText("30 Aug 2026")).toBeVisible();
    expect(canvas.getByText("Closed at 17:15. Ran 7d 15h")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedWonPaymentDue: Story = {
  args: { state: "closed-won-payment-due" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Continue" })).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedWonSettled: Story = {
  args: { state: "closed-won-settled" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedLost: Story = {
  args: { state: "closed-lost" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedUnsold: Story = {
  args: { state: "closed-unsold" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
