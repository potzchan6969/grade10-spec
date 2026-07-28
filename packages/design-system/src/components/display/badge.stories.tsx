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
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };

/** `data-icon` tightens the padding on the side the icon sits. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckIcon data-icon="inline-start" />
        Verified
      </>
    ),
  },
};

/** `render` swaps the tag — hover styles are scoped to anchors. */
export const AsLink: Story = {
  args: {
    variant: "secondary",
    // biome-ignore lint/a11y/useAnchorContent: render prop only supplies the tag; Badge injects the children.
    render: <a href="#badge" />,
  },
};
