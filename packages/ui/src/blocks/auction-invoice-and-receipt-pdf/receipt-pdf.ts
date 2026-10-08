import type { PDFPage } from "pdf-lib";
import { PDFDocument } from "pdf-lib";
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
  drawIssuer,
  drawMetaRow,
  drawMoneyRow,
  drawParties,
  drawRuleSpan,
  drawText,
  drawTitle,
  formatDateTime,
  LINE_HEIGHT,
  loadFonts,
  MARGIN,
  measuredBlock,
  measureItemTable,
  place,
  placeItemTable,
  RIGHT_EDGE,
  requireItems,
  SUMMARY_LEFT,
  startSheet,
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
export function paymentSectionBlock(
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
export function paymentBreakdownBlock(
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
export async function ReceiptPdf(
  data: ReceiptPdfData,
  options: ReceiptPdfRenderOptions = {},
): Promise<ArrayBuffer> {
  requireItems(data.items);
  const pdf = await PDFDocument.create();
  pdf.setProducer("grade10 auction receipts");
  pdf.setCreationDate(data.paidAt);
  pdf.setModificationDate(data.paidAt);

  const fonts = await loadFonts(pdf, options.fontBytes, options.boldFontBytes);
  const table = measureItemTable(fonts, data);
  const paymentSection = data.paymentReference
    ? paymentSectionBlock(fonts, data.paymentReference, data.copy)
    : null;
  const paymentBreakdown = paymentBreakdownBlock(fonts, data);

  const sheet = startSheet(pdf);
  const { page } = sheet;
  let y = drawTitle(
    page,
    fonts,
    data.copy.documentTitle,
    data.issuerName,
    sheet.y,
  );
  y = drawMetaBlock(page, fonts, data, y);
  y = drawRuleSpan(page, MARGIN, RIGHT_EDGE, y, { gap: LINE_HEIGHT * 1.5 });
  sheet.y = drawParties(page, fonts, data.billTo, data.shipTo, data.copy, y);
  placeItemTable(sheet, table);
  if (paymentSection) place(sheet, paymentSection);
  place(sheet, paymentBreakdown);
  drawIssuer(sheet.page, fonts, data.issuerName, data.issuerEmail);

  const bytes = await pdf.save({ useObjectStreams: false });
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
}
