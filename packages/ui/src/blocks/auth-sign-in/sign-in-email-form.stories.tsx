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
      submit: "Sign In with Email",
    },
    email: "collector@example.com",
    onEmailChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SignInEmailForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The consumer supplies the failure copy. */
export const ErrorState: Story = {
  name: "Error",
  args: { error: "Could not send the sign-in link." },
};

/** The send action holds until an address exists; submit fires without the
 * form knowing what "send" means. */
export const ActionNeedsAnAddress: Story = {
  name: "Needs an email",
  args: { email: "" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In with Email" }),
    ).toBeDisabled();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** The step's one control while its request is in flight: it is the only
 * button on the step, and it is the one that looks busy. */
export const LinkRequestRunning: Story = {
  name: "Sending",
  args: { submitting: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: "Sign In with Email" });
    expect(submit).toHaveAttribute("aria-busy", "true");
    expect(canvas.getAllByRole("button")).toEqual([submit]);
  },
};

/**
 * Interaction-only — same paint as Default. Hidden from the gallery; still
 * runs in test to prove `onSubmit`.
 */
export const SubmitIsReported: Story = {
  tags: ["!dev"],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign In with Email" }),
    );
    expect(args.onSubmit).toHaveBeenCalledOnce();
  },
};

/**
 * Figma's `email-section` (4666:1475) draws a placeholder and nothing above
 * it, so the field carries no visible label. `copy.email` is still its
 * accessible name — the control stays named for a screen reader, which is
 * what makes dropping the visible label a layout decision rather than an
 * accessibility one. Same paint as Needs an email; hidden from the gallery.
 */
export const FieldIsLabelledWithoutVisibleText: Story = {
  tags: ["!dev"],
  args: { email: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Email" });

    expect(field).toHaveAttribute("placeholder", "Enter your email");
    expect(canvas.queryByText("Email")).toBeNull();
  },
};
