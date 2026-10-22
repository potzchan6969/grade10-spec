import type { InvoicePdfData } from "@grade10/ui";
import { InvoicePdf } from "@grade10/ui";
import {
  BANK_TRANSFER_INVOICE,
  HKD_FREE_SHIPPING_INVOICE,
  LONG_TABLE_INVOICE,
  REPLACEMENT_INVOICE,
  SAMPLE_INVOICE,
  SEVERAL_ITEMS_INVOICE,
  WITH_TAX_INVOICE,
} from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/fixtures";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";

function InvoicePdfPreview({ data }: { data: InvoicePdfData }) {
  const pdf = useMemo(() => InvoicePdf(data), [data]);
  return <PdfPreview pdf={pdf} />;
}

const meta = {
  title: "Auction/Post Bidding/Screens/Winner Order/Invoice PDF",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: SAMPLE_INVOICE },
};

/** Free Shipping & Handling beside the US$ lines; the Subtotal still shows. */
export const FreeShipping: Story = {
  args: { data: HKD_FREE_SHIPPING_INVOICE },
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

export const SeveralItems: Story = {
  args: { data: SEVERAL_ITEMS_INVOICE },
};

export const LongTable: Story = {
  args: { data: LONG_TABLE_INVOICE },
};
