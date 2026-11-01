import fontkit from "@pdf-lib/fontkit";
import type { Color, PDFFont, PDFPage } from "pdf-lib";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * One order's tickets as one PDF, an A4 page per ticket, each page whole on
 * its own so a buyer screenshots one ticket and sends it to the friend it is
 * for. Pure: the caller supplies every word, already in the buyer's language,
 * and each ticket's QR code as a grid, so this package neither encodes a code
 * nor holds a sentence. No wristband is printed: the code is the ticket.
 */

/** A QR code's modules, row-major, `true` where dark; quiet zone excluded. */
export type TicketPdfQr = {
  readonly size: number;
  readonly modules: readonly boolean[];
};

export type TicketPdfTicket = {
  /** The pass, as the buyer bought it: "General Pass (Two-Day), Adult". */
  passName: string;
  /** Where this ticket sits in the order: "Ticket 1 of 3". */
  ordinalLabel: string;
  /** What it admits: "Sat 12 Dec and Sun 13 Dec, once each day". */
  entriesLabel: string;
  /** Its Fast Pass days, "2 days", or null where it carries none. */
  fastPassLabel: string | null;
  /** How the door uses its Fast Pass days, under them; only with days. */
  fastPassNote?: string | null;
  /** The guest a free or shared ticket is for; drawn in place of the buyer. */
  guestName?: string | null;
  /** The Free mark beside the pass, on a ticket given at no charge. */
  freeLabel?: string | null;
  /** The code read out under the QR, "TK7Q2M-1"; the reference where absent. */
  code?: string | null;
  qr: TicketPdfQr;
};

/** A brand's mark as one SVG path in its own box, drawn in the header. */
export type TicketPdfLogo = {
  readonly width: number;
  readonly height: number;
  readonly path: string;
};

/** The labels of the rows under the title, beside the holder's. */
export type TicketPdfRowLabels = {
  pass: string;
  entries: string;
  fastPass: string;
};

export type TicketPdfDocument = {
  brand: string;
  /** The brand's mark, drawn in place of its name where given. */
  logo?: TicketPdfLogo | null;
  eventTitle: string;
  /** The event's dates, formatted. */
  when: string;
  where: string | null;
  holderLabel: string;
  holderName: string | null;
  referenceLabel: string;
  reference: string;
  /**
   * The labels of the pass, entries and Fast Pass rows. Where given the
   * page draws them as a table beside their values; where absent each value
   * is a line of its own and the holder's reads "{holderLabel} {name}".
   */
  rowLabels?: TicketPdfRowLabels | null;
  /** The Fast Pass row's value on a ticket with none, drawn muted. */
  noFastPassLabel?: string | null;
  /** The line above the footer: one code per ticket, and what it admits. */
  codeLine?: string | null;
  /** The line under every ticket: show this code at the entrance. */
  footer: string;
  tickets: readonly TicketPdfTicket[];
  /**
   * The faces drawn where the standard one has no glyph, in the order they
   * are tried: the reader's own script first, so a character both scripts
   * share takes the reader's form. Each is read only when a character the
   * faces before it lack is in the words.
   */
  faces?: readonly (() => Promise<TicketPdfFace>)[];
};

/** A ticket in a batch: the batch's label rides on each page. */
export type TicketPdfBatchTicket = TicketPdfTicket & { label: string };

/** A batch of free tickets, a page each, for the console to hand out. */
export type TicketPdfBatch = Omit<TicketPdfDocument, "tickets"> & {
  tickets: readonly TicketPdfBatchTicket[];
};

/** One embeddable face: its regular weight, and its bold where it has one. */
export type TicketPdfFace = {
  regular: ArrayBuffer;
  bold?: ArrayBuffer | null;
};

export { GRADE10_TICKET_PDF_LOGO } from "./ticket-pdf-logo";

/** An A4 page, in points. */
export const TICKET_PAGE_WIDTH = 595.28;
export const TICKET_PAGE_HEIGHT = 841.89;
const SIDE = 48;
const TOP = 44;
const BOTTOM = 36;
const CONTENT = TICKET_PAGE_WIDTH - 2 * SIDE;
const LABEL_COLUMN = 120;
const LABEL_GAP = 16;
const QR_MAX = 360;
const QR_MIN = 180;

