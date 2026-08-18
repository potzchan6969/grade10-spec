import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationLink } from "./navigation-link";

const meta = {
  title: "Components/NavigationLink",
  component: NavigationLink,
  tags: ["autodocs"],
  args: { children: "Nav", href: "#" },
} satisfies Meta<typeof NavigationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const Disabled: Story = { args: { disabled: true } };
