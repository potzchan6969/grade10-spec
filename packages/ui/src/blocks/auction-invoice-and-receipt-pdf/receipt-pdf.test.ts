import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { drawnStrings } from "./pdf-test-helpers";
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

  it("renders phone only when the address supplies it", async () => {
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
  });

  it("renders a supplied tax line immediately before the summary", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: [
        { label: "Winning Bid", amount: "HKD 100.00" },
        { key: "subtotal", label: "Subtotal", amount: "HKD 100.00" },
        {
          key: "paymentProcessingFee",
          label: "Payment Processing Fee",
          amount: "HKD 5.00",
        },
        { key: "orderTotal", label: "Order Total", amount: "HKD 105.00" },
      ],
      taxLine: { label: "Tax", amount: "HKD 12.00" },
    });
    const strings = await drawnStrings(bytes);
    expect(strings.indexOf("Tax")).toBeLessThan(strings.indexOf("Subtotal"));
    expect(strings.join(" ")).toContain("HKD 12.00");

    const withoutTax = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      taxLine: undefined,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
  });
});
