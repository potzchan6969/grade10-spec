import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  BOOK_HREF,
  TICKET_CALLED_COPY,
  TICKET_FACTS,
  TICKET_OFFLINE_COPY,
  TICKET_RECONNECTING_COPY,
  TICKET_SEEN_COPY,
  TICKET_WAITING_COPY,
} from "./fixtures";
import { VisitTicketBody } from "./visit-ticket-body";

const meta = {
  title: "Appointment/Visit/Blocks/VisitTicketBody",
  component: VisitTicketBody,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: TICKET_WAITING_COPY,
    tone: "plain",
    ticket: "W-014",
    step: "waiting",
    facts: TICKET_FACTS,
    live: true,
    offline: false,
    asking: false,
    pending: false,
    failed: false,
    bookHref: BOOK_HREF,
    onAsk: fn(),
    onKeep: fn(),
    onLeave: fn(),
  },
} satisfies Meta<typeof VisitTicketBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In line: the place, the estimate and the steps; Leave the line asks first. */
export const Waiting: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("W-014")).toBeVisible();
    expect(canvas.getByText("3rd in line")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Leave the line" }),
    );
    expect(args.onAsk).toHaveBeenCalledTimes(1);
  },
};

export const Asking: Story = {
  args: { asking: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("region", { name: "Leave the line?" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Keep my place" })).toBeVisible();
  },
};

export const LeaveFailed: Story = {
  args: { asking: true, failed: true },
};

export const Called: Story = {
  args: { copy: TICKET_CALLED_COPY, tone: "ink", step: "called" },
};

/** No signal: the last place it knew, and leaving waits. */
export const Offline: Story = {
  args: {
    copy: TICKET_OFFLINE_COPY,
    offline: true,
    reconnecting: {
      copy: TICKET_RECONNECTING_COPY,
      busy: false,
      onRetry: fn(),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Leave the line" }),
    ).toBeDisabled();
  },
};

/** Ended: no steps, no leaving, Book a time. */
export const Seen: Story = {
  args: { copy: TICKET_SEEN_COPY, tone: "ok", step: undefined, live: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Book a time" })).toHaveAttribute(
      "href",
      BOOK_HREF,
    );
  },
};
