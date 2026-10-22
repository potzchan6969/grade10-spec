import type { ReceiptPdfData } from "@grade10/ui";
import { ReceiptPdf } from "@grade10/ui";
import {
  BANK_TRANSFER_RECEIPT,
  HKD_PART_PAYMENT_RECEIPT,
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
  title: "Auction/Post Bidding/Screens/Winner Order/Receipt PDF",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: SAMPLE_RECEIPT },
};

/** A first payment of HK$300.00: the same lines above a breakdown that leaves HK$730.00 due. */
export const PartPayment: Story = {
  args: { data: HKD_PART_PAYMENT_RECEIPT },
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
