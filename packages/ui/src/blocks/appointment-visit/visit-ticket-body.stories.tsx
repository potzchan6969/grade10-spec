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
  parameters: {
    verification: { caseId: "vc_5e529102-6fcf-45e3-892b-89f96fafc551" },
  },
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
  parameters: {
    verification: { caseId: "vc_cef01cc3-bd80-4971-b76c-cc4d8ffcd2c1" },
  },
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
  parameters: {
    verification: { caseId: "vc_929d0eee-c125-44e9-a6a4-868f0ea2b0cc" },
  },
  args: { asking: true, failed: true },
};

export const Called: Story = {
  parameters: {
    verification: { caseId: "vc_d184d13a-a648-4049-a168-51cd59b6bd5d" },
  },
  args: { copy: TICKET_CALLED_COPY, tone: "ink", step: "called" },
};

/** No signal: the last place it knew, and leaving waits. */
export const Offline: Story = {
  parameters: {
    verification: { caseId: "vc_2f51f245-ecb1-40d3-988c-e27b95e0191e" },
  },
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
  parameters: {
    verification: { caseId: "vc_53e32143-ad83-4dc9-a09a-b8e72c35c149" },
  },
  args: { copy: TICKET_SEEN_COPY, tone: "ok", step: undefined, live: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Book a time" })).toHaveAttribute(
      "href",
      BOOK_HREF,
    );
  },
};