/** The theme's tokens, as the PDF cannot read them: `--foreground` (gray-900). */
const INK = rgb(0x1b / 255, 0x19 / 255, 0x18 / 255);
/** `--secondary-foreground` (gray-500). */
const MUTED = rgb(0x75 / 255, 0x72 / 255, 0x6f / 255);
/** `--border` (gray-200): `--border-subtle` is too faint on paper. */
const RULE = rgb(0xe6 / 255, 0xe5 / 255, 0xe5 / 255);
/** `--primary` (orange-400), the Fast Pass mark. */
const PRIMARY = rgb(0xc4 / 255, 0x90 / 255, 0x3d / 255);
/** `--info` (blue-500), the Free mark, as the site's Free badge. */
const INFO = rgb(0x29 / 255, 0x8d / 255, 0xcc / 255);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0, 0, 0);
/** The lightning bolt the site draws beside Fast Pass, on a 24 grid. */
const BOLT = "M13 2 3 14h9l-1 8 10-12h-9l1-8z";

type Weight = "regular" | "bold" | "mono";

/** A face as drawn: the weights some run uses, and the characters it has. */
type Drawn = {
  regular?: PDFFont;
  bold?: PDFFont;
  mono?: PDFFont;
  has: ReadonlySet<number>;
};

/**
 * The faces a document draws in, tried in order for each character: the
 * standard one, then each embedded face that has a character the ones before
 * it lack. A weight is embedded only where a run is drawn in it, since
 * fontkit cannot write a subset with no glyph in it. An embedded face draws
 * the mono runs in its bold.
 */
type Fonts = readonly Drawn[];

async function fontsFor(
  pdf: PDFDocument,
  document: TicketPdfDocument,
): Promise<Fonts> {
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const fonts: Drawn[] = [
    {
      regular,
      bold: await pdf.embedFont(StandardFonts.HelveticaBold),
      mono: await pdf.embedFont(StandardFonts.CourierBold),
      has: new Set(regular.getCharacterSet()),
    },
  ];
  const words = wordsOf(document);
  const lacking = () =>
    new Set(
      words.flatMap(([text]) => [...text].filter((c) => !hasChar(fonts, c))),
    );
  if (lacking().size === 0) return fonts;
  if (!document.faces) {
    throw new Error(
      "a ticket PDF's words need a face beyond the standard one, and none was given",
    );
  }
  const faces: { bytes: TicketPdfFace; drawn: Drawn }[] = [];
  for (const read of document.faces) {
    const missing = lacking();
    if (missing.size === 0) break;
    const bytes = await read();
    const has = new Set(
      fontkit.create(new Uint8Array(bytes.regular)).characterSet,
    );
    if (![...missing].some((char) => has.has(char.codePointAt(0) ?? 0))) {
      continue;
    }
    const drawn: Drawn = { has };
    fonts.push(drawn);
    faces.push({ bytes, drawn });
  }
  pdf.registerFontkit(fontkit);
  for (const { bytes, drawn } of faces) {
    for (const weight of ["regular", "bold"] as const) {
      const used = words.some(
        ([text, drawnIn]) =>
          embeddedWeight(drawnIn) === weight &&
          [...text].some((char) => faceFor(fonts, char) === drawn),
      );
      if (!used) continue;
      const face = weight === "bold" && bytes.bold ? bytes.bold : bytes.regular;
      drawn[weight] = await pdf.embedFont(face, { subset: true });
    }
  }
  return fonts;
}

const embeddedWeight = (weight: Weight): "regular" | "bold" =>
  weight === "regular" ? "regular" : "bold";

