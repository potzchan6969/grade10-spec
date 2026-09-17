import { Button } from "@grade10/design-system/components/forms/button";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";

/**
 * Toasts after a magic-link follow on the brand home. Failure toasts cover a
 * verify that creates no session. The different-account toast covers a
 * signed-in mismatch with Switch / Stay (no automatic session swap).
 *
 * Failure copy matches shared `signIn` catalog keys `linkExpired`,
 * `linkInvalid`, and `linkBanned`. Mismatch copy is story-local until the
 * catalog keys land with engineering.
 */
const meta = {
  title: "Auth Sign In/Link Follow Toasts",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <Story />
      </>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COPY = {
  linkExpired: "This sign-in link has expired.",
  linkInvalid: "This sign-in link no longer works.",
  linkBanned: "You can’t sign in with this account.",
  differentAccount: "You’re signed in with a different account.",
  differentAccountDescription: "Switch to alex@example.com.",
  switch: "Switch",
  stay: "Stay",
} as const;

function FireErrorToast({ message }: { message: string }) {
  useEffect(() => {
    toast.error(message);
  }, [message]);

  return (
    <Button type="button" onClick={() => toast.error(message)}>
      Show toast again
    </Button>
  );
}

function FireDifferentAccountToast() {
  const show = () => {
    toast.warning(COPY.differentAccount, {
      description: COPY.differentAccountDescription,
      duration: Infinity,
      action: { label: COPY.switch, onClick: () => undefined },
      cancel: { label: COPY.stay, onClick: () => undefined },
    });
  };

  useEffect(() => {
    show();
  }, []);

  return (
    <Button type="button" onClick={show}>
      Show toast again
    </Button>
  );
}

async function expectToastText(text: string) {
  const body = within(document.body);
  await waitFor(() => {
    expect(body.getByText(text)).toBeInTheDocument();
  });
}

/** Expired link — homepage after verify (shared-auth-sign-in-SC-37). */
export const Expired: Story = {
  render: () => <FireErrorToast message={COPY.linkExpired} />,
  play: async () => {
    await expectToastText(COPY.linkExpired);
  },
};

/**
 * Used, superseded, or otherwise invalid link — one shared announcement
 * (shared-auth-sign-in-SC-38 through SC-40).
 */
export const NoLongerWorks: Story = {
  name: "No longer works",
  render: () => <FireErrorToast message={COPY.linkInvalid} />,
  play: async () => {
    await expectToastText(COPY.linkInvalid);
  },
};

/** Banned account — does not invite another link (shared-auth-sign-in-SC-41). */
export const Banned: Story = {
  render: () => <FireErrorToast message={COPY.linkBanned} />,
  play: async () => {
    await expectToastText(COPY.linkBanned);
  },
};

/**
 * Signed in as Account B; link is for Account A — choose Switch or Stay
 * (`shared-auth-sign-in-US-08`).
 */
export const DifferentAccount: Story = {
  name: "Different account",
  render: () => <FireDifferentAccountToast />,
  play: async () => {
    await expectToastText(COPY.differentAccount);
    await expectToastText(COPY.differentAccountDescription);
    await expectToastText(COPY.switch);
    await expectToastText(COPY.stay);
  },
};
