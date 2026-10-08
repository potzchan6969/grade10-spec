import { getMessages } from "@grade10/i18n";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvoicePdf } from "./invoice-pdf";
import { drawnStrings } from "./pdf-test-helpers";
import { ReceiptPdf } from "./receipt-pdf";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const INVOICE_COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.invoice,
  replacesInvoiceLabel: "Replaces invoice",
} as const;
const RECEIPT_COPY = {
  ...auctionInvoicePdf.document,
  ...auctionInvoicePdf.receipt,
} as const;

const FILLER = new Date("2026-09-15T11:04:00.000Z");

const INVOICE = {
  listingTitle: "Lot A",
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: FILLER,
  paymentDeadline: FILLER,
  paymentMethod: "Card",
  billTo: null,
  shipTo: null,
  lineItems: [{ label: "Hammer price", amount: "HKD 100.00" }],
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: INVOICE_COPY,
} as const;

const RECEIPT = {
  listingTitle: "Lot A",
  receiptNumber: "receipt_123",
  paidAt: FILLER,
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
  copy: RECEIPT_COPY,
} as const;

const gmtRows = (strings: string[]) =>
  strings.filter((line) => line.endsWith("GMT+8"));

describe("a document's date rows, read from the rendered page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // shared-ui-invoice-and-receipt-pdf-SC-43, shared-ui-invoice-and-receipt-pdf-US1-TC49-1
  it.each([
    ["sent-at", 0, "2026-09-08T16:00:00Z", "September 9, 2026, 00:00 GMT+8"],
    [
      "payment deadline",
      1,
      "2026-09-08T15:59:00Z",
      "September 8, 2026, 23:59 GMT+8",
    ],
    [
      "payment deadline",
      1,
      "2026-09-08T16:00:00Z",
      "September 9, 2026, 00:00 GMT+8",
    ],
  ])(
    "InvoicePdf draws the %s across a Hong Kong midnight in GMT+8",
    async (_row, index, instant, reads) => {
      vi.stubEnv("TZ", "America/New_York");
      const when = new Date(instant);
      const bytes = await InvoicePdf({
        ...INVOICE,
        sentAt: index === 0 ? when : FILLER,
        paymentDeadline: index === 1 ? when : FILLER,
      });
      const rows = gmtRows(await drawnStrings(bytes));
      expect(rows).toHaveLength(2);
      expect(rows[index]).toBe(reads);
      expect(rows.join(" ")).not.toContain("HKT");
    },
  );

  // shared-ui-invoice-and-receipt-pdf-SC-54, shared-ui-invoice-and-receipt-pdf-US1-TC49-1
  it("ReceiptPdf draws the date paid across a Hong Kong midnight in GMT+8", async () => {
    vi.stubEnv("TZ", "America/New_York");
    const bytes = await ReceiptPdf({
      ...RECEIPT,
      paidAt: new Date("2026-09-08T16:00:00Z"),
    });
    const rows = gmtRows(await drawnStrings(bytes));
    expect(rows).toEqual(["September 9, 2026, 00:00 GMT+8"]);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-55, shared-ui-invoice-and-receipt-pdf-US1-TC50-1
  // A Latin-only translation stands in for Traditional Chinese: the store ships
  // no CJK face, and the claim is that no label of `copy` reaches the date.
  it("draws the same English date and GMT+8 under translated copy", async () => {
    const translated = {
      ...INVOICE_COPY,
      sentAtLabel: "Date d'émission",
      paymentDeadlineLabel: "Date d'échéance",
    };
    const instant = new Date("2026-09-01T12:00:00Z");
    const [english, french] = await Promise.all([
      InvoicePdf({ ...INVOICE, sentAt: instant, paymentDeadline: instant }),
      InvoicePdf({
        ...INVOICE,
        sentAt: instant,
        paymentDeadline: instant,
        copy: translated,
      }),
    ]);
    const expected = [
      "September 1, 2026, 20:00 GMT+8",
      "September 1, 2026, 20:00 GMT+8",
    ];
    expect(gmtRows(await drawnStrings(english))).toEqual(expected);
    expect(gmtRows(await drawnStrings(french))).toEqual(expected);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-55, shared-ui-invoice-and-receipt-pdf-US1-TC50-1
  it("draws the receipt's date paid the same way under translated copy", async () => {
    const instant = new Date("2026-09-01T12:00:00Z");
    const translated = {
      ...RECEIPT_COPY,
      datePaidLabel: "Date du paiement",
    };
    const [english, french] = await Promise.all([
      ReceiptPdf({ ...RECEIPT, paidAt: instant }),
      ReceiptPdf({ ...RECEIPT, paidAt: instant, copy: translated }),
    ]);
    expect(gmtRows(await drawnStrings(english))).toEqual([
      "September 1, 2026, 20:00 GMT+8",
    ]);
    expect(gmtRows(await drawnStrings(french))).toEqual([
      "September 1, 2026, 20:00 GMT+8",
    ]);
  });
});
