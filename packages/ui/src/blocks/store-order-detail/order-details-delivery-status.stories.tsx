import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  FILLED_DELIVERY,
  ORDER_DETAILS_COPY,
  PICKUP_DELIVERY,
} from "./fixtures";
import { OrderDetailsDeliveryStatus } from "./order-details-delivery-status";
import { resolveDeliverySteps } from "./resolve-delivery-steps";

const meta = {
  title: "Store Order Detail/OrderDetailsDeliveryStatus",
  component: OrderDetailsDeliveryStatus,
  tags: ["autodocs"],
  args: {
    copy: ORDER_DETAILS_COPY.delivery,
    steps: resolveDeliverySteps(FILLED_DELIVERY, "shipped"),
    trackOrder: true,
    onTrackOrder: fn(),
  },
} satisfies Meta<typeof OrderDetailsDeliveryStatus>;

const trackOrder = meta.args.onTrackOrder;

export default meta;
type Story = StoryObj<typeof meta>;

/** Order Placed → Shipped → Completed, with Track Order. */
export const ShippedDelivery: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Track Order" }));
    expect(trackOrder).toHaveBeenCalledOnce();
  },
};

/** Order Placed → Shipped → Completed, past the tracking window. */
export const ShippedDeliveryWithoutTrack: Story = {
  args: {
    trackOrder: false,
    onTrackOrder: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: "Track Order" }),
    ).not.toBeInTheDocument();
  },
};

/** Order Placed → Pickup → Completed; no Track Order control. */
export const InStorePickup: Story = {
  args: {
    steps: resolveDeliverySteps(PICKUP_DELIVERY, "pickup"),
    trackOrder: false,
    onTrackOrder: undefined,
  },
};
