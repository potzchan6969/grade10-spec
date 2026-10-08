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
  A4_WIDTH,
  addressLines,
  BODY_SIZE,
  drawMetaRow,
  drawRuleSpan,
  drawText,
  formatDateTime,
  INK,
  LINE_HEIGHT,
  MARGIN,
  measuredBlock,
  RIGHT_EDGE,
  renderDocument,
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
  /** One row per item, in the order drawn. */
  items: readonly PdfItemRow[];
  itemTotal: PdfItemTotal;
  /** The display identifier a consumer already formatted, not a row id. */
  invoiceNumber: string;
  sentAt: Date;
  paymentDeadline: Date;
  /** Preformatted, e.g. "Card" or "Bank transfer" - this renderer draws it, never branches on it. */
  paymentMethod: string;
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  /** The charges under the item table and the keyed summary rows. */
  lineItems: readonly InvoicePdfLineItem[];
  /** The only route for Tax, drawn after the other charges. */
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

/** The reference note, wrapped as one mixed-font paragraph with its value bolded. */
function drawBankReferenceNote(
  page: PDFPage,
  fonts: Fonts,
  note: string,
  reference: string,
  y: number,
): number {
  const width = A4_WIDTH - MARGIN * 2;
  const tokens = [
    ...note
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, font: fonts.regular })),
    { text: reference, font: fonts.bold },
  ];
  const lines: (typeof tokens)[] = [];
  let line: typeof tokens = [];
  let lineWidth = 0;
  const spaceWidth = fonts.regular.widthOfTextAtSize(" ", SMALL_SIZE);
  for (const token of tokens) {
    const tokenWidth = token.font.widthOfTextAtSize(token.text, SMALL_SIZE);
    const nextWidth = lineWidth + (line.length ? spaceWidth : 0) + tokenWidth;
    if (line.length && nextWidth > width) {
      lines.push(line);
      line = [];
      lineWidth = 0;
    }
    line.push(token);
    lineWidth += (line.length > 1 ? spaceWidth : 0) + tokenWidth;
  }
  if (line.length) lines.push(line);

  for (const lineTokens of lines) {
    let x = MARGIN;
    let segmentFont = lineTokens[0]?.font ?? fonts.regular;
    let segmentText = lineTokens[0]?.text ?? "";
    for (const token of lineTokens.slice(1)) {
      if (token.font === segmentFont) {
        segmentText += ` ${token.text}`;
        continue;
      }
      const separatedText = `${segmentText} `;
      drawText(page, segmentFont, separatedText, x, y, SMALL_SIZE, INK);
      x += segmentFont.widthOfTextAtSize(separatedText, SMALL_SIZE);
      segmentFont = token.font;
      segmentText = token.text;
    }
    drawText(page, segmentFont, segmentText, x, y, SMALL_SIZE, INK);
    y -= LINE_HEIGHT;
  }
  return y;
}

/**
 * A full-width "Bank details" section below the order value, given only on
 * a bank-transfer invoice: one equal-width column for each enabled rail, a
 * divider, then the reference note. It moves to the next page whole.
 */
function bankDetailsBlock(
  fonts: Fonts,
  bankRails: InvoicePdfBankRails,
  copy: InvoicePdfCopy,
): PdfBlock {
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
  const columnWidth = (A4_WIDTH - MARGIN * 2) / Math.max(columns.length, 1);

  return measuredBlock((page, y) => {
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
    if (columns.length === 0) return y;

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
  });
}

/** Render one deterministic invoice of A4 pages from an immutable invoice snapshot. */
export function InvoicePdf(
  data: InvoicePdfData,
  options: InvoicePdfRenderOptions = {},
): Promise<ArrayBuffer> {
  const { bankRails } = data;
  return renderDocument({
    producer: "grade10 auction invoices",
    date: data.sentAt,
    data,
    options,
    drawMeta: (page, fonts, y) => drawMetaBlock(page, fonts, data, y),
    trailing: (fonts) =>
      bankRails
        ? [
            {
              what: "Bank details",
              block: bankDetailsBlock(fonts, bankRails, data.copy),
            },
          ]
        : [],
  });
}
