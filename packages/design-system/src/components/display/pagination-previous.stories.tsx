import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationPrevious } from "./pagination-previous";

const meta = {
  title: "Design System/Display/PaginationPrevious",
  component: PaginationPrevious,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationPrevious>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_53c65dd0-62a2-4748-b505-409faeaab1a8" },
  },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_4f1ef8a7-2aba-456d-8569-b65d4c4af200" },
  },
  args: { disabled: true },
};
