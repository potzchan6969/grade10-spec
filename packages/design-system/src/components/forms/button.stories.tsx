import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  // One entry per Figma `Type`, minus Loading, which is the `loading` prop
  // rather than a variant. Sizes are the three rungs of "Buttons Size
  // Reference" (96:546).
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
/** Mirrors Figma `Type=Loading`, which shares the disabled fill and adds a spinner. */
export const Loading: Story = { args: { loading: true, children: "Loading" } };
export const DisabledOutline: Story = {
  args: { variant: "outline", disabled: true },
};
