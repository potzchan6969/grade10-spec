import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { expect, waitFor } from "storybook/test";
import {
  BANK_TRANSFER_INVOICE,
  HKD_FREE_SHIPPING_INVOICE,
  LONG_TABLE_INVOICE,
  REPLACEMENT_INVOICE,
  SAMPLE_INVOICE,
  SEVERAL_ITEMS_INVOICE,
  WIDE_NOTE_INVOICE,
  WITH_TAX_INVOICE,
} from "./fixtures";
import type { InvoicePdfData } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import { PdfPreview } from "./pdf-preview";

function InvoicePdfPreview({ data }: { data: InvoicePdfData }) {
  const pdf = useMemo(() => InvoicePdf(data), [data]);
  return <PdfPreview pdf={pdf} />;
}

const meta = {
  title: "Auction/Post Bidding/Blocks/InvoicePdf",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The HKD invoice: the Subtotal note, muted, sits under the HK$ Subtotal. */
export const Default: Story = {
  args: { data: SAMPLE_INVOICE },
};

/** The HKD invoice with free Shipping & Handling: Free beside the US$ lines, Subtotal HK$951.42. */
export const FreeShipping: Story = {
  args: { data: HKD_FREE_SHIPPING_INVOICE },
};

/** A Subtotal note wider than the summary wraps under the Subtotal. */
export const WideSubtotalNote: Story = {
  args: { data: WIDE_NOTE_INVOICE },
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
