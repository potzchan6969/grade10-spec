import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SignInLinkSent } from "./sign-in-link-sent";

const meta = {
  title: "Auth Sign In/SignInLinkSent",
  component: SignInLinkSent,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      message: "We've just sent a sign-in link to collector@example.com.",
      resend: "Resend",
      back: "Back",
    },
    onResend: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof SignInLinkSent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "We've just sent a sign-in link to collector@example.com.",
      ),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Resend" })).toBeEnabled();
    expect(canvas.getByRole("button", { name: "Back" })).toBeInTheDocument();
  },
};

export const ResendReportsActivation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Resend" }));
    expect(args.onResend).toHaveBeenCalledOnce();
  },
};

export const BackReportsActivation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    expect(args.onBack).toHaveBeenCalledOnce();
  },
};

/** Resend looks busy while its request is in flight. */
export const Resending: Story = {
  args: { resending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const resend = canvas.getByRole("button", { name: "Resend" });
    expect(resend).toHaveAttribute("aria-busy", "true");
  },
};

/**
 * Static fixture for the sixty-second wait — label **Resend (45)**, control
 * disabled. Spec: shared-ui-auth-sign-in-SC-14 / shared-auth-sign-in-SC-46.
 */
export const ResendCooldown: Story = {
  name: "Resend countdown",
  args: {
    resendCooldownRemaining: 45,
    copy: {
      message: "We've just sent a sign-in link to collector@example.com.",
      resend: "Resend",
      resendCountdown: "Resend (45)",
      back: "Back",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const resend = canvas.getByRole("button", { name: "Resend (45)" });
    expect(resend).toBeDisabled();
    expect(args.onResend).not.toHaveBeenCalled();
  },
};

/**
 * Short countdown that ticks (200ms steps, three ticks) — demo only; production
 * wait is sixty seconds. Does not wait a real minute in tests.
 */
export const ResendCountdownTicks: Story = {
  name: "Resend countdown ticks",
  render: function ResendCountdownTicksDemo(args) {
    const [remaining, setRemaining] = useState(3);

    useEffect(() => {
      if (remaining <= 0) return;
      const id = window.setTimeout(() => {
        setRemaining((n) => n - 1);
      }, 200);
      return () => window.clearTimeout(id);
    }, [remaining]);

    return (
      <SignInLinkSent
        {...args}
        copy={{
          ...args.copy,
          resendCountdown: remaining > 0 ? `Resend (${remaining})` : undefined,
        }}
        resendCooldownRemaining={remaining}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Resend (3)" })).toBeDisabled();

    await waitFor(
      () => {
        expect(canvas.getByRole("button", { name: "Resend" })).toBeEnabled();
      },
      { timeout: 2000 },
    );
  },
};
