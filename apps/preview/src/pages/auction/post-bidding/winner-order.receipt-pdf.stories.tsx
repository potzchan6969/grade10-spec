import type { ReceiptPdfData } from "@grade10/ui";
import { ReceiptPdf } from "@grade10/ui";
import {
  BANK_TRANSFER_RECEIPT,
  LONG_TABLE_RECEIPT,
  SAMPLE_RECEIPT,
  SEVERAL_ITEMS_RECEIPT,
  WITH_TAX_RECEIPT,
} from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/fixtures";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";

function ReceiptPdfPreview({ data }: { data: ReceiptPdfData }) {
  const pdf = useMemo(() => ReceiptPdf(data), [data]);
  return <PdfPreview pdf={pdf} />;
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

export const SeveralItems: Story = {
  args: { data: SEVERAL_ITEMS_RECEIPT },
};

export const LongTable: Story = {
  args: { data: LONG_TABLE_RECEIPT },
};
