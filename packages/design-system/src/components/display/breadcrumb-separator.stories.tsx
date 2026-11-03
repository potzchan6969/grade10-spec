import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

const meta = {
  title: "Design System/Display/BreadcrumbSeparator",
  component: BreadcrumbSeparator,
  tags: ["autodocs"],
} satisfies Meta<typeof BreadcrumbSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_ce83db65-102b-4224-a61f-8caf4b2bbd02" },
  },
};
export const CustomGlyph: Story = {
  parameters: {
    verification: { caseId: "vc_c4972a44-1a78-4f96-9024-bd44e5d3624a" },
  },
  args: { children: ">" },
};
