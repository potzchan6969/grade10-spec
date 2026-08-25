import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

const meta = {
  title: "Components/BreadcrumbSeparator",
  component: BreadcrumbSeparator,
  tags: ["autodocs"],
} satisfies Meta<typeof BreadcrumbSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomGlyph: Story = {
  args: { children: ">" },
};
