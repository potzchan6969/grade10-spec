import type { PDFPage } from "pdf-lib";
import { PDFDocument } from "pdf-lib";
import type {
  Fonts,
  PdfDocumentCopy,
  PdfLineItem,
  PdfPartyAddress,
} from "./pdf-document";
import {
  A4_HEIGHT,
  A4_WIDTH,
  addressLines,
  BODY_SIZE,
  drawIssuer,
  drawLineItems,
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
  MUTED,
  RIGHT_EDGE,
  SMALL_SIZE,
  SUMMARY_LEFT,
  wrap,
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
  footer: string;
};

/** The only values a receipt renderer is allowed to consume. */
export type ReceiptPdfData = {
  listingTitle: string;
  receiptNumber: string;
  paidAt: Date;
  invoiceId: string;
  paymentReferenceCode: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  lineItems: readonly ReceiptPdfLineItem[];
  paymentBreakdown: ReceiptPaymentBreakdown;
  paymentMethod: string;
  paymentReference: string | null;
  issuerName: string;
  issuerEmail: string;
  copy: ReceiptPdfCopy;
};

export type ReceiptPdfRenderOptions = {
  fontBytes?: ArrayBuffer | null;
};

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

/** A transfer reference, only when the payment carries one. */
function drawPaymentSection(
  page: PDFPage,
  fonts: Fonts,
  data: Pick<ReceiptPdfData, "paymentReference" | "copy">,
  y: number,
): number {
  if (!data.paymentReference) return y;
  drawText(
    page,
    fonts.bold,
    data.copy.paymentSectionLabel,
    MARGIN,
    y,
    BODY_SIZE,
  );
  y -= LINE_HEIGHT;
  drawMetaRow(
    page,
    fonts,
    data.copy.transferReferenceLabel,
    data.paymentReference,
    y,
  );
  return y - LINE_HEIGHT * 2;
}

/** The four immutable payment lines from `receiptBreakdown`, boxed and right-aligned. */
function drawPaymentBreakdown(
  page: PDFPage,
  fonts: Fonts,
  data: ReceiptPdfData,
  y: number,
): void {
  drawText(
    page,
    fonts.bold,
    data.copy.paymentBreakdownLabel,
    MARGIN,
    y,
    BODY_SIZE,
  );
  y -= LINE_HEIGHT;

  const rows = receiptBreakdown(data);
  y = drawRuleSpan(page, SUMMARY_LEFT, RIGHT_EDGE, y, { gap: LINE_HEIGHT });
  rows.slice(0, -1).forEach(([label, amount]) => {
    drawMoneyRow(page, fonts, label, amount, SUMMARY_LEFT, y);
    y -= LINE_HEIGHT;
  });
  y = drawRuleSpan(page, SUMMARY_LEFT, RIGHT_EDGE, y, { gap: LINE_HEIGHT });
  const [lastLabel, lastAmount] = rows[rows.length - 1];
  drawMoneyRow(page, fonts, lastLabel, lastAmount, SUMMARY_LEFT, y, true);
}

/** Pinned to the bottom margin, independent of how far the sections above ran. */
function drawFooter(page: PDFPage, fonts: Fonts, footer: string): void {
  for (const line of wrap(
    footer,
    fonts.regular,
    SMALL_SIZE,
    A4_WIDTH - MARGIN * 2,
  )) {
    drawText(page, fonts.regular, line, MARGIN, MARGIN, SMALL_SIZE, MUTED);
  }
}

/** Render one deterministic A4 receipt from immutable payment and invoice snapshots. */
export async function ReceiptPdf(
  data: ReceiptPdfData,
  options: ReceiptPdfRenderOptions = {},
): Promise<ArrayBuffer> {
  const pdf = await PDFDocument.create();
  pdf.setProducer("grade10 auction receipts");
  pdf.setCreationDate(data.paidAt);
  pdf.setModificationDate(data.paidAt);

  const fonts = await loadFonts(pdf, options.fontBytes);

  const page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  y = drawTitle(page, fonts, data.copy.documentTitle, data.issuerName, y);
  y = drawMetaBlock(page, fonts, data, y);
  y = drawRuleSpan(page, MARGIN, RIGHT_EDGE, y, { gap: LINE_HEIGHT * 1.5 });
  y = drawParties(page, fonts, data.billTo, data.shipTo, data.copy, y);
  y = drawLineItems(
    page,
    fonts,
    data.listingTitle,
    data.lineItems,
    data.copy,
    y,
  );
  y -= LINE_HEIGHT;
  y = drawPaymentSection(page, fonts, data, y);
  drawPaymentBreakdown(page, fonts, data, y);
  drawFooter(page, fonts, data.copy.footer);
  drawIssuer(page, fonts, data.issuerName, data.issuerEmail);

  const bytes = await pdf.save({ useObjectStreams: false });
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
}
