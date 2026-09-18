import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionOrderRow } from "./auction-order-row";

const IMAGE = new URL(
  "../store-order-history/product.fixture.png",
  import.meta.url,
).href;

const meta = {
  title: "Auction Order/AuctionOrderRow",
  component: AuctionOrderRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: { viewLot: "View lot", nextAction: "Pay Invoice" },
    title: "1999 Base Set Charizard PSA 9",
    auction: "September Collectors Auction",
    winningBid: "HK$12,800",
    status: "Pending Payment",
    imageSrc: IMAGE,
    imageAlt: "1999 Base Set Charizard PSA 9",
    lotHref: "#lot-charizard",
    onAction: fn(),
  },
} satisfies Meta<typeof AuctionOrderRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReportsSuppliedAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Pay Invoice" }));
    expect(args.onAction).toHaveBeenCalledTimes(1);
    expect(canvas.getByRole("link", { name: "View lot" })).toHaveAttribute(
      "href",
      "#lot-charizard",
    );
  },
};
