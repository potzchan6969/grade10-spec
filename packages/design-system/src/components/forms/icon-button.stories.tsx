import type { Meta, StoryObj } from "@storybook/react-vite";
import { XIcon } from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { children: <XIcon />, "aria-label": "Close" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["outline", "ghost", "secondary", "primary"],
    },
    size: { control: "inline-radio", options: ["md", "sm", "xs"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Ghost: Story = { args: { variant: "ghost" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Primary: Story = { args: { variant: "primary" } };

/** `sm` is the design's default rung. */
export const Medium: Story = { args: { size: "md" } };
export const ExtraSmall: Story = { args: { size: "xs" } };

export const Disabled: Story = { args: { disabled: true } };

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["outline", "ghost", "secondary", "primary"] as const).map(
        (variant) => (
          <IconButton key={variant} {...args} variant={variant} />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["md", "sm", "xs"] as const).map((size) => (
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
