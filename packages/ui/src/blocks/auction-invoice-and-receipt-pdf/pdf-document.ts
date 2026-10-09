import fontkit from "@pdf-lib/fontkit";
import type { PDFFont, PDFPage } from "pdf-lib";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * The A4 layout, the measured blocks and the pages every document this
 * capability renders with pdf-lib is drawn on - `ReceiptPdf` and
 * `InvoicePdf` are the two documents. `../../index` is the contract: a
 * caller wants a document, never a bare `drawText`, though the block's
 * `*` subpath can still reach this file directly.
 */

export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;
export const MARGIN = 48;
export const BODY_SIZE = 10;
export const SMALL_SIZE = 9;
export const TITLE_SIZE = 20;
export const LINE_HEIGHT = 15;
export const INK = rgb(0.12, 0.12, 0.12);
export const MUTED = rgb(0.4, 0.4, 0.4);
export const RULE = rgb(0, 0, 0);

/** Where a money row's amount right-aligns to. */
export const RIGHT_EDGE = A4_WIDTH - MARGIN;
/** Where an identity row's value starts - clear of every label this sheet draws, including "Payment reference". */
export const META_VALUE_LEFT = MARGIN + 160;
/** The summary: right-aligned, narrower than the sheet. */
export const SUMMARY_WIDTH = 220;
export const SUMMARY_LEFT = RIGHT_EDGE - SUMMARY_WIDTH;
/** The lowest y any body block reaches on any page, keeping the issuer band clear. */
export const BODY_BOTTOM = MARGIN + 3 * LINE_HEIGHT;
/** Where a continuation page's first line sits. */
export const PAGE_TOP = A4_HEIGHT - MARGIN - SMALL_SIZE;
/** Space under an item row's last line. */
export const ROW_PADDING = 6;
/** Between the Item column and the first amount column, and between amount columns. */
export const COLUMN_GAP = 12;
export const MIN_AMOUNT_COLUMN = 72;
/** Below this the Item column cannot hold a title, and the document is refused. */
export const MIN_TITLE_COLUMN = 120;
/** From a table rule down to the baseline of the row under it. */
const ROW_LEAD = 14;

/** Same shape as the `AddressSnapshot` jsonb column, without importing the schema that types it. */
export type PdfPartyAddress = Record<string, string | null> | null;

/** `amount` arrives pre-formatted - a caller's own money-formatting module is the only place minor units become text. */
export type PdfLineItem = {
  /** Recognized regardless of `label`'s text, so a translated label still
   * routes into the summary. Absent on an ordinary charge. */
  key?: "subtotal" | "paymentProcessingFee" | "orderTotal";
  label: string;
  amount: string;
};

/** One item of the table. Every amount arrives formatted; the block adds none of them up. */
export type PdfItemRow = {
  title: string;
  winningBid: string;
  buyersPremium: string;
  total: string;
};

/** The Item Total row's three amounts, supplied rather than summed. */
export type PdfItemTotal = {
  winningBid: string;
  buyersPremium: string;
  total: string;
};

/** Every label `pdf-document.ts` itself draws, supplied by the caller so no text is hardcoded in this package. */
export type PdfDocumentCopy = {
  billToHeading: string;
  shipToHeading: string;
  itemLabel: string;
  winningBidLabel: string;
  buyersPremiumLabel: string;
  totalLabel: string;
  itemTotalLabel: string;
};

/**
 * The regular face every line falls back to, and a bold face for titles,
 * headings and totals. The Latin path gets a real bold standard font for
 * free; a document drawn in an embedded face takes its bold from
 * `boldFontBytes`, and without one `bold` is the same face as `regular` -
 * plain weight throughout rather than a missing glyph.
 */
export type Fonts = { regular: PDFFont; bold: PDFFont };

/** The embedded faces a caller supplies when the standard fonts cannot draw its text. */
export type PdfRenderOptions = {
  fontBytes?: ArrayBuffer | null;
  boldFontBytes?: ArrayBuffer | null;
};

