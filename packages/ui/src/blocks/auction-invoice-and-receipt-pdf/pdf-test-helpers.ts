import {
  decodePDFRawStream,
  PDFArray,
  PDFDocument,
  PDFRawStream,
} from "pdf-lib";

function contentStreams(pdf: Awaited<ReturnType<typeof PDFDocument.load>>) {
  const contents = pdf.getPage(0).node.Contents();
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

/** Read the text operands emitted by the renderer's returned PDF bytes. */
export async function drawnStrings(
  bytes: ArrayBuffer | Uint8Array,
): Promise<string[]> {
  const pdf = await PDFDocument.load(bytes);
  const strings: string[] = [];
  for (const stream of contentStreams(pdf)) {
    if (!(stream instanceof PDFRawStream)) continue;
    const text = Buffer.from(decodePDFRawStream(stream).decode()).toString(
      "latin1",
    );
    for (const [, hex] of text.matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g)) {
      strings.push(Buffer.from(hex ?? "", "hex").toString("latin1"));
    }
  }
  return strings;
}

/** Read text placement and font state from the first-page content operators. */
export async function drawnText(
  bytes: ArrayBuffer | Uint8Array,
): Promise<DrawnText[]> {
  const content = await drawnContent(bytes);
  const rows: DrawnText[] = [];
  let font = "";
  let size = 0;
  let x = 0;
  let y = 0;
  const operations =
    /\/([^\s]+)\s+(-?\d+(?:\.\d+)?)\s+Tf|1\s+0\s+0\s+1\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm|<([0-9A-Fa-f]+)>\s+Tj/g;
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

/** Read rectangles emitted by the renderer, used to prove boxed summaries. */
export async function drawnRectangles(
  bytes: ArrayBuffer | Uint8Array,
): Promise<DrawnRectangle[]> {
  const content = await drawnContent(bytes);
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

/** Read horizontal rules emitted by the renderer's first-page content. */
export async function drawnHorizontalLines(
  bytes: ArrayBuffer | Uint8Array,
): Promise<DrawnHorizontalLine[]> {
  const content = await drawnContent(bytes);
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

/** Return the raw first-page streams when a test needs a font/content proof. */
export async function drawnContent(
  bytes: ArrayBuffer | Uint8Array,
): Promise<string> {
  const pdf = await PDFDocument.load(bytes);
  return contentStreams(pdf)
    .filter((stream): stream is PDFRawStream => stream instanceof PDFRawStream)
    .map((stream) =>
      Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1"),
    )
    .join("\n");
}
