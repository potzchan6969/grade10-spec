import { PDFDocument } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";
import { SAMPLE_INVOICE, SAMPLE_RECEIPT } from "./fixtures";
import type { InvoicePdfData } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import type { PdfItemRow } from "./pdf-document";
import { BODY_SIZE, loadFonts, wrap } from "./pdf-document";
import type { DrawnText } from "./pdf-test-helpers";
import { drawnRow, drawnText, textRight } from "./pdf-test-helpers";
import { ReceiptPdf } from "./receipt-pdf";

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

async function standardFonts() {
  return loadFonts(await PDFDocument.create());
}

describe("wrap", () => {
  // shared-ui-invoice-and-receipt-pdf-SC-59
  it("breaks a word wider than the width inside the word", async () => {
    const { regular } = await standardFonts();
    const word = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lines = wrap(word, regular, BODY_SIZE, 60);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join("")).toBe(word);
    for (const line of lines) {
      expect(regular.widthOfTextAtSize(line, BODY_SIZE)).toBeLessThanOrEqual(
        60,
      );
    }
  });

  it("keeps the words around a broken word on their own lines", async () => {
    const { regular } = await standardFonts();
    const lines = wrap(
      "Serial ABCDEFGHIJKLMNOPQRSTUVWXYZ PSA-10",
      regular,
      BODY_SIZE,
      60,
    );
    expect(lines[0]).toBe("Serial");
    expect(lines[lines.length - 1]?.endsWith("PSA-10")).toBe(true);
    expect(
      lines
        .slice(1)
        .join("")
        .replace(/\s*PSA-10$/, ""),
    ).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  });
});

function lot(name: string, amounts = [100, 20, 120]): PdfItemRow {
  const [winningBid, buyersPremium, total] = amounts.map(
    (amount) => `HKD ${amount.toFixed(2)}`,
  );
  return {
    title: `Lot ${name}`,
    winningBid: winningBid ?? "",
    buyersPremium: buyersPremium ?? "",
    total: total ?? "",
  };
}

type TableData = Partial<
  Pick<InvoicePdfData, "items" | "itemTotal" | "lineItems" | "taxLine">
>;

const DOCUMENTS = [
  [
    "InvoicePdf",
    (table: TableData) => InvoicePdf({ ...SAMPLE_INVOICE, ...table }),
  ],
  [
    "ReceiptPdf",
    (table: TableData) => ReceiptPdf({ ...SAMPLE_RECEIPT, ...table }),
  ],
] as const;

