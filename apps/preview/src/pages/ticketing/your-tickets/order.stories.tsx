import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BUYER, T, t } from "../ticketing-words";
import { OrderScreen } from "./order-screens";

/**
 * One order's page, the OrderPhone board: from the hold to the door, a QR
 * card per ticket, what it bought and its points. No Resend on the site;
 * the mail holds the PDF.
 */
const meta = {
  title: "Ticketing/Your Tickets/Screens/Order",
  component: OrderScreen,
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-ticketing-your-tickets-US-01",
      "grade10-site-ticketing-your-tickets-US-02",
    ],
  },
  args: { state: "confirmed" },
} satisfies Meta<typeof OrderScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const main = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole("main"));

/** Back from Stripe, paid, in the browser that paid: You're Going leads
 * the tickets. */
export const Paid: Story = {
  args: { state: "paid" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.return.paid.title }),
    ).toBeVisible();
    for (const n of [1, 2, 3])
      await expect(
        canvas.getByRole("region", {
          name: t(T.order.ticket.label, { ordinal: n, count: 3 }),
        }),
      ).toBeVisible();
  },
};

/** Confirmed and signed in: a QR card per ticket, the trail back to Your
 * Tickets, and the points earned. */
export const Confirmed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: t(T.order.title, { reference: BUYER.reference }),
      }),
    ).toBeVisible();
    const trail = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      within(trail).getByRole("link", { name: T.order.breadcrumb }),
    ).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /Resend/ })).toBeNull();
  },
};

/** Held, counting down: no codes until it is paid. */
export const Held: Story = {
  name: "Held, counting down",
  args: { state: "held" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(canvas.getByText(T.order.held.heldFor)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.order.held.continue }),
    ).toBeVisible();
    await expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

/** The hold reached zero: the payment is being checked. */
export const Checking: Story = {
  args: { state: "checking" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.order.checking.body),
    ).toBeVisible();
  },
};

/** After the first day: each ticket says when it was used and what is
 * left; one is in today. */
export const AfterDayOne: Story = {
  name: "After day 1",
  args: { state: "afterDayOne" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getAllByText(t(T.order.status.daysLeft, { count: 1 }))
        .length,
    ).toBeGreaterThan(0);
  },
};

/** One ticket refunded: its code fades, the others still admit. */
export const OneTicketRefunded: Story = {
  name: "One ticket refunded",
  args: { state: "partRefunded" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByText(t(T.order.partRefund.title, { amount: "HK$190.00" })),
    ).toBeVisible();
    await expect(
      canvas.getByText(t(T.order.ticket.refundedNote, { date: "2 Dec 2026" })),
    ).toBeVisible();
  },
};

/** Every ticket refunded, and the points taken back. */
export const FullyRefunded: Story = {
  name: "Fully refunded",
  args: { state: "refunded" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.order.points.allTakenBack),
    ).toBeVisible();
  },
};

/** The event was cancelled: the order is refunded in full. */
export const EventCancelled: Story = {
  name: "Event cancelled",
  args: { state: "eventCancelled" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.order.eventCancelled.title),
    ).toBeVisible();
  },
};

/** A free order: Free, and no points. */
export const FreeOrder: Story = {
  name: "Free order",
  args: { state: "free" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.order.points.free),
    ).toBeVisible();
  },
};

/** A guest in the browser that bought: sign in to see it anywhere. */
export const Guest: Story = {
  name: "Guest in the buying browser",
  args: { state: "guest" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(canvas.getByText(T.order.guest.title)).toBeVisible();
    await expect(
      canvas.queryByRole("navigation", { name: "Breadcrumb" }),
    ).not.toBeInTheDocument();
  },
};

/** Offered by the waiting line: how many, until when, Accept and Decline;
 * no codes until it is paid. */
export const Offered: Story = {
  args: { state: "offered" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(canvas.getByText(T.order.status.offered)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.event.waitingLine.offer.accept }),
    ).toBeVisible();
    await expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};
