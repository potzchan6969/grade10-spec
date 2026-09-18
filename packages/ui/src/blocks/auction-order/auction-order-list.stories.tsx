import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionOrderList } from "./auction-order-list";

const meta = {
  title: "Auction Order/AuctionOrderList",
  component: AuctionOrderList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: [
      {
        copy: { viewLot: "View lot", nextAction: "Complete Order Setup" },
        title: "1999 Base Set Charizard PSA 9",
        auction: "September Collectors Auction",
        winningBid: "HK$12,800",
        status: "Awaiting Setup",
        lotHref: "#lot-charizard",
        onAction: fn(),
      },
      {
        copy: { viewLot: "View lot", nextAction: "View detail" },
        title: "1986 World Cup Panini Sticker Album",
        auction: "Summer Sports Auction",
        winningBid: "HK$320",
        status: "Processing",
        lotHref: "#lot-sticker-album",
        onAction: fn(),
      },
    ],
    empty: {
      title: "No auction orders yet",
      description: "Won lots appear here after an auction closes.",
      actionLabel: "My Auctions",
      onAction: fn(),
    },
  },
} satisfies Meta<typeof AuctionOrderList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Empty: Story = {
  args: { items: [] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No auction orders yet")).toBeVisible();
    expect(
      canvas.queryByText("1999 Base Set Charizard PSA 9"),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "My Auctions" }));
    expect(args.empty.onAction).toHaveBeenCalledTimes(1);
  },
};
