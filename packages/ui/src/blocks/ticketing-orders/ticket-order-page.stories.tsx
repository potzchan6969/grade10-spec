import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import {
  EMAIL,
  FREE_TICKETS,
  HELD_FACTS,
  LINES,
  ORDER_COPY,
  SUMMARY,
  TICKETS,
  TICKETS_AFTER_DAY_ONE,
  TICKETS_PART_REFUNDED,
  YOUR_TICKETS_HREF,
} from "./fixtures";
import { TicketOrderPage } from "./ticket-order-page";
import { TicketOrderStatusBanner } from "./ticket-order-status-banner";
import { TicketPointsRow } from "./ticket-points-row";
import { TicketReturnOutcome } from "./ticket-return-outcome";

/** One order's page at 390 px, from the hold to the door, under the site
 * header the consumer draws. No Resend on the site: the mail holds the PDF. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketOrderPage",
  component: TicketOrderPage,
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
    copy: ORDER_COPY,
    tone: "ok",
    yourTicketsHref: YOUR_TICKETS_HREF,
    tickets: TICKETS,
    summary: SUMMARY,
    points: (
      <TicketPointsRow
        copy={{
          label: "Points",
          value: "About 1,150",
          note: `Points go to the Grade10 account for ${EMAIL} once the order is recorded.`,
        }}
        kind="about"
      />
    ),
    footer: (
      <p className="text-sm leading-5 text-secondary-foreground">
        Lost your tickets? Sign in with the email you bought with, and every
        order is in{" "}
        <a className="text-foreground underline" href={YOUR_TICKETS_HREF}>
          Your Tickets
        </a>
        .
      </p>
    ),
  },
} satisfies Meta<typeof TicketOrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Confirmed and signed in: a QR card per ticket. */
export const Confirmed: Story = {
  name: "Confirmed, signed in",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Order TK7Q2M" }),
    ).toBeVisible();
    const trail = canvas.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(trail).getByRole("link", { name: "Your Tickets" }),
    ).toHaveAttribute("href", YOUR_TICKETS_HREF);
    for (const n of [1, 2, 3])
      expect(
        canvas.getByRole("region", { name: `Ticket ${n} of 3` }),
      ).toBeVisible();
    expect(canvas.getByText("HK$1,150.00")).toBeVisible();
    expect(canvas.queryByRole("button", { name: /Resend/ })).toBeNull();
  },
};

const unpaid = { ...SUMMARY, copy: { ...SUMMARY.copy, paidBy: undefined } };

/** Held, counting down: no codes until it is paid. */
export const Held: Story = {
  name: "Held, counting down",
  args: {
    copy: { ...ORDER_COPY, status: "Waiting for Payment", facts: HELD_FACTS },
    tone: "warn",
    tickets: [],
    summary: unpaid,
    banner: (
      <TicketOrderStatusBanner
        act={{ label: "Continue to Payment", onClick: fn() }}
        copy={{
          title: "Held for",
          body: "3 tickets, until 14:47. Pay before then to keep them.",
        }}
        countdown="12:34"
        kind="held"
      />
    ),
    points: undefined,
    footer: (
      <p className="text-sm leading-5 text-secondary-foreground">
        Nothing is charged until you pay. If the time runs out, the tickets go
        back on sale.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Waiting for Payment")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Continue to Payment" }),
    ).toBeVisible();
    expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

export const Checking: Story = {
  name: "Hold reached zero",
  args: {
    copy: { ...ORDER_COPY, status: "Checking", facts: HELD_FACTS },
    tone: "plain",
    tickets: [],
    summary: unpaid,
    banner: (
      <TicketOrderStatusBanner
        copy={{
          title: "Checking",
          body: "Your time ran out. We’re checking whether the payment arrived.",
        }}
        kind="checking"
      />
    ),
    points: undefined,
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "We’re checking whether the payment arrived.",
    );
  },
};

export const AfterDayOne: Story = {
  name: "After day 1",
  args: {
    tickets: TICKETS_AFTER_DAY_ONE,
    points: undefined,
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("1 Day Left")).toHaveLength(3);
    expect(canvas.getByText("Fast Pass on 1 day left")).toBeVisible();
  },
};

