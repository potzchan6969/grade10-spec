import { describe, expect, it } from "vitest";
import type {
  InvoicePdfCopy,
  InvoicePdfProps,
  OrderValueLines,
  OrderValueLinesCopy,
  PartyAddress,
  PaymentBreakdown,
  PaymentBreakdownCopy,
  ReceiptPdfCopy,
  ReceiptPdfProps,
} from "../../index";
import { InvoicePdf, ReceiptPdf } from "../../index";

type PublicInvoiceAndReceiptPdfTypes = [
  InvoicePdfProps,
  InvoicePdfCopy,
  ReceiptPdfProps,
  ReceiptPdfCopy,
  OrderValueLines,
  OrderValueLinesCopy,
  PartyAddress,
  PaymentBreakdown,
  PaymentBreakdownCopy,
];

const publicInvoiceAndReceiptPdfTypes:
  | PublicInvoiceAndReceiptPdfTypes
  | undefined = undefined;
void publicInvoiceAndReceiptPdfTypes;

describe("invoice-and-receipt-pdf public entry", () => {
  it("exports every named invoice-and-receipt-pdf component", () => {
    expect([InvoicePdf, ReceiptPdf]).toEqual([
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
