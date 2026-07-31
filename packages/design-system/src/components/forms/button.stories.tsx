import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
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

/**
 * Leading and trailing icons are children, in reading order. Figma exposes them
 * as component properties and shows both by default; here the caller composes
 * them, and the size rung's `gap` does the spacing.
 */
export const WithIcons: Story = {
  args: {
    children: (
      <>
        <PlusIcon />
        Button
        <ChevronRightIcon />
      </>
    ),
  },
};

/** Icons scale with the rung: 16px at `default`, 14px at `sm`, 12px at `xs`. */
export const WithIconsSmall: Story = {
  args: { size: "sm", children: WithIcons.args?.children },
};
export const WithIconsExtraSmall: Story = {
  args: { size: "xs", children: WithIcons.args?.children },
};
