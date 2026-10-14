import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { BookingManageCard } from "./booking-manage-card";
import {
  CANCELLED_RECORD,
  CHECKED_IN_RECORD,
  FIXTURE_BOOKING_NOW_MS,
  LIVE_RECORD,
  MANAGE_CARD_COPY,
} from "./fixtures";

const meta = {
  title: "Appointment/Booking/Blocks/BookingManageCard",
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

/** A move in flight draws busy on Move alone, and a second press does nothing. */
export const MovePending: Story = {
  args: { movePending: true },
  play: async ({ args, canvasElement }) => {
    const move = within(canvasElement).getByRole("button", {
      name: "Move the visit",
    });
    expect(move).toHaveAttribute("aria-busy", "true");
    move.click();
    expect(args.onMove).not.toHaveBeenCalled();
  },
};

/** A refused move says why on the card, and Move presses again. */
export const MoveRefused: Story = {
  args: { moveFailed: "That time was just taken. Pick another." },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "That time was just taken. Pick another.",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Move the visit" }),
    );
    expect(args.onMove).toHaveBeenCalledTimes(1);
  },
};

/** The dialog stays open and busy while the cancel runs; it closes as the result. */
export const CancelHeldUntilCancelled: Story = {
  render: function Render(args) {
    const [pending, setPending] = useState(false);
    const [record, setRecord] = useState(args.record);
    return (
      <BookingManageCard
        {...args}
        cancelPending={pending}
        onCancel={() => {
          args.onCancel();
          setPending(true);
          setTimeout(() => {
            setPending(false);
            setRecord(CANCELLED_RECORD);
          }, 800);
        }}
        record={record}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Cancel the visit" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Cancel this visit?",
    });
    const confirm = within(dialog).getByRole("button", {
      name: "Yes, cancel it",
    });
    await userEvent.click(confirm);
    await waitFor(() => expect(confirm).toHaveAttribute("aria-busy", "true"));
    expect(dialog).toBeInTheDocument();
    confirm.click();
    expect(args.onCancel).toHaveBeenCalledTimes(1);
    await waitFor(
      () =>
        expect(
          screen.queryByRole("dialog", { name: "Cancel this visit?" }),
        ).toBeNull(),
      { timeout: 3000 },
    );
  },
};

/** A refused cancel shows in the open dialog, whose confirm presses again. */
export const CancelRefused: Story = {
  args: {
    cancelPending: false,
    cancelFailed: "We couldn't cancel this visit. Try again.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We couldn't cancel this visit. Try again.",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Cancel the visit" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Cancel this visit?",
    });
    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "We couldn't cancel this visit. Try again.",
    );
    expect(canvas.queryByRole("alert")).toBeNull();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Yes, cancel it" }),
    );
    expect(args.onCancel).toHaveBeenCalledTimes(1);
    expect(dialog).toBeInTheDocument();
  },
};
