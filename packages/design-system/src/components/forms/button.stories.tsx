import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive"],
    },
    size: { control: "select", options: ["xs", "sm", "default"] },
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
export const ExtraSmall: Story = { args: { size: "xs" } };
export const Disabled: Story = { args: { disabled: true } };
/** `loading` shows a spinner and disables the button. */
export const Loading: Story = { args: { loading: true, children: "Loading" } };
export const DisabledOutline: Story = {
  args: { variant: "outline", disabled: true },
};
