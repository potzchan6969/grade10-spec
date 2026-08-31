import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
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
  title: "Components/Avatar",
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

/** One character — first letter of the email local part. */
export const FromEmail: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>{avatarInitial("user@gmail.com")}</AvatarFallback>
    </Avatar>
  ),
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
      {["user@gmail.com", "alice@example.com", "john@example.com"].map(
        (email) => (
          <Avatar key={email}>
            <AvatarFallback>{avatarInitial(email)}</AvatarFallback>
          </Avatar>
        ),
      )}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};
