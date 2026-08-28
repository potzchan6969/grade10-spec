import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FILLED_DELIVERY, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsDeliveryStatus } from "./order-details-delivery-status";

const meta = {
  title: "Store Order Detail/OrderDetailsDeliveryStatus",
  component: OrderDetailsDeliveryStatus,
  tags: ["autodocs"],
  args: {
    copy: ORDER_DETAILS_COPY.delivery,
    steps: FILLED_DELIVERY.steps,
    trackOrder: true,
    onTrackOrder: fn(),
  },
} satisfies Meta<typeof OrderDetailsDeliveryStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTrackOrder: Story = {};

export const WithoutTrackOrder: Story = {
  args: {
    trackOrder: false,
    onTrackOrder: undefined,
  },
};
