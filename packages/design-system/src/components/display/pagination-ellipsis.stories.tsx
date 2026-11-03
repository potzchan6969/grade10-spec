import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationEllipsis } from "./pagination-ellipsis";

const meta = {
  title: "Design System/Display/PaginationEllipsis",
  component: PaginationEllipsis,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationEllipsis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_9274d7bf-1bce-48c8-b1e3-78bc91493162" },
  },
};
