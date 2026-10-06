import type { PDFDocument } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";
import { formatDateTime, loadFonts } from "./pdf-document";

describe("formatDateTime", () => {
  // shared-ui-invoice-and-receipt-pdf-SC-43, shared-ui-invoice-and-receipt-pdf-SC-54
  it("renders fixed to Hong Kong time as GMT+8, regardless of the machine's own zone", () => {
    // 2026-09-24T04:30:00.000Z is 2026-09-24T12:30:00 in Asia/Hong_Kong (UTC+8).
    const value = new Date("2026-09-24T04:30:00.000Z");
    expect(formatDateTime(value)).toBe("September 24, 2026, 12:30 GMT+8");
    expect(formatDateTime(value)).not.toContain("HKT");
  });
});

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
