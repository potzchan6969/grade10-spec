import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { winnerOrderMeta } from "./winner-order.story-shared";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Payment",
  args: { status: "pending_payment" },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invoice sent — pay by card before the deadline. */
export const PendingPayment: Story = {
  name: "Pending Payment",
  args: { status: "pending_payment" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="pending_payment"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$15,660")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Pay with card" }),
    ).toBeVisible();
    expect(sidebar.getByText("Pay by 24 Sep 2026, 21:30 HKT")).toBeVisible();
    expect(canvas.getByText(/Locked after invoice send/)).toBeVisible();
    expect(
      sidebar.getByRole("button", { name: "View invoice PDF" }),
    ).toBeVisible();
  },
};

/** Deadline passed — invoice stays payable. */
export const ExpiredInvoice: Story = {
  name: "Expired Invoice",
  args: { status: "pending_payment_expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="pending_payment_expired"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(
      sidebar.getByRole("button", { name: "Pay with card" }),
    ).toBeVisible();
    expect(
      sidebar.getByText("Deadline passed 24 Sep 2026, 21:30 HKT"),
    ).toBeVisible();
    expect(canvas.getByText(/support@grade10.com/)).toBeVisible();
    expect(
      sidebar.getByRole("button", { name: "View invoice PDF" }),
    ).toBeVisible();
  },
};
