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
  parameters: {
    verification: { caseId: "vc_af54adb7-9af2-4f6c-8705-de5425cadf4c" },
  },
  args: { data: SAMPLE_INVOICE },
};

/** Free Shipping & Handling beside the US$ lines; the Subtotal still shows. */
export const FreeShipping: Story = {
  parameters: {
    verification: { caseId: "vc_c8dc62a2-a7cb-4ecd-8c7b-7852bebf08e7" },
  },
  args: { data: HKD_FREE_SHIPPING_INVOICE },
};

export const BankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_a3882544-3f89-41ad-ac26-242afeb0c526" },
  },
  args: { data: BANK_TRANSFER_INVOICE },
};

export const Replacement: Story = {
  parameters: {
    verification: { caseId: "vc_c228708b-eec6-45e0-92cc-d475f8890a99" },
  },
  args: { data: REPLACEMENT_INVOICE },
};

export const WithTax: Story = {
  parameters: {
    verification: { caseId: "vc_c7148316-d1ea-46f0-ac25-110f44b276ca" },
  },
  args: { data: WITH_TAX_INVOICE },
};

export const SeveralItems: Story = {
  parameters: {
    verification: { caseId: "vc_95a47ef4-5cf2-42f2-8365-018c1bc01dc8" },
  },
  args: { data: SEVERAL_ITEMS_INVOICE },
};

export const LongTable: Story = {
  parameters: {
    verification: { caseId: "vc_b82b9126-d6e6-49a0-8b71-cedf825fac49" },
  },
  args: { data: LONG_TABLE_INVOICE },
};
