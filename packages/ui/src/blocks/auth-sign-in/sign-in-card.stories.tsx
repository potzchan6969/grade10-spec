import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SignInCard } from "./sign-in-card";
import { SignInEmailForm } from "./sign-in-email-form";

/**
 * Sign-in is a dialog over the page the collector was already on, matching
 * [`Login Dialog` 4666:1488](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488).
 * `open` is the consumer's state — every story below supplies it, because the
 * component has no uncontrolled fallback.
 *
 * The dialog portals to `document.body`, so play functions query
 * `within(document.body)` rather than the canvas.
 */
const meta = {
  title: "Auth Sign In/SignInCard",
  component: SignInCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onOpenChange: fn(),
    copy: {
      title: "Sign in to Acme Store",
      description: "Continue with your Acme account.",
    },
    children: (
      <SignInEmailForm
        copy={{ email: "Email", submit: "Send magic link" }}
        email=""
        onEmailChange={fn()}
        onSubmit={fn()}
      />
    ),
  },
} satisfies Meta<typeof SignInCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No provider widget, so no divider above the step. */
export const Default: Story = {};

/** Visibility is the consumer's: nothing renders and no scrim appears. */
export const Closed: Story = {
  args: { open: false },
  play: async () => {
    const body = within(document.body);
    expect(body.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

/** The status line is progress copy, not an error — field errors travel on
 * the step's own `error` prop. */
export const WithMessage: Story = {
  args: { message: "Check your inbox for a sign-in link." },
};

/** The provider widget is consumer-owned, and sits *above* the labelled
 * divider, the order Figma draws. */
export const WithProviderSlot: Story = {
  args: {
    copy: {
      title: "Sign in to Acme Store",
      description: "Continue with your Acme account.",
      providerDivider: "or",
    },
    providerSlot: <button type="button">Continue with SSO</button>,
  },
  play: async () => {
    const body = within(document.body);
    const provider = body.getByRole("button", { name: "Continue with SSO" });
    const email = body.getByLabelText("Email");
    // Node.compareDocumentPosition: 4 === provider precedes email.
    expect(
      provider.compareDocumentPosition(email) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};

/** The legal line is the body's last node. The block supplies no wording. */
export const WithLegal: Story = {
  args: {
    copy: {
      title: "Sign in to Acme Store",
      legal: "By continuing you agree to the Terms and the Privacy Policy.",
    },
  },
};

export const ExitActionIsReported: Story = {
  args: { exitAction: { label: "Back to home", onAction: fn() } },
  play: async ({ args }) => {
    const body = within(document.body);
    await userEvent.click(body.getByRole("button", { name: "Back to home" }));
    expect(args.exitAction?.onAction).toHaveBeenCalledOnce();
  },
};

/** Dismissing is not the same as exiting: the close control reports it and
 * leaves the page beneath alone. */
export const CloseControlReportsDismissal: Story = {
  play: async ({ args }) => {
    const body = within(document.body);
    await userEvent.click(body.getByRole("button", { name: "Close dialog" }));
    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

export const EscapeReportsDismissal: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};
