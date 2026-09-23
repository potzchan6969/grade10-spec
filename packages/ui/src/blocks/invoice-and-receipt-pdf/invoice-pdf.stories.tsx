import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  billToAddress,
  orderValue,
  orderValueCopy,
  readAddressLines,
  readRows,
  shipToAddress,
} from "./fixtures";
import { InvoicePdf } from "./invoice-pdf";
import type { InvoicePdfCopy } from "./types";

const copy: InvoicePdfCopy = {
  documentTitle: "Invoice",
  invoiceIdLabel: "Invoice number",
  paymentMethodLabel: "Payment method",
  sentAtLabel: "Date of issue",
  paymentDeadlineLabel: "Date due",
  bankRailsLabel: "Bank details",
  replacedByLabel: "Replaced by",
  billToHeading: "Bill to",
  shipToHeading: "Ship to",
  orderValue: orderValueCopy,
};

/** The lot and every order-value label, lot first, in the fixed order `spec.md` requires. */
const ORDER_VALUE_LABELS = [
  orderValue.lot as string,
  copy.orderValue.winningBid,
  copy.orderValue.buyersPremium,
  copy.orderValue.shippingAndHandling,
  copy.orderValue.insurance,
];

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
    billTo: billToAddress,
    shipTo: shipToAddress,
    orderValue,
  },
} satisfies Meta<typeof InvoicePdf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** SC-1, SC-18: a bank-transfer invoice's meta rows and party blocks all render, bank rails included. */
export const BankTransfer: Story = {
  args: {
    bankRails: "SWIFT, FPS, HK local transfer. Quote LK7P2Q01.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("INV-202609-LK7P2Q-01")).toBeVisible();
    expect(canvas.getByText("Visa card ending 4242")).toBeVisible();
    expect(canvas.getByText("September 15, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("September 22, 2026, 11:04 HKT")).toBeVisible();
    expect(canvas.getByText("Grade10, support@grade10.com")).toBeVisible();

    // Bank rails render as their own full-width section below the order
    // value, not as a meta row: after pdf-order-value-section in document
    // order, outside every pdf-meta-row, and as wide as that section.
    const bankRails = canvasElement.querySelector(
      '[data-slot="pdf-bank-rails"]',
    );
    expect(bankRails).not.toBeNull();
    expect(
      within(bankRails as HTMLElement).getByText("Bank details"),
    ).toBeVisible();
    expect(
      within(bankRails as HTMLElement).getByText(
        "SWIFT, FPS, HK local transfer. Quote LK7P2Q01.",
      ),
    ).toBeVisible();
    const metaRows = canvasElement.querySelectorAll(
      '[data-slot="pdf-meta-row"]',
    );
    metaRows.forEach((row) => {
      expect(row.contains(bankRails)).toBe(false);
    });
    const orderValueSection = canvasElement.querySelector(
      '[data-slot="pdf-order-value-section"]',
    ) as HTMLElement;
    expect(
      orderValueSection.compareDocumentPosition(bankRails as HTMLElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      (bankRails as HTMLElement).getBoundingClientRect().width,
    ).toBeCloseTo(orderValueSection.getBoundingClientRect().width, 0);
    const [bill, ship] = canvasElement.querySelectorAll(
      '[data-slot="pdf-party-block"]',
    );
    expect(within(bill as HTMLElement).getByText("Bill to")).toBeVisible();
    expect(within(ship as HTMLElement).getByText("Ship to")).toBeVisible();
    // SC-19: Bill To and Ship To never echo each other — each block's own
    // fixture differs (Ship To carries no company name), so this also
    // proves the blocks aren't rendering the same address twice.
    expect(readAddressLines(bill as HTMLElement)).not.toEqual(
      readAddressLines(ship as HTMLElement),
    );
  },
};

/** SC-31: a company address renders all nine fields it is given. */
export const BillToWithAllFields: Story = {
  play: async ({ canvasElement }) => {
    const [bill] = canvasElement.querySelectorAll(
      '[data-slot="pdf-party-block"]',
    );
    expect(readAddressLines(bill as HTMLElement)).toEqual([
      billToAddress.fullName,
      billToAddress.companyName,
      billToAddress.addressLine1,
      billToAddress.addressLine2,
      billToAddress.city,
      billToAddress.state,
      billToAddress.postalCode,
      billToAddress.country,
      billToAddress.phone,
    ]);
  },
};

/** SC-32: a personal address omits company name, address line 2 and state, keeping every other field. */
export const ShipToOmitsOptionalFields: Story = {
  play: async ({ canvasElement }) => {
    const [, ship] = canvasElement.querySelectorAll(
      '[data-slot="pdf-party-block"]',
    );
    expect(readAddressLines(ship as HTMLElement)).toEqual([
      shipToAddress.fullName,
      shipToAddress.addressLine1,
      shipToAddress.city,
      shipToAddress.postalCode,
      shipToAddress.country,
      shipToAddress.phone,
    ]);
  },
};

/** SC-6, SC-36: a card invoice shows no bank rails and no Replaced by line, with every other row unaffected. */
export const CardPayment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Bank details")).not.toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="pdf-bank-rails"]'),
    ).toBeNull();
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

    // SC-37: a Description/Amount header and a divider sit immediately
    // above the order-value lines, not the lot heading or the summary.
    const header = canvasElement.querySelector(
      '[data-slot="pdf-order-value-header"]',
    );
    expect(header).not.toBeNull();
    expect(
      within(header as HTMLElement).getByText("Description"),
    ).toBeVisible();
    expect(within(header as HTMLElement).getByText("Amount")).toBeVisible();
    const firstValueRow = canvasElement.querySelector(
      '[data-slot="pdf-value-row"]',
    ) as HTMLElement;
    expect(
      (header as HTMLElement).compareDocumentPosition(firstValueRow) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
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

/** SC-14: the tax line's own key withheld entirely — no row, blank or otherwise, and every other line keeps its position. */
export const WithoutTaxLine: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Tax")).not.toBeInTheDocument();
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

/** SC-17: every label reads the copy prop, with no catalog fallback — proven on InvoicePdf; ReceiptPdf's half is `receipt-pdf.stories.tsx`'s `LabelsFromCopy`. */
export const LabelsFromCopy: Story = {
  args: {
    copy: {
      ...copy,
      invoiceIdLabel: "Numéro de facture",
      billToHeading: "Facturé à",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Numéro de facture")).toBeVisible();
    expect(canvas.getByText("Facturé à")).toBeVisible();
  },
};

/** SC-28: neither component shows a loading or error state — proven on InvoicePdf; ReceiptPdf's half is `receipt-pdf.stories.tsx`'s `RendersImmediately`. */
export const RendersImmediately: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("INV-202609-LK7P2Q-01")).toBeVisible();
  },
};
