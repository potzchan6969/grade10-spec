import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationLink } from "./pagination-link";

const meta = {
  title: "Components/PaginationLink",
  component: PaginationLink,
  tags: ["autodocs"],
  args: { children: "1" },
} satisfies Meta<typeof PaginationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { isActive: true } };
export const Disabled: Story = { args: { disabled: true } };
