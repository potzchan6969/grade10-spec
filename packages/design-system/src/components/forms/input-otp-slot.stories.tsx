import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputOtpSlot } from "./input-otp-slot";

const meta = {
  title: "Design System/Forms/InputOtpSlot",
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

/** Empty slot — blank until a digit is passed. */
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_eed9dcc3-a003-4a99-973d-6403c52ad066" },
  },
};

export const Filled: Story = {
  parameters: {
    verification: { caseId: "vc_1ce68f0a-8cb9-4276-9258-68f73007e908" },
  },
  args: { digit: "8" },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_1cb0fa40-7d95-42ee-ab66-fba8ec9e4760" },
  },
  args: { status: "error" },
};
export const ErrorFilled: Story = {
  parameters: {
    verification: { caseId: "vc_742b12b7-ba23-4265-bec8-132c921d8593" },
  },
  args: { status: "error", digit: "8" },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_839f320f-f0f6-48f8-bd68-7dc288dfc2f6" },
  },
  args: { status: "success" },
};
export const SuccessFilled: Story = {
  parameters: {
    verification: { caseId: "vc_54369bec-19aa-4a44-a642-286844daad31" },
  },
  args: { status: "success", digit: "8" },
};

/** Figma's `state=focus` paints the ring instead of the resting border. */
export const Focused: Story = {
  parameters: {
    verification: { caseId: "vc_25d249ec-13eb-4eac-b1a8-12fe75f11972" },
  },
  args: { focused: true, digit: "8" },
};
export const FocusedEmpty: Story = {
  parameters: {
    verification: { caseId: "vc_9bd11d42-b848-4b96-bbd1-261774ffca1b" },
  },
  args: { focused: true },
};
export const FocusedError: Story = {
  parameters: {
    verification: { caseId: "vc_44aa0eb2-9202-4b27-8d4c-2f6d7e1b8504" },
  },
  args: { focused: true, status: "error", digit: "8" },
};
export const FocusedSuccess: Story = {
  parameters: {
    verification: { caseId: "vc_75ff5fce-d68a-41ad-a3da-bf0a6ee69878" },
  },
  args: { focused: true, status: "success", digit: "8" },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_f352e240-7f29-4aad-bd1c-42fe8d7bdf09" },
  },
  args: { disabled: true },
};
export const DisabledFilled: Story = {
  parameters: {
    verification: { caseId: "vc_5f495f2a-11dd-4158-a4ac-8a04014dba75" },
  },
  args: { disabled: true, digit: "8" },
};
