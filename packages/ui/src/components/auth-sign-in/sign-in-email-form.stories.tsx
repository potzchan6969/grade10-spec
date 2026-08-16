import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SignInEmailForm } from "./sign-in-email-form";

const meta = {
  title: "Auth Sign In/SignInEmailForm",
  component: SignInEmailForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    email: "collector@example.com",
    emailLabel: "Email",
    onEmailChange: fn(),
    onSubmit: fn(),
    submitLabel: "Send magic link",
  },
} satisfies Meta<typeof SignInEmailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCodeAction: Story = {
  args: {
    codeActionLabel: "Email me a code instead",
    onRequestCode: fn(),
  },
};

/** The consumer supplies the failure copy. */
export const ErrorState: Story = {
  args: { error: "Could not send the magic link." },
};

/** Both actions hold until an address exists; submit fires without the form
 * knowing what "send" means. */
export const ActionsNeedAnAddress: Story = {
  args: {
    email: "",
    codeActionLabel: "Email me a code instead",
    onRequestCode: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Send magic link" }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Email me a code instead" }),
    ).toBeDisabled();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const SubmitIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Send magic link" }),
    );
    expect(args.onSubmit).toHaveBeenCalledOnce();
  },
};
