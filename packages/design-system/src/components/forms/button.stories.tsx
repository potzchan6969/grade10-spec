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
export const Medium: Story = { args: { size: "md" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
/** `loading` shows a spinner and disables the button. */
export const Loading: Story = { args: { loading: true, children: "Loading" } };
export const DisabledOutline: Story = {
  args: { variant: "outline", disabled: true },
};

/** `leading` and `trailing` mirror Figma's two icon properties, which show by default. */
export const WithIcons: Story = {
  args: { leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};

/** Icons scale with the rung: 16px at `lg`, 14px at `md`, 12px at `sm`. */
export const WithIconsMedium: Story = {
  args: { size: "md", leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};
export const WithIconsSmall: Story = {
  args: { size: "sm", leading: <PlusIcon />, trailing: <ChevronRightIcon /> },
};

/** `loading` takes the leading slot and suppresses `trailing`, as Figma draws it. */
export const LoadingWithIcons: Story = {
  args: {
    loading: true,
    children: "Loading",
    leading: <PlusIcon />,
    trailing: <ChevronRightIcon />,
  },
};

/** Icons passed as children still work; the slots are additive. */
export const IconsAsChildren: Story = {
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
