import type { InvoicePdfData } from "@grade10/ui";
import { InvoicePdf } from "@grade10/ui";
import {
  BANK_TRANSFER_INVOICE,
  REPLACEMENT_INVOICE,
  SAMPLE_INVOICE,
  WITH_TAX_INVOICE,
} from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/fixtures";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

function InvoicePdfPreview({ data }: { data: InvoicePdfData }) {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBytes(null);
    void InvoicePdf(data).then((rendered) => {
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
  title: "My Auctions/Winner Order/PDF/Invoice",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: SAMPLE_INVOICE },
};

export const BankTransfer: Story = {
  args: { data: BANK_TRANSFER_INVOICE },
};

export const Replacement: Story = {
  args: { data: REPLACEMENT_INVOICE },
};

export const WithTax: Story = {
  args: { data: WITH_TAX_INVOICE },
};
