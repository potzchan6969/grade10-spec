import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "./link";

const meta = {
  title: "Design System/Forms/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "Link", href: "#link" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "error", "brand"],
    },
    size: { control: "inline-radio", options: ["default", "sm", "xs"] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_76b37fb0-3f8c-4dc4-9ec8-639316a6fd25" },
  },
};
export const Secondary: Story = {
  parameters: {
    verification: { caseId: "vc_dde51081-005f-4616-8ae1-e39abf6d84ac" },
  },
  args: { variant: "secondary" },
};
export const ErrorTone: Story = {
  parameters: {
    verification: { caseId: "vc_28c2f401-e793-4d62-a85d-64e14c16eb6c" },
  },
  args: { variant: "error" },
};
export const Brand: Story = {
  parameters: {
    verification: { caseId: "vc_11fe22ff-7e20-42ec-815a-a91e5dd84c31" },
  },
  args: { variant: "brand" },
};

export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_c038cd60-7124-4913-8ed2-f1c4a156566c" },
  },
  args: { size: "sm" },
};
export const ExtraSmall: Story = {
  parameters: {
    verification: { caseId: "vc_cc6bf153-33f0-430d-a18c-ca056404e88a" },
  },
  args: { size: "xs" },
};

/** Disabled keeps the tone's colour at `Opacity/opacity-50`. `<a>` has no
 * `disabled` attribute, so this renders as `aria-disabled`. */
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_4fa1039b-4257-45b8-bf43-692ab2e28638" },
  },
  args: { disabled: true },
};

export const Sizes: Story = {
  parameters: {
    verification: { caseId: "vc_ebb5103a-272e-41ae-837e-a10e0bd6ed11" },
  },
  render: (args) => (
    <div className="flex items-baseline gap-4">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Link key={size} {...args} size={size}>
          {size}
        </Link>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  parameters: {
    verification: { caseId: "vc_7df7fb7e-05f8-43dd-8052-1c52a3ea509f" },
  },
  render: (args) => (
    <div className="flex items-baseline gap-4">
      {(["default", "secondary", "error", "brand"] as const).map((variant) => (
        <Link key={variant} {...args} variant={variant}>
          {variant}
        </Link>
      ))}
    </div>
  ),
};

/** The trailing icon tracks the type size — 16, 14 and 12px across the rungs. */
export const WithTrailingIcon: Story = {
  parameters: {
    verification: { caseId: "vc_9d3be07d-c939-42d7-ab08-550050d0caf2" },
  },
  args: { trailing: <ExternalLinkIcon /> },
};

/** `render` swaps the tag, so a router link can supply its own navigation. */
export const AsButton: Story = {
  parameters: {
    verification: { caseId: "vc_e3ebae27-4fba-4bd3-844b-ece186f77d76" },
  },
  args: {
    render: <button type="button" />,
    href: undefined,
  },
};
