import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { LiveBiddingDemo } from "./live-bidding-demo";

/**
 * One live lot, several bidders. Transition starts at the starting bid and
 * steps through bid standings; placing the first bid automatically watches it.
 */
const meta = {
  title: "Auction Listing/ListingBidPanel",
  component: LiveBiddingDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
} satisfies Meta<typeof LiveBiddingDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveBidding: Story = {};

/** Hidden from the sidebar so opening Live Bidding is not left on the last bid. */
export const LiveBiddingWalkthrough: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.queryByText(/Highest Bid|Outbid/)).not.toBeInTheDocument();
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText("HK$1,200.00")).toBeInTheDocument();
    expect(canvas.getAllByText(/Bidder 2/).length).toBeGreaterThan(0);
    expect(
      canvas.getByRole("button", { name: "Watching" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(/Highest Bid/i)).toBeInTheDocument();
    expect(canvas.getByText("HK$1,300.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,400.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(/Highest Bid/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,600.00")).toBeInTheDocument();
    expect(canvas.getByText("5 Bids")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText("HK$1,200.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$1,500.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$1,600.00")).toBeInTheDocument();
  },
};
