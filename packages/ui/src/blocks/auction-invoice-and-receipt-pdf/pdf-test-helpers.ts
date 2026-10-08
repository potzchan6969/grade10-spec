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
