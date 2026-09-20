import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Message",
    message: "Message",
    placeholder: "Write your message",
    rows: 4,
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["default", "error", "success"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue:
      "Hello Grade10,\n\nI need help with this auction order.\n\n[Write your message here]",
  },
};

/** Empty field — Figma's placeholder look, not a separate status prop. */
export const Placeholder: Story = {};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: {
    status: "error",
    defaultValue: "Too short",
    message: "Enter at least 20 characters",
  },
};

export const Success: Story = {
  args: {
    status: "success",
    defaultValue: "Looks complete",
    message: "Looks good",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Cannot edit this note",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    defaultValue: "Saving…",
  },
};

export const LoadingWithStatus: Story = {
  args: {
    loading: true,
    status: "error",
    defaultValue: "Retrying…",
  },
};

export const WithoutLabel: Story = { args: { label: undefined } };
export const WithoutMessage: Story = { args: { message: undefined } };

export const Tall: Story = {
  args: {
    rows: 8,
    defaultValue: "A longer note needs more room.",
  },
};
