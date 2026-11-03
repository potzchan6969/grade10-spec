import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  TICKET_USED_TODAY,
  TICKETS,
  TICKETS_AFTER_DAY_ONE,
  TICKETS_PART_REFUNDED,
} from "./fixtures";
import { TicketQrCard } from "./ticket-qr-card";

const strip = <T extends { key: string }>({ key: _key, ...rest }: T) => rest;

/** One ticket as the door reads it, at 390 px: its QR code, the reference
 * large, its entries left and Fast Pass days left. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketQrCard",
  component: TicketQrCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px] bg-background px-4 py-5">
        <Story />
      </div>
    ),
  ],
  args: strip(TICKETS[0]),
} satisfies Meta<typeof TicketQrCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Valid: Story = {
  parameters: {
    verification: { caseId: "vc_7d0407a7-e1e0-4b0b-8c3c-cba67dbe271c" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("region", { name: "Ticket 1 of 3" });
    expect(within(card).getByText("Valid")).toBeVisible();
    expect(
      within(card).getByRole("img", { name: "Ticket code TK7Q2M-1" }),
    ).toBeVisible();
    expect(within(card).getByText("TK7Q2M")).toBeVisible();
    expect(within(card).getByText("Fast Pass on 2 days")).toBeVisible();
  },
};

/** After day 1: the day it was used, the days and Fast Pass days left. */
export const DaysLeft: Story = {
  parameters: {
    verification: { caseId: "vc_bec2f559-a4c4-4fd6-b0b1-4d2a0942c824" },
  },
  name: "Days left",
  args: strip(TICKETS_AFTER_DAY_ONE[0]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1 Day Left")).toBeVisible();
    expect(
      canvas.getByText("Used Sat 12 Dec, 10:14. 1 day left"),
    ).toBeVisible();
    expect(canvas.getByText("Fast Pass on 1 day left")).toBeVisible();
  },
};

/** In today: the time it came in, the code still shown for the next day. */
export const UsedToday: Story = {
  parameters: {
    verification: { caseId: "vc_8f835607-8bb0-4c66-a4e8-a7c0173f1e08" },
  },
  name: "Used today",
  args: strip(TICKET_USED_TODAY),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      "In Sat 12 Dec, 10:42. See you Sunday.",
    );
    expect(
      canvas.getByRole("img", { name: "Ticket code TK7Q2M-1" }),
    ).toBeVisible();
  },
};

/** Refunded or cancelled: the code faded, the door refuses it. */
export const Refunded: Story = {
  parameters: {
    verification: { caseId: "vc_9022bbb4-dbc4-499e-970e-abd9e2a76109" },
  },
  args: strip(TICKETS_PART_REFUNDED[2]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(
      canvas.getByText(
        "Refunded on 2 Dec 2026. This code no longer lets anyone in.",
      ),
    ).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="ticket-qr-card"]'),
    ).toHaveAttribute("data-state", "void");
  },
};
