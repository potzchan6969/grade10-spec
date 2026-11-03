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
  parameters: {
    verification: { caseId: "vc_2a03fc3e-98c7-4c7c-96a0-f791dbb5b282" },
  },
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
  parameters: {
    verification: { caseId: "vc_c3cf0b65-61b6-4ab9-8942-f10c74447826" },
  },
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
  parameters: {
    verification: { caseId: "vc_1f43a238-a360-416f-be36-9623f708b72f" },
  },
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
  parameters: {
    verification: { caseId: "vc_11d331c4-2802-4d5a-a2f3-e1ffb97e71ef" },
  },
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
  parameters: {
    verification: { caseId: "vc_1c89c85f-22ab-4621-92f2-cb3df7bba3e1" },
  },
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
  parameters: {
    verification: { caseId: "vc_c9a5b9f1-dc20-4bbe-afb4-d38da33887b6" },
  },
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
  parameters: {
    verification: { caseId: "vc_f5b70c27-cdc4-4bad-8f41-c978df456833" },
  },
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
  parameters: {
    verification: { caseId: "vc_79fd6542-56f7-4afc-a4aa-ff5e6489353c" },
  },
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
  parameters: {
    verification: { caseId: "vc_215ae856-ee96-4110-aa47-0f8d18accb68" },
  },
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
  parameters: {
    verification: { caseId: "vc_f23adf39-1f6a-40e6-b6c0-7cb9c0f302ea" },
  },
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
  parameters: {
    verification: { caseId: "vc_a94b2a13-d63b-4952-8f03-87e889bb364f" },
  },
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
