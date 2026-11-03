import { Button } from "@grade10/design-system/components/forms/button";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";

/**
 * Toasts a sign-in surface shows for an event that happened somewhere else.
 * Failure toasts cover a verify that creates no session, on the brand home.
 * The different-account toast covers a signed-in mismatch with Switch / Stay
 * (no automatic session swap). The settled-elsewhere toast covers a surface
 * still waiting on Check Your Email whose address signs in on another
 * device — it ends the wait with this toast and gains no session of its own.
 *
 * Every word here matches the shared `signIn` catalog.
 */
const meta = {
  title: "Account/Sign In/Blocks/LinkFollowToasts",
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

const { signIn } = getMessages("grade10", "en");

const COPY = {
  linkExpired: signIn.linkExpired,
  linkInvalid: signIn.linkInvalid,
  linkBanned: signIn.linkBanned,
  differentAccount: signIn.differentAccount,
  differentAccountDescription: signIn.differentAccountDescription.replace(
    "{email}",
    "alex@example.com",
  ),
  switch: signIn.switch,
  stay: signIn.stay,
  settledElsewhere: signIn.settledElsewhere,
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

function FireInfoToast({ message }: { message: string }) {
  useEffect(() => {
    toast.info(message);
  }, [message]);

  return (
    <Button type="button" onClick={() => toast.info(message)}>
      Show toast again
    </Button>
  );
}

function FireDifferentAccountToast() {
  const show = useCallback(() => {
    toast.warning(COPY.differentAccount, {
      description: COPY.differentAccountDescription,
      duration: Infinity,
      action: { label: COPY.switch, onClick: () => undefined },
      cancel: { label: COPY.stay, onClick: () => undefined },
    });
  }, []);

  useEffect(() => {
    show();
  }, [show]);

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
  parameters: {
    verification: { caseId: "vc_2ad3b87c-244f-4b58-b7ab-1c9b90ab0f0d" },
  },
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
  parameters: {
    verification: { caseId: "vc_60c354fe-cb2f-484c-986a-08410ae0837f" },
  },
  name: "No longer works",
  render: () => <FireErrorToast message={COPY.linkInvalid} />,
  play: async () => {
    await expectToastText(COPY.linkInvalid);
  },
};

/** Banned account — does not invite another link (shared-auth-sign-in-SC-41). */
export const Banned: Story = {
  parameters: {
    verification: { caseId: "vc_9fbc331d-f36b-4f49-ba39-1189c877d464" },
  },
  render: () => <FireErrorToast message={COPY.linkBanned} />,
  play: async () => {
    await expectToastText(COPY.linkBanned);
  },
};

/**
 * Signed in as Account B; link is for Account A — choose Switch or Stay
 * (`shared-auth-sign-in-US-09`).
 */
export const DifferentAccount: Story = {
  parameters: {
    verification: { caseId: "vc_730b8401-1a89-4680-88fe-405b54c9b92f" },
  },
  name: "Different account",
  render: () => <FireDifferentAccountToast />,
  play: async () => {
    await expectToastText(COPY.differentAccount);
    await expectToastText(COPY.differentAccountDescription);
    await expectToastText(COPY.switch);
    await expectToastText(COPY.stay);
  },
};

/**
 * A surface still waiting on Check Your Email ends its wait once that
 * address signs in on another device, by any method — no session of its own
 * (shared-auth-sign-in-SC-70 through SC-77).
 */
export const SettledElsewhere: Story = {
  parameters: {
    verification: { caseId: "vc_36351a2d-0df9-4b4f-b543-7da5e6a02ff9" },
  },
  name: "Settled elsewhere",
  render: () => <FireInfoToast message={COPY.settledElsewhere} />,
  play: async () => {
    await expectToastText(COPY.settledElsewhere);
  },
};
