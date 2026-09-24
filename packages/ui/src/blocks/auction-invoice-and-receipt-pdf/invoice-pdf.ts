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
  drawIssuer,
  drawLineItems,
  drawMetaRow,
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
  wrap,
} from "./pdf-document";

/**
 * The pure half of an invoice PDF: given the invoice snapshot, draw the
 * same A4 sheet everywhere it is rendered - the sibling of `ReceiptPdf`,
 * sharing its layout primitives from `./pdf-document`. A consuming
 * application's own backend calls this for the real download.
 */

export type InvoicePdfLineItem = PdfLineItem;

/** Every label InvoicePdf draws, supplied by the caller so no text is hardcoded in this package. */
export type InvoicePdfCopy = PdfDocumentCopy & {
  documentTitle: string;
  invoiceNumberLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  paymentMethodLabel: string;
  footer: string;
};

/** The only values an invoice renderer is allowed to consume. */
export type InvoicePdfData = {
  listingTitle: string;
  /** The display identifier a consumer already formatted, not a row id. */
  invoiceNumber: string;
  sentAt: Date;
  paymentDeadline: Date;
  /** Preformatted, e.g. "Card" or "Bank transfer" - this renderer draws it, never branches on it. */
  paymentMethod: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  lineItems: readonly InvoicePdfLineItem[];
  issuerName: string;
  issuerEmail: string;
  copy: InvoicePdfCopy;
};

export type InvoicePdfRenderOptions = {
  fontBytes?: ArrayBuffer | null;
};

export { addressLines };

/** Invoice number / Date of issue / Date due / Payment method, one underlined identity row each. */
function drawMetaBlock(
  page: PDFPage,
  fonts: Fonts,
  data: Pick<
    InvoicePdfData,
    "invoiceNumber" | "sentAt" | "paymentDeadline" | "paymentMethod" | "copy"
  >,
  y: number,
): number {
  drawMetaRow(page, fonts, data.copy.invoiceNumberLabel, data.invoiceNumber, y);
  y -= LINE_HEIGHT;
  drawMetaRow(
    page,
    fonts,
    data.copy.sentAtLabel,
    formatDateTime(data.sentAt),
    y,
  );
  y -= LINE_HEIGHT;
  drawMetaRow(
    page,
    fonts,
    data.copy.paymentDeadlineLabel,
    formatDateTime(data.paymentDeadline),
    y,
  );
  y -= LINE_HEIGHT;
  drawMetaRow(page, fonts, data.copy.paymentMethodLabel, data.paymentMethod, y);
  return y - LINE_HEIGHT * 2;
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

/** Render one deterministic A4 invoice from an immutable invoice snapshot. */
export async function InvoicePdf(
  data: InvoicePdfData,
  options: InvoicePdfRenderOptions = {},
): Promise<ArrayBuffer> {
  const pdf = await PDFDocument.create();
  pdf.setProducer("grade10 auction invoices");
  pdf.setCreationDate(data.sentAt);
  pdf.setModificationDate(data.sentAt);

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
  drawFooter(page, fonts, data.copy.footer);
  drawIssuer(page, fonts, data.issuerName, data.issuerEmail);

  const bytes = await pdf.save({ useObjectStreams: false });
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
}
