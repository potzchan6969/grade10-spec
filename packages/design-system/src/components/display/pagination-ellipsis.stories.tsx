import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationEllipsis } from "./pagination-ellipsis";

const meta = {
  title: "Components/PaginationEllipsis",
  component: PaginationEllipsis,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationEllipsis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
