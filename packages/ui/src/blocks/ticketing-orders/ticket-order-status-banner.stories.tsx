import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EMAIL } from "./fixtures";
import { TicketOrderStatusBanner } from "./ticket-order-status-banner";

/** What an order page says over its tickets, at 390 px. No Resend on the
 * site: the mail holds the PDF. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketOrderStatusBanner",
  component: TicketOrderStatusBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px] bg-background px-4 py-5">
        <Story />
      </div>
    ),
  ],
  args: {
    kind: "held",
    copy: {
      title: "Held for",
      body: "3 tickets, until 14:47. Pay before then to keep them.",
    },
    countdown: "12:34",
    act: { label: "Continue to Payment", onClick: fn() },
  },
} satisfies Meta<typeof TicketOrderStatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Held, counting down, with the way back to Stripe. */
export const Held: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Held for" });
    expect(region).toHaveTextContent("Held for 12:34");
    await userEvent.click(
      canvas.getByRole("button", { name: "Continue to Payment" }),
    );
    expect(args.act?.onClick).toHaveBeenCalled();
    expect(canvas.queryByRole("button", { name: /Resend/ })).toBeNull();
  },
};

/** The hold reached zero. */
export const Checking: Story = {
  args: {
    kind: "checking",
    copy: {
      title: "Checking",
      body: "Your time ran out. We’re checking whether the payment arrived.",
    },
    countdown: undefined,
    act: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent("Checking");
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const PartRefunded: Story = {
  name: "One ticket refunded",
  args: {
    kind: "partRefunded",
    copy: {
      title: "HK$190.00 is on its way back",
      body: "We refunded 1 ticket on 2 Dec 2026. It lands on your Visa •• 4242 in 5 to 10 business days. The other tickets still let you in.",
    },
    countdown: undefined,
    act: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "HK$190.00 is on its way back",
    );
  },
};

export const Refunded: Story = {
  name: "Fully refunded",
  args: {
    kind: "refunded",
    copy: {
      title: "HK$1,150.00 refunded on 3 Dec 2026",
      body: "The tickets no longer let anyone in. The money lands on your Visa •• 4242 in 5 to 10 business days.",
    },
    countdown: undefined,
    act: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "HK$1,150.00 refunded on 3 Dec 2026",
    );
  },
};

export const EventCancelled: Story = {
  name: "Event cancelled",
  args: {
    kind: "eventCancelled",
    copy: {
      title: "This event is canceled",
      body: "[Show Name] won’t take place. Your order is refunded in full: HK$1,150.00 lands on your Visa •• 4242 in 5 to 10 business days.",
    },
    countdown: undefined,
    act: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "This event is canceled",
    );
  },
};

/** A guest in the browser that bought: see the order anywhere. */
export const Guest: Story = {
  name: "Guest in the buying browser",
  args: {
    kind: "guest",
    copy: {
      title: "See this order anywhere",
      body: `Sign in with ${EMAIL} and every order you bought with it is in Your Tickets.`,
    },
    countdown: undefined,
    act: { label: "Sign In", onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("region", { name: "See this order anywhere" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Sign In" }));
    expect(args.act?.onClick).toHaveBeenCalled();
  },
};
