import { Footer } from "@grade10/design-system/components/layout/footer";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, waitFor, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { AUTH_COPY as signIn } from "../auth-content";
import { HOME } from "./sign-in-content";

type LinkToast = "expired" | "invalid" | "different";

type LinkToastPageProps = { toast: LinkToast };

/** Toasts a link follow raises on the brand home. The toast is the only signal. */
function fireToast(kind: LinkToast) {
  if (kind === "expired") toast.error(signIn.linkExpired);
  if (kind === "invalid") toast.error(signIn.linkInvalid);
  if (kind === "different") {
    toast.warning(signIn.differentAccount, {
      description: signIn.differentAccountDescription.replace(
        "{email}",
        "alex@example.com",
      ),
      duration: Number.POSITIVE_INFINITY,
      action: { label: signIn.switch, onClick: () => undefined },
      cancel: { label: signIn.stay, onClick: () => undefined },
    });
  }
}

/**
 * The brand home a collector lands on after following a link that cannot sign
 * them in. The page is the same in every case; only the toast differs.
 */
function LinkToastPage({ toast: kind }: LinkToastPageProps) {
  useEffect(() => {
    fireToast(kind);
  }, [kind]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} session="signed-out" />
      <main className="flex w-full flex-1 justify-center px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground">{HOME.title}</h1>
      </main>
      <Footer {...STORE_FOOTER} />
      <Toast position="bottom-right" />
    </div>
  );
}

const meta = {
  title: "Auth/Sign In/Screens/Sign In/Link Toasts",
  component: LinkToastPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LinkToastPage>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectToast(text: string) {
  const body = within(document.body);
  await waitFor(() => {
    expect(body.getByText(text)).toBeInTheDocument();
  });
}

/** The link ran out after five minutes: the toast says it has expired. */
export const Expired: Story = {
  args: { toast: "expired" },
  play: async () => {
    await expectToast(signIn.linkExpired);
  },
};

/** A used, replaced or otherwise invalid link: one shared toast. */
export const NoLongerWorks: Story = {
  name: "No longer works",
  args: { toast: "invalid" },
  play: async () => {
    await expectToast(signIn.linkInvalid);
  },
};

/** Signed in as another account: the toast offers Switch or Stay. */
export const DifferentAccount: Story = {
  name: "Different account",
  args: { toast: "different" },
  play: async () => {
    await expectToast(signIn.differentAccount);
    await expectToast(signIn.switch);
    await expectToast(signIn.stay);
  },
};
