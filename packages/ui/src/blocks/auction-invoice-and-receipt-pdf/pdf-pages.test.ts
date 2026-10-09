import { PDFDocument } from "pdf-lib";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ALL_BANK_RAILS,
  itemTotalOf,
  SAMPLE_INVOICE,
  SAMPLE_RECEIPT,
  sampleItems,
} from "./fixtures";
import type { InvoicePdfData } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import type { PdfItemRow } from "./pdf-document";
import { BODY_BOTTOM, LINE_HEIGHT, MARGIN, RIGHT_EDGE } from "./pdf-document";
import type { DrawnText } from "./pdf-test-helpers";
import {
  drawnContent,
  drawnHorizontalLines,
  drawnPages,
  drawnRectangles,
  drawnRow,
  textRight,
} from "./pdf-test-helpers";
import type { ReceiptPdfData } from "./receipt-pdf";
import { ReceiptPdf } from "./receipt-pdf";

const HEADER = ["Item", "Winning Bid", "Buyer's Premium", "Total"];
const BREAKDOWN = [
  "Original Invoice Total",
  "Previous Payments",
  "Current Payment Received",
  "Remaining Balance Due",
];
const WORDMARK = /254\.177 -0\.0000249207 m/;

const COUNTS = (to: number) => Array.from({ length: to }, (_, i) => i + 1);

const withItems = (items: readonly PdfItemRow[]) => ({
  items,
  itemTotal: itemTotalOf(items),
});

function invoice(count: number, data: Partial<InvoicePdfData> = {}) {
  return InvoicePdf({
    ...SAMPLE_INVOICE,
    ...withItems(sampleItems(count)),
    ...data,
  });
}

function receipt(count: number, data: Partial<ReceiptPdfData> = {}) {
  return ReceiptPdf({
    ...SAMPLE_RECEIPT,
    ...withItems(sampleItems(count)),
    ...data,
  });
}

const DOCUMENTS = [
  ["InvoicePdf", invoice],
  ["ReceiptPdf", receipt],
] as const;

/** The page a string is drawn on first, and where; -1 when no page draws it. */
function pageOf(pages: DrawnText[][], text: string): number {
  return pages.findIndex((page) => page.some((row) => row.text === text));
}

/**
 * Every line and rule a body block draws sits at or above `BODY_BOTTOM` on
 * every page, and no page draws a box; only the issuer block's two lines reach
 * below `BODY_BOTTOM`, on the last page.
 */
async function expectBodyAboveBottom(bytes: ArrayBuffer) {
  const pages = await drawnPages(bytes);
  for (const [index, page] of pages.entries()) {
    const last = index === pages.length - 1;
    for (const row of page) {
      const issuerLine =
        last &&
        (Math.abs(row.y - MARGIN) < 0.01 ||
          Math.abs(row.y - MARGIN - LINE_HEIGHT) < 0.01);
      if (!issuerLine) {
        expect(row.y, `page ${index + 1}: ${row.text}`).toBeGreaterThanOrEqual(
          BODY_BOTTOM,
        );
      }
    }
    for (const rule of await drawnHorizontalLines(bytes, index)) {
      expect(rule.y, `page ${index + 1} rule`).toBeGreaterThanOrEqual(
        BODY_BOTTOM,
      );
    }
    expect(
      await drawnRectangles(bytes, index),
      `page ${index + 1} draws no box`,
    ).toEqual([]);
  }
}

/** A page's text from the top down, left to right along a line. */
function topDown(page: DrawnText[]): DrawnText[] {
  return [...page].sort((a, b) => b.y - a.y || a.x - b.x);
}

const isLot = (row: DrawnText) => /^Lot \d+/.test(row.text);

/** Every divider on every page is stroked in black, and the document has some. */
async function expectBlackDividers(bytes: ArrayBuffer) {
  const pages = (await PDFDocument.load(bytes)).getPageCount();
  let drawn = 0;
  for (let index = 0; index < pages; index++) {
    for (const rule of await drawnHorizontalLines(bytes, index)) {
      drawn += 1;
      expect(rule.color, `page ${index + 1} rule at y ${rule.y}`).toEqual([
        0, 0, 0,
      ]);
    }
  }
  expect(drawn).toBeGreaterThanOrEqual(5);
}

