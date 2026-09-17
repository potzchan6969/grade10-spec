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
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order closed outcomes (Cancelled, Refunded). No progress stepper; Invoice/Receipt links follow the same placement rules as Payment and Delivery.",
      },
    },
  },
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
      canvas.queryByRole("link", { name: "Invoice PDF" }),
    ).not.toBeInTheDocument();
    const lot = canvasElement.querySelector('[data-slot="winner-order-lot"]');
    expect(lot).not.toBeNull();
    const alert = canvas.getByText(
      "Order cancelled. The lot returned to available stock.",
    );
    expect(alert).toBeVisible();
    expect(lot!.compareDocumentPosition(alert)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
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
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
    expect(canvas.getByText("Payment Processing Fee")).toBeVisible();
    const lot = canvasElement.querySelector('[data-slot="winner-order-lot"]');
    expect(lot).not.toBeNull();
    const alert = canvas.getByText(
      "Order refunded. Payment on this order was returned.",
    );
    expect(alert).toBeVisible();
    expect(lot!.compareDocumentPosition(alert)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    const alertRoot = alert.closest('[data-slot="alert"]');
    expect(alertRoot).toHaveAttribute("data-status", "success");
  },
};
