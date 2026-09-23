import { describe, expect, it } from "vitest";
import type {
  InvoicePdfCopy,
  InvoicePdfProps,
  OrderValueLines,
  OrderValueLinesCopy,
} from "../../index";
import { InvoicePdf } from "../../index";

type PublicInvoiceAndReceiptPdfTypes = [
  InvoicePdfProps,
  InvoicePdfCopy,
  OrderValueLines,
  OrderValueLinesCopy,
];

const publicInvoiceAndReceiptPdfTypes:
  | PublicInvoiceAndReceiptPdfTypes
  | undefined = undefined;
void publicInvoiceAndReceiptPdfTypes;

describe("invoice-and-receipt-pdf public entry", () => {
  it("exports every named invoice-and-receipt-pdf component", () => {
    expect([InvoicePdf]).toEqual([expect.any(Function)]);
  });
});
