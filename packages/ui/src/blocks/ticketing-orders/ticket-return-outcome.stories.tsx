import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EMAIL } from "./fixtures";
import { TicketReturnOutcome } from "./ticket-return-outcome";

/** What the order page says when the collector comes back from Stripe, at
 * 390 px. Paid leads the tickets in the browser that paid; anywhere else the
 * paid link opens nothing of the order. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketReturnOutcome",
  component: TicketReturnOutcome,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px] bg-background px-4 pt-5 pb-8">
        <Story />
      </div>
    ),
  ],
  args: {
    kind: "paid",
    copy: {
      status: "Confirmed",
      title: "You’re Going",
      body: `Your 3 tickets are below, and we sent them to ${EMAIL} as one PDF.`,
      note: `About 115 points wait in your Grade10 account. Sign in with ${EMAIL} to add them.`,
    },
    act: { label: "Sign In with Email", onClick: fn() },
  },
} satisfies Meta<typeof TicketReturnOutcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paid: Story = {
  parameters: {
    verification: { caseId: "vc_6cd74465-fca4-4df2-ba20-8e97bbfde6e0" },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "You’re Going" }),
    ).toBeVisible();
    expect(canvas.getByText("Confirmed")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Sign In with Email" }),
    );
    expect(args.act?.onClick).toHaveBeenCalled();
  },
};

const chooseAgain = { label: "Choose Again", href: "/tickets/show" };

export const WentBack: Story = {
  parameters: {
    verification: { caseId: "vc_93e03c49-b846-4ca6-945c-575959e7211b" },
  },
  name: "Went back",
  args: {
    kind: "wentBack",
    copy: {
      status: "Not Paid",
      title: "Payment Not Completed",
      body: "We let the tickets go and nothing was charged.",
    },
    act: chooseAgain,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Payment Not Completed" }),
    ).toBeVisible();
    expect(canvas.getByRole("link", { name: "Choose Again" })).toHaveAttribute(
      "href",
      "/tickets/show",
    );
  },
};

export const HoldRanOut: Story = {
  parameters: {
    verification: { caseId: "vc_726d2d6e-d3a4-4dab-9671-8da3dbf1fb0c" },
  },
  name: "Hold ran out",
  args: {
    kind: "holdRanOut",
    copy: {
      status: "Not Paid",
      title: "Your 15 Minutes Ran Out",
      body: "The tickets went back on sale and nothing was charged.",
    },
    act: chooseAgain,
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("heading", {
        name: "Your 15 Minutes Ran Out",
      }),
    ).toBeVisible();
  },
};

export const PaidTooLate: Story = {
  parameters: {
    verification: { caseId: "vc_9ee60174-2b7d-41b8-9712-52bc960a964e" },
  },
  name: "Paid too late",
  args: {
    kind: "paidTooLate",
    copy: {
      status: "Refunding",
      title: "Your Payment Came Too Late",
      body: "It arrived after your 15 minutes ended and the tickets had gone, so we’re refunding HK$1,150.00 in full.",
      note: `It lands on your Visa •• 4242 in 5 to 10 business days. We sent the details to ${EMAIL}.`,
    },
    act: chooseAgain,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Refunding")).toBeVisible();
    expect(canvas.getByText(/refunding HK\$1,150\.00 in full/)).toBeVisible();
  },
};

/** A copied or shared link, or any browser but the one that paid: no name,
 * email, ticket count or code. */
export const OtherBrowser: Story = {
  parameters: {
    verification: { caseId: "vc_a71d8a1b-ab24-42f5-b5d4-65a790614367" },
  },
  name: "Other browser",
  args: {
    kind: "otherBrowser",
    copy: {
      title: "Your Tickets Are in Your Email",
      body: "Sign in with the email you bought with to see this order here.",
      note: "The PDF in your email works at the door on its own.",
    },
    act: { label: "Sign In with Email", onClick: fn() },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Your Tickets Are in Your Email" }),
    ).toBeVisible();
    expect(canvas.queryByText(/TK7Q2M/)).toBeNull();
    expect(canvas.queryByText(EMAIL)).toBeNull();
  },
};

export const NotTheirOrder: Story = {
  parameters: {
    verification: { caseId: "vc_0dfd59c8-df04-4a74-964f-a2ed88494837" },
  },
  name: "Signed in, not their order",
  args: {
    kind: "notTheirs",
    copy: {
      title: "This Order Isn’t on This Account",
      body: "You’re signed in as kit.lau@example.com. Sign in with the email you bought with to see it.",
    },
    act: { label: "Sign In with Another Email", onClick: fn() },
    secondaryAct: { label: "Sign Out", onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Sign Out" }));
    expect(args.secondaryAct?.onClick).toHaveBeenCalled();
    expect(
      canvas.getByRole("button", { name: "Sign In with Another Email" }),
    ).toBeVisible();
  },
};
