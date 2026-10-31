import {
  decodePDFRawStream,
  PDFArray,
  PDFDocument,
  PDFRawStream,
} from "pdf-lib";
import { describe, expect, it } from "vitest";
import type {
  TicketPdfBatch,
  TicketPdfDocument,
  TicketPdfQr,
  TicketPdfTicket,
} from "./ticket-pdf";
import {
  GRADE10_TICKET_PDF_LOGO,
  renderTicketBatchPdf,
  renderTicketPdf,
  TICKET_PAGE_HEIGHT,
  TICKET_PAGE_WIDTH,
} from "./ticket-pdf";

/** A 21-module grid, every other module dark: shape enough to draw. */
const qr: TicketPdfQr = {
  size: 21,
  modules: Array.from({ length: 21 * 21 }, (_, index) => index % 2 === 0),
};

/** The document as the mail drew it before the board: none of the new fields. */
const order = (tickets: number): TicketPdfDocument => ({
  brand: "Grade10",
  eventTitle:
    "Grade10 Card Show 2027, a title long enough to wrap onto a second line",
  when: "13 Mar 2027, 10:00 – 14 Mar 2027, 20:00",
  where: "Hall 3, Convention Centre",
  holderLabel: "Bought by",
  holderName: "Ana Wong",
  referenceLabel: "Order",
  reference: "K7Q2MX",
  footer: "Show this code at the entrance. It admits once a day.",
  tickets: Array.from({ length: tickets }, (_, index) => ({
    passName: "General — Adult (2-day)",
    ordinalLabel: `Ticket ${index + 1} of ${tickets}`,
    entriesLabel: "2 days, once a day",
    fastPassLabel: index === 0 ? "Fast Pass: 2 days" : null,
    qr,
  })),
});

/** The board's document: row labels, the one-code line, codes and the mark. */
const board = (tickets: readonly TicketPdfTicket[]): TicketPdfDocument => ({
  ...order(0),
  logo: GRADE10_TICKET_PDF_LOGO,
  eventTitle: "[Show Name]",
  holderLabel: "Name",
  holderName: "Alex Chan",
  reference: "TK7Q2M",
  rowLabels: { pass: "Pass", entries: "Lets you in", fastPass: "Fast Pass" },
  noFastPassLabel: "None. You can't add it later.",
  codeLine: "One code per ticket. It lets you in on each day your pass covers.",
  footer: "Show this page at the door. A screenshot works too. Order TK7Q2M.",
  tickets,
});

const adult = (over: Partial<TicketPdfTicket> = {}): TicketPdfTicket => ({
  passName: "General Pass (Two-Day), Adult",
  ordinalLabel: "Ticket 1 of 1",
  entriesLabel: "Sat 12 Dec and Sun 13 Dec, once each day",
  fastPassLabel: "2 days",
  fastPassNote: "Join the Fast Pass queue on any day you come in.",
  code: "TK7Q2M-1",
  qr,
  ...over,
});

/** Every page's drawn words, each page one string, glyph runs joined. */
async function pagesOf(bytes: Uint8Array): Promise<string[]> {
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPages().map((page) => {
    const contents = page.node.Contents();
    const streams =
      contents instanceof PDFArray
        ? contents.asArray().map((ref) => pdf.context.lookup(ref))
        : [contents];
    const content = streams
      .map((stream) =>
        stream instanceof PDFRawStream
          ? Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1")
          : "",
      )
      .join("\n");
    return [...content.matchAll(/<([0-9A-Fa-f]*)>\s+Tj/g)]
      .map((match) => Buffer.from(match[1] ?? "", "hex").toString("latin1"))
      .join("");
  });
}

