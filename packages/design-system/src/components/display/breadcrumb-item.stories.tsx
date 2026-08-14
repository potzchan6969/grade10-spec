import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbItem } from "./breadcrumb-item";

const meta = {
  title: "Components/BreadcrumbItem",
  component: BreadcrumbItem,
  tags: ["autodocs"],
  args: { children: "Link", href: "#link" },
} satisfies Meta<typeof BreadcrumbItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Current: Story = {
  args: { current: true, children: "Current Page", href: undefined },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledCurrent: Story = {
  args: { current: true, disabled: true, children: "Current Page" },
};
