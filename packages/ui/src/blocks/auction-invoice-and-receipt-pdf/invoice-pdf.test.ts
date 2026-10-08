import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import type { InvoicePdfBankRails } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import { drawnContent, drawnStrings } from "./pdf-test-helpers";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.invoice,
  replacesInvoiceLabel: "Remplace la facture",
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

const ENABLED_BANK_RAILS = {
  swift: BANK_RAILS.swift,
  fps: BANK_RAILS.fps,
  reference: BANK_RAILS.reference,
};

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
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Card",
  billTo: ADDRESS,
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
    expect((await drawnStrings(bytes)).join(" ")).toContain(DATA.invoiceNumber);
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: null,
      shipTo: null,
    });
    expect(
      (await drawnStrings(bytes)).filter((line) => line === "Not recorded"),
    ).toHaveLength(2);
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
      replacesInvoiceLabel: "Remplace la facture",
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
    expect((await drawnStrings(bytes)).join(" ")).toContain("Facture");
  });

  it("renders the Bank details section when bankRails is given (SC-47, SC-49, SC-50)", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      bankRails: BANK_RAILS,
    });
    const strings = await drawnStrings(bytes);
    expect(strings.join(" ")).toContain("HK local transfer");
    expect(strings.join(" ")).toContain(BANK_RAILS.reference);
    expect(await drawnContent(bytes)).toMatch(/Tf/);
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

  it("renders only enabled bank rails and bolds the reference text", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      bankRails: ENABLED_BANK_RAILS,
    });
    const strings = await drawnStrings(bytes);
    const text = strings.join(" ");
    expect(text).toContain("SWIFT");
    expect(text).toContain("FPS");
    expect(text).not.toContain("HK local transfer");
    expect(text).toContain(BANK_RAILS.reference);
    const content = await drawnContent(bytes);
    const referenceHex = Buffer.from(` ${BANK_RAILS.reference}`, "latin1")
      .toString("hex")
      .toUpperCase();
    const referenceOffset = content.indexOf(`<${referenceHex}> Tj`);
    expect(referenceOffset).toBeGreaterThan(0);
    expect(
      content.slice(Math.max(0, referenceOffset - 120), referenceOffset),
    ).toMatch(/\/Helvetica-Bold-\d+\s+9\s+Tf/);
  });

  it("renders a replacement row with a distinct prior invoice ID only when supplied", async () => {
    const replacement = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      replacesInvoice: { invoiceId: "IN-PRIOR-001" },
    });
    const replacementText = (await drawnStrings(replacement)).join(" ");
    expect(replacementText).toContain("Remplace la facture");
    expect(replacementText).toContain("IN-PRIOR-001");
    expect(replacementText).toContain(DATA.invoiceNumber);

    const current = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      replacesInvoice: null,
    });
    expect((await drawnStrings(current)).join(" ")).not.toContain(
      "Remplace la facture",
    );
  });

  it("renders phone only when the address supplies it", async () => {
    const withPhone = await InvoicePdf({ ...DATA, listingTitle: "Lot A" });
    expect((await drawnStrings(withPhone)).join(" ")).toContain(ADDRESS.phone);

    const withoutPhone = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      billTo: { ...ADDRESS, phone: null },
    });
    expect((await drawnStrings(withoutPhone)).join(" ")).not.toContain(
      ADDRESS.phone,
    );
  });

  it("renders a supplied tax line immediately before the summary", async () => {
    const bytes = await InvoicePdf({
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

    const withoutTax = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      taxLine: null,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
  });
});
