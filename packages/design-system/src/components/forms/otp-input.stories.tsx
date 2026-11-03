import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OtpInput } from "./otp-input";

const meta = {
  title: "Design System/Forms/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  args: {
    label: "Verification Code",
    message: "Enter the 6-digit code sent to your device",
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
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An empty row — blank slots until the user types. */
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_b4ded0c5-b76f-41b7-a326-4619189cf2d9" },
  },
  args: { defaultValue: "" },
};

export const Filled: Story = {
  parameters: {
    verification: { caseId: "vc_40d10475-586c-4ae0-92b0-ecde0212e593" },
  },
  args: { defaultValue: "128450" },
};

/** Click a slot and type — the row updates as digits are entered. */
export const Interactive: Story = {
  parameters: {
    verification: { caseId: "vc_f0cd73e6-7300-4261-8c32-91f660ec9819" },
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return <OtpInput {...args} value={value} onChange={setValue} />;
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_7d8b0b57-8f20-41fb-a1d5-a9816b6b20ce" },
  },
  args: {
    defaultValue: "128450",
    status: "error",
    message: "Enter a valid verification code",
  },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_05d36d5c-106c-4ad0-a455-a93750c887e5" },
  },
  args: {
    defaultValue: "128450",
    status: "success",
    message: "Code verified",
  },
};

/** Figma's `state=focus` pins the ring on slot 3. */
export const Focused: Story = {
  parameters: {
    verification: { caseId: "vc_ffb3c70f-ff04-46ba-a30f-414a333c6d6e" },
  },
  args: { defaultValue: "128450", focusedIndex: 2 },
};
export const FocusedError: Story = {
  parameters: {
    verification: { caseId: "vc_8dfed942-6114-482e-aa1e-a4df4ac431f0" },
  },
  args: {
    defaultValue: "128450",
    focusedIndex: 2,
    status: "error",
    message: "Enter a valid verification code",
  },
};
export const FocusedSuccess: Story = {
  parameters: {
    verification: { caseId: "vc_a781d1e0-41c7-44d4-9ebb-ce30dfcde59e" },
  },
  args: {
    defaultValue: "128450",
    focusedIndex: 2,
    status: "success",
    message: "Code verified",
  },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_147fdea6-a512-451b-a494-14a7883bcf80" },
  },
  args: { defaultValue: "128450", disabled: true },
};

/** No visible label, so the field takes its name from `aria-label`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_b0d8b3a1-62c9-4a0e-a5dc-68e38170f5a9" },
  },
  args: {
    defaultValue: "",
    label: undefined,
    "aria-label": "Verification code",
  },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_42a3596d-0b86-452f-a3b8-c7c194df0b56" },
  },
  args: { defaultValue: "", message: undefined },
};
