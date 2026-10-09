import {
  decodePDFRawStream,
  PDFArray,
  PDFDocument,
  PDFRawStream,
  StandardFonts,
} from "pdf-lib";
import { expect } from "vitest";

function contentStreams(
  pdf: Awaited<ReturnType<typeof PDFDocument.load>>,
  page: number,
) {
  const contents = pdf.getPage(page).node.Contents();
  return contents instanceof PDFArray
    ? contents.asArray().map((ref) => pdf.context.lookup(ref))
    : [contents];
}

export type DrawnText = {
  text: string;
  x: number;
  y: number;
  font: string;
  size: number;
};

export type DrawnRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DrawnHorizontalLine = {
  x1: number;
  x2: number;
  y: number;
};

/** Read the text operands emitted on one page of the renderer's returned PDF bytes. */
export async function drawnStrings(
  bytes: ArrayBuffer | Uint8Array,
  page = 0,
): Promise<string[]> {
  return (await drawnText(bytes, page)).map((row) => row.text);
}

/** Read text placement and font state from one page's content operators. */
export async function drawnText(
  bytes: ArrayBuffer | Uint8Array,
  page = 0,
): Promise<DrawnText[]> {
  return textOf(await drawnContent(bytes, page));
}

/** Every page's drawn text, in page order. */
export async function drawnPages(
  bytes: ArrayBuffer | Uint8Array,
): Promise<DrawnText[][]> {
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPages().map((_, page) => textOf(contentOf(pdf, page)));
}

function textOf(content: string): DrawnText[] {
  const rows: DrawnText[] = [];
  let font = "";
  let size = 0;
  let x = 0;
  let y = 0;
  const operations =
    /\/([^\s]+)\s+(-?\d+(?:\.\d+)?)\s+Tf|1\s+0\s+0\s+1\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm|<([0-9A-Fa-f]*)>\s+Tj/g;
  for (const match of content.matchAll(operations)) {
    if (match[1]) {
      font = match[1];
      size = Number(match[2]);
      continue;
    }
    if (match[3]) {
      x = Number(match[3]);
      y = Number(match[4]);
      continue;
    }
    rows.push({
      text: Buffer.from(match[5] ?? "", "hex").toString("latin1"),
      x,
      y,
      font,
      size,
    });
  }
  return rows;
}

/** Read rectangles emitted by the renderer, used to prove none is drawn. */
export async function drawnRectangles(
  bytes: ArrayBuffer | Uint8Array,
  page = 0,
): Promise<DrawnRectangle[]> {
  const content = await drawnContent(bytes, page);
  const directRectangles = [
    ...content.matchAll(
      /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+re/g,
    ),
  ].map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
    width: Number(match[3]),
    height: Number(match[4]),
  }));
  const pathRectangles = [
    ...content.matchAll(
      /1\s+0\s+0\s+1\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+cm(?:\s+1\s+0\s+0\s+1\s+0\s+0\s+cm)*\s+0\s+0\s+m\s+0\s+(-?\d+(?:\.\d+)?)\s+l\s+(-?\d+(?:\.\d+)?)\s+\3\s+l\s+\4\s+0\s+l\s+h\s+S/g,
    ),
  ].map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
    width: Number(match[4]),
    height: Number(match[3]),
  }));
  return [...directRectangles, ...pathRectangles];
}

/** Read horizontal rules emitted on one page. */
export async function drawnHorizontalLines(
  bytes: ArrayBuffer | Uint8Array,
  page = 0,
): Promise<DrawnHorizontalLine[]> {
  const content = await drawnContent(bytes, page);
  return [
    ...content.matchAll(
      /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+m\s+(?:\1\s+\2\s+m\s+)?(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+l\s+S/g,
    ),
  ]
    .filter((match) => Number(match[2]) === Number(match[4]))
    .map((match) => ({
      x1: Number(match[1]),
      x2: Number(match[3]),
      y: Number(match[2]),
    }));
}

/** Return one page's raw streams when a test needs a font/content proof. */
export async function drawnContent(
  bytes: ArrayBuffer | Uint8Array,
  page = 0,
): Promise<string> {
  return contentOf(await PDFDocument.load(bytes), page);
}

function contentOf(
  pdf: Awaited<ReturnType<typeof PDFDocument.load>>,
  page: number,
): string {
  return contentStreams(pdf, page)
    .filter((stream): stream is PDFRawStream => stream instanceof PDFRawStream)
    .map((stream) =>
      Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1"),
    )
    .join("\n");
}

/** Where a drawn string ends, measured in the standard face it was drawn in. */
export async function textRight(): Promise<(row: DrawnText) => number> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  return (row) =>
    row.x +
    (row.font.includes("Bold") ? bold : regular).widthOfTextAtSize(
      row.text,
      row.size,
    );
}

/** The first row drawing exactly `text`, failing the test when none does. */
export function drawnRow(rows: readonly DrawnText[], text: string): DrawnText {
  const row = rows.find((candidate) => candidate.text === text);
  expect(row, `expected rendered text ${text}`).toBeDefined();
  return row as DrawnText;
}
