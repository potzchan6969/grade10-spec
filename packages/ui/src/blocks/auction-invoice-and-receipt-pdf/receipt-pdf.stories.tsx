import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
  BANK_TRANSFER_RECEIPT,
  SAMPLE_RECEIPT,
  WITH_TAX_RECEIPT,
} from "./fixtures";
import { PdfPreview } from "./pdf-preview";
import type { ReceiptPdfData } from "./receipt-pdf";
import { ReceiptPdf } from "./receipt-pdf";

function ReceiptPdfPreview({ data }: { data: ReceiptPdfData }) {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBytes(null);
    void ReceiptPdf(data).then((rendered) => {
      if (!cancelled) setBytes(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!bytes) return <p>Generating...</p>;
  return <PdfPreview bytes={bytes} />;
}

const meta = {
  title: "Auction Invoice And Receipt Pdf/ReceiptPdf",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: SAMPLE_RECEIPT },
};

export const BankTransfer: Story = {
  args: { data: BANK_TRANSFER_RECEIPT },
};

export const WithTax: Story = {
  args: { data: WITH_TAX_RECEIPT },
};