export async function loadFonts(
  pdf: PDFDocument,
  fontBytes?: ArrayBuffer | null,
  boldFontBytes?: ArrayBuffer | null,
): Promise<Fonts> {
  if (fontBytes) {
    pdf.registerFontkit(fontkit);
    const regular = await pdf.embedFont(fontBytes, { subset: true });
    const bold = boldFontBytes
      ? await pdf.embedFont(boldFontBytes, { subset: true })
      : regular;
    return { regular, bold };
  }
  return {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
}

/** Every document is issued from Hong Kong, whichever storefront it names. */
const DOCUMENT_TIME_ZONE = "Asia/Hong_Kong";

/** `September 24, 2026, 12:30 GMT+8`. */
export function formatDateTime(value: Date): string {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: DOCUMENT_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: DOCUMENT_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
    // The document zone's offset at the instant, `GMT+8`, matching emails and terms.
    timeZoneName: "shortOffset",
  }).format(value);
  return `${date}, ${time}`;
}

export function addressLines(address: PdfPartyAddress): string[] {
  if (!address) return ["Not recorded"];
  return [
    address.recipient,
    address.company,
    address.phone,
    address.line1,
    address.line2,
    [address.city, address.region, address.postalCode]
      .filter((part): part is string => Boolean(part))
      .join(", "),
    address.countryCode,
  ].filter((line): line is string => Boolean(line));
}

/** Lines of `text` no wider than `width`, breaking inside a word only when the word alone is wider. */
export function wrap(
  text: string,
  font: PDFFont,
  size: number,
  width: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const character of word) {
      if (line && font.widthOfTextAtSize(line + character, size) > width) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  size = BODY_SIZE,
  color = INK,
): void {
  page.drawText(text, { x, y, size, font, color });
}

export function drawTextRight(
  page: PDFPage,
  font: PDFFont,
  text: string,
  rightX: number,
  y: number,
  size = BODY_SIZE,
  color = INK,
): void {
  drawText(
    page,
    font,
    text,
    rightX - font.widthOfTextAtSize(text, size),
    y,
    size,
    color,
  );
}

/** A rule spanning `x1` to `x2`, returning the y a caller resumes drawing at. */
export function drawRuleSpan(
  page: PDFPage,
  x1: number,
  x2: number,
  y: number,
  options: {
    gap?: number;
    thickness?: number;
  } = {},
): number {
  const { gap = 5, thickness = 0.6 } = options;
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness,
    color: RULE,
  });
  return y - gap;
}

/** An identity row - label bold and black, value left-aligned in its own column. */
export function drawMetaRow(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  y: number,
): void {
  drawText(page, fonts.bold, label, MARGIN, y, BODY_SIZE, INK);
  drawText(page, fonts.regular, value, META_VALUE_LEFT, y, BODY_SIZE, INK);
}

/** A money row - label and its right-aligned amount, bold for a total. */
export function drawMoneyRow(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  x: number,
  y: number,
  bold = false,
): void {
  const font = bold ? fonts.bold : fonts.regular;
  drawText(page, font, label, x, y, BODY_SIZE, INK);
  drawTextRight(page, font, value, RIGHT_EDGE, y, BODY_SIZE, INK);
}

/** Bill To and Ship To, side by side. */
export function drawParties(
  page: PDFPage,
  fonts: Fonts,
  billTo: PdfPartyAddress,
  shipTo: PdfPartyAddress,
  copy: Pick<PdfDocumentCopy, "billToHeading" | "shipToHeading">,
  y: number,
): number {
  drawText(page, fonts.bold, copy.billToHeading, MARGIN, y, BODY_SIZE, INK);
  drawText(
    page,
    fonts.bold,
    copy.shipToHeading,
    A4_WIDTH / 2,
    y,
    BODY_SIZE,
    INK,
  );
  y -= LINE_HEIGHT;
  const billing = addressLines(billTo);
  const shipping = addressLines(shipTo);
  const addressRows = Math.max(billing.length, shipping.length);
  for (let index = 0; index < addressRows; index += 1) {
    if (billing[index])
      drawText(page, fonts.regular, billing[index], MARGIN, y);
    if (shipping[index]) {
      drawText(page, fonts.regular, shipping[index], A4_WIDTH / 2, y);
    }
    y -= LINE_HEIGHT;
  }
  return y - LINE_HEIGHT;
}

