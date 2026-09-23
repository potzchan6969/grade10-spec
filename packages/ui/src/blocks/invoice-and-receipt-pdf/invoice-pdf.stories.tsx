import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { InvoicePdf } from "./invoice-pdf";
import type { InvoicePdfCopy, OrderValueLines } from "./types";

const copy: InvoicePdfCopy = {
  documentTitle: "Invoice",
  invoiceIdLabel: "Invoice number",
  paymentMethodLabel: "Payment method",
  sentAtLabel: "Date of issue",
  paymentDeadlineLabel: "Date due",
  bankReferenceLabel: "Bank reference",
  bankRailsLabel: "Bank details",
  replacedByLabel: "Replaced by",
  billToHeading: "Bill to",
  shipToHeading: "Ship to",
  orderValue: {
    winningBid: "Winning Bid",
    buyersPremium: "Buyer’s Premium",
    shippingAndHandling: "Shipping & Handling",
    insurance: "Insurance",
    taxLine: "Tax",
    subtotal: "Subtotal",
    paymentProcessingFee: "Payment Processing Fee",
    orderTotal: "Order Total",
  },
};

const orderValue: OrderValueLines = {
  lot: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  winningBid: "2,500.00",
  buyersPremium: "500.00",
  shippingAndHandling: "80.00",
  insurance: "40.00",
  subtotal: "3,120.00",
  paymentProcessingFee: "112.25",
  orderTotal: "3,232.25",
};

/** The lot and every order-value label, lot first, in the fixed order `spec.md` requires. */
const ORDER_VALUE_LABELS = [
  orderValue.lot as string,
  copy.orderValue.winningBid,
  copy.orderValue.buyersPremium,
  copy.orderValue.shippingAndHandling,
  copy.orderValue.insurance,
];

/** Reads the document's order-value and summary rows in DOM order, by their `data-slot`, never by matching text anywhere on the page. */
function readRows(canvasElement: HTMLElement) {
  const nodes = canvasElement.querySelectorAll(
    '[data-slot="pdf-lot-heading"], [data-slot="pdf-value-row"], [data-slot="pdf-summary-row"]',
  );
  return Array.from(nodes).map((node) => node.textContent ?? "");
}

const meta = {
  title: "Invoice And Receipt Pdf/InvoicePdf",
  component: InvoicePdf,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy,
    invoiceId: "INV-202609-LK7P2Q-01",
    paymentMethod: "Visa card ending 4242",
    sentAt: "September 15, 2026, 11:04 HKT",
    paymentDeadline: "September 22, 2026, 11:04 HKT",
    issuer: "Grade10, support@grade10.com",
    billTo: "Alexandra Tran",
    shipTo: "One Harbour Square",
    orderValue,
  },
} satisfies Meta<typeof InvoicePdf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** SC-1: a bank-transfer invoice's meta rows and party blocks all render, bank reference and bank rails included. */
export const BankTransfer: Story = {
  args: {
    bankReference: "LK7P2Q01",
    bankRails: "SWIFT, FPS, HK local transfer",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("INV-202609-LK7P2Q-01")).toBeVisible();
    expect(canvas.getByText("Visa card ending 4242")).toBeVisible();
    expect(canvas.getByText("September 15, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("September 22, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("Bank reference")).toBeVisible();
    expect(canvas.getByText("LK7P2Q01")).toBeVisible();
    expect(canvas.getByText("Bank details")).toBeVisible();
    expect(canvas.getByText("SWIFT, FPS, HK local transfer")).toBeVisible();
    expect(canvas.getByText("Grade10, support@grade10.com")).toBeVisible();
    const [bill, ship] = canvasElement.querySelectorAll(
      '[data-slot="pdf-party-block"]',
    );
    expect(within(bill as HTMLElement).getByText("Bill to")).toBeVisible();
    expect(
      within(bill as HTMLElement).getByText("Alexandra Tran"),
    ).toBeVisible();
    expect(within(ship as HTMLElement).getByText("Ship to")).toBeVisible();
    expect(
      within(ship as HTMLElement).getByText("One Harbour Square"),
    ).toBeVisible();
  },
};

/** SC-2, SC-6: a card invoice shows no bank reference, no bank rails, and no Replaced by line, with every other row unaffected. */
export const CardPayment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Bank reference")).not.toBeInTheDocument();
    expect(canvas.queryByText("Bank details")).not.toBeInTheDocument();
    expect(canvas.queryByText("Replaced by")).not.toBeInTheDocument();
    expect(canvas.getByText("INV-202609-LK7P2Q-01")).toBeVisible();
    expect(canvas.getByText("Visa card ending 4242")).toBeVisible();
    expect(canvas.getByText("September 15, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("September 22, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("Grade10, support@grade10.com")).toBeVisible();
    expect(canvas.getByText("Bill to")).toBeVisible();
    expect(canvas.getByText("Ship to")).toBeVisible();
  },
};

