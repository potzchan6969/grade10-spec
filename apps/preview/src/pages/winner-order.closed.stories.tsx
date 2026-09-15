import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { winnerOrderMeta } from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Closed",
  args: { status: "cancelled" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Order cancelled — lot returned to available. */
export const Cancelled: Story = {
  name: "Cancelled",
  args: { status: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cancelled")).toBeVisible();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.queryByText("Order progress")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "View invoice PDF" }),
    ).not.toBeInTheDocument();
  },
};

/** Paid order later refunded. */
export const Refunded: Story = {
  name: "Refunded",
  args: { status: "refunded" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.queryByText("Order progress")).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "View invoice PDF" }),
    ).toBeVisible();
  },
};