/**
 * A section drawn from `y` down, returning the y the section after it starts
 * at. Drawing it on a page that only records coordinates is how it is
 * measured, so its measured height and what it draws are one computation.
 */
export type PdfLayout = (page: PDFPage, y: number) => number;

/** A section measured before anything is drawn. */
export type PdfBlock = {
  /** From the y it is drawn at down to the lowest y it draws at. */
  height: number;
  /** From that lowest y down to the y the next block starts at. */
  after: number;
  draw: (page: PDFPage, y: number) => void;
};

export function measuredBlock(layout: PdfLayout): PdfBlock {
  let lowest = 0;
  const reach = (y: number) => {
    lowest = Math.min(lowest, y);
  };
  const measuring = {
    drawText: (_text: string, options: { y: number }) => reach(options.y),
    drawLine: (options: { start: { y: number }; end: { y: number } }) => {
      reach(options.start.y);
      reach(options.end.y);
    },
  } as unknown as PDFPage;
  const next = layout(measuring, 0);
  return {
    height: -lowest,
    after: lowest - next,
    draw: (page, y) => {
      layout(page, y);
    },
  };
}

type AmountKey = keyof PdfItemTotal;

const AMOUNT_KEYS: readonly AmountKey[] = [
  "winningBid",
  "buyersPremium",
  "total",
];

const AMOUNT_LABEL: Record<
  AmountKey,
  "winningBidLabel" | "buyersPremiumLabel" | "totalLabel"
> = {
  winningBid: "winningBidLabel",
  buyersPremium: "buyersPremiumLabel",
  total: "totalLabel",
};

/** How one kind of table line is set; the column widths and the draws read the same one. */
type Cell = { font: keyof Fonts; size: number };

const HEADER_CELL: Cell = { font: "bold", size: SMALL_SIZE };
const ROW_CELL: Cell = { font: "regular", size: BODY_SIZE };
const TOTAL_CELL: Cell = { font: "bold", size: BODY_SIZE };

/** Where each amount column right-aligns, and how wide that leaves the Item column. */
type Columns = { titleWidth: number; right: Record<AmountKey, number> };

export type PdfItemTableData = {
  items: readonly PdfItemRow[];
  itemTotal: PdfItemTotal;
  /** The charges under the table and the keyed summary rows, never the items or Tax. */
  lineItems: readonly PdfLineItem[];
  taxLine?: PdfLineItem | null;
  copy: PdfDocumentCopy;
};

/** The table's blocks: the column header, one row per item, and the tail from the Item Total row to the summary. */
export type PdfItemTable = {
  header: PdfBlock;
  rows: readonly [PdfBlock, ...PdfBlock[]];
  tail: PdfBlock;
};

/** Each amount column is as wide as its widest heading or amount, so no amount wraps, shrinks or overflows. */
function measureColumns(fonts: Fonts, data: PdfItemTableData): Columns {
  const width = (cell: Cell, text: string) =>
    fonts[cell.font].widthOfTextAtSize(text, cell.size);
  const columnWidth = (key: AmountKey) =>
    Math.max(
      MIN_AMOUNT_COLUMN,
      width(HEADER_CELL, data.copy[AMOUNT_LABEL[key]]),
      width(TOTAL_CELL, data.itemTotal[key]),
      ...data.items.map((item) => width(ROW_CELL, item[key])),
    );
  const total = RIGHT_EDGE;
  const buyersPremium = total - columnWidth("total") - COLUMN_GAP;
  const winningBid = buyersPremium - columnWidth("buyersPremium") - COLUMN_GAP;
  const titleWidth =
    winningBid - columnWidth("winningBid") - COLUMN_GAP - MARGIN;
  if (titleWidth < MIN_TITLE_COLUMN) {
    throw new RangeError(
      `The amounts do not fit: the three amount columns leave the Item column ${Math.round(titleWidth)}pt wide, under the ${MIN_TITLE_COLUMN}pt a title needs.`,
    );
  }
  return { titleWidth, right: { winningBid, buyersPremium, total } };
}

function drawAmounts(
  page: PDFPage,
  fonts: Fonts,
  cell: Cell,
  columns: Columns,
  amounts: PdfItemTotal,
  y: number,
): void {
  for (const key of AMOUNT_KEYS) {
    drawTextRight(
      page,
      fonts[cell.font],
      amounts[key],
      columns.right[key],
      y,
      cell.size,
    );
  }
}