describe.each(DOCUMENTS)("%s's pages", (_name, render) => {
  // shared-ui-invoice-and-receipt-pdf-SC-62
  it("continues a long table on the next page under the repeated column header", async () => {
    const bytes = await render(30);
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBeGreaterThan(1);
    for (const page of pdf.getPages()) {
      expect(page.getSize()).toEqual({ width: 595.28, height: 841.89 });
    }
    const pages = await drawnPages(bytes);
    const second = topDown(pages[1] ?? []);
    expect(second.slice(0, 4).map((row) => row.text)).toEqual(HEADER);
    const headerY = second[0]?.y ?? 0;
    expect(
      (await drawnHorizontalLines(bytes, 1)).some(
        (rule) =>
          rule.y < headerY &&
          rule.y > headerY - LINE_HEIGHT &&
          Math.abs(rule.x1 - MARGIN) < 0.01 &&
          Math.abs(rule.x2 - RIGHT_EDGE) < 0.01,
      ),
    ).toBe(true);
    const lastOnFirst = (pages[0] ?? []).filter(isLot).at(-1);
    expect(second[4]?.text).toBe(
      sampleItems(30)[Number(lastOnFirst?.text.slice(4))]?.title,
    );
    expect(
      pages.flatMap((page) => page.filter(isLot).map((row) => row.text)),
    ).toEqual(sampleItems(30).map((item) => item.title));
  });

  // shared-ui-invoice-and-receipt-pdf-SC-63
  it("never splits an item row across two pages", async () => {
    const wrapped = (count: number) =>
      sampleItems(count).map((item) => ({
        ...item,
        title: `${item.title} 2024 TOPPS CHROME SHOHEI OHTANI SUPERFRACTOR AUTOGRAPHED PATCH CARD SERIAL NUMBERED ONE OF ONE PSA GEM MINT`,
      }));
    let ranOn = false;
    for (const count of COUNTS(20)) {
      const items = wrapped(count);
      const bytes = await render(count, withItems(items));
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      if (pages.length > 1) ranOn = true;
      const seen: string[] = [];
      for (const page of pages) {
        const header = page.find((row) => row.text === "Item");
        if (!header) continue;
        const itemTotal = page.find((row) => row.text === "Item Total");
        const cells = topDown(page).filter(
          (row) =>
            Math.abs(row.x - MARGIN) < 0.01 &&
            row.y < header.y &&
            row.y > (itemTotal?.y ?? 0) &&
            !row.font.includes("Bold"),
        );
        if (cells.length > 0) expect(isLot(cells[0] as DrawnText)).toBe(true);
        const groups: DrawnText[][] = [];
        for (const cell of cells) {
          if (isLot(cell)) groups.push([cell]);
          else groups.at(-1)?.push(cell);
        }
        for (const lines of groups) {
          const title = lines.map((line) => line.text).join(" ");
          const item = items.find((candidate) => candidate.title === title);
          expect(item, title).toBeDefined();
          expect(lines).toHaveLength(3);
          for (const amount of [
            item?.winningBid,
            item?.buyersPremium,
            item?.total,
          ]) {
            expect(
              page.some(
                (row) =>
                  row.text === amount &&
                  Math.abs(row.y - (lines[0]?.y ?? 0)) < 0.01,
              ),
            ).toBe(true);
          }
          seen.push(title);
        }
      }
      expect(seen).toEqual(items.map((item) => item.title));
    }
    expect(ranOn).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-64
  it("moves the Item Total row, the charges, the Tax line and the summary to the next page together", async () => {
    let movedAlone = false;
    for (const count of COUNTS(40)) {
      const bytes = await render(count, {
        taxLine: { label: "Tax", amount: "HKD 12.00" },
      });
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      const page = pageOf(pages, "Item Total");
      for (const text of [
        "Shipping & Handling",
        "Insurance",
        "Tax",
        "Subtotal",
        "Order Total",
      ]) {
        expect(pageOf(pages, text), `${count} items: ${text}`).toBe(page);
      }
      const lastLot = sampleItems(count).at(-1)?.title ?? "";
      if (pageOf(pages, lastLot) === page - 1) {
        const opening = topDown(pages[page] ?? []);
        expect(opening.slice(0, 4).map((row) => row.text)).toEqual(HEADER);
        expect(opening[4]?.text).toBe("Item Total");
        movedAlone = true;
      }
    }
    expect(movedAlone).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-66, shared-ui-invoice-and-receipt-pdf-SC-39,
  // shared-ui-invoice-and-receipt-pdf-SC-40
  it("draws the issuer block on the last page only, where a one-item document draws it", async () => {
    const issuer = {
      issuerName: "Issuer Co",
      issuerEmail: "support@grade10.com",
    };
    const rightOf = await textRight();
    const one = await drawnPages(await render(1, issuer));
    const long = await drawnPages(await render(30, issuer));
    expect(long.length).toBeGreaterThan(1);
    const last = long.at(-1);
    const email = drawnRow(last ?? [], "support@grade10.com");
    const nameAbove = (row: DrawnText, under: DrawnText) =>
      row.text === "Issuer Co" &&
      Math.abs(row.y - under.y - LINE_HEIGHT) < 0.01;
    const name = (last ?? []).find((row) => nameAbove(row, email)) as DrawnText;
    expect(name).toBeDefined();
    expect(email.y).toBeCloseTo(MARGIN);
    expect(name.y - email.y).toBeCloseTo(LINE_HEIGHT);
    expect(rightOf(email)).toBeCloseTo(RIGHT_EDGE);
    expect(rightOf(name)).toBeCloseTo(RIGHT_EDGE);
    const oneEmail = drawnRow(one[0] ?? [], "support@grade10.com");
    expect([email.x, email.y]).toEqual([oneEmail.x, oneEmail.y]);
    const oneName = (one[0] ?? []).find((row) => nameAbove(row, oneEmail));
    expect([name.x, name.y]).toEqual([oneName?.x, oneName?.y]);
    for (const page of long.slice(0, -1)) {
      expect(page.map((row) => row.text)).not.toContain("support@grade10.com");
    }
  });

  // shared-ui-invoice-and-receipt-pdf-SC-77
  it("renders the same data to the same bytes a day later", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-08T00:00:00.000Z"));
    const first = Buffer.from(await render(30));
    vi.setSystemTime(new Date("2026-10-09T00:00:00.000Z"));
    const second = Buffer.from(await render(30));
    expect(second.equals(first)).toBe(true);
  });
});

afterEach(() => {
  vi.useRealTimers();
});

// shared-ui-invoice-and-receipt-pdf-SC-73
describe.each([
  ["InvoicePdf", "IN-LK42301", invoice],
  ["ReceiptPdf", "RC-CN8HK01P1", receipt],
] as const)("%s's continuation pages", (_name, number, render) => {
  const party = {
    recipient: "Chan Tai Man",
    line1: "Flat A, 21/F, One Harbour Square",
    city: "North Point",
    countryCode: "Hong Kong SAR",
  };

  it.each([
    ["Grade10", true],
    ["Issuer Co", false],
  ])(
    "repeat the column header and nothing else of the page head (%s)",
    async (issuerName, wordmark) => {
      const bytes = await render(100, {
        invoiceNumber: number,
        receiptNumber: number,
        billTo: party,
        shipTo: party,
        issuerName,
      });
      const pages = await drawnPages(bytes);
      expect(pages.length).toBeGreaterThanOrEqual(3);
      expect(pages[0]?.map((row) => row.text)).toContain(number);
      for (const index of [1, 2]) {
        const page = pages[index] ?? [];
        const header = drawnRow(page, "Item");
        expect(Math.max(...page.map((row) => row.y))).toBeCloseTo(header.y);
        expect(page.some(isLot)).toBe(true);
        const strings = page.map((row) => row.text);
        expect(strings).not.toContain(number);
        expect(strings).not.toContain("Chan Tai Man");
      }
      for (const page of pages.slice(1)) {
        const header = page.find((row) => row.text === "Item");
        for (const row of page.filter((row) => row.text === "Issuer Co")) {
          expect(row.y).toBeLessThan(header?.y ?? Number.POSITIVE_INFINITY);
        }
      }
      for (const [index] of pages.entries()) {
        expect(WORDMARK.test(await drawnContent(bytes, index))).toBe(
          wordmark && index === 0,
        );
      }
      const items = sampleItems(100);
      const rowsAndHeader = new Set([
        ...HEADER,
        ...items.flatMap((item) => [
          item.title,
          item.winningBid,
          item.buyersPremium,
          item.total,
        ]),
      ]);
      for (const index of [1, 2]) {
        for (const row of pages[index] ?? []) {
          expect(rowsAndHeader.has(row.text), row.text).toBe(true);
        }
      }
    },
  );
});

describe("an invoice's pages", () => {
  // shared-ui-invoice-and-receipt-pdf-SC-74
  it("moves Bank details to the next page whole", async () => {
    let moved = false;
    for (const count of COUNTS(40)) {
      const bytes = await invoice(count, { bankRails: ALL_BANK_RAILS });
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      const page = pageOf(pages, "Bank details");
      for (const text of ["SWIFT", "FPS", "HK local transfer", "LK7P2Q01"]) {
        expect(pageOf(pages, text), `${count} items: ${text}`).toBe(page);
      }
      expect(
        pages[page]?.some((row) => row.text.startsWith("Enter this reference")),
      ).toBe(true);
      if (pageOf(pages, "Order Total") === page - 1) moved = true;
    }
    expect(moved).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-76
  it("keeps the issuer block on the page that ends with the summary", async () => {
    let ranOn = false;
    for (const count of COUNTS(40)) {
      const bytes = await invoice(count);
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      if (pages.length > 1) ranOn = true;
      const page = pageOf(pages, "support@grade10.com");
      expect(pageOf(pages, "Order Total")).toBe(page);
      expectIssuerBandClear(pages[page] ?? []);
    }
    expect(ranOn).toBe(true);
  });
});

describe("a receipt's pages", () => {
  // shared-ui-invoice-and-receipt-pdf-SC-75
  it("moves the Payment section to the next page whole", async () => {
    let moved = false;
    for (const count of COUNTS(40)) {
      const bytes = await receipt(count, { paymentReference: "TRF-7731" });
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      const page = pageOf(pages, "Payment");
      expect(pageOf(pages, "Transfer reference")).toBe(page);
      expect(pageOf(pages, "TRF-7731")).toBe(page);
      if (pageOf(pages, "Order Total") === page - 1) moved = true;
    }
    expect(moved).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-65
  it("moves the four payment breakdown lines to the next page together", async () => {
    let moved = false;
    for (const count of COUNTS(40)) {
      const bytes = await receipt(count);
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      const page = pageOf(pages, BREAKDOWN[0] ?? "");
      const lines = BREAKDOWN.map((text) => drawnRow(pages[page] ?? [], text));
      for (const [index, line] of lines.entries()) {
        if (index > 0) expect(line.y).toBeLessThan(lines[index - 1]?.y ?? 0);
      }
      if (pageOf(pages, "Order Total") === 0 && page === 1) moved = true;
    }
    expect(moved).toBe(true);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-76
  it("keeps the issuer block on the page that ends with the payment breakdown", async () => {
    let ranOn = false;
    for (const count of COUNTS(40)) {
      const bytes = await receipt(count);
      await expectBodyAboveBottom(bytes);
      const pages = await drawnPages(bytes);
      if (pages.length > 1) ranOn = true;
      const page = pageOf(pages, "support@grade10.com");
      for (const text of BREAKDOWN) expect(pageOf(pages, text)).toBe(page);
      expectIssuerBandClear(pages[page] ?? []);
    }
    expect(ranOn).toBe(true);
  });
});

/** Nothing but the issuer block is drawn at or below the issuer's name line. */
function expectIssuerBandClear(page: DrawnText[]) {
  const email = drawnRow(page, "support@grade10.com");
  const name = topDown(page).find(
    (row) => row.y > email.y && Math.abs(row.y - email.y - LINE_HEIGHT) < 0.01,
  ) as DrawnText;
  expect(name).toBeDefined();
  for (const row of page) {
    if (row === email || row === name) continue;
    expect(row.y, row.text).toBeGreaterThan(name.y);
  }
}

describe("every divider", () => {
  it.each([1, 30])("is black on an invoice of %i item(s)", async (count) => {
    await expectBlackDividers(
      await invoice(count, { bankRails: ALL_BANK_RAILS }),
    );
  });

  it.each([1, 30])("is black on a receipt of %i item(s)", async (count) => {
    await expectBlackDividers(
      await receipt(count, { paymentReference: "TRF-7731" }),
    );
  });
});
