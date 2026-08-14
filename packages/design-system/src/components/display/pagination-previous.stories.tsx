import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationPrevious } from "./pagination-previous";

const meta = {
  title: "Components/PaginationPrevious",
  component: PaginationPrevious,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationPrevious>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
