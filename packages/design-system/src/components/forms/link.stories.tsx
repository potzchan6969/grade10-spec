import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "./link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "Link", href: "#link" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "error"],
    },
    size: { control: "inline-radio", options: ["default", "sm", "xs"] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const ErrorTone: Story = { args: { variant: "error" } };

export const Small: Story = { args: { size: "sm" } };
export const ExtraSmall: Story = { args: { size: "xs" } };

/** Every tone collapses to the same disabled colour in Figma. `<a>` has no
 * `disabled` attribute, so this renders as `aria-disabled`. */
export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
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
  render: (args) => (
    <div className="flex items-baseline gap-4">
      {(["default", "secondary", "error"] as const).map((variant) => (
        <Link key={variant} {...args} variant={variant}>
          {variant}
        </Link>
      ))}
    </div>
  ),
};

/** The trailing icon tracks the type size — 16, 14 and 12px across the rungs. */
export const WithTrailingIcon: Story = {
  args: { trailing: <ExternalLinkIcon /> },
};

/** `render` swaps the tag, so a router link can supply its own navigation. */
export const AsButton: Story = {
  args: {
    render: <button type="button" />,
    href: undefined,
  },
};
