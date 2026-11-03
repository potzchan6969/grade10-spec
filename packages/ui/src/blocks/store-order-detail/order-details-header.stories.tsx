import type { Meta, StoryObj } from "@storybook/react-vite";
import { FIXTURE_PLACED_ON_WITH_PERIOD } from "../../lib/datetime-fixtures";
import { ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsHeader } from "./order-details-header";

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsHeader",
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

export const Shipped: Story = {
  parameters: {
    verification: { caseId: "vc_e6054a9e-e569-4066-9db2-ec5e74aedfc9" },
  },
};

export const Processing: Story = {
  parameters: {
    verification: { caseId: "vc_0c350507-e2db-4476-9709-bfa8752a0247" },
  },
  args: {
    status: "processing",
    statusLabel: ORDER_DETAILS_COPY.status.processing,
  },
};

export const Refunded: Story = {
  parameters: {
    verification: { caseId: "vc_a2b41dd5-688b-40ab-95a8-16f7c626ea5b" },
  },
  args: {
    status: "refunded",
    statusLabel: ORDER_DETAILS_COPY.status.refunded,
  },
};
