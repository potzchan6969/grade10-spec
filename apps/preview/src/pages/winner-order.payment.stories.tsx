import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
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
    await winnerOrderSettled(canvasElement);
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
    expect(canvas.getByText(/Wan Chai/)).toBeVisible();
    expect(
      canvas.queryByText(/Locked after invoice send/i),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByText(/Contact Grade10 to change/i),
    ).not.toBeInTheDocument();
    expect(
      sidebar.getByRole("link", { name: "View invoice PDF" }),
    ).toBeVisible();
    expect(sidebar.queryByRole("alert")).not.toBeInTheDocument();
  },
};

/** Payment deadline passed — no Pay CTA; contact from the overdue alert. */
export const ExpiredInvoice: Story = {
  name: "Expired Invoice",
  args: { status: "pending_payment_expired" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="pending_payment_expired"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Payment")).toBeVisible();
    const sidebar = within(canvas.getByRole("complementary"));
    const alert = sidebar.getByRole("alert");
    expect(alert).toBeVisible();
    expect(
      within(alert).getByText("Payment deadline passed 24 Sep 2026, 21:30 HKT"),
    ).toBeVisible();
    expect(within(alert).getByText(/payment deadline/i)).toBeVisible();
    expect(
      within(alert).getByRole("button", { name: "Contact Us" }),
    ).toBeVisible();
    expect(
      sidebar.queryByRole("button", { name: "Pay with card" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/how to reach Grade10/i)).not.toBeInTheDocument();
    expect(canvas.queryByText(/support@grade10.com/)).not.toBeInTheDocument();
    expect(
      sidebar.getByRole("link", { name: "View invoice PDF" }),
    ).toBeVisible();
    expect(
      canvas.queryByText("Pending Payment (expired invoice)"),
    ).not.toBeInTheDocument();
  },
};
