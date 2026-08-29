import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { LiveBiddingDemo } from "./live-bidding-demo";

/**
 * One live lot, several bidders. Transition starts at the starting bid and
 * steps through bid standings; placing the first bid automatically watches it.
 */
const meta = {
  title: "Auction Listing/ListingBidPanel/Flows",
  component: LiveBiddingDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
} satisfies Meta<typeof LiveBiddingDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bidding: Story = {};

/** Hidden from the sidebar so opening Bidding is not left on the last bid. */
export const BiddingWalkthrough: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Starting bid").length).toBeGreaterThan(0);
    expect(canvas.queryByText(/Highest Bid|Outbid/)).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText("HK$1,200.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText(/Bidder 2/).length).toBeGreaterThan(0);
    expect(
      canvas.getByRole("button", { name: "Watching" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText("HK$1,250.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("2 Bids").length).toBeGreaterThan(0);
    expect(canvas.getAllByText(/Bidder 1/).length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/Highest Bid/i).length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,300.00").length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,400.00").length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/Highest Bid/i).length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,600.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("6 Bids").length).toBeGreaterThan(0);

    /* Expanded lays every step out at once, so a step's caption and the panel
       under it both say what the amount on show is. */
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByText("Starting bid").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,400.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,500.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,600.00").length).toBeGreaterThan(0);
  },
};
