import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ConsignmentSellerLine } from "./consignment-seller-line";
import { SELLER_LINE_LOT_COPY, SELLER_LINE_STORE_COPY } from "./fixtures";

const meta = {
  title: "Consignment Mine/ConsignmentSellerLine",
  component: ConsignmentSellerLine,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: SELLER_LINE_STORE_COPY },
} satisfies Meta<typeof ConsignmentSellerLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A store page: Sold by the consignor's display name. */
export const Store: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sold by Kowloon Cards")).toBeInTheDocument();
  },
};

/** An auction lot: Consigned by. */
export const Lot: Story = { args: { copy: SELLER_LINE_LOT_COPY } };