describe.each(DOCUMENTS)("%s's item table", (_name, render) => {
  // shared-ui-invoice-and-receipt-pdf-SC-57
  it("draws one row per item in the order given, then the Item Total row", async () => {
    const items = [
      lot("A", [100, 20, 120]),
      lot("B", [200, 40, 240]),
      lot("C", [300, 60, 360]),
    ];
    const rows = await drawnText(
      await render({
        items,
        itemTotal: {
          winningBid: "HKD 600.00",
          buyersPremium: "HKD 120.00",
          total: "HKD 720.00",
        },
      }),
    );
    const titles = items.map((item) => drawnRow(rows, item.title));
    expect(titles[0]?.y).toBeGreaterThan(titles[1]?.y ?? 0);
    expect(titles[1]?.y).toBeGreaterThan(titles[2]?.y ?? 0);
    for (const [index, item] of items.entries()) {
      for (const amount of [item.winningBid, item.buyersPremium, item.total]) {
        expect(
          rows.some(
            (drawn) =>
              drawn.text === amount &&
              Math.abs(drawn.y - (titles[index]?.y ?? 0)) < 0.01,
          ),
          `${item.title} ${amount}`,
        ).toBe(true);
      }
    }
    const itemTotal = drawnRow(rows, "Item Total");
    expect(itemTotal.y).toBeLessThan(titles[2]?.y ?? 0);
    for (const amount of ["HKD 600.00", "HKD 120.00", "HKD 720.00"]) {
      expect(
        rows.some(
          (drawn) =>
            drawn.text === amount && Math.abs(drawn.y - itemTotal.y) < 0.01,
        ),
        amount,
      ).toBe(true);
    }
  });

  // shared-ui-invoice-and-receipt-pdf-SC-61
  it("draws every item and Item Total amount as given, never a sum", async () => {
    const rows = await drawnText(
      await render({
        items: [lot("A", [100, 20, 121]), lot("B", [200, 40, 241])],
        itemTotal: {
          winningBid: "HKD 999.00",
          buyersPremium: "HKD 888.00",
          total: "HKD 777.00",
        },
      }),
    );
    const strings = rows.map((drawn) => drawn.text);
    for (const amount of [
      "HKD 100.00",
      "HKD 20.00",
      "HKD 121.00",
      "HKD 200.00",
      "HKD 40.00",
      "HKD 241.00",
    ]) {
      expect(strings).toContain(amount);
    }
    const itemTotal = drawnRow(rows, "Item Total");
    expect(
      rows
        .filter((drawn) => Math.abs(drawn.y - itemTotal.y) < 0.01)
        .map((drawn) => drawn.text),
    ).toEqual(["Item Total", "HKD 999.00", "HKD 888.00", "HKD 777.00"]);
    for (const sum of ["HKD 300.00", "HKD 60.00", "HKD 362.00"]) {
      expect(strings).not.toContain(sum);
    }
  });

  // shared-ui-invoice-and-receipt-pdf-SC-72
  it("widens a column for a wide amount and draws every amount whole", async () => {
    const wide = {
      title: "Lot A",
      winningBid: "HKD 12,345,678.00",
      buyersPremium: "HKD 2,469,135.60",
      total: "HKD 14,814,813.60",
    };
    const itemTotal = {
      winningBid: "HKD 12,345,778.00",
      buyersPremium: "HKD 2,469,155.60",
      total: "HKD 14,814,933.60",
    };
    const rows = await drawnText(
      await render({ items: [wide, lot("B")], itemTotal }),
    );
    const rightOf = await textRight();
    const tableRows = [
      [wide.title, wide.winningBid, wide.buyersPremium, wide.total],
      ["Lot B", "HKD 100.00", "HKD 20.00", "HKD 120.00"],
      [
        "Item Total",
        itemTotal.winningBid,
        itemTotal.buyersPremium,
        itemTotal.total,
      ],
    ].map((texts) => {
      const title = drawnRow(rows, texts[0] ?? "");
      return texts.map(
        (text) =>
          rows.find(
            (drawn) =>
              drawn.text === text && Math.abs(drawn.y - title.y) < 0.01,
          ) as DrawnText,
      );
    });
    const lotBSize = tableRows[1]?.[1]?.size;
    for (const cells of tableRows) {
      for (const cell of cells) expect(cell).toBeDefined();
      for (const amount of cells.slice(1)) expect(amount.size).toBe(lotBSize);
      for (let index = 1; index < cells.length; index += 1) {
        expect(rightOf(cells[index - 1] as DrawnText)).toBeLessThan(
          cells[index]?.x ?? 0,
        );
      }
    }
    for (const column of [1, 2, 3]) {
      const edges = tableRows.map((cells) =>
        rightOf(cells[column] as DrawnText),
      );
      for (const edge of edges) expect(edge).toBeCloseTo(edges[0] ?? 0);
    }
  });

  // shared-ui-invoice-and-receipt-pdf-SC-69
  it("rejects an empty item list, saying no items were given", async () => {
    await expect(render({ items: [] })).rejects.toThrow(/no items/i);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-70
  it("rejects a title the standard font cannot draw when no font is supplied", async () => {
    await expect(
      render({ items: [{ ...lot("A"), title: "中8號" }] }),
    ).rejects.toThrow(/cannot encode/);
  });

  // shared-ui-invoice-and-receipt-pdf-SC-71
  it.each([
    [
      "the amounts",
      {
        items: [
          {
            title: "Lot A",
            winningBid: `HKD ${"9".repeat(56)}`,
            buyersPremium: `HKD ${"8".repeat(56)}`,
            total: `HKD ${"7".repeat(56)}`,
          },
        ],
      },
      /amounts do not fit/,
    ],
    [
      "the item row",
      { items: [{ ...lot("A"), title: Array(2500).fill("lot").join(" ") }] },
      /item row does not fit/,
    ],
    [
      "the Item Total row with its charges",
      {
        lineItems: [
          ...Array.from({ length: 120 }, (_, index) => ({
            label: `Charge ${index + 1}`,
            amount: "HKD 1.00",
          })),
          ...SAMPLE_INVOICE.lineItems.filter((item) => item.key !== undefined),
        ],
      },
      /Item Total row with its charges does not fit/,
    ],
  ] as const)(
    "rejects a document when %s cannot fit a page",
    async (_what, table, error) => {
      await expect(render(table)).rejects.toThrow(error);
    },
  );
});
