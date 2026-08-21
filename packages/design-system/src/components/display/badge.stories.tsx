import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "error", "warning", "brand", "outline"],
    },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Brand: Story = { args: { variant: "brand" } };
export const Success: Story = { args: { variant: "success" } };
// Named `ErrorStatus` rather than `Error` so the export does not shadow the global.
export const ErrorStatus: Story = { args: { variant: "error" } };
export const Warning: Story = { args: { variant: "warning" } };

/** The two rungs Figma draws: 24px and 20px tall. */
export const Small: Story = { args: { size: "sm" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["default", "sm"] as const).map((size) => (
        <Badge key={size} {...args} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  ),
};

/** Every status variant carries a leading icon in Figma. */
export const WithIcon: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <CheckIcon />
        Verified
      </>
    ),
  },
};

/** `render` swaps the tag — hover styles are scoped to anchors. */
export const AsLink: Story = {
  args: {
    // biome-ignore lint/a11y/useAnchorContent: render prop only supplies the tag; Badge injects the children.
    render: <a href="#badge" />,
  },
};
