import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import { Badge } from "./badge";

const meta = {
  title: "Design System/Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "success",
        "error",
        "warning",
        "info",
        "brand",
        "outline",
      ],
    },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_caa95307-6520-4e13-a931-1dd3c926f709" },
  },
};
export const Outline: Story = {
  parameters: {
    verification: { caseId: "vc_ddc3cb20-af54-4fbc-8e7e-b12fa4e3d1ae" },
  },
  args: { variant: "outline" },
};
export const Brand: Story = {
  parameters: {
    verification: { caseId: "vc_4a2d30b1-69ab-445c-b60f-36612ee8bdfb" },
  },
  args: { variant: "brand" },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_9010ddc7-a67c-4546-8b9a-62a72e1af991" },
  },
  args: { variant: "success" },
};
// Named `ErrorStatus` rather than `Error` so the export does not shadow the global.
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_87ea6208-8aaa-41a6-9831-37d335df8238" },
  },
  args: { variant: "error" },
};
export const Warning: Story = {
  parameters: {
    verification: { caseId: "vc_656ac9f9-fc1e-44f5-b491-e3d475bccc38" },
  },
  args: { variant: "warning" },
};
export const Info: Story = {
  parameters: {
    verification: { caseId: "vc_52844df0-1f49-4d46-bbd2-c8e770771bf6" },
  },
  args: { variant: "info" },
};

/** The two rungs Figma draws: 24px and 20px tall. */
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_e1119a33-11fd-446b-9578-cf308ff7ad0d" },
  },
  args: { size: "sm" },
};

export const Sizes: Story = {
  parameters: {
    verification: { caseId: "vc_282278e3-396f-48e5-abe3-0968166f915f" },
  },
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
  parameters: {
    verification: { caseId: "vc_9d14d057-5f0a-48d0-8576-26d23fdea00e" },
  },
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
  parameters: {
    verification: { caseId: "vc_ddae5bc3-2837-4cd1-8c14-d4f8a35eb7ff" },
  },
  args: {
    // biome-ignore lint/a11y/useAnchorContent: render prop only supplies the tag; Badge injects the children.
    render: <a href="#badge" />,
  },
};
