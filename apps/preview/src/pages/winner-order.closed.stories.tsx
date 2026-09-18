import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
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
          "Winner Order closed outcomes (Cancelled, Refunded). No progress stepper. Refunded keeps Invoice and Receipt; an inline alert below Order Total shows the refund amount. Dialog coverage lives under My Auctions / Winner Order / Refund Details.",
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
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(canvas.queryByText("Order progress")).not.toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$15,660")).toBeVisible();
    expect(canvas.getByText("Refund HK$15,660")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    const dialog = within(canvasElement.ownerDocument.body);
    expect(
      dialog.getByRole("heading", { name: "Refund Details" }),
    ).toBeVisible();
    expect(dialog.getByText("Not as described")).toBeVisible();
    expect(
      dialog.getByText(
        "Card condition did not match the listing photos. Full amount returned.",
      ),
    ).toBeVisible();
    expect(dialog.getByText("Refund Method")).toBeVisible();
    expect(
      canvas.queryByText("Order refunded. Payment on this order was returned."),
    ).not.toBeInTheDocument();
  },
};
