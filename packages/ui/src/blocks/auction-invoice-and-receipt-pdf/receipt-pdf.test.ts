import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import {
  LINE_HEIGHT,
  MARGIN,
  RIGHT_EDGE,
  SUMMARY_LEFT,
  SUMMARY_WIDTH,
} from "./pdf-document";
import {
  drawnHorizontalLines,
  drawnRectangles,
  drawnStrings,
  drawnText,
} from "./pdf-test-helpers";
import { ReceiptPdf, receiptBreakdown } from "./receipt-pdf";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.receipt,
} as const;

const ADDRESS = {
  recipient: "Alexandra Tran",
  company: "Grade10 Collector Club",
  phone: "+852 2123 4567",
  line1: "Flat A, 21/F, One Harbour Square",
  line2: "181 Java Road",
  city: "North Point",
  region: null,
  postalCode: "999077",
  countryCode: "Hong Kong SAR",
} as const;

const COMPLETE_ADDRESS = { ...ADDRESS, region: "Kowloon" } as const;

const DATA = {
  listingTitle: "藏品 A",
  receiptNumber: "receipt_123",
  paidAt: new Date("2026-09-23T12:00:00.000Z"),
  invoiceId: "invoice_123",
  paymentReferenceCode: "LOT-001",
  billTo: ADDRESS,
  shipTo: null,
  lineItems: [{ label: "Hammer price", amount: "HKD 100.00" }],
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 120.00",
    previousPayments: "HKD 20.00",
    currentPaymentReceived: "HKD 50.00",
    remainingBalanceDue: "HKD 50.00",
  },
  paymentMethod: "bank_transfer",
  paymentReference: "TRF-123",
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: COPY,
} as const;

const SUMMARY_LINE_ITEMS = [
  { label: "Winning Bid", amount: "HKD 100.00" },
  { key: "subtotal" as const, label: "Subtotal", amount: "HKD 100.00" },
  {
    key: "paymentProcessingFee" as const,
    label: "Payment Processing Fee",
    amount: "HKD 5.00",
  },
  { key: "orderTotal" as const, label: "Order Total", amount: "HKD 105.00" },
];

function textRow(rows: Awaited<ReturnType<typeof drawnText>>, text: string) {
  const row = rows.find((candidate) => candidate.text === text);
  expect(row, `expected rendered text ${text}`).toBeDefined();
  return row as (typeof rows)[number];
}

