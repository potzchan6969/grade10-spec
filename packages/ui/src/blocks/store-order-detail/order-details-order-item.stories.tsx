import type { Meta, StoryObj } from "@storybook/react-vite";
import { IMAGE, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsOrderItem } from "./order-details-order-item";

const meta = {
  title: "Store Order Detail/OrderDetailsOrderItem",
  component: OrderDetailsOrderItem,
  tags: ["autodocs"],
  args: {
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    subtotal: "HK$105",
    quantity: "1",
    total: "HK$105",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  },
} satisfies Meta<typeof OrderDetailsOrderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Line item flagged with a status issue (refund, cancel, or other problem). */
export const WithLineIssue: Story = {
  args: {
    lineStatus: "refunded",
    statusLabel: ORDER_DETAILS_COPY.status.refunded,
    statusMessage: "Out of stock. Refund issued on Aug 28",
    struckThrough: true,
  },
};

export const Canceled: Story = {
  args: {
    lineStatus: "canceled",
    statusLabel: ORDER_DETAILS_COPY.status.canceled,
    statusMessage: "Canceled by customer on Aug 28",
    struckThrough: true,
  },
};