/** SC-18: a bank reference can render without bank rails — the two are independently optional. */
export const BankReferenceOnly: Story = {
  args: { bankReference: "LK7P2Q01" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Bank reference")).toBeVisible();
    expect(canvas.getByText("LK7P2Q01")).toBeVisible();
    expect(canvas.queryByText("Bank details")).not.toBeInTheDocument();
  },
};

/** SC-3: the lot and every order-value line render in their fixed order. */
export const OrderValueOrder: Story = {
  play: async ({ canvasElement }) => {
    const rows = readRows(canvasElement);
    const expected = ORDER_VALUE_LABELS.concat([
      copy.orderValue.subtotal,
      copy.orderValue.paymentProcessingFee,
      copy.orderValue.orderTotal,
    ]);
    expect(rows).toHaveLength(expected.length);
    expected.forEach((label, index) => {
      expect(rows[index]).toContain(label);
    });
  },
};

/** SC-4: an invoice with no insurance skips the line without disturbing the order. */
export const NoInsurance: Story = {
  args: { orderValue: { ...orderValue, insurance: undefined } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Insurance")).not.toBeInTheDocument();
    const rows = readRows(canvasElement);
    expect(rows).toHaveLength(7);
    const [, summarySubtotal, summaryFee, summaryTotal] = rows.slice(-4);
    expect(summarySubtotal).toContain(copy.orderValue.subtotal);
    expect(summaryFee).toContain(copy.orderValue.paymentProcessingFee);
    expect(summaryTotal).toContain(copy.orderValue.orderTotal);
  },
};

/** SC-5: a replaced invoice's PDF names its replacement. */
export const Replaced: Story = {
  args: { replacedBy: "IN-LK42301" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Replaced by")).toBeVisible();
    expect(canvas.getByText("IN-LK42301")).toBeVisible();
  },
};

/** SC-13: a given tax line renders on the invoice, positioned among the order-value lines — after Insurance, before the summary rows. */
export const WithTaxLine: Story = {
  args: { orderValue: { ...orderValue, taxLine: "9% GST: 280.80" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Tax")).toBeVisible();
    expect(canvas.getByText("9% GST: 280.80")).toBeVisible();
    const rows = readRows(canvasElement);
    const taxIndex = rows.findIndex((row) => row.includes("Tax"));
    const firstSummaryIndex = rows.findIndex((row) =>
      row.includes(copy.orderValue.subtotal),
    );
    expect(taxIndex).toBeGreaterThan(0);
    expect(taxIndex).toBeLessThan(firstSummaryIndex);
  },
};

/** SC-14: the tax line's own key withheld entirely — no row, blank or otherwise. */
export const WithoutTaxLine: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Tax")).not.toBeInTheDocument();
  },
};

/**
 * SC-25's discriminator itself: `taxLine: undefined` is still a *supplied*
 * key — the tax row renders — distinct from the key never being passed at
 * all (`WithoutTaxLine`). Proves the presence check is `"taxLine" in
 * orderValue`, not `!== undefined`.
 */
export const WithUndefinedTaxLine: Story = {
  args: { orderValue: { ...orderValue, taxLine: undefined } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Tax")).toBeVisible();
  },
};

/** SC-25: a tax line supplied as empty content still renders its row, with blank content. */
export const WithEmptyTaxLine: Story = {
  args: { orderValue: { ...orderValue, taxLine: "" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Tax");
    expect(label).toBeVisible();
    const row = label.closest('[data-slot="pdf-value-row"]');
    expect(row?.children).toHaveLength(2);
  },
};

/** SC-16: Order Total renders exactly what is given, not a computed sum. */
export const AmountsDoNotSum: Story = {
  args: {
    orderValue: {
      ...orderValue,
      subtotal: "100.00",
      paymentProcessingFee: "5.00",
      orderTotal: "999.99",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("999.99")).toBeVisible();
    expect(canvas.queryByText("105.00")).not.toBeInTheDocument();
  },
};

/** SC-26: rich ReactNode content renders unchanged, not reduced to text. */
export const RichOrderTotalMarkup: Story = {
  args: {
    orderValue: {
      ...orderValue,
      orderTotal: <span data-testid="order-total-markup">HK$3,232.25</span>,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId("order-total-markup")).toHaveTextContent(
      "HK$3,232.25",
    );
  },
};

/** SC-27: a required line still renders its row, value cell included, when its content is blank. */
export const WhitespaceSubtotal: Story = {
  args: { orderValue: { ...orderValue, subtotal: "   " } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Subtotal");
    expect(label).toBeVisible();
    const row = label.closest('[data-slot="pdf-summary-row"]');
    expect(row?.children).toHaveLength(2);
  },
};
