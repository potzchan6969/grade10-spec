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
  parameters: {
    verification: { caseId: "vc_1de432c2-2a29-4880-8307-03a90b263250" },
  },
  args: { data: SAMPLE_INVOICE },
};

/** The HKD invoice with free Shipping & Handling: Free beside the US$ lines, Subtotal HK$951.42. */
export const FreeShipping: Story = {
  parameters: {
    verification: { caseId: "vc_37e6360f-2323-42e7-af17-eb40999898b0" },
  },
  args: { data: HKD_FREE_SHIPPING_INVOICE },
};

/** A Subtotal note wider than the summary wraps under the Subtotal. */
export const WideSubtotalNote: Story = {
  args: { data: WIDE_NOTE_INVOICE },
};

export const BankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_20d05f06-d40e-4886-ba06-c4113c92a485" },
  },
  args: { data: BANK_TRANSFER_INVOICE },
};

export const Replacement: Story = {
  parameters: {
    verification: { caseId: "vc_42b687cb-5b99-4aa2-ba85-ebd9c091f48c" },
  },
  args: { data: REPLACEMENT_INVOICE },
};

export const WithTax: Story = {
  parameters: {
    verification: { caseId: "vc_bcf3bbbd-901f-4020-a0e7-049bdd5fed62" },
  },
  args: { data: WITH_TAX_INVOICE },
};

export const SeveralItems: Story = {
  parameters: {
    verification: { caseId: "vc_37abda90-6d10-4ad7-ab5c-0314e8b687d0" },
  },
  args: { data: SEVERAL_ITEMS_INVOICE },
};

export const LongTable: Story = {
  parameters: {
    verification: { caseId: "vc_acd14d49-4847-4d33-bfb8-cb7feee42e86" },
  },
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
