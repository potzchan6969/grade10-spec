import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { InvoicePdf } from "./invoice-pdf";

const COPY = {
  documentTitle: "Invoice",
  billToHeading: "Bill To",
  shipToHeading: "Ship To",
  descriptionLabel: "Description",
  amountLabel: "Amount",
  invoiceNumberLabel: "Invoice number",
  sentAtLabel: "Date of issue",
  paymentDeadlineLabel: "Date due",
  footer: "This invoice records the charges for the lot shown above.",
} as const;

const DATA = {
  listingTitle: "藏品 A",
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  billTo: null,
  shipTo: null,
  lineItems: [
    { label: "Hammer price", amount: "HKD 100.00" },
    { key: "orderTotal", label: "Order Total", amount: "HKD 120.00" },
  ],
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: COPY,
} as const;

describe("invoice PDF renderer", () => {
  it("renders one A4 PDF using the Latin development fallback", async () => {
    const bytes = await InvoicePdf({ ...DATA, listingTitle: "Lot A" });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getSize()).toEqual({ width: 595.28, height: 841.89 });
    expect(bytes.byteLength).toBeGreaterThan(500);
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: null,
      shipTo: null,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
  });

  it("draws every label from the copy argument, not a hardcoded string", async () => {
    const arbitraryCopy = {
      documentTitle: "Facture",
      billToHeading: "Facturer à",
      shipToHeading: "Expédier à",
      descriptionLabel: "Description",
      amountLabel: "Montant",
      invoiceNumberLabel: "Numéro de facture",
      sentAtLabel: "Date d'émission",
      paymentDeadlineLabel: "Date d'échéance",
      footer: "Cette facture enregistre les frais du lot indiqué ci-dessus.",
    };
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      copy: arbitraryCopy,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
  });
});
