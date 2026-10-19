import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import { expect, within } from "storybook/test";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarInitial,
} from "./avatar";

const SRC = "https://github.com/shadcn.png";

const meta = {
  title: "Design System/Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { size: "lg" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={SRC} alt="@shadcn" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The fallback renders while the image loads, or if it never does. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  ),
};

/** One character — a caller holding an email passes the part before the `@`. */
export const FromEmail: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>{avatarInitial("user")}</AvatarFallback>
    </Avatar>
  ),
};

const INITIALS: readonly (readonly [string, string])[] = [
  ["陳大文", "陳"],
  ["Ångström", "Å"],
  ["@kitlam", "K"],
  ["ßeta", "ß"],
  ["🃏🃏", "?"],
  ["", "?"],
];

/** The first letter or digit in any script, read from the whole value. */
export const InitialsInAnyScript: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {INITIALS.map(([label]) => (
        <Avatar key={label} aria-label={label || "empty"}>
          <AvatarFallback>{avatarInitial(label)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [label, initial] of INITIALS) {
      await expect(canvas.getByLabelText(label || "empty")).toHaveTextContent(
        initial,
      );
    }
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={SRC} alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** The badge scales with the avatar; its icon is hidden at `sm`. */
export const WithBadge: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={SRC} alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {["user", "alice", "john"].map((name) => (
        <Avatar key={name}>
          <AvatarFallback>{avatarInitial(name)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
