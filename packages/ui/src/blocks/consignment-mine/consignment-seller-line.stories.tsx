import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ConsignmentSellerLine } from "./consignment-seller-line";
import { SELLER_LINE_LOT_COPY, SELLER_LINE_STORE_COPY } from "./fixtures";

const meta = {
  title: "Store/Product Page/Blocks/ConsignmentSellerLine",
  component: ConsignmentSellerLine,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: SELLER_LINE_STORE_COPY },
} satisfies Meta<typeof ConsignmentSellerLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A store page: Sold by the consignor's display name. */
export const Store: Story = {
  parameters: {
    verification: { caseId: "vc_ee8b7527-41a3-4107-94f2-904438544f86" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sold by Kowloon Cards")).toBeInTheDocument();
  },
};

/** An auction lot: Consigned by. */
export const Lot: Story = {
  parameters: {
    verification: { caseId: "vc_6ad8d86f-9ce0-4e2e-8d7b-2496281d4281" },
  },
  args: { copy: SELLER_LINE_LOT_COPY },
};
