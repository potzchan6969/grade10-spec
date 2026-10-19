import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { expect, waitFor } from "storybook/test";
import {
  BANK_TRANSFER_RECEIPT,
  LONG_TABLE_RECEIPT,
  SAMPLE_RECEIPT,
  SEVERAL_ITEMS_RECEIPT,
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
