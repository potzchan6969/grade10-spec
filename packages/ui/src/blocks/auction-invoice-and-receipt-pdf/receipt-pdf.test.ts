import { getMessages } from "@grade10/i18n";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { SAMPLE_RECEIPT, TABLE_LABELS } from "./fixtures";
import { LINE_HEIGHT, MARGIN, RIGHT_EDGE, SUMMARY_LEFT } from "./pdf-document";
import {
  drawnHorizontalLines,
  drawnRectangles,
  drawnRow,
  drawnStrings,
  drawnText,
} from "./pdf-test-helpers";
import { ReceiptPdf, receiptBreakdown } from "./receipt-pdf";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.receipt,
  ...TABLE_LABELS,
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

const LOT_A = {
  title: "Lot A",
  winningBid: "HKD 100.00",
  buyersPremium: "HKD 20.00",
  total: "HKD 120.00",
} as const;

const DATA = {
  items: [LOT_A],
  itemTotal: {
    winningBid: LOT_A.winningBid,
    buyersPremium: LOT_A.buyersPremium,
    total: LOT_A.total,
  },
  receiptNumber: "receipt_123",
  paidAt: new Date("2026-09-23T12:00:00.000Z"),
  invoiceId: "invoice_123",
  paymentReferenceCode: "LOT-001",
  billTo: ADDRESS,
  shipTo: null,
  lineItems: [{ label: "Shipping & Handling", amount: "HKD 80.00" }],
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
  { label: "Shipping & Handling", amount: "HKD 80.00" },
  { key: "subtotal" as const, label: "Subtotal", amount: "HKD 200.00" },
  {
    key: "paymentProcessingFee" as const,
    label: "Payment Processing Fee",
    amount: "HKD 5.00",
  },
  { key: "orderTotal" as const, label: "Order Total", amount: "HKD 205.00" },
];

const HKD_RECEIPT_AMOUNTS = [
  "HK$793.00",
  "HK$159.00",
  "HK$952.00",
  "HK$79.00",
  "HK$1,031.00",
  "HK$0.00",
] as const;

