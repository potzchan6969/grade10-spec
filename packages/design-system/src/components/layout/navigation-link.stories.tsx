import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationLink } from "./navigation-link";

const meta = {
  title: "Design System/Layout/NavigationLink",
  component: NavigationLink,
  tags: ["autodocs"],
  args: { children: "Nav", href: "#" },
} satisfies Meta<typeof NavigationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_1be641fd-9c67-49d5-a771-c25eb6ff22d6" },
  },
};
export const Active: Story = {
  parameters: {
    verification: { caseId: "vc_78e40d9c-ab7e-4b11-92b5-41e946d94514" },
  },
  args: { active: true },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_b99f964a-7f91-4651-81a4-81afed6fdd5d" },
  },
  args: { disabled: true },
};
