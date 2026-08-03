import type { Meta, StoryObj } from "@storybook/react-vite";
import { XIcon } from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { children: <XIcon />, "aria-label": "Close" },
  argTypes: {
    variant: { control: "inline-radio", options: ["outline", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "xs"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Ghost: Story = { args: { variant: "ghost" } };

/** `sm` is the design's default rung; Figma draws no 48px icon button. */
export const ExtraSmall: Story = { args: { size: "xs" } };

export const Disabled: Story = { args: { disabled: true } };

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["outline", "ghost"] as const).map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "xs"] as const).map((size) => (
        <IconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** With no visible label, the accessible name has to come from somewhere —
 * either `aria-label` as above, or a visually hidden child. */
export const WithHiddenLabel: Story = {
  args: {
    "aria-label": undefined,
    children: (
      <>
        <XIcon />
        <span className="sr-only">Close</span>
      </>
    ),
  },
};