/** The room a fresh page gives a block below `continuation`, when one repeats there, and above `BODY_BOTTOM`. */
function pageRoom(continuation?: PdfBlock): number {
  const repeated = continuation ? continuation.height + continuation.after : 0;
  return PAGE_TOP - repeated - BODY_BOTTOM;
}

/** Refuses, before any page is drawn, a block that a fresh page could not hold whole. */
export function requireFits(
  block: PdfBlock,
  what: string,
  continuation?: PdfBlock,
  subject = "it",
): void {
  const room = pageRoom(continuation);
  if (block.height > room) {
    throw new RangeError(
      `${what} does not fit: ${subject} is ${Math.round(block.height)}pt tall and a page holds ${Math.round(room)}pt.`,
    );
  }
}

const ORDER_TOTAL_SIZE = 13;

/**
 * The three lines every order value ends in - never a charge of their own,
 * always the arithmetic over the charges above them. Pulled out of the flat
 * charge list into their own right-aligned summary, Order Total
 * bold and set off by a rule the way a receipt's payment breakdown is.
 * Grouped by `PdfLineItem.key`, not `label` text - a translated label must
 * still route into the summary.
 */
function drawSummary(
  page: PDFPage,
  fonts: Fonts,
  summary: readonly PdfLineItem[],
  y: number,
): number {
  for (const item of summary) {
    if (item.key !== "orderTotal") {
      drawMoneyRow(page, fonts, item.label, item.amount, SUMMARY_LEFT, y);
      y -= LINE_HEIGHT;
      continue;
    }
    y = drawRuleSpan(page, SUMMARY_LEFT, RIGHT_EDGE, y, {
      gap: LINE_HEIGHT,
    });
    drawText(
      page,
      fonts.bold,
      item.label,
      SUMMARY_LEFT,
      y,
      ORDER_TOTAL_SIZE,
      INK,
    );
    drawTextRight(
      page,
      fonts.bold,
      item.amount,
      RIGHT_EDGE,
      y,
      ORDER_TOTAL_SIZE,
      INK,
    );
    y -= LINE_HEIGHT;
  }
  return y;
}

/**
 * Measures the whole table before any page is drawn, so every page lines up
 * and a table that cannot be drawn whole is refused rather than cut: no
 * items at all, amounts too wide for the Item column, or an item row or the
 * tail taller than a page holds under the column header.
 */
export function measureItemTable(
  fonts: Fonts,
  data: PdfItemTableData,
): PdfItemTable {
  const [firstItem, ...otherItems] = data.items;
  if (!firstItem) {
    throw new RangeError(
      "No items were given: an invoice or receipt lists at least one item.",
    );
  }
  const { copy } = data;
  const columns = measureColumns(fonts, data);

  const header = measuredBlock((page, y) => {
    drawText(
      page,
      fonts[HEADER_CELL.font],
      copy.itemLabel,
      MARGIN,
      y,
      HEADER_CELL.size,
    );
    for (const key of AMOUNT_KEYS) {
      drawTextRight(
        page,
        fonts[HEADER_CELL.font],
        copy[AMOUNT_LABEL[key]],
        columns.right[key],
        y,
        HEADER_CELL.size,
      );
    }
    return drawRuleSpan(page, MARGIN, RIGHT_EDGE, y - 4, {
      thickness: 0.8,
      gap: 0,
    });
  });

  const rowOf = (item: PdfItemRow, index: number) => {
    const lines = wrap(
      item.title,
      fonts[ROW_CELL.font],
      ROW_CELL.size,
      columns.titleWidth,
    );
    const row = measuredBlock((page, y) => {
      const first = y - ROW_LEAD;
      for (const [line, text] of lines.entries()) {
        drawText(
          page,
          fonts[ROW_CELL.font],
          text,
          MARGIN,
          first - line * LINE_HEIGHT,
          ROW_CELL.size,
        );
      }
      drawAmounts(page, fonts, ROW_CELL, columns, item, first);
      const last = first - (Math.max(lines.length, 1) - 1) * LINE_HEIGHT;
      return last - LINE_HEIGHT - ROW_PADDING + ROW_LEAD;
    });
    requireFits(row, "The item row", header, `item ${index + 1}`);
    return row;
  };
  const rows: [PdfBlock, ...PdfBlock[]] = [
    rowOf(firstItem, 0),
    ...otherItems.map((item, index) => rowOf(item, index + 1)),
  ];

  const charges = data.lineItems.filter((item) => item.key === undefined);
  if (data.taxLine) charges.push(data.taxLine);
  const summary = data.lineItems.filter((item) => item.key !== undefined);
  const tail = measuredBlock((page, y) => {
    drawRuleSpan(page, MARGIN, RIGHT_EDGE, y, {
      thickness: 0.8,
    });
    let line = y - ROW_LEAD;
    drawText(
      page,
      fonts[TOTAL_CELL.font],
      copy.itemTotalLabel,
      MARGIN,
      line,
      TOTAL_CELL.size,
    );
    drawAmounts(page, fonts, TOTAL_CELL, columns, data.itemTotal, line);
    line -= LINE_HEIGHT * 1.4;
    for (const charge of charges) {
      drawMoneyRow(page, fonts, charge.label, charge.amount, MARGIN, line);
      line -= LINE_HEIGHT;
    }
    if (summary.length > 0) {
      line = drawSummary(page, fonts, summary, line - LINE_HEIGHT * 0.6);
    }
    return line - LINE_HEIGHT;
  });
  requireFits(tail, "The Item Total row with its charges", header);

  return { header, rows, tail };
}

