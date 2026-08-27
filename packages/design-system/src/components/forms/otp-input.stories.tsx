import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OtpInput } from "./otp-input";

const meta = {
  title: "Components/OtpInput",
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
export const Placeholder: Story = { args: { defaultValue: "" } };

export const Filled: Story = { args: { defaultValue: "128450" } };

/** Click a slot and type — the row updates as digits are entered. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <OtpInput {...args} value={value} onChange={setValue} />;
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: {
    defaultValue: "128450",
    status: "error",
    message: "Enter a valid verification code",
  },
};
export const Success: Story = {
  args: {
    defaultValue: "128450",
    status: "success",
    message: "Code verified",
  },
};

/** Figma's `state=focus` pins the ring on slot 3. */
export const Focused: Story = {
  args: { defaultValue: "128450", focusedIndex: 2 },
};
export const FocusedError: Story = {
  args: {
    defaultValue: "128450",
    focusedIndex: 2,
    status: "error",
    message: "Enter a valid verification code",
  },
};
export const FocusedSuccess: Story = {
  args: {
    defaultValue: "128450",
    focusedIndex: 2,
    status: "success",
    message: "Code verified",
  },
};

export const Disabled: Story = {
  args: { defaultValue: "128450", disabled: true },
};

export const WithoutLabel: Story = {
  args: { defaultValue: "", label: undefined },
};
export const WithoutMessage: Story = {
  args: { defaultValue: "", message: undefined },
};
