import type { Meta, StoryObj } from "@storybook/react-vite";
import { FIXTURE_PLACED_ON_WITH_PERIOD } from "../../lib/datetime-fixtures";
import { ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsHeader } from "./order-details-header";

const meta = {
  title: "Store Order Detail/OrderDetailsHeader",
  component: OrderDetailsHeader,
  tags: ["autodocs"],
  args: {
    orderId: "Order #G10-10482",
    status: "shipped",
    statusLabel: ORDER_DETAILS_COPY.status.shipped,
    placedOn: FIXTURE_PLACED_ON_WITH_PERIOD,
    placedOnDateTime: "2026-08-26",
    needHelp: { href: "#", label: ORDER_DETAILS_COPY.needHelp },
  },
} satisfies Meta<typeof OrderDetailsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shipped: Story = {};

export const Processing: Story = {
  args: {
    status: "processing",
    statusLabel: ORDER_DETAILS_COPY.status.processing,
  },
};

export const Refunded: Story = {
  args: {
    status: "refunded",
    statusLabel: ORDER_DETAILS_COPY.status.refunded,
  },
};
