import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationLink } from "./pagination-link";

const meta = {
  title: "Design System/Display/PaginationLink",
  component: PaginationLink,
  tags: ["autodocs"],
  args: { children: "1" },
} satisfies Meta<typeof PaginationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_87adb749-9d02-4639-8a4f-b94bd94344f1" },
  },
};
export const Active: Story = {
  parameters: {
    verification: { caseId: "vc_77499eea-2dee-4cd5-bc9e-77c48a51af55" },
  },
  args: { isActive: true },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_2f1d41c8-fcb8-4436-bd36-dbaef8f6e6ca" },
  },
  args: { disabled: true },
};
