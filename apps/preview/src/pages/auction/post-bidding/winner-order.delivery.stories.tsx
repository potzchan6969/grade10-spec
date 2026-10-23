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
  title: "Auction/Post Bidding/Screens/Winner Order/Delivery",
  args: { status: "processing" },
  parameters: {
    ...winnerOrderMeta().parameters,
    docs: {
      description: {
        component:
          "Winner Order after payment (Preparing Shipment → Shipped → Delivered). Default Preparing Shipment uses a card mark and masked last four; Preparing Shipment Bank Transfer shows the bank icon with the bank name and masked last four.",
      },
    },
  },
} satisfies Meta<typeof WinnerOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paid by card — preparing to ship (Shipping step current); receipt PDF available. */
export const Processing: Story = {
  parameters: {
    verification: { caseId: "vc_6cd6b257-08d0-47f2-8e6d-5296853f666f" },
  },
  name: "Preparing Shipment",
  args: { status: "processing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(
      canvasElement.querySelector(
        '[data-slot="winner-order-page"][data-status="processing"]',
      ),
    ).not.toBeNull();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Address")).toBeVisible();
    expect(canvas.getByText("Preparing Shipment")).toBeVisible();
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(canvas.getByText("Preparing to ship")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("20 Sep 2026")).toBeVisible();
    expect(canvas.getByLabelText("Visa")).toBeVisible();
    expect(canvas.getByText("···· 4242")).toBeVisible();
    expect(canvas.getByText("Order summary")).toBeVisible();
    expect(canvas.getByText("Payment Processing Fee")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Receipt #RC-LK7P2Q01P1 (20 Sep 2026) PDF",
      }),
    ).toBeVisible();
  },
};

/**
 * Overpayment on a paid order. Status stays Preparing Shipment. Order Summary
 * stays the invoice. An inline alert below Order Total shows only the
 * difference.
 */
export const ProcessingOverpaid: Story = {
  parameters: {
    verification: { caseId: "vc_066774f3-be1c-4140-b1ce-37d4b4d93801" },
  },
  name: "Preparing Shipment — Overpaid",
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
    expect(canvas.getByText("Preparing Shipment")).toBeVisible();
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Winning Bid")).toBeVisible();
    expect(canvas.getByText("Shipping & Handling")).toBeVisible();
    const sidebarElement = canvas.getByRole("complementary");
    const summaryRows = [
      ...sidebarElement.querySelectorAll<HTMLElement>(
        '[data-slot="winner-order-summary-line"]',
      ),
    ].map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? "");
    expect(summaryRows.filter((row) => row.startsWith("Order Total"))).toEqual([
      "Order TotalHK$132,786.08",
    ]);
    expect(summaryRows).toContain(
      "SubtotalHK$128,269.00Converted from US$16,340.00 at 1 USD = 7.85 HKD",
    );
    expect(summaryRows).toContain("Payment Processing FeeHK$4,517.08");
    expect(canvas.getByText("Refund HK$500")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Refund Details" }),
    ).toBeVisible();
    expect(canvas.queryByText("Refunded")).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Refund Details" }),
    );
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
 * Paid by bank transfer after operator confirmation — same Preparing Shipment
 * shell, payment method shows the bank and a masked last-four account.
 * Processing fee may be Free when the operator set none.
 */
export const ProcessingBankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_bb58d319-bbcb-4d5a-87c5-a7c6838c0e0c" },
  },
  name: "Preparing Shipment Bank Transfer",
  args: {
    status: "processing",
    content: {
      ...WINNER_ORDER_CONTENTS.processing,
      paymentMethod: "HSBC",
      paymentMasked: "···· 8891",
      setupPaymentMethod: "FPS",
      paymentRail: "fps",
      convertedFee: undefined,
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
    const sidebarElement = canvas.getByRole("complementary");
    const sidebar = within(sidebarElement);
    expect(sidebar.getByText("Payment method")).toBeVisible();
    expect(sidebar.getByLabelText("Bank")).toBeVisible();
    expect(sidebar.getByText("···· 8891")).toBeVisible();
    expect(sidebar.getByText("HSBC")).toBeVisible();
    expect(sidebar.queryByText("Visa")).not.toBeInTheDocument();
    expect(sidebar.queryByText("···· 4242")).not.toBeInTheDocument();
    const summaryRows = [
      ...sidebarElement.querySelectorAll<HTMLElement>(
        '[data-slot="winner-order-summary-line"]',
      ),
    ].map((row) => row.textContent?.replace(/\s+/g, " ").trim() ?? "");
    expect(summaryRows).toContain("Payment Processing FeeFree");
    expect(summaryRows).toContain("TaxUS$320.00");
    expect(summaryRows).toContain(
      "SubtotalHK$128,269.00Converted from US$16,340.00 at 1 USD = 7.85 HKD",
    );
    expect(summaryRows.filter((row) => row.startsWith("Order Total"))).toEqual([
      "Order TotalHK$128,269.00",
    ]);
    expect(summaryRows).not.toContain("Payment Processing FeeHK$4,517.08");
    expect(summaryRows).not.toContain("Payment Processing FeeUS$120.00");
    expect(sidebar.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      sidebar.getByRole("link", {
        name: "Receipt #RC-LK7P2Q01P1 (20 Sep 2026) PDF",
      }),
    ).toBeVisible();
  },
};

