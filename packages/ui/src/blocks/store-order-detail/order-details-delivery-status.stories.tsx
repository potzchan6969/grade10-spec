import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  FILLED_DELIVERY,
  ORDER_DETAILS_COPY,
  PARCEL_REFUNDED,
  PARCEL_REFUNDED_AFTER_SHIP,
  PICKUP_DELIVERY,
} from "./fixtures";
import { OrderDetailsDeliveryStatus } from "./order-details-delivery-status";
import { resolveDeliverySteps } from "./resolve-delivery-steps";

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsDeliveryStatus",
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

/** Order Placed → Shipping → Completed, with Track Order. */
export const ShippedDelivery: Story = {
  parameters: {
    verification: { caseId: "vc_1c267c8f-178c-4c00-b249-d340f66d204a" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Track Order" }));
    expect(trackOrder).toHaveBeenCalledOnce();
  },
};

/** Order Placed → Shipping → Completed, past the tracking window. */
export const ShippedDeliveryWithoutTrack: Story = {
  parameters: {
    verification: { caseId: "vc_5c245e46-8f82-454c-9a89-a9516771d603" },
  },
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
  parameters: {
    verification: { caseId: "vc_18c70438-eaaf-4353-917e-6e041e21acfd" },
  },
  args: {
    steps: resolveDeliverySteps(PICKUP_DELIVERY, "pickup"),
    trackOrder: false,
    onTrackOrder: undefined,
  },
};

/** Placed, not yet handed to a carrier: only Order Placed is reached. */
export const ParcelNotShipped: Story = {
  parameters: {
    verification: { caseId: "vc_6902d41c-6b9b-44af-a97c-a5ca0df5db81" },
  },
  args: {
    steps: [
      { label: "Order Placed", date: "26 Aug 2026", state: "completed" },
      { label: "Shipping", state: "upcoming" },
      {
        label: "Completed",
        date: "Estimated delivery: 2 Sep 2026",
        state: "upcoming",
      },
    ],
    trackOrder: false,
    onTrackOrder: undefined,
  },
};

/** With the carrier: Shipping is current, arrival is an estimate. */
export const ParcelInTransit: Story = {
  parameters: {
    verification: { caseId: "vc_92c50ded-1396-4bff-8de5-76a6a99767ca" },
  },
  args: {
    steps: [
      { label: "Order Placed", date: "26 Aug 2026", state: "completed" },
      { label: "Shipping", date: "SF Express · SF123", state: "current" },
      {
        label: "Completed",
        date: "Estimated delivery: 2 Sep 2026",
        state: "upcoming",
      },
    ],
  },
};

/** The carrier confirmed delivery: every step is reached. */
export const ParcelDelivered: Story = {
  parameters: {
    verification: { caseId: "vc_60032bce-3f46-4c6f-ac62-79067110d471" },
  },
  args: {
    steps: [
      { label: "Order Placed", date: "26 Aug 2026", state: "completed" },
      { label: "Shipping", date: "SF Express · SF123", state: "completed" },
      { label: "Completed", state: "completed" },
    ],
  },
};

/** Refunded before a parcel left: the steps end at Refunded. */
export const ParcelRefunded: Story = {
  parameters: {
    verification: { caseId: "vc_cdbb8e1d-8011-4f51-9c25-2d9de010694c" },
  },
  args: {
    steps: resolveDeliverySteps(PARCEL_REFUNDED, "refunded"),
    trackOrder: false,
    onTrackOrder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(canvas.queryByText("Completed")).not.toBeInTheDocument();
  },
};

/** The parcel had already left when the refund landed: Shipping stays
 * reached and the steps still end at Refunded. */
export const ParcelRefundedAfterShip: Story = {
  parameters: {
    verification: { caseId: "vc_74b4a159-71c8-46b2-8371-022c185a181f" },
  },
  args: {
    steps: resolveDeliverySteps(PARCEL_REFUNDED_AFTER_SHIP, "refunded"),
    trackOrder: false,
    onTrackOrder: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(canvas.getByText("Refunded")).toBeVisible();
  },
};
