import type { PDFDocument } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";
import { loadFonts } from "./pdf-document";

/** Embeds each face as the very bytes it was given, so a test can tell them apart. */
function recordingPdf() {
  return {
    registerFontkit: vi.fn(),
    embedFont: vi.fn(async (source: unknown) => source),
  } as unknown as PDFDocument;
}

describe("loadFonts", () => {
  const regular = new ArrayBuffer(1);
  const bold = new ArrayBuffer(2);

  it("draws the bold lines of an embedded-font document in the supplied bold face", async () => {
    const fonts = await loadFonts(recordingPdf(), regular, bold);
    expect(fonts.regular).toBe(regular);
    expect(fonts.bold).toBe(bold);
  });

  it("draws bold lines in the regular face when no bold face is supplied", async () => {
    const fonts = await loadFonts(recordingPdf(), regular);
    expect(fonts.bold).toBe(fonts.regular);
  });
});
