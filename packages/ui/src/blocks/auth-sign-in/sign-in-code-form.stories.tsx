import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SignInCodeForm } from "./sign-in-code-form";

const meta = {
  title: "Auth Sign In/SignInCodeForm",
  component: SignInCodeForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    code: "",
    codeLabel: "Verification code",
    hint: "Code sent to collector@example.com",
    onCodeChange: fn(),
    onSubmit: fn(),
    submitLabel: "Verify code",
    backLabel: "Back",
    onBack: fn(),
  },
} satisfies Meta<typeof SignInCodeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The consumer supplies the failure copy. */
export const ErrorState: Story = {
  args: { code: "000000", error: "That code didn't work." },
};

/** Typing is reported keystroke by keystroke; the field shows only what the
 * consumer passes back, and verify holds until a code exists. */
export const CodeIsControlled: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Verify code" })).toBeDisabled();
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Verification code" }),
      "1",
    );
    expect(args.onCodeChange).toHaveBeenCalledWith("1");
    expect(
      canvas.getByRole("textbox", { name: "Verification code" }),
    ).toHaveValue("");
  },
};

export const BackIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    expect(args.onBack).toHaveBeenCalledOnce();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