describe("renderTicketPdf", () => {
  it("draws one A4 page per ticket", async () => {
    const pdf = await PDFDocument.load(await renderTicketPdf(order(3)));
    expect(pdf.getPageCount()).toBe(3);
    expect(pdf.getPage(0).getSize()).toEqual({
      width: TICKET_PAGE_WIDTH,
      height: TICKET_PAGE_HEIGHT,
    });
    expect(pdf.getTitle()).toContain("K7Q2MX");
  });

  it("refuses an order with no tickets to draw", async () => {
    await expect(renderTicketPdf(order(0))).rejects.toThrow(
      "at least one ticket",
    );
  });

  it("still draws a document with none of the board's fields", async () => {
    const [page] = await pagesOf(await renderTicketPdf(order(1)));
    expect(page).toContain("Bought by Ana Wong");
    expect(page).toContain("Fast Pass: 2 days");
    expect(page).toContain("K7Q2MX");
    expect(page).toContain("Grade10");
  });

  it("draws the board's rows, the code under the QR and the one-code line", async () => {
    const [page] = await pagesOf(await renderTicketPdf(board([adult()])));
    for (const words of [
      "Pass",
      "General Pass (Two-Day), Adult",
      "Name",
      "Alex Chan",
      "Lets you in",
      "Fast Pass",
      "2 days",
      "Join the Fast Pass queue on any day you come in.",
      "TK7Q2M-1",
      "One code per ticket.",
      "Order TK7Q2M.",
    ]) {
      expect(page).toContain(words);
    }
  });

  it("says a ticket with no Fast Pass has none", async () => {
    const [page] = await pagesOf(
      await renderTicketPdf(
        board([adult({ fastPassLabel: null, fastPassNote: null })]),
      ),
    );
    expect(page).toContain("None. You can't add it later.");
    expect(page).not.toContain("Join the Fast Pass queue");
  });

  it("names the guest of a free ticket and marks it Free", async () => {
    const [page] = await pagesOf(
      await renderTicketPdf({
        ...board([adult({ guestName: "Jamie Wong", freeLabel: "Free" })]),
        holderName: null,
      }),
    );
    expect(page).toContain("Jamie Wong");
    expect(page).toContain("Free");
    expect(page).not.toContain("Alex Chan");
  });

  it("prints no wristband on any page", async () => {
    for (const document of [order(2), board([adult(), adult()])]) {
      const pages = await pagesOf(await renderTicketPdf(document));
      for (const page of pages)
        expect(page.toLowerCase()).not.toContain("wristband");
    }
  });
});

describe("renderTicketBatchPdf", () => {
  const batch = (names: readonly (string | null)[]): TicketPdfBatch => ({
    ...board([]),
    holderName: null,
    reference: "TKF3H8",
    tickets: names.map((guestName, index) => ({
      ...adult(),
      guestName,
      freeLabel: "Free",
      label: "Press day",
      ordinalLabel: `Ticket ${index + 1} of ${names.length}`,
      code: `TKF3H8-${index + 1}`,
    })),
  });

  it("draws a page per ticket, each with its label, guest and code", async () => {
    const bytes = await renderTicketBatchPdf(
      batch(["Jamie Wong", "Sam Lee", null]),
    );
    const pages = await pagesOf(bytes);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toContain("Press day · Ticket 1 of 3");
    expect(pages[0]).toContain("Jamie Wong");
    expect(pages[1]).toContain("Sam Lee");
    expect(pages[2]).toContain("TKF3H8-3");
    expect(pages[2]).not.toContain("Jamie Wong");
    expect(pages[2]).not.toContain("Sam Lee");
  });

  it("refuses a batch with no tickets to draw", async () => {
    await expect(renderTicketBatchPdf(batch([]))).rejects.toThrow(
      "at least one ticket",
    );
  });
});

describe("renderTicketPdf's faces", () => {
  it("reads no face for words the standard one draws", async () => {
    let asked = 0;
    await renderTicketPdf({
      ...order(1),
      faces: [
        async () => {
          asked += 1;
          return { regular: new ArrayBuffer(0) };
        },
      ],
    });
    expect(asked).toBe(0);
  });

  it("reads a face when a word needs one, and says so when none was given", async () => {
    const chinese = { ...order(2), holderName: "陳曉東" };
    await expect(renderTicketPdf(chinese)).rejects.toThrow(
      "need a face beyond the standard one",
    );
    let asked = 0;
    const face = async () => {
      asked += 1;
      return { regular: new ArrayBuffer(0) };
    };
    await renderTicketPdf({ ...chinese, faces: [face, face] }).catch(
      () => undefined,
    );
    expect(asked).toBe(1);
  });

  it("reads a face for a guest's name the standard one cannot draw", async () => {
    let asked = 0;
    await renderTicketPdf({
      ...board([adult({ guestName: "陳曉東" })]),
      faces: [
        async () => {
          asked += 1;
          return { regular: new ArrayBuffer(0) };
        },
      ],
    }).catch(() => undefined);
    expect(asked).toBe(1);
  });
});