/** Dispatched — track shipment; Shipping step shows day-only date. */
export const Shipped: Story = {
  parameters: {
    verification: { caseId: "vc_9147ebe2-b7b4-4759-bdcd-172378ee1879" },
  },
  name: "Shipped",
  args: { status: "shipped" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Order Progress")).toBeVisible();
    const trackingLink = canvas.getByRole("link", { name: /SF1234567890/ });
    expect(trackingLink).toHaveAttribute(
      "href",
      "https://www.sf-express.com/us/en/dynamic_function/waybill/#search/bill-number/SF1234567890",
    );
    expect(trackingLink).toHaveAttribute("target", "_blank");
    expect(canvas.getByText("Shipped", { exact: true })).toHaveClass(
      "bg-muted",
    );
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(
      canvas.getByText("Shipping").closest('[data-slot="step"]'),
    ).toHaveAttribute("data-state", "progress");
    expect(canvas.getByText("26 Sep 2026")).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Track shipment" })).toBeNull();
    expect(canvas.queryByText("SF Express", { exact: true })).toBeNull();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Receipt #RC-LK7P2Q01P1 (20 Sep 2026) PDF",
      }),
    ).toBeVisible();
  },
};

/** Dispatched with a tracking number, but no carrier tracking URL recorded. */
export const ShippedWithoutTrackerLink: Story = {
  parameters: {
    verification: { caseId: "vc_f3ec8195-8010-43be-bd54-8486a0b14ecb" },
  },
  name: "Shipped without tracker link",
  args: {
    status: "shipped",
    content: {
      ...WINNER_ORDER_CONTENTS.shipped,
      trackingHref: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Shipped", { exact: true })).toHaveClass(
      "bg-muted",
    );
    expect(canvas.getByText("Shipping")).toBeVisible();
    expect(
      canvas.getByText("Shipping").closest('[data-slot="step"]'),
    ).toHaveAttribute("data-state", "progress");
    expect(canvas.getByText("26 Sep 2026")).toBeVisible();
    expect(canvas.getByText("SF1234567890", { exact: true })).toBeVisible();
    expect(
      canvas.queryByRole("link", { name: "SF1234567890" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Track shipment" })).toBeNull();
    expect(canvas.queryByText("SF Express", { exact: true })).toBeNull();
  },
};

/** Carrier delivery confirmed — Completed shows day-only date. */
export const Delivered: Story = {
  parameters: {
    verification: { caseId: "vc_e0d4f0ad-dac1-4c67-a2f6-aa60fed834c1" },
  },
  name: "Delivered",
  args: { status: "delivered" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await winnerOrderSettled(canvasElement);
    expect(canvas.getByText("Order Progress")).toBeVisible();
    expect(canvas.getByText("Completed")).toBeVisible();
    expect(canvas.getByText("28 Sep 2026")).toBeVisible();
    const trackingLink = canvas.getByRole("link", { name: /SF1234567890/ });
    expect(trackingLink).toHaveAttribute(
      "href",
      "https://www.sf-express.com/us/en/dynamic_function/waybill/#search/bill-number/SF1234567890",
    );
    expect(trackingLink).toHaveAttribute("target", "_blank");
    expect(canvas.queryByRole("button", { name: "Track shipment" })).toBeNull();
    expect(canvas.queryByText("SF Express", { exact: true })).toBeNull();
    expect(canvas.getByRole("link", { name: "Invoice PDF" })).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Receipt #RC-LK7P2Q01P1 (20 Sep 2026) PDF",
      }),
    ).toBeVisible();
  },
};
