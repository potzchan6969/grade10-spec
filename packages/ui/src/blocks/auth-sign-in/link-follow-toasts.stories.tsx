import { Button } from "@grade10/design-system/components/forms/button";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";

/**
 * Failure toasts after a magic-link verify that creates no session. The
 * application fires these on the brand home; they are not part of
 * `SignInEmailForm` (send-path errors stay inline on the field).
 *
 * Copy matches shared `signIn` catalog keys `linkExpired`, `linkInvalid`,
 * and `linkBanned`.
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
