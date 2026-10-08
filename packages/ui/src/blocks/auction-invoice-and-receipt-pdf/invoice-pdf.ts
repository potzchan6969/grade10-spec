import type { PDFPage } from "pdf-lib";
import { PDFDocument } from "pdf-lib";
import type {
  Fonts,
  PdfDocumentCopy,
  PdfLineItem,
  PdfPartyAddress,
  PdfRenderOptions,
} from "./pdf-document";
import {
  A4_HEIGHT,
  A4_WIDTH,
  addressLines,
  BODY_SIZE,
  drawIssuer,
  drawLineItems,
  drawMetaRow,
  drawParties,
  drawRuleSpan,
  drawText,
  drawTitle,
  formatDateTime,
  INK,
  LINE_HEIGHT,
  loadFonts,
  MARGIN,
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
  replacesInvoiceLabel: string;
  bankDetailsHeading: string;
  swiftLabel: string;
  fpsLabel: string;
  hkLocalTransferLabel: string;
  beneficiaryLabel: string;
  swiftBicLabel: string;
  accountIbanLabel: string;
  fpsIdLabel: string;
  bankAndCodeLabel: string;
  accountNoLabel: string;
  bankReferenceNoteLabel: string;
};

/** SWIFT, FPS and HK local transfer, each a self-contained optional rail. */
export type InvoicePdfBankRails = {
  swift?: { beneficiary: string; swiftBic: string; account: string };
  fps?: { fpsId: string; beneficiary: string };
  hkLocalTransfer?: {
    bankAndCode: string;
    beneficiary: string;
    accountNo: string;
  };
  reference: string;
};

export type InvoicePdfReplacement = {
  invoiceId: string;
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
  taxLine?: InvoicePdfLineItem | null;
  replacesInvoice?: InvoicePdfReplacement | null;
  /** Given only on a bank-transfer invoice; omitted renders no Bank details section at all. */
  bankRails?: InvoicePdfBankRails;
  issuerName: string;
  issuerEmail: string;
  copy: InvoicePdfCopy;
};

export type InvoicePdfRenderOptions = PdfRenderOptions;

export { addressLines };

/** Invoice number / Date of issue / Date due / Payment method, one underlined identity row each. */
function drawMetaBlock(
  page: PDFPage,
  fonts: Fonts,
  data: Pick<
    InvoicePdfData,
    | "invoiceNumber"
    | "sentAt"
    | "paymentDeadline"
    | "paymentMethod"
    | "copy"
    | "replacesInvoice"
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
  y -= LINE_HEIGHT;
  if (data.replacesInvoice) {
    drawMetaRow(
      page,
      fonts,
      data.copy.replacesInvoiceLabel,
      data.replacesInvoice.invoiceId,
      y,
    );
    y -= LINE_HEIGHT;
  }
  return y - LINE_HEIGHT * 2;
}

/** One label/value line, wrapped to fit `width` rather than overrunning a narrow column. */
function drawWrappedRow(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  x: number,
  width: number,
  y: number,
): number {
  const lines = wrap(`${label}: ${value}`, fonts.regular, SMALL_SIZE, width);
  for (const line of lines) {
    drawText(page, fonts.regular, line, x, y, SMALL_SIZE, INK);
    y -= LINE_HEIGHT;
  }
  return y;
}

/** The reference note, its own quoted value bolded wherever the wrapped note text ends. */
function drawBankReferenceNote(
  page: PDFPage,
  fonts: Fonts,
  note: string,
  reference: string,
  y: number,
): number {
  const width = A4_WIDTH - MARGIN * 2;
  const lines = wrap(note, fonts.regular, SMALL_SIZE, width);
  for (let index = 0; index < lines.length - 1; index += 1) {
    drawText(page, fonts.regular, lines[index], MARGIN, y, SMALL_SIZE, INK);
    y -= LINE_HEIGHT;
  }
  const lastLine = lines[lines.length - 1] ?? "";
  drawText(page, fonts.regular, lastLine, MARGIN, y, SMALL_SIZE, INK);
  const lastLineWidth = fonts.regular.widthOfTextAtSize(lastLine, SMALL_SIZE);
  drawText(
    page,
    fonts.bold,
    ` ${reference}`,
    MARGIN + lastLineWidth,
    y,
    SMALL_SIZE,
    INK,
  );
  return y - LINE_HEIGHT;
}

/**
 * A full-width "Bank details" section below the order value, given only on
 * a bank-transfer invoice: one equal-width column for each enabled rail, a
 * divider, then the reference note. Omitted entirely -
 * heading, columns and note - when `bankRails` is not given.
 */
function drawBankRails(
  page: PDFPage,
  fonts: Fonts,
  data: Pick<InvoicePdfData, "bankRails" | "copy">,
  y: number,
): number {
  const { bankRails, copy } = data;
  if (!bankRails) return y;

  drawText(
    page,
    fonts.bold,
    copy.bankDetailsHeading,
    MARGIN,
    y,
    BODY_SIZE,
    INK,
  );
  y -= LINE_HEIGHT * 1.6;

  const columns: { heading: string; rows: [string, string][] }[] = [];
  if (bankRails.swift) {
    columns.push({
      heading: copy.swiftLabel,
      rows: [
        [copy.beneficiaryLabel, bankRails.swift.beneficiary],
        [copy.swiftBicLabel, bankRails.swift.swiftBic],
        [copy.accountIbanLabel, bankRails.swift.account],
      ],
    });
  }
  if (bankRails.fps) {
    columns.push({
      heading: copy.fpsLabel,
      rows: [
        [copy.fpsIdLabel, bankRails.fps.fpsId],
        [copy.beneficiaryLabel, bankRails.fps.beneficiary],
      ],
    });
  }
  if (bankRails.hkLocalTransfer) {
    columns.push({
      heading: copy.hkLocalTransferLabel,
      rows: [
        [copy.bankAndCodeLabel, bankRails.hkLocalTransfer.bankAndCode],
        [copy.beneficiaryLabel, bankRails.hkLocalTransfer.beneficiary],
        [copy.accountNoLabel, bankRails.hkLocalTransfer.accountNo],
      ],
    });
  }
  if (columns.length === 0) return y;

  const columnWidth = (A4_WIDTH - MARGIN * 2) / columns.length;

  const columnTop = y;
  let bottom = columnTop;
  for (const [index, column] of columns.entries()) {
    let columnY = columnTop;
    const x = MARGIN + columnWidth * index;
    drawText(page, fonts.bold, column.heading, x, columnY, SMALL_SIZE, INK);
    columnY -= LINE_HEIGHT;
    for (const [label, value] of column.rows) {
      columnY = drawWrappedRow(
        page,
        fonts,
        label,
        value,
        x,
        columnWidth - LINE_HEIGHT,
        columnY,
      );
    }
    bottom = Math.min(bottom, columnY);
  }
  y = bottom - LINE_HEIGHT * 0.5;

  y = drawRuleSpan(page, MARGIN, RIGHT_EDGE, y, { gap: LINE_HEIGHT });
  return drawBankReferenceNote(
    page,
    fonts,
    copy.bankReferenceNoteLabel,
    bankRails.reference,
    y,
  );
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

  const fonts = await loadFonts(pdf, options.fontBytes, options.boldFontBytes);

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
    data.taxLine,
    data.copy,
    y,
  );
  if (data.bankRails) y -= LINE_HEIGHT;
  drawBankRails(page, fonts, data, y);
  drawIssuer(page, fonts, data.issuerName, data.issuerEmail);

  const bytes = await pdf.save({ useObjectStreams: false });
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
}