/** Every line the document draws, with the weight it is drawn in. */
function wordsOf(document: TicketPdfDocument): [string, Weight][] {
  const labels = document.rowLabels;
  return [
    [document.logo ? "" : document.brand, "bold"],
    [document.eventTitle, "bold"],
    [document.when, "regular"],
    [document.where ?? "", "regular"],
    [`${document.holderLabel} ${document.holderName ?? ""}`, "regular"],
    [`${document.referenceLabel} ${document.reference}`, "mono"],
    [
      labels ? `${labels.pass}${labels.entries}${labels.fastPass}` : "",
      "regular",
    ],
    [document.noFastPassLabel ?? "", "regular"],
    [document.codeLine ?? "", "regular"],
    [document.footer, "regular"],
    ...document.tickets.flatMap((ticket): [string, Weight][] => [
      [ticket.passName, "bold"],
      [ticket.ordinalLabel, "regular"],
      [(ticket as Partial<TicketPdfBatchTicket>).label ?? "", "regular"],
      [ticket.entriesLabel, "regular"],
      [ticket.fastPassLabel ?? "", labels ? "regular" : "bold"],
      [ticket.fastPassNote ?? "", "regular"],
      [ticket.guestName ?? "", "regular"],
      [ticket.freeLabel ?? "", "bold"],
      [ticket.code ?? "", "mono"],
    ]),
  ];
}

const isSpace = (char: string) => /\s/.test(char);

function hasChar(fonts: Fonts, char: string): boolean {
  if (isSpace(char)) return true;
  const point = char.codePointAt(0) ?? 0;
  return fonts.some((font) => font.has.has(point));
}

function faceFor(fonts: Fonts, char: string): Drawn {
  const point = char.codePointAt(0) ?? 0;
  if (isSpace(char)) return fonts[0] as Drawn;
  return fonts.find((font) => font.has.has(point)) ?? (fonts.at(-1) as Drawn);
}

/** A line cut into runs, each drawn whole in one face. */
function runsOf(
  text: string,
  fonts: Fonts,
  weight: Weight,
): { text: string; font: PDFFont }[] {
  const runs: { text: string; font: PDFFont }[] = [];
  for (const char of text) {
    const face = faceFor(fonts, char);
    const font =
      face[weight] ??
      (weight === "mono" ? face.bold : undefined) ??
      face.regular ??
      face.bold;
    if (!font) throw new Error(`no face embedded to draw ${char}`);
    const last = runs.at(-1);
    if (last && last.font === font) last.text += char;
    else runs.push({ text: char, font });
  }
  return runs;
}

function widthOf(
  text: string,
  fonts: Fonts,
  weight: Weight,
  size: number,
): number {
  return runsOf(text, fonts, weight).reduce(
    (sum, run) => sum + run.font.widthOfTextAtSize(run.text, size),
    0,
  );
}

/**
 * The places a line may break: at a space, and between characters of a
 * script written without spaces (Chinese, Japanese, Korean), so a long title
 * in one wraps rather than running off the page.
 */
const BREAKABLE = /(\s+|[⺀-鿿가-힯豈-﫿＀-￯])/u;

