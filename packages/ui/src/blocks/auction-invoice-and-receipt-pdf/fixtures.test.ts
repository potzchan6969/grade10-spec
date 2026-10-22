import { describe, expect, it } from "vitest";
import {
  HKD_FREE_SHIPPING_INVOICE,
  HKD_INVOICE,
  HKD_PART_PAYMENT_RECEIPT,
  HKD_RECEIPT,
  itemTotalOf,
  LONG_TABLE_INVOICE,
  LONG_TABLE_RECEIPT,
  SEVERAL_ITEMS_INVOICE,
  SEVERAL_ITEMS_RECEIPT,
  sampleItems,
  USD_INVOICE,
  WIDE_NOTE_INVOICE,
  WIDE_NOTE_RECEIPT,
  WITH_TAX_INVOICE,
  WITH_TAX_RECEIPT,
} from "./fixtures";
import { InvoicePdf } from "./invoice-pdf";
import { drawnPages } from "./pdf-test-helpers";
import { ReceiptPdf } from "./receipt-pdf";

const BARE_AMOUNT = /^\d[\d,]*\.\d{2}$/;

const minorOf = (amount: string) =>
  amount === "Free"
    ? 0
    : Math.round(Number(amount.replace(/[^\d.]/g, "")) * 100);

type Charge = { label: string; amount: string };

/** The fixtures' own rule: the USD lines add up, convert once at 7.85 and round up to the cent. */
function subtotalOf(
  itemTotal: { total: string },
  lineItems: readonly Charge[],
  taxLine?: Charge | null,
) {
  const usd = [
    itemTotal.total,
    ...lineItems
      .filter((line) => /^(Shipping|Insurance)/.test(line.label))
      .map((line) => line.amount),
    ...(taxLine ? [taxLine.amount] : []),
  ].reduce((sum, amount) => sum + minorOf(amount), 0);
  return Math.ceil((usd * 785) / 100);
}

const settled = [
  ["HKD invoice", HKD_INVOICE],
  ["free-shipping HKD invoice", HKD_FREE_SHIPPING_INVOICE],
  ["tax HKD invoice", WITH_TAX_INVOICE],
  ["several-items HKD invoice", SEVERAL_ITEMS_INVOICE],
  ["long-table HKD invoice", LONG_TABLE_INVOICE],
  ["HKD receipt", HKD_RECEIPT],
  ["part-payment HKD receipt", HKD_PART_PAYMENT_RECEIPT],
  ["tax HKD receipt", WITH_TAX_RECEIPT],
  ["several-items HKD receipt", SEVERAL_ITEMS_RECEIPT],
  ["long-table HKD receipt", LONG_TABLE_RECEIPT],
] as const;

describe("the generated item samples", () => {
  it("carry the currency symbol on every item amount, as the charges under the table do", () => {
    expect(sampleItems(3)[0]).toEqual({
      title: "Lot 01",
      winningBid: "US$100.00",
      buyersPremium: "US$20.00",
      total: "US$120.00",
    });
  });

  it("sum each column with the symbol for the Item Total row", () => {
    expect(itemTotalOf(sampleItems(3))).toEqual({
      winningBid: "US$600.00",
      buyersPremium: "US$120.00",
      total: "US$720.00",
    });
  });

  it.each([
    ["several-items invoice", () => InvoicePdf(SEVERAL_ITEMS_INVOICE)],
    ["several-items receipt", () => ReceiptPdf(SEVERAL_ITEMS_RECEIPT)],
    ["long-table invoice", () => InvoicePdf(LONG_TABLE_INVOICE)],
    ["long-table receipt", () => ReceiptPdf(LONG_TABLE_RECEIPT)],
  ])("draws the %s story with no bare amount", async (_name, render) => {
    const drawn = (await drawnPages(await render())).flat();
    expect(drawn.map((row) => row.text)).toContain("US$100.00");
    expect(drawn.filter((row) => BARE_AMOUNT.test(row.text))).toEqual([]);
  });
});

describe("the HKD fixtures", () => {
  it.each(settled)(
    "g10.auction-winner-order.SC3 - %s converts its USD lines once into the Subtotal and adds the fee to reach the Order Total",
    (_name, data) => {
      const charge = (label: string) =>
        data.lineItems.find((line) => line.label === label)?.amount ?? "";
      const subtotal = subtotalOf(data.itemTotal, data.lineItems, data.taxLine);

      expect(data.itemTotal.total).toMatch(/^US\$/);
      expect(charge("Subtotal")).toBe(
        `HK$${(subtotal / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      );
      expect(
        minorOf(charge("Subtotal")) + minorOf(charge("Payment Processing Fee")),
      ).toBe(minorOf(charge("Order Total")));
    },
  );

  it("g10.auction-winner-order.SC3 - the first invoice and receipt read HK$1,030.00 from US$131.21", () => {
    for (const data of [HKD_INVOICE, HKD_RECEIPT]) {
      expect(data.items[0]).toMatchObject({
        winningBid: "US$101.00",
        buyersPremium: "US$20.20",
        total: "US$121.20",
      });
      expect(data.lineItems.map((line) => line.amount)).toEqual([
        "US$10.01",
        "HK$1,030.00",
        "Free",
        "HK$1,030.00",
      ]);
    }
    expect(HKD_RECEIPT.paymentBreakdown.originalInvoiceTotal).toBe(
      "HK$1,030.00",
    );
  });

  it.each(settled)(
    "g10.auction-winner-order.SC16 - %s notes the USD figure and the rate under its Subtotal",
    (_name, data) => {
      const usd = data.lineItems
        .filter((line) => /^(Shipping|Insurance)/.test(line.label))
        .map((line) => minorOf(line.amount))
        .concat(minorOf(data.itemTotal.total))
        .concat(data.taxLine ? [minorOf(data.taxLine.amount)] : [])
        .reduce((sum, minor) => sum + minor, 0);
      const notes = data.lineItems.flatMap((line) =>
        line.note === undefined ? [] : [[line.label, line.note]],
      );
      expect(notes).toEqual([
        [
          "Subtotal",
          `Converted from US$${(usd / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} at 1 USD = 7.85 HKD`,
        ],
      ]);
    },
  );

  it("g10.auction-winner-order.SC16 - the first invoice, receipt and part-payment receipt read the US$131.21 note", () => {
    for (const data of [HKD_INVOICE, HKD_RECEIPT, HKD_PART_PAYMENT_RECEIPT]) {
      expect(data.lineItems.find((line) => line.key === "subtotal")?.note).toBe(
        "Converted from US$131.21 at 1 USD = 7.85 HKD",
      );
    }
  });

  it("g10.auction-winner-order.SC16 - the wide-note fixtures hold a note that wraps", () => {
    for (const data of [WIDE_NOTE_INVOICE, WIDE_NOTE_RECEIPT]) {
      expect(data.lineItems.find((line) => line.key === "subtotal")?.note).toBe(
        "Converted from US$1,234,567,890.12 at 1 USD = 7.85 HKD",
      );
    }
  });

  it("g10.auction-winner-order.SC7 - the USD invoice stays in USD and carries no note", () => {
    expect(USD_INVOICE.lineItems.filter((line) => "note" in line)).toEqual([]);
    expect(USD_INVOICE.lineItems.map((line) => line.amount)).toEqual([
      "US$10.01",
      "US$131.21",
      "Free",
      "US$131.21",
    ]);
  });
});
