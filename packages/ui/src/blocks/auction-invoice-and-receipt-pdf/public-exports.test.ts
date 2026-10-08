import { describe, expect, it } from "vitest";
import type {
  InvoicePdfBankRails,
  InvoicePdfCopy,
  InvoicePdfData,
  InvoicePdfLineItem,
  InvoicePdfRenderOptions,
  InvoicePdfReplacement,
  PdfDocumentCopy,
  PdfLineItem,
  PdfPartyAddress,
  ReceiptPaymentBreakdown,
  ReceiptPdfCopy,
  ReceiptPdfData,
  ReceiptPdfLineItem,
  ReceiptPdfRenderOptions,
} from "../../index";
import {
  addressLines,
  InvoicePdf,
  ReceiptPdf,
  receiptBreakdown,
} from "../../index";

type PublicInvoiceAndReceiptPdfTypes = [
  InvoicePdfBankRails,
  InvoicePdfCopy,
  InvoicePdfData,
  InvoicePdfLineItem,
  InvoicePdfReplacement,
  InvoicePdfRenderOptions,
  PdfDocumentCopy,
  PdfLineItem,
  PdfPartyAddress,
  ReceiptPdfCopy,
  ReceiptPdfData,
  ReceiptPdfLineItem,
  ReceiptPaymentBreakdown,
  ReceiptPdfRenderOptions,
];

const publicInvoiceAndReceiptPdfTypes:
  | PublicInvoiceAndReceiptPdfTypes
  | undefined = undefined;
void publicInvoiceAndReceiptPdfTypes;

describe("invoice-and-receipt-pdf public entry", () => {
  it("exports every named invoice-and-receipt-pdf function", () => {
    expect([InvoicePdf, ReceiptPdf, receiptBreakdown, addressLines]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
