import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { SignInCard } from "../auth-sign-in/sign-in-card";
import { SignInEmailForm } from "../auth-sign-in/sign-in-email-form";
import { SignInLinkSent } from "../auth-sign-in/sign-in-link-sent";
import { EMAIL, MY_ORDERS, MY_TICKETS_COPY, SHOWS_HREF } from "./fixtures";
import { MyTicketsList } from "./my-tickets-list";

/** My Tickets at `/tickets/orders`, at 390 px: every order on the account,
 * newest first, with lapsed unpaid checkouts left out by the consumer. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/MyTicketsList",
  component: MyTicketsList,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto min-h-[640px] w-[390px] bg-background px-4 pt-5 pb-8">
        <Toast position="bottom-center" />
        <Story />
      </div>
    ),
  ],
  args: {
    copy: MY_TICKETS_COPY,
    state: { status: "ready", orders: MY_ORDERS },
    onSignIn: fn(),
    onRetry: fn(),
    browseHref: SHOWS_HREF,
  },
} satisfies Meta<typeof MyTicketsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedIn: Story = {
  name: "Signed in, newest first",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cards = canvas.getAllByRole("article");
    expect(cards.map((card) => card.getAttribute("aria-label"))).toEqual([
      "Order TK9F4D",
      "Order TK7Q2M",
      "Order TK3H8W",
      "Order TK2B6P",
    ]);
    expect(
      within(cards[0]).getByRole("link", { name: "Continue to Payment" }),
    ).toBeVisible();
    expect(
      within(cards[1]).getByRole("link", { name: "View Tickets" }),
    ).toHaveAttribute("href", "/tickets/orders/o-tk7q2m");
  },
};

export const Empty: Story = {
  name: "No orders yet",
  args: { state: { status: "ready", orders: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "No Tickets Yet" }),
    ).toBeVisible();
    expect(canvas.getByRole("link", { name: "See the Shows" })).toHaveAttribute(
      "href",
      SHOWS_HREF,
    );
  },
};

export const SignedOut: Story = {
  name: "Signed out",
  args: { state: { status: "signedOut" } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign In with Email" }),
    );
    expect(args.onSignIn).toHaveBeenCalled();
    expect(canvas.queryByRole("article")).toBeNull();
  },
};

export const Loading: Story = {
  args: { state: { status: "loading" } },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("status", {
        name: "Loading your tickets",
      }),
    ).toBeInTheDocument();
  },
};

export const Failed: Story = {
  name: "Load failed",
  args: { state: { status: "error" } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We couldn’t load your tickets",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Try Again" }));
    expect(args.onRetry).toHaveBeenCalled();
  },
};

const SIGN_IN_TITLE = "Sign In to See Your Tickets";

/** Signed out, Sign In with Email opens the site's emailed-link dialog; the
 * consumer owns it. Sending moves it to Check Your Email. */
export const SignInDialog: Story = {
  name: "Sign in, then Check Your Email",
  args: { state: { status: "signedOut" } },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState(EMAIL);
    return (
      <>
        <MyTicketsList {...args} onSignIn={() => setOpen(true)} />
        <SignInCard
          copy={{
            title: sent ? "Check Your Email" : SIGN_IN_TITLE,
            description: sent ? undefined : MY_TICKETS_COPY.signedOut.body,
          }}
          onOpenChange={setOpen}
          open={open}
        >
          {sent ? (
            <SignInLinkSent
              copy={{
                message: "We’ve just sent a sign-in link to",
                resend: "Resend",
                resendCountdown: "Resend (45)",
              }}
              email={email}
              onResend={fn()}
              resendCooldownRemaining={45}
            />
          ) : (
            <SignInEmailForm
              copy={{
                email: "Email",
                emailPlaceholder: "Enter your email",
                submit: "Sign In with Email",
              }}
              email={email}
              onEmailChange={setEmail}
              onSubmit={() => setSent(true)}
            />
          )}
        </SignInCard>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign In with Email" }),
    );
    const body = within(document.body);
    const dialog = await body.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: SIGN_IN_TITLE }),
    ).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Sign In with Email" }),
    );
    await waitFor(() =>
      expect(
        body.getByRole("heading", { name: "Check Your Email" }),
      ).toBeVisible(),
    );
    expect(body.getByRole("button", { name: "Resend (45)" })).toBeDisabled();
  },
};

/** Back from the link: signed in, the guest's orders listed, and the
 * consumer's toast says the points are on the account. */
export const BackFromTheLink: Story = {
  name: "Back from the link",
  render: function Render(args) {
    useEffect(() => {
      toast.success("You’re signed in", {
        description:
          "115 points from your ticket orders are now on your account.",
      });
    }, []);
    return <MyTicketsList {...args} />;
  },
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    const [title] = await body.findAllByText("You’re signed in");
    expect(title).toBeInTheDocument();
    expect(
      body.getAllByText(
        "115 points from your ticket orders are now on your account.",
      )[0],
    ).toBeInTheDocument();
    expect(within(canvasElement).getAllByRole("article")).toHaveLength(4);
  },
};
