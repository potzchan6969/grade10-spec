import { describe, expect, it, vi } from "vitest";

vi.mock(
  "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview",
  () => ({
    PdfPreview: () => null,
  }),
);

import {
  FreeShipping,
  Default as InvoiceDefault,
} from "./winner-order.invoice-pdf.stories";
import {
  PartPayment,
  Default as ReceiptDefault,
} from "./winner-order.receipt-pdf.stories";
import {
  BANK_TRANSFER_INVOICE_LINES,
  WINNER_ORDER_CONTENTS,
  WINNER_ORDER_REFUND_CLOSING,
} from "./winner-order-content";

const minorOf = (value: string) =>
  value === "Free" ? 0 : Math.round(Number(value.replace(/[^\d.]/g, "")) * 100);

const money = (minor: number) =>
  `HK$${(minor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

function rowValue(
  lines: readonly { label: string; value: string }[],
  label: string,
) {
  return lines.find((line) => line.label === label)?.value ?? "";
}

/** The Subtotal the USD lines convert into, once, rounded up to the cent. */
function subtotalOf(lines: readonly { label: string; value: string }[]) {
  const usd = lines
    .filter((line) => line.value.startsWith("US$"))
    .reduce((sum, line) => sum + minorOf(line.value), 0);
  return Math.ceil((usd * 785) / 100);
}

describe("the winner order PDF stories", () => {
  // g10.auction-winner-order.SC3
  it("read the invoice fixture: USD lines, then the HKD Subtotal, a Free fee and Order Total", () => {
    const { lineItems, items } = InvoiceDefault.args.data;

    expect(items[0]).toMatchObject({
      winningBid: "US$101.00",
      total: "US$121.20",
    });
    expect(lineItems.map((line) => line.amount)).toEqual([
      "US$10.01",
      "HK$1,030.00",
      "Free",
      "HK$1,030.00",
    ]);
  });

  // g10.auction-winner-order.SC6
  it("add an invoice story with free Shipping & Handling and a Subtotal of HK$951.42", () => {
    const amounts = FreeShipping.args.data.lineItems.map((line) => line.amount);

    expect(amounts).toEqual(["Free", "HK$951.42", "Free", "HK$951.42"]);
  });

  // g10.auction-winner-order.SC4
  it("read the receipt fixture: the same lines and a payment breakdown in HK$", () => {
    const { lineItems, paymentBreakdown } = ReceiptDefault.args.data;

    expect(lineItems.map((line) => line.amount)).toEqual([
      "US$10.01",
      "HK$1,030.00",
      "Free",
      "HK$1,030.00",
    ]);
    expect(paymentBreakdown.originalInvoiceTotal).toBe("HK$1,030.00");
    expect(paymentBreakdown.currentPaymentReceived).toBe("HK$1,030.00");
  });

  // g10.auction-winner-order.SC4
  it("add a part-payment receipt story that leaves HK$730.00 due", () => {
    const { paymentBreakdown } = PartPayment.args.data;

    expect(paymentBreakdown.currentPaymentReceived).toBe("HK$300.00");
    expect(paymentBreakdown.remainingBalanceDue).toBe("HK$730.00");
  });
});

describe("the winner order content", () => {
  // g10.auction-winner-order.SC5
  it("converts the USD lines once into the Subtotal and charges the card fee on it", () => {
    const lines = WINNER_ORDER_CONTENTS.pending_payment.invoiceLines ?? [];
    const subtotal = subtotalOf(lines);
    const fee = Math.ceil((subtotal * 340 + 2_350_000) / 9_660);

    expect(rowValue(lines, "Subtotal")).toBe(money(subtotal));
    expect(rowValue(lines, "Payment Processing Fee")).toBe(money(fee));
    expect(rowValue(lines, "Order Total")).toBe(money(subtotal + fee));
    expect(rowValue(lines, "Order Total")).toBe("HK$132,786.08");
  });

  // g10.auction-winner-order.SC3
  it("keeps a bank transfer total at the Subtotal when the fee is Free", () => {
    const subtotal = subtotalOf(BANK_TRANSFER_INVOICE_LINES);

    expect(rowValue(BANK_TRANSFER_INVOICE_LINES, "Subtotal")).toBe(
      money(subtotal),
    );
    expect(
      rowValue(BANK_TRANSFER_INVOICE_LINES, "Payment Processing Fee"),
    ).toBe("Free");
    expect(rowValue(BANK_TRANSFER_INVOICE_LINES, "Order Total")).toBe(
      money(subtotal),
    );
  });

  it("refunds the card invoice's Order Total", () => {
    expect(WINNER_ORDER_REFUND_CLOSING.amount).toBe("HK$132,786.08");
  });
});