export const PartRefunded: Story = {
  name: "One ticket refunded",
  args: {
    copy: { ...ORDER_COPY, status: "Partly Refunded" },
    tone: "info",
    tickets: TICKETS_PART_REFUNDED,
    banner: (
      <TicketOrderStatusBanner
        copy={{
          title: "HK$190.00 is on its way back",
          body: "We refunded 1 ticket on 2 Dec 2026. It lands on your Visa •• 4242 in 5 to 10 business days. The other tickets still let you in.",
        }}
        kind="partRefunded"
      />
    ),
    summary: {
      copy: {
        title: "What You Bought",
        totalLabel: "Total after refund",
        refundLabel: "Refunded",
      },
      lines: LINES,
      refund: "−HK$190.00",
      total: "HK$960.00",
    },
    points: (
      <TicketPointsRow
        copy={{
          label: "Points",
          value: "About 960",
          note: "19 points were taken back with the refunded ticket.",
        }}
        kind="about"
      />
    ),
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Partly Refunded")).toBeVisible();
    expect(canvas.getByText("−HK$190.00")).toBeVisible();
    expect(canvas.getByText("HK$960.00")).toBeVisible();
    const third = canvas.getByRole("region", { name: "Ticket 3 of 3" });
    expect(within(third).getByText("Refunded")).toBeVisible();
  },
};

const refundedSummary = {
  copy: { title: "What You Bought", totalLabel: "Refunded" },
  lines: LINES,
  total: "HK$1,150.00",
};

export const Refunded: Story = {
  name: "Fully refunded",
  args: {
    copy: { ...ORDER_COPY, status: "Refunded" },
    tone: "bad",
    tickets: [],
    banner: (
      <TicketOrderStatusBanner
        copy={{
          title: "HK$1,150.00 refunded on 3 Dec 2026",
          body: "The tickets no longer let anyone in. The money lands on your Visa •• 4242 in 5 to 10 business days.",
        }}
        kind="refunded"
      />
    ),
    summary: refundedSummary,
    points: (
      <TicketPointsRow
        copy={{
          label: "Points",
          value: "Taken back",
          note: "The points this order earned were taken back.",
        }}
        kind="takenBack"
      />
    ),
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Taken back")).toBeVisible();
    expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

export const EventCancelled: Story = {
  name: "Event cancelled",
  args: {
    copy: { ...ORDER_COPY, status: "Refunded" },
    tone: "bad",
    tickets: [],
    banner: (
      <TicketOrderStatusBanner
        copy={{
          title: "This event is canceled",
          body: "[Show Name] won’t take place. Your order is refunded in full: HK$1,150.00 lands on your Visa •• 4242 in 5 to 10 business days.",
        }}
        kind="eventCancelled"
      />
    ),
    summary: refundedSummary,
    points: undefined,
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "This event is canceled",
    );
  },
};

export const FreeOrder: Story = {
  name: "Free order",
  args: {
    copy: {
      ...ORDER_COPY,
      title: "Order TK9F4D",
      breadcrumb: { parent: "Your Tickets", current: "TK9F4D" },
      doorNote: undefined,
    },
    tickets: FREE_TICKETS,
    summary: {
      copy: { title: "What You Bought", totalLabel: "Total" },
      lines: [
        {
          key: "guest",
          label: "2 × Guest Pass, Two Days",
          detail: "Free",
          amount: "HK$0.00",
        },
      ],
      total: "Free",
    },
    points: undefined,
    footer: (
      <p className="text-sm leading-5 text-secondary-foreground">
        A free order earns no points.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="ticket-order-total"]'),
    ).toHaveTextContent("Free");
    expect(canvas.getByText("A free order earns no points.")).toBeVisible();
  },
};

/** A guest in the browser that paid, for a day: no breadcrumb, and the way
 * to see the order anywhere. */
export const GuestInBuyingBrowser: Story = {
  name: "Guest in the buying browser",
  args: {
    copy: { ...ORDER_COPY, breadcrumb: undefined },
    points: undefined,
    footer: (
      <TicketOrderStatusBanner
        act={{ label: "Sign In", onClick: fn() }}
        copy={{
          title: "See this order anywhere",
          body: `Sign in with ${EMAIL} and every order you bought with it is in Your Tickets.`,
        }}
        kind="guest"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("navigation", { name: "Breadcrumb" })).toBeNull();
    expect(
      canvas.getByRole("region", { name: "See this order anywhere" }),
    ).toBeVisible();
  },
};

/** Back from Stripe, paid: the outcome leads the tickets in the browser that
 * paid. */
export const PaidReturn: Story = {
  name: "Paid, back from Stripe",
  args: {
    lead: (
      <TicketReturnOutcome
        act={{ label: "Sign In with Email", onClick: fn() }}
        copy={{
          status: "Confirmed",
          title: "You’re Going",
          body: `Your 3 tickets are below, and we sent them to ${EMAIL} as one PDF.`,
          note: `About 115 points wait in your Grade10 account. Sign in with ${EMAIL} to add them.`,
        }}
        kind="paid"
      />
    ),
    points: undefined,
    footer: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "You’re Going" }),
    ).toBeVisible();
    expect(canvas.queryByRole("heading", { name: "Order TK7Q2M" })).toBeNull();
    expect(canvas.getByRole("region", { name: "Ticket 1 of 3" })).toBeVisible();
  },
};
