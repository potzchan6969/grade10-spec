import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { LiveBiddingDemo } from "./live-bidding-demo";

/**
 * One live lot, several bidders. Transition starts on the first case and
 * steps one panel with Next / Reset; Expanded lays every ledger beat in a row.
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
    expect(canvas.getByText("No bids yet")).toBeInTheDocument();
    expect(
      canvas.queryByText(/highest bidder|outbid/i),
    ).not.toBeInTheDocument();
    expect(canvas.getByText("Waiting")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Show bid history" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText("HK$1,200.00")).toBeInTheDocument();
    expect(canvas.getAllByText(/Bidder 2/).length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(/highest bidder/i)).toBeInTheDocument();
    expect(canvas.getByText("HK$1,300.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,400.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(/highest bidder/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,600.00")).toBeInTheDocument();
    expect(canvas.getByText("5 bids")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getByText("Waiting")).toBeInTheDocument();
    expect(canvas.getByText("Bidder 2 · HK$1,200.00")).toBeInTheDocument();
    expect(canvas.getByText("You · HK$1,500.00")).toBeInTheDocument();
    expect(canvas.getByText("Bidder 2 · HK$1,600.00")).toBeInTheDocument();
  },
};
