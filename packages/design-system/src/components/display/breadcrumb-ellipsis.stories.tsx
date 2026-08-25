import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbEllipsis } from "./breadcrumb-ellipsis";

const meta = {
  title: "Components/BreadcrumbEllipsis",
  component: BreadcrumbEllipsis,
  tags: ["autodocs"],
} satisfies Meta<typeof BreadcrumbEllipsis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
