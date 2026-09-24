import fontkit from "@pdf-lib/fontkit";
import type { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import { rgb, StandardFonts } from "pdf-lib";

/**
 * The A4 layout and drawing primitives shared by every document this
 * capability renders with pdf-lib - `ReceiptPdf` and `InvoicePdf` are the
 * two documents; this is the one sheet they are both drawn on. Not
 * published as its own subpath: a caller wants a document, never a bare
 * `drawText`.
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
export const RULE = rgb(0.82, 0.82, 0.82);
export const RULE_STRONG = rgb(0.1, 0.1, 0.1);

/** Where a money row's amount right-aligns to. */
export const RIGHT_EDGE = A4_WIDTH - MARGIN;
/** Where an identity row's value right-aligns to - narrower than the full sheet. */
export const META_VALUE_RIGHT = MARGIN + 250;
/** A boxed summary: right-aligned, narrower than the sheet. */
export const SUMMARY_WIDTH = 220;
export const SUMMARY_LEFT = RIGHT_EDGE - SUMMARY_WIDTH;

/** Same shape as the `AddressSnapshot` jsonb column, without importing the schema that types it. */
export type PdfPartyAddress = Record<string, string | null> | null;

/** `amount` arrives pre-formatted - a caller's own money-formatting module is the only place minor units become text. */
export type PdfLineItem = {
  /** Recognized regardless of `label`'s text, so a translated label still
   * routes into the boxed summary. Absent on an ordinary charge. */
  key?: "subtotal" | "paymentProcessingFee" | "orderTotal";
  label: string;
  amount: string;
};

/** Every label `pdf-document.ts` itself draws, supplied by the caller so no text is hardcoded in this package. */
export type PdfDocumentCopy = {
  billToHeading: string;
  shipToHeading: string;
  descriptionLabel: string;
  amountLabel: string;
};

/**
 * The regular face every line falls back to, and a bold face for titles,
 * headings and totals. The Latin path gets a real bold standard font for
 * free; a storefront whose document needs the embedded CJK fallback has no
 * bold face provisioned for it, so `bold` is the same face as `regular`
 * there - plain weight throughout rather than a missing glyph.
 */
export type Fonts = { regular: PDFFont; bold: PDFFont };

export async function loadFonts(
  pdf: PDFDocument,
  fontBytes?: ArrayBuffer | null,
): Promise<Fonts> {
  if (fontBytes) {
    pdf.registerFontkit(fontkit);
    const font = await pdf.embedFont(fontBytes, { subset: true });
    return { regular: font, bold: font };
  }
  return {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
}

/** Every document is issued from Hong Kong, whichever storefront it names. */
const DOCUMENT_TIME_ZONE = "Asia/Hong_Kong";

/**
 * `HKT`, not `GMT+8` - `Intl` only resolves the named abbreviation under a
 * Hong Kong locale; the US locale used for the date and time parts falls
 * back to the offset instead.
 */
function timeZoneAbbreviation(value: Date, timeZone: string): string {
  return (
    new Intl.DateTimeFormat("en-HK", { timeZone, timeZoneName: "short" })
      .formatToParts(value)
      .find((part) => part.type === "timeZoneName")?.value ?? timeZone
  );
}

/** `September 24, 2026, 12:30 HKT`. */
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
  }).format(value);
  return `${date}, ${time} ${timeZoneAbbreviation(value, DOCUMENT_TIME_ZONE)}`;
}

export function addressLines(address: PdfPartyAddress): string[] {
  if (!address) return ["Not recorded"];
  return [
    address.recipient,
    address.company,
    address.line1,
    address.line2,
    [address.city, address.region, address.postalCode]
      .filter((part): part is string => Boolean(part))
      .join(", "),
    address.countryCode,
  ].filter((line): line is string => Boolean(line));
}

export function wrap(
  text: string,
  font: PDFFont,
  size: number,
  width: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
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
    color?: ReturnType<typeof rgb>;
    thickness?: number;
  } = {},
): number {
  const { gap = 5, color = RULE, thickness = 0.6 } = options;
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
  return y - gap;
}

/** An identity row - label bold and black, value right-aligned. */
export function drawMetaRow(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  y: number,
): void {
  drawText(page, fonts.bold, label, MARGIN, y, BODY_SIZE, INK);
  drawTextRight(
    page,
    fonts.regular,
    value,
    META_VALUE_RIGHT,
    y,
    BODY_SIZE,
    INK,
  );
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
 * The three lines every order value ends in - never a charge of their own,
 * always the arithmetic over the charges above them. Pulled out of the flat
 * charge list into their own boxed, right-aligned summary, Order Total
 * bold and set off by a rule the way a receipt's payment breakdown is.
 * Grouped by `PdfLineItem.key`, not `label` text - a translated label must
 * still route into the summary.
 */
const ORDER_TOTAL_SIZE = 13;

/** The lot heading, a Description/Amount table of charges, and the order-value summary beneath. */
export function drawLineItems(
  page: PDFPage,
  fonts: Fonts,
  listingTitle: string,
  lineItems: readonly PdfLineItem[],
  copy: Pick<PdfDocumentCopy, "descriptionLabel" | "amountLabel">,
  y: number,
): number {
  const charges = lineItems.filter((item) => item.key === undefined);
  const summary = lineItems.filter((item) => item.key !== undefined);

  drawText(page, fonts.bold, listingTitle, MARGIN, y, BODY_SIZE, INK);
  y -= LINE_HEIGHT * 1.4;

  drawText(page, fonts.bold, copy.descriptionLabel, MARGIN, y, SMALL_SIZE, INK);
  drawTextRight(
    page,
    fonts.bold,
    copy.amountLabel,
    RIGHT_EDGE,
    y,
    SMALL_SIZE,
    INK,
  );
  y = drawRuleSpan(page, MARGIN, RIGHT_EDGE, y - 4, {
    color: RULE_STRONG,
    thickness: 0.8,
    gap: LINE_HEIGHT - 4,
  });

  for (const item of charges) {
    drawMoneyRow(page, fonts, item.label, item.amount, MARGIN, y);
    y -= LINE_HEIGHT;
  }
  if (summary.length === 0) return y;

  y -= LINE_HEIGHT * 0.6;
  for (const item of summary) {
    const amount = item.amount;
    if (item.key !== "orderTotal") {
      drawMoneyRow(page, fonts, item.label, amount, SUMMARY_LEFT, y);
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
      amount,
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

/** Pinned to the bottom-right corner, independent of how far the sections above ran. */
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
