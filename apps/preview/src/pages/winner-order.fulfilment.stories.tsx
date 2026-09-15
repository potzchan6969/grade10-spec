import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { winnerOrderMeta } from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta("Fulfilment"),
  args: { status: "processing" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paid — preparing to ship. */
export const Processing: Story = {
  name: "Processing",
  args: { status: "processing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText("Delivery status")).toBeVisible();
    expect(canvas.getByText("Paid")).toBeVisible();
    expect(canvas.getByText("Visa")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
  },
};

/** Dispatched — track shipment. */
export const Shipped: Story = {
  name: "Shipped",
  args: { status: "shipped" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Delivery status")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track shipment" }),
    ).toBeVisible();
    expect(canvas.getAllByText("Shipped").length).toBeGreaterThan(0);
  },
};

/** Carrier delivery confirmed. */
export const Delivered: Story = {
  name: "Delivered",
  args: { status: "delivered" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Delivery status")).toBeVisible();
    expect(canvas.getAllByText("Delivered").length).toBeGreaterThan(0);
  },
};
