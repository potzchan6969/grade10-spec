import { describe, expect, it } from "vitest";
import {
  itemTotalOf,
  LONG_TABLE_INVOICE,
  LONG_TABLE_RECEIPT,
  SEVERAL_ITEMS_INVOICE,
  SEVERAL_ITEMS_RECEIPT,
  sampleItems,
} from "./fixtures";
import { InvoicePdf } from "./invoice-pdf";
import { drawnPages } from "./pdf-test-helpers";
import { ReceiptPdf } from "./receipt-pdf";

const BARE_AMOUNT = /^\d[\d,]*\.\d{2}$/;

describe("the generated item samples", () => {
  it("carry the currency symbol on every item amount, as the charges under the table do", () => {
    expect(sampleItems(3)[0]).toEqual({
      title: "Lot 01",
      winningBid: "HK$100.00",
      buyersPremium: "HK$20.00",
      total: "HK$120.00",
    });
  });

  it("sum each column with the symbol for the Item Total row", () => {
    expect(itemTotalOf(sampleItems(3))).toEqual({
      winningBid: "HK$600.00",
      buyersPremium: "HK$120.00",
      total: "HK$720.00",
    });
  });

  it.each([
    ["several-items invoice", () => InvoicePdf(SEVERAL_ITEMS_INVOICE)],
    ["several-items receipt", () => ReceiptPdf(SEVERAL_ITEMS_RECEIPT)],
    ["long-table invoice", () => InvoicePdf(LONG_TABLE_INVOICE)],
    ["long-table receipt", () => ReceiptPdf(LONG_TABLE_RECEIPT)],
  ])("draws the %s story with no bare amount", async (_name, render) => {
    const drawn = (await drawnPages(await render())).flat();
    expect(drawn.map((row) => row.text)).toContain("HK$100.00");
    expect(drawn.filter((row) => BARE_AMOUNT.test(row.text))).toEqual([]);
  });
});
