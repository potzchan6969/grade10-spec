import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SignInEmailForm } from "./sign-in-email-form";

const meta = {
  title: "Auth Sign In/SignInEmailForm",
  component: SignInEmailForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      email: "Email",
      emailPlaceholder: "Enter your email",
      submit: "Send magic link",
    },
    email: "collector@example.com",
    onEmailChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SignInEmailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCodeAction: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    onRequestCode: fn(),
  },
};

/** The consumer supplies the failure copy. */
export const ErrorState: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    error: "Could not send the magic link.",
  },
};

/** Both actions hold until an address exists; submit fires without the form
 * knowing what "send" means. */
export const ActionsNeedAnAddress: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    email: "",
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

/** One command at a time: while the link request runs, the code action
 * refuses activation — and only the running control looks busy. */
export const LinkRequestRunning: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    submitting: true,
    onRequestCode: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Send magic link" });
    const codeAction = canvas.getByRole("button", {
      name: "Email me a code instead",
    });
    expect(submit).toHaveAttribute("aria-busy", "true");
    expect(codeAction).toBeDisabled();
    expect(codeAction).not.toHaveAttribute("aria-busy");
  },
};

export const CodeRequestRunning: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    requestingCode: true,
    onRequestCode: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Send magic link" });
    const codeAction = canvas.getByRole("button", {
      name: "Email me a code instead",
    });
    expect(codeAction).toHaveAttribute("aria-busy", "true");
    expect(submit).toBeDisabled();
    expect(submit).not.toHaveAttribute("aria-busy");
  },
};

/** A settled request frees the step: with nothing in flight, either
 * command starts normally. */
export const SettledStepIsFree: Story = {
  args: {
    copy: {
      email: "Email",
      submit: "Send magic link",
      codeAction: "Email me a code instead",
    },
    onRequestCode: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Email me a code instead" }),
    );
    expect(args.onRequestCode).toHaveBeenCalledOnce();
    await userEvent.click(
      canvas.getByRole("button", { name: "Send magic link" }),
    );
    expect(args.onSubmit).toHaveBeenCalledOnce();
  },
};

/**
 * Figma's `email-section` (4666:1475) draws a placeholder and nothing above
 * it, so the field carries no visible label. `copy.email` is still its
 * accessible name — the control stays named for a screen reader, which is
 * what makes dropping the visible label a layout decision rather than an
 * accessibility one.
 */
export const FieldIsLabelledWithoutVisibleText: Story = {
  args: { email: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Email" });

    expect(field).toHaveAttribute("placeholder", "Enter your email");
    expect(canvas.queryByText("Email")).toBeNull();
  },
};
