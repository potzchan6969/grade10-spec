import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { ReceiptPdf, receiptBreakdown } from "./receipt-pdf";

const COPY = {
  documentTitle: "Receipt",
  billToHeading: "Bill To",
  shipToHeading: "Ship To",
  descriptionLabel: "Description",
  amountLabel: "Amount",
  receiptNumberLabel: "Receipt number",
  invoiceNumberLabel: "Invoice number",
  datePaidLabel: "Date paid",
  paymentMethodLabel: "Payment method",
  paymentReferenceLabel: "Payment reference",
  paymentSectionLabel: "Payment",
  transferReferenceLabel: "Transfer reference",
  paymentBreakdownLabel: "Payment breakdown",
  originalInvoiceTotalLabel: "Original Invoice Total",
  previousPaymentsLabel: "Previous Payments",
  currentPaymentReceivedLabel: "Current Payment Received",
  remainingBalanceDueLabel: "Remaining Balance Due",
} as const;

const DATA = {
  listingTitle: "藏品 A",
  receiptNumber: "receipt_123",
  paidAt: new Date("2026-09-23T12:00:00.000Z"),
  invoiceId: "invoice_123",
  paymentReferenceCode: "LOT-001",
  billTo: null,
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
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: null,
      shipTo: null,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
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
});
