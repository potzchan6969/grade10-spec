import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputOtpSlot } from "./input-otp-slot";

const meta = {
  title: "Components/InputOtpSlot",
  component: InputOtpSlot,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["default", "error", "success"],
    },
  },
} satisfies Meta<typeof InputOtpSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's default digit `"0"` is the placeholder glyph for an empty slot. */
export const Placeholder: Story = {};

export const Filled: Story = { args: { digit: "8" } };

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = { args: { status: "error" } };
export const ErrorFilled: Story = { args: { status: "error", digit: "8" } };
export const Success: Story = { args: { status: "success" } };
export const SuccessFilled: Story = { args: { status: "success", digit: "8" } };

/** Figma's `state=focus` paints the ring instead of the resting border. */
export const Focused: Story = { args: { focused: true, digit: "8" } };
export const FocusedPlaceholder: Story = { args: { focused: true } };
export const FocusedError: Story = {
  args: { focused: true, status: "error", digit: "8" },
};
export const FocusedSuccess: Story = {
  args: { focused: true, status: "success", digit: "8" },
};

export const Disabled: Story = { args: { disabled: true } };
export const DisabledFilled: Story = { args: { disabled: true, digit: "8" } };
