import type { PDFPage } from "pdf-lib";
import type {
  Fonts,
  PdfBlock,
  PdfDocumentCopy,
  PdfItemRow,
  PdfItemTotal,
  PdfLineItem,
  PdfPartyAddress,
  PdfRenderOptions,
} from "./pdf-document";
import {
  addressLines,
  BODY_SIZE,
  drawMetaRow,
  drawMoneyRow,
  drawRuleSpan,
  drawText,
  formatDateTime,
  LINE_HEIGHT,
  MARGIN,
  measuredBlock,
  RIGHT_EDGE,
  renderDocument,
  SUMMARY_LEFT,
} from "./pdf-document";

/**
 * The pure half of a receipt PDF: given the payment snapshot, draw the
 * same A4 sheet everywhere it is rendered. A consuming application's own
 * backend calls this for the real archive.
 */

export type ReceiptPdfLineItem = PdfLineItem;

/** The four immutable payment lines, each pre-formatted by the caller. */
export type ReceiptPaymentBreakdown = {
  originalInvoiceTotal: string;
  previousPayments: string;
  currentPaymentReceived: string;
  remainingBalanceDue: string;
};

/** Every label ReceiptPdf draws, supplied by the caller so no text is hardcoded in this package. */
export type ReceiptPdfCopy = PdfDocumentCopy & {
  documentTitle: string;
  receiptNumberLabel: string;
  invoiceNumberLabel: string;
  datePaidLabel: string;
  paymentMethodLabel: string;
  paymentReferenceLabel: string;
  paymentSectionLabel: string;
  transferReferenceLabel: string;
  paymentBreakdownLabel: string;
  originalInvoiceTotalLabel: string;
  previousPaymentsLabel: string;
  currentPaymentReceivedLabel: string;
  remainingBalanceDueLabel: string;
};

/** The only values a receipt renderer is allowed to consume. */
export type ReceiptPdfData = {
  /** One row per item, in the order drawn. */
  items: readonly PdfItemRow[];
  itemTotal: PdfItemTotal;
  receiptNumber: string;
  paidAt: Date;
  invoiceId: string;
  paymentReferenceCode: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  /** The charges under the item table and the keyed summary rows. */
  lineItems: readonly ReceiptPdfLineItem[];
  /** The only route for Tax, drawn after the other charges. */
  taxLine?: ReceiptPdfLineItem | null;
  paymentBreakdown: ReceiptPaymentBreakdown;
  paymentMethod: string;
  paymentReference: string | null;
  issuerName: string;
  issuerEmail: string;
  copy: ReceiptPdfCopy;
};

export type ReceiptPdfRenderOptions = PdfRenderOptions;

export { addressLines };

export function receiptBreakdown(
  data: Pick<ReceiptPdfData, "paymentBreakdown" | "copy">,
): readonly [string, string][] {
  const b = data.paymentBreakdown;
  const { copy } = data;
  return [
    [copy.originalInvoiceTotalLabel, b.originalInvoiceTotal],
    [copy.previousPaymentsLabel, b.previousPayments],
    [copy.currentPaymentReceivedLabel, b.currentPaymentReceived],
    [copy.remainingBalanceDueLabel, b.remainingBalanceDue],
  ];
}

/** Receipt number / Invoice number / Date paid / Payment method / Payment reference, one underlined identity row each. */
function drawMetaBlock(
  page: PDFPage,
  fonts: Fonts,
  data: Pick<
    ReceiptPdfData,
    | "receiptNumber"
    | "paidAt"
    | "invoiceId"
    | "paymentMethod"
    | "paymentReferenceCode"
    | "copy"
  >,
  y: number,
): number {
  drawMetaRow(page, fonts, data.copy.receiptNumberLabel, data.receiptNumber, y);
  y -= LINE_HEIGHT;
  drawMetaRow(page, fonts, data.copy.invoiceNumberLabel, data.invoiceId, y);
  y -= LINE_HEIGHT;
  drawMetaRow(
    page,
    fonts,
    data.copy.datePaidLabel,
    formatDateTime(data.paidAt),
    y,
  );
  y -= LINE_HEIGHT;
  drawMetaRow(page, fonts, data.copy.paymentMethodLabel, data.paymentMethod, y);
  y -= LINE_HEIGHT;
  drawMetaRow(
    page,
    fonts,
    data.copy.paymentReferenceLabel,
    data.paymentReferenceCode,
    y,
  );
  return y - LINE_HEIGHT * 2;
}

/** The "Payment" heading and its transfer reference, drawn only when the payment carries one. */
function paymentSectionBlock(
  fonts: Fonts,
  paymentReference: string,
  copy: ReceiptPdfCopy,
): PdfBlock {
  return measuredBlock((page, y) => {
    drawText(page, fonts.bold, copy.paymentSectionLabel, MARGIN, y, BODY_SIZE);
    y -= LINE_HEIGHT;
    drawMetaRow(page, fonts, copy.transferReferenceLabel, paymentReference, y);
    return y - LINE_HEIGHT * 2;
  });
}

/** The four immutable payment lines from `receiptBreakdown`, boxed and right-aligned. */
function paymentBreakdownBlock(
  fonts: Fonts,
  data: Pick<ReceiptPdfData, "paymentBreakdown" | "copy">,
): PdfBlock {
  const rows = receiptBreakdown(data);
  return measuredBlock((page, y) => {
    drawText(
      page,
      fonts.bold,
      data.copy.paymentBreakdownLabel,
      MARGIN,
      y,
      BODY_SIZE,
    );
    y -= LINE_HEIGHT;
    y = drawRuleSpan(page, SUMMARY_LEFT, RIGHT_EDGE, y, { gap: LINE_HEIGHT });
    for (const [label, amount] of rows.slice(0, -1)) {
      drawMoneyRow(page, fonts, label, amount, SUMMARY_LEFT, y);
      y -= LINE_HEIGHT;
    }
    y = drawRuleSpan(page, SUMMARY_LEFT, RIGHT_EDGE, y, { gap: LINE_HEIGHT });
    const [lastLabel, lastAmount] = rows[rows.length - 1];
    drawMoneyRow(page, fonts, lastLabel, lastAmount, SUMMARY_LEFT, y, true);
    return y - LINE_HEIGHT;
  });
}

/** Render one deterministic receipt of A4 pages from immutable payment and invoice snapshots. */
export function ReceiptPdf(
  data: ReceiptPdfData,
  options: ReceiptPdfRenderOptions = {},
): Promise<ArrayBuffer> {
  const { paymentReference } = data;
  return renderDocument({
    producer: "grade10 auction receipts",
    date: data.paidAt,
    data,
    options,
    drawMeta: (page, fonts, y) => drawMetaBlock(page, fonts, data, y),
    trailing: (fonts) => [
      ...(paymentReference
        ? [
            {
              what: "The Payment section",
              block: paymentSectionBlock(fonts, paymentReference, data.copy),
            },
          ]
        : []),
      {
        what: "The payment breakdown",
        block: paymentBreakdownBlock(fonts, data),
      },
    ],
  });
}
