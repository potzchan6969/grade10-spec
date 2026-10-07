import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { BookingManageCard } from "./booking-manage-card";
import {
  CANCELLED_RECORD,
  CHECKED_IN_RECORD,
  FIXTURE_BOOKING_NOW_MS,
  LIVE_RECORD,
  MANAGE_CARD_COPY,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingManageCard",
  component: BookingManageCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MANAGE_CARD_COPY,
    record: LIVE_RECORD,
    now: FIXTURE_BOOKING_NOW_MS,
    onMove: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof BookingManageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A cancel is reported once, and only after the dialog confirms it. */
export const Live: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="booking-manage-card"]'),
    ).not.toBeNull();
    expect(canvas.getByText("Grading Submission")).toBeVisible();
    expect(canvas.getByText("Hong Kong Grade10 Store")).toBeVisible();
    expect(
      canvas.getByText("13 Pak Sha Road, Causeway Bay, Hong Kong"),
    ).toBeVisible();
    expect(canvas.getByText(/3 Sep 2026/)).toBeVisible();

    await userEvent.click(
      canvas.getByRole("button", { name: "Move the visit" }),
    );
    expect(args.onMove).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Cancel the visit" }),
    );
    expect(args.onCancel).not.toHaveBeenCalled();
    const dialog = await screen.findByRole("dialog", {
      name: "Cancel this visit?",
    });
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Yes, cancel it" }),
    );
    expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

export const Closed: Story = {
  args: { record: CANCELLED_RECORD },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cancelled")).toBeInTheDocument();
    expect(canvasElement.querySelector('[data-slot="card-footer"]')).toBeNull();
    expect(canvas.queryByRole("button", { name: "Move the visit" })).toBeNull();
    expect(
      canvas.queryByRole("button", { name: "Cancel the visit" }),
    ).toBeNull();
  },
};

/** Marked in: the state shows, and neither a move nor a cancel is offered. */
export const CheckedIn: Story = {
  args: { record: CHECKED_IN_RECORD },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Checked in")).toBeInTheDocument();
    expect(canvasElement.querySelector('[data-slot="card-footer"]')).toBeNull();
  },
};

/** Still booked but past its end: nothing to move or cancel any more. */
export const Ended: Story = {
  args: { now: LIVE_RECORD.end },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Booked")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Move the visit" })).toBeNull();
    expect(
      canvas.queryByRole("button", { name: "Cancel the visit" }),
    ).toBeNull();
  },
};

export const WithError: Story = {
  args: { error: "That time was just taken. Pick another." },
};