/** The document being drawn, its current page and the y the next block starts at. */
export type Sheet = { pdf: PDFDocument; page: PDFPage; y: number };

export function startSheet(pdf: PDFDocument): Sheet {
  const page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
  return { pdf, page, y: A4_HEIGHT - MARGIN };
}

function drawOn(sheet: Sheet, block: PdfBlock): void {
  block.draw(sheet.page, sheet.y);
  sheet.y -= block.height + block.after;
}

/**
 * Draws a block whole: on the current page when it stays above
 * `BODY_BOTTOM`, otherwise on a new page, under `continuation` when given.
 * A page is added only when a block needs it, so a document that fits is
 * one page.
 */
export function place(
  sheet: Sheet,
  block: PdfBlock,
  continuation?: PdfBlock,
): void {
  if (sheet.y - block.height < BODY_BOTTOM) {
    sheet.page = sheet.pdf.addPage([A4_WIDTH, A4_HEIGHT]);
    sheet.y = PAGE_TOP;
    if (continuation) drawOn(sheet, continuation);
  }
  drawOn(sheet, block);
}

/** Two blocks that move as one, the second under the first. */
function together(first: PdfBlock, second: PdfBlock): PdfBlock {
  return {
    height: first.height + first.after + second.height,
    after: second.after,
    draw: (page, y) => {
      first.draw(page, y);
      second.draw(page, y - first.height - first.after);
    },
  };
}

/**
 * The column header with the first row, so the header never ends a page
 * alone, then each further row, then the tail. A page the table continues
 * on opens with the header, and nothing else of the page head.
 */
export function placeItemTable(sheet: Sheet, table: PdfItemTable): void {
  const [first, ...rest] = table.rows;
  place(sheet, together(table.header, first));
  for (const row of rest) place(sheet, row, table.header);
  place(sheet, table.tail, table.header);
}

/** A section after the table, named for the refusal when a page cannot hold it. */
export type PdfTrailingBlock = { what: string; block: PdfBlock };

/** What both documents draw the same way: the table, the parties, the issuer and the document's own date. */
export type PdfDocumentData = PdfItemTableData & {
  billTo: PdfPartyAddress;
  shipTo: PdfPartyAddress;
  issuerName: string;
  issuerEmail: string;
  copy: PdfDocumentCopy & { documentTitle: string };
};

/**
 * Renders one document of A4 pages. Every block is measured, and refused if
 * a page could not hold it, before the first page exists. The head sits on
 * page 1 only, the table and the trailing blocks follow it whole, and the
 * issuer block goes on the last page. The document's own date stamps it and
 * the clock is read nowhere, so the same data renders to the same bytes.
 */
