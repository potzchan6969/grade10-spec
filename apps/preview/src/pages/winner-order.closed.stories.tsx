import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Closed",
  args: { status: "cancelled" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Operator cancelled an unpaid invoice — lot returned to available. */
export const Cancelled: Story = {
  name: "Cancelled",
  args: { status: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="cancelled"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.queryByText("Order progress")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: "View invoice PDF" }),
    ).not.toBeInTheDocument();
  },
};

/**
 * Paid invoice later refunded (order-status `paid` → `refunded`).
 * Not a non-payment outcome — fail-to-pay stays Pending Payment / Cancelled.
 */
export const Refunded: Story = {
  name: "Refunded",
  args: { status: "refunded" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="refunded"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByRole("complementary")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.queryByText("Order progress")).not.toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "View invoice PDF" }),
    ).toBeVisible();
  },
};
