import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import type { InvoicePdfBankRails } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import {
  A4_WIDTH,
  LINE_HEIGHT,
  MARGIN,
  RIGHT_EDGE,
  SUMMARY_LEFT,
  SUMMARY_WIDTH,
} from "./pdf-document";
import {
  drawnContent,
  drawnHorizontalLines,
  drawnRectangles,
  drawnStrings,
  drawnText,
} from "./pdf-test-helpers";

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

const COMPLETE_ADDRESS = { ...ADDRESS, region: "Kowloon" } as const;

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

  // shared-ui-invoice-and-receipt-pdf-SC-47, shared-ui-invoice-and-receipt-pdf-SC-49,
  // shared-ui-invoice-and-receipt-pdf-US1-TC3-1, shared-ui-invoice-and-receipt-pdf-US1-TC47-1
  it("renders the Bank details section when bankRails is given", async () => {
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

  // shared-ui-invoice-and-receipt-pdf-SC-48, shared-ui-invoice-and-receipt-pdf-US1-TC2-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC46-1
  it("renders no Bank details section when bankRails is omitted", async () => {
    const withRails = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      bankRails: BANK_RAILS,
    });
    const withoutRails = await InvoicePdf({ ...DATA, listingTitle: "Lot A" });
    const pdf = await PDFDocument.load(withoutRails);
    expect(pdf.getPageCount()).toBe(1);
    expect(withoutRails.byteLength).toBeLessThan(withRails.byteLength);

    const strings = await drawnStrings(withoutRails);
    expect(strings).not.toContain("Bank details");
    expect(strings).not.toContain("SWIFT");
    expect(strings).not.toContain("FPS");
    expect(strings).not.toContain(BANK_RAILS.reference);
    const rows = await drawnText(withoutRails);
    const totalIndex = rows.findIndex((row) => row.text === "Order Total");
    const issuerIndex = rows.findIndex((row) => row.text === "Grade10");
    expect(totalIndex).toBeGreaterThanOrEqual(0);
    expect(issuerIndex).toBeGreaterThan(totalIndex);
    expect(rows[issuerIndex]?.y).toBeCloseTo(MARGIN + LINE_HEIGHT);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-49, shared-ui-invoice-and-receipt-pdf-SC-50,
  // shared-ui-invoice-and-receipt-pdf-US1-TC47-1, shared-ui-invoice-and-receipt-pdf-US1-TC48-1
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
    const referenceHex = Buffer.from(BANK_RAILS.reference, "latin1")
      .toString("hex")
      .toUpperCase();
    const referenceOffset = content.indexOf(`<${referenceHex}> Tj`);
    expect(referenceOffset).toBeGreaterThan(0);
    expect(
      content.slice(Math.max(0, referenceOffset - 120), referenceOffset),
    ).toMatch(/\/Helvetica-Bold-\d+\s+9\s+Tf/);
    const rows = await drawnText(bytes);
    const swiftHeading = textRow(rows, "SWIFT");
    const fpsHeading = textRow(rows, "FPS");
    const bankHeading = textRow(rows, "Bank details");
    expect(bankHeading.y).toBeGreaterThan(swiftHeading.y);
    expect(swiftHeading.y).toBeCloseTo(fpsHeading.y);
    expect(fpsHeading.x).toBeCloseTo(MARGIN + (A4_WIDTH - MARGIN * 2) / 2);
    expect(rows.some((row) => row.text.includes("GRADE10HKXXX"))).toBe(true);
    expect(rows.some((row) => row.text.includes("HK0000000000000000000"))).toBe(
      true,
    );
    expect(rows.some((row) => row.text.includes("165123456"))).toBe(true);
    expect(
      rows.filter((row) => row.text.includes("Grade10 HK Ltd.")).length,
    ).toBe(2);
    const note = rows.find((row) => row.text.startsWith("Enter"));
    const reference = textRow(rows, BANK_RAILS.reference);
    expect(note?.font).toMatch(/Helvetica-(?!Bold)/);
    expect(reference.font).toMatch(/Helvetica-Bold/);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-50, shared-ui-invoice-and-receipt-pdf-US1-TC48-1
  it("wraps the complete bank note before its bold reference", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      copy: {
        ...COPY,
        bankReferenceNoteLabel:
          "Please include this transfer note in your bank app Memo or Remarks field before submitting the payment for manual verification and settlement through the specified receiving account before the payment is matched",
      },
      bankRails: {
        ...ENABLED_BANK_RAILS,
        reference: "LONG-REFERENCE-12345678901234567890",
      },
    });
    const rows = await drawnText(bytes);
    const note = rows.find((row) => row.text.startsWith("Please"));
    const reference = rows.find((row) =>
      row.text.includes("LONG-REFERENCE-12345678901234567890"),
    );
    expect(note).toBeDefined();
    expect(reference).toBeDefined();
    expect(reference?.x).toBeCloseTo(MARGIN);
    expect(reference?.y).toBeLessThan(note?.y ?? A4_WIDTH);
    expect(note?.font).toMatch(/Helvetica-(?!Bold)/);
    expect(reference?.font).toMatch(/Helvetica-Bold/);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-37, shared-ui-invoice-and-receipt-pdf-US1-TC32-1
  it("places the charges header above the lot and boxes the summary", async () => {
    const bytes = await InvoicePdf({
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
    const rules = await drawnHorizontalLines(bytes);
    expect(
      rules.some(
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
    expect(summaryBox?.x).toBeLessThan(SUMMARY_LEFT);
    expect((summaryBox?.x ?? 0) + (summaryBox?.width ?? 0)).toBeGreaterThan(
      RIGHT_EDGE,
    );
    expect(subtotal.x).toBeGreaterThan(summaryBox?.x ?? A4_WIDTH);
    expect(subtotal.y).toBeLessThan(
      (summaryBox?.y ?? 0) + (summaryBox?.height ?? 0),
    );
    expect(total.y).toBeGreaterThan(summaryBox?.y ?? A4_WIDTH);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-51, shared-ui-invoice-and-receipt-pdf-US1-TC6-1
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

  // shared-ui-invoice-and-receipt-pdf-SC-31, shared-ui-invoice-and-receipt-pdf-SC-32,
  // shared-ui-invoice-and-receipt-pdf-US1-TC27-1, shared-ui-invoice-and-receipt-pdf-US1-TC28-1
  it("renders optional address fields without reserved blank rows", async () => {
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

    const personal = await InvoicePdf({
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

  // shared-ui-invoice-and-receipt-pdf-SC-31, shared-ui-invoice-and-receipt-pdf-US1-TC27-1
  it("renders every supplied company address field", async () => {
    const bytes = await InvoicePdf({
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

  // shared-ui-invoice-and-receipt-pdf-SC-52, shared-ui-invoice-and-receipt-pdf-SC-53,
  // shared-ui-invoice-and-receipt-pdf-US1-TC16-1, shared-ui-invoice-and-receipt-pdf-US1-TC17-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC18-1, shared-ui-invoice-and-receipt-pdf-US1-TC21-1
  it("renders a supplied tax line and compacts null or omitted tax", async () => {
    const bytes = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: { label: "Tax", amount: "HKD 12.00" },
    });
    const strings = await drawnStrings(bytes);
    expect(strings.indexOf("Tax")).toBeLessThan(strings.indexOf("Subtotal"));
    expect(strings.join(" ")).toContain("HKD 12.00");

    const withoutTax = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: null,
    });
    const omittedTax = await InvoicePdf({
      ...DATA,
      listingTitle: "Lot A",
      lineItems: SUMMARY_LINE_ITEMS,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
    expect((await drawnStrings(omittedTax)).join(" ")).not.toContain("Tax");
    const nullRows = await drawnText(withoutTax);
    const omittedRows = await drawnText(omittedTax);
    expect(textRow(nullRows, "Subtotal").y).toBeCloseTo(
      textRow(omittedRows, "Subtotal").y,
    );
    expect(textRow(nullRows, "Payment Processing Fee").y).toBeCloseTo(
      textRow(omittedRows, "Payment Processing Fee").y,
    );
  });
});
