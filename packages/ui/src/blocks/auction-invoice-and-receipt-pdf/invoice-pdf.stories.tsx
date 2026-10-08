import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import {
  BANK_TRANSFER_INVOICE,
  REPLACEMENT_INVOICE,
  SAMPLE_INVOICE,
  WITH_TAX_INVOICE,
} from "./fixtures";
import type { InvoicePdfData } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import { PdfPreview } from "./pdf-preview";

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
  title: "Auction Invoice And Receipt Pdf/InvoicePdf",
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
