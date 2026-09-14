import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SignInCard } from "./sign-in-card";
import { SignInEmailForm } from "./sign-in-email-form";

/**
 * Sign-in is a dialog over the page the collector was already on, matching
 * [`Login Dialog` 4666:1488](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488).
 * `open` is the consumer's state: the component has no uncontrolled fallback,
 * so the meta holds it at true and every story below is the open dialog.
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
    copy: { title: "Sign in to Acme Store" },
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

/** Stands in for a provider's artwork. A shared block ships no brand's
 * mark, so the story supplies one the way a consumer does. */
function ProviderMark() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  );
}

/**
 * No provider widget, so no divider above the step.
 *
 * Scenario: shared-ui-auth-sign-in-SC-08 — the block draws no legal node of
 * its own, so a consumer that supplies no wording gets none. Asserted here
 * rather than in a story of its own: supplying nothing *is* the default, and
 * a second empty-args story renders the same pixels.
 */
export const Default: Story = {
  play: async () => {
    const body = within(document.body);

    expect(
      body.getByRole("dialog").querySelector('[data-slot="sign-in-legal"]'),
    ).toBeNull();
  },
};

/** The status line is progress copy, not an error — field errors travel on
 * the step's own `error` prop. */
export const WithMessage: Story = {
  args: { message: "Check your inbox for a sign-in link." },
};

/**
 * The redirect shape of an external provider: an outline button the consumer
 * owns, sitting *above* the labelled divider in the order Figma draws. The
 * mark is the story's, not the block's — a shared component carries no
 * brand's artwork.
 *
 * It draws its own markup, so it marks no container and the divider never
 * waits on it. That is the other half of the rule
 * `ProviderThatHasNotDrawnYet` proves from the asynchronous side.
 */
export const WithProviderSlot: Story = {
  args: {
    copy: { title: "Sign in to Acme Store", providerDivider: "or" },
    providerSlot: (
      <Button
        leading={<ProviderMark />}
        size="md"
        type="button"
        variant="outline"
      >
        Continue with Acme ID
      </Button>
    ),
  },
  play: async () => {
    const body = within(document.body);
    const provider = body.getByRole("button", {
      name: "Continue with Acme ID",
    });
    const email = body.getByLabelText("Email");
    const group = body
      .getByRole("dialog")
      .querySelector('[data-slot="divider"]')?.parentElement as HTMLElement;

    expect(getComputedStyle(group).display).not.toBe("none");
    // Node.compareDocumentPosition: 4 === provider precedes email.
    expect(
      provider.compareDocumentPosition(email) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};

/**
 * The legal line is the body's last node, and stays last with a status line
 * above it — the order is the contract, not the arrangement of this one
 * example. The block supplies no wording: every word here is the
 * consumer's.
 */
export const WithLegal: Story = {
  args: {
    copy: {
      title: "Sign in to Acme Store",
      legal: "By continuing you agree to the Terms and the Privacy Policy.",
    },
    message: "Check your inbox for a sign-in link.",
  },
  play: async ({ args }) => {
    const body = within(document.body);
    const legal = body.getByText(String(args.copy.legal));

    expect(legal.closest('[data-slot="sign-in-legal"]')).toBe(
      legal.closest('[data-slot="dialog-body"]')?.lastElementChild,
    );
  },
};

/**
 * A widget a script fills in later — Google's own button — marks its own
 * container, and the divider waits for it. An "or" over blank space is what
 * a collector sees when that script never answers, so the pair hides until
 * something is actually there to divide.
 */
export const ProviderThatHasNotDrawnYet: Story = {
  args: {
    copy: { title: "Sign in to Acme Store", providerDivider: "or" },
    providerSlot: <div data-slot="sign-in-provider" />,
  },
  play: async () => {
    const dialog = within(document.body).getByRole("dialog");
    const container = dialog.querySelector(
      '[data-slot="sign-in-provider"]',
    ) as HTMLElement;
    const group = dialog.querySelector('[data-slot="divider"]')
      ?.parentElement as HTMLElement;

    expect(getComputedStyle(group).display).toBe("none");

    container.appendChild(document.createElement("button"));

    await waitFor(() =>
      expect(getComputedStyle(group).display).not.toBe("none"),
    );
  },
};

/** The close control reports dismissal and leaves the page beneath alone. */
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

/**
 * The scrim is the third way out, alongside the close control and Escape.
 * `DialogContent` mounts its own `DialogOverlay`, so activating it is
 * activating what the dialog already renders — no separate mount to reach for.
 */
export const ScrimReportsDismissal: Story = {
  play: async ({ args }) => {
    const scrim = document.body.querySelector('[data-slot="dialog-overlay"]');
    expect(scrim).toBeInTheDocument();

    await userEvent.click(scrim as Element);

    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

/**
 * What dismissal is *for*: the collector goes back to what they were doing.
 * The page renders behind the dialog and is still there after every way out —
 * a card on a route could not promise that, which is the whole reason this
 * surface moved onto `Dialog`.
 *
 * Queried with `hidden`, because Base UI marks everything outside an open
 * modal `aria-hidden` and inert. That is the contract, not a defect: the page
 * is mounted and untouched, and setting `open` to false is what hands it back.
 * Mounted is the whole claim — this story holds `open` at true, so what it can
 * show is that dismissing never unmounts or navigates.
 */
export const DismissalLeavesThePageBeneath: Story = {
  decorators: [
    (Story) => (
      <>
        <main>
          <h1>Your cart</h1>
          <p>1999 Charizard, PSA 10</p>
        </main>
        <Story />
      </>
    ),
  ],
  play: async ({ args, canvas }) => {
    const page = canvas.getByRole("heading", {
      name: "Your cart",
      hidden: true,
    });
    const body = within(document.body);
    const scrim = () =>
      document.body.querySelector('[data-slot="dialog-overlay"]') as Element;

    for (const dismiss of [
      () => userEvent.click(body.getByRole("button", { name: "Close dialog" })),
      () => userEvent.keyboard("{Escape}"),
      () => userEvent.click(scrim()),
    ]) {
      args.onOpenChange.mockClear();

      await dismiss();

      await waitFor(() => {
        expect(args.onOpenChange).toHaveBeenCalledWith(false);
      });
      expect(page).toBeInTheDocument();
      expect(canvas.getByText("1999 Charizard, PSA 10")).toBeInTheDocument();
    }
  },
};
