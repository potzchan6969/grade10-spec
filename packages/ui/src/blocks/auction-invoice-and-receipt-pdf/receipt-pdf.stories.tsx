import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { expect, waitFor } from "storybook/test";
import {
  BANK_TRANSFER_RECEIPT,
  HKD_PART_PAYMENT_RECEIPT,
  LONG_TABLE_RECEIPT,
  SAMPLE_RECEIPT,
  SEVERAL_ITEMS_RECEIPT,
  WIDE_NOTE_RECEIPT,
  WITH_TAX_RECEIPT,
} from "./fixtures";
import { PdfPreview } from "./pdf-preview";
import type { ReceiptPdfData } from "./receipt-pdf";
import { ReceiptPdf } from "./receipt-pdf";

function ReceiptPdfPreview({ data }: { data: ReceiptPdfData }) {
  const pdf = useMemo(() => ReceiptPdf(data), [data]);
  return <PdfPreview pdf={pdf} />;
}

const meta = {
  title: "Auction/Post Bidding/Blocks/ReceiptPdf",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The HKD receipt: the Subtotal note, muted, sits under the HK$ Subtotal. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_fc3ddbc5-2fe0-457e-b92b-9cbb54f953e4" },
  },
  args: { data: SAMPLE_RECEIPT },
};

/** A Subtotal note wider than the summary wraps under the Subtotal. */
export const WideSubtotalNote: Story = {
  parameters: {
    verification: { caseId: "vc_09b7ceeb-72ed-4bbd-9236-fdf449c16aa4" },
  },
  args: { data: WIDE_NOTE_RECEIPT },
};

/** A first payment of HK$300.00: the same lines above a breakdown that leaves HK$730.00 due. */
export const PartPayment: Story = {
  parameters: {
    verification: { caseId: "vc_36f26abf-ca32-45fe-bb64-c1af39c3bdaa" },
  },
  args: { data: HKD_PART_PAYMENT_RECEIPT },
};

export const BankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_d667dbdd-3714-42bd-ab06-00c945a08296" },
  },
  args: { data: BANK_TRANSFER_RECEIPT },
};

export const WithTax: Story = {
  parameters: {
    verification: { caseId: "vc_2c4713f6-9742-45d9-a736-9ef3d626a0e9" },
  },
  args: { data: WITH_TAX_RECEIPT },
};

export const SeveralItems: Story = {
  parameters: {
    verification: { caseId: "vc_0a18d886-960c-4115-a180-29f91a936d1a" },
  },
  args: { data: SEVERAL_ITEMS_RECEIPT },
};

export const LongTable: Story = {
  parameters: {
    verification: { caseId: "vc_fb4eb0b2-d6f2-493c-8cf4-1c590ff74a12" },
  },
  args: { data: LONG_TABLE_RECEIPT },
  play: async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(
          canvasElement.querySelectorAll('[data-slot="pdf-preview-canvas"]')
            .length,
        ).toBeGreaterThanOrEqual(2),
      { timeout: 15_000 },
    );
  },
};