/** Words broken onto lines no wider than `width`, a word too long kept whole. */
export function wrapText(
  text: string,
  fonts: Fonts,
  weight: Weight,
  size: number,
  width: number,
): string[] {
  const words = text.split(BREAKABLE).filter((word) => word.length > 0);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line + word;
    if (line && widthOf(next.trimEnd(), fonts, weight, size) > width) {
      lines.push(line.trimEnd());
      line = word.trimStart();
    } else {
      line = next;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

type Style = {
  fonts: Fonts;
  weight: Weight;
  size: number;
  color: Color;
  /** Extra space after each character, in points. */
  tracking?: number;
};

/** One line from its left baseline; returns its width. */
function drawRuns(
  page: PDFPage,
  text: string,
  at: { x: number; y: number },
  style: Style,
): number {
  let x = at.x;
  const tracking = style.tracking ?? 0;
  for (const run of runsOf(text, style.fonts, style.weight)) {
    const pieces = tracking ? [...run.text] : [run.text];
    for (const piece of pieces) {
      page.drawText(piece, {
        x,
        y: at.y,
        size: style.size,
        font: run.font,
        color: style.color,
      });
      x += run.font.widthOfTextAtSize(piece, style.size) + tracking;
    }
  }
  return x - at.x - tracking;
}

/**
 * Wrapped lines from a top edge downwards, each `leading` tall with its
 * baseline set as CSS sets it; returns the bottom edge.
 */
function drawBlock(
  page: PDFPage,
  text: string,
  box: { x: number; top: number; width: number },
  style: Style & { leading: number },
): number {
  let top = box.top;
  for (const line of wrapText(
    text,
    style.fonts,
    style.weight,
    style.size,
    box.width,
  )) {
    const baseline = top - (style.leading + style.size * 0.7) / 2;
    drawRuns(page, line, { x: box.x, y: baseline }, style);
    top -= style.leading;
  }
  return top;
}

function heightOf(
  text: string,
  fonts: Fonts,
  weight: Weight,
  size: number,
  leading: number,
  width: number,
): number {
  return wrapText(text, fonts, weight, size, width).length * leading;
}

function rule(page: PDFPage, y: number): void {
  page.drawLine({
    start: { x: SIDE, y },
    end: { x: TICKET_PAGE_WIDTH - SIDE, y },
    thickness: 0.75,
    color: RULE,
  });
}

/** How far each run reaches into the row below, so no viewer draws a seam. */
const SEAM = 0.3;

/** The dark modules as horizontal runs, so a page draws a few hundred boxes. */
function drawQr(
  page: PDFPage,
  qr: TicketPdfQr,
  box: { left: number; top: number; side: number },
): void {
  const unit = box.side / (qr.size + 4);
  page.drawRectangle({
    x: box.left,
    y: box.top - box.side,
    width: box.side,
    height: box.side,
    color: WHITE,
  });
  for (let row = 0; row < qr.size; row += 1) {
    let column = 0;
    while (column < qr.size) {
      if (!qr.modules[row * qr.size + column]) {
        column += 1;
        continue;
      }
      const start = column;
      while (column < qr.size && qr.modules[row * qr.size + column]) {
        column += 1;
      }
      page.drawRectangle({
        x: box.left + (start + 2) * unit,
        y: box.top - (row + 3) * unit - SEAM,
        width: (column - start) * unit,
        height: unit + SEAM,
        color: BLACK,
      });
    }
  }
}

/** A pill around a short word, as the site's Badge draws it. */
function drawMark(
  page: PDFPage,
  text: string,
  at: { x: number; top: number },
  fonts: Fonts,
): void {
  const size = 11;
  const height = 20;
  const width = widthOf(text, fonts, "bold", size) + 16;
  const r = height / 2;
  page.drawSvgPath(
    `M${r} 0H${width - r}A${r} ${r} 0 0 1 ${width - r} ${height}H${r}A${r} ${r} 0 0 1 ${r} 0Z`,
    { x: at.x, y: at.top, color: INFO },
  );
  drawRuns(
    page,
    text,
    { x: at.x + 8, y: at.top - height / 2 - size * 0.35 },
    { fonts, weight: "bold", size, color: WHITE },
  );
}

type Row = {
  label: string | null;
  value: string;
  weight: Weight;
  color: Color;
  /** The Fast Pass bolt before the value. */
  bolt?: boolean;
  note?: string | null;
  mark?: string | null;
};

function rowsOf(document: TicketPdfDocument, ticket: TicketPdfTicket): Row[] {
  const labels = document.rowLabels ?? null;
  const name = ticket.guestName ?? document.holderName;
  const rows: Row[] = [
    {
      label: labels?.pass ?? null,
      value: ticket.passName,
      weight: "bold",
      color: INK,
      mark: ticket.freeLabel,
    },
  ];
  if (name) {
    rows.push(
      labels
        ? {
            label: document.holderLabel,
            value: name,
            weight: "regular",
            color: INK,
          }
        : {
            label: null,
            value: `${document.holderLabel} ${name}`,
            weight: "regular",
            color: INK,
          },
    );
  }
  rows.push({
    label: labels?.entries ?? null,
    value: ticket.entriesLabel,
    weight: "regular",
    color: INK,
  });
  if (ticket.fastPassLabel) {
    rows.push({
      label: labels?.fastPass ?? null,
      value: ticket.fastPassLabel,
      weight: labels ? "regular" : "bold",
      color: INK,
      bolt: true,
      note: ticket.fastPassNote,
    });
  } else if (labels && document.noFastPassLabel) {
    rows.push({
      label: labels.fastPass,
      value: document.noFastPassLabel,
      weight: "regular",
      color: MUTED,
    });
  }
  return rows;
}

const ROW = { size: 14, leading: 20, gap: 8 };
const NOTE = { size: 13, leading: 18 };
const BOLT_SIDE = 16;

/** The table of rows from a top edge; returns its bottom edge. */
function drawRows(
  page: PDFPage,
  rows: readonly Row[],
  top: number,
  fonts: Fonts,
): number {
  const tabled = rows.some((row) => row.label !== null);
  const valueX = tabled ? SIDE + LABEL_COLUMN + LABEL_GAP : SIDE;
  const valueWidth = TICKET_PAGE_WIDTH - SIDE - valueX;
  let y = top;
  rows.forEach((row, index) => {
    if (index > 0) y -= ROW.gap;
    if (row.label) {
      drawBlock(
        page,
        row.label,
        { x: SIDE, top: y, width: LABEL_COLUMN },
        { fonts, weight: "regular", color: MUTED, ...ROW },
      );
    }
    const indent = row.bolt ? BOLT_SIDE + 5 : 0;
    if (row.bolt) {
      page.drawSvgPath(BOLT, {
        x: valueX,
        y: y - (ROW.leading - BOLT_SIDE) / 2,
        scale: BOLT_SIDE / 24,
        borderColor: PRIMARY,
        borderWidth: 2,
        borderLineCap: 1,
      });
    }
    const markWidth = row.mark ? widthOf(row.mark, fonts, "bold", 11) + 24 : 0;
    const lines = wrapText(
      row.value,
      fonts,
      row.weight,
      ROW.size,
      valueWidth - indent - markWidth,
    );
    let bottom = y;
    for (const line of lines) {
      bottom = drawBlock(
        page,
        line,
        { x: valueX + indent, top: bottom, width: Number.POSITIVE_INFINITY },
        { fonts, weight: row.weight, color: row.color, ...ROW },
      );
    }
    if (row.mark) {
      const first = lines[0] ?? "";
      drawMark(
        page,
        row.mark,
        {
          x: valueX + indent + widthOf(first, fonts, row.weight, ROW.size) + 8,
          top: y - (ROW.leading - 20) / 2,
        },
        fonts,
      );
    }
    if (row.note) {
      bottom = drawBlock(
        page,
        row.note,
        { x: valueX, top: bottom - 2, width: valueWidth },
        { fonts, weight: "regular", color: MUTED, ...NOTE },
      );
    }
    y = bottom;
  });
  return y;
}

function drawTicket(
  pdf: PDFDocument,
  document: TicketPdfDocument,
  ticket: TicketPdfTicket & { label?: string },
  fonts: Fonts,
): void {
  const page = pdf.addPage([TICKET_PAGE_WIDTH, TICKET_PAGE_HEIGHT]);
  const top = TICKET_PAGE_HEIGHT - TOP;

  // Header: the brand's mark or name, and where this ticket sits.
  if (document.logo) {
    const scale = 20 / document.logo.height;
    page.drawSvgPath(document.logo.path, {
      x: SIDE,
      y: top,
      scale,
      color: INK,
    });
  } else {
    drawBlock(
      page,
      document.brand,
      { x: SIDE, top, width: CONTENT / 2 },
      { fonts, weight: "bold", size: 15, leading: 20, color: INK },
    );
  }
  const corner = ticket.label
    ? `${ticket.label} · ${ticket.ordinalLabel}`
    : ticket.ordinalLabel;
  const cornerWidth = widthOf(corner, fonts, "regular", 12);
  drawRuns(
    page,
    corner,
    { x: TICKET_PAGE_WIDTH - SIDE - cornerWidth, y: top - 14 },
    { fonts, weight: "regular", size: 12, color: MUTED },
  );

  // The event.
  let y = top - 20 - 28;
  y = drawBlock(
    page,
    document.eventTitle,
    { x: SIDE, top: y, width: CONTENT },
    { fonts, weight: "bold", size: 28, leading: 34, color: INK },
  );
  y -= 4;
  y = drawBlock(
    page,
    document.when,
    { x: SIDE, top: y, width: CONTENT },
    { fonts, weight: "regular", size: 14, leading: 20, color: MUTED },
  );
  if (document.where) {
    y = drawBlock(
      page,
      document.where,
      { x: SIDE, top: y, width: CONTENT },
      { fonts, weight: "regular", size: 14, leading: 20, color: MUTED },
    );
  }

  // The ticket's rows, between two rules.
  y -= 20;
  rule(page, y);
  y = drawRows(page, rowsOf(document, ticket), y - 14, fonts) - 14;
  rule(page, y);

  // The footer, from the bottom edge up.
  const footStyle = { size: 13, leading: 18 };
  const footLines = [
    ...(document.codeLine ? [{ text: document.codeLine, color: INK }] : []),
    { text: document.footer, color: MUTED },
  ];
  const footHeight = footLines.reduce(
    (sum, line) =>
      sum +
      heightOf(
        line.text,
        fonts,
        "regular",
        footStyle.size,
        footStyle.leading,
        CONTENT,
      ) +
      4,
    -4,
  );
  const footTop = BOTTOM + footHeight + 14;
  rule(page, footTop);
  let footY = footTop - 14;
  for (const line of footLines) {
    footY =
      drawBlock(
        page,
        line.text,
        { x: SIDE, top: footY, width: CONTENT },
        { fonts, weight: "regular", color: line.color, ...footStyle },
      ) - 4;
  }

  // The code, large and centred in what is left, and read out under it.
  const said = ticket.code ?? document.reference;
  const saidSize = 34;
  const saidLeading = 40;
  const gap = 14;
  const room = y - footTop - 2 * 16;
  const side = Math.max(QR_MIN, Math.min(QR_MAX, room - gap - saidLeading));
  const block = side + gap + saidLeading;
  const qrTop = footTop + 16 + (room - block) / 2 + block;
  drawQr(page, ticket.qr, {
    left: (TICKET_PAGE_WIDTH - side) / 2,
    top: qrTop,
    side,
  });
  const tracking = saidSize * 0.08;
  const saidWidth =
    [...said].reduce(
      (sum, char) => sum + widthOf(char, fonts, "mono", saidSize) + tracking,
      0,
    ) - tracking;
  drawRuns(
    page,
    said,
    {
      x: (TICKET_PAGE_WIDTH - saidWidth) / 2,
      y: qrTop - side - gap - (saidLeading + saidSize * 0.7) / 2,
    },
    { fonts, weight: "mono", size: saidSize, color: INK, tracking },
  );
}

async function render(
  document: TicketPdfDocument,
  tickets: readonly (TicketPdfTicket & { label?: string })[],
): Promise<Uint8Array> {
  if (tickets.length === 0) {
    throw new Error("a ticket PDF needs at least one ticket");
  }
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${document.eventTitle} — ${document.reference}`);
  const fonts = await fontsFor(pdf, document);
  for (const ticket of tickets) {
    drawTicket(pdf, document, ticket, fonts);
  }
  return pdf.save();
}

/** The order's tickets, a page each, as PDF bytes. */
export async function renderTicketPdf(
  document: TicketPdfDocument,
): Promise<Uint8Array> {
  return render(document, document.tickets);
}

/**
 * A batch of free tickets, a page each with the batch's label in its corner,
 * as one PDF for the console: the caller leaves cancelled tickets out.
 */
export async function renderTicketBatchPdf(
  batch: TicketPdfBatch,
): Promise<Uint8Array> {
  return render(batch, batch.tickets);
}
