import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationNext } from "./pagination-next";

const meta = {
  title: "Design System/Display/PaginationNext",
  component: PaginationNext,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationNext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_eb264232-63e0-4483-a56d-afefd66b622e" },
  },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_68270b03-bdd9-4930-8a8e-daacf19402a5" },
  },
  args: { disabled: true },
};