export async function renderDocument(document: {
  producer: string;
  date: Date;
  data: PdfDocumentData;
  options: PdfRenderOptions;
  drawMeta: (page: PDFPage, fonts: Fonts, y: number) => number;
  trailing: (fonts: Fonts) => readonly PdfTrailingBlock[];
}): Promise<ArrayBuffer> {
  const { data } = document;
  const pdf = await PDFDocument.create();
  pdf.setProducer(document.producer);
  pdf.setCreationDate(document.date);
  pdf.setModificationDate(document.date);

  const fonts = await loadFonts(
    pdf,
    document.options.fontBytes,
    document.options.boldFontBytes,
  );
  const table = measureItemTable(fonts, data);
  const trailing = document.trailing(fonts);
  for (const { what, block } of trailing) requireFits(block, what);

  const sheet = startSheet(pdf);
  const { page } = sheet;
  let y = drawTitle(
    page,
    fonts,
    data.copy.documentTitle,
    data.issuerName,
    sheet.y,
  );
  y = document.drawMeta(page, fonts, y);
  y = drawRuleSpan(page, MARGIN, RIGHT_EDGE, y, { gap: LINE_HEIGHT * 1.5 });
  sheet.y = drawParties(page, fonts, data.billTo, data.shipTo, data.copy, y);
  placeItemTable(sheet, table);
  for (const { block } of trailing) place(sheet, block);
  drawIssuer(sheet.page, fonts, data.issuerName, data.issuerEmail);

  const bytes = await pdf.save({ useObjectStreams: false });
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
}

/**
 * Grade10's wordmark, as the same vector path
 * `@grade10/design-system`'s `G10LogoMono` draws (viewBox `0 0 280 52`).
 * Keyed by brand name because that is all a caller here has - a brand
 * with no mark on file falls back to its name as text, the way a
 * missing bold face falls back to plain weight.
 */
