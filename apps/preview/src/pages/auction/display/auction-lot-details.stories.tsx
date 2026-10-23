import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BIDDING_STATE_LABELS,
  type BiddingState,
} from "../../auction-lot-details-content";
import { AuctionLotDetailsPage } from "./auction-lot-details-page";

const meta = {
  title: "Auction/Display/Screens/Lot Details",
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
  parameters: {
    verification: { caseId: "vc_2f984f7b-e96d-421c-af78-c7f31ffbe791" },
  },
  args: { state: "live-auto-leading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: /Carddass/ })).toBeVisible();
    expect(canvas.getByText("Raise your private maximum")).toBeVisible();
    expect(canvas.getByText(/Max: US\$95,000/)).toBeVisible();
    expect(canvas.getByText(/Leading · US\$58,000/)).toBeVisible();
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(canvas.getAllByText(/vs max/)).toHaveLength(3);
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Your bidding" })).toBeVisible();
    expect(canvas.getByText("You")).toBeVisible();
    expect(canvas.queryByText("Enable auto-bidding")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("dialog", { name: "Your bidding" }),
    ).not.toBeInTheDocument();
  },
};

export const Opens: Story = {
  parameters: {
    verification: { caseId: "vc_2b9deaa9-3861-4487-b21d-a5be4fc6a4cb" },
  },
  args: { state: "opens" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Auction Details")).toBeVisible();
    expect(canvas.getByText("About This Auction")).toBeVisible();
    expect(canvas.queryByText("Starting bid")).not.toBeInTheDocument();
    const reachable = canvas
      .queryAllByText("No bids yet")
      .filter((element) => element.closest("[inert]") == null);
    expect(reachable).toHaveLength(0);
    expect(canvas.queryByText("Opens soon")).not.toBeInTheDocument();
    expect(canvas.getByText("Opens in")).toBeVisible();
  },
};
export const LiveNoBids: Story = {
  parameters: {
    verification: { caseId: "vc_cb78b3fb-b7f9-46a8-a235-fef8a2847987" },
  },
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
export const LiveManual: Story = {
  parameters: {
    verification: { caseId: "vc_ce34c9a7-496d-43c3-8ace-d01a81cbf8a1" },
  },
  args: { state: "live-manual" },
};
export const LiveAutoOutbid: Story = {
  parameters: {
    verification: { caseId: "vc_7aaeccfc-f5cc-4422-ad9c-537cdbd0c604" },
  },
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
  parameters: {
    verification: { caseId: "vc_2ff7bedb-ce5f-405d-a59f-de5def5f17cb" },
  },
  args: { state: "closed-sold" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeVisible();
    expect(canvas.getByText("Closed")).toBeVisible();
    expect(canvas.getByText("30 Aug 2026")).toBeVisible();
    expect(canvas.getByText("Closed at 17:15 HKT. Ran 7d 15h")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedWonPaymentDue: Story = {
  parameters: {
    verification: { caseId: "vc_dd2d8fd6-214b-4d14-b1a5-1612f33308e2" },
  },
  name: "Closed — awaiting setup",
  args: { state: "closed-won-payment-due" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Complete Order Setup" }),
    ).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedWonSettled: Story = {
  parameters: {
    verification: { caseId: "vc_d0f4c9cd-9a71-4960-b0cd-1125a53760b8" },
  },
  args: { state: "closed-won-settled" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedLost: Story = {
  parameters: {
    verification: { caseId: "vc_aa1bc036-4062-4ccd-a3f3-27c9c3fd058f" },
  },
  args: { state: "closed-lost" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
export const ClosedUnsold: Story = {
  parameters: {
    verification: { caseId: "vc_2955d200-a7e5-4f1e-9ad1-6758029b23b7" },
  },
  args: { state: "closed-unsold" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByText("Ended").length).toBeGreaterThan(0);
    expect(canvas.queryByText("Unsold")).not.toBeInTheDocument();
    expect(canvas.getByText("No bids")).toBeInTheDocument();
    for (const empty of canvas.queryAllByText("No bids yet")) {
      expect(empty).not.toBeVisible();
    }
  },
};
