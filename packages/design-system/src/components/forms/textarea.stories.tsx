import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Design System/Forms/Textarea",
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
  parameters: {
    verification: { caseId: "vc_4a3c266b-abb0-427c-b99b-782906fc3448" },
  },
  args: {
    defaultValue:
      "Hello Grade10,\n\nI need help with this auction order.\n\n[Write your message here]",
  },
};

/** Empty field — Figma's placeholder look, not a separate status prop. */
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_b38d3c0c-70af-456f-beab-c433370832e5" },
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_ae7399cf-0016-4c7b-8a95-38f056a4a026" },
  },
  args: {
    status: "error",
    defaultValue: "Too short",
    message: "Enter at least 20 characters",
  },
};

export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_940a3f2b-2d2c-418e-891c-376eaae5abba" },
  },
  args: {
    status: "success",
    defaultValue: "Looks complete",
    message: "Looks good",
  },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_aa2eeb34-f64e-435e-9498-53de382b0951" },
  },
  args: {
    disabled: true,
    value: "Cannot edit this note",
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_67141689-3a3b-49dc-9fc7-9108b95fec7c" },
  },
  args: {
    loading: true,
    defaultValue: "Saving…",
  },
};

export const LoadingWithStatus: Story = {
  parameters: {
    verification: { caseId: "vc_6a0246c7-3668-41ea-a998-1aece35c7ada" },
  },
  args: {
    loading: true,
    status: "error",
    defaultValue: "Retrying…",
  },
};

/** No visible label, so the field takes its name from `aria-label`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_458781d9-87e0-4597-b8e1-4c39f43eadaa" },
  },
  args: { label: undefined, "aria-label": "Message" },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_66641a2f-0ab4-45c2-be8f-cd6740c9a8e9" },
  },
  args: { message: undefined },
};

export const Tall: Story = {
  parameters: {
    verification: { caseId: "vc_525b21c6-8e54-4b48-a5fe-091fc0de1376" },
  },
  args: {
    rows: 8,
    defaultValue: "A longer note needs more room.",
  },
};
