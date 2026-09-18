import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionOrderEmpty } from "./auction-order-empty";

const meta = {
  title: "Auction Order/AuctionOrderEmpty",
  component: AuctionOrderEmpty,
  tags: ["autodocs"],
  args: {
    title: "No auction orders yet",
    description: "Won lots appear here after an auction closes.",
    actionLabel: "My Auctions",
    onAction: fn(),
  },
} satisfies Meta<typeof AuctionOrderEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "My Auctions" }));
    expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};
