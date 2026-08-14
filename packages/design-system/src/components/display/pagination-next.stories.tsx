import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationNext } from "./pagination-next";

const meta = {
  title: "Components/PaginationNext",
  component: PaginationNext,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationNext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