describe("receipt PDF renderer", () => {
  // winner-order-SC-289
  it("renders the HKD receipt fixture with every amount in HKD and no USD winning bid or rate", async () => {
    const strings = await drawnStrings(await ReceiptPdf(SAMPLE_RECEIPT));
    const text = strings.join(" ");

    for (const amount of HKD_RECEIPT_AMOUNTS) expect(strings).toContain(amount);
    const amounts = strings.filter((value) =>
      /^(?:HK\$|\d)[\d,]*\.\d{2}$/.test(value),
    );
    expect(new Set(amounts)).toEqual(new Set(HKD_RECEIPT_AMOUNTS));
    expect(strings.filter((value) => /^\d[\d,]*\.\d{2}$/.test(value))).toEqual(
      [],
    );
    expect(text).not.toMatch(/\bUSD\b|US\$/);
    expect(text).not.toContain("7.85");
  });

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

  // shared-ui-invoice-and-receipt-pdf-SC-68
  it("renders a receipt that fits as exactly one A4 page", async () => {
    const address = {
      recipient: "Alexandra Tran",
      line1: "Flat A, 21/F, One Harbour Square",
      city: "North Point",
      countryCode: "Hong Kong SAR",
    };
    const bytes = await ReceiptPdf({
      ...DATA,
      billTo: address,
      shipTo: address,
      lineItems: SUMMARY_LINE_ITEMS,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getSize()).toEqual({ width: 595.28, height: 841.89 });
    expect((await drawnStrings(bytes)).join(" ")).toContain(DATA.receiptNumber);
  });

  it("renders 'Not recorded' when Bill To or Ship To is withheld entirely", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
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
      paymentReference: null,
    });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-33, shared-ui-invoice-and-receipt-pdf-US1-TC29-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC30-1
  it("renders optional address fields without reserved blank rows", async () => {
    const withPhone = await ReceiptPdf(DATA);
    expect((await drawnStrings(withPhone)).join(" ")).toContain(ADDRESS.phone);

    const withoutPhone = await ReceiptPdf({
      ...DATA,
      billTo: { ...ADDRESS, phone: null },
    });
    expect((await drawnStrings(withoutPhone)).join(" ")).not.toContain(
      ADDRESS.phone,
    );
    const withPhoneRows = await drawnText(withPhone);
    const withoutPhoneRows = await drawnText(withoutPhone);
    expect(
      drawnRow(withoutPhoneRows, "North Point, 999077").y -
        drawnRow(withPhoneRows, "North Point, 999077").y,
    ).toBeCloseTo(LINE_HEIGHT);
    expect(
      drawnRow(withoutPhoneRows, "Hong Kong SAR").y -
        drawnRow(withPhoneRows, "Hong Kong SAR").y,
    ).toBeCloseTo(LINE_HEIGHT);

    const personal = await ReceiptPdf({
      ...DATA,
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

  // shared-ui-invoice-and-receipt-pdf-SC-60
  it("draws the item table, the charges and the summary above the payment breakdown", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      paymentReference: null,
      lineItems: SUMMARY_LINE_ITEMS,
    });
    const rows = await drawnText(bytes);
    const order = [
      "Item",
      "Lot A",
      "Item Total",
      "Shipping & Handling",
      "Subtotal",
      "Payment Processing Fee",
      "Order Total",
      "Original Invoice Total",
      "Previous Payments",
      "Current Payment Received",
      "Remaining Balance Due",
    ].map((text) => drawnRow(rows, text));
    for (const [index, row] of order.entries()) {
      if (index > 0) expect(row.y).toBeLessThan(order[index - 1]?.y ?? 0);
    }
    const header = order[0] as (typeof rows)[number];
    expect(
      (await drawnHorizontalLines(bytes)).some(
        (rule) =>
          Math.abs(rule.x1 - MARGIN) < 0.01 &&
          Math.abs(rule.x2 - RIGHT_EDGE) < 0.01 &&
          rule.y < header.y &&
          rule.y > (order[1]?.y ?? 0),
      ),
    ).toBe(true);
    for (const row of order.slice(4, 7)) {
      expect(row.x).toBeCloseTo(SUMMARY_LEFT, 2);
    }
    const strings = rows.map((row) => row.text);
    expect(strings).not.toContain("Description");
    expect(strings).not.toContain("Amount");
    expect(strings.filter((text) => text === "Lot A")).toHaveLength(1);
    const onItsRow = (label: string, amount: string) =>
      rows.some(
        (row) =>
          row.text === amount &&
          Math.abs(row.y - drawnRow(rows, label).y) < 0.01,
      );
    for (const line of SUMMARY_LINE_ITEMS)
      expect(onItsRow(line.label, line.amount), line.label).toBe(true);
    for (const [label, amount] of [
      ["Original Invoice Total", DATA.paymentBreakdown.originalInvoiceTotal],
      ["Previous Payments", DATA.paymentBreakdown.previousPayments],
      [
        "Current Payment Received",
        DATA.paymentBreakdown.currentPaymentReceived,
      ],
      ["Remaining Balance Due", DATA.paymentBreakdown.remainingBalanceDue],
    ] as const)
      expect(onItsRow(label, amount), label).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-3
  it("draws the summary without a border", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      paymentReference: null,
      lineItems: SUMMARY_LINE_ITEMS,
    });
    expect(await drawnRectangles(bytes)).toEqual([]);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-52, shared-ui-invoice-and-receipt-pdf-SC-53,
  // shared-ui-invoice-and-receipt-pdf-US1-TC16-1, shared-ui-invoice-and-receipt-pdf-US1-TC17-1,
  // shared-ui-invoice-and-receipt-pdf-US1-TC18-1, shared-ui-invoice-and-receipt-pdf-US1-TC21-1
  it("renders a supplied tax line and compacts null or omitted tax", async () => {
    const bytes = await ReceiptPdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: { label: "Tax", amount: "HKD 12.00" },
    });
    const strings = await drawnStrings(bytes);
    expect(strings.indexOf("Tax")).toBeLessThan(strings.indexOf("Subtotal"));
    expect(strings.join(" ")).toContain("HKD 12.00");

    const withoutTax = await ReceiptPdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: undefined,
    });
    const nullTax = await ReceiptPdf({
      ...DATA,
      lineItems: SUMMARY_LINE_ITEMS,
      taxLine: null,
    });
    expect((await drawnStrings(withoutTax)).join(" ")).not.toContain("Tax");
    expect((await drawnStrings(nullTax)).join(" ")).not.toContain("Tax");
    const omittedRows = await drawnText(withoutTax);
    const nullRows = await drawnText(nullTax);
    expect(drawnRow(omittedRows, "Subtotal").y).toBeCloseTo(
      drawnRow(nullRows, "Subtotal").y,
    );
    expect(drawnRow(omittedRows, "Payment Processing Fee").y).toBeCloseTo(
      drawnRow(nullRows, "Payment Processing Fee").y,
    );
  });
});
