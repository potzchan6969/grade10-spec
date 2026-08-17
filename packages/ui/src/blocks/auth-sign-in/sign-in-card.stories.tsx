import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SignInCard } from "./sign-in-card";
import { SignInEmailForm } from "./sign-in-email-form";

const meta = {
  title: "Auth Sign In/SignInCard",
  component: SignInCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Sign in to Acme Store",
    description: "Continue with your Acme account.",
    children: (
      <SignInEmailForm
        email=""
        emailLabel="Email"
        onEmailChange={fn()}
        onSubmit={fn()}
        submitLabel="Send magic link"
      />
    ),
  },
} satisfies Meta<typeof SignInCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The status line is progress copy, not an error — field errors travel on
 * the step's own `error` prop. */
export const WithMessage: Story = {
  args: { message: "Check your inbox for a sign-in link." },
};

/** The provider widget is consumer-owned; the card only places it under the
 * labelled divider. */
export const WithProviderSlot: Story = {
  args: {
    providerDividerLabel: "or",
    providerSlot: <button type="button">Continue with SSO</button>,
  },
};

export const ExitActionIsReported: Story = {
  args: { exitAction: { label: "Back to home", onAction: fn() } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Back to home" }));
    expect(args.exitAction?.onAction).toHaveBeenCalledOnce();
  },
};