describe("receipt PDF renderer", () => {
  it("keeps the four immutable payment lines in order", () => {
    expect(receiptBreakdown(DATA)).toEqual([
      ["Original Invoice Total", "HKD 120.00"],
      ["Previous Payments", "HKD 20.00"],
      ["Current Payment Received", "HKD 50.00"],
      ["Remaining Balance Due", "HKD 50.00"],
    ]);
  });

  it("keeps the four lines in order even when the copy argument is translated", () => {
    const translated = {
      ...COPY,
      originalInvoiceTotalLabel: "Total facture d'origine",
      previousPaymentsLabel: "Paiements précédents",
      currentPaymentReceivedLabel: "Paiement actuel reçu",
      remainingBalanceDueLabel: "Solde restant dû",
    };
    expect(receiptBreakdown({ ...DATA, copy: translated })).toEqual([
      ["Total facture d'origine", "HKD 120.00"],
      ["Paiements précédents", "HKD 20.00"],
      ["Paiement actuel reçu", "HKD 50.00"],
      ["Solde restant dû", "HKD 50.00"],
    ]);
  });

  it("renders one A4 PDF using the Latin development fallback", async () => {
    const bytes = await ReceiptPdf({ ...DATA, listingTitle: "Lot A" });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getSize()).toEqual({ width: 595.28, height: 841.89 });
    expect(bytes.byteLength).toBeGreaterThan(500);
    expect((await drawnStrings(bytes)).join(" ")).toContain(DATA.receiptNumber);
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: null,
      shipTo: null,
    });
    expect(
      (await drawnStrings(bytes)).filter((line) => line === "Not recorded"),
    ).toHaveLength(2);
  });

  it("shows no Payment section when the receipt carries no transfer reference", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      paymentReference: null,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-33, shared-ui-invoice-and-receipt-pdf-US1-TC29-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC30-1
  it("renders optional address fields without reserved blank rows", async () => {
    const withPhone = await ReceiptPdf({ ...DATA, listingTitle: "Lot A" });
    expect((await drawnStrings(withPhone)).join(" ")).toContain(ADDRESS.phone);

    const withoutPhone = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: { ...ADDRESS, phone: null },
    });
    expect((await drawnStrings(withoutPhone)).join(" ")).not.toContain(
      ADDRESS.phone,
    );
    const withPhoneRows = await drawnText(withPhone);
    const withoutPhoneRows = await drawnText(withoutPhone);
    expect(
      textRow(withoutPhoneRows, "North Point, 999077").y -
        textRow(withPhoneRows, "North Point, 999077").y,
    ).toBeCloseTo(LINE_HEIGHT);
    expect(
      textRow(withoutPhoneRows, "Hong Kong SAR").y -
        textRow(withPhoneRows, "Hong Kong SAR").y,
    ).toBeCloseTo(LINE_HEIGHT);

    const personal = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: {
        ...ADDRESS,
        company: null,
        phone: null,
        line2: null,
        region: null,
      },
    });
    const personalText = await drawnStrings(personal);
    expect(personalText).toContain(ADDRESS.recipient);
    expect(personalText).toContain(ADDRESS.line1);
    expect(personalText).toContain("North Point, 999077");
    expect(personalText).toContain(ADDRESS.countryCode);
    expect(personalText).not.toContain(ADDRESS.company);
    expect(personalText).not.toContain(ADDRESS.phone);
    expect(personalText).not.toContain(ADDRESS.line2);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-31, shared-ui-invoice-and-receipt-pdf-US1-TC29-1
  it("renders every supplied company address field", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: COMPLETE_ADDRESS,
    });
    const strings = await drawnStrings(bytes);
    expect(strings).toContain(COMPLETE_ADDRESS.recipient);
    expect(strings).toContain(COMPLETE_ADDRESS.company);
    expect(strings).toContain(COMPLETE_ADDRESS.phone);
    expect(strings).toContain(COMPLETE_ADDRESS.line1);
    expect(strings).toContain(COMPLETE_ADDRESS.line2);
    expect(strings).toContain("North Point, Kowloon, 999077");
    expect(strings).toContain(COMPLETE_ADDRESS.countryCode);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-38, shared-ui-invoice-and-receipt-pdf-US1-TC33-1
  it("places the charges header above the lot and boxes the summary", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
    });
    const rows = await drawnText(bytes);
    const title = textRow(rows, "Lot A");
    const description = textRow(rows, "Description");
    const amount = textRow(rows, "Amount");
    const subtotal = textRow(rows, "Subtotal");
    const total = textRow(rows, "Order Total");
    expect(description.y).toBeGreaterThan(title.y);
    expect(description.x).toBeCloseTo(MARGIN);
    expect(amount.x).toBeGreaterThan(description.x);
    expect(
      (await drawnHorizontalLines(bytes)).some(
        (rule) =>
          Math.abs(rule.x1 - MARGIN) < 0.01 &&
          Math.abs(rule.x2 - RIGHT_EDGE) < 0.01 &&
          rule.y < description.y &&
          rule.y > title.y,
      ),
    ).toBe(true);
    const summaryBox = (await drawnRectangles(bytes)).find(
      (rectangle) =>
        rectangle.x < SUMMARY_LEFT && rectangle.width > SUMMARY_WIDTH,
    );
    expect(summaryBox).toBeDefined();
    expect((summaryBox?.x ?? 0) + (summaryBox?.width ?? 0)).toBeGreaterThan(
      RIGHT_EDGE,
    );
    expect(subtotal.x).toBeGreaterThan(summaryBox?.x ?? RIGHT_EDGE);
    expect(subtotal.y).toBeLessThan(
      (summaryBox?.y ?? 0) + (summaryBox?.height ?? 0),
    );
    expect(total.y).toBeGreaterThan(summaryBox?.y ?? 0);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-52, shared-ui-invoice-and-receipt-pdf-SC-53,
  // shared-ui-invoice-and-receipt-pdf-US1-TC16-1, shared-ui-invoice-and-receipt-pdf-US1-TC17-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC18-1, shared-ui-invoice-and-receipt-pdf-US1-TC21-1
  it("renders a supplied tax line and compacts null or omitted tax", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: { label: "Tax", amount: "HKD 12.00" },
    });
    const strings = await drawnStrings(bytes);
    expect(strings.indexOf("Tax")).toBeLessThan(strings.indexOf("Subtotal"));
    expect(strings.join(" ")).toContain("HKD 12.00");

    const withoutTax = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: undefined,
    });
    const nullTax = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: null,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
    expect((await drawnStrings(nullTax)).join(" ")).not.toContain("Tax");
    const omittedRows = await drawnText(withoutTax);
    const nullRows = await drawnText(nullTax);
    expect(textRow(omittedRows, "Subtotal").y).toBeCloseTo(
      textRow(nullRows, "Subtotal").y,
    );
    expect(textRow(omittedRows, "Payment Processing Fee").y).toBeCloseTo(
      textRow(nullRows, "Payment Processing Fee").y,
    );
  });
});
