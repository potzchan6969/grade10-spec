import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  AUCTION_ITEM,
  MINE_ITEM_COPY,
  NOT_PRICED_ITEM,
  ON_SALE_ITEM,
  SOLD_ITEM,
} from "./fixtures";
import { MyConsignmentItem } from "./my-consignment-item";

const meta = {
  title: "Consignment Mine/MyConsignmentItem",
  component: MyConsignmentItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_ITEM_COPY, item: ON_SALE_ITEM },
} satisfies Meta<typeof MyConsignmentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In the shop: its list price, floor and the day its term ends. */
export const OnSale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Charizard Base Set")).toBeInTheDocument();
    expect(canvas.getByText("List price HK$6,500.00")).toBeInTheDocument();
    expect(canvas.queryByText("Ending soon")).toBeNull();
  },
};

/** At auction, its term ending soon. */
export const EndingSoon: Story = {
  args: { item: AUCTION_ITEM },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ending soon")).toBeInTheDocument();
  },
};

export const Sold: Story = { args: { item: SOLD_ITEM } };

/** Received, no channel or price yet. */
export const NotPriced: Story = { args: { item: NOT_PRICED_ITEM } };
