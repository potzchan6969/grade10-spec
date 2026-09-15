import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { winnerOrderMeta } from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Delivery",
  args: { status: "processing" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paid — preparing to ship (Delivery step current). */
export const Processing: Story = {
  name: "Processing",
  args: { status: "processing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    expect(canvas.getByText("Preparing to ship")).toBeVisible();
    expect(canvas.getByText("Visa")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
  },
};

/** Dispatched — track shipment (Delivery step in transit). */
export const Shipped: Story = {
  name: "Shipped",
  args: { status: "shipped" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track shipment" }),
    ).toBeVisible();
    expect(canvas.getAllByText("Delivery").length).toBeGreaterThan(0);
    expect(canvas.getByText(/SF Express/)).toBeVisible();
  },
};

/** Carrier delivery confirmed — all winner steps complete. */
export const Delivered: Story = {
  name: "Delivered",
  args: { status: "delivered" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getAllByText("Delivered").length).toBeGreaterThan(0);
    expect(canvas.getByText(/28 Sep 2026/)).toBeVisible();
  },
};