const LOGO_PATHS: Record<string, { d: string; width: number; height: number }> =
  {
    Grade10: {
      width: 280,
      height: 52,
      d: "M254.177 -2.49207e-05C239.917 -2.49207e-05 228.356 11.626 228.356 25.9674C228.356 40.3089 239.917 51.9349 254.177 51.9349C268.437 51.9349 279.997 40.3089 279.997 25.9674C279.997 11.626 268.437 -2.49207e-05 254.177 -2.49207e-05ZM25.131 22.564V33.5307H35.0754C34.3787 37.9269 30.991 40.5269 25.883 40.5269C18.1069 40.5269 14.0383 33.3612 14.0383 26.2827C14.0383 19.3162 18.1234 11.9122 25.6945 11.9122C25.8056 11.9122 25.9131 11.9211 26.0226 11.9243C26.4224 11.9341 26.8214 11.9669 27.2175 12.0226C27.339 12.0398 27.4561 12.0631 27.5744 12.0845C27.9035 12.1441 28.2294 12.2206 28.5507 12.3136C28.6659 12.3474 28.7836 12.3781 28.8956 12.4157C29.0454 12.4655 29.192 12.522 29.3386 12.5788C29.5143 12.6483 29.6876 12.7205 29.8554 12.799C29.9398 12.8379 30.0252 12.8752 30.1086 12.9167C32.4226 14.0862 33.9256 16.0745 34.7778 17.8113C34.8115 17.879 34.8446 17.9471 34.8771 18.0156C34.9631 18.1994 35.0536 18.4045 35.1249 18.58C35.1313 18.5957 35.1183 18.5644 35.1249 18.58C35.375 19.2048 35.5434 19.7913 35.618 20.2304H50.2643C50.2643 20.2304 50.278 19.7719 50.1 18.7926C49.7741 16.9951 47.6508 9.99537 42.1135 5.41952L42.1018 5.40931L42.0869 5.39591L42.0859 5.39622C37.9739 1.84084 32.6326 -2.49207e-05 26.259 -2.49207e-05C10.5526 -2.49207e-05 -9.03451e-05 10.5369 -9.03451e-05 26.2195C-9.03451e-05 41.3607 10.6176 51.9349 25.8202 51.9349C34.4218 51.9349 41.3374 48.6185 45.8207 42.3425C50.1825 36.1891 50.6397 30.0353 50.7631 23.2057L50.7748 22.564H25.131ZM201.834 13.0517H208.401V50.9218H222.346V1.01311H201.834V13.0517ZM184.96 30.0672C184.235 27.9296 182.106 26.4423 179.637 26.4423C176.843 26.4423 174.797 27.7825 174.026 30.0672H184.96ZM184.783 39.6947H196.018C196.018 39.6947 196.008 40.3434 195.869 41.0205C193.952 49.0678 186.349 51.9349 179.873 51.9349C168.854 51.9349 161.734 45.3341 161.734 35.1182C161.734 24.8662 168.552 18.2418 179.105 18.2418C189.71 18.2418 196.299 24.9591 196.299 35.7717V37.4948H173.684C173.879 41.2024 175.938 43.0809 179.814 43.0809C182.035 43.0809 183.42 42.3333 184.445 40.5811C184.735 40.0521 184.783 39.6947 184.783 39.6947ZM146.146 35.1182C146.146 31.4093 143.546 28.8192 139.824 28.8192C136.101 28.8192 133.501 31.4093 133.501 35.1182C133.501 38.9084 135.983 41.3575 139.824 41.3575C143.664 41.3575 146.146 38.9084 146.146 35.1182ZM145.791 1.01311H157.727V50.9247H145.791V48.533C143.804 50.6866 140.673 51.9349 137.106 51.9349C128.193 51.9349 121.211 44.522 121.211 35.0588C121.211 25.6286 128.141 18.2418 136.988 18.2418C140.378 18.2418 143.562 19.3896 145.791 21.3657V1.01311ZM105.624 35.1182C105.624 31.4093 103.024 28.8192 99.3012 28.8192C95.5791 28.8192 92.9789 31.4093 92.9789 35.1182C92.9789 38.9084 95.4607 41.3575 99.3012 41.3575C103.142 41.3575 105.624 38.9084 105.624 35.1182ZM105.269 19.2521H117.205V50.9247H105.269V48.5327C103.282 50.6866 100.151 51.9349 96.5833 51.9349C87.6707 51.9349 80.6894 44.522 80.6894 35.0588C80.6894 25.6286 87.6193 18.2418 96.4656 18.2418C99.8552 18.2418 103.04 19.3896 105.269 21.3661V19.2521ZM76.0525 19.044H78.7114V31.0513L77.8319 30.5561C76.4549 29.7807 75.1327 29.6214 73.571 29.6214C68.7667 29.6214 66.717 32.1985 66.717 38.238L66.736 50.9218H54.8006L54.7816 19.2521H66.717V23.2468C68.8485 20.4895 72.0411 19.044 76.0525 19.044Z",
    },
  };

export function drawTitle(
  page: PDFPage,
  fonts: Fonts,
  title: string,
  brandName: string,
  y: number,
): number {
  drawText(page, fonts.bold, title, MARGIN, y - TITLE_SIZE, TITLE_SIZE);

  const logo = LOGO_PATHS[brandName];
  if (logo) {
    const logoHeight = TITLE_SIZE * 0.75;
    const scale = logoHeight / logo.height;
    const baseline = y - TITLE_SIZE;
    page.drawSvgPath(logo.d, {
      x: RIGHT_EDGE - logo.width * scale,
      y: baseline + logoHeight,
      scale,
      color: INK,
    });
  } else {
    drawTextRight(
      page,
      fonts.bold,
      brandName,
      RIGHT_EDGE,
      y - TITLE_SIZE,
      TITLE_SIZE,
      INK,
    );
  }
  return y - TITLE_SIZE - LINE_HEIGHT * 2;
}

/** Pinned to the bottom-right corner of the page it is drawn on - the last - independent of how far the sections above ran. */
export function drawIssuer(
  page: PDFPage,
  fonts: Fonts,
  name: string,
  email: string,
): void {
  drawTextRight(
    page,
    fonts.bold,
    name,
    RIGHT_EDGE,
    MARGIN + LINE_HEIGHT,
    BODY_SIZE,
    INK,
  );
  drawTextRight(
    page,
    fonts.regular,
    email,
    RIGHT_EDGE,
    MARGIN,
    BODY_SIZE,
    MUTED,
  );
}
