import type { ReceiptPdfData } from "@grade10/ui";
import { ReceiptPdf } from "@grade10/ui";
import {
  BANK_TRANSFER_RECEIPT,
  SAMPLE_RECEIPT,
  WITH_TAX_RECEIPT,
} from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/fixtures";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

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
  title: "My Auctions/Winner Order/PDF/Receipt",
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
