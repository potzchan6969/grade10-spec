import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TwoFactorVerifyForm } from "./two-factor-verify-form";

const meta = {
  title: "Auth Two Factor/TwoFactorVerifyForm",
  component: TwoFactorVerifyForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Verification code",
    hint: "From your authenticator app.",
    submitLabel: "Verify",
    onSubmit: fn(),
  },
} satisfies Meta<typeof TwoFactorVerifyForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The consumer supplies the failure copy. */
export const ErrorState: Story = {
  args: { error: "That code didn't work." },
};

export const Pending: Story = { args: { pending: true } };

/** Backup codes are neither six characters nor digits. */
export const BackupCode: Story = {
  args: {
    variant: "text",
    label: "Backup code",
    hint: "One of the codes you stored at setup.",
  },
};

/** A filled row submits itself, so a password manager's autofill needs no
 * second click — and reports the code once, not once per keystroke.
 *
 * Typed straight into the input, the way a manager fills it: the design system
 * paints that input over the slot row with `pointer-events: none` so the slots
 * take clicks, and its focus choreography settles over several frames, which a
 * synthetic click-then-type outruns. The pointer check is what is waived here,
 * not the typing — the keystrokes land on the same element a person's do.
 */
export const CompletingTheRowSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "123456", { pointerEventsCheck: 0 });
    expect(input).toHaveValue("123456");
    expect(args.onSubmit).toHaveBeenCalledOnce();
    expect(args.onSubmit).toHaveBeenCalledWith("123456");
  },
};

/** Verify holds until something is typed. */
export const SubmitWaitsForACode: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Verify" })).toBeDisabled();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** Switching kinds is reported, and clears whatever was half-typed. */
export const SecondaryActionIsReported: Story = {
  args: { secondaryAction: { label: "Use a backup code", onAction: fn() } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Use a backup code" }),
    );
    expect(args.secondaryAction?.onAction).toHaveBeenCalledOnce();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
