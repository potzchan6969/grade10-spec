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
  parameters: {
    verification: { caseId: "vc_900825d6-5433-438b-a7f6-a3fe5dc52f47" },
  },
  args: { data: SAMPLE_RECEIPT },
};

/** A first payment of HK$300.00: the same lines above a breakdown that leaves HK$730.00 due. */
export const PartPayment: Story = {
  parameters: {
    verification: { caseId: "vc_e89c79da-f132-4d2f-a166-7513fdf0f17b" },
  },
  args: { data: HKD_PART_PAYMENT_RECEIPT },
};

export const BankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_0951a69d-aa4c-4860-aafd-884418a7e056" },
  },
  args: { data: BANK_TRANSFER_RECEIPT },
};

export const WithTax: Story = {
  parameters: {
    verification: { caseId: "vc_4f7eae15-03f4-46b0-a2b8-769bc54f2c81" },
  },
  args: { data: WITH_TAX_RECEIPT },
};

export const SeveralItems: Story = {
  parameters: {
    verification: { caseId: "vc_98cf8b62-6054-4d2d-ae1d-854a028daa84" },
  },
  args: { data: SEVERAL_ITEMS_RECEIPT },
};

export const LongTable: Story = {
  parameters: {
    verification: { caseId: "vc_3640eae1-f2ad-4713-adb1-40bb0ebf7593" },
  },
  args: { data: LONG_TABLE_RECEIPT },
};
