import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  winnerOrderMeta,
  winnerOrderSettled,
} from "./winner-order.story-shared";
import {
  BANK_TRANSFER_INVOICE_LINES,
  WINNER_ORDER_CONTENTS,
  WINNER_ORDER_REFUND_OVERPAID,
} from "./winner-order-content";
import type { WinnerOrderPage } from "./winner-order-page";

const meta = {
  ...winnerOrderMeta(),
  title: "My Auctions/Winner Order/Delivery",
  args: { status: "processing" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order after payment (Processing → Shipped → Delivered). Default Processing uses a card mark and masked last four; Processing Bank Transfer shows the bank icon with the bank name and masked last four.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paid by card — preparing to ship (Shipped step current); receipt PDF available. */
export const Processing: Story = {
  name: "Processing",
  args: { status: "processing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="processing"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("20 Sep 2026")).toBeVisible();
    expect(canvas.getByLabelText("Visa")).toBeVisible();
    expect(canvas.getByText("···· 4242")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Payment Processing Fee")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
  },
};

/**
 * Overpayment on a paid order. Status stays Processing. Order Summary stays
 * the invoice. An inline alert below Order Total shows only the difference.
 */
export const ProcessingOverpaid: Story = {
  name: "Processing — Overpaid",
  args: {
    status: "processing",
    content: {
      ...WINNER_ORDER_CONTENTS.processing,
      refund: { ...WINNER_ORDER_REFUND_OVERPAID },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Winning Bid")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    expect(canvas.getByText("Order Total")).toBeVisible();
    expect(canvas.getByText("HK$16,460")).toBeVisible();
    expect(canvas.getByText("Refund HK$500")).toBeVisible();
    expect(canvas.getByRole("button", { name: "View" })).toBeVisible();
    expect(canvas.queryByText("Refunded")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    const page = within(canvasElement.ownerDocument.body);
    const dialogElement = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Refund Details" });
      expect(found).toBeVisible();
      return found;
    });
    const dialog = within(dialogElement);
    expect(dialog.getByText("Transfer to")).toBeVisible();
    expect(dialog.getByLabelText("Bank")).toBeVisible();
    expect(dialog.getByText("···· 8891")).toBeVisible();
    expect(dialog.getByText("HSBC")).toBeVisible();
    expect(dialog.getByText("Reference")).toBeVisible();
    expect(dialog.getByText("G10-RF-LK7P2Q")).toBeVisible();
  },
};

/**
 * Paid by bank transfer after operator confirmation — same Processing shell,
 * payment method shows the bank and a masked last-four account.
 * Processing fee may be Free when the operator set none.
 */
export const ProcessingBankTransfer: Story = {
  name: "Processing Bank Transfer",
  args: {
    status: "processing",
    content: {
      ...WINNER_ORDER_CONTENTS.processing,
      paymentMethod: "HSBC",
      paymentMasked: "···· 8891",
      invoiceLines: BANK_TRANSFER_INVOICE_LINES,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="processing"]',
      ),
    ).not.toBeNull();
    const sidebar = within(canvas.getByRole("complementary"));
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getByLabelText("Bank")).toBeVisible();
    expect(sidebar.getByText("···· 8891")).toBeVisible();
    expect(sidebar.getByText("HSBC")).toBeVisible();
    expect(sidebar.queryByText("Visa")).not.toBeInTheDocument();
    expect(sidebar.queryByText("···· 4242")).not.toBeInTheDocument();
    expect(sidebar.getByText("Payment Processing Fee")).toBeVisible();
    expect(sidebar.getByText("Free")).toBeVisible();
    expect(sidebar.getByText("Tax")).toBeVisible();
    expect(sidebar.getByText("HK$320")).toBeVisible();
    expect(sidebar.getByText("HK$16,340")).toBeVisible();
    expect(sidebar.queryByText("HK$120")).not.toBeInTheDocument();
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(sidebar.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
  },
};

/** Dispatched — track shipment; Shipped step shows day-only date. */
export const Shipped: Story = {
  name: "Shipped",
  args: { status: "shipped" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track shipment" }),
    ).toBeVisible();
    expect(canvas.getAllByText("Shipped").length).toBeGreaterThan(0);
    expect(canvas.getByText("26 Sep 2026")).toBeVisible();
    expect(canvas.getByText(/SF Express/)).toBeVisible();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
  },
};

/** Carrier delivery confirmed — Completed shows day-only date. */
export const Delivered: Story = {
  name: "Delivered",
  args: { status: "delivered" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Order progress")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("28 Sep 2026")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Receipt PDF" })).toBeVisible();
  },
};
