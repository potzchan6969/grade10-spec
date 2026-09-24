import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import type { InvoicePdfBankRails } from "./invoice-pdf";
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
  paymentMethodLabel: "Payment method",
  bankDetailsHeading: "Bank details",
  swiftLabel: "SWIFT",
  fpsLabel: "FPS",
  hkLocalTransferLabel: "HK local transfer",
  beneficiaryLabel: "Beneficiary",
  swiftBicLabel: "SWIFT/BIC",
  accountIbanLabel: "Account/IBAN",
  fpsIdLabel: "FPS ID",
  bankAndCodeLabel: "Bank & code",
  accountNoLabel: "Account no.",
  bankReferenceNoteLabel:
    "Enter this reference in your bank app's Memo or Remarks field. Missing it delays verification. Quote this reference on your transfer:",
} as const;

const BANK_RAILS: InvoicePdfBankRails = {
  swift: {
    beneficiary: "Grade10 HK Ltd.",
    swiftBic: "GRADE10HKXXX",
    account: "HK0000000000000000000",
  },
  fps: { fpsId: "165123456", beneficiary: "Grade10 HK Ltd." },
  hkLocalTransfer: {
    bankAndCode: "Example Bank (003)",
    beneficiary: "Grade10 HK Ltd.",
    accountNo: "003-456-123456-001",
  },
  reference: "LK7P2Q01",
};

const DATA = {
  listingTitle: "藏品 A",
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Card",
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
      paymentMethodLabel: "Mode de paiement",
      bankDetailsHeading: "Coordonnées bancaires",
      swiftLabel: "SWIFT",
      fpsLabel: "FPS",
      hkLocalTransferLabel: "Virement local HK",
      beneficiaryLabel: "Bénéficiaire",
      swiftBicLabel: "SWIFT/BIC",
      accountIbanLabel: "Compte/IBAN",
      fpsIdLabel: "ID FPS",
      bankAndCodeLabel: "Banque et code",
      accountNoLabel: "Numéro de compte",
      bankReferenceNoteLabel:
        "Indiquez cette référence dans le champ mémo de votre virement.",
    };
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      copy: arbitraryCopy,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
  });

  it("renders the Bank details section when bankRails is given (SC-47, SC-49, SC-50)", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      bankRails: BANK_RAILS,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(bytes.byteLength).toBeGreaterThan(500);
  });

  it("renders no Bank details section when bankRails is omitted (SC-48)", async () => {
    const withRails = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      bankRails: BANK_RAILS,
    });
    const withoutRails = await InvoicePdf({ ...DATA, listingTitle: "Lot A" });
    const pdf = await PDFDocument.load(withoutRails);
    expect(pdf.getPageCount()).toBe(1);
    expect(withoutRails.byteLength).toBeLessThan(withRails.byteLength);
  });
});
